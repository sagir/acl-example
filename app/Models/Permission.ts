import {
  BaseModel,
  BelongsTo,
  belongsTo,
  column,
  ManyToMany,
  manyToMany,
} from '@ioc:Adonis/Lucid/Orm'
import Action from './Action'
import Resource from './Resource'
import Role from './Role'

export default class Permission extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column()
  public resourceId: number

  @column()
  public actionId: number

  @belongsTo(() => Resource)
  public resource: BelongsTo<typeof Resource>

  @belongsTo(() => Action)
  public action: BelongsTo<typeof Action>

  @manyToMany(() => Permission, {
    pivotTable: 'permission_dependencies',
    pivotForeignKey: 'permission_id',
    pivotRelatedForeignKey: 'depends_on',
    relatedKey: 'id',
    localKey: 'id',
  })
  public dependencies: ManyToMany<typeof Permission>

  @manyToMany(() => Role)
  public roles: ManyToMany<typeof Role>
}
