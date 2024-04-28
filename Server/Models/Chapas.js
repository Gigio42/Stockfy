import { EntitySchema } from 'typeorm';

const Chapas = new EntitySchema({
    name: 'Chapas',
    columns: {
        id_grupo_chapas: {
            type: Number,
            primary: true,
            generated: true,
        },
        id_compra: {
            type: Number,
            default: () => Math.floor(Math.random() * 1000000),
        },
        numero_cliente: {
            type: Number,
            default: () => Math.floor(Math.random() * 1000000),
        },
        fornecedor: {
            type: String,
            nullable: true,
        },
        qualidade: {
            type: String,
            length: 200,
        },
        medida: {
            type: String,
        },
        quantidade_comprada: {
            type: Number,
            default: 0,
            nullable: true,
        },
        quantidade_recebida: {
            type: Number,
            default: 0,
            nullable: true,
        },
        onda: {
            type: String,
            length: 2,
            nullable: true,
        },
        coluna: {
            type: Number,
            nullable: true,
        },
        vincos: {
            type: String,
            length: 3,
        },
        gramatura: {
            type: Number,
            nullable: true,
        },
        peso_total: {
            type: Number,
            nullable: true,
        },
        valor_total: {
            type: 'decimal',
            nullable: true,
        },
        status: {
            type: String,
            length: 10,
            nullable: true,
        },
        data_compra: {
            type: Date,
            nullable: true,
        },
        data_prevista: {
            type: Date,
            nullable: true,
        },
        data_recebimento: {
            type: Date,
            nullable: true,
        },
    },
    uniques: [
        {
            columns: ['id_grupo_chapas', 'id_compra'],
        },
    ],
});

export default Chapas;