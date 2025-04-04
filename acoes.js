import { atualizarPersonagens, atualizarEdicaoPersonagens } from './personagem.js';
import { adicionarHistorico } from './historico.js';

// Pilhas para armazenar estados anteriores e futuros dos personagens
// Agora cada personagem terá seu próprio histórico de estados
let estadosAnterioresPorPersonagem = {};
let estadosFuturosPorPersonagem = {};

// Função para salvar o estado atual antes de uma modificação
export function salvarEstadoAtual(index) {
    // Se não for especificado um índice, não fazemos nada
    if (index === undefined) return;
    
    // Inicializar arrays se não existirem
    if (!estadosAnterioresPorPersonagem[index]) {
        estadosAnterioresPorPersonagem[index] = [];
    }
    if (!estadosFuturosPorPersonagem[index]) {
        estadosFuturosPorPersonagem[index] = [];
    }
    
    const personagem = window.personagens[index];
    const estadoAtual = JSON.stringify(personagem);
    estadosAnterioresPorPersonagem[index].push(estadoAtual);
    
    // Limpar estados futuros ao fazer uma nova ação
    estadosFuturosPorPersonagem[index] = [];
}

// Função para desfazer a última ação de um personagem específico
export function desfazerAcao(index) {
    // Verificar se há estados anteriores para este personagem
    if (!estadosAnterioresPorPersonagem[index] || estadosAnterioresPorPersonagem[index].length === 0) {
        alert('Não há ações para desfazer para este personagem!');
        return;
    }
    
    // Salvar estado atual para poder refazer
    const personagem = window.personagens[index];
    const estadoAtual = JSON.stringify(personagem);
    
    if (!estadosFuturosPorPersonagem[index]) {
        estadosFuturosPorPersonagem[index] = [];
    }
    estadosFuturosPorPersonagem[index].push(estadoAtual);
    
    // Restaurar estado anterior
    const estadoAnterior = estadosAnterioresPorPersonagem[index].pop();
    window.personagens[index] = JSON.parse(estadoAnterior);
    
    // Atualizar interface
    atualizarPersonagens();
    atualizarEdicaoPersonagens();
    adicionarHistorico(`Ação desfeita para ${window.personagens[index].nome}.`);
}

// Função para refazer a última ação desfeita de um personagem específico
export function refazerAcao(index) {
    // Verificar se há estados futuros para este personagem
    if (!estadosFuturosPorPersonagem[index] || estadosFuturosPorPersonagem[index].length === 0) {
        alert('Não há ações para refazer para este personagem!');
        return;
    }
    
    // Salvar estado atual para poder desfazer novamente
    const personagem = window.personagens[index];
    const estadoAtual = JSON.stringify(personagem);
    
    if (!estadosAnterioresPorPersonagem[index]) {
        estadosAnterioresPorPersonagem[index] = [];
    }
    estadosAnterioresPorPersonagem[index].push(estadoAtual);
    
    // Restaurar estado futuro
    const estadoFuturo = estadosFuturosPorPersonagem[index].pop();
    window.personagens[index] = JSON.parse(estadoFuturo);
    
    // Atualizar interface
    atualizarPersonagens();
    atualizarEdicaoPersonagens();
    adicionarHistorico(`Ação refeita para ${window.personagens[index].nome}.`);
}

// Função para resetar um personagem para seus valores iniciais
export function resetarPersonagem(index) {
    // Salvar estado atual antes de resetar
    salvarEstadoAtual(index);
    
    const personagem = window.personagens[index];
    const nome = personagem.nome;
    const vidaInicial = personagem.vidaInicial || personagem.vida;
    const manaInicial = personagem.manaInicial || personagem.manaMax;
    const armaduraInicial = personagem.armaduraInicial || personagem.armadura;
    
    // Resetar valores
    personagem.vida = vidaInicial;
    personagem.mana = manaInicial;
    personagem.armadura = armaduraInicial;
    personagem.carga = 0;
    
    // Armazenar valores iniciais para futuros resets
    personagem.vidaInicial = vidaInicial;
    personagem.manaInicial = manaInicial;
    personagem.armaduraInicial = armaduraInicial;
    
    // Atualizar interface
    atualizarPersonagens();
    atualizarEdicaoPersonagens();
    adicionarHistorico(`Personagem ${nome} resetado para valores iniciais.`);
}

// Função para resetar todos os personagens
export function resetarTodosPersonagens() {
    window.personagens.forEach((personagem, index) => {
        // Salvar estado atual antes de resetar cada personagem
        salvarEstadoAtual(index);
        
        const vidaInicial = personagem.vidaInicial || personagem.vida;
        const manaInicial = personagem.manaInicial || personagem.manaMax;
        const armaduraInicial = personagem.armaduraInicial || personagem.armadura;
        
        // Resetar valores
        personagem.vida = vidaInicial;
        personagem.mana = manaInicial;
        personagem.armadura = armaduraInicial;
        personagem.carga = 0;
        
        // Armazenar valores iniciais para futuros resets
        personagem.vidaInicial = vidaInicial;
        personagem.manaInicial = manaInicial;
        personagem.armaduraInicial = armaduraInicial;
    });
    
    // Atualizar interface
    atualizarPersonagens();
    atualizarEdicaoPersonagens();
    adicionarHistorico('Todos os personagens foram resetados para valores iniciais.');
}
