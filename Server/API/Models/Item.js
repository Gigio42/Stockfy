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
            type: "text",
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
        item: {
            target: "Item_Maquinas",
            type: 'one-to-many',
            inverseSide: 'item',
        },
    }
});

export default Item;