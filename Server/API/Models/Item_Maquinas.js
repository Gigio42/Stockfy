import { EntitySchema } from "typeorm";

const Item_Maquinas = new EntitySchema({
    name: "Item_Maquinas",
    columns: {
        id: {
            type: "int",
            primary: true,
            generated: true
        },
    },
    relations: {
        item: {
            target: "Item",
            type: 'many-to-one',
            inverseSide: 'itemMaquinas',
        },
        maquina: {
            target: "Maquina",
            type: 'many-to-one',
            inverseSide: 'itemMaquinas',
        }
    }
});

export default Item_Maquinas;