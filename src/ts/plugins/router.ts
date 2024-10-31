import { Server, ServerRoute } from '@hapi/hapi'
import home from '../routes/home.js'
import assets from '../routes/assets.js'
import health from '../routes/health.js'
import download from '../routes/download.js'

const plugin: any = {
  plugin: {
    name: 'router',
    register: (server: Server) => {
      server.route(new Array<ServerRoute>().concat(
        home,
        assets,
        health,
        download
      ))
    },
  },
}

export default plugin
