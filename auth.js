// Service d'authentification
class AuthService {
    constructor() {
        this.currentUser = null;
        this.init();
    }

    init() {
        const userData = localStorage.getItem('clouddrive_user');
        if (userData) {
            this.currentUser = JSON.parse(userData);
            this.updateUI();
        } else if (!window.location.pathname.includes('login.html')) {
            window.location.href = 'login.html';
        }
    }

    login(email, password) {
        const users = JSON.parse(localStorage.getItem('clouddrive_users') || '[]');
        const user = users.find(u => u.email === email && u.password === password);
        
        if (user) {
            this.currentUser = {
                id: user.id,
                name: user.name,
                email: user.email,
                avatar: user.avatar || user.name.substring(0, 2).toUpperCase(),
                usedStorage: 700 * 1024 * 1024,
                totalStorage: 1024 * 1024 * 1024
            };
            
            localStorage.setItem('clouddrive_user', JSON.stringify(this.currentUser));
            return { success: true };
        }
        
        return { success: false, message: 'Email ou mot de passe incorrect' };
    }

    register(name, email, password) {
        let users = JSON.parse(localStorage.getItem('clouddrive_users') || '[]');
        
        if (users.some(u => u.email === email)) {
            return { success: false, message: 'Cet email est déjà utilisé' };
        }
        
        const newUser = {
            id: Date.now(),
            name,
            email,
            password,
            avatar: name.substring(0, 2).toUpperCase()
        };
        
        users.push(newUser);
        localStorage.setItem('clouddrive_users', JSON.stringify(users));
        
        return { success: true, message: 'Compte créé avec succès' };
    }

    logout() {
        localStorage.removeItem('clouddrive_user');
        this.currentUser = null;
        window.location.href = 'login.html';
    }

    updateUI() {
        if (!this.currentUser) return;

        const elements = {
            userName: this.currentUser.name,
            userAvatar: this.currentUser.avatar || this.currentUser.name.substring(0, 2).toUpperCase()
        };

        Object.entries(elements).forEach(([id, value]) => {
            const element = document.getElementById(id);
            if (element) element.textContent = value;
        });
    }

    getCurrentUser() {
        return this.currentUser;
    }

    isAuthenticated() {
        return this.currentUser !== null;
    }
}

// Instance globale
const auth = new AuthService();

// Fonction de déconnexion globale
function logout() {
    if (confirm('Êtes-vous sûr de vouloir vous déconnecter ?')) {
        auth.logout();
    }
}

// Fonction pour les notifications
function showToast(message, type = 'info') {
    // Supprimer les anciens toasts
    const oldToasts = document.querySelectorAll('.toast');
    oldToasts.forEach(toast => toast.remove());
    
    // Créer le toast
    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;
    toast.innerHTML = `
        <div style="display: flex; align-items: center; gap: 10px;">
            <span style="font-size: 1.2rem;">
                ${type === 'success' ? '✓' : type === 'error' ? '✗' : 'ℹ'}
            </span>
            <span>${message}</span>
        </div>
    `;
    
    // Styles inline
    toast.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: ${type === 'success' ? '#2ecc71' : type === 'error' ? '#e74c3c' : '#3498db'};
        color: white;
        padding: 15px 20px;
        border-radius: 5px;
        box-shadow: 0 4px 12px rgba(0,0,0,0.15);
        z-index: 10000;
        animation: slideIn 0.3s ease;
    `;
    
    // Animation
    const style = document.createElement('style');
    style.textContent = `
        @keyframes slideIn {
            from { transform: translateX(100%); opacity: 0; }
            to { transform: translateX(0); opacity: 1; }
        }
        @keyframes slideOut {
            to { transform: translateX(100%); opacity: 0; }
        }
    `;
    document.head.appendChild(style);
    
    document.body.appendChild(toast);
    
    // Supprimer après 3 secondes
    setTimeout(() => {
        toast.style.animation = 'slideOut 0.3s ease forwards';
        setTimeout(() => toast.remove(), 300);
    }, 3000);
}