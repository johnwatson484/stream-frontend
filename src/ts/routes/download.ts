import { ServerRoute, Request, ResponseToolkit, ResponseObject } from '@hapi/hapi'
import Wreck from '@hapi/wreck'
import { Readable } from 'stream'
import config from '../config.js'

const routes: ServerRoute[] = [{
  method: 'GET',
  path: '/download/postgres',
  handler: async (_request: Request, h: ResponseToolkit): Promise<ResponseObject> => {
    const response: any = await Wreck.get(`${config.get('backendHost')}/postgres`, {
      json: true
    })
    const csv = response.payload.data.map((row: any) => {
      return Object.values(row).join(',')
    }).join('\n')
    return h.response(csv)
      .type('text/csv')
      .header('Content-Disposition', 'attachment; filename="data.csv"')
  },
}, {
  method: 'GET',
  path: '/download/postgres/stream',
  handler: async (_request: Request, h: ResponseToolkit): Promise<ResponseObject> => {
    const response: Readable = await Wreck.request('get', `${config.get('backendHost')}/postgres/stream`)

    const stream: Readable = new Readable({
      async read (_size) {
        const chunk = await response.read()
        if (chunk) {
          const jsonChunk = JSON.parse(chunk.toString())
          const rows = jsonChunk.data.map((row: any) => {
            return Object.values(row).join(',')
          }).join('\n')
          this.push(rows)
        } else {
          this.push(null)
        }
      }
    })

    return h.response(stream)
      .type('text/csv')
      .header('Content-Disposition', 'attachment; filename="data.csv"')
  }
}, {
  method: 'GET',
  path: '/download/csv',
  handler: async (_request: Request, h: ResponseToolkit): Promise<ResponseObject> => {
    const response: Readable = await Wreck.request('get', `${config.get('backendHost')}/csv/stream`)
    return h.response(response).type('text/csv').header('Content-Disposition', 'attachment; filename="data.csv"')
  },
}]

export default routes
