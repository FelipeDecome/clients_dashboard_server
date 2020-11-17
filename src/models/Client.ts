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
  /* Função no repositório para achar o endereço principal */

  @OneToMany(() => Address, address => address.client, { eager: true })
  addresses: Address[];

  @OneToMany(() => Phone, phone => phone.client, { eager: true })
  phones: Phone[];

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  public main_address(): Address | null {
    if (!this.main_address_id) return null;

    const [main_address] = this.addresses.filter(
      address => address.id === this.main_address_id,
    );

    return main_address;
  }
}

export default Client;
