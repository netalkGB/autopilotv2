import { Request, Response } from 'express'
import log4js from 'log4js'
import { AppDataSource } from '../AppDataSource'
import { AppUtils } from '../utils/AppUtils'
import { ClientServiceImpl } from '../service/auth/ClientServiceImpl'
import { CodeServiceImpl } from '../service/auth/CodeServiceImpl'

const logger = log4js.getLogger('app')

export const approvePagePostController = async (request: Request, response: Response) => {
  logger.info('start approvePagePostController')
  const approve = request.body.approve
  const csrfToken = request.body.csrfToken

  // authorizeInfoが削除されているならエラー
  if (request.session.authorizeInfo === undefined) {
    response.send('A problem was encountered in authorization.').status(400).end()
    return
  }

  // authorizeInfo退避し、セッションからは削除
  const authorizeInfo = request.session.authorizeInfo
  request.session.authorizeInfo = undefined

  // csrfトークンが違うならエラー
  if (csrfToken !== request.session.csrfToken) {
    response.send('A problem was encountered in authorization!').status(400).end()
    return
  }
  if (approve !== 'yes') {
    const params = new URLSearchParams({
      error: 'access_denied'
    })
    response.redirect(`${authorizeInfo.redirectUri}?${params.toString()}`)
    return
  }

  if (authorizeInfo.responseType !== 'code') {
    const params = new URLSearchParams({
      error: 'unsupported_response_type'
    })
    response.redirect(`${authorizeInfo.redirectUri}?${params.toString()}`)
    return
  }

  const clientService = new ClientServiceImpl(AppDataSource)
  const client = await clientService.getClientByClientId(authorizeInfo.clientId)
  const dbScope = client?.scope.split(' ').sort().join(' ')
  const requestScope = authorizeInfo.scope.split(' ').sort().join(' ')
  if (dbScope !== requestScope) {
    const params = new URLSearchParams({
      error: 'invalid_scope'
    })
    response.redirect(`${authorizeInfo.redirectUri}?${params.toString()}`)
    return
  }

  // リダイレクトする
  const code = AppUtils.generateApproveCode()

  const codeService = new CodeServiceImpl(AppDataSource)

  // TMP_CODEにCODEとCLIENT_ID,username,scope,codeChallengeMethod, codeChallengeを保存する
  await codeService.insertCode(code, authorizeInfo.clientId, request.session.userId, authorizeInfo.scope, authorizeInfo.codeChallengeMethod, authorizeInfo.codeChallenge, authorizeInfo.nonce, new Date())

  const redirectParams = new URLSearchParams()
  redirectParams.set('state', authorizeInfo.state)
  redirectParams.set('code', code)
  const redirectTo = `${authorizeInfo.redirectUri}?${redirectParams.toString()}`
  response.redirect(302, redirectTo)

  logger.info('end approvePagePostController')
}
