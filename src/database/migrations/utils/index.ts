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

interface DefaultVarcharColumnProps {
  name: string;
  isNullable?: boolean;
}

const defaultVarcharColumn = ({
  name,
  isNullable = false,
}: DefaultVarcharColumnProps): TableColumn =>
  new TableColumn({
    name,
    type: 'varchar',
    isNullable,
  });

export { id, created_at, updated_at, defaultVarcharColumn };
