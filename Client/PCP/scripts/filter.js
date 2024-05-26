export function filterItem(item, filterCriteria) {
    if (!filterCriteria) return true;

    filterCriteria = filterCriteria.toUpperCase();

    const itemMatches = (item.fornecedor && item.fornecedor.toUpperCase().includes(filterCriteria)) ||
                        (item.qualidade && item.qualidade.toUpperCase().includes(filterCriteria)) ||
                        (item.medida && item.medida.toUpperCase() === filterCriteria);

    item.chapas = item.chapas.filter(chapa => {
        return (chapa.fornecedor && chapa.fornecedor.toUpperCase().includes(filterCriteria)) ||
                (chapa.qualidade && chapa.qualidade.toUpperCase().includes(filterCriteria)) ||
                (chapa.medida && chapa.medida.toUpperCase() === filterCriteria) ||
                (chapa.onda && chapa.onda.toUpperCase().includes(filterCriteria)) ||
                (chapa.coluna && String(chapa.coluna).toUpperCase().includes(filterCriteria)) ||
                (chapa.vinco && chapa.vinco.toUpperCase().includes(filterCriteria));
    });

    return itemMatches || item.chapas.length > 0;
}