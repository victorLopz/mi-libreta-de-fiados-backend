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
  @PrimaryGeneratedColumn() id: number;

  @Column({ length: 120 }) name: string;

  @Column({ length: 160, unique: true, nullable: true }) email: string | null;

  @Column() password_hash: string;

  // hash del refresh token almacenado (rotación)
  @Column({ nullable: true }) refresh_token_hash?: string | null;

  // para invalidar todos los refresh a la vez (revocación global)
  @Column({ type: 'int', default: 0 }) token_version: number;

  @CreateDateColumn() created_at: Date;
  @UpdateDateColumn() updated_at: Date;
}
