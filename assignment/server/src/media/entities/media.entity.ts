import { Column, HasMany, Model, Table } from "sequelize-typescript";
import { Tag } from "./tags.entity";

@Table
export class Media extends Model {
    @Column
    name: string;

    @Column
    type: string;

    @Column
    hashed_id: string;

    @Column({allowNull: false, defaultValue: 0})
    totalPlays: number; 

    @Column({allowNull: false, defaultValue: true})
    active: boolean 

    @HasMany(() => Tag)
    tags: Tag[]
}





 