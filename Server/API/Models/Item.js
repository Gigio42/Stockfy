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
            target: "Chapa_Item",
            type: 'one-to-many',
            inverseSide: 'item',
        },
        itemMaquinas: {
            target: "Item_Maquinas",
            type: 'one-to-many',
            inverseSide: 'maquina',
        },
    }
});

export default Item;