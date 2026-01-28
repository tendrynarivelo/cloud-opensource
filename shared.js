document.addEventListener("DOMContentLoaded", () => {
    loadSharedFiles("shared-with-me");
    setupExpirationToggle();
});

/**
 * Charger les fichiers partagés
 */
function loadSharedFiles(type) {
    fetch(`api/shared_files.php?type=${type}`)
        .then(response => response.json())
        .then(files => {
            const list = document.getElementById("sharedFilesList");
            const emptyState = document.getElementById("sharedEmptyState");

            // Supprimer les anciennes lignes
            list.querySelectorAll(".file-row-data").forEach(row => row.remove());

            if (!files || files.length === 0) {
                emptyState.style.display = "block";
                return;
            }

            emptyState.style.display = "none";

            files.forEach(file => {
                const row = document.createElement("div");
                row.className = "file-row file-row-data";

                row.innerHTML = `
                    <div>${file.nom}</div>
                    <div>${file.type}</div>
                    <div>${file.partage_avec}</div>
                    <div>${file.permission}</div>
                    <div>${file.expiration ?? "Aucune"}</div>
                    <div>
                        <a href="${file.chemin}" class="btn btn-secondary">
                            <i class="fas fa-download"></i>
                        </a>
                    </div>
                `;

                list.appendChild(row);
            });

            updateStats(files);
        })
        .catch(error => {
            console.error("Erreur lors du chargement des fichiers partagés :", error);
        });
}

/**
 * Filtrer les fichiers partagés
 */
function filterSharedFiles(type) {
    loadSharedFiles(type);
}

/**
 * Mettre à jour les statistiques
 */
function updateStats(files) {
    document.getElementById("totalShared").textContent = files.length;
    document.getElementById("sharedWith").textContent =
        new Set(files.map(f => f.partage_avec)).size;
}

/**
 * Ouvrir le modal de création de lien
 */
function createShareLink() {
    document.getElementById("createShareModal").style.display = "block";
}

/**
 * Fermer un modal
 */
function closeModal(id) {
    document.getElementById(id).style.display = "none";
}

/**
 * Générer un lien de partage (simulation)
 */
function generateShareLink() {
    alert("Lien de partage créé avec succès (simulation)");
    closeModal("createShareModal");
}

/**
 * Gérer l’expiration personnalisée
 */
function setupExpirationToggle() {
    const expirationSelect = document.getElementById("shareExpiration");
    const customGroup = document.getElementById("customExpirationGroup");

    expirationSelect.addEventListener("change", () => {
        customGroup.style.display =
            expirationSelect.value === "custom" ? "block" : "none";
    });
}
