import app from './app'
import { connect } from './sequelize'

const startServer = async () => {
  await connect()

  app.listen(app.get('port'), () => {
    console.log(`Server is running on port ${app.get('port')} in ${app.get('env')} mode`)
    console.log('Press CTRL-C to stop')
  })
}

startServer().catch((err) => {
  console.log(`Server cannot be started: ${err}`)
  process.exit(1)
})
