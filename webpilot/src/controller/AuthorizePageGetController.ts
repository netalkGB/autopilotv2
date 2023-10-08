import { Request, Response } from 'express'
import { AppDataSource } from '../AppDataSource'
import log4js from 'log4js'
import { ClientServiceImpl } from '../service/auth/ClientServiceImpl'
import { AppUtils } from '../utils/AppUtils'

const logger = log4js.getLogger('app')

type AuthorizeParams = {
  // eslint-disable-next-line camelcase
  response_type: string,
  scope: string,
  // eslint-disable-next-line camelcase
  client_id: string,
  // eslint-disable-next-line camelcase
  redirect_uri: string,
  state: string,
  // eslint-disable-next-line camelcase
  code_challenge_method: string,
  // eslint-disable-next-line camelcase
  code_challenge: string,
  nonce?: string
}

export const authorizePageGetController = async (request: Request, response: Response) => {
  logger.info('start authorizePageGetController')
  const responseType = request.query.response_type as string
  const scope = request.query.scope as string
  const clientId = request.query.client_id as string
  const redirectUri = request.query.redirect_uri as string
  const state = request.query.state as string
  const codeChallengeMethod = request.query.code_challenge_method as string
  const codeChallenge = request.query.code_challenge as string
  const nonce = request.query.nonce as string

  // パラメータに不足があればエラー nonceはOPTIONAL
  if (responseType === undefined || scope === undefined || clientId === undefined || redirectUri === undefined || state === undefined || codeChallenge === undefined || codeChallengeMethod === undefined) {
    response.send('error').status(400).end()
    return
  }

  logger.info('request.session?.userId:' + request.session?.userId)

  if (!request.session?.userId) {
    const to = createAuthorizeUrl(responseType, scope, clientId, redirectUri, state, codeChallengeMethod, codeChallenge, nonce)
    response.redirect('/login?' + new URLSearchParams({ to }).toString())
    return
  }

  const clientService = new ClientServiceImpl(AppDataSource.getInstance())

  const client = await clientService.getClientByClientId(clientId)
  if (!client) {
    logger.info('Unknown client: clientId=' + clientId)
    response.send('Unknown client.').status(400).end()
    return
  }

  if (client.redirectUri !== redirectUri) {
    logger.warn(`Invalid redirect_uri: redirectUri=${redirectUri}, client.redirectUri=${client.redirectUri}`)
    response.send('Invalid redirect_uri.').send(400).end()
    return
  }

  const dbScope = client.scope.split(' ').sort().join(' ')
  const requestScope = scope.split(' ').sort().join(' ')
  if (dbScope !== requestScope) {
    const params = new URLSearchParams({
      error: 'invalid_scope'
    })
    response.redirect(`${redirectUri}?${params.toString()}`)
    return
  }

  // エラーないならとんできたパラメータをセッションに保存
  request.session.authorizeInfo = {
    responseType,
    scope,
    clientId,
    redirectUri,
    state,
    codeChallengeMethod,
    codeChallenge,
    nonce
  }

  const csrfToken = AppUtils.generateUUID()
  request.session.csrfToken = csrfToken

  const authorizeUrl = createAuthorizeUrl(responseType, scope, clientId, redirectUri, state, codeChallengeMethod, codeChallenge, nonce)
  const logoutUrl = '/logout?' + new URLSearchParams({ to: authorizeUrl }).toString()

  response.render('authorize', { data: { csrfToken, scope, logoutUrl, username: request.session.userId } })
  logger.info('end authorizePageGetController')
}

function createAuthorizeUrl (responseType: string, scope: string, clientId: string, redirectUri: string, state: string, codeChallengeMethod: string, codeChallenge: string, nonce: string) {
  let authorizeParams: AuthorizeParams = {
    response_type: responseType,
    scope: scope,
    client_id: clientId,
    redirect_uri: redirectUri,
    state: state,
    code_challenge_method: codeChallengeMethod,
    code_challenge: codeChallenge
  }
  if (nonce) {
    authorizeParams = {
      ...authorizeParams,
      nonce
    }
  }
  return '/authorize?' + new URLSearchParams(authorizeParams).toString()
}
