import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";


@Entity({ name: 'user_presence' })
export class UserPresence {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    statusMessage?: string;

    @Column()
    showOffline: boolean;
}

