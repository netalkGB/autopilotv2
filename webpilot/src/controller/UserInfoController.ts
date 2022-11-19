import { Request, Response } from 'express'
import log4js from 'log4js'
import { AppDataSource } from '../AppDataSource'
import { UserInfoServiceImpl } from '../service/auth/UserInfoServiceImpl'
import { UserInfoResponse } from '../model/UserInfoResponse'

const logger = log4js.getLogger('app')

export const userInfoController = async (req: Request, res: Response) => {
  logger.info('start tokenPostController')
  const accessToken = req.token

  if (!accessToken.scope.includes('openid')) {
    res.send().status(403)
    return
  }

  const userInfoService = new UserInfoServiceImpl(AppDataSource)
  const userInfo = await userInfoService.fetchUserInfo(accessToken.userId)

  if (!userInfo) {
    res.send().status(404)
    return
  }

  const fetchedUserInfo: UserInfoResponse = {
    user_id: userInfo.userId,
    sub: userInfo.sub,
    preferred_username: userInfo.preferredUsername,
    name: userInfo.name,
    email: userInfo.email,
    email_verified: userInfo.emailVerified,
    created: userInfo.created
  }

  const response: UserInfoResponse = {}

  const openidScopeExposeItem = ['sub']
  const profileScopeExposeItem = ['name', 'family_name', 'given_name', 'middle_name', 'nickname', 'preferred_username', 'profile', 'picture', 'website', 'gender', 'birthdate', 'zoneinfo', 'locale', 'updated_at']
  const emailScopeExposeItem = ['email', 'email_verified']
  const addressScopeExposeItem = ['address']
  const phoneScopeExposeItem = ['phone_number', 'phone_number_verified']
  accessToken.scope.forEach(scope => {
    if (scope === 'openid') {
      openidScopeExposeItem.forEach(claim => {
        // @ts-ignore
        if (fetchedUserInfo[claim]) {
          // @ts-ignore
          response[claim] = fetchedUserInfo[claim]
        }
      })
    } else if (scope === 'profile') {
      profileScopeExposeItem.forEach(claim => {
        // @ts-ignore
        if (fetchedUserInfo[claim]) {
          // @ts-ignore
          response[claim] = fetchedUserInfo[claim]
        }
      })
    } else if (scope === 'email') {
      emailScopeExposeItem.forEach(claim => {
        // @ts-ignore
        if (fetchedUserInfo[claim]) {
          // @ts-ignore
          response[claim] = fetchedUserInfo[claim]
        }
      })
    } else if (scope === 'address') {
      addressScopeExposeItem.forEach(claim => {
        // @ts-ignore
        if (fetchedUserInfo[claim]) {
          // @ts-ignore
          response[claim] = fetchedUserInfo[claim]
        }
      })
    } else if (scope === 'phone') {
      phoneScopeExposeItem.forEach(claim => {
        // @ts-ignore
        if (fetchedUserInfo[claim]) {
          // @ts-ignore
          response[claim] = fetchedUserInfo[claim]
        }
      })
    }
  })

  res.send(response).status(200)
  logger.info('end tokenPostController')
}
