import { adicionarHistorico } from './historico.js';
import { salvarEstadoAtual } from './acoes.js';

// Função para salvar personagens no arquivo data.json
async function salvarPersonagensNoArquivo() {
    try {
        const fs = require('fs');
        const path = require('path');
        const filePath = path.join(__dirname, 'data.json');
        await fs.promises.writeFile(filePath, JSON.stringify(window.personagens, null, 2));
    } catch (error) {
        console.error('Erro ao salvar personagens:', error);
    }
}

// Função para carregar personagens do arquivo data.json
async function carregarPersonagensDoArquivo() {
    try {
        const fs = require('fs');
        const path = require('path');
        const filePath = path.join(__dirname, 'data.json');
        const data = await fs.promises.readFile(filePath, 'utf8');
        window.personagens = JSON.parse(data);
        atualizarPersonagens();
        atualizarEdicaoPersonagens();
    } catch (error) {
        console.error('Erro ao carregar personagens:', error);
        window.personagens = [];
    }
}

// Função para criar personagem
export function criarPersonagem(event) {
    event.preventDefault();
    const nome = document.getElementById('nome').value;
    const vida = parseInt(document.getElementById('vida').value) || 0;
    const mana = parseInt(document.getElementById('mana').value) || 0;
    const regen = parseInt(document.getElementById('regen').value) || 0;
    const defesa = parseInt(document.getElementById('defesa').value) || 0;
    const capacidade = parseInt(document.getElementById('capacidade').value) || 0;
    const armaduraInicial = parseInt(document.getElementById('armaduraInicial').value) || 0;

    // Validar valores
    if (!nome || vida <= 0 || mana < 0) {
        alert('Por favor, preencha todos os campos corretamente. A vida deve ser maior que 0.');
        return;
    }

    const index = window.personagens.length; // Índice do novo personagem
    
    // Calcular armadura baseada na capacidade (% da vida)
    const armaduraCapacidade = Math.floor(vida * (capacidade / 100));
    
    const personagem = {
        nome,
        vida,
        vidaInicial: vida,
        mana,
        manaMax: mana,
        manaInicial: mana,
        regen,
        defesa,
        armadura: armaduraCapacidade,
        armaduraInicial: armaduraCapacidade,
        armaduraFixa: armaduraInicial,
        armaduraFixaInicial: armaduraInicial,
        capacidade,
        carga: 0,
        danoVerdadeiro: false
    };

    window.personagens.push(personagem);
    atualizarPersonagens();
    atualizarEdicaoPersonagens();
    adicionarHistorico(`Personagem ${nome} criado com ${armaduraCapacidade} de armadura (${capacidade}% da vida) e ${armaduraInicial} de armadura inicial.`);
    salvarPersonagensNoArquivo(); // Salvar após criar
    event.target.reset();
    
    // Restaurar valor padrão da capacidade após reset
    document.getElementById('capacidade').value = '30';
}

