import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity({ name: 'permissions' })
export class Permission {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ unique: true, type: 'text' })
    permission: string;
}