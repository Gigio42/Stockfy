import { EntitySchema } from 'typeorm';

const Chapas = new EntitySchema({
    name: 'Chapas',
    columns: {
        id_chapa: {
            type: "int",
            primary: true,
            generated: true,
        },
        id_compra: {
            type: "int",
            default: () => Math.floor(Math.random() * 1000000),
        },
        numero_cliente: {
            type: "int",
            default: () => Math.floor(Math.random() * 1000000),
        },
        fornecedor: {
            type: 'text',
            nullable: true,
        },
        unidade: {
            type: 'text',
            nullable: true,
        },
        qualidade: {
            type: 'text',
            length: 200,
        },
        medida: {
            type: 'text',
            nullable: true,
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
        quantidade_estoque: {
            type: Number,
            default: 0,
            nullable: true,
        },
        onda: {
            type: 'text',
            length: 2,
            nullable: true,
        },
        coluna: {
            type: Number,
            nullable: true,
        },
        vincos: {
            type: 'text',
            length: 200,
            nullable: true,
        },
        gramatura: {
            type: Number,
            nullable: true,
        },
        peso_total: {
            type: Number,
            nullable: true,
        },
        valor_unitario: {   
            type: 'decimal',
            nullable: true,
        },
        valor_total: {
            type: 'decimal',
            nullable: true,
        },
        status: {
            type: 'text',
            length: 10,
            nullable: true,
        },
        data_compra: {
            type: 'text',
            nullable: true,
        },
        data_prevista: {
            type: 'text',
            nullable: true,
        },
        data_recebimento: {
            type: 'text',
            nullable: true,
        },
    },
    uniques: [
        {
            columns: ['id_chapa', 'id_compra'],
        },
    ],
    relations: {
        items: {
            target: "Chapa_Item",
            type: 'one-to-many',
            inverseSide: 'chapa',
        },
        conjugacoes: {
            target: "Conjugacoes",
            type: 'one-to-many',
            inverseSide: 'chapa',
            cascade: true
        }
    }
});

export default Chapas;