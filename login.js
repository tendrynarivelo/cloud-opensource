// Gestion de la page de login
document.addEventListener('DOMContentLoaded', function() {
    console.log('Page login chargée');
    
    // Vérifier si l'utilisateur est déjà connecté
    const userData = localStorage.getItem('clouddrive_user');
    if (userData) {
        window.location.href = 'index.html';
        return;
    }
    
    // Initialiser l'authentification
    if (typeof auth === 'undefined') {
        console.error('auth.js non chargé');
        return;
    }
    
    // Appliquer des styles si nécessaire
    applyLoginStyles();
    
    // Initialiser les onglets
    showLogin();
    
    console.log('Login page initialisée');
});

function applyLoginStyles() {
    // Les styles sont déjà dans le CSS
}

function showLogin() {
    document.getElementById('loginForm').style.display = 'block';
    document.getElementById('registerForm').style.display = 'none';
    document.getElementById('forgotPasswordForm').style.display = 'none';
    
    updateActiveTab('login');
}

function showRegister() {
    document.getElementById('loginForm').style.display = 'none';
    document.getElementById('registerForm').style.display = 'block';
    document.getElementById('forgotPasswordForm').style.display = 'none';
    
    updateActiveTab('register');
}

function showForgotPassword() {
    document.getElementById('loginForm').style.display = 'none';
    document.getElementById('registerForm').style.display = 'none';
    document.getElementById('forgotPasswordForm').style.display = 'block';
}

function updateActiveTab(active) {
    document.querySelectorAll('.login-tab').forEach(tab => {
        tab.classList.remove('active');
    });
    
    if (active === 'login') {
        document.querySelector('.login-tab:nth-child(1)').classList.add('active');
    } else if (active === 'register') {
        document.querySelector('.login-tab:nth-child(2)').classList.add('active');
    }
}

function handleLogin(event) {
    event.preventDefault();
    console.log('Tentative de connexion');
    
    const email = document.getElementById('loginEmail').value;
    const password = document.getElementById('loginPassword').value;
    
    if (!email || !password) {
        showToast('Veuillez remplir tous les champs', 'error');
        return false;
    }
    
    const result = auth.login(email, password);
    
    if (result.success) {
        showToast('Connexion réussie !', 'success');
        setTimeout(() => {
            window.location.href = 'index.html';
        }, 1000);
    } else {
        showToast(result.message || 'Email ou mot de passe incorrect', 'error');
    }
    
    return false;
}

function handleRegister(event) {
    event.preventDefault();
    console.log('Tentative d\'inscription');
    
    const name = document.getElementById('registerName').value;
    const email = document.getElementById('registerEmail').value;
    const password = document.getElementById('registerPassword').value;
    const confirmPassword = document.getElementById('registerConfirmPassword').value;
    
    if (!name || !email || !password || !confirmPassword) {
        showToast('Veuillez remplir tous les champs', 'error');
        return false;
    }
    
    if (password !== confirmPassword) {
        showToast('Les mots de passe ne correspondent pas', 'error');
        return false;
    }
    
    if (password.length < 6) {
        showToast('Le mot de passe doit contenir au moins 6 caractères', 'error');
        return false;
    }
    
    const result = auth.register(name, email, password);
    
    if (result.success) {
        showToast('Compte créé avec succès !', 'success');
        
        // Connecter automatiquement l'utilisateur
        setTimeout(() => {
            const loginResult = auth.login(email, password);
            if (loginResult.success) {
                window.location.href = 'index.html';
            }
        }, 1500);
    } else {
        showToast(result.message || 'Erreur lors de la création du compte', 'error');
    }
    
    return false;
}

function handleForgotPassword(event) {
    event.preventDefault();
    
    const email = document.getElementById('forgotEmail').value;
    
    if (!email) {
        showToast('Veuillez entrer votre email', 'error');
        return false;
    }
    
    // Simuler l'envoi d'email
    showToast('Un lien de réinitialisation a été envoyé à ' + email, 'success');
    
    // Revenir au formulaire de connexion
    setTimeout(() => {
        showLogin();
    }, 2000);
    
    return false;
}