// Função para atualizar a lista de personagens
export function atualizarPersonagens() {
    const container = document.getElementById('personagensContainer');
    if (!container) return;
    
    container.innerHTML = '';
    
    // Adicionar botão de resetar todos
    if (window.personagens.length > 0) {
        const resetarTodosDiv = document.createElement('div');
        resetarTodosDiv.className = 'resetar-todos-container';
        const resetarTodosBtn = document.createElement('button');
        resetarTodosBtn.textContent = 'Resetar Todos';
        resetarTodosBtn.onclick = window.resetarTodosPersonagens;
        resetarTodosBtn.className = 'btn-resetar-todos';
        resetarTodosDiv.appendChild(resetarTodosBtn);
        container.appendChild(resetarTodosDiv);
    }
    
    // Criar container para a grade de personagens
    const personagensGrid = document.createElement('div');
    personagensGrid.className = 'personagens-grid';
    container.appendChild(personagensGrid);
    
    window.personagens.forEach((personagem, index) => {
        const div = document.createElement('div');
        div.className = 'personagem';
        
        // Cabeçalho do card
        const header = document.createElement('h3');
        header.textContent = personagem.nome;
        div.appendChild(header);
        
        // Corpo do card
        const body = document.createElement('div');
        body.className = 'card-body';
        
        // Vida
        const vidaDiv = document.createElement('div');
        vidaDiv.className = 'atributo';
        
        const vidaValoresDiv = document.createElement('div');
        vidaValoresDiv.className = 'atributo-valores';
        
        const vidaLabel = document.createElement('span');
        vidaLabel.textContent = '❤️ Vida:';
        vidaValoresDiv.appendChild(vidaLabel);
        
        const vidaValor = document.createElement('span');
        vidaValor.className = 'valor';
        vidaValor.textContent = `${personagem.vida}/${personagem.vidaInicial}`;
        vidaValoresDiv.appendChild(vidaValor);
        
        vidaDiv.appendChild(vidaValoresDiv);
        
        // Barra de progresso para vida
        const vidaBarraDiv = document.createElement('div');
        vidaBarraDiv.className = 'barra-progresso barra-vida';
        
        const vidaBarraPreenchimento = document.createElement('div');
        vidaBarraPreenchimento.className = 'barra-progresso-preenchimento';
        const vidaPorcentagem = (personagem.vida / personagem.vidaInicial) * 100;
        vidaBarraPreenchimento.style.width = `${vidaPorcentagem}%`;
        
        vidaBarraDiv.appendChild(vidaBarraPreenchimento);
        vidaDiv.appendChild(vidaBarraDiv);
        
        body.appendChild(vidaDiv);
        
        // Mana
        const manaDiv = document.createElement('div');
        manaDiv.className = 'atributo';
        
        const manaValoresDiv = document.createElement('div');
        manaValoresDiv.className = 'atributo-valores';
        
        const manaLabel = document.createElement('span');
        manaLabel.textContent = '🔮 Mana:';
        manaValoresDiv.appendChild(manaLabel);
        
        const manaValor = document.createElement('span');
        manaValor.className = 'valor';
        manaValor.textContent = `${personagem.mana}/${personagem.manaMax}`;
        manaValoresDiv.appendChild(manaValor);
        
        manaDiv.appendChild(manaValoresDiv);
        
        // Barra de progresso para mana
        const manaBarraDiv = document.createElement('div');
        manaBarraDiv.className = 'barra-progresso barra-mana';
        
        const manaBarraPreenchimento = document.createElement('div');
        manaBarraPreenchimento.className = 'barra-progresso-preenchimento';
        const manaPorcentagem = (personagem.mana / personagem.manaMax) * 100;
        manaBarraPreenchimento.style.width = `${manaPorcentagem}%`;
        
        manaBarraDiv.appendChild(manaBarraPreenchimento);
        manaDiv.appendChild(manaBarraDiv);
        
        body.appendChild(manaDiv);
        
        // Armadura Inicial
        const armaduraDiv = document.createElement('div');
        armaduraDiv.className = 'atributo';
        
        const armaduraValoresDiv = document.createElement('div');
        armaduraValoresDiv.className = 'atributo-valores';
        
        const armaduraLabel = document.createElement('span');
        armaduraLabel.textContent = '🛡️ Armadura Inicial:';
        armaduraValoresDiv.appendChild(armaduraLabel);
        
        const armaduraValor = document.createElement('span');
        armaduraValor.className = 'valor';
        armaduraValor.textContent = `${personagem.armaduraFixa}/${personagem.armaduraFixaInicial}`;
        armaduraValoresDiv.appendChild(armaduraValor);
        
        armaduraDiv.appendChild(armaduraValoresDiv);
        
        // Barra de progresso para armadura inicial
        const armaduraBarraDiv = document.createElement('div');
        armaduraBarraDiv.className = 'barra-progresso barra-armadura';
        
        const armaduraBarraPreenchimento = document.createElement('div');
        armaduraBarraPreenchimento.className = 'barra-progresso-preenchimento';
        const armaduraPorcentagem = (personagem.armaduraFixa / personagem.armaduraFixaInicial) * 100;
        armaduraBarraPreenchimento.style.width = `${armaduraPorcentagem}%`;
        
        armaduraBarraDiv.appendChild(armaduraBarraPreenchimento);
        armaduraDiv.appendChild(armaduraBarraDiv);
        
        body.appendChild(armaduraDiv);
        
        // Armadura (Capacidade)
        const armaduraCapDiv = document.createElement('div');
        armaduraCapDiv.className = 'atributo';
        
        const armaduraCapValoresDiv = document.createElement('div');
        armaduraCapValoresDiv.className = 'atributo-valores';
        
        const armaduraCapLabel = document.createElement('span');
        armaduraCapLabel.textContent = '🛡️ Armadura (Capacidade):';
        armaduraCapValoresDiv.appendChild(armaduraCapLabel);
        
        const armaduraCapValor = document.createElement('span');
        armaduraCapValor.className = 'valor';
        armaduraCapValor.textContent = `${personagem.armadura}/${personagem.armaduraInicial}`;
        armaduraCapValoresDiv.appendChild(armaduraCapValor);
        
        armaduraCapDiv.appendChild(armaduraCapValoresDiv);
        
        // Barra de progresso para armadura de capacidade
        const armaduraCapBarraDiv = document.createElement('div');
        armaduraCapBarraDiv.className = 'barra-progresso barra-armadura';
        
        const armaduraCapBarraPreenchimento = document.createElement('div');
        armaduraCapBarraPreenchimento.className = 'barra-progresso-preenchimento';
        const armaduraCapPorcentagem = (personagem.armadura / personagem.armaduraInicial) * 100;
        armaduraCapBarraPreenchimento.style.width = `${armaduraCapPorcentagem}%`;
        
        armaduraCapBarraDiv.appendChild(armaduraCapBarraPreenchimento);
        armaduraCapDiv.appendChild(armaduraCapBarraDiv);
        
        body.appendChild(armaduraCapDiv);
        
        // Capacidade
        const capacidadeDiv = document.createElement('div');
        capacidadeDiv.className = 'atributo';
        
        const capacidadeValoresDiv = document.createElement('div');
        capacidadeValoresDiv.className = 'atributo-valores';
        
        const capacidadeLabel = document.createElement('span');
        capacidadeLabel.textContent = '🛡️ Capacidade:';
        capacidadeValoresDiv.appendChild(capacidadeLabel);
        
        const capacidadeValor = document.createElement('span');
        capacidadeValor.className = 'valor';
        capacidadeValor.textContent = `${personagem.capacidade}%`;
        capacidadeValoresDiv.appendChild(capacidadeValor);
        
        capacidadeDiv.appendChild(capacidadeValoresDiv);
        body.appendChild(capacidadeDiv);
        
        // Defesa
        const defesaDiv = document.createElement('div');
        defesaDiv.className = 'atributo';
        
        const defesaValoresDiv = document.createElement('div');
        defesaValoresDiv.className = 'atributo-valores';
        
        const defesaLabel = document.createElement('span');
        defesaLabel.textContent = '🛡️ Defesa:';
        defesaValoresDiv.appendChild(defesaLabel);
        
        const defesaValor = document.createElement('span');
        defesaValor.className = 'valor';
        defesaValor.textContent = personagem.defesa;
        defesaValoresDiv.appendChild(defesaValor);
        
        defesaDiv.appendChild(defesaValoresDiv);
        body.appendChild(defesaDiv);
        
        // Regeneração
        const regenDiv = document.createElement('div');
        regenDiv.className = 'atributo';
        
        const regenValoresDiv = document.createElement('div');
        regenValoresDiv.className = 'atributo-valores';
        
        const regenLabel = document.createElement('span');
        regenLabel.textContent = '🔄 Regeneração:';
        regenValoresDiv.appendChild(regenLabel);
        
        const regenValor = document.createElement('span');
        regenValor.className = 'valor';
        regenValor.textContent = `${personagem.regen}%`;
        regenValoresDiv.appendChild(regenValor);
        
        regenDiv.appendChild(regenValoresDiv);
        body.appendChild(regenDiv);
        
        // Carga
        const cargaDiv = document.createElement('div');
        cargaDiv.className = 'atributo';
        
        const cargaValoresDiv = document.createElement('div');
        cargaValoresDiv.className = 'atributo-valores';
        
        const cargaLabel = document.createElement('span');
        cargaLabel.textContent = '⚡ Cargas:';
        cargaValoresDiv.appendChild(cargaLabel);
        
        const btnDiminuirCarga = document.createElement('button');
        btnDiminuirCarga.textContent = '-1';
        btnDiminuirCarga.className = 'btn-carga';
        btnDiminuirCarga.onclick = () => window.ajustarCarga(index, -1);
        cargaValoresDiv.appendChild(btnDiminuirCarga);
        
        const cargaValor = document.createElement('span');
        cargaValor.className = 'valor';
        cargaValor.style.margin = '0 8px';
        cargaValor.textContent = `(${personagem.carga})`;
        cargaValoresDiv.appendChild(cargaValor);
        
        const btnAumentarCarga = document.createElement('button');
        btnAumentarCarga.textContent = '+1';
        btnAumentarCarga.className = 'btn-carga';
        btnAumentarCarga.onclick = () => window.ajustarCarga(index, 1);
        cargaValoresDiv.appendChild(btnAumentarCarga);
        
        cargaDiv.appendChild(cargaValoresDiv);
        body.appendChild(cargaDiv);
        
        div.appendChild(body);
        
        // Criar div para ações
        const acoesDiv = document.createElement('div');
        acoesDiv.className = 'acoes-personagem';
        
        // Criar div para ações principais
        const acoesPrincipais = document.createElement('div');
        acoesPrincipais.className = 'acoes-principais';
        
        // Botão de aplicar dano
        const btnDano = document.createElement('button');
        btnDano.innerHTML = '🗡️ Aplicar Dano';
        btnDano.className = 'btn-dano btn-principal';
        btnDano.onclick = () => window.abrirFormularioDano(index);
        acoesPrincipais.appendChild(btnDano);
        
        // Botão de avançar turno
        const btnAvancarTurno = document.createElement('button');
        btnAvancarTurno.innerHTML = '⏭️ Avançar Turno';
        btnAvancarTurno.className = 'btn-turno btn-principal';
        btnAvancarTurno.onclick = () => window.avancarTurno(index);
        acoesPrincipais.appendChild(btnAvancarTurno);
        
        // Botão de resetar
        const btnResetar = document.createElement('button');
        btnResetar.innerHTML = '🔄 Resetar';
        btnResetar.className = 'btn-resetar btn-principal';
        btnResetar.onclick = () => window.resetarPersonagem(index);
        acoesPrincipais.appendChild(btnResetar);
        
        // Botão de reviver
        const btnReviver = document.createElement('button');
        btnReviver.innerHTML = '✨ Reviver';
        btnReviver.className = 'btn-reviver btn-principal';
        btnReviver.onclick = () => window.reviverPersonagem(index);
        acoesPrincipais.appendChild(btnReviver);
        
        // Adicionar ações principais à div de ações
        acoesDiv.appendChild(acoesPrincipais);
        
        // Criar div para ações secundárias
        const acoesSecundarias = document.createElement('div');
        acoesSecundarias.className = 'acoes-secundarias';
        
        // Botão de mana
        const btnMana = document.createElement('button');
        btnMana.innerHTML = '🔮 Mana';
        btnMana.className = 'btn-mana btn-secundario';
        btnMana.onclick = () => window.abrirFormularioMana(index);
        acoesSecundarias.appendChild(btnMana);
        
        // Botão de vida
        const btnVida = document.createElement('button');
        btnVida.innerHTML = '❤️ Vida';
        btnVida.className = 'btn-vida btn-secundario';
        btnVida.onclick = () => window.abrirFormularioVida(index);
        acoesSecundarias.appendChild(btnVida);
        
        // Botão de armadura
        const btnArmadura = document.createElement('button');
        btnArmadura.innerHTML = '🛡️ Armadura';
        btnArmadura.className = 'btn-armadura btn-secundario';
        btnArmadura.onclick = () => window.abrirFormularioArmadura(index);
        acoesSecundarias.appendChild(btnArmadura);
        
        // Botão de desfazer
        const btnDesfazer = document.createElement('button');
        btnDesfazer.innerHTML = '↩️ Desfazer';
        btnDesfazer.className = 'btn-desfazer btn-secundario';
        btnDesfazer.onclick = () => window.desfazerAcao(index);
        acoesSecundarias.appendChild(btnDesfazer);
        
        // Botão de refazer
        const btnRefazer = document.createElement('button');
        btnRefazer.innerHTML = '↪️ Refazer';
        btnRefazer.className = 'btn-refazer btn-secundario';
        btnRefazer.onclick = () => window.refazerAcao(index);
        acoesSecundarias.appendChild(btnRefazer);
        
        // Botão de deletar
        const btnDeletar = document.createElement('button');
        btnDeletar.innerHTML = '🗑️ Deletar';
        btnDeletar.className = 'btn-deletar btn-secundario';
        btnDeletar.onclick = () => window.confirmarDeletar(index);
        acoesSecundarias.appendChild(btnDeletar);
        
        // Adicionar ações secundárias à div de ações
        acoesDiv.appendChild(acoesSecundarias);
        
        div.appendChild(acoesDiv);
        
        personagensGrid.appendChild(div);
    });
}

