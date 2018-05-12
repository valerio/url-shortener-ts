import app from './app'
import { init, db } from './models/index'

init(db).then(() => {
  app.listen(app.get('port'), () => {
    console.log(`Server is running on port ${app.get('port')} in ${app.get('env')} mode`)
    console.log('Press CTRL-C to stop')
  })
}).catch((err) => {
  console.log(`Server cannot be started: ${err}`)
  process.exit(1)
})
