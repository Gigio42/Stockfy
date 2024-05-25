import { EntitySchema } from "typeorm";

const Chapa_Item = new EntitySchema({
    name: "Chapa_Item",
    columns: {
        id: {
            type: "int",
            primary: true,
            generated: true
        },
        quantidade: {
            type: "int",
            nullable: false,
            default: 0
        },
    },
    relations: {
        chapa: {
            target: "Chapas",
            type: 'many-to-one',
            inverseSide: 'chapaItems',
        },
        
        item: {
            target: "Item",
            type: 'many-to-one',
            inverseSide: 'chapaItems',
        },
        chapa_item_maquina: {
            target: "Chapa_item_maquina",
            type: 'one-to-many',
            inverseSide: 'chapaItems',
        }
    }
});

export default Chapa_Item;