// import { getRepository } from 'typeorm';
// import Chapa_Item_Maquinas from '../Models/chapa_Item_Maquinas.js'
// import Chapa_Item from '../Models/Chapa_Item.js';
// import Item from '../Models/Item.js';
// import Maquinas from '../Models/Maquinas.js'

// class AdmController {
//   constructor() {}

//   async getAll() {
//     const itemRepository = getRepository(Item);
//     const maquinasRepository = getRepository(Maquinas);
//     const chapa_item_maquinaRepository = getRepository(Chapa_Item_Maquinas);
//     const chapa_itemRepository = getRepository(Chapa_Item);

//     const itemsPromise = itemRepository.find();
//     const maquinasPromise = maquinasRepository.find();
//     const chapaItemPromise = chapa_itemRepository.find();

//     const chapa_item_maquinaPromisse = await chapa_item_maquinaRepository.createQueryBuilder('chapa_item_maquinas')
//     .leftJoinAndSelect('chapa_item_maquinas.item', 'item')
//     .leftJoinAndSelect('chapa_item_maquinas.maquina', 'maquina')
//     .leftJoinAndSelect('chapa_item_maquinas.chapa_item', 'chapa_item')
//     .getMany();

    
//     const [items, maquinas, chapa_item_maquinas, chapa_item] = await Promise.all([itemsPromise, maquinasPromise, chapa_item_maquinaPromisse, chapaItemPromise]);
//     console.log(chapa_item_maquinas)
//     return { items, maquinas, chapa_item_maquinas, chapa_item};
//   }

  

//   async createChapaItemMaquina(orderData) {
//     const chapa_item_maquinaRepository = getRepository(Chapa_Item_Maquinas);
  
//     const promises = orderData.map(async item => {
//       const newChapa_Item_Maquina = chapa_item_maquinaRepository.create(item);
//       return chapa_item_maquinaRepository.save(newChapa_Item_Maquina);
//     });
  
//     return await Promise.all(promises);
//   }


//   async getItemMaquinaByItemId(itemId) {
//     if (!itemId) throw new Error('id_item_maquina is undefined');
  
//     const chapa_item_maquinaRepository = getRepository(Chapa_Item_Maquinas);
  
//     const chapa_item_maquina = await chapa_item_maquinaRepository.createQueryBuilder('chapa_item_maquinas')
//     .leftJoinAndSelect('chapa_item_maquinas.itemId', 'item')
//     .leftJoinAndSelect('chapa_item_maquinas.maquinaId', 'maquina')
//     .where('id_item = :item', { itemId })
//     .getMany();


  
//     if (!chapa_item_maquina.length) {
//       throw new Error(`No id_item_maquina found with itemId ${itemId}`);
//     }
    
//     return chapa_item_maquina
//   }

//   async getChapaItem(itemId) {
//     const chapa_itemRepository = getRepository(Chapa_Item);
  
//     const chapa_item = await chapa_itemRepository.createQueryBuilder('chapa_item')
//       .leftJoinAndSelect('chapa_item.item', 'item')
//       .leftJoinAndSelect('chapa_item.chapa', 'chapa')
//       .where('item.id_item = :itemId', { itemId })
//       .getMany();
//     if (!chapa_item.length) {
//       throw new Error(`No chapas found for itemId ${itemId}`);
//     }
  
//     return chapa_item;
//   }
  
// }

// export default AdmController;