import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";
import { Permission } from './permission.entity';
import { ManyToMany, JoinTable } from 'typeorm';

@Entity({ name: 'roles' })
export class Role {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ unique: true, type: 'text' })
    role: string;

    @ManyToMany(() => Permission, permission => permission.permission)
    @JoinTable({
        name: 'role_permissions',
        joinColumn: {
            name: 'role_id',
            referencedColumnName: 'id'
        },
        inverseJoinColumn: {
            name: 'permission_id',
            referencedColumnName: 'id'
        }
    })
    permissions: Permission[];
}