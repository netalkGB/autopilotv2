import { Request, Response } from 'express'
import { AppDataSource } from '../AppDataSource'
import log4js from 'log4js'
import { ClientServiceImpl } from '../service/auth/ClientServiceImpl'
import { RefreshTokenServiceImpl } from '../service/auth/RefreshTokenServiceImpl'
import { AccessTokenServiceImpl } from '../service/auth/AccessTokenServiceImpl'

const logger = log4js.getLogger('app')

export const revokePostController = async (request: Request, response: Response) => {
  logger.info('start revokePostController')
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

  const clientService = new ClientServiceImpl(AppDataSource)

  const client = await clientService.getClientByClientId(clientId)
  logger.info(`client: ${JSON.stringify(client)}`)
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

  const token = request.body.token
  // ここでアクセストークンの削除を行う
  const accessTokenService = new AccessTokenServiceImpl()
  const refreshTokenService = new RefreshTokenServiceImpl(AppDataSource, accessTokenService)

  await refreshTokenService.deleteRefreshTokenByAccessToken(token)
  await accessTokenService.deleteAccessToken(token)

  response.status(204).send()
  logger.info('end revokePostController')
}
