import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

import Client from './Client';

@Entity('addresses')
class Address {
  @PrimaryGeneratedColumn('uuid')
  id: number;

  @Column('uuid')
  client_id: string;

  @ManyToOne(() => Client, client => client.addresses, {
    eager: true,
  })
  client: Client;

  @Column()
  street: string;

  @Column()
  number: string;

  @Column()
  neighborhood: string;

  @Column()
  complement: string;

  @Column()
  cep: string;

  @Column()
  city: string;

  @Column()
  state: string;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}

export default Address;
