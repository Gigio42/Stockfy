import { EntitySchema } from "typeorm";
import Lotes from "./Lotes.js";

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
        }
    },
    relations: {
        id_lote: {
            target: "Lotes",
            type: "many-to-one",
            joinTable: true,
            cascade: true
        }
    }
});

export default Item;