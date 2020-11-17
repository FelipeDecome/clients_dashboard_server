import { MigrationInterface, QueryRunner, Table } from 'typeorm';

import { created_at, id, updated_at } from './defaultColumns';

export default class CreatePhones1605636139944 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'phones',
        columns: [
          id,
          {
            name: 'number',
            type: 'varchar',
          },
          {
            name: 'client_id',
            type: 'uuid',
          },
          {
            name: 'is_whatsapp',
            type: 'boolean',
            default: false,
          },
          created_at,
          updated_at,
        ],
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('phones');
  }
}
