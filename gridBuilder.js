async function getGridHTML() {
    try {
        const response = await fetch("games.json");
        const games = await response.json();

        let htmlContent = '<div class="grid-container">';

        for (const game of games) {
            const tagsHTML = game.tags.map(tag => `<span class="tag">${tag}</span>`).join('');

            htmlContent += `
                <div class="card">
                    <img class="card-img" src="${game.image}" alt="${game.title}">
                    <h2 class="card-title">${game.title}</h2>
                    <p class="card-sub">Temps de prod : ${game.prod_time}</p>
                    <p class="card-desc">${game.description}</p>
                    <div class="tags-container">
                        ${tagsHTML}
                    </div>
                </div>
            `;
        }

        htmlContent += '</div>';
        return htmlContent;
    } catch (e) {
        console.error("Erreur lors de la lecture du JSON :", e);
        return "";
    }
}