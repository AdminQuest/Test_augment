// Module d'injection CSV administrateur - À intégrer dans Admin'Quest
// Activation : Ctrl + Alt + A ou URL avec ?admin=true

class CSVInjector {
    constructor() {
        this.isAdminMode = false;
        this.adminPasswords = ['FABRICE2025', 'ADMIN2025', 'RIBET2025'];
        this.init();
    }

    init() {
        // Vérifier si mode admin demandé via URL
        const urlParams = new URLSearchParams(window.location.search);
        if (urlParams.get('admin') === 'true') {
            this.showAdminLogin();
        }

        // Raccourci clavier Ctrl + Alt + A
        document.addEventListener('keydown', (e) => {
            if (e.ctrlKey && e.altKey && e.key === 'a') {
                this.showAdminLogin();
            }
        });
    }

    showAdminLogin() {
        // Créer la modal d'authentification
        const modal = this.createAdminModal();
        document.body.appendChild(modal);
    }

    createAdminModal() {
        const modalHTML = `
            <div id="admin-modal" style="
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background: rgba(0,0,0,0.8);
                display: flex;
                align-items: center;
                justify-content: center;
                z-index: 10000;
                font-family: 'Segoe UI', sans-serif;
            ">
                <div style="
                    background: white;
                    padding: 2rem;
                    border-radius: 15px;
                    box-shadow: 0 10px 30px rgba(0,0,0,0.5);
                    width: 90%;
                    max-width: 500px;
                ">
                    <div style="text-align: center; margin-bottom: 2rem;">
                        <h2 style="color: #333; margin-bottom: 0.5rem;">🔐 Mode Administrateur</h2>
                        <p style="color: #666;">Injection CSV - Fabrice Ribet</p>
                    </div>
                    
                    <div id="admin-auth" style="margin-bottom: 1rem;">
                        <label style="display: block; margin-bottom: 0.5rem; color: #333; font-weight: 500;">
                            Mot de passe :
                        </label>
                        <input type="password" id="admin-password-input" style="
                            width: 100%;
                            padding: 0.75rem;
                            border: 2px solid #ddd;
                            border-radius: 8px;
                            font-size: 1rem;
                            margin-bottom: 1rem;
                        " placeholder="Entrez le mot de passe">
                        <button id="admin-login-btn" style="
                            width: 100%;
                            background: linear-gradient(135deg, #667eea, #764ba2);
                            color: white;
                            border: none;
                            padding: 0.75rem;
                            border-radius: 8px;
                            font-size: 1rem;
                            cursor: pointer;
                        ">
                            🔓 Accéder
                        </button>
                    </div>
                    
                    <div id="admin-panel" style="display: none;">
                        <div style="margin-bottom: 1rem;">
                            <label style="display: block; margin-bottom: 0.5rem; color: #333; font-weight: 500;">
                                Fichier CSV :
                            </label>
                            <input type="file" id="csv-file-input" accept=".csv" style="
                                width: 100%;
                                padding: 0.5rem;
                                border: 2px dashed #ddd;
                                border-radius: 8px;
                                margin-bottom: 1rem;
                            ">
                            <select id="delimiter-select" style="
                                width: 100%;
                                padding: 0.5rem;
                                border: 2px solid #ddd;
                                border-radius: 8px;
                                margin-bottom: 1rem;
                            ">
                                <option value=";">Point-virgule (;)</option>
                                <option value=",">Virgule (,)</option>
                                <option value="	">Tabulation</option>
                            </select>
                            <button id="process-csv-btn" style="
                                width: 100%;
                                background: linear-gradient(135deg, #28a745, #20c997);
                                color: white;
                                border: none;
                                padding: 0.75rem;
                                border-radius: 8px;
                                font-size: 1rem;
                                cursor: pointer;
                                margin-bottom: 1rem;
                            " disabled>
                                ⚡ Traiter et injecter
                            </button>
                        </div>
                        
                        <div id="admin-progress" style="
                            width: 100%;
                            height: 20px;
                            background: #f0f0f0;
                            border-radius: 10px;
                            overflow: hidden;
                            margin-bottom: 1rem;
                            display: none;
                        ">
                            <div id="admin-progress-bar" style="
                                height: 100%;
                                background: linear-gradient(90deg, #667eea, #764ba2);
                                width: 0%;
                                transition: width 0.3s;
                            "></div>
                        </div>
                        
                        <div id="admin-status" style="
                            padding: 0.75rem;
                            border-radius: 8px;
                            margin-bottom: 1rem;
                            display: none;
                        "></div>
                        
                        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1rem;">
                            <button id="download-json-btn" style="
                                background: #17a2b8;
                                color: white;
                                border: none;
                                padding: 0.5rem;
                                border-radius: 8px;
                                cursor: pointer;
                            " disabled>
                                📥 JSON
                            </button>
                            <button id="refresh-app-btn" style="
                                background: #ffc107;
                                color: #212529;
                                border: none;
                                padding: 0.5rem;
                                border-radius: 8px;
                                cursor: pointer;
                            ">
                                🔄 Actualiser
                            </button>
                        </div>
                    </div>
                    
                    <div style="text-align: center; margin-top: 1rem;">
                        <button id="close-admin-btn" style="
                            background: #6c757d;
                            color: white;
                            border: none;
                            padding: 0.5rem 1rem;
                            border-radius: 8px;
                            cursor: pointer;
                        ">
                            ✕ Fermer
                        </button>
                    </div>
                </div>
            </div>
        `;

        const div = document.createElement('div');
        div.innerHTML = modalHTML;
        const modal = div.firstElementChild;

        // Event listeners
        this.setupModalEvents(modal);

        return modal;
    }

