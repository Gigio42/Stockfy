// Variável para armazenar o histórico de estados para desfazer
let history = [];
// Variável para armazenar o histórico de estados para refazer
let redoHistory = [];

// Função para adicionar o estado atual ao histórico de desfazer
export function addStateToHistory() {
    const stagedCardsContainer = document.getElementById("stagedCardsContainer");
    // Clona o container inteiro dos cards staged
    const currentState = stagedCardsContainer.cloneNode(true);
    // Adiciona o estado ao histórico de desfazer
    history.push(currentState);
    // Limpa o histórico de refazer quando uma nova ação é realizada
    redoHistory = [];
}

// Função para desfazer a última alteração
export function undoChanges() {
    if (history.length > 0) {
        const stagedCardsContainer = document.getElementById("stagedCardsContainer");
        // Adiciona o estado atual ao histórico de refazer antes de desfazer
        redoHistory.push(stagedCardsContainer.cloneNode(true));
        // Remove o último estado do histórico de desfazer e restaura
        const prevState = history.pop();
        stagedCardsContainer.replaceWith(prevState);
    } else {
        console.log("Não há mais alterações para desfazer.");
    }
}

// Função para refazer a última alteração desfeita
export function redoChanges() {
    if (redoHistory.length > 0) {
        const stagedCardsContainer = document.getElementById("stagedCardsContainer");
        // Adiciona o estado atual ao histórico de desfazer antes de refazer
        history.push(stagedCardsContainer.cloneNode(true));
        // Remove o último estado do histórico de refazer e restaura
        const nextState = redoHistory.pop();
        stagedCardsContainer.replaceWith(nextState);
    } else {
        console.log("Não há alterações para refazer.");
    }
}
