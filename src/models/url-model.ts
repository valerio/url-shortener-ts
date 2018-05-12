import Sequelize from 'sequelize'

export interface UrlAttributes {
  count?: number
  url?: string
  hash?: string
  createdAt?: Date
  updatedAt?: Date
}

export interface UrlInstance extends Sequelize.Instance<UrlAttributes> {
  count: number
  url: string
  hash: string
  createdAt: Date
  updatedAt: Date
}

export default function defineUrl (sequelize: Sequelize.Sequelize) {
  const Url = sequelize.define<UrlInstance, UrlAttributes>('Url', {
    count: { type: Sequelize.BIGINT, allowNull: false, unique: true, primaryKey: true, autoIncrement: true },
    url: { type: Sequelize.STRING(2048), allowNull: false },
    hash: { type: Sequelize.STRING, allowNull: false, unique: true }
  })

  return Url
}
