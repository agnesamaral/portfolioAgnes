const cardContainer = document.querySelector(".card-container");
const casesContainer = document.querySelector(".cases-container");
const buscaInput = document.querySelector("#busca");
const searchContainer = document.querySelector('.search');
const searchButton = document.querySelector('.search-button');

let dadosCompletos = [];
let casesCompletos = [];

async function carregarDados() {
    try {
        const resposta = await fetch("data.json");
        const dados = await resposta.json();
        // Prepara os dados de experiência, adicionando uma string de busca unificada
        dadosCompletos = dados.experiencias.map(exp => ({
            ...exp,
            busca: [exp.nome, exp.cargo, ...exp.descricao].join(" ").toLowerCase()
        }));
        // Prepara os dados de cases, adicionando uma string de busca unificada
        casesCompletos = dados.cases.map(c => ({
            ...c,
            busca: [c.titulo, c.descricao].join(" ").toLowerCase()
        }));
        renderizarCards(dadosCompletos);
        renderizarCases(casesCompletos);
    } catch (error) {
        console.error("Erro ao buscar ou processar os dados:", error);
    }
}

function renderizarCards(dados) {
    cardContainer.innerHTML = ""; // Limpa os cards existentes antes de renderizar novos
    if (dados.length === 0) {
        cardContainer.innerHTML = `<p class="sem-resultados">Nenhum resultado encontrado.</p>`;
        return;
    }
    for (const dado of dados) {
        let article = document.createElement("article");
        // Cria uma lista <ul> com cada item da descrição em um <li>
        article.className = 'trajectory-card'; // Adiciona a nova classe
        const listaDescricao = `<ul>${dado.descricao.map(item => `<li>${item}</li>`).join("")}</ul>`;
        article.innerHTML = `<h2>${dado.nome}</h2>
        <p>${dado.data}</p>
        <p>${dado.cargo}</p>
        ${listaDescricao}`;

        cardContainer.appendChild(article);
    }
}

function renderizarCases(dados) {
    casesContainer.innerHTML = ""; // Limpa os cases existentes
    for (const dado of dados) {
        let article = document.createElement("article");
        article.className = 'case-card'; // Adiciona a nova classe
        // Só adiciona o parágrafo de descrição se ele não estiver vazio
        const descricaoHTML = dado.descricao ? `<p>${dado.descricao}</p>` : "";

        let imagemHTML = "";
        // Adiciona a imagem do case e uma classe ao article se a imagem existir
        if (dado.imagem) {
            imagemHTML = `<img class="case-imagem" src="${dado.imagem}" alt="Thumbnail do case ${dado.titulo}">`;
            article.classList.add("com-imagem");
        }

        article.innerHTML = `
            ${imagemHTML}
            <h4>${dado.titulo}</h4>
            ${descricaoHTML}
            <a href="${dado.link}" target="_blank" rel="noopener noreferrer">Saiba mais</a>
        `;
        casesContainer.appendChild(article);
    }
}

// --- Lógica para o novo campo de busca animado ---
searchButton.addEventListener('click', () => {
    searchContainer.classList.toggle('open');
    buscaInput.focus(); // Foca no campo de texto ao abrir
});

// Otimização: Usa delegação de eventos para os cards de trajetória
cardContainer.addEventListener('click', (evento) => {
    // Encontra o elemento .trajectory-card mais próximo que foi clicado
    const cardClicado = evento.target.closest('.trajectory-card');
    if (cardClicado) {
        cardClicado.classList.toggle('expanded');
    }
});

function filtrarDados() {
    const termoBusca = buscaInput.value.toLowerCase();

    // Filtra usando a string de busca pré-processada
    const experienciasFiltradas = dadosCompletos.filter(dado => dado.busca.includes(termoBusca));
    renderizarCards(experienciasFiltradas);

    // Filtra também os cases
    const casesFiltrados = casesCompletos.filter(c => c.busca.includes(termoBusca));
    renderizarCases(casesFiltrados);

}

// Adiciona um "escutador" de eventos de digitação ao campo de busca
buscaInput.addEventListener("input", filtrarDados);

// Inicia a busca inicial para popular a página
carregarDados();
