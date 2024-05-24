import { getRepository } from "typeorm";
import Chapas from "../Models/Chapas.js";
import Item from "../Models/Item.js";
import Chapa_Item from "../Models/Chapa_Item.js";

class PCPController {
  constructor() {}

  // ------------------------------
  // GetChapasComment Function
  // ------------------------------
  async getChapas(query, filterCriteria, sortOrder, sortBy) {
    const chapasRepository = getRepository(Chapas);
    let data = await chapasRepository.find({ relations: ["conjugacoes"] });

    data = data.filter((chapa) => chapa.status !== "USADO");

    if (filterCriteria) {
      for (let key in filterCriteria) {
        if (key === "comprimento" || key === "largura") {
          data = data.filter((chapa) => {
            const [comprimento, largura] = chapa.medida.split("x");
            if (key === "comprimento") {
              return comprimento === filterCriteria[key];
            } else {
              return largura === filterCriteria[key];
            }
          });
        } else {
          data = data.filter((chapa) => chapa[key].toLowerCase() === filterCriteria[key].toLowerCase());
        }
      }
    }

    data = data.map((chapa) => {
      const date = new Date(chapa.data_prevista);
      const day = String(date.getDate()).padStart(2, "0");
      const month = String(date.getMonth() + 1).padStart(2, "0");
      chapa.data_prevista = `${day}/${month}`;
      return chapa;
    });

    const sortedChapas = data.sort((a, b) => {
      const getValue = (obj, prop) => prop.split(".").reduce((acc, part) => acc && acc[part], obj);

      if (sortBy === "data_prevista") {
        const [dayA, monthA] = getValue(a, sortBy).split("/");
        const [dayB, monthB] = getValue(b, sortBy).split("/");
        const dateA = new Date(2000, monthA - 1, dayA);
        const dateB = new Date(2000, monthB - 1, dayB);

        if (sortOrder === "asc") {
          return dateA - dateB;
        } else {
          return dateB - dateA;
        }
      } else {
        if (sortOrder === "asc") {
          return getValue(a, sortBy) < getValue(b, sortBy) ? -1 : getValue(a, sortBy) > getValue(b, sortBy) ? 1 : 0;
        } else {
          return getValue(a, sortBy) > getValue(b, sortBy) ? -1 : getValue(a, sortBy) < getValue(b, sortBy) ? 1 : 0;
        }
      }
    });
    return sortedChapas;
  }

  // ------------------------------
  // GetItemsComment Function
  // ------------------------------
  async getItems() {
    const chapaItemRepository = getRepository(Chapa_Item);
    const itemRepository = getRepository(Item);

    const chapaItems = await chapaItemRepository
      .createQueryBuilder("chapa_item")
      .leftJoinAndSelect("chapa_item.item", "item")
      .leftJoinAndSelect("chapa_item.chapa", "chapa")
      .getMany();

    if (!chapaItems.length) {
      throw new Error(`No Chapa_Item found`);
    }

    const items = chapaItems.reduce((acc, chapaItem) => {
      const { item } = chapaItem;
      if (!acc[item.id_item]) {
        acc[item.id_item] = {
          ...item,
          chapas: [],
        };
      }
      acc[item.id_item].chapas.push(chapaItem.chapa);
      return acc;
    }, {});

    return Object.values(items);
  }

  // ------------------------------
  // PostItemsComment Function
  // ------------------------------
  async createItemWithChapa(body) {
    const { partNumber, chapas } = body;

    const chapasRepository = getRepository(Chapas);
    const itemRepository = getRepository(Item);
    const chapaItemRepository = getRepository(Chapa_Item);

    let item;
    let chapasToSave = [];
    let chapaItemsToSave = [];

    for (const { chapaID, quantity, medida, keepRemaining } of chapas) {
      const chapa = await chapasRepository.findOne({ where: { id_chapa: chapaID } });

      if (!chapa) throw new Error("Chapa not found");
      if (!quantity) throw new Error("Quantity is required");
      if (quantity > chapa.quantidade_comprada) throw new Error("Insufficient chapas");

      if (!item) {
        item = await itemRepository.findOne({ where: { part_number: partNumber } });

        if (!item) {
          item = itemRepository.create({
            part_number: partNumber,
            status: "RESERVADO",
          });

          await itemRepository.save(item);
        }
      }

      chapa.quantidade_estoque -= quantity;

      if (chapa.quantidade_comprada + chapa.quantidade_estoque === 0 || (chapa.status === "recebido" && chapa.quantidade_estoque === 0)) {
        chapa.status = "USADO";
      }

      if (keepRemaining) {
        const [chapaWidth, chapaHeight] = chapa.medida.split("x").map(Number);
        const [chosenWidth, chosenHeight] = medida.split("x").map(Number);

        if (chapaWidth < chosenWidth || chapaHeight < chosenHeight) {
          throw new Error("Not enough chapas of the specified dimensions");
        }

        const originalArea = chapaWidth * chapaHeight;
        const usedArea = chosenWidth * chosenHeight;
        const remainingArea = originalArea - usedArea;

        const { id_chapa, medida, ...chapaProps } = chapa;

        const newChapa = chapasRepository.create({
          ...chapaProps,
          area: remainingArea,
          quantidade_estoque: quantity,
          status: "RESTO",
        });

        await chapasRepository.save(newChapa);
      }

      chapasToSave.push(chapa);

      let chapaItem = await chapaItemRepository.findOne({ where: { chapa: chapa, item: item } });

      if (chapaItem) {
        chapaItem.quantidade += Number(quantity);
      } else {
        chapaItem = chapaItemRepository.create({
          chapa: chapa,
          item: item,
          quantidade: Number(quantity),
        });
      }

      chapaItemsToSave.push(chapaItem);
    }

    await chapasRepository.save(chapasToSave);
    await chapaItemRepository.save(chapaItemsToSave);

    return item;
  }
}

export default PCPController;
