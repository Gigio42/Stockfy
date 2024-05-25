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
        status: {
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
        chapa_item_maquinas: {
            target: "Chapa_Item_Maquina",
            type: 'one-to-many',
            inverseSide: 'item',
        },
    }
});

export default Item;