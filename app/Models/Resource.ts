import { BaseModel, column, ManyToMany, manyToMany } from '@ioc:Adonis/Lucid/Orm'
import Action from './Action'

export default class Resource extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column()
  public name: string

  @manyToMany(() => Action, {
    pivotTable: 'permissions',
    pivotForeignKey: 'resource_id',
    pivotRelatedForeignKey: 'action_id',
    localKey: 'id',
    relatedKey: 'id',
    pivotColumns: ['id'],
  })
  public actions: ManyToMany<typeof Action>
}
