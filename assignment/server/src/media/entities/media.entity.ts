import { Column, Model, PrimaryKey, Table } from "sequelize-typescript";

@Table
export class Media extends Model {
    
    @Column
    name: string;
    @Column
    type: string;
    @Column
    hashed_id: string;
}



 