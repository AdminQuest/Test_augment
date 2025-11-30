// Module CSV V3 - Avec rafraîchissement forcé de l'interface Admin'Quest
// Correction du problème d'affichage après injection

class CSVInjectorV3 {
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

    // Auto-détection du délimiteur CSV
    detectDelimiter(csvContent) {
        const firstLines = csvContent.split('\n').slice(0, 3);
        const delimiters = [';', ',', '\t'];
        let bestDelimiter = ';';
        let maxColumns = 0;

        for (const delimiter of delimiters) {
            let totalColumns = 0;
            let consistency = 0;
            let firstLineColumns = 0;

            for (let i = 0; i < firstLines.length; i++) {
                const line = firstLines[i].trim();
                if (!line) continue;

                const columns = this.parseCSVLine(line, delimiter).length;
                
                if (i === 0) {
                    firstLineColumns = columns;
                } else if (columns === firstLineColumns) {
                    consistency++;
                }
                
                totalColumns += columns;
            }

            const avgColumns = totalColumns / firstLines.length;

            if (avgColumns > maxColumns && avgColumns >= 10) {
                maxColumns = avgColumns;
                bestDelimiter = delimiter;
            }
        }

        console.log(`🎯 Délimiteur détecté: "${bestDelimiter}" (${maxColumns.toFixed(1)} colonnes)`);
        return bestDelimiter;
    }

    // Injection forcée dans Admin'Quest avec rafraîchissement complet
    injectIntoAdminQuest(questions) {
        this.log(this.currentModal, '🔄 Injection dans Admin\'Quest...', 'info');
        
        // Stockage dans les variables globales
        window.questionsData = questions;
        window.allQuestions = questions; // Variable alternative
        
        // Mise à jour du localStorage pour persistance
        if (typeof localStorage !== 'undefined') {
            const questionsWithMeta = {
                questions: questions,
                timestamp: Date.now(),
                source: 'csv_admin_injection',
                count: questions.length
            };
            localStorage.setItem('questions', JSON.stringify(questionsWithMeta));
            this.log(this.currentModal, `💾 ${questions.length} questions sauvées en local`, 'success');
        }

        // Appel des fonctions de rafraîchissement si elles existent
        const refreshFunctions = [
            'displayQuestions',
            'updateTabCounts', 
            'updateSubcategories',
            'populateSubcategories',
            'filterQuestions',
            'init',
            'loadQuestions',
            'refreshUI',
            'updateInterface',
            'render',
            'update'
        ];

        let functionsExecuted = 0;
        for (const funcName of refreshFunctions) {
            if (typeof window[funcName] === 'function') {
                try {
                    window[funcName]();
                    functionsExecuted++;
                    this.log(this.currentModal, `✅ ${funcName}() exécutée`, 'success');
                } catch (error) {
                    this.log(this.currentModal, `⚠️ Erreur ${funcName}(): ${error.message}`, 'warning');
                }
            }
        }

        // Rafraîchissement du DOM directement
        this.forceUIRefresh(questions);
        
        this.log(this.currentModal, `⚡ ${functionsExecuted} fonctions de rafraîchissement exécutées`, 'info');
        return functionsExecuted > 0;
    }

    // Rafraîchissement forcé de l'interface utilisateur
    forceUIRefresh(questions) {
        this.log(this.currentModal, '🎨 Rafraîchissement forcé de l\'interface...', 'info');
        
        // Mettre à jour les compteurs d'onglets
        const tabs = document.querySelectorAll('[data-tab]');
        tabs.forEach(tab => {
            const tabName = tab.getAttribute('data-tab');
            if (tabName) {
                const count = this.countQuestionsByCategory(questions, tabName);
                const badge = tab.querySelector('.tab-badge');
                if (badge) {
                    badge.textContent = count;
                    this.log(this.currentModal, `📊 Onglet ${tabName}: ${count} questions`, 'info');
                }
            }
        });

        // Mettre à jour les sous-catégories
        const subcategorySelect = document.getElementById('subcategory');
        if (subcategorySelect) {
            this.updateSubcategoryOptions(questions);
        }

        // Forcer l'affichage des questions si une catégorie est sélectionnée
        const activeTab = document.querySelector('.tab.active');
        if (activeTab) {
            const currentCategory = activeTab.getAttribute('data-tab');
            this.displayQuestionsForCategory(questions, currentCategory);
        } else {
            // Afficher toutes les questions par défaut
            this.displayAllQuestions(questions);
        }

        this.log(this.currentModal, '✅ Interface rafraîchie', 'success');
    }

    // Compter les questions par catégorie/épreuve
    countQuestionsByCategory(questions, category) {
        if (category === 'all') return questions.length;
        
        return questions.filter(q => {
            const epreuve = q['Épreuve'] || q['epreuve'] || '';
            return epreuve.toLowerCase().includes(category.toLowerCase());
        }).length;
    }

