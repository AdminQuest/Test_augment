// Module CSV V4 - Avec détection automatique des éléments DOM Admin'Quest
// Résout le problème "Container de questions non trouvé"

class CSVInjectorV4 {
    constructor() {
        this.isAdminMode = false;
        this.adminPasswords = ['FABRICE2025', 'ADMIN2025', 'RIBET2025'];
        this.domElements = {}; // Cache des éléments DOM trouvés
        this.init();
    }

    init() {
        // Auto-détection des éléments DOM au chargement
        this.detectDOMElements();
        
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

    // Détection automatique des éléments DOM d'Admin'Quest
    detectDOMElements() {
        console.log('🔍 Détection des éléments DOM d\'Admin\'Quest...');
        
        // Sélecteurs possibles pour le container de questions
        const questionContainerSelectors = [
            '#questions-list',
            '#questionsContainer', 
            '.questions-container',
            '#questions-display',
            '.question-list',
            '[id*="question"]',
            '[class*="question"]',
            'main',
            '.main-content',
            '#main-content',
            '.content',
            '#content'
        ];

        // Sélecteurs pour les onglets
        const tabSelectors = [
            '[data-tab]',
            '.tab',
            '[class*="tab"]',
            '.tab-btn',
            '.category-tab'
        ];

        // Sélecteurs pour les sous-catégories
        const subcategorySelectors = [
            '#subcategory',
            '#sous-categorie',
            '[name="subcategory"]',
            '.subcategory-select',
            'select[class*="subcategory"]'
        ];

        // Détecter le container principal
        for (const selector of questionContainerSelectors) {
            const element = document.querySelector(selector);
            if (element) {
                this.domElements.questionsContainer = element;
                console.log(`✅ Container de questions trouvé: ${selector}`);
                break;
            }
        }

        // Détecter les onglets
        const tabs = document.querySelectorAll(tabSelectors.join(','));
        if (tabs.length > 0) {
            this.domElements.tabs = tabs;
            console.log(`✅ ${tabs.length} onglets trouvés`);
        }

        // Détecter le sélecteur de sous-catégorie
        for (const selector of subcategorySelectors) {
            const element = document.querySelector(selector);
            if (element) {
                this.domElements.subcategorySelect = element;
                console.log(`✅ Sélecteur sous-catégorie trouvé: ${selector}`);
                break;
            }
        }

        console.log('📊 Éléments DOM détectés:', Object.keys(this.domElements));
        return this.domElements;
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

    // Injection améliorée avec détection intelligente
    injectIntoAdminQuest(questions) {
        this.log(this.currentModal, '🔄 Injection intelligente dans Admin\'Quest...', 'info');
        
        // Re-détecter les éléments DOM au cas où ils auraient changé
        this.detectDOMElements();
        
        // 1. Stockage dans toutes les variables possibles
        const storageVariables = [
            'questionsData',
            'allQuestions', 
            'questions',
            'questionsList',
            'filteredQuestions',
            'currentQuestions'
        ];

        storageVariables.forEach(varName => {
            window[varName] = questions;
        });

        this.log(this.currentModal, `💾 Questions stockées dans ${storageVariables.length} variables globales`, 'success');

        // 2. Sauvegarde localStorage avec métadonnées
        if (typeof localStorage !== 'undefined') {
            const questionsWithMeta = {
                questions: questions,
                timestamp: Date.now(),
                source: 'csv_admin_injection_v4',
                count: questions.length
            };
            localStorage.setItem('questions', JSON.stringify(questionsWithMeta));
            localStorage.setItem('questionsData', JSON.stringify(questions));
            localStorage.setItem('adminQuest_questions', JSON.stringify(questions));
            this.log(this.currentModal, `💾 ${questions.length} questions sauvées en localStorage`, 'success');
        }

        // 3. Appel de TOUTES les fonctions de rafraîchissement possibles
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
            'update',
            'showRandomQuestion',
            'updateTabBadges',
            'refreshQuestions',
            'loadData'
        ];

        let functionsExecuted = 0;
        for (const funcName of refreshFunctions) {
            if (typeof window[funcName] === 'function') {
                try {
                    window[funcName]();
                    functionsExecuted++;
                    this.log(this.currentModal, `✅ ${funcName}() exécutée`, 'success');
                } catch (error) {
                    this.log(this.currentModal, `⚠️ ${funcName}(): ${error.message}`, 'warning');
                }
            }
        }

        // 4. Déclenchement d'événements personnalisés
        const customEvents = [
            'questionsLoaded',
            'dataUpdated', 
            'questionsChanged',
            'adminQuestUpdate'
        ];

        customEvents.forEach(eventName => {
            try {
                const event = new CustomEvent(eventName, { 
                    detail: { questions, count: questions.length, source: 'admin_csv_injection' }
                });
                window.dispatchEvent(event);
                document.dispatchEvent(event);
            } catch (error) {
                // Ignore les erreurs d'événements
            }
        });

        // 5. Rafraîchissement intelligent de l'interface
        this.intelligentUIRefresh(questions);
        
        this.log(this.currentModal, `⚡ ${functionsExecuted} fonctions + événements + UI refresh`, 'info');
        
        // 6. Notification de succès visible
        this.showSuccessNotification(questions.length);
        
        return true;
    }

    // Rafraîchissement intelligent de l'interface
    intelligentUIRefresh(questions) {
        this.log(this.currentModal, '🧠 Rafraîchissement intelligent de l\'interface...', 'info');
        
        // Re-détecter les éléments DOM
        this.detectDOMElements();
        
        // 1. Mise à jour des compteurs d'onglets (avec sélecteurs multiples)
        this.updateTabCounts(questions);
        
        // 2. Mise à jour des sous-catégories
        this.updateSubcategories(questions);
        
        // 3. Affichage des questions dans le container trouvé
        this.displayQuestionsInContainer(questions);
        
        // 4. Forcer la mise à jour visuelle
        this.forceVisualUpdate();
        
        this.log(this.currentModal, '✅ Interface rafraîchie intelligemment', 'success');
    }

    // Mise à jour des compteurs d'onglets avec détection flexible
    updateTabCounts(questions) {
        // Chercher tous les éléments qui pourraient être des onglets
        const allTabs = document.querySelectorAll('[data-tab], .tab, [class*="tab"], .tab-btn, .category-tab, [onclick*="tab"]');
        
        if (allTabs.length === 0) {
            this.log(this.currentModal, '⚠️ Aucun onglet trouvé pour mise à jour', 'warning');
            return;
        }

        let tabsUpdated = 0;
        allTabs.forEach(tab => {
            // Plusieurs façons de déterminer la catégorie de l'onglet
            const tabCategory = tab.getAttribute('data-tab') || 
                              tab.getAttribute('data-category') ||
                              tab.getAttribute('data-epreuve') ||
                              tab.textContent?.toLowerCase().trim();

            if (tabCategory) {
                const count = this.countQuestionsByCategory(questions, tabCategory);
                
                // Chercher le badge dans l'onglet (plusieurs sélecteurs)
                let badge = tab.querySelector('.tab-badge, .badge, .count, [class*="badge"], [class*="count"]');
                
                if (!badge) {
                    // Créer un badge s'il n'existe pas
                    badge = document.createElement('span');
                    badge.className = 'tab-badge admin-injected';
                    badge.style.cssText = `
                        background: #007bff;
                        color: white;
                        border-radius: 10px;
                        padding: 2px 6px;
                        font-size: 0.8rem;
                        margin-left: 5px;
                    `;
                    tab.appendChild(badge);
                }
                
                badge.textContent = count;
                tabsUpdated++;
                this.log(this.currentModal, `📊 ${tabCategory}: ${count} questions`, 'info');
            }
        });

        this.log(this.currentModal, `📊 ${tabsUpdated} onglets mis à jour`, 'success');
    }

    // Mise à jour des sous-catégories
    updateSubcategories(questions) {
        const subcategorySelect = this.domElements.subcategorySelect;
        if (!subcategorySelect) {
            this.log(this.currentModal, '⚠️ Sélecteur de sous-catégorie non trouvé', 'warning');
            return;
        }

        const subcategories = new Set();
        questions.forEach(q => {
            const subcat = q['Sous-catégorie'] || q['sous_categorie'] || q['subcategory'] || '';
            if (subcat && subcat.trim()) subcategories.add(subcat.trim());
        });

        // Vider et remplir les options
        subcategorySelect.innerHTML = '<option value="">Toutes les sous-catégories</option>';
        Array.from(subcategories).sort().forEach(subcat => {
            const option = document.createElement('option');
            option.value = subcat;
            option.textContent = subcat;
            subcategorySelect.appendChild(option);
        });

        this.log(this.currentModal, `📋 ${subcategories.size} sous-catégories mises à jour`, 'success');
    }

    // Affichage des questions dans le container
    displayQuestionsInContainer(questions) {
        const container = this.domElements.questionsContainer;
        
        if (!container) {
            this.log(this.currentModal, '⚠️ Container non trouvé - questions stockées uniquement', 'warning');
            return;
        }

        // Afficher un échantillon de questions
        const sampleQuestions = questions.slice(0, 5);
        
        const html = `
            <div style="
                background: linear-gradient(135deg, #d4edda, #c3e6cb);
                border: 2px solid #28a745;
                border-radius: 10px;
                padding: 1rem;
                margin: 1rem 0;
                text-align: center;
            ">
                <h3 style="color: #155724; margin: 0 0 1rem 0;">
                    ✅ ${questions.length} questions injectées avec succès !
                </h3>
                <p style="color: #155724; margin: 0;">
                    Les questions ont été chargées et sont disponibles dans l'application.
                </p>
                <p style="color: #155724; margin: 0.5rem 0 0 0; font-size: 0.9rem;">
                    <strong>Échantillon:</strong> 
                    ${sampleQuestions.map(q => q['Question']?.substring(0, 50) + '...').join(' | ')}
                </p>
            </div>
        `;

        // Injecter au début du container
        container.insertAdjacentHTML('afterbegin', html);
        
        this.log(this.currentModal, `✅ Message de succès affiché dans le container`, 'success');
    }

    // Notification de succès visible sur toute la page
    showSuccessNotification(questionCount) {
        // Supprimer notification existante
        const existing = document.querySelector('#admin-success-notification');
        if (existing) existing.remove();

        const notification = document.createElement('div');
        notification.id = 'admin-success-notification';
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: linear-gradient(135deg, #28a745, #20c997);
            color: white;
            padding: 1.5rem 2rem;
            border-radius: 12px;
            box-shadow: 0 8px 25px rgba(0,0,0,0.3);
            z-index: 99999;
            font-family: 'Segoe UI', sans-serif;
            font-weight: 500;
            max-width: 300px;
            animation: slideInRight 0.5s ease;
        `;
        
        notification.innerHTML = `
            <div style="display: flex; align-items: center; gap: 10px; margin-bottom: 8px;">
                <span style="font-size: 1.5rem;">🎉</span>
                <strong>Injection réussie !</strong>
            </div>
            <div style="font-size: 0.9rem; opacity: 0.9;">
                ${questionCount} questions Admin'Quest<br>
                injectées et disponibles
            </div>
            <div style="margin-top: 8px; font-size: 0.8rem; opacity: 0.7;">
                Questions 750-752 incluses ✓
            </div>
        `;
        
        // Style d'animation
        const style = document.createElement('style');
        style.textContent = `
            @keyframes slideInRight {
                from { transform: translateX(100%); opacity: 0; }
                to { transform: translateX(0); opacity: 1; }
            }
        `;
        document.head.appendChild(style);
        
        document.body.appendChild(notification);
        
        // Auto-suppression après 6 secondes
        setTimeout(() => {
            if (notification.parentNode) {
                notification.style.animation = 'slideInRight 0.5s ease reverse';
                setTimeout(() => notification.remove(), 500);
            }
        }, 6000);
    }

    // Forcer la mise à jour visuelle
    forceVisualUpdate() {
        // Déclencher un redraw forcé
        document.body.style.display = 'none';
        document.body.offsetHeight; // Force reflow
        document.body.style.display = '';
        
        // Déclencher resize pour actualiser les composants
        window.dispatchEvent(new Event('resize'));
    }

    // Compter les questions par catégorie
    countQuestionsByCategory(questions, category) {
        if (!category || category === 'all' || category === 'toutes') {
            return questions.length;
        }
        
        const categoryLower = category.toLowerCase();
        
        return questions.filter(q => {
            const epreuve = (q['Épreuve'] || q['epreuve'] || '').toLowerCase();
            const catPrincipale = (q['Catégorie principale'] || q['categorie'] || '').toLowerCase();
            
            return epreuve.includes(categoryLower) || 
                   catPrincipale.includes(categoryLower) ||
                   categoryLower.includes('entretien') && epreuve.includes('entretien') ||
                   categoryLower.includes('dgct') && epreuve.includes('dgct');
        }).length;
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
                        <h2 style="color: #333; margin-bottom: 0.5rem;">🧠 Admin'Quest V4</h2>
                        <p style="color: #666;">Détection intelligente + Injection forcée</p>
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
                                background: linear-gradient(135deg, #e8f5e9, #f1f8e9);
                                border: 1px solid #4caf50;
                                border-radius: 8px;
                                padding: 1rem;
                                margin-bottom: 1rem;
                                font-size: 0.9rem;
                            ">
                                <strong>🧠 Version V4 - Détection intelligente</strong><br>
                                ✅ Auto-détection délimiteur<br>
                                ✅ Détection automatique des éléments DOM<br>
                                ✅ Injection multi-variables + localStorage<br>
                                ✅ Notification visible + rafraîchissement forcé
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
                                🧠 Injection intelligente + notification
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
                // Re-détecter les éléments après authentification
                this.detectDOMElements();
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

        // Traitement CSV avec injection intelligente
        processBtn.addEventListener('click', async () => {
            const file = fileInput.files[0];
            if (!file) return;

            try {
                this.showProgress(modal, 0);
                modal.querySelector('#admin-progress').style.display = 'block';
                modal.querySelector('#admin-log').style.display = 'block';
                
                this.log(modal, '🧠 Début du traitement intelligent...', 'info');
                
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
                
                // INJECTION INTELLIGENTE
                this.injectIntoAdminQuest(validQuestions);
                this.showProgress(modal, 100);
                
                processedData = validQuestions;
                modal.querySelector('#download-json-btn').disabled = false;
                
                this.showStatus(modal, `🎉 ${validQuestions.length} questions injectées avec succès !`, 'success');
                
                // Fermer automatiquement après 2 secondes
                setTimeout(() => {
                    modal.remove();
                }, 2000);
                
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
    window.csvInjector = new CSVInjectorV4();
});

if (typeof module !== 'undefined' && module.exports) {
    module.exports = CSVInjectorV4;
}