// Função para atualizar a lista de personagens na aba de edição
export function atualizarEdicaoPersonagens() {
    const container = document.getElementById('editarPersonagemContainer');
    if (!container) return;
    
    container.innerHTML = '';
    
    // Criar container para a grade de personagens
    const personagensGrid = document.createElement('div');
    personagensGrid.className = 'personagens-grid';
    container.appendChild(personagensGrid);
    
    window.personagens.forEach((personagem, index) => {
        const div = document.createElement('div');
        div.className = 'personagem';
        div.innerHTML = `
            <h3>${personagem.nome}</h3>
            <p>❤️ Vida: <input type="number" value="${personagem.vida}" onchange="window.editarAtributo(${index}, 'vida', this.value)"></p>
            <p>🔮 Mana: <input type="number" value="${personagem.mana}" onchange="window.editarAtributo(${index}, 'mana', this.value)"></p>
            <p>🛡️ Defesa: <input type="number" value="${personagem.defesa}" onchange="window.editarAtributo(${index}, 'defesa', this.value)"></p>
            <p>🛡️ Capacidade (%): <input type="number" value="${personagem.capacidade}" min="0" max="100" onchange="window.editarAtributo(${index}, 'capacidade', this.value)"></p>
            <p>🛡️ Armadura Inicial: <input type="number" value="${personagem.armaduraFixa}" min="0" onchange="window.editarAtributo(${index}, 'armaduraFixa', this.value)"></p>
            <p>🔄 Regen: <input type="number" value="${personagem.regen}" onchange="window.editarAtributo(${index}, 'regen', this.value)"></p>
            <p>🛡️ Armadura: ${personagem.armadura} (${personagem.capacidade}% da vida)</p>
            <p>🛡️ Armadura Inicial Restante: ${personagem.armaduraFixa}/${personagem.armaduraFixaInicial}</p>
        `;
        personagensGrid.appendChild(div);
    });
}

