import { MigrationInterface, QueryRunner, Table } from 'typeorm';

import { created_at, id, updated_at } from './defaultColumns';

export default class CreateClients1605621738328 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'clients',
        columns: [
          id,
          {
            name: 'name',
            type: 'varchar',
          },
          {
            name: 'main_address_id',
            type: 'uuid',
            isNullable: true,
          },
          created_at,
          updated_at,
        ],
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('clients');
  }
}
