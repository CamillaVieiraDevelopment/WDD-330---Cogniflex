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

        if (headerContainer) headerContainer.innerHTML = headerHtml;
        if (footerContainer) footerContainer.innerHTML = footerHtml;

    } catch (error) {
        console.error('Falha na renderização modular:', error);
    }
}