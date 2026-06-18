import fs from 'fs'
import https from 'https'
import { ApiServer } from './ApiServer'
import { config } from './config'


const app = ApiServer.create({
  dbPath: config.dbPath,
  allowedOrigins: config.allowedOrigins,
  authEnabled: config.authEnabled,
  auth0: config.auth0
})

if (config.httpsEnabled && config.https) {
  const { keyPath, certPath, caPath } = config.https
  const key = fs.readFileSync(keyPath, 'utf8')
  const cert = fs.readFileSync(certPath, 'utf8')
  const ca = fs.readFileSync(caPath, 'utf8')

  https.createServer({ key, cert, ca }, app).listen(config.port)
  console.info('created https server')
}
else {
  app.listen(config.port)
}

console.info(`listening on ${config.port}`)