    // Mettre à jour les options de sous-catégories
    updateSubcategoryOptions(questions) {
        const subcategorySelect = document.getElementById('subcategory');
        if (!subcategorySelect) return;

        const subcategories = new Set();
        questions.forEach(q => {
            const subcat = q['Sous-catégorie'] || q['sous_categorie'] || '';
            if (subcat) subcategories.add(subcat);
        });

        // Vider et remplir les options
        subcategorySelect.innerHTML = '<option value="">Toutes les sous-catégories</option>';
        Array.from(subcategories).sort().forEach(subcat => {
            const option = document.createElement('option');
            option.value = subcat;
            option.textContent = subcat;
            subcategorySelect.appendChild(option);
        });
    }

    // Afficher les questions pour une catégorie spécifique
    displayQuestionsForCategory(questions, category) {
        const container = document.getElementById('questions-list') || 
                         document.getElementById('questionsContainer') || 
                         document.querySelector('.questions-container');
        
        if (!container) {
            this.log(this.currentModal, '⚠️ Container de questions non trouvé', 'warning');
            return;
        }

        let filteredQuestions = questions;
        if (category !== 'all') {
            filteredQuestions = questions.filter(q => {
                const epreuve = q['Épreuve'] || q['epreuve'] || '';
                return epreuve.toLowerCase().includes(category.toLowerCase());
            });
        }

        this.renderQuestions(filteredQuestions, container);
    }

    // Afficher toutes les questions
    displayAllQuestions(questions) {
        const container = document.getElementById('questions-list') || 
                         document.getElementById('questionsContainer') || 
                         document.querySelector('.questions-container');
        
        if (container) {
            this.renderQuestions(questions, container);
        }
    }