// Função para editar atributos
export function editarAtributo(index, atributo, valor) {
    // Salvar estado atual antes de editar
    salvarEstadoAtual(index);
    
    const personagem = window.personagens[index];
    const valorAntigo = personagem[atributo];
    personagem[atributo] = parseInt(valor);

    // Recalcular armadura se a vida ou capacidade foram alteradas
    if (atributo === 'vida' || atributo === 'capacidade') {
        const novaArmadura = Math.floor(personagem.vida * (personagem.capacidade / 100));
        personagem.armadura = novaArmadura;
        personagem.armaduraInicial = novaArmadura;
    }

    atualizarPersonagens();
    atualizarEdicaoPersonagens();
    
    // Mensagem específica para alterações de vida ou capacidade que afetam a armadura
    if (atributo === 'vida' || atributo === 'capacidade') {
        adicionarHistorico(`${atributo.charAt(0).toUpperCase() + atributo.slice(1)} de ${personagem.nome} alterada de ${valorAntigo} para ${valor}. Nova armadura: ${personagem.armadura}.`);
    } else {
        adicionarHistorico(`Atributo ${atributo} de ${personagem.nome} alterado para ${valor}.`);
    }
}

// Função para ajustar cargas
export function ajustarCarga(index, valor) {
    // Salvar estado atual antes de ajustar carga
    salvarEstadoAtual(index);
    
    const personagem = window.personagens[index];
    personagem.carga = Math.max(0, personagem.carga + valor);
    atualizarPersonagens();
    adicionarHistorico(`Carga de ${personagem.nome} ajustada para ${personagem.carga}.`);
}

