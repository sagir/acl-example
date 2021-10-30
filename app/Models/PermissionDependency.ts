import { BaseModel, BelongsTo, belongsTo, column } from '@ioc:Adonis/Lucid/Orm'
import Action from './Action'
import Permission from './Permission'
import Resource from './Resource'

export default class PermissionDependency extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column()
  public permissionId: number

  @column()
  public resourceId: number

  @column()
  public actionId: number

  @belongsTo(() => Permission)
  public permission: BelongsTo<typeof Permission>

  @belongsTo(() => Resource)
  public resource: BelongsTo<typeof Resource>

  @belongsTo(() => Action)
  public action: BelongsTo<typeof Action>
}
