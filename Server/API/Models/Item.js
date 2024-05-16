import { EntitySchema } from "typeorm";

const Item = new EntitySchema({
    name: "Item",
    columns: {
        id_item: {
            type: "int",
            primary: true,
            generated: true
        },
        part_number: {
            type: "int",
            default: 0
        },
        quantidade_part_number: {
            type: "int",
            default: 0
        },
        Status: {
            type: "text",
            default: ""
        },
    },
    relations: {
        chapas: {
            target: "Chapas",
            type: 'many-to-many',
            inverseSide: 'items',
            joinTable: true,
        }
    }
});

export default Item;