import { BaseModel, column, ManyToMany, manyToMany } from '@ioc:Adonis/Lucid/Orm'
import Resource from './Resource'

export default class Action extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column()
  public name: string

  @manyToMany(() => Resource, {
    pivotTable: 'permissions',
    pivotForeignKey: 'action_id',
    pivotRelatedForeignKey: 'resources_id',
    localKey: 'id',
    relatedKey: 'id',
    pivotColumns: ['id'],
  })
  public resources: ManyToMany<typeof Resource>
}
