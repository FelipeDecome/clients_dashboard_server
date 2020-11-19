import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

import Address from './Address';
import Phone from './Phone';

@Entity('clients')
class Client {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column('uuid')
  main_address_id?: string;

  @OneToMany(() => Address, address => address.client, { eager: true })
  addresses: Address[];

  @OneToMany(() => Phone, phone => phone.client, { eager: true })
  phones: Phone[];

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}

export default Client;
