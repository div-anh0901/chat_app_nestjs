import { Exclude } from "class-transformer";
import { Entity, Column, PrimaryGeneratedColumn, OneToMany, JoinColumn, ManyToMany, OneToOne, } from "typeorm";
import { Group } from "./Group";
import { Message } from "./Message";
import { Friend } from './Friend';
import { Profile } from "./Profile";
import { UserPresence } from "./UserPresence";
@Entity({ name: 'users' })
export class User {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ unique: true })
    username: string;

    @Column({ nullable: true })
    email: string;

    @Column()
    firstName: string;

    @Column()
    lastName: string;

    @Column({ select: false })
    @Exclude()
    password: string;

    @OneToMany(() => Message, (message) => message.author)
    @JoinColumn()
    messages: Message[];

    @ManyToMany(() => Group, (group) => group.users)
    groups: Group[];


    @OneToOne(() => Profile, { cascade: ['insert', 'update'] })
    @JoinColumn()
    profile: Profile;


    @OneToOne(() => UserPresence, { cascade: ['insert', 'update'] })
    @JoinColumn()
    presence: UserPresence;
}