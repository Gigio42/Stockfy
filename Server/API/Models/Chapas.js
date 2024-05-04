import { EntitySchema } from 'typeorm';
import Item from './Item.js';

const Chapas = new EntitySchema({
    name: 'Chapas',
    columns: {
        id_grupo_chapas: {
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
            type: String,
            nullable: true,
        },
        qualidade: {
            type: String,
            length: 200,
        },
        medida: {
            type: String,
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
        valor_unitario: {   
            type: 'decimal',
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
    relations: {
        items: {
            target: "Item",
            type: 'many-to-many',
            joinTable: true,
            cascade: true
        }
    }
});

export default Chapas;