// Função para abrir formulário de mana
export function abrirFormularioMana(index) {
    const personagem = window.personagens[index];
    
    // Criar overlay para o formulário
    const overlay = document.createElement('div');
    overlay.className = 'overlay';
    
    // Criar o formulário
    const formulario = document.createElement('div');
    formulario.className = 'formulario-mana';
    formulario.innerHTML = `
        <h3>Ajustar Mana de ${personagem.nome}</h3>
        <p>Mana atual: ${personagem.mana}/${personagem.manaMax}</p>
        
        <div class="campo-formulario">
            <label for="valor-mana">Valor:</label>
            <input type="number" id="valor-mana" value="10" min="1">
        </div>
        
        <div class="opcoes-formulario">
            <div class="opcao">
                <input type="checkbox" id="aumentar-mana" checked>
                <label for="aumentar-mana">Aumentar mana</label>
            </div>
            
            <div class="opcao">
                <input type="checkbox" id="reduzir-mana">
                <label for="reduzir-mana">Reduzir mana</label>
            </div>
            
            <div class="opcao">
                <input type="checkbox" id="porcentagem-mana">
                <label for="porcentagem-mana">Em porcentagem</label>
            </div>
        </div>
        
        <div class="botoes-formulario">
            <button id="btn-confirmar-mana" class="btn-confirmar">Confirmar</button>
            <button id="btn-cancelar-mana" class="btn-cancelar">Cancelar</button>
        </div>
    `;
    
    overlay.appendChild(formulario);
    document.body.appendChild(overlay);
    
    // Adicionar event listeners
    document.getElementById('aumentar-mana').addEventListener('change', function() {
        if (this.checked) {
            document.getElementById('reduzir-mana').checked = false;
        }
    });
    
    document.getElementById('reduzir-mana').addEventListener('change', function() {
        if (this.checked) {
            document.getElementById('aumentar-mana').checked = false;
        }
    });
    
    document.getElementById('btn-confirmar-mana').addEventListener('click', function() {
        processarAjusteMana(index);
    });
    
    document.getElementById('btn-cancelar-mana').addEventListener('click', function() {
        document.body.removeChild(overlay);
    });
}

// Função para processar o ajuste de mana
function processarAjusteMana(index) {
    // Salvar estado atual antes de ajustar mana
    salvarEstadoAtual(index);
    
    const personagem = window.personagens[index];
    const valorInput = parseInt(document.getElementById('valor-mana').value) || 0;
    const aumentar = document.getElementById('aumentar-mana').checked;
    const reduzir = document.getElementById('reduzir-mana').checked;
    const emPorcentagem = document.getElementById('porcentagem-mana').checked;
    
    let valorAjuste = valorInput;
    
    // Calcular valor baseado nas opções selecionadas
    if (emPorcentagem) {
        valorAjuste = Math.floor(personagem.manaMax * (valorInput / 100));
    }
    
    if (reduzir) {
        valorAjuste = -valorAjuste;
    }
    
    // Aplicar ajuste
    personagem.mana = Math.max(0, Math.min(personagem.manaMax, personagem.mana + valorAjuste));
    
    // Atualizar interface e histórico
    atualizarPersonagens();
    
    // Mensagem para o histórico
    let mensagem = '';
    if (valorAjuste > 0) {
        mensagem = `Mana de ${personagem.nome} aumentada em ${valorAjuste}`;
    } else {
        mensagem = `Mana de ${personagem.nome} reduzida em ${Math.abs(valorAjuste)}`;
    }
    
    if (emPorcentagem) {
        mensagem += ` (${valorInput}% da mana máxima)`;
    }
    
    mensagem += `. Mana atual: ${personagem.mana}.`;
    adicionarHistorico(mensagem);
    
    // Fechar o formulário
    document.body.removeChild(document.querySelector('.overlay'));
}

// Função para abrir formulário de dano
export function abrirFormularioDano(index) {
    const personagem = window.personagens[index];
    
    // Criar overlay para o formulário
    const overlay = document.createElement('div');
    overlay.className = 'overlay';
    
    // Criar o formulário
    const formulario = document.createElement('div');
    formulario.className = 'formulario-dano';
    formulario.innerHTML = `
        <h3>Aplicar Dano em ${personagem.nome}</h3>
        <p>Vida atual: ${personagem.vida}/${personagem.vidaInicial}</p>
        <p>Armadura atual: ${personagem.armadura}/${personagem.armaduraInicial}</p>
        
        <div class="campo-formulario">
            <label for="valor-dano">Valor do Dano:</label>
            <input type="number" id="valor-dano" min="1">
        </div>
        
        <div class="campo-formulario">
            <label for="repeticoes-dano">Número de Vezes:</label>
            <input type="number" id="repeticoes-dano" min="1" value="1">
        </div>
        
        <div class="opcoes-formulario">
            <div class="opcao">
                <input type="checkbox" id="dano-verdadeiro">
                <label for="dano-verdadeiro">Dano Verdadeiro</label>
            </div>
        </div>
        
        <div class="botoes-formulario">
            <button id="btn-confirmar-dano" class="btn-confirmar">Confirmar</button>
            <button id="btn-cancelar-dano" class="btn-cancelar">Cancelar</button>
        </div>
    `;
    
    overlay.appendChild(formulario);
    document.body.appendChild(overlay);
    
    // Adicionar event listeners
    document.getElementById('btn-confirmar-dano').addEventListener('click', function() {
        processarDano(index);
    });
    
    document.getElementById('btn-cancelar-dano').addEventListener('click', function() {
        document.body.removeChild(overlay);
    });
}

