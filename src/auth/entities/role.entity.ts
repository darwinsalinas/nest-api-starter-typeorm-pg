import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { Permission } from './permission.entity';
import { ManyToMany, JoinTable } from 'typeorm';
import { Field, ObjectType } from '@nestjs/graphql';

@Entity({ name: 'roles' })
@ObjectType()
export class Role {
  @PrimaryGeneratedColumn('uuid')
  @Field(() => String)
  id: string;

  @Column({ unique: true, type: 'text' })
  @Field(() => String)
  role: string;

  @ManyToMany(() => Permission, (permission) => permission.permission)
  @JoinTable({
    name: 'role_permissions',
    joinColumn: {
      name: 'role_id',
      referencedColumnName: 'id',
    },
    inverseJoinColumn: {
      name: 'permission_id',
      referencedColumnName: 'id',
    },
  })
  @Field(() => [Permission])
  permissions: Permission[];
}
