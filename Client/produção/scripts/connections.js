export async function fetchData(name) {
  try {
    const response = await axios.get(`http://localhost:3000/producao/maquina/${name}/itens/chapas`);
    return response.data;
  } catch (error) {
    console.error("Error fetching data:", error);
  }
}

export async function updateItemStatus(itemId) {
  try {
    const response = await axios.put(`http://localhost:3000/producao/item/${itemId}/status`);
    return response.data;
  } catch (error) {
    console.error('Error:', error);
  }
}