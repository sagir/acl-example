import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class PermissionDependencyPivots extends BaseSchema {
  protected tableName = 'permission_dependencies'

  public async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id').primary()

      table
        .integer('permission_id')
        .notNullable()
        .unsigned()
        .references('id')
        .inTable('permissions')
        .onDelete('CASCADE')

      table
        .integer('resource_id')
        .notNullable()
        .unsigned()
        .references('id')
        .inTable('resources')
        .onDelete('CASCADE')

      table
        .integer('action_id')
        .notNullable()
        .unsigned()
        .references('id')
        .inTable('actions')
        .onDelete('CASCADE')
    })
  }

  public async down() {
    this.schema.dropTable(this.tableName)
  }
}
