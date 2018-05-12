import config from 'config'
import Sequelize from 'sequelize'

const sequelize = new Sequelize(
  config.get<string>('sql.database'),
  config.get<string>('sql.user'),
  config.get<string>('sql.pass'),
  {
    host: config.get<string>('sql.host'),
    dialect: 'postgres',

    pool: {
      min: 0,
      max: 5,
      idle: 10000,
      acquire: 30000
    }
  }
)

export async function connect (): Promise<void> {
  try {
    await sequelize.authenticate()
    await sequelize.sync()

    console.log('Connection to DB has been established successfully.')
  } catch (err) {
    console.error('Unable to connect to the database:', err)
    process.exit(1)
  }
}

export const instance = sequelize
