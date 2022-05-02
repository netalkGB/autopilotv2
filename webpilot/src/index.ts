import { AppDataSource } from './AppDataSource'
import { appRoutes } from './routes'
import express, { Request, Response, NextFunction } from 'express'
import schedule from 'node-schedule'
import log4js from 'log4js'
import { ServerConfig } from './ServerConfig'
import { AutoPilotService } from './service/AutoPilotService'
import { ScheduleService } from './service/ScheduleService'
import { PilotService } from './service/PilotService'
import { RSSService } from './service/RSSService'
import { ConfigService } from './service/ConfigService'
import { NotificationService } from './service/NotificationService'
import config from '../config.json'

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
    app.use((err: any, req:Request, res:Response, next: NextFunction) => {
      if (err instanceof SyntaxError && 'body' in err) {
        logger.error('json format error', err)
        return res.status(400).send('json format error') // Bad request
      }
      next()
    })

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
      new AutoPilotService(logger,
        new ScheduleService(AppDataSource),
        new PilotService(AppDataSource),
        new RSSService(ServerConfig.proxyUrl),
        new NotificationService(new ConfigService(AppDataSource)))

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