// Função para processar o dano
function processarDano(index) {
    // Salvar estado atual antes de aplicar dano
    salvarEstadoAtual(index);
    
    const personagem = window.personagens[index];
    const valorDano = parseInt(document.getElementById('valor-dano').value) || 0;
    const repeticoes = parseInt(document.getElementById('repeticoes-dano').value) || 1;
    const danoVerdadeiro = document.getElementById('dano-verdadeiro').checked;
    
    if (!valorDano || valorDano <= 0) {
        alert('Por favor, insira um valor de dano válido.');
        return;
    }
    
    if (repeticoes <= 0) {
        alert('O número de vezes deve ser pelo menos 1.');
        return;
    }
    
    // Aplicar dano o número de vezes especificado
    let danoTotal = 0;
    let danoArmaduraFixaTotal = 0;
    let danoArmaduraTotal = 0;
    let danoVidaTotal = 0;
    
    for (let i = 0; i < repeticoes; i++) {
        // Aplicar dano
        if (danoVerdadeiro) {
            const danoVidaAtual = Math.min(valorDano, personagem.vida);
            personagem.vida = Math.max(0, personagem.vida - valorDano);
            danoVidaTotal += danoVidaAtual;
            danoTotal += valorDano;
        } else {
            let danoRestante = valorDano;

            // Primeiro, reduzir a armadura inicial
            if (personagem.armaduraFixa > 0) {
                const danoArmaduraFixa = Math.min(danoRestante, personagem.armaduraFixa);
                personagem.armaduraFixa -= danoArmaduraFixa;
                danoArmaduraFixaTotal += danoArmaduraFixa;
                danoRestante -= danoArmaduraFixa;
            }
            
            // Se ainda houver dano, reduzir a armadura normal
            if (danoRestante > 0 && personagem.armadura > 0) {
                const danoArmadura = Math.min(danoRestante, personagem.armadura);
                personagem.armadura -= danoArmadura;
                danoArmaduraTotal += danoArmadura;
                danoRestante -= danoArmadura;
            }
            
            // Se ainda houver dano, aplicar à vida
            if (danoRestante > 0) {
                const danoVidaAtual = Math.min(danoRestante, personagem.vida);
                personagem.vida = Math.max(0, personagem.vida - danoRestante);
                danoVidaTotal += danoVidaAtual;
            }
            
            danoTotal += valorDano;
        }
        
        // Se o personagem morreu, interromper o loop
        if (personagem.vida <= 0) {
            break;
        }
    }
    
    // Atualizar interface e histórico
    atualizarPersonagens();
    
    // Mensagem para o histórico
    let mensagem = `Dano de ${valorDano}`;
    
    if (repeticoes > 1) {
        mensagem += ` aplicado ${repeticoes} vezes`;
    }
    
    mensagem += ` em ${personagem.nome}`;
    
    if (danoVerdadeiro) {
        mensagem += ' (Dano Verdadeiro)';
    }
    
    if (danoArmaduraFixaTotal > 0) {
        mensagem += `. Armadura Inicial -${danoArmaduraFixaTotal}`;
    }
    
    if (danoArmaduraTotal > 0) {
        mensagem += `. Armadura -${danoArmaduraTotal}`;
    }
    
    if (danoVidaTotal > 0) {
        mensagem += `. Vida -${danoVidaTotal}`;
    }
    
    if (personagem.vida <= 0) {
        mensagem += `. Personagem derrotado!`;
    }
    
    adicionarHistorico(mensagem);
    
    // Fechar o formulário
    document.body.removeChild(document.querySelector('.overlay'));
}

