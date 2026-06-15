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

        initializeMenu();

    } catch (error) {
        console.error("Erro ao carregar header/footer:", error);
    }
}

function initializeMenu() {
    const menuBtn = document.querySelector(".menu-btn");
    const closeBtn = document.querySelector("#close-menu-btn");
    const sideMenu = document.querySelector("#side-menu");
    const overlay = document.querySelector("#menu-overlay");

    if (!menuBtn || !closeBtn || !sideMenu || !overlay) return;

    menuBtn.addEventListener("click", () => {
        sideMenu.classList.add("open");
        overlay.classList.add("active");
    });

    closeBtn.addEventListener("click", () => {
        sideMenu.classList.remove("open");
        overlay.classList.remove("active");
    });

    overlay.addEventListener("click", () => {
        sideMenu.classList.remove("open");
        overlay.classList.remove("active");
    });
}