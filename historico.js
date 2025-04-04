// Classe para gerenciar o histórico
class HistoricoManager {
    constructor() {
        this.historico = [];
        this.maxEntries = 1000; // Limite máximo de entradas no histórico
        this.loadHistorico();
    }

    // Formatar timestamp para o histórico
    formatTimestamp() {
        const now = new Date();
        return now.toLocaleString('pt-BR', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit'
        });
    }

    // Adicionar entrada ao histórico
    addEntry(texto) {
        const timestamp = this.formatTimestamp();
        const entry = `[${timestamp}] ${texto}`;
        
        // Adicionar ao início do array
        this.historico.unshift(entry);
        
        // Limitar o tamanho do histórico
        if (this.historico.length > this.maxEntries) {
            this.historico = this.historico.slice(0, this.maxEntries);
        }
        
        // Atualizar a exibição e salvar
        this.updateDisplay();
        this.saveHistorico();
    }

    // Carregar histórico do localStorage
    loadHistorico() {
        try {
            const saved = localStorage.getItem('historico');
            if (saved) {
                this.historico = JSON.parse(saved);
            }
        } catch (error) {
            console.error('Erro ao carregar histórico:', error);
            this.historico = [];
        }
        this.updateDisplay();
    }

    // Salvar histórico no localStorage
    saveHistorico() {
        try {
            localStorage.setItem('historico', JSON.stringify(this.historico));
        } catch (error) {
            console.error('Erro ao salvar histórico:', error);
        }
    }

    // Limpar histórico
    clearHistorico() {
        this.historico = [];
        this.saveHistorico();
        this.updateDisplay();
    }

    // Filtrar histórico
    filterHistorico(searchTerm) {
        if (!searchTerm) {
            return this.historico;
        }
        const term = searchTerm.toLowerCase();
        return this.historico.filter(entry => entry.toLowerCase().includes(term));
    }

    // Atualizar exibição do histórico
    updateDisplay() {
        const historicoLista = document.getElementById('historicoLista');
        const searchInput = document.getElementById('historicoSearchInput');
        const searchTerm = searchInput ? searchInput.value : '';
        
        if (historicoLista) {
            historicoLista.innerHTML = '';
            const filteredHistorico = this.filterHistorico(searchTerm);
            
            filteredHistorico.forEach(entry => {
                const li = document.createElement('li');
                li.textContent = entry;
                historicoLista.appendChild(li);
            });
        }
    }
}

// Criar instância global do gerenciador de histórico
const historicoManager = new HistoricoManager();

// Exportar funções para uso em outros módulos
export function adicionarHistorico(texto) {
    historicoManager.addEntry(texto);
}

export function initHistoricoSearch() {
    const searchInput = document.getElementById('historicoSearchInput');
    const limparHistoricoBtn = document.getElementById('limparHistorico');
    
    if (searchInput) {
        searchInput.addEventListener('input', () => {
            historicoManager.updateDisplay();
        });
    }
    
    if (limparHistoricoBtn) {
        limparHistoricoBtn.addEventListener('click', () => {
            document.getElementById('formularioLimparHistorico').style.display = 'flex';
        });
    }
}

export function confirmarLimparHistorico() {
    historicoManager.clearHistorico();
    document.getElementById('formularioLimparHistorico').style.display = 'none';
}

export function cancelarLimparHistorico() {
    document.getElementById('formularioLimparHistorico').style.display = 'none';
}