import { MigrationInterface, QueryRunner, Table } from 'typeorm';

export class CreateTableUserPermissions1730501653826
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'user_permissions',
        columns: [
          {
            name: 'user_id',
            type: 'uuid',
          },
          {
            name: 'permission_id',
            type: 'uuid',
          },
          {
            name: 'created_at',
            type: 'timestamp',
            default: 'now()',
          },
          {
            name: 'updated_at',
            type: 'timestamp',
            default: 'now()',
          },
        ],
        foreignKeys: [
          {
            name: 'user_permissions_user_id_fk',
            columnNames: ['user_id'],
            referencedColumnNames: ['id'],
            referencedTableName: 'users',
            onDelete: 'RESTRICT',
          },
          {
            name: 'user_permissions_permission_id_fk',
            columnNames: ['permission_id'],
            referencedColumnNames: ['id'],
            referencedTableName: 'permissions',
            onDelete: 'CASCADE',
          },
        ],
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('user_permissions');
  }
}