    // Rendu des questions dans le container
    renderQuestions(questions, container) {
        container.innerHTML = '';
        
        if (questions.length === 0) {
            container.innerHTML = '<div class="no-questions">Aucune question trouvée</div>';
            return;
        }

        this.log(this.currentModal, `🎯 Affichage de ${questions.length} questions`, 'info');
        
        // Créer une notification temporaire de succès
        const notification = document.createElement('div');
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: #28a745;
            color: white;
            padding: 1rem 2rem;
            border-radius: 8px;
            box-shadow: 0 4px 12px rgba(0,0,0,0.2);
            z-index: 9999;
            font-weight: 500;
            animation: slideIn 0.3s ease;
        `;
        notification.innerHTML = `
            ✅ ${questions.length} questions injectées avec succès !<br>
            <small>L'application a été mise à jour</small>
        `;
        
        document.body.appendChild(notification);
        
        // Auto-suppression après 4 secondes
        setTimeout(() => {
            if (notification.parentNode) {
                notification.remove();
            }
        }, 4000);

        // Optionnel : afficher un échantillon dans la console pour debug
        console.log('📊 Échantillon des questions injectées:', questions.slice(0, 3));
    }

    showAdminLogin() {
        const existingModal = document.getElementById('admin-modal');
        if (existingModal) existingModal.remove();

        const modal = this.createAdminModal();
        this.currentModal = modal; // Stocker la référence
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
                    max-width: 600px;
                    max-height: 90vh;
                    overflow-y: auto;
                ">
                    <div style="text-align: center; margin-bottom: 2rem;">
                        <h2 style="color: #333; margin-bottom: 0.5rem;">🔐 Admin'Quest V3</h2>
                        <p style="color: #666;">Injection CSV avec rafraîchissement forcé</p>
                    </div>
                    
                    <div id="admin-auth" style="margin-bottom: 1rem;">
                        <label style="display: block; margin-bottom: 0.5rem; color: #333; font-weight: 500;">
                            Mot de passe administrateur :
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
                            🔓 Accéder au mode admin
                        </button>
                    </div>
                    
                    <div id="admin-panel" style="display: none;">
                        <div style="margin-bottom: 1rem;">
                            <label style="display: block; margin-bottom: 0.5rem; color: #333; font-weight: 500;">
                                📁 Fichier CSV :
                            </label>
                            <input type="file" id="csv-file-input" accept=".csv" style="
                                width: 100%;
                                padding: 0.5rem;
                                border: 2px dashed #ddd;
                                border-radius: 8px;
                                margin-bottom: 1rem;
                            ">
                            
                            <div style="
                                background: linear-gradient(135deg, #e3f2fd, #f3e5f5);
                                border: 1px solid #90caf9;
                                border-radius: 8px;
                                padding: 1rem;
                                margin-bottom: 1rem;
                                font-size: 0.9rem;
                            ">
                                <strong>🚀 Version V3 - Rafraîchissement forcé</strong><br>
                                ✅ Auto-détection délimiteur<br>
                                ✅ Injection directe dans l'interface<br>
                                ✅ Mise à jour temps réel
                            </div>
                            
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
                                font-weight: 500;
                            " disabled>
                                ⚡ Injecter et rafraîchir l'application
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
                        
                        <div id="admin-log" style="
                            background: #f8f9fa;
                            border: 1px solid #e9ecef;
                            border-radius: 8px;
                            padding: 1rem;
                            margin-bottom: 1rem;
                            max-height: 150px;
                            overflow-y: auto;
                            font-family: 'Courier New', monospace;
                            font-size: 0.8rem;
                            display: none;
                        "></div>
                        
                        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1rem;">
                            <button id="refresh-app-btn" style="
                                background: #ffc107;
                                color: #212529;
                                border: none;
                                padding: 0.75rem;
                                border-radius: 8px;
                                cursor: pointer;
                                font-weight: 500;
                            ">
                                🔄 Recharger page
                            </button>
                            <button id="download-json-btn" style="
                                background: #17a2b8;
                                color: white;
                                border: none;
                                padding: 0.75rem;
                                border-radius: 8px;
                                cursor: pointer;
                                font-weight: 500;
                            " disabled>
                                📥 Télécharger JSON
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
                this.showStatus(modal, 'Authentification réussie ! Bienvenue Fabrice.', 'success');
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
            const file = fileInput.files[0];
            processBtn.disabled = !file;
            if (file) {
                this.log(modal, `📁 ${file.name} (${(file.size/1024).toFixed(1)} KB)`, 'info');
            }
        });

        // Traitement CSV avec injection forcée
        processBtn.addEventListener('click', async () => {
            const file = fileInput.files[0];
            if (!file) return;

            try {
                this.showProgress(modal, 0);
                modal.querySelector('#admin-progress').style.display = 'block';
                modal.querySelector('#admin-log').style.display = 'block';
                
                this.log(modal, '🔄 Début du traitement CSV...', 'info');
                
                // Lecture fichier
                const csvContent = await this.readFile(file);
                this.showProgress(modal, 20);
                
                // Auto-détection délimiteur
                const delimiter = this.detectDelimiter(csvContent);
                this.showProgress(modal, 40);
                
                // Parsing
                const questions = this.parseCSV(csvContent, delimiter);
                this.showProgress(modal, 60);
                
                // Validation
                const validQuestions = this.validateQuestions(questions);
                this.log(modal, `✅ ${validQuestions.length}/${questions.length} questions valides`, 'success');
                
                if (validQuestions.length === 0) {
                    throw new Error('Aucune question valide. Vérifiez le format CSV.');
                }
                
                this.showProgress(modal, 80);
                
                // INJECTION FORCÉE avec rafraîchissement
                const injected = this.injectIntoAdminQuest(validQuestions);
                this.showProgress(modal, 100);
                
                processedData = validQuestions;
                modal.querySelector('#download-json-btn').disabled = false;
                
                if (injected) {
                    this.showStatus(modal, `🎉 ${validQuestions.length} questions injectées et affichées !`, 'success');
                } else {
                    this.showStatus(modal, `✅ ${validQuestions.length} questions injectées (rechargez si nécessaire)`, 'warning');
                }
                
            } catch (error) {
                this.log(modal, `❌ ${error.message}`, 'error');
                this.showStatus(modal, `❌ ${error.message}`, 'error');
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
            this.log(modal, '📥 JSON téléchargé', 'success');
        });

        // Rechargement page
        modal.querySelector('#refresh-app-btn').addEventListener('click', () => {
            location.reload();
        });

        // Fermeture
        modal.querySelector('#close-admin-btn').addEventListener('click', () => {
            modal.remove();
        });

        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                modal.remove();
            }
        });
    }

    // Utilitaires inchangés
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

        if (lines[0].charCodeAt(0) === 0xFEFF) {
            lines[0] = lines[0].slice(1);
        }

        const headers = this.parseCSVLine(lines[0], delimiter);
        const questions = [];

        for (let i = 1; i < lines.length; i++) {
            const fields = this.parseCSVLine(lines[i], delimiter);
            if (fields.length >= Math.min(headers.length - 2, 10)) {
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

    log(modal, message, type = 'info') {
        const logContainer = modal.querySelector('#admin-log');
        const logEntry = document.createElement('div');
        
        const colors = {
            info: '#17a2b8',
            success: '#28a745', 
            error: '#dc3545',
            warning: '#ffc107'
        };
        
        logEntry.style.color = colors[type] || colors.info;
        logEntry.textContent = `${new Date().toLocaleTimeString()} - ${message}`;
        logContainer.appendChild(logEntry);
        logContainer.scrollTop = logContainer.scrollHeight;
    }

    showStatus(modal, message, type) {
        const status = modal.querySelector('#admin-status');
        status.textContent = message;
        status.style.display = 'block';
        
        const colors = {
            success: { bg: '#d4edda', text: '#155724', border: '#c3e6cb' },
            error: { bg: '#f8d7da', text: '#721c24', border: '#f5c6cb' },
            warning: { bg: '#fff3cd', text: '#856404', border: '#ffeaa7' }
        };
        
        const color = colors[type] || colors.success;
        status.style.background = color.bg;
        status.style.color = color.text;
        status.style.border = `1px solid ${color.border}`;
        
        setTimeout(() => {
            status.style.display = 'none';
        }, 5000);
    }
}

// Initialisation
document.addEventListener('DOMContentLoaded', () => {
    window.csvInjector = new CSVInjectorV3();
});

if (typeof module !== 'undefined' && module.exports) {
    module.exports = CSVInjectorV3;
}
