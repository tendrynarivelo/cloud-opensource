// Service API pour les fichiers
class CloudDriveAPI {
    constructor() {
        this.initSampleData();
    }

    initSampleData() {
        // Initialiser les données si elles n'existent pas
        if (!localStorage.getItem('clouddrive_files')) {
            const sampleFiles = [
                {
                    id: 1,
                    name: 'RAPPORT_ANNUL...',
                    size: 2 * 1024 * 1024,
                    type: 'document',
                    modified: '2024-01-15T10:30:00Z',
                    shared: false,
                    owner: 1
                },
                {
                    id: 2,
                    name: 'Vacances.jpg',
                    size: 5 * 1024 * 1024,
                    type: 'image',
                    modified: '2024-01-14T15:45:00Z',
                    shared: true,
                    sharedWith: 'public',
                    owner: 1
                },
                {
                    id: 3,
                    name: 'Présentation.pptx',
                    size: 8 * 1024 * 1024,
                    type: 'document',
                    modified: '2024-01-13T09:15:00Z',
                    shared: false,
                    owner: 1
                },
                {
                    id: 4,
                    name: 'Vidéo_tutoriel.mp4',
                    size: 50 * 1024 * 1024,
                    type: 'video',
                    modified: '2024-01-12T14:20:00Z',
                    shared: false,
                    owner: 1
                },
                {
                    id: 5,
                    name: 'Photo_profil.png',
                    size: 512 * 1024,
                    type: 'image',
                    modified: '2024-01-11T11:10:00Z',
                    shared: false,
                    owner: 1
                },
                {
                    id: 6,
                    name: 'INTRODUCTION ...',
                    size: 51722,
                    type: 'document',
                    modified: new Date().toISOString(),
                    shared: false,
                    owner: 1
                }
            ];
            localStorage.setItem('clouddrive_files', JSON.stringify(sampleFiles));
        }
        
        // Initialiser les utilisateurs si nécessaire
        if (!localStorage.getItem('clouddrive_users')) {
            const users = [
                {
                    id: 1,
                    name: 'Tendry',
                    email: 'tendry@example.com',
                    password: 'password123',
                    avatar: 'TE'
                }
            ];
            localStorage.setItem('clouddrive_users', JSON.stringify(users));
        }
    }

    getFiles() {
        const files = JSON.parse(localStorage.getItem('clouddrive_files') || '[]');
        return Promise.resolve(files);
    }

    uploadFiles(files) {
        return new Promise((resolve) => {
            const existingFiles = JSON.parse(localStorage.getItem('clouddrive_files') || '[]');
            const newFiles = [];
            
            files.forEach((file, index) => {
                const newFile = {
                    id: Date.now() + index,
                    name: file.name,
                    size: file.size,
                    type: this.getFileType(file.name),
                    modified: new Date().toISOString(),
                    shared: false,
                    owner: auth.getCurrentUser()?.id || 1
                };
                
                newFiles.push(newFile);
                existingFiles.push(newFile);
            });
            
            localStorage.setItem('clouddrive_files', JSON.stringify(existingFiles));
            setTimeout(() => resolve(newFiles), 500);
        });
    }

    getFileType(filename) {
        const ext = filename.toLowerCase().split('.').pop();
        if (['jpg', 'jpeg', 'png', 'gif', 'bmp'].includes(ext)) return 'image';
        if (['mp4', 'avi', 'mov', 'wmv'].includes(ext)) return 'video';
        if (['pdf', 'doc', 'docx', 'txt', 'xlsx', 'pptx'].includes(ext)) return 'document';
        return 'other';
    }

    deleteFile(fileId) {
        const files = JSON.parse(localStorage.getItem('clouddrive_files') || '[]');
        const updatedFiles = files.filter(file => file.id !== fileId);
        localStorage.setItem('clouddrive_files', JSON.stringify(updatedFiles));
        return Promise.resolve({ success: true });
    }

    shareFile(fileId, email, permissions, expires) {
        const files = JSON.parse(localStorage.getItem('clouddrive_files') || '[]');
        const fileIndex = files.findIndex(f => f.id === fileId);
        
        if (fileIndex !== -1) {
            files[fileIndex].shared = true;
            files[fileIndex].sharedWith = email || 'public';
            files[fileIndex].sharePermissions = permissions;
            files[fileIndex].shareExpires = expires;
            
            localStorage.setItem('clouddrive_files', JSON.stringify(files));
            
            return Promise.resolve({ 
                success: true, 
                shareLink: `https://clouddrive.com/share/${fileId}` 
            });
        }
        
        return Promise.resolve({ success: false });
    }

    getSharedFiles() {
        const files = JSON.parse(localStorage.getItem('clouddrive_files') || '[]');
        const sharedFiles = files.filter(file => file.shared);
        return Promise.resolve(sharedFiles);
    }

    formatBytes(bytes) {
        if (bytes === 0) return '0 Bytes';
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    }
}

// Instance globale
const api = new CloudDriveAPI();