import { ApiProperty } from '@nestjs/swagger';
import {
  CreateDateColumn,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Expose } from 'class-transformer';

export class CoreEntity {
  @Expose()
  @ApiProperty({
    description: 'A unique identifier',
  })
  @PrimaryGeneratedColumn()
  id: number;

  @Expose()
  @ApiProperty({
    description: 'Date of record creation',
  })
  @CreateDateColumn()
  createdAt: Date;

  @Expose()
  @ApiProperty({
    description: 'Date of record modification',
  })
  @UpdateDateColumn()
  updatedAt: Date;
}
