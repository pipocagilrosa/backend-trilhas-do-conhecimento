import format from 'date-fns-tz/format';
import { Role } from '../../enums/role.enum';
import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import parse from 'date-fns/parse';

@Entity()
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ nullable: false })
  name: string;

  @Column({ nullable: false, unique: true })
  email: string;

  @Column({ nullable: false })
  password: string;

  @Column({ nullable: false })
  birthDate: string;

  @Column({ type: 'enum', enum: Role, default: Role.USER })
  role: string;

  @CreateDateColumn({ name: 'created_at' })
  rawCreatedAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  // Getter to return createdAt in Brasília timezone
  get createdAt(): string {
    const brasiliaTimezone = 'America/Sao_Paulo';

    // Format date using Intl.DateTimeFormat
    const formattedDate = new Intl.DateTimeFormat('pt-BR', {
      timeZone: brasiliaTimezone,
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
    }).format(this.rawCreatedAt);

    return formattedDate;
  }
}