    setupModalEvents(modal) {
        let processedData = null;

        // Authentification
        const authButton = modal.querySelector('#admin-login-btn');
        const passwordInput = modal.querySelector('#admin-password-input');
        
        const authenticate = () => {
            const password = passwordInput.value;
            if (this.adminPasswords.includes(password)) {
                modal.querySelector('#admin-auth').style.display = 'none';
                modal.querySelector('#admin-panel').style.display = 'block';
                this.isAdminMode = true;
                this.showStatus(modal, 'Authentification réussie !', 'success');
            } else {
                this.showStatus(modal, 'Mot de passe incorrect.', 'error');
                passwordInput.value = '';
            }
        };

        authButton.addEventListener('click', authenticate);
        passwordInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') authenticate();
        });

        // Gestion fichier CSV
        const fileInput = modal.querySelector('#csv-file-input');
        const processBtn = modal.querySelector('#process-csv-btn');
        
        fileInput.addEventListener('change', () => {
            processBtn.disabled = !fileInput.files[0];
        });

        // Traitement CSV
        processBtn.addEventListener('click', async () => {
            const file = fileInput.files[0];
            const delimiter = modal.querySelector('#delimiter-select').value;
            
            if (!file) return;

            try {
                this.showProgress(modal, 0);
                modal.querySelector('#admin-progress').style.display = 'block';
                
                // Lecture fichier
                const csvContent = await this.readFile(file);
                this.showProgress(modal, 30);
                
                // Parsing
                const questions = this.parseCSV(csvContent, delimiter);
                this.showProgress(modal, 60);
                
                // Validation
                const validQuestions = this.validateQuestions(questions);
                this.showProgress(modal, 80);
                
                // Application dans Admin'Quest
                if (typeof displayQuestions === 'function') {
                    window.questionsData = validQuestions;
                    displayQuestions();
                    this.showStatus(modal, `✅ ${validQuestions.length} questions injectées avec succès !`, 'success');
                }
                
                processedData = validQuestions;
                modal.querySelector('#download-json-btn').disabled = false;
                this.showProgress(modal, 100);
                
            } catch (error) {
                this.showStatus(modal, `❌ Erreur: ${error.message}`, 'error');
            }
        });

        // Téléchargement JSON
        modal.querySelector('#download-json-btn').addEventListener('click', () => {
            if (!processedData) return;
            
            const jsonString = JSON.stringify(processedData, null, 2);
            const blob = new Blob([jsonString], { type: 'application/json' });
            const url = URL.createObjectURL(blob);
            
            const a = document.createElement('a');
            a.href = url;
            a.download = `questions_${new Date().toISOString().slice(0,10)}.json`;
            a.click();
            
            URL.revokeObjectURL(url);
        });

        // Actualisation
        modal.querySelector('#refresh-app-btn').addEventListener('click', () => {
            location.reload();
        });

        // Fermeture
        modal.querySelector('#close-admin-btn').addEventListener('click', () => {
            modal.remove();
        });

        // Fermeture en cliquant à l'extérieur
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                modal.remove();
            }
        });
    }

    // Utilitaires
    readFile(file) {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = e => resolve(e.target.result);
            reader.onerror = () => reject(new Error('Erreur de lecture'));
            reader.readAsText(file, 'utf-8');
        });
    }

    parseCSV(content, delimiter) {
        const lines = content.split('\n').filter(line => line.trim());
        if (lines.length < 2) throw new Error('Fichier CSV vide');

        // Nettoyer BOM UTF-8
        if (lines[0].charCodeAt(0) === 0xFEFF) {
            lines[0] = lines[0].slice(1);
        }

        const headers = this.parseCSVLine(lines[0], delimiter);
        const questions = [];

        for (let i = 1; i < lines.length; i++) {
            const fields = this.parseCSVLine(lines[i], delimiter);
            if (fields.length >= headers.length - 2) {
                const question = {};
                headers.forEach((header, index) => {
                    question[header] = fields[index] || '';
                });
                questions.push(question);
            }
        }

        return questions;
    }

    parseCSVLine(line, delimiter) {
        const fields = [];
        let current = '';
        let inQuotes = false;
        
        for (let i = 0; i < line.length; i++) {
            const char = line[i];
            if (char === '"') {
                inQuotes = !inQuotes;
            } else if (char === delimiter && !inQuotes) {
                fields.push(current.trim());
                current = '';
            } else {
                current += char;
            }
        }
        
        fields.push(current.trim());
        return fields;
    }

    validateQuestions(questions) {
        return questions.filter(q => {
            const id = q['ID'] || q['id'];
            const text = q['Question'];
            const category = q['Catégorie principale'];
            return id && text && category;
        });
    }

    showProgress(modal, percent) {
        modal.querySelector('#admin-progress-bar').style.width = percent + '%';
    }

    showStatus(modal, message, type) {
        const status = modal.querySelector('#admin-status');
        status.textContent = message;
        status.style.display = 'block';
        
        // Couleurs selon le type
        const colors = {
            success: { bg: '#d4edda', text: '#155724', border: '#c3e6cb' },
            error: { bg: '#f8d7da', text: '#721c24', border: '#f5c6cb' },
            warning: { bg: '#fff3cd', text: '#856404', border: '#ffeaa7' }
        };
        
        const color = colors[type] || colors.success;
        status.style.background = color.bg;
        status.style.color = color.text;
        status.style.border = `1px solid ${color.border}`;
        
        // Auto-hide après 3 secondes
        setTimeout(() => {
            status.style.display = 'none';
        }, 3000);
    }
}

// Initialisation automatique
document.addEventListener('DOMContentLoaded', () => {
    window.csvInjector = new CSVInjector();
});

// Export pour utilisation dans Admin'Quest
if (typeof module !== 'undefined' && module.exports) {
    module.exports = CSVInjector;
}
