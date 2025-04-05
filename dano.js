import { atualizarPersonagens } from './personagem.js';
import { adicionarHistorico } from './historico.js';
import { salvarEstadoAtual } from './acoes.js';

// Função para aplicar dano - mantida para compatibilidade, mas agora usa o formulário
export function aplicarDano(index) {
    window.abrirFormularioDano(index);
}

// Função para alternar dano verdadeiro para um personagem específico
export function alternarDanoVerdadeiro(index) {
    const personagem = window.personagens[index];
    personagem.danoVerdadeiro = !personagem.danoVerdadeiro;
    atualizarPersonagens();
}

// Função para avançar turno
export function avancarTurno(index) {
    // Salvar estado atual antes de avançar turno
    salvarEstadoAtual(index);
    
    const personagem = window.personagens[index];
    personagem.carga += 1;
    const regenMana = Math.floor(personagem.manaMax * (personagem.regen / 100));
    personagem.mana = Math.min(personagem.manaMax, personagem.mana + regenMana);
    atualizarPersonagens();
    adicionarHistorico(`Turno avançado para ${personagem.nome}. Mana regenerada em ${regenMana}.`);
}

// Função para reviver personagem
export function reviverPersonagem(index) {
    // Salvar estado atual antes de reviver
    salvarEstadoAtual(index);
    
    const personagem = window.personagens[index];
    
    // Verificar se o personagem está morto (vida = 0)
    if (personagem.vida > 0) {
        adicionarHistorico(`Não é possível reviver ${personagem.nome}. O personagem ainda está vivo.`);
        return;
    }
    
    personagem.vida = 1;
    personagem.mana = 0;
    // Recalcular armadura baseada na nova vida e capacidade
    personagem.armadura = Math.floor(personagem.vida * (personagem.capacidade / 100));
    atualizarPersonagens();
    adicionarHistorico(`Personagem ${personagem.nome} revivido com ${personagem.armadura} de armadura.`);
}

// Getter para o estado do dano verdadeiro de um personagem específico
export function getDanoVerdadeiro(index) {
    if (index !== undefined && window.personagens[index]) {
        return window.personagens[index].danoVerdadeiro || false;
    }
    return false;
}