const cardContainer = document.querySelector(".card-container");
const casesContainer = document.querySelector(".cases-container");
const buscaInput = document.querySelector("#busca");
const langToggle = document.querySelector('#lang-toggle');
const mainTitle = document.querySelector('#main-title');
const introParagraph = document.querySelector('#intro');
const contactHeading = document.querySelector('#contact-heading');
const emailLink = document.querySelector('#email-link');
const whatsappLink = document.querySelector('#whatsapp-link');
const trajHeading = document.querySelector('#traj-heading');
const portfolioHeading = document.querySelector('#portfolio-heading');
const searchContainer = document.querySelector('.search');
const searchButton = document.querySelector('.search-button');

let dadosCompletos = [];
let casesCompletos = [];
// Detecta o idioma pela URL ou salvo no localStorage, padrão é 'pt'
let currentLang = new URLSearchParams(window.location.search).get('lang') || localStorage.getItem('lang') || 'pt';

const staticTranslations = {
    pt: {
        h1: "Oi, eu sou a Agnes do Amaral",
        searchPlaceholder: "Busque por atividade, cargo, etc",
        intro: "💡 Com experiência desde 2016 em copywriting, produção de conteúdo estratégico, UX writing e marketing digital. Atuei em agências e principalmente em empresas B2B, especialmente no setor de tecnologia, criando conteúdos técnicos e publicitários para geração de demanda, fortalecimento de marca e suporte à área comercial. Minha vivência inclui atividades como social media, criação de landing pages e fluxos de e-mail, metodologias ágeis, SEO e roteirização de vídeos. Sou uma profissional versátil, colaborativa e sempre aberta a novos aprendizados.",
        contactHeading: "Vamos trabalhar juntos?",
        emailText: "E-mail",
        whatsappText: "WhatsApp",
        trajHeading: "Minha Trajetória Profissional",
        portfolioHeading: "Portfólio",
        noResults: "Nenhum resultado encontrado.",
        learnMore: "Saiba mais"
    },
    en: {
        h1: "Hi, I'm Agnes do Amaral",
        searchPlaceholder: "Search by activity, position, etc",
        intro: "💡 I have been working since 2016 in copywriting, strategic content production, UX writing and digital marketing. I've worked in agencies and mainly in B2B tech companies, creating technical and advertising content to drive demand, strengthen brands and support sales teams. My experience includes social media, landing pages and email flows, agile methodologies, SEO and video scripting. I'm versatile, collaborative and always open to new learning.",
        contactHeading: "Shall we work together?",
        emailText: "E-mail",
        whatsappText: "WhatsApp",
        trajHeading: "My Professional Background",
        portfolioHeading: "Portfolio",
        noResults: "No results found.",
        learnMore: "Learn more"
    }
};

