import { criarPersonagem, atualizarPersonagens, atualizarEdicaoPersonagens, editarAtributo, ajustarCarga, confirmarDeletar, resetarPersonagem, abrirFormularioMana, abrirFormularioDano, abrirFormularioVida, abrirFormularioArmadura } from './personagem.js';
import { aplicarDano, alternarDanoVerdadeiro, avancarTurno, reviverPersonagem, getDanoVerdadeiro } from './dano.js';
import { adicionarHistorico, initHistoricoSearch, confirmarLimparHistorico, cancelarLimparHistorico } from './historico.js';
import { openTab, initTabs } from './tabs.js';
import { desfazerAcao, refazerAcao, resetarTodosPersonagens } from './acoes.js';

// Inicialização de variáveis
window.personagens = [];

// Função para salvar personagens no localStorage
function salvarPersonagens() {
    localStorage.setItem('personagens', JSON.stringify(window.personagens));
}

// Função para carregar personagens do localStorage
function carregarPersonagens() {
    const dados = localStorage.getItem('personagens');
    if (dados) {
        window.personagens = JSON.parse(dados);
        atualizarPersonagens();
        atualizarEdicaoPersonagens();
    }
}

// Expor funções globalmente
window.openTab = openTab;
window.aplicarDano = aplicarDano;
window.alternarDanoVerdadeiro = alternarDanoVerdadeiro;
window.getDanoVerdadeiro = getDanoVerdadeiro;
window.ajustarCarga = ajustarCarga;
window.abrirFormularioMana = abrirFormularioMana;
window.abrirFormularioDano = abrirFormularioDano;
window.abrirFormularioVida = abrirFormularioVida;
window.abrirFormularioArmadura = abrirFormularioArmadura;
window.avancarTurno = avancarTurno;
window.editarAtributo = editarAtributo;
window.confirmarDeletar = confirmarDeletar;
window.reviverPersonagem = reviverPersonagem;
window.adicionarHistorico = adicionarHistorico;
window.confirmarLimparHistorico = confirmarLimparHistorico;
window.cancelarLimparHistorico = cancelarLimparHistorico;
window.desfazerAcao = desfazerAcao;
window.refazerAcao = refazerAcao;
window.resetarPersonagem = resetarPersonagem;
window.resetarTodosPersonagens = resetarTodosPersonagens;
window.salvarPersonagens = salvarPersonagens;

// Inicializar
document.addEventListener('DOMContentLoaded', function() {
    console.log('DOM carregado, inicializando aplicação...');
    
    // Inicializar abas
    initTabs();
    
    // Inicializar pesquisa no histórico
    initHistoricoSearch();
    
    // Carregar dados salvos
    carregarPersonagens();
    
    // Adicionar event listeners para o formulário de criação de personagem
    document.getElementById('formCriarPersonagem').addEventListener('submit', criarPersonagem);
    
    // Event listeners para o formulário de limpar histórico
    document.getElementById('confirmarLimparHistorico').addEventListener('click', confirmarLimparHistorico);
    document.getElementById('cancelarLimparHistorico').addEventListener('click', cancelarLimparHistorico);
    
    // Adicionar event listeners para as abas
    const tablinks = document.getElementsByClassName('tablink');
    for (let i = 0; i < tablinks.length; i++) {
        tablinks[i].addEventListener('click', function() {
            const tabName = this.getAttribute('onclick').match(/'([^']+)'/)[1];
            openTab(tabName);
            
            // Atualizar as abas relevantes quando abertas
            if (tabName === 'GerenciarPersonagem') {
                atualizarPersonagens();
            } else if (tabName === 'EditarPersonagem') {
                atualizarEdicaoPersonagens();
            }
        });
    }
    
    // Salvar dados quando a página for fechada
    window.addEventListener('beforeunload', function() {
        salvarPersonagens();
    });
    
    console.log('Inicialização concluída!');
});