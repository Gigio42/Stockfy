import { EntitySchema } from "typeorm";

const Item_Maquina = new EntitySchema({
    name: "Item_Maquinas",
    columns: {
        id_item_maquina: {
            type: "int",
            primary: true,
            generated: true
        },
        ordem: {
            type: "int",
            nullable: true
        }
    },
    relations: {
        itemId: {
            target: "Item",
            type: 'many-to-one',
            inverseSide: 'Item_Maquinas',
        },
        maquinaId: {
            target: "Maquina",
            type: 'many-to-one',
            inverseSide: 'Item_Maquinas',
        }
    }
});

export default Item_Maquina;