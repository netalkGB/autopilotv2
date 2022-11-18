import { historyGetController } from './controller/HistoryGetController'
import { scheduleDeleteController } from './controller/ScheduleDeleteController'
import { scheduleGetController } from './controller/ScheduleGetController'
import { schedulePostController } from './controller/SchedulePostController'
import { schedulePutController } from './controller/SchedulePutController'
import { discordConfigGetController } from './controller/DiscordConfigGetController'
import { discordConfigPutController } from './controller/DiscordConfigPutController'
import { discordConfigDeleteController } from './controller/DiscordConfigDeleteController'
import { indexPageGetController } from './controller/IndexPageGetController'
import { loginPageGetController } from './controller/LoginPageGetController'
import { loginPagePostController } from './controller/LoginPagePostController'
import { otpCheckGetController } from './controller/OtpCheckGetController'
import { otpCheckPostController } from './controller/OtpCheckPostController'
import { loginReleaseGetController } from './controller/LoginReleaseGetController'
import { authorizePageGetController } from './controller/AuthorizePageGetController'
import { approvePagePostController } from './controller/ApprovePagePostController'
import { tokenPostController } from './controller/TokenPostController'
import { oAuth2Protection } from './controller/OAuth2Protection'

export const appRoutes = [
  {
    path: '/',
    method: 'get',
    controller: indexPageGetController
  },
  {
    path: '/login',
    method: 'get',
    controller: loginPageGetController
  },
  {
    path: '/login',
    method: 'post',
    controller: loginPagePostController
  },
  {
    path: '/logout',
    method: 'get',
    controller: loginReleaseGetController
  },
  {
    path: '/otpcheck',
    method: 'get',
    controller: otpCheckGetController
  },
  {
    path: '/otpcheck',
    method: 'post',
    controller: otpCheckPostController
  },
  {
    path: '/authorize',
    method: 'get',
    controller: authorizePageGetController
  },
  {
    path: '/approve',
    method: 'post',
    controller: approvePagePostController
  },
  {
    path: '/token',
    method: 'post',
    controller: tokenPostController
  },
  {
    path: '/schedule',
    method: 'get',
    preProcess: oAuth2Protection,
    controller: scheduleGetController
  },
  {
    path: '/schedule',
    method: 'post',
    preProcess: oAuth2Protection,
    controller: schedulePostController
  },
  {
    path: '/schedule',
    method: 'delete',
    preProcess: oAuth2Protection,
    controller: scheduleDeleteController
  },
  {
    path: '/schedule',
    method: 'put',
    preProcess: oAuth2Protection,
    controller: schedulePutController
  },
  {
    path: '/history',
    method: 'get',
    preProcess: oAuth2Protection,
    controller: historyGetController
  },
  {
    path: '/config/discord',
    method: 'get',
    preProcess: oAuth2Protection,
    controller: discordConfigGetController
  },
  {
    path: '/config/discord',
    method: 'put',
    preProcess: oAuth2Protection,
    controller: discordConfigPutController
  },
  {
    path: '/config/discord',
    method: 'delete',
    preProcess: oAuth2Protection,
    controller: discordConfigDeleteController
  }
]
