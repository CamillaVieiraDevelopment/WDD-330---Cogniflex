// src/js/utils.mjs

export async function renderHeaderFooter() {
    try {
        // Busca os conteúdos HTML dos arquivos parciais
        const headerResponse = await fetch('./partials/header.html');
        const footerResponse = await fetch('./partials/footer.html');

        if (!headerResponse.ok || !footerResponse.ok) {
            throw new Error('Erro ao carregar os componentes de cabeçalho ou rodapé.');
        }

        const headerHtml = await headerResponse.text();
        const footerHtml = await footerResponse.text();

        // Procura os contêineres nas páginas e injeta o conteúdo
        const headerContainer = document.getElementById('main-header');
        const footerContainer = document.getElementById('main-footer');

        if (headerContainer) {
            headerContainer.innerHTML = headerHtml;
            // ATENÇÃO: Ativa os comportamentos de clique do menu hambúrguer assim que ele nasce no DOM
            setupMenuEvents();
        }
        if (footerContainer) {
            footerContainer.innerHTML = footerHtml;
        }

    } catch (error) {
        console.error('Falha na renderização modular:', error);
    }
}

// Função gerenciadora dos eventos do Menu Lateral
function setupMenuEvents() {
    const menuBtn = document.querySelector('.menu-btn');
    const closeBtn = document.getElementById('close-menu-btn');
    const sideMenu = document.getElementById('side-menu');
    const overlay = document.getElementById('menu-overlay');

    if (menuBtn && sideMenu && overlay) {
        // Evento: Abrir menu ao clicar no ícone hambúrguer
        menuBtn.addEventListener('click', () => {
            sideMenu.classList.add('open');
            overlay.classList.add('show');
        });

        // Função interna reutilizável para fechar o menu
        const closeMenu = () => {
            sideMenu.classList.remove('open');
            overlay.classList.remove('show');
        };

        // Eventos: Fechar ao clicar no 'X' ou na máscara escura de fundo
        if (closeBtn) closeBtn.addEventListener('click', closeMenu);
        overlay.addEventListener('click', closeMenu);
    }
}