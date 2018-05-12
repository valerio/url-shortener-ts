import { instance } from '../sequelize'
import UrlModel from './url-model'

// Export models
export const Url = UrlModel(instance)
