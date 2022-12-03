import { AccessTokenServiceImpl } from '../service/auth/AccessTokenServiceImpl'
import { Request, Response } from 'express'

export async function oAuth2Protection (request: Request, response: Response, next: Function) {
  // AuthorizationヘッダーからBearer tokenを取得する
  const authorization = request.headers.authorization
  let bearerToken
  // 取得できないならエラー
  // Bearerトークン(Bearerトークンではない)をデータストアからひろう
  if (authorization !== undefined && authorization.toLowerCase().indexOf('bearer') === 0) {
    bearerToken = authorization.split(' ')[1]
  } else if (request.query && request.query.access_token) { // POSTの場合はreq.body && req.body.access_tokenで良いと思う
    bearerToken = request.query.access_token
  } else if (request.body && request.body.access_token) {
    bearerToken = request.body.access_token
  } else {
    response.send('error').status(401).end()
    return
  }

  const accessTokenService = new AccessTokenServiceImpl()
  const dbToken = await accessTokenService.fetchAccessTokenByToken(bearerToken)
  if (!dbToken) {
    response.send({ error: 'invalid_request' }).status(400)
    return
  }

  // expireみてすぎてたらエラーにする
  const tokenCreated = new Date(dbToken.created)
  const tokenDeadline = tokenCreated.setSeconds(tokenCreated.getSeconds() + dbToken.expireInS)
  if ((tokenDeadline - Date.now()) <= 0) {
    response.send({ error: 'invalid_request' }).status(400)
    return
  }

  request.token = {
    accessToken: dbToken.accessToken,
    userId: dbToken.userId,
    clientId: dbToken.clientId,
    scope: dbToken.scope.split(' '), // スペース区切りで配列にする
    refreshToken: dbToken.refreshToken,
    expireInS: dbToken.expireInS,
    created: dbToken.created
  }
  next()
}
