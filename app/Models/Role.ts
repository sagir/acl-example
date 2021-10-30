import { DateTime } from 'luxon'
import { BaseModel, column, ManyToMany, manyToMany, scope } from '@ioc:Adonis/Lucid/Orm'
import Permission from './Permission'
import { active, inactive } from 'App/utils/scopes'

export default class Role extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column()
  public name: string

  @column()
  public slug: string

  @column()
  public description?: string

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime

  @column.dateTime({ autoCreate: false, autoUpdate: false })
  public deactivatedAt?: DateTime

  @manyToMany(() => Permission)
  public permissions: ManyToMany<typeof Permission>

  // active/inactive scopes
  public static active = scope(active)
  public static inactive = scope(inactive)
}
