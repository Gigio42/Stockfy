import { EntitySchema } from "typeorm";

const Maquina = new EntitySchema({
    name: "Maquina",
    columns: {
        id: {
            type: "int",
            primary: true,
            generated: true
        },
        name: {
            type: "text",
            length: 255,
            nullable: false
        }
    },
    relations: {
        itemMaquinas: {
            target: "Item_Maquinas",
            type: 'one-to-many',
            inverseSide: 'item',
        },
    }
});

export default Maquina;