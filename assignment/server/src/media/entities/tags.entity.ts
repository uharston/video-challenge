import { BelongsTo, Column, ForeignKey, Model, Table } from "sequelize-typescript";
import { Media } from "./media.entity";

@Table
export class Tag extends Model {
    @Column
    name: string;

    @ForeignKey(() => Media)
    @Column({ allowNull: false })
    idMedia: number;

    @BelongsTo(() => Media)
    media: Media

}
