// Variável para armazenar o histórico de estados para desfazer
let history = [];
// Variável para armazenar o histórico de estados para refazer
let redoHistory = [];

// Função para adicionar o estado atual ao histórico de desfazer
export function addStateToHistory() {
    const stagedCardsContainer = document.getElementById("stagedCardsContainer");
    // Clona o container inteiro dos cards staged
    const currentState = {
        domState: stagedCardsContainer.cloneNode(true),
        medidasConjugConfimed: [...window.medidasConjugConfimed] // Clona o array de medidas
    };
    // Adiciona o estado ao histórico de desfazer
    history.push(currentState);
    // Limpa o histórico de refazer quando uma nova ação é realizada
    redoHistory = [];
    console.log("Estado adicionado ao histórico:", currentState);
}

// Função para desfazer a última alteração
export function undoChanges() {
    if (history.length > 0) {
        const stagedCardsContainer = document.getElementById("stagedCardsContainer");
        // Adiciona o estado atual ao histórico de refazer antes de desfazer
        redoHistory.push({
            domState: stagedCardsContainer.cloneNode(true),
            medidasConjugConfimed: [...window.medidasConjugConfimed] // Clona o array de medidas
        });
        // Remove o último estado do histórico de desfazer e restaura
        const prevState = history.pop();
        stagedCardsContainer.replaceWith(prevState.domState);
        window.medidasConjugConfimed = [...prevState.medidasConjugConfimed]; // Restaura o array de medidas
        console.log("Estado desfeito. Medidas conjugadas restauradas:", window.medidasConjugConfimed);
    } else {
        console.log("Não há mais alterações para desfazer.");
    }
}

// Função para refazer a última alteração desfeita
export function redoChanges() {
    if (redoHistory.length > 0) {
        const stagedCardsContainer = document.getElementById("stagedCardsContainer");
        // Adiciona o estado atual ao histórico de desfazer antes de refazer
        history.push({
            domState: stagedCardsContainer.cloneNode(true),
            medidasConjugConfimed: [...window.medidasConjugConfimed] // Clona o array de medidas
        });
        // Remove o último estado do histórico de refazer e restaura
        const nextState = redoHistory.pop();
        stagedCardsContainer.replaceWith(nextState.domState);
        window.medidasConjugConfimed = [...nextState.medidasConjugConfimed]; // Restaura o array de medidas
        console.log("Estado refeito. Medidas conjugadas restauradas:", window.medidasConjugConfimed);
    } else {
        console.log("Não há alterações para refazer.");
    }
}
