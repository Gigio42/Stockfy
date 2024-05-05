//Conexão com o banco de dados por meio do typeorm, que faz uma instância de uma conexão com o banco de dados SQLite
//para ser utilizada em outros arquivos. Esse arquivo é necessário para o funcionamento do sistema e só precisa ser
//modificado caso haja mudanças na estrutura do banco de dados como adição de novas entidades ou mudanças nas entidades.
import { createConnection } from 'typeorm';
import Chapas from './API/Models/Chapas.js';
import Item from './API/Models/Item.js';

const connection = async () => {
  await createConnection({
    type: 'sqlite',
    database: './estoque.db',
    entities: [Chapas, Item],
    synchronize: true,
  });
};

export default connection;