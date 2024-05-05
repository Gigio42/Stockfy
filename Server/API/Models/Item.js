import { EntitySchema } from "typeorm";

const Item = new EntitySchema({
    name: "Item",
    columns: {
        id_item: {
            type: "int",
            primary: true,
            generated: true
        },
        id_grupo_chapas: {
            type: "int",
            default: 0
        },
        part_number: {
            type: "int",
            default: 0
        },
        Quantidade_part_number: {
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
            inverseSide: 'items'
        }
    }
});

export default Item;