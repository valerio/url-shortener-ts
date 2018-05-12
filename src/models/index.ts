import config from 'config'
import Sequelize from 'sequelize'
import UrlModel from './url-model'

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

export async function init (db: Sequelize.Sequelize) {
  try {
    await db.authenticate()
    await db.sync()

    console.log('Connection to SQL DB has been established successfully.')
  } catch (err) {
    console.error('Unable to connect to the database:', err)
    process.exit()
  }
}

export const db = sequelize
export const Url = UrlModel(sequelize)