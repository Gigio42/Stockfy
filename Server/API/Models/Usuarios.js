import { EntitySchema } from "typeorm";

const Usuarios = new EntitySchema({
    name: "Usuarios",
    columns: {
        id_usuario: {
            type: "int",
            primary: true,
            generated: true
        },
        usernname: {
            type: "text",
            nullable: false
        },
        password: {
            type: "text",
            nullable: false
        },
    },
    relations: {
        maquina: {
            target: "Maquina",
            type: "many-to-many",
            inverseSide: 'Usuarios'
        }
    }
});

export default Usuarios;