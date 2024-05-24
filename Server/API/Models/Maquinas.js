import { EntitySchema } from "typeorm";

const Maquinas = new EntitySchema({
    name: "Maquina",
    columns: {
        id: {
            type: "int",
            primary: true,
            generated: true
        },
        name: {
            type: "text",
            length: 255,
            nullable: false
        }
    },
    relations: {
        maquinaId: {
            target: "Item_Maquinas",
            type: 'one-to-many',
            inverseSide: 'Maquina',
        },
        // Criado por joão Luccas para a Pagina de Login
        usuarios: {
            target: "Usuarios",
            type: "many-to-many",
            inverseSide: 'maquinas'
        }

    }
});

export default Maquinas;