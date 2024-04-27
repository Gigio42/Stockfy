import { EntitySchema } from "typeorm";
import Chapas from "./Chapas.js";

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
        id_grupo_chapas: {
            target: "Chapas",
            type: "many-to-one",
            joinTable: true,
            cascade: true
        }
    }
});

export default Lotes;