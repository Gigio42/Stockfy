import { getRepository } from 'typeorm';
import Item_Maquinas from '../Models/Item_Maquinas.js';


class AdmController {
  constructor() {}

  async createItemMaquina(orderData) {
    const item_maquinaRepository = getRepository(Item_Maquinas);
  
    const promises = orderData.map(async item => {
      const newItem_Maquina = item_maquinaRepository.create(item);
      return item_maquinaRepository.save(newItem_Maquina);
    });
  
    return await Promise.all(promises);
  }

  async getItemMaquina(itemId) {
    if (!itemId) throw new Error('id_item_maquina is undefined');
  
    const item_maquinaRepository = getRepository(Item_Maquinas);
  
    const item_maquina = await item_maquinaRepository.find({ 
      where: { itemId },
      relations:['itemId', 'maquinaId']
    });
  
    if (!item_maquina.length) {
      throw new Error(`No id_item_maquina found with id_item_maquina ${id_item_maquina}`);
    }
    console.log(item_maquina)
    return item_maquina;
  }
}

export default AdmController;