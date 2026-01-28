// Script de débogage pour CloudDrive
console.log('=== CLOUDDRIVE DEBUG SCRIPT ===');

// Vérifier tous les fichiers nécessaires
const requiredFiles = [
    'auth.js',
    'api.js',
    'dashboard.js',
    'shared.js',
    'profile.js',
    'login.js'
];

console.log('Fichiers chargés:');
requiredFiles.forEach(file => {
    const script = Array.from(document.querySelectorAll('script')).find(s => 
        s.src && s.src.includes(file)
    );
    console.log(`- ${file}: ${script ? '✓ Chargé' : '✗ Non trouvé'}`);
});

// Vérifier l'état de l'authentification
console.log('État de l\'authentification:');
console.log('- localStorage user:', localStorage.getItem('clouddrive_user'));
console.log('- auth object:', typeof auth !== 'undefined' ? auth : 'Non défini');
console.log('- auth.currentUser:', typeof auth !== 'undefined' ? auth.currentUser : 'Non défini');

// Vérifier les données
console.log('Données stockées:');
console.log('- Fichiers:', JSON.parse(localStorage.getItem('clouddrive_files') || '[]').length);
console.log('- Utilisateurs:', JSON.parse(localStorage.getItem('clouddrive_users') || '[]').length);
console.log('- Liens de partage:', JSON.parse(localStorage.getItem('clouddrive_share_links') || '[]').length);

// Ajouter un bouton de débogage dans l'interface
function addDebugButton() {
    const debugBtn = document.createElement('button');
    debugBtn.id = 'debugBtn';
    debugBtn.innerHTML = '🐛 Debug';
    debugBtn.style.cssText = `
        position: fixed;
        bottom: 20px;
        right: 20px;
        z-index: 9999;
        background: #e74c3c;
        color: white;
        border: none;
        border-radius: 50px;
        padding: 10px 20px;
        font-size: 14px;
        font-weight: bold;
        cursor: pointer;
        box-shadow: 0 4px 12px rgba(0,0,0,0.2);
    `;
    debugBtn.onclick = function() {
        const user = JSON.parse(localStorage.getItem('clouddrive_user') || 'null');
        const files = JSON.parse(localStorage.getItem('clouddrive_files') || '[]');
        
        alert(`DEBUG INFO\n\nUtilisateur: ${user ? user.name : 'Non connecté'}\nFichiers: ${files.length}\n\nVoir la console (F12) pour plus de détails`);
    };
    document.body.appendChild(debugBtn);
}

// Exécuter quand le DOM est chargé
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', addDebugButton);
} else {
    addDebugButton();
}

// Fonction pour réinitialiser les données de test
window.resetTestData = function() {
    if (confirm('Réinitialiser toutes les données de test ?')) {
        localStorage.clear();
        
        // Créer des données de test
        const testUser = {
            id: 1,
            name: 'John Doe',
            email: 'john@example.com',
            password: 'password123',
            avatar: 'JD',
            usedStorage: 700 * 1024 * 1024,
            totalStorage: 1024 * 1024 * 1024
        };
        
        const testFiles = [
            {
                id: 1,
                name: 'Rapport_annuel.pdf',
                size: 2048000,
                type: 'document',
                modified: new Date().toISOString(),
                shared: false,
                owner: 1
            },
            {
                id: 2,
                name: 'Photo_vacances.jpg',
                size: 5242880,
                type: 'image',
                modified: new Date().toISOString(),
                shared: true,
                owner: 1,
                sharedWith: 'public',
                sharePermissions: 'view'
            }
        ];
        
        localStorage.setItem('clouddrive_user', JSON.stringify(testUser));
        localStorage.setItem('clouddrive_users', JSON.stringify([testUser]));
        localStorage.setItem('clouddrive_files', JSON.stringify(testFiles));
        
        alert('Données de test réinitialisées !\n\nEmail: john@example.com\nMot de passe: password123');
        location.reload();
    }
};

// Ajouter un bouton de réinitialisation
setTimeout(() => {
    const resetBtn = document.createElement('button');
    resetBtn.innerHTML = '🔄 Reset';
    resetBtn.style.cssText = `
        position: fixed;
        bottom: 70px;
        right: 20px;
        z-index: 9999;
        background: #3498db;
        color: white;
        border: none;
        border-radius: 50px;
        padding: 10px 20px;
        font-size: 14px;
        font-weight: bold;
        cursor: pointer;
        box-shadow: 0 4px 12px rgba(0,0,0,0.2);
    `;
    resetBtn.onclick = window.resetTestData;
    document.body.appendChild(resetBtn);
}, 1000);

console.log('=== FIN DU DEBUG SCRIPT ===');