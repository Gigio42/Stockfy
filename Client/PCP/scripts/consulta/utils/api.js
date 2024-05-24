export async function fetchItems() {
  try {
    const response = await axios.get("http://localhost:3000/PCP/items");
    return response.data;
  } catch (error) {
    console.error("Error fetching items:", error);
    return [];
  }
}

export async function deleteEntity(id, type) {
  try {
    await axios.delete(`http://localhost:3000/PCP/${type}s/${id}`);
    const openModalLink = document.getElementById("openModalLink");
    openModalLink.click();
  } catch (error) {
    console.error(`Error deleting ${type}:`, error);
  }
}
