export async function renderHeaderFooter() {
    try {
        const headerContainer = document.getElementById("main-header");
        const footerContainer = document.getElementById("main-footer");

        if (headerContainer) {
            const headerResponse = await fetch("/partials/header.html");
            headerContainer.innerHTML = await headerResponse.text();
        }

        if (footerContainer) {
            const footerResponse = await fetch("/partials/footer.html");
            footerContainer.innerHTML = await footerResponse.text();
        }

    } catch (error) {
        console.error("Erro ao carregar header/footer:", error);
    }
}