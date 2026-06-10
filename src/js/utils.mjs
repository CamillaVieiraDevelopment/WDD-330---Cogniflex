// src/js/utils.mjs

export async function renderHeaderFooter() {
    try {
        // CORREÇÃO: Usando caminhos absolutos a partir da raiz do servidor do Vite (/ significa src/)
        const headerResponse = await fetch('/partials/header.html');
        const footerResponse = await fetch('/partials/footer.html');

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
            // Ativa os comportamentos de clique do menu hambúrguer
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
        menuBtn.addEventListener('click', () => {
            sideMenu.classList.add('open');
            overlay.classList.add('show');
        });

        const closeMenu = () => {
            sideMenu.classList.remove('open');
            overlay.classList.remove('show');
        };

        if (closeBtn) closeBtn.addEventListener('click', closeMenu);
        overlay.addEventListener('click', closeMenu);
    }
}