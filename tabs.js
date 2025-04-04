// Função para abrir abas
export function openTab(tabName) {
    console.log('Abrindo aba:', tabName);
    
    // Esconder todos os conteúdos de abas
    const tabcontent = document.getElementsByClassName('tabcontent');
    for (let i = 0; i < tabcontent.length; i++) {
        tabcontent[i].style.display = 'none';
    }
    
    // Remover a classe active de todas as abas
    const tablinks = document.getElementsByClassName('tablink');
    for (let i = 0; i < tablinks.length; i++) {
        tablinks[i].classList.remove('active');
    }
    
    // Mostrar o conteúdo da aba selecionada
    const tabElement = document.getElementById(tabName);
    if (tabElement) {
        tabElement.style.display = 'block';
        console.log('Aba encontrada e exibida:', tabName);
    } else {
        console.error('Aba não encontrada:', tabName);
    }
    
    // Adicionar a classe active ao botão que abriu a aba
    const currentTab = Array.from(tablinks).find(tab => {
        const onclickAttr = tab.getAttribute('onclick');
        return onclickAttr && onclickAttr.includes(`'${tabName}'`);
    });
    
    if (currentTab) {
        currentTab.classList.add('active');
        console.log('Botão da aba ativado:', tabName);
    } else {
        console.error('Botão da aba não encontrado:', tabName);
    }
}

// Função para inicializar as abas
export function initTabs() {
    console.log('Inicializando abas...');
    
    // Verificar se os elementos das abas existem
    const tablinks = document.getElementsByClassName('tablink');
    const tabcontents = document.getElementsByClassName('tabcontent');
    
    console.log(`Encontrados ${tablinks.length} botões de abas e ${tabcontents.length} conteúdos de abas`);
    
    if (tablinks.length > 0 && tabcontents.length > 0) {
        // Abrir a primeira aba por padrão
        openTab('CriarPersonagem');
        
        // Adicionar a classe active ao primeiro botão
        tablinks[0].classList.add('active');
        
        // Garantir que todas as abas estejam inicializadas
        for (let i = 0; i < tabcontents.length; i++) {
            const tab = tabcontents[i];
            if (tab.id !== 'CriarPersonagem') {
                tab.style.display = 'none';
            }
        }
    } else {
        console.error('Elementos de abas não encontrados!');
    }
}