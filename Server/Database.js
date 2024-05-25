// //Conexão com o banco de dados por meio do typeorm, que faz uma instância de uma conexão com o banco de dados SQLite
// //para ser utilizada em outros arquivos. Esse arquivo é necessário para o funcionamento do sistema e só precisa ser
// //modificado caso haja mudanças na estrutura do banco de dados como adição de novas entidades ou mudanças nas entidades.
// import { createConnection } from 'typeorm'
// import Chapas from './API/Models/Chapas.js'
// import Item from './API/Models/Item.js'
// import Chapa_Item from './API/Models/Chapa_Item.js'
// import Conjugacoes from './API/Models/Conjugacoes.js'
// import Maquinas from './API/Models/Maquinas.js' 
// import Chapa_Item_Maquina from './API/Models/Chapa_Item_Maquinas.js'
// import Usuarios from './API/Models/Usuarios.js'


// const connection = async () => {
//   await createConnection({
//     type: 'sqlite',
//     database: './estoque.db',
//     entities: [Chapas, Item, Chapa_Item, Conjugacoes, Maquinas, Chapa_Item_Maquina, Usuarios],
//     synchronize: true,
//   })
// }

// export default connection