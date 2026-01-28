class ProfileManager {
    constructor() {
        this.auth = auth;
        this.init();
    }

    init() {
        this.loadProfile();
        this.setupEventListeners();
    }

    loadProfile() {
        const user = this.auth.getCurrentUser();
        if (!user) return;

        // Mettre à jour l'interface du profil
        document.getElementById('profileName').textContent = user.name;
        document.getElementById('profileEmail').textContent = user.email;
        document.getElementById('profileAvatarLarge').textContent = user.avatar || user.name.substring(0, 2).toUpperCase();
        
        document.getElementById('detailName').textContent = user.name;
        document.getElementById('detailEmail').textContent = user.email;
        document.getElementById('detailPhone').textContent = user.phone || 'Non défini';
        document.getElementById('detailAddress').textContent = user.address || 'Non définie';
        document.getElementById('detailJoined').textContent = this.formatDate(user.joined || new Date());
        document.getElementById('detailLastLogin').textContent = 'Aujourd\'hui, ' + new Date().toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' });

        // Mettre à jour les compteurs de stockage
        this.updateStorageInfo();
    }

    updateStorageInfo() {
        const user = this.auth.getCurrentUser();
        if (!user) return;

        const usedStorage = this.auth.formatBytes(user.usedStorage);
        const totalStorage = this.auth.formatBytes(user.totalStorage);
        const availableStorage = this.auth.formatBytes(user.totalStorage - user.usedStorage);
        const usedPercentage = (user.usedStorage / user.totalStorage) * 100;
        const availablePercentage = 100 - usedPercentage;

        document.getElementById('storageUsed').textContent = usedStorage;
        document.getElementById('storageAvailable').textContent = availableStorage;
        document.getElementById('storageFill').style.width = `${usedPercentage}%`;
        document.getElementById('storageAvailableFill').style.width = `${availablePercentage}%`;
    }

    showEditProfile() {
        const user = this.auth.getCurrentUser();
        if (!user) return;

        document.getElementById('editName').value = user.name;
        document.getElementById('editEmail').value = user.email;
        document.getElementById('editPhone').value = user.phone || '';
        document.getElementById('editAddress').value = user.address || '';

        showModal('editProfileModal');
    }

    saveProfile() {
        const name = document.getElementById('editName').value;
        const email = document.getElementById('editEmail').value;
        const phone = document.getElementById('editPhone').value;
        const address = document.getElementById('editAddress').value;

        if (!name || !email) {
            showToast('Le nom et l\'email sont requis', 'error');
            return;
        }

        const updates = {
            name,
            email,
            phone,
            address,
            avatar: name.substring(0, 2).toUpperCase()
        };

        this.auth.updateUser(updates);
        this.loadProfile();
        
        showToast('Profil mis à jour avec succès', 'success');
        closeModal('editProfileModal');
    }

    changeAvatar() {
        const avatar = prompt('Entrez vos initiales (2 lettres):', this.auth.getCurrentUser().avatar || '');
        if (avatar && avatar.length === 2) {
            this.auth.updateUser({ avatar: avatar.toUpperCase() });
            this.loadProfile();
            showToast('Avatar mis à jour', 'success');
        }
    }

    showSecuritySettings() {
        showModal('changePasswordModal');
    }

    changePassword() {
        const currentPassword = document.getElementById('currentPassword').value;
        const newPassword = document.getElementById('newPassword').value;
        const confirmPassword = document.getElementById('confirmNewPassword').value;

        if (!currentPassword || !newPassword || !confirmPassword) {
            showToast('Tous les champs sont requis', 'error');
            return;
        }

        if (newPassword !== confirmPassword) {
            showToast('Les mots de passe ne correspondent pas', 'error');
            return;
        }

        if (newPassword.length < 6) {
            showToast('Le mot de passe doit contenir au moins 6 caractères', 'error');
            return;
        }

        // Simuler le changement de mot de passe
        showToast('Mot de passe changé avec succès', 'success');
        closeModal('changePasswordModal');
        
        // Réinitialiser les champs
        document.getElementById('currentPassword').value = '';
        document.getElementById('newPassword').value = '';
        document.getElementById('confirmNewPassword').value = '';
    }

    showUpgradeModal() {
        const plans = [
            { name: 'Gratuit', storage: '1 Go', price: '0€/mois' },
            { name: 'Pro', storage: '50 Go', price: '5€/mois' },
            { name: 'Business', storage: '500 Go', price: '20€/mois' },
            { name: 'Enterprise', storage: 'Illimité', price: 'Sur mesure' }
        ];

        let modalContent = '<div class="plans-grid">';
        plans.forEach(plan => {
            modalContent += `
                <div class="plan-card">
                    <h3>${plan.name}</h3>
                    <div class="plan-storage">${plan.storage}</div>
                    <div class="plan-price">${plan.price}</div>
                    <button class="btn btn-primary" onclick="upgradePlan('${plan.name}')">
                        Choisir
                    </button>
                </div>
            `;
        });
        modalContent += '</div>';

        alert('Fonctionnalité de mise à niveau bientôt disponible !\n\n' + 
              'Gratuit: 1 Go - 0€/mois\n' +
              'Pro: 50 Go - 5€/mois\n' +
              'Business: 500 Go - 20€/mois\n' +
              'Enterprise: Illimité - Sur mesure');
    }

    formatDate(date) {
        return new Date(date).toLocaleDateString('fr-FR', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    }

    setupEventListeners() {
        // Gestion du changement de photo de profil
        const avatarLarge = document.getElementById('profileAvatarLarge');
        if (avatarLarge) {
            avatarLarge.addEventListener('click', () => this.changeAvatar());
        }
    }
}

// Initialisation du gestionnaire de profil
let profileManager;

document.addEventListener('DOMContentLoaded', () => {
    profileManager = new ProfileManager();
});

// Fonctions globales
function showEditProfile() {
    profileManager.showEditProfile();
}

function changeAvatar() {
    profileManager.changeAvatar();
}

function saveProfile() {
    profileManager.saveProfile();
}

function showSecuritySettings() {
    profileManager.showSecuritySettings();
}

function changePassword() {
    profileManager.changePassword();
}

function showUpgradeModal() {
    profileManager.showUpgradeModal();
}

function upgradePlan(planName) {
    showToast(`Mise à niveau vers ${planName} - Fonctionnalité bientôt disponible`, 'info');
}