// CSV Injector V5 - BRUTE FORCE - Injection simple + rechargement forcé
// Fini la complexité DOM - On injecte et on recharge !

class CSVInjectorV5 {
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

    // Diagnostic complet de la page
    diagnosticDOM() {
        console.log('🔍 === DIAGNOSTIC COMPLET ADMIN\'QUEST ===');
        
        // 1. Toutes les variables globales
        const globals = Object.keys(window).filter(key => 
            key.toLowerCase().includes('question') || 
            key.toLowerCase().includes('data') ||
            key.toLowerCase().includes('app')
        );
        console.log('🌐 Variables globales pertinentes:', globals);

        // 2. Tous les IDs de page
        const allIds = Array.from(document.querySelectorAll('[id]')).map(el => el.id);
        console.log('🆔 Tous les IDs:', allIds);

        // 3. Toutes les classes pertinentes
        const allClasses = Array.from(document.querySelectorAll('[class]'))
            .flatMap(el => Array.from(el.classList))
            .filter(cls => 
                cls.includes('question') || 
                cls.includes('container') || 
                cls.includes('list') ||
                cls.includes('tab')
            );
        console.log('📋 Classes pertinentes:', [...new Set(allClasses)]);

        // 4. Structure principale
        const mainElements = [
            document.querySelector('main'),
            document.querySelector('#app'),
            document.querySelector('.app'),
            document.querySelector('#main'),
            document.querySelector('.main')
        ].filter(el => el);
        console.log('🏗️ Éléments principaux:', mainElements.map(el => el.tagName + (el.id ? '#' + el.id : '') + (el.className ? '.' + el.className : '')));

        // 5. LocalStorage existant
        const storageKeys = Object.keys(localStorage).filter(key => 
            key.includes('question') || 
            key.includes('data') ||
            key.includes('admin')
        );
        console.log('💾 localStorage pertinent:', storageKeys);

        console.log('🔍 === FIN DIAGNOSTIC ===');
        
        return {
            globals,
            allIds,
            allClasses: [...new Set(allClasses)],
            mainElements,
            storageKeys
        };
    }

    // Injection BRUTE FORCE - on essaie TOUT
    bruteForceInject(questions) {
        console.log('💥 === INJECTION BRUTE FORCE ===');
        console.log(`📊 ${questions.length} questions à injecter`);

        // 1. Diagnostic avant injection
        const diagnostic = this.diagnosticDOM();

        // 2. Injection dans TOUTES les variables possibles
        const variableNames = [
            'questionsData', 'questions', 'allQuestions', 'questionsList', 
            'data', 'appData', 'questionsDatabase', 'questionBank',
            'csvData', 'jsonData', 'adminQuestData', 'baseData'
        ];

        variableNames.forEach(varName => {
            window[varName] = questions;
            console.log(`✅ window.${varName} = ${questions.length} questions`);
        });

        // 3. LocalStorage - TOUTES les clés possibles
        const storageKeys = [
            'questions', 'questionsData', 'adminQuest_questions',
            'questions_cache', 'data', 'appData', 'csvQuestions'
        ];

        storageKeys.forEach(key => {
            const dataWithMeta = {
                questions: questions,
                timestamp: Date.now(),
                source: 'admin_brute_force_v5',
                count: questions.length,
                injected: true
            };
            localStorage.setItem(key, JSON.stringify(dataWithMeta));
            localStorage.setItem(`${key}_simple`, JSON.stringify(questions));
            console.log(`✅ localStorage.${key} = ${questions.length} questions`);
        });

        // 4. Créer des événements pour déclencher tous les systèmes
        const events = [
            'questionsLoaded', 'dataLoaded', 'questionsUpdated', 'dataChanged',
            'adminQuestUpdate', 'csvInjected', 'forceReload', 'dataInjected'
        ];

        events.forEach(eventName => {
            try {
                const event = new CustomEvent(eventName, { 
                    detail: { 
                        questions, 
                        count: questions.length, 
                        source: 'brute_force_injection',
                        timestamp: Date.now()
                    }
                });
                window.dispatchEvent(event);
                document.dispatchEvent(event);
                console.log(`✅ Événement ${eventName} déclenché`);
            } catch (e) {
                // Ignore les erreurs d'événements
            }
        });

        // 5. Appel de TOUTES les fonctions possibles
        const functionNames = [
            'init', 'loadQuestions', 'loadData', 'displayQuestions',
            'refreshQuestions', 'updateQuestions', 'setQuestions',
            'populateQuestions', 'showQuestions', 'filterQuestions',
            'updateUI', 'refresh', 'reload', 'update', 'render'
        ];

        let functionsExecuted = 0;
        functionNames.forEach(funcName => {
            if (typeof window[funcName] === 'function') {
                try {
                    window[funcName](questions);
                    functionsExecuted++;
                    console.log(`✅ ${funcName}() appelée avec succès`);
                } catch (e) {
                    try {
                        window[funcName]();
                        functionsExecuted++;
                        console.log(`✅ ${funcName}() appelée sans paramètres`);
                    } catch (e2) {
                        console.log(`⚠️ ${funcName}() a échoué`);
                    }
                }
            }
        });

        console.log(`⚡ ${functionsExecuted} fonctions exécutées`);
        console.log('💥 === INJECTION TERMINÉE ===');
        
        return { diagnostic, functionsExecuted };
    }

    // Auto-détection du délimiteur CSV
    detectDelimiter(csvContent) {
        const firstLines = csvContent.split('\n').slice(0, 3);
        const delimiters = [';', ',', '\t'];
        let bestDelimiter = ';';
        let maxColumns = 0;

        for (const delimiter of delimiters) {
            let totalColumns = 0;

            for (const line of firstLines) {
                if (!line.trim()) continue;
                const columns = this.parseCSVLine(line, delimiter).length;
                totalColumns += columns;
            }

            const avgColumns = totalColumns / firstLines.length;
            if (avgColumns > maxColumns && avgColumns >= 10) {
                maxColumns = avgColumns;
                bestDelimiter = delimiter;
            }
        }

        return bestDelimiter;
    }

    showAdminLogin() {
        const existingModal = document.getElementById('admin-modal');
        if (existingModal) existingModal.remove();

        const modal = this.createAdminModal();
        this.currentModal = modal;
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
                background: rgba(0,0,0,0.9);
                display: flex;
                align-items: center;
                justify-content: center;
                z-index: 99999;
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
                        <h2 style="color: #333; margin-bottom: 0.5rem;">💥 Admin'Quest V5</h2>
                        <p style="color: #666; margin-bottom: 0;">BRUTE FORCE - Injection + rechargement</p>
                        <small style="color: #999;">Fini la complexité DOM !</small>
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
                        " placeholder="FABRICE2025">
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
                            🔓 Accéder au mode BRUTE FORCE
                        </button>
                    </div>
                    
                    <div id="admin-panel" style="display: none;">
                        
                        <button id="diagnostic-btn" style="
                            width: 100%;
                            background: linear-gradient(135deg, #17a2b8, #138496);
                            color: white;
                            border: none;
                            padding: 0.75rem;
                            border-radius: 8px;
                            font-size: 1rem;
                            cursor: pointer;
                            margin-bottom: 1rem;
                            font-weight: 500;
                        ">
                            🔍 Diagnostic complet de la page
                        </button>
                        
                        <div style="margin-bottom: 1rem;">
                            <label style="display: block; margin-bottom: 0.5rem; color: #333; font-weight: 500;">
                                📁 Fichier CSV ou JSON :
                            </label>
                            <input type="file" id="file-input" accept=".csv,.json" style="
                                width: 100%;
                                padding: 0.5rem;
                                border: 2px dashed #ddd;
                                border-radius: 8px;
                                margin-bottom: 1rem;
                            ">
                            
                            <div style="
                                background: linear-gradient(135deg, #fff3cd, #ffeaa7);
                                border: 1px solid #ffc107;
                                border-radius: 8px;
                                padding: 1rem;
                                margin-bottom: 1rem;
                                font-size: 0.9rem;
                            ">
                                <strong>💥 MÉTHODE BRUTE FORCE</strong><br>
                                ✅ Injection dans toutes les variables possibles<br>
                                ✅ localStorage dans toutes les clés<br>
                                ✅ Déclenchement de tous les événements<br>
                                ✅ <strong>Rechargement automatique de la page</strong>
                            </div>
                            
                            <button id="process-btn" style="
                                width: 100%;
                                background: linear-gradient(135deg, #dc3545, #c82333);
                                color: white;
                                border: none;
                                padding: 0.75rem;
                                border-radius: 8px;
                                font-size: 1rem;
                                cursor: pointer;
                                margin-bottom: 1rem;
                                font-weight: 500;
                            " disabled>
                                💥 INJECTION BRUTE FORCE + RECHARGEMENT
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
                                background: linear-gradient(90deg, #dc3545, #c82333);
                                width: 0%;
                                transition: width 0.3s;
                            "></div>
                        </div>
                        
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
                        
                        <div id="admin-status" style="
                            padding: 0.75rem;
                            border-radius: 8px;
                            margin-bottom: 1rem;
                            display: none;
                        "></div>
                        
                        <div style="text-align: center; font-size: 0.9rem; color: #666; margin-top: 1rem;">
                            <p><strong>⚠️ ATTENTION :</strong> Cette méthode va recharger la page après injection</p>
                            <p>Si ça ne marche pas, c'est qu'Admin'Quest a un système particulier</p>
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
                this.showStatus(modal, 'Mode BRUTE FORCE activé ! Fabrice connecté.', 'success');
            } else {
                this.showStatus(modal, 'Mot de passe incorrect.', 'error');
                passwordInput.value = '';
            }
        };

        authButton.addEventListener('click', authenticate);
        passwordInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') authenticate();
        });

        // Diagnostic
        modal.querySelector('#diagnostic-btn').addEventListener('click', () => {
            modal.querySelector('#admin-log').style.display = 'block';
            this.log(modal, '🔍 Lancement diagnostic complet...', 'info');
            
            const result = this.diagnosticDOM();
            
            this.log(modal, `🌐 ${result.globals.length} variables globales trouvées`, 'info');
            this.log(modal, `🆔 ${result.allIds.length} éléments avec ID`, 'info');
            this.log(modal, `📋 ${result.allClasses.length} classes pertinentes`, 'info');
            this.log(modal, `🏗️ ${result.mainElements.length} éléments principaux`, 'info');
            this.log(modal, `💾 ${result.storageKeys.length} clés localStorage existantes`, 'info');
            this.log(modal, '✅ Diagnostic terminé - Vérifiez la console (F12)', 'success');
        });

        // Gestion fichier
        const fileInput = modal.querySelector('#file-input');
        const processBtn = modal.querySelector('#process-btn');
        
        fileInput.addEventListener('change', () => {
            const file = fileInput.files[0];
            processBtn.disabled = !file;
            if (file) {
                this.log(modal, `📁 ${file.name} (${(file.size/1024).toFixed(1)} KB)`, 'info');
            }
        });

        // Traitement BRUTE FORCE
        processBtn.addEventListener('click', async () => {
            const file = fileInput.files[0];
            if (!file) return;

            try {
                this.showProgress(modal, 0);
                modal.querySelector('#admin-progress').style.display = 'block';
                modal.querySelector('#admin-log').style.display = 'block';
                
                this.log(modal, '💥 DÉBUT INJECTION BRUTE FORCE', 'info');
                
                // Lecture fichier
                const content = await this.readFile(file);
                this.showProgress(modal, 20);
                
                let questions;
                
                if (file.name.endsWith('.json')) {
                    // Fichier JSON
                    questions = JSON.parse(content);
                    this.log(modal, `📄 JSON parsé: ${questions.length} questions`, 'success');
                } else {
                    // Fichier CSV
                    const delimiter = this.detectDelimiter(content);
                    this.log(modal, `📊 CSV délimiteur détecté: "${delimiter}"`, 'info');
                    
                    const allQuestions = this.parseCSV(content, delimiter);
                    questions = this.validateQuestions(allQuestions);
                    this.log(modal, `📊 CSV parsé: ${questions.length}/${allQuestions.length} valides`, 'success');
                }
                
                this.showProgress(modal, 60);
                
                if (questions.length === 0) {
                    throw new Error('Aucune question valide trouvée');
                }
                
                // INJECTION BRUTE FORCE
                this.log(modal, '💥 Injection brute force en cours...', 'info');
                const result = this.bruteForceInject(questions);
                this.showProgress(modal, 90);
                
                processedData = questions;
                
                this.log(modal, `✅ ${questions.length} questions injectées partout !`, 'success');
                this.log(modal, `⚡ ${result.functionsExecuted} fonctions appelées`, 'info');
                
                this.showProgress(modal, 100);
                this.showStatus(modal, `💥 INJECTION TERMINÉE ! Rechargement dans 3 secondes...`, 'success');
                
                // Rechargement automatique après 3 secondes
                setTimeout(() => {
                    this.log(modal, '🔄 Rechargement de la page...', 'info');
                    location.reload();
                }, 3000);
                
            } catch (error) {
                this.log(modal, `❌ ${error.message}`, 'error');
                this.showStatus(modal, `❌ ${error.message}`, 'error');
            }
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
    }
}

// Initialisation
document.addEventListener('DOMContentLoaded', () => {
    window.csvInjector = new CSVInjectorV5();
});

if (typeof module !== 'undefined' && module.exports) {
    module.exports = CSVInjectorV5;
}
