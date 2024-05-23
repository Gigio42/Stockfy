import { getRepository } from 'typeorm';
import Item_Maquinas from '../Models/Item_Maquinas.js';
import Chapa_Item from '../Models/Chapa_Item.js';
import Item from '../Models/Item.js';
import Maquinas from '../Models/Maquinas.js'

class AdmController {
  constructor() {}

  async getAll() {
    const itemRepository = getRepository(Item);
    const maquinasRepository = getRepository(Maquinas);
    const item_maquinaRepository = getRepository(Item_Maquinas);
  
    const itemsPromise = itemRepository.find();
    const maquinasPromise = maquinasRepository.find();
    const item_maquinaPromisse = await item_maquinaRepository.createQueryBuilder('item_maquinas')
    .leftJoinAndSelect('item_maquinas.itemId', 'item')
    .leftJoinAndSelect('item_maquinas.maquinaId', 'maquina')
    .getMany();

    const [items, maquinas, item_maquinas] = await Promise.all([itemsPromise, maquinasPromise, item_maquinaPromisse]);
  
    return { items, maquinas, item_maquinas};
  }

  

  async createItemMaquina(orderData) {
    const item_maquinaRepository = getRepository(Item_Maquinas);
  
    const promises = orderData.map(async item => {
      const newItem_Maquina = item_maquinaRepository.create(item);
      return item_maquinaRepository.save(newItem_Maquina);
    });
  
    return await Promise.all(promises);
  }

  async getItemMaquinaByItemId(itemId) {
    if (!itemId) throw new Error('id_item_maquina is undefined');
  
    const item_maquinaRepository = getRepository(Item_Maquinas);
  
    const item_maquina = await item_maquinaRepository.createQueryBuilder('item_maquinas')
    .leftJoinAndSelect('item_maquinas.itemId', 'item')
    .leftJoinAndSelect('item_maquinas.maquinaId', 'maquina')
    .where('id_item = :itemId', { itemId })
    .getMany();


  
    if (!item_maquina.length) {
      throw new Error(`No id_item_maquina found with itemId ${itemId}`);
    }
    
    return item_maquina
  }

  async getChapaItem(itemId) {
    const chapa_itemRepository = getRepository(Chapa_Item);
  
    const chapa_item = await chapa_itemRepository.createQueryBuilder('chapa_item')
      .leftJoinAndSelect('chapa_item.item', 'item')
      .leftJoinAndSelect('chapa_item.chapa', 'chapa')
      .where('id_item = :itemId', { itemId })
      .getMany();
  
    if (!chapa_item.length) {
      throw new Error(`No chapas found for itemId ${itemId}`);
    }
  
    return chapa_item;
  }
  
}

export default AdmController;