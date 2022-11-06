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
    path: '/schedule',
    method: 'get',
    controller: scheduleGetController
  },
  {
    path: '/schedule',
    method: 'post',
    controller: schedulePostController
  },
  {
    path: '/schedule',
    method: 'delete',
    controller: scheduleDeleteController
  },
  {
    path: '/schedule',
    method: 'put',
    controller: schedulePutController
  },
  {
    path: '/history',
    method: 'get',
    controller: historyGetController
  },
  {
    path: '/config/discord',
    method: 'get',
    controller: discordConfigGetController
  },
  {
    path: '/config/discord',
    method: 'put',
    controller: discordConfigPutController
  },
  {
    path: '/config/discord',
    method: 'delete',
    controller: discordConfigDeleteController
  }
]
