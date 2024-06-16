import { fetchChapas } from "../connections.js";

export async function loadChapasCards() {
  let chapasData = await fetchChapas();

  // Calculate statistics
  let totalChapas = chapasData.length;
  let totalValor = chapasData.reduce((total, chapa) => total + parseFloat(chapa.valor_total), 0);

  let qualityCounts = chapasData.reduce((counts, chapa) => {
    counts[chapa.qualidade] = (counts[chapa.qualidade] || 0) + 1;
    return counts;
  }, {});
  let mostBoughtQuality = Object.keys(qualityCounts).reduce((a, b) => (qualityCounts[a] > qualityCounts[b] ? a : b));

  let buyerCounts = chapasData.reduce((counts, chapa) => {
    counts[chapa.comprador] = (counts[chapa.comprador] || 0) + 1;
    return counts;
  }, {});
  let topBuyer = Object.keys(buyerCounts).reduce((a, b) => (buyerCounts[a] > buyerCounts[b] ? a : b));

  let supplierCounts = chapasData.reduce((counts, chapa) => {
    counts[chapa.fornecedor] = (counts[chapa.fornecedor] || 0) + 1;
    return counts;
  }, {});
  let mostCommonSupplier = Object.keys(supplierCounts).reduce((a, b) => (supplierCounts[a] > supplierCounts[b] ? a : b));

  let totalQuantityInStock = chapasData.reduce((total, chapa) => total + chapa.quantidade_estoque, 0);

  let latestPurchaseDate = chapasData.reduce((latest, chapa) => {
    let date = new Date(chapa.data_compra);
    return date > latest ? date : latest;
  }, new Date(chapasData[0].data_compra));

  let earliestExpectedDate = chapasData.reduce((earliest, chapa) => {
    let date = new Date(chapa.data_prevista);
    return date < earliest ? date : earliest;
  }, new Date(chapasData[0].data_prevista));

  // Create cards
  let cards = [
    { title: "Chapas Totais", text: totalChapas, icon: "./media/caixa.png", class: "card-status-1" },
    { title: "Valor total comprado", text: `R$ ${totalValor.toFixed(2)}`, icon: "./media/cesta-de-compras.png", class: "card-status-2" },
    { title: "Tipo de chapa mais comprada", text: mostBoughtQuality, icon: "./media/bandeira.png", class: "card-status-3" },
    { title: "Top Comprador", text: topBuyer, icon: "./media/do-utilizador.png", class: "card-status-4" },
    { title: "Fornecedor mais comum", text: mostCommonSupplier, icon: "./media/bandeira.png", class: "card-status-5" },
    { title: "Quantidade total em estoque", text: totalQuantityInStock, icon: "./media/do-utilizador.png", class: "card-status-6" },
    { title: "Data da última compra", text: latestPurchaseDate.toLocaleDateString(), icon: "./media/do-utilizador.png", class: "card-status-7" },
    { title: "Data prevista mais cedo", text: earliestExpectedDate.toLocaleDateString(), icon: "./media/do-utilizador.png", class: "card-status-8" },
  ];

  cards.forEach((cardInfo) => {
    var card = `
    <div class="col-12 col-sm-6 col-md-6">
        <div class="dash-widget d-flex justify-content-between ${cardInfo.class} m-2">
            <div class="dash-widgetcontent">
                <h5><span class="counters">${cardInfo.text}</span></h5>
                <h6>${cardInfo.title}</h6>
            </div>
            <div class="dash-widgetimg">
                <span><img src="${cardInfo.icon}" alt="img"></span>
            </div>
        </div>
    </div>
`;

    $("#chapasCards").append(card);
  });
}