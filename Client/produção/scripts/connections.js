export async function fetchData(name) {
  try {
    const response = await axios.get(`http://localhost:3000/producao/maquina/${name}/itens/chapas`);
    return response.data;
  } catch (error) {
    console.error("Error fetching data:", error);
  }
}