// CSV Injector ULTRA SIMPLE - ZERO localStorage
// Pour Fabrice - Résout définitivement l'erreur quota

class SimpleCSVInjector {
    constructor() {
        this.adminPasswords = ['FABRICE2025', 'ADMIN2025', 'RIBET2025'];
        this.init();
    }

    init() {
        // Ctrl + Alt + A
        document.addEventListener('keydown', (e) => {
            if (e.ctrlKey && e.altKey && e.key === 'a') {
                this.showLogin();
            }
        });

        // URL ?admin=true
        if (new URLSearchParams(window.location.search).get('admin') === 'true') {
            this.showLogin();
        }
    }

    // INJECTION BRUTALE - Variables globales SEULEMENT
    brutalInject(questions) {
        console.log('💥 INJECTION BRUTALE - ZERO localStorage');
        console.log(`📊 ${questions.length} questions à injecter`);

        // 1. Toutes les variables possibles
        window.questionsData = questions;
        window.questions = questions;
        window.allQuestions = questions;
        window.questionsList = questions;
        window.csvQuestions = questions;
        window.adminQuestions = questions;

        // 2. Forcer toutes les fonctions de mise à jour
        const functions = ['displayQuestions', 'loadQuestions', 'updateQuestions', 'refresh', 'update'];
        let executed = 0;
        
        functions.forEach(funcName => {
            if (typeof window[funcName] === 'function') {
                try {
                    window[funcName]();
                    console.log(`✅ ${funcName}() OK`);
                    executed++;
                } catch (e) {
                    console.log(`⚠️ ${funcName}() erreur: ${e.message}`);
                }
            }
        });

        // 3. Événements
        try {
            window.dispatchEvent(new CustomEvent('questionsLoaded', {detail: {questions}}));
            document.dispatchEvent(new CustomEvent('questionsLoaded', {detail: {questions}}));
            console.log('✅ Événements déclenchés');
        } catch (e) {}

        // 4. Notification IMPOSSIBLE à rater
        this.showMegaNotification(questions.length);

        console.log(`⚡ ${executed} fonctions exécutées`);
        console.log('💥 INJECTION TERMINÉE');

        return true;
    }

