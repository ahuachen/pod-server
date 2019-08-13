import { Server } from '../../src/server'
import { BlobTreeInMem, BufferTree } from 'wac-ldp'

let server: Server

// interface OptionsObject {
//   port: number
//   rootDomain: string
//   httpsConfig?: HttpsConfig
//   storage: BlobTree
//   keystore: any,
//   useHttps: boolean
// }

export function startServer (port: number): Promise<void> {
  server = new Server({
    port,
    rootDomain: `localhost:${port}`,
    storage:  new BufferTree(new BlobTreeInMem()),
    keystore: {},
    useHttps: false
  })
  return server.listen()
}

export function stopServer () {
  server.close()
}