async function carregarDados() {
    try {
        const resposta = await fetch("data.json");
        const dados = await resposta.json();
        // Prepara os dados de experiência, adicionando uma string de busca unificada
        dadosCompletos = dados.experiencias.map(exp => ({
            ...exp,
            // cria buscas em ambos os idiomas quando houver campos _en
            busca: [exp.nome, exp.cargo, ...exp.descricao].join(" ").toLowerCase(),
            busca_en: [exp.nome_en || exp.nome, exp.cargo_en || exp.cargo, ...(exp.descricao_en || exp.descricao)].join(" ").toLowerCase()
        }));
        // Prepara os dados de cases, adicionando uma string de busca unificada
        casesCompletos = dados.cases.map(c => ({
            ...c,
            busca: [c.titulo, c.descricao].join(" ").toLowerCase(),
            busca_en: [c.titulo_en || c.titulo, c.descricao_en || c.descricao].join(" ").toLowerCase()
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
        cardContainer.innerHTML = `<p class="sem-resultados">${staticTranslations[currentLang].noResults}</p>`;
        return;
    }
    for (const dado of dados) {
        let article = document.createElement("article");
        // Cria uma lista <ul> com cada item da descrição em um <li>
        article.className = 'trajectory-card'; // Adiciona a nova classe
        // usa versão em inglês quando disponível
        const nome = (currentLang === 'en' && dado.nome_en) ? dado.nome_en : dado.nome;
        const cargo = (currentLang === 'en' && dado.cargo_en) ? dado.cargo_en : dado.cargo;
        const data = (currentLang === 'en' && dado.data_en) ? dado.data_en : dado.data;
        const descricaoArray = (currentLang === 'en' && dado.descricao_en) ? dado.descricao_en : dado.descricao;
        const listaDescricao = `<ul>${descricaoArray.map(item => `<li>${item}</li>`).join("")}</ul>`;
        article.innerHTML = `<h2>${nome}</h2>
        <p>${data}</p>
        <p>${cargo}</p>
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
        // texto em inglês quando disponível
        const titulo = (currentLang === 'en' && dado.titulo_en) ? dado.titulo_en : dado.titulo;
        const descricaoTexto = (currentLang === 'en' && dado.descricao_en) ? dado.descricao_en : dado.descricao;
        const descricaoHTML = descricaoTexto ? `<p>${descricaoTexto}</p>` : "";

        let imagemHTML = "";
        // Adiciona a imagem do case e uma classe ao article se a imagem existir
        if (dado.imagem) {
            imagemHTML = `<img class="case-imagem" src="${dado.imagem}" alt="Thumbnail do case ${titulo}">`;
            article.classList.add("com-imagem");
        }

        article.innerHTML = `
            ${imagemHTML}
            <h4>${titulo}</h4>
            ${descricaoHTML}
            <a href="${dado.link}" target="_blank" rel="noopener noreferrer">${staticTranslations[currentLang].learnMore}</a>
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
    const experienciasFiltradas = dadosCompletos ? dadosCompletos.filter(dado => {
        return (currentLang === 'en' ? dado.busca_en : dado.busca).includes(termoBusca);
    }) : [];
    renderizarCards(experienciasFiltradas);

    // Filtra também os cases
    const casesFiltrados = casesCompletos.filter(c => {
        return (currentLang === 'en' ? c.busca_en : c.busca).includes(termoBusca);
    });
    renderizarCases(casesFiltrados);

}

// Adiciona um "escutador" de eventos de digitação ao campo de busca
buscaInput.addEventListener("input", filtrarDados);

// Inicia a busca inicial para popular a página
carregarDados();

// Atualiza textos estáticos e renderizações quando alterna o idioma
function applyLanguage() {
    const tr = staticTranslations[currentLang];
    document.documentElement.lang = (currentLang === 'en') ? 'en' : 'pt-BR';
    mainTitle.textContent = tr.h1;
    introParagraph.textContent = tr.intro;
    contactHeading.textContent = tr.contactHeading;
    // Ajusta texto dos links (mantém href original)
    const emailSvg = emailLink.querySelector('svg');
    emailLink.innerHTML = '';
    if (emailSvg) emailLink.appendChild(emailSvg);
    emailLink.append(` ${tr.emailText}`);

    const whatsappSvg = whatsappLink.querySelector('svg');
    whatsappLink.innerHTML = '';
    if (whatsappSvg) whatsappLink.appendChild(whatsappSvg);
    whatsappLink.append(` ${tr.whatsappText}`);

    trajHeading.textContent = tr.trajHeading;
    portfolioHeading.textContent = tr.portfolioHeading;
    buscaInput.placeholder = tr.searchPlaceholder;
    // Atualiza o label do botão
    langToggle.textContent = (currentLang === 'en') ? 'PT' : 'EN';
    langToggle.setAttribute('aria-pressed', currentLang === 'en');
    // Re-renderiza com o idioma atual (só se os dados já estiverem carregados)
    if (dadosCompletos.length > 0) filtrarDados();
}

langToggle.addEventListener('click', () => {
    currentLang = (currentLang === 'pt') ? 'en' : 'pt';
    localStorage.setItem('lang', currentLang); // Salva a preferência
    applyLanguage();
});

// Aplica o idioma inicial (pt)
applyLanguage();