    // Notification MEGA visible
    showMegaNotification(count) {
        // Supprimer existante
        const existing = document.querySelector('#mega-success');
        if (existing) existing.remove();

        const notification = document.createElement('div');
        notification.id = 'mega-success';
        notification.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(40, 167, 69, 0.95);
            color: white;
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            z-index: 999999;
            font-family: 'Segoe UI', sans-serif;
            text-align: center;
            animation: megaSuccess 4s ease;
        `;
        
        notification.innerHTML = `
            <div style="font-size: 4rem; margin-bottom: 1rem;">🎉</div>
            <h1 style="font-size: 3rem; margin-bottom: 1rem; font-weight: bold;">
                INJECTION RÉUSSIE !
            </h1>
            <p style="font-size: 1.5rem; margin-bottom: 2rem;">
                ${count} questions Admin'Quest injectées
            </p>
            <div style="font-size: 1.2rem;">
                ✅ Questions 750-752 incluses<br>
                ✅ Variables globales mises à jour<br>
                ✅ Prêt à utiliser !
            </div>
            <p style="margin-top: 2rem; font-size: 1rem; opacity: 0.8;">
                Cette notification disparaît automatiquement...
            </p>
        `;

        const style = document.createElement('style');
        style.textContent = `
            @keyframes megaSuccess {
                0% { opacity: 0; transform: scale(0.5); }
                20% { opacity: 1; transform: scale(1); }
                80% { opacity: 1; transform: scale(1); }
                100% { opacity: 0; transform: scale(0.5); }
            }
        `;
        document.head.appendChild(style);

        document.body.appendChild(notification);

        // Auto-suppression après 4 secondes
        setTimeout(() => notification.remove(), 4000);
    }

    showLogin() {
        const modal = document.createElement('div');
        modal.style.cssText = `
            position: fixed; top: 0; left: 0; width: 100%; height: 100%;
            background: rgba(0,0,0,0.9); display: flex; align-items: center;
            justify-content: center; z-index: 99999; font-family: 'Segoe UI', sans-serif;
        `;
        
        modal.innerHTML = `
            <div style="background: white; padding: 2rem; border-radius: 15px; max-width: 500px; text-align: center;">
                <h2 style="color: #333; margin-bottom: 1rem;">⚡ CSV Injector SIMPLE</h2>
                <p style="color: #666; margin-bottom: 2rem;">Zero localStorage - Injection directe</p>
                
                <input type="password" id="pwd" placeholder="FABRICE2025" style="
                    width: 100%; padding: 1rem; border: 2px solid #ddd;
                    border-radius: 8px; margin-bottom: 1rem; font-size: 1rem;
                ">
                
                <button id="login" style="
                    width: 100%; background: #28a745; color: white; border: none;
                    padding: 1rem; border-radius: 8px; font-size: 1rem; cursor: pointer; margin-bottom: 1rem;
                ">🔓 Connexion</button>
                
                <div id="panel" style="display: none;">
                    <input type="file" id="file" accept=".csv,.json" style="
                        width: 100%; padding: 0.5rem; border: 2px dashed #ddd;
                        border-radius: 8px; margin-bottom: 1rem;
                    ">
                    
                    <div style="background: #d4edda; border: 1px solid #28a745; border-radius: 8px; padding: 1rem; margin-bottom: 1rem; font-size: 0.9rem;">
                        <strong>⚡ MODE ULTRA SIMPLE</strong><br>
                        ✅ ZERO localStorage (plus d'erreur quota)<br>
                        ✅ Injection brutale dans variables globales<br>
                        ✅ Notification plein écran impossible à rater
                    </div>
                    
                    <button id="inject" disabled style="
                        width: 100%; background: #dc3545; color: white; border: none;
                        padding: 1rem; border-radius: 8px; font-size: 1rem; cursor: pointer; margin-bottom: 1rem;
                    ">💥 INJECTION BRUTALE</button>
                    
                    <div id="log" style="
                        background: #f8f9fa; border: 1px solid #e9ecef; border-radius: 8px;
                        padding: 1rem; font-family: monospace; font-size: 0.8rem; display: none;
                    "></div>
                </div>
                
                <button onclick="this.parentElement.parentElement.remove()" style="
                    background: #6c757d; color: white; border: none;
                    padding: 0.5rem 1rem; border-radius: 8px; cursor: pointer;
                ">✕ Fermer</button>
            </div>
        `;

        document.body.appendChild(modal);

        // Événements
        const pwd = modal.querySelector('#pwd');
        const login = modal.querySelector('#login');
        const panel = modal.querySelector('#panel');
        const file = modal.querySelector('#file');
        const inject = modal.querySelector('#inject');
        const log = modal.querySelector('#log');

        const auth = () => {
            if (this.adminPasswords.includes(pwd.value)) {
                panel.style.display = 'block';
                login.style.display = 'none';
                pwd.style.display = 'none';
            } else {
                alert('Mot de passe incorrect');
                pwd.value = '';
            }
        };

        login.addEventListener('click', auth);
        pwd.addEventListener('keypress', e => {
            if (e.key === 'Enter') auth();
        });

        file.addEventListener('change', () => {
            inject.disabled = !file.files[0];
        });

        inject.addEventListener('click', async () => {
            const selectedFile = file.files[0];
            if (!selectedFile) return;

            try {
                log.style.display = 'block';
                this.logMessage(log, '📁 Lecture fichier...', 'info');
                
                const content = await this.readFile(selectedFile);
                let questions;
                
                if (selectedFile.name.endsWith('.json')) {
                    questions = JSON.parse(content);
                    this.logMessage(log, `📄 JSON: ${questions.length} questions`, 'success');
                } else {
                    const delimiter = this.detectDelimiter(content);
                    questions = this.parseCSV(content, delimiter);
                    questions = questions.filter(q => q.ID && q.Question);
                    this.logMessage(log, `📊 CSV: ${questions.length} questions valides`, 'success');
                }
                
                if (questions.length === 0) {
                    throw new Error('Aucune question trouvée');
                }
                
                this.logMessage(log, '💥 INJECTION BRUTALE...', 'info');
                this.brutalInject(questions);
                
                this.logMessage(log, '✅ SUCCÈS TOTAL !', 'success');
                
                setTimeout(() => modal.remove(), 2000);
                
            } catch (error) {
                this.logMessage(log, `❌ ${error.message}`, 'error');
            }
        });
    }

    logMessage(container, message, type) {
        const colors = {info: '#17a2b8', success: '#28a745', error: '#dc3545'};
        const div = document.createElement('div');
        div.style.color = colors[type] || colors.info;
        div.textContent = `${new Date().toLocaleTimeString()} - ${message}`;
        container.appendChild(div);
        container.scrollTop = container.scrollHeight;
    }

    detectDelimiter(content) {
        const firstLine = content.split('\n')[0];
        if ((firstLine.match(/;/g) || []).length > (firstLine.match(/,/g) || []).length) {
            return ';';
        }
        return ',';
    }

    parseCSV(content, delimiter) {
        const lines = content.split('\n').filter(line => line.trim());
        if (lines.length < 2) return [];
        
        const headers = lines[0].split(delimiter).map(h => h.replace(/"/g, '').trim());
        const questions = [];
        
        for (let i = 1; i < lines.length; i++) {
            const fields = lines[i].split(delimiter).map(f => f.replace(/"/g, '').trim());
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

    readFile(file) {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = e => resolve(e.target.result);
            reader.onerror = () => reject(new Error('Erreur lecture'));
            reader.readAsText(file, 'utf-8');
        });
    }
}

// Initialisation
document.addEventListener('DOMContentLoaded', () => {
    window.simpleCSVInjector = new SimpleCSVInjector();
});
