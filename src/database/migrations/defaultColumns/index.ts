import { TableColumn } from 'typeorm';

const id = new TableColumn({
  name: 'id',
  type: 'uuid',
  isPrimary: true,
  generationStrategy: 'uuid',
  default: 'uuid_generate_v4()',
});

const created_at = new TableColumn({
  name: 'created_at',
  type: 'timestamp',
  default: 'now()',
});

const updated_at = new TableColumn({
  name: 'updated_at',
  type: 'timestamp',
  default: 'now()',
});

export { id, created_at, updated_at };
