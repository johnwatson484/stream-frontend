import { ServerRoute, Request, ResponseToolkit, ResponseObject } from '@hapi/hapi'
import Wreck from '@hapi/wreck'
import config from '../config.js'

const routes: ServerRoute[] = [{
  method: 'GET',
  path: '/download/postgres',
  handler: async (_request: Request, h: ResponseToolkit): Promise<ResponseObject> => {
    const response: any = await Wreck.get(`${config.get('backendHost')}/stream/postgres`, {
      json: true
    })
    const csv = response.payload.data.map((row: any) => {
      return Object.values(row).join(',')
    }).join('\n')
    return h.response(csv).type('text/csv')
  },
}, {
  method: 'GET',
  path: '/download/csv',
  handler: (_request: Request, h: ResponseToolkit): ResponseObject => {
    return h.response('ok')
  },
}]

export default routes
