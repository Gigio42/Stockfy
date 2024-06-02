import BASE_URL from "../../utils/config.js";

export async function fetchData(name) {
  try {
    const response = await axios.get(`${BASE_URL}/producao/maquina/${name}/itens/chapas`);
    return response.data;
  } catch (error) {
    console.error("Error fetching data:", error);
  }
}

export async function updateItemStatus(itemId) {
  try {
    const response = await axios.put(`${BASE_URL}/producao/item/${itemId}/status`);
    return response.data;
  } catch (error) {
    console.error("Error:", error);
  }
}
