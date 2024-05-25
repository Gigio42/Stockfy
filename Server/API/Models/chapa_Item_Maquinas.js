import { EntitySchema } from "typeorm";

const Chapa_Item_Maquina = new EntitySchema({
    name: "Chapa_Item_Maquina",
    columns: {
        id_chapa_item_maquina: {
            type: "int",
            primary: true,
            generated: true
        },
        ordem: {
            type: "int",
            nullable: true,
        },
        prazo: {
            type: Date,
            nullable: true,
        },
        status: {
            type: "text",
            nullable: true,
        },
    },
    relations: {

        item: {
            target: "Item",
            type: 'many-to-one',
            inverseSide: 'Chapa_Item_Maquina',
        },

        maquina: {
            target: "Maquina",
            type: 'many-to-one',
            inverseSide: 'Chapa_Item_Maquina',
        },
        chapa_item: {
            target: "Chapa_Item",
            type: 'many-to-one',
            inverseSide: 'Chapa_Item_Maquina',
        }

    }
});

export default Chapa_Item_Maquina;