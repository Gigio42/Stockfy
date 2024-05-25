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
        chapa_item_maquina: {
            target: "Chapa_Item_Maquina",
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