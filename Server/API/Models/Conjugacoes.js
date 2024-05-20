import { EntitySchema } from "typeorm";

const Conjugacoes = new EntitySchema({
    name: "Conjugacoes",
    columns: {
        id: {
            type: "int",
            primary: true,
            generated: true
        },
        medida: {
            type: "text"
        },
    },
    relations: {
        chapa: {
            target: "Chapas",
            type: 'many-to-one',
            inverseSide: 'conjugacoes',
        }
    }
});

export default Conjugacoes;