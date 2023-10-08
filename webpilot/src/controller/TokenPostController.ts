import { Request, Response } from 'express'
import { AppDataSource } from '../AppDataSource'
import log4js from 'log4js'
import jose from 'jsrsasign'
import { AppUtils } from '../utils/AppUtils'
import { ClientServiceImpl } from '../service/auth/ClientServiceImpl'
import { CodeServiceImpl } from '../service/auth/CodeServiceImpl'
import { AccessTokenServiceImpl } from '../service/auth/AccessTokenServiceImpl'
import { RefreshTokenServiceImpl } from '../service/auth/RefreshTokenServiceImpl'
import { ServerConfig } from '../ServerConfig'
import { UserInfoServiceImpl } from '../service/auth/UserInfoServiceImpl'

const logger = log4js.getLogger('app')

export const tokenPostController = async (request: Request, response: Response) => {
  logger.info('start tokenPostController')
  const clientService = new ClientServiceImpl(AppDataSource.getInstance())
  const codeService = new CodeServiceImpl()
  const accessTokenService = new AccessTokenServiceImpl()
  const refreshTokenService = new RefreshTokenServiceImpl(AppDataSource.getInstance(), accessTokenService)
  const userInfoService = new UserInfoServiceImpl(AppDataSource.getInstance())

  // AuthorizationヘッダーからBASE64エンコードされたクライアントIDとクライアントシークレットを取得する
  const authorization = request.headers.authorization
  let clientId
  let clientSecret
  // ボディかAuthorizationヘッダーからクライアントIDとクライアントシークレットを取り出す
  if (authorization && authorization.split(' ')[0].toLowerCase() === 'basic') {
    // BASE64デコードする
    const decoded = Buffer.from(authorization.split(' ')[1], 'base64').toString()
    const splitted = decoded.split(':')
    // クライアントIDとクライアントシークレットを取り出す
    clientId = splitted[0]
    clientSecret = splitted[1]
  }
  if (request.body.client_id) {
    if (clientId) {
      response.send({ error: 'invalid_client' }).status(401)
      return
    }
    clientId = request.body.client_id
    clientSecret = request.body.client_secret
  }

  const client = await clientService.getClientByClientId(clientId)
  // クライアントIDで検索して見つからないならエラー
  if (!client) {
    logger.info('Invalid client.')
    response.send({ error: 'invalid_client' }).status(401)
    return
  }
  // クライアントシークレットが一致しないならもうエラー ただし、パブリッククライアントのときはバイパスする
  if (!client.isPublic && client.clientSecret !== clientSecret) {
    logger.info('Invalid client.')
    response.send({ error: 'invalid_client' }).status(401)
    return
  }

  // トークンの有効期限(秒)
  const expireInS = ServerConfig.accessTokenExpireInS
  // パラメータのgrant_typeがauthorization_codeのとき
  if (request.body.grant_type === 'authorization_code') {
    // TMP_CODEからパラメータのcodeで検索して取得する
    const code = await codeService.fetchCode(request.body.code)
    // TMP_CODEから取得したcodeで削除
    await codeService.deleteCode(request.body.code)

    // codeが取得できない(expire来てる場合も含む)ならエラー
    if (!code) {
      logger.info('Invalid code.')
      response.status(400).send({ error: 'invalid_grant' })
      return
    }

    // TMP_CODE.CLIENT_IDとclientIdが一致しない場合エラー
    if (code.clientId !== clientId) {
      response.status(400).send({ error: 'invalid_grant' })
      return
    }

    let codeChallenge
    // codeChallengeMethodがplainでもS256でもないならエラー
    if (code.codeChallengeMethod === 'plain') {
      codeChallenge = request.body.code_verifier
    } else if (code.codeChallengeMethod.toLowerCase() === 's256') { // 多分大文字小文字の区別ない
      codeChallenge = AppUtils.generateS256CodeChallenge(request.body.code_verifier)
    } else {
      response.send({ error: 'invalid_request' }).status(400)
      return
    }
    // codeChallengeが一致しないならエラー
    if (code.codeChallenge !== codeChallenge) {
      response.send({ error: 'invalid_request' }).status(400)
      return
    }

    // リダイレクトURIをチェックする
    if (client.redirectUri !== request.body.redirect_uri) {
      response.status(400).send('Invalid grant.')
      return
    }

    // アクセストークン生成
    const accessToken = AppUtils.generateBearerToken()
    // リフレッシュトークン生成
    const refreshToken = AppUtils.generateBearerToken()

    // ここでアクセストークンをTMP_ACCESSテーブルにINSERTする
    await accessTokenService.insertAccessToken(accessToken, code.userId, clientId, code.scope, refreshToken, expireInS)
    // ここでリフレッシュトークンをTMP_REFRESH_TOKENテーブルにINSERTする
    await refreshTokenService.insertRefreshToken(refreshToken, clientId, code.userId, code.scope)

    // eslint-disable-next-line camelcase
    const oidcExtResponse: {id_token?: string} = {} // openid connect拡張
    if (code.scope.split(' ').includes('openid')) {
      const serverRsaKey = ServerConfig.serverRsaKey
      const serverAddress = ServerConfig.serverAddress
      const idTokenExpireInS = ServerConfig.idTokenExpireInS
      const header = { typ: 'JWT', alg: serverRsaKey.alg, kid: serverRsaKey.kid }
      const user = await userInfoService.fetchUserInfo(code.userId)
      const now = Date.now()
      const ipayload = {
        iss: serverAddress, // トークンの発行者(ISSuer) （認可サーバー）
        sub: user?.sub, // トークンの対象者(SUBuject)
        aud: client.clientId, // トークンの受け手(AUDience)
        iat: Math.floor(now / 1000), // トークンの発行時タイムスタンプ (Issued-AT)
        exp: Math.floor(now / 1000) + idTokenExpireInS // トークンの有効期限 (EXPiration time)
      } as {
        iss: string,
        sub: string,
        aud: string,
        iat: number,
        exp: number,
        nonce?: string
      }
      if (code.nonce) {
        ipayload.nonce = code.nonce
      }
      const privateKey = jose.KEYUTIL.getKey(serverRsaKey)
      // @ts-ignore
      oidcExtResponse.id_token = jose.jws.JWS.sign(header.alg, JSON.stringify(header), JSON.stringify(ipayload), privateKey) // FIXME: 型定義ファイルによるとjose.jwsはないらしいがどうするか
    }
    // トークンを返す
    response.status(200).send({
      token_type: 'Bearer',
      expires_in: expireInS,
      access_token: accessToken,
      scope: code.scope,
      refresh_token: refreshToken,
      ...oidcExtResponse
    })
  } else if (request.body.grant_type === 'refresh_token') {
    const refreshToken = request.body.refresh_token
    const token = await refreshTokenService.fetchRefreshToken(refreshToken)
    if (token) {
      // クライアントIDが一致しないときはエラーとしてリフレッシュトークンを削除
      if (token.clientId !== clientId) {
        await refreshTokenService.deleteRefreshToken(clientId)
        response.status(400).send({ error: 'invalid_grant' })
        return
      }

      // アクセストークンを再生成する
      const accessToken = AppUtils.generateBearerToken()
      await accessTokenService.insertAccessToken(accessToken, token.userId, clientId, token.scope, token.refreshToken, expireInS)

      response.status(200).send({
        token_type: 'Bearer',
        expires_in: expireInS,
        access_token: accessToken,
        scope: token.scope,
        refresh_token: token.refreshToken
      })
    } else {
      response.status(400).send({ error: 'invalid_grant' })
    }
  } else {
    response.status(400).send({ error: 'unsupported_grant_type' })
  }
  logger.info('end tokenPostController')
}
