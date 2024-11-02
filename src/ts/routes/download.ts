import { ServerRoute, Request, ResponseToolkit, ResponseObject } from '@hapi/hapi'
import Wreck from '@hapi/wreck'
import { Readable, Transform } from 'stream'
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
  handler: async (_request: Request, h: ResponseToolkit): Promise<any> => {
    const response: Readable = await Wreck.request('get', `${config.get('backendHost')}/postgres/stream`)

    const transform: Transform = new Transform({
      transform (chunk, _encoding, callback) {
        try {
          const jsonChunk = JSON.parse(chunk.toString())
          const rows = jsonChunk.data.map((row: any) => {
            return Object.values(row).join(',')
          }).join('\n')
          this.push(rows)
          callback()
        } catch (err: any) {
          callback(err)
        }
      }
    })

    transform.on('error', (err) => {
      console.error('Transform stream error:', err)
    })

    response.on('error', (err) => {
      console.error('Response stream error:', err)
    })

    response.pipe(transform)

    return h.response(transform)
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