// Função para confirmar deletar personagem
export function confirmarDeletar(index) {
    const personagem = window.personagens[index];
    
    // Criar overlay para o formulário
    const overlay = document.createElement('div');
    overlay.className = 'overlay';
    
    // Criar o formulário
    const formulario = document.createElement('div');
    formulario.className = 'formulario-deletar';
    formulario.innerHTML = `
        <h3>Deletar Personagem</h3>
        <p>Tem certeza que deseja deletar o personagem <strong>${personagem.nome}</strong>?</p>
        <p class="aviso-deletar">Esta ação não pode ser desfeita!</p>
        
        <div class="botoes-formulario">
            <button id="btn-confirmar-deletar" class="btn-confirmar">Confirmar</button>
            <button id="btn-cancelar-deletar" class="btn-cancelar">Cancelar</button>
        </div>
    `;
    
    overlay.appendChild(formulario);
    document.body.appendChild(overlay);
    
    // Adicionar event listeners
    document.getElementById('btn-confirmar-deletar').addEventListener('click', function() {
        // Salvar estado atual antes de deletar
        salvarEstadoAtual();
        
        window.personagens.splice(index, 1);
        atualizarPersonagens();
        atualizarEdicaoPersonagens();
        adicionarHistorico(`Personagem ${personagem.nome} deletado.`);
        
        // Fechar o formulário
        document.body.removeChild(overlay);
    });
    
    document.getElementById('btn-cancelar-deletar').addEventListener('click', function() {
        document.body.removeChild(overlay);
    });
}

// Função para resetar personagem
export function resetarPersonagem(index) {
    // Salvar estado atual antes de resetar
    salvarEstadoAtual(index);
    
    const personagem = window.personagens[index];
    
    // Restaurar valores básicos
    personagem.vida = personagem.vidaInicial;
    personagem.mana = personagem.manaInicial;
    
    // Recalcular armadura baseada na vida inicial e capacidade
    personagem.armadura = Math.floor(personagem.vidaInicial * (personagem.capacidade / 100));
    personagem.armaduraInicial = personagem.armadura;
    
    // Resetar armadura inicial
    personagem.armaduraFixa = personagem.armaduraFixaInicial;
    
    // Resetar carga
    personagem.carga = 0;
    
    // Atualizar interface
    atualizarPersonagens();
    atualizarEdicaoPersonagens();
    
    // Adicionar ao histórico
    adicionarHistorico(
        `Personagem ${personagem.nome} resetado.\n` +
        `Vida: ${personagem.vida}/${personagem.vidaInicial}\n` +
        `Mana: ${personagem.mana}/${personagem.manaInicial}\n` +
        `Armadura (Capacidade): ${personagem.armadura} (${personagem.capacidade}%)\n` +
        `Armadura Inicial: ${personagem.armaduraFixa}`
    );
}

// Função para regenerar mana baseado na porcentagem de regeneração
export function regenerarMana(index) {
    // Salvar estado atual antes de regenerar mana
    salvarEstadoAtual(index);
    
    const personagem = window.personagens[index];
    const regenMana = Math.floor(personagem.manaMax * (personagem.regen / 100));
    personagem.mana = Math.min(personagem.manaMax, personagem.mana + regenMana);
    atualizarPersonagens();
    adicionarHistorico(`Mana de ${personagem.nome} regenerada em ${regenMana} pontos (${personagem.regen}% da mana máxima).`);
}

// Função para abrir formulário de vida
export function abrirFormularioVida(index) {
    const personagem = window.personagens[index];
    
    // Criar overlay para o formulário
    const overlay = document.createElement('div');
    overlay.className = 'overlay';
    
    // Criar o formulário
    const formulario = document.createElement('div');
    formulario.className = 'formulario-vida';
    formulario.innerHTML = `
        <h3>Ajustar Vida de ${personagem.nome}</h3>
        <p>Vida atual: ${personagem.vida}/${personagem.vidaInicial}</p>
        
        <div class="campo-formulario">
            <label for="valor-vida">Valor:</label>
            <input type="number" id="valor-vida" value="10" min="1">
        </div>
        
        <div class="opcoes-formulario">
            <div class="opcao">
                <input type="checkbox" id="aumentar-vida" checked>
                <label for="aumentar-vida">Aumentar vida</label>
            </div>
            
            <div class="opcao">
                <input type="checkbox" id="reduzir-vida">
                <label for="reduzir-vida">Reduzir vida</label>
            </div>
            
            <div class="opcao">
                <input type="checkbox" id="porcentagem-vida">
                <label for="porcentagem-vida">Em porcentagem</label>
            </div>
        </div>
        
        <div class="botoes-formulario">
            <button id="btn-confirmar-vida" class="btn-confirmar">Confirmar</button>
            <button id="btn-cancelar-vida" class="btn-cancelar">Cancelar</button>
        </div>
    `;
    
    overlay.appendChild(formulario);
    document.body.appendChild(overlay);
    
    // Adicionar event listeners
    document.getElementById('aumentar-vida').addEventListener('change', function() {
        if (this.checked) {
            document.getElementById('reduzir-vida').checked = false;
        }
    });
    
    document.getElementById('reduzir-vida').addEventListener('change', function() {
        if (this.checked) {
            document.getElementById('aumentar-vida').checked = false;
        }
    });
    
    document.getElementById('btn-confirmar-vida').addEventListener('click', function() {
        processarAjusteVida(index);
    });
    
    document.getElementById('btn-cancelar-vida').addEventListener('click', function() {
        document.body.removeChild(overlay);
    });
}

