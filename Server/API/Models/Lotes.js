import { EntitySchema } from "typeorm";

const Lotes = new EntitySchema({
    name: "Lotes",
    columns: {
        id_lote: {
            type: "int",
            primary: true,
            generated: true
        },
        quantidade_total_comprada: {
            type: "int",
            default: 0
        },
        quantidade_total_recebida: {
            type: "int",
            default: 0
        }
    },
    relations: {
        chapas: {
            target: "Chapas",
            type: "one-to-many",
            inverseSide: "lote"
        }
    }
});

export default Lotes;