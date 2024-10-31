import { Field, ID, ObjectType } from '@nestjs/graphql';
import { User } from '../../auth/entities';
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'companies' })
@ObjectType()
export class Company {
  @PrimaryGeneratedColumn('uuid')
  @Field(() => ID)
  id: string;

  @Column({ type: 'text' })
  @Field(() => String)
  name: string;

  @Column({ type: 'text' })
  @Field(() => String)
  ruc: string;

  @OneToMany(() => User, (user) => user.company)
  @Field(() => [User])
  users: User[];
}