// Função para processar o ajuste de vida
function processarAjusteVida(index) {
    // Salvar estado atual antes de ajustar vida
    salvarEstadoAtual(index);
    
    const personagem = window.personagens[index];
    const valorInput = parseInt(document.getElementById('valor-vida').value) || 0;
    const aumentar = document.getElementById('aumentar-vida').checked;
    const reduzir = document.getElementById('reduzir-vida').checked;
    const emPorcentagem = document.getElementById('porcentagem-vida').checked;
    
    let valorAjuste = valorInput;
    
    if (emPorcentagem) {
        valorAjuste = Math.floor(personagem.vidaInicial * (valorInput / 100));
    }
    
    if (reduzir) {
        valorAjuste = -valorAjuste;
    }
    
    // Aplicar ajuste
    personagem.vida = Math.max(0, Math.min(personagem.vidaInicial, personagem.vida + valorAjuste));
    
    // Atualizar interface e histórico
    atualizarPersonagens();
    
    // Mensagem para o histórico
    let mensagem = '';
    if (valorAjuste > 0) {
        mensagem = `Vida de ${personagem.nome} aumentada em ${valorAjuste}`;
    } else {
        mensagem = `Vida de ${personagem.nome} reduzida em ${Math.abs(valorAjuste)}`;
    }
    
    if (emPorcentagem) {
        mensagem += ` (${valorInput}% da vida inicial)`;
    }
    
    mensagem += `. Vida atual: ${personagem.vida}.`;
    adicionarHistorico(mensagem);
    
    // Fechar o formulário
    document.body.removeChild(document.querySelector('.overlay'));
}

// Função para abrir formulário de armadura
export function abrirFormularioArmadura(index) {
    const personagem = window.personagens[index];
    
    // Criar overlay para o formulário
    const overlay = document.createElement('div');
    overlay.className = 'overlay';
    
    // Criar o formulário
    const formulario = document.createElement('div');
    formulario.className = 'formulario-armadura';
    formulario.innerHTML = `
        <h3>Ajustar Armadura de ${personagem.nome}</h3>
        <p>Armadura atual: ${personagem.armadura}/${personagem.armaduraInicial}</p>
        
        <div class="campo-formulario">
            <label for="valor-armadura">Valor:</label>
            <input type="number" id="valor-armadura" value="10" min="1">
        </div>
        
        <div class="opcoes-formulario">
            <div class="opcao">
                <input type="checkbox" id="aumentar-armadura" checked>
                <label for="aumentar-armadura">Aumentar armadura</label>
            </div>
            
            <div class="opcao">
                <input type="checkbox" id="reduzir-armadura">
                <label for="reduzir-armadura">Reduzir armadura</label>
            </div>
            
            <div class="opcao">
                <input type="checkbox" id="porcentagem-armadura">
                <label for="porcentagem-armadura">Em porcentagem</label>
            </div>
        </div>
        
        <div class="botoes-formulario">
            <button id="btn-confirmar-armadura" class="btn-confirmar">Confirmar</button>
            <button id="btn-cancelar-armadura" class="btn-cancelar">Cancelar</button>
        </div>
    `;
    
    overlay.appendChild(formulario);
    document.body.appendChild(overlay);
    
    // Adicionar event listeners
    document.getElementById('aumentar-armadura').addEventListener('change', function() {
        if (this.checked) {
            document.getElementById('reduzir-armadura').checked = false;
        }
    });
    
    document.getElementById('reduzir-armadura').addEventListener('change', function() {
        if (this.checked) {
            document.getElementById('aumentar-armadura').checked = false;
        }
    });
    
    document.getElementById('btn-confirmar-armadura').addEventListener('click', function() {
        processarAjusteArmadura(index);
    });
    
    document.getElementById('btn-cancelar-armadura').addEventListener('click', function() {
        document.body.removeChild(overlay);
    });
}

// Função para processar o ajuste de armadura
function processarAjusteArmadura(index) {
    // Salvar estado atual antes de ajustar armadura
    salvarEstadoAtual(index);
    
    const personagem = window.personagens[index];
    const valorInput = parseInt(document.getElementById('valor-armadura').value) || 0;
    const aumentar = document.getElementById('aumentar-armadura').checked;
    const reduzir = document.getElementById('reduzir-armadura').checked;
    const emPorcentagem = document.getElementById('porcentagem-armadura').checked;
    
    let valorAjuste = valorInput;
    
    if (emPorcentagem) {
        valorAjuste = Math.floor(personagem.armaduraInicial * (valorInput / 100));
    }
    
    if (reduzir) {
        valorAjuste = -valorAjuste;
    }
    
    // Aplicar ajuste
    personagem.armadura = Math.max(0, Math.min(personagem.armaduraInicial, personagem.armadura + valorAjuste));
    
    // Atualizar interface e histórico
    atualizarPersonagens();
    
    // Mensagem para o histórico
    let mensagem = '';
    if (valorAjuste > 0) {
        mensagem = `Armadura de ${personagem.nome} aumentada em ${valorAjuste}`;
    } else {
        mensagem = `Armadura de ${personagem.nome} reduzida em ${Math.abs(valorAjuste)}`;
    }
    
    if (emPorcentagem) {
        mensagem += ` (${valorInput}% da armadura inicial)`;
    }
    
    mensagem += `. Armadura atual: ${personagem.armadura}.`;
    adicionarHistorico(mensagem);
    
    // Fechar o formulário
    document.body.removeChild(document.querySelector('.overlay'));
}
