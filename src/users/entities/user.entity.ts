// src/users/entities/user.entity.ts
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column('varchar', { length: 120 })
  name!: string;

  // 👈 Tipo explícito 'varchar' y propiedad opcional (sin union)
  @Column('varchar', { length: 160, unique: true, nullable: true })
  email?: string;

  @Column('varchar', { length: 255 })
  password_hash!: string;

  @Column('varchar', { length: 255, nullable: true })
  refresh_token_hash?: string | null;

  @Column('int', { default: 0 })
  token_version!: number;

  @CreateDateColumn()
  created_at!: Date;

  @UpdateDateColumn()
  updated_at!: Date;
}
