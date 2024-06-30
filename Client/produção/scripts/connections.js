import BASE_URL from "../../utils/config.js";

export async function fetchMaquinas() {
  try {
    const response = await axios.get(`${BASE_URL}/producao/maquinas`);
    if (response.data) {
      return response.data;
    } else {
      console.error("No data returned from /producao/maquinas");
      return [];
    }
  } catch (error) {
    console.error("Error fetching data:", error);
    return [];
  }
}

export async function fetchMaquinaData(name) {
  try {
    const response = await axios.get(`${BASE_URL}/producao/maquina/${name}/itens/chapas`);
    return response.data;
  } catch (error) {
    console.error("Error fetching data:", error);
  }
}

export async function updateItemStatus(itemId, maquinaName, executor) {
  try {
    const response = await axios.put(`${BASE_URL}/producao/item/${itemId}/maquina/${maquinaName}/${executor}`);
    return response.data;
  } catch (error) {
    console.error("Error:", error);
  }
}
