import { createConnection } from 'typeorm';
import Chapas from './Models/Chapas.js';
import Lotes from './Models/Lotes.js';
import Item from './Models/Item.js';

const connection = async () => {
  await createConnection({
    type: 'sqlite',
    database: './estoque.db',
    entities: [Chapas, Lotes, Item],
    synchronize: true,
  });
};

export default connection;