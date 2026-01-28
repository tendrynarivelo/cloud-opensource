// Dashboard principal
class Dashboard {
    constructor() {
        this.currentView = 'grid';
        this.selectedFiles = new Set();
        this.init();
    }

    init() {
        this.loadFiles();
        this.setupEventListeners();
        this.checkEmptyState();
        
        // Mettre à jour le nom d'utilisateur
        if (auth.getCurrentUser()) {
            document.getElementById('userName').textContent = auth.getCurrentUser().name;
            document.getElementById('userAvatar').textContent = auth.getCurrentUser().avatar;
        }
    }

    async loadFiles() {
        try {
            const files = await api.getFiles();
            this.renderFiles(files);
            this.checkEmptyState();
        } catch (error) {
            console.error('Erreur:', error);
        }
    }

    renderFiles(files) {
        if (this.currentView === 'grid') {
            this.renderGridView(files);
        } else {
            this.renderListView(files);
        }
    }

    renderGridView(files) {
        const grid = document.getElementById('filesGrid');
        if (!grid) return;
        
        grid.innerHTML = '';
        
        files.forEach(file => {
            const card = this.createFileCard(file);
            grid.appendChild(card);
        });
    }

    createFileCard(file) {
        const card = document.createElement('div');
        card.className = 'file-card';
        card.dataset.id = file.id;
        
        const icon = this.getFileIcon(file.type);
        const size = api.formatBytes(file.size);
        const date = new Date(file.modified).toLocaleDateString('fr-FR');
        
        card.innerHTML = `
            <div class="file-icon">
                <i class="${icon}"></i>
            </div>
            <div class="file-name" title="${file.name}">${file.name}</div>
            <div class="file-size">${size}</div>
            <div class="file-date">${date}</div>
            <div class="file-actions">
                <button class="action-btn" onclick="downloadFile(${file.id})" title="Télécharger">
                    <i class="fas fa-download"></i>
                </button>
                <button class="action-btn" onclick="shareFile(${file.id})" title="Partager">
                    <i class="fas fa-share-alt"></i>
                </button>
                <button class="action-btn" onclick="deleteFile(${file.id})" title="Supprimer">
                    <i class="fas fa-trash"></i>
                </button>
            </div>
        `;
        
        return card;
    }

    getFileIcon(type) {
        const icons = {
            'document': 'fas fa-file-pdf',
            'image': 'fas fa-file-image',
            'video': 'fas fa-file-video',
            'other': 'fas fa-file'
        };
        return icons[type] || icons.other;
    }

    checkEmptyState() {
        const files = document.querySelectorAll('.file-card').length;
        const emptyState = document.getElementById('emptyState');
        const grid = document.getElementById('filesGrid');
        const list = document.getElementById('filesList');
        
        if (files === 0) {
            if (emptyState) emptyState.style.display = 'block';
            if (grid) grid.style.display = 'none';
            if (list) list.style.display = 'none';
        } else {
            if (emptyState) emptyState.style.display = 'none';
            if (this.currentView === 'grid' && grid) grid.style.display = 'grid';
            if (this.currentView === 'list' && list) list.style.display = 'block';
        }
    }

    setupEventListeners() {
        // Click sur la drop zone
        const dropZone = document.getElementById('dropZone');
        if (dropZone) {
            dropZone.addEventListener('click', () => {
                document.getElementById('fileInput').click();
            });
        }
        
        // File input change
        const fileInput = document.getElementById('fileInput');
        if (fileInput) {
            fileInput.addEventListener('change', (e) => {
                if (e.target.files.length > 0) {
                    uploadFiles(e.target.files);
                }
            });
        }
    }
}

// Instance globale
let dashboard;

// Initialisation
document.addEventListener('DOMContentLoaded', () => {
    dashboard = new Dashboard();
});

// FONCTIONS GLOBALES

// Upload
function showUploadModal() {
    document.getElementById('uploadModal').classList.add('show');
}

function closeModal(modalId) {
    document.getElementById(modalId).classList.remove('show');
}

async function uploadFiles(fileList) {
    if (!fileList || fileList.length === 0) {
        showToast('Veuillez sélectionner des fichiers', 'warning');
        return;
    }
    
    const progressBar = document.getElementById('uploadProgress');
    const status = document.getElementById('uploadStatus');
    
    try {
        status.textContent = 'Téléversement en cours...';
        progressBar.style.setProperty('--progress', '30%');
        
        const files = Array.from(fileList);
        await api.uploadFiles(files);
        
        progressBar.style.setProperty('--progress', '100%');
        status.textContent = 'Téléversement terminé !';
        
        showToast(`${files.length} fichier(s) téléversé(s)`, 'success');
        
        setTimeout(() => {
            closeModal('uploadModal');
            dashboard.loadFiles();
        }, 1000);
        
    } catch (error) {
        showToast('Erreur lors du téléversement', 'error');
    }
}

// Drag & Drop
function handleDragOver(e) {
    e.preventDefault();
    e.stopPropagation();
    const dropZone = document.getElementById('dropZone');
    if (dropZone) dropZone.classList.add('drag-over');
}

function handleDragLeave(e) {
    e.preventDefault();
    e.stopPropagation();
    const dropZone = document.getElementById('dropZone');
    if (dropZone) dropZone.classList.remove('drag-over');
}

function handleDrop(e) {
    e.preventDefault();
    e.stopPropagation();
    const dropZone = document.getElementById('dropZone');
    if (dropZone) dropZone.classList.remove('drag-over');
    
    const files = e.dataTransfer.files;
    if (files.length > 0) {
        showUploadModal();
        document.getElementById('fileInput').files = files;
    }
}

// Partage
function shareFile(fileId) {
    const files = JSON.parse(localStorage.getItem('clouddrive_files') || '[]');
    const file = files.find(f => f.id === fileId);
    
    if (file) {
        document.getElementById('shareFileName').value = file.name;
        document.getElementById('shareModal').classList.add('show');
    }
}

function createShare() {
    const fileName = document.getElementById('shareFileName').value;
    const email = document.getElementById('shareEmail').value;
    const permissions = document.getElementById('sharePermissions').value;
    const expires = document.getElementById('shareExpires').value;
    
    // Trouver le fichier par nom (simplifié)
    const files = JSON.parse(localStorage.getItem('clouddrive_files') || '[]');
    const file = files.find(f => f.name.includes(fileName));
    
    if (file) {
        api.shareFile(file.id, email, permissions, expires).then(result => {
            if (result.success) {
                showToast('Fichier partagé avec succès', 'success');
                closeModal('shareModal');
                dashboard.loadFiles();
            }
        });
    }
}

// Autres fonctions
function downloadFile(fileId) {
    const files = JSON.parse(localStorage.getItem('clouddrive_files') || '[]');
    const file = files.find(f => f.id === fileId);
    
    if (file) {
        // Simuler le téléchargement
        const blob = new Blob([`Contenu de ${file.name}`], { type: 'text/plain' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = file.name;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
        
        showToast('Téléchargement démarré', 'success');
    }
}

function deleteFile(fileId) {
    if (confirm('Supprimer ce fichier ?')) {
        api.deleteFile(fileId).then(() => {
            showToast('Fichier supprimé', 'success');
            dashboard.loadFiles();
        });
    }
}

function filterFiles(type) {
    showToast(`Filtrage des ${type}`, 'info');
}

function toggleView() {
    const grid = document.getElementById('filesGrid');
    const list = document.getElementById('filesList');
    
    if (dashboard.currentView === 'grid') {
        dashboard.currentView = 'list';
        if (grid) grid.style.display = 'none';
        if (list) list.style.display = 'block';
    } else {
        dashboard.currentView = 'grid';
        if (grid) grid.style.display = 'grid';
        if (list) list.style.display = 'none';
    }
}

function selectAll() {
    showToast('Tous les fichiers sélectionnés', 'info');
}

function searchFiles() {
    const searchTerm = document.getElementById('searchInput').value.toLowerCase();
    const cards = document.querySelectorAll('.file-card');
    
    cards.forEach(card => {
        const fileName = card.querySelector('.file-name').textContent.toLowerCase();
        if (fileName.includes(searchTerm)) {
            card.style.display = 'block';
        } else {
            card.style.display = 'none';
        }
    });
}

function showCreateFolderModal() {
    const name = prompt('Nom du nouveau dossier :');
    if (name) {
        showToast(`Dossier "${name}" créé`, 'success');
    }
}

function showComingSoon() {
    showToast('Fonctionnalité bientôt disponible !', 'info');
}