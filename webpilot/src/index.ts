import { AppDataSource } from './AppDataSource'
import { appRoutes } from './routes'
import express, { NextFunction, Request, Response } from 'express'
import session from 'express-session'
import ejs from 'ejs'
import schedule from 'node-schedule'
import log4js from 'log4js'
import { ServerConfig } from './ServerConfig'
import config from '../config.json'
import { ConfigServiceImpl } from './service/ConfigServiceImpl'
import { AutoPilotServiceImpl } from './service/AutoPilotServiceImpl'
import { ScheduleServiceImpl } from './service/ScheduleServiceImpl'
import { PilotServiceImpl } from './service/PilotServiceImpl'
import { RSSServiceImpl } from './service/RSSServiceImpl'
import { NotificationServiceImpl } from './service/NotificationServiceImpl'

declare module 'express-session' {
  // eslint-disable-next-line no-unused-vars
  interface Session {
    username: string,
    csrfToken: string,
    authorizeInfo: {
      responseType: string,
      scope : string,
      clientId : string,
      redirectUri : string,
      state: string,
      codeChallengeMethod: string,
      codeChallenge: string,
      nonce: string
    }
  }
}

const logger = log4js.getLogger('app')
logger.level = 'all'

main()

async function main () {
  ServerConfig.port = config?.port
  ServerConfig.proxyUrl = config?.proxyUrl

  const port = ServerConfig?.port

  try {
    await AppDataSource.initialize()
    const app = express()
    app.use(express.json())
    app.use((err: any, req: Request, res: Response, next: NextFunction) => {
      if (err instanceof SyntaxError && 'body' in err) {
        logger.error('json format error', err)
        return res.status(400).send('json format error') // Bad request
      }
      next()
    })
    app.use(session({
      secret: '(＾▽＾／)',
      resave: false,
      saveUninitialized: false,
      cookie: {
        httpOnly: true,
        secure: false,
        maxAge: 1000 * 60 * 30
      }
    }))
    app.set('view engine', 'ejs')
    app.set('views', './out/views') // webpack使わず動かすなら見直す
    // @ts-ignore
    app.engine('ejs', ejs.__express) // webpack使わず動かすなら見直す
    app.use(express.urlencoded({ extended: true }))
    appRoutes.forEach(route => {
      // @ts-ignore
      app[route.method](route.path, (request: Request, response: Response, next: Function) => {
        route.controller(request, response)
          .then(() => next)
          .catch((err: any) => next(err))
      })
    })

    const autopilotService =
      new AutoPilotServiceImpl(logger,
        new ScheduleServiceImpl(AppDataSource),
        new PilotServiceImpl(AppDataSource),
        new RSSServiceImpl(ServerConfig.proxyUrl),
        new NotificationServiceImpl(new ConfigServiceImpl(AppDataSource)))

    const everyxx0030 = '0,30 */1 * * *' // every 30minutes and 1hour
    schedule.scheduleJob(everyxx0030, async () => {
      try {
        logger.info('start autopilot.')

        logger.info('start every 30minutes task.')
        await autopilotService.pilot('every30minutes')
        logger.info('end every 30minutes task.')

        const date = new Date()
        if (date.getUTCMinutes() >= 0 && date.getUTCMinutes() < 30) {
          logger.info('start every 1hour task.')
          await autopilotService.pilot('every1hour')
          logger.info('end every 1hour task.')
        }
        logger.info('end autopilot.')
      } catch (e) {
        logger.error(e)
        logger.info('!end autopilot.')
      }
    })

    app.listen(port)
  } catch (e) {
    logger.error('!error', e)
  }
}
