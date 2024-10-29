import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  BeforeInsert,
  BeforeUpdate,
  AfterLoad,
} from 'typeorm';
import { JoinTable, ManyToMany } from 'typeorm';
import { Role } from './role.entity';
import { Permission } from './permission.entity';
import { Field, ObjectType } from '@nestjs/graphql';

@Entity({ name: 'users' })
@ObjectType()
export class User {
  @PrimaryGeneratedColumn('uuid')
  @Field(() => String)
  id: string;

  @Column({ unique: true, type: 'text' })
  @Field(() => String)
  email: string;

  @Column({ type: 'text', select: false })
  password: string;

  @Column({ type: 'text' })
  @Field(() => String)
  fullName: string;

  @Column({ type: 'boolean', default: true })
  isActive: boolean;

  @ManyToMany(() => Role, (role) => role.role)
  @JoinTable({
    name: 'user_roles',
    joinColumn: {
      name: 'user_id',
      referencedColumnName: 'id',
    },
    inverseJoinColumn: {
      name: 'role_id',
      referencedColumnName: 'id',
    },
  })
  roles: Role[];

  @ManyToMany(() => Permission, (permission) => permission.permission)
  @JoinTable({
    name: 'user_permissions',
    joinColumn: {
      name: 'user_id',
      referencedColumnName: 'id',
    },
    inverseJoinColumn: {
      name: 'permission_id',
      referencedColumnName: 'id',
    },
  })
  directPermissions: Permission[];

  permissions: Permission[];

  @BeforeInsert()
  normalizeInsertEmail() {
    this.email = this.email.toLowerCase();
  }

  @BeforeUpdate()
  normalizeUpdateEmail() {
    this.normalizeInsertEmail();
  }

  @AfterLoad()
  setPermissions() {
    let rolesPermissions = [];
    let directPermissions = [];
    if (this.roles) {
      rolesPermissions = this.roles
        .map((role) => {
          const permissions = [...role.permissions];
          delete role.permissions;
          return permissions;
        })
        .flat();
    }

    if (this.directPermissions) {
      directPermissions = this.directPermissions;
    }

    this.permissions = [...directPermissions, ...rolesPermissions];

    delete this.directPermissions;
  }
}
