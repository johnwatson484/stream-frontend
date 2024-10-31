import { ServerRoute, Request, ResponseToolkit, ResponseObject } from '@hapi/hapi'

const routes: ServerRoute[] = [{
  method: 'GET',
  path: '/download/postgres',
  handler: (_request: Request, h: ResponseToolkit): ResponseObject => {
    return h.response('ok')
  },
}, {
  method: 'GET',
  path: '/download/csv',
  handler: (_request: Request, h: ResponseToolkit): ResponseObject => {
    return h.response('ok')
  },
}]

export default routes
