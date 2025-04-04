// Inicialização de variáveis
let personagens = [];
let historico = [];
let danoVerdadeiro = false;

// Função para abrir abas
function openTab(evt, tabName) {
    const tabcontent = document.getElementsByClassName('tabcontent');
    for (let i = 0; i < tabcontent.length; i++) {
        tabcontent[i].style.display = 'none';
    }
    const tablinks = document.getElementsByClassName('tablink');
    for (let i = 0; i < tablinks.length; i++) {
        tablinks[i].className = tablinks[i].className.replace(' active', '');
    }
    document.getElementById(tabName).style.display = 'block';
    evt.currentTarget.className += ' active';
}

// Função para criar personagem
document.getElementById('formCriarPersonagem').addEventListener('submit', function(event) {
    event.preventDefault();
    const nome = document.getElementById('nome').value;
    const vida = parseInt(document.getElementById('vida').value);
    const mana = parseInt(document.getElementById('mana').value);
    const regen = parseInt(document.getElementById('regen').value);
    const defesa = parseInt(document.getElementById('defesa').value);
    const armadura = parseInt(document.getElementById('armadura').value);

    const personagem = {
        nome,
        vida,
        mana,
        manaMax: mana,
        regen,
        defesa,
        armadura,
        carga: 0
    };

    personagens.push(personagem);
    atualizarPersonagens();
    atualizarEdicaoPersonagens();
    adicionarHistorico(`Personagem ${nome} criado.`);
    event.target.reset();
});

// Função para atualizar a lista de personagens
function atualizarPersonagens() {
    const container = document.getElementById('personagensContainer');
    container.innerHTML = '';
    personagens.forEach((personagem, index) => {
        const div = document.createElement('div');
        div.className = 'personagem';
        div.innerHTML = `
            <h3>${personagem.nome}</h3>
            <p>Vida: ${personagem.vida}</p>
            <p>Mana: ${personagem.mana}</p>
            <p>Defesa: ${personagem.defesa}</p>
            <p>Armadura: ${personagem.armadura}</p>
            <p>Carga: <button onclick="ajustarCarga(${index}, -1)">-</button> ${personagem.carga} <button onclick="ajustarCarga(${index}, 1)">+</button></p>
            <label class="switch">
                <input type="checkbox" onchange="alternarDanoVerdadeiro()">
                <span class="slider"></span>
            </label>
            <span>Dano Verdadeiro</span>
            <button onclick="aplicarDano(${index})">Aplicar Dano</button>
            <button onclick="avancarTurno(${index})">Avançar Turno</button>
            <button onclick="confirmarDeletar(${index})">Deletar</button>
            ${personagem.vida <= 0 ? '<button onclick="reviverPersonagem(' + index + ')">Reviver</button>' : ''}
        `;
        container.appendChild(div);
    });
}

// Função para atualizar a lista de personagens na aba de edição
function atualizarEdicaoPersonagens() {
    const container = document.getElementById('editarPersonagemContainer');
    container.innerHTML = '';
    personagens.forEach((personagem, index) => {
        const div = document.createElement('div');
        div.className = 'personagem';
        div.innerHTML = `
            <h3>${personagem.nome}</h3>
            <p>Vida: <input type="number" value="${personagem.vida}" onchange="editarAtributo(${index}, 'vida', this.value)"></p>
            <p>Mana: <input type="number" value="${personagem.mana}" onchange="editarAtributo(${index}, 'mana', this.value)"></p>
            <p>Regen: <input type="number" value="${personagem.regen}" onchange="editarAtributo(${index}, 'regen', this.value)"></p>
            <p>Defesa: <input type="number" value="${personagem.defesa}" onchange="editarAtributo(${index}, 'defesa', this.value)"></p>
            <p>Armadura: <input type="number" value="${personagem.armadura}" onchange="editarAtributo(${index}, 'armadura', this.value)"></p>
        `;
        container.appendChild(div);
    });
}

// Função para aplicar dano
function aplicarDano(index) {
    const personagem = personagens[index];
    const dano = parseInt(prompt('Digite o valor do dano:'));

    if (danoVerdadeiro) {
        personagem.vida = Math.max(0, personagem.vida - dano);
    } else {
        if (personagem.armadura > 0) {
            const danoArmadura = Math.min(dano, personagem.armadura);
            personagem.armadura -= danoArmadura;
            const danoRestante = dano - danoArmadura;
            if (danoRestante > 0) {
                personagem.vida = Math.max(0, personagem.vida - danoRestante);
            }
        } else {
            personagem.vida = Math.max(0, personagem.vida - dano);
        }
    }

    atualizarPersonagens();
    adicionarHistorico(`Dano de ${dano} aplicado a ${personagem.nome}.`);
}

// Função para alternar dano verdadeiro
function alternarDanoVerdadeiro() {
    danoVerdadeiro = !danoVerdadeiro;
    adicionarHistorico(`Dano verdadeiro ${danoVerdadeiro ? 'ativado' : 'desativado'}.`);
}

// Função para ajustar cargas
function ajustarCarga(index, valor) {
    const personagem = personagens[index];
    personagem.carga += valor;
    atualizarPersonagens();
    adicionarHistorico(`Carga de ${personagem.nome} ajustada para ${personagem.carga}.`);
}

// Função para editar atributos
function editarAtributo(index, atributo, valor) {
    const personagem = personagens[index];
    personagem[atributo] = parseInt(valor);
    atualizarPersonagens();
    atualizarEdicaoPersonagens();
    adicionarHistorico(`Atributo ${atributo} de ${personagem.nome} alterado para ${valor}.`);
}

// Função para avançar turno
function avancarTurno(index) {
    const personagem = personagens[index];
    personagem.carga += 1;
    const regenMana = Math.floor(personagem.manaMax * (personagem.regen / 100));
    personagem.mana = Math.min(personagem.manaMax, personagem.mana + regenMana);
    atualizarPersonagens();
    adicionarHistorico(`Turno avançado para ${personagem.nome}. Mana regenerada em ${regenMana}.`);
}

// Função para confirmar deletar personagem
function confirmarDeletar(index) {
    if (confirm('Tem certeza que deseja deletar este personagem?')) {
        const personagem = personagens[index];
        personagens.splice(index, 1);
        atualizarPersonagens();
        atualizarEdicaoPersonagens();
        adicionarHistorico(`Personagem ${personagem.nome} deletado.`);
    }
}

// Função para reviver personagem
function reviverPersonagem(index) {
    const personagem = personagens[index];
    personagem.vida = 1;
    personagem.mana = 0;
    personagem.armadura = 0;
    atualizarPersonagens();
    adicionarHistorico(`Personagem ${personagem.nome} revivido.`);
}

// Função para adicionar ao histórico
function adicionarHistorico(acao) {
    const historicoLista = document.getElementById('historicoLista');
    const li = document.createElement('li');
    const dataHora = new Date().toLocaleString();
    li.textContent = `[${dataHora}] ${acao}`;
    historicoLista.insertBefore(li, historicoLista.firstChild);
}

// Carregar dados ao iniciar
function carregarDados() {
    const dadosSalvos = localStorage.getItem('personagens');
    if (dadosSalvos) {
        personagens = JSON.parse(dadosSalvos);
        atualizarPersonagens();
        atualizarEdicaoPersonagens();
    }
}

// Salvar dados ao sair
window.addEventListener('beforeunload', function() {
    localStorage.setItem('personagens', JSON.stringify(personagens));
});

// Inicializar
carregarDados();
