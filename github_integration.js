// ===============================
// MODIFICATION POUR CHARGEMENT GITHUB PAGES
// ===============================

/**
 * À ajouter au début du script, après les variables globales
 * Remplace : const GITHUB_QUESTIONS_URL par votre URL GitHub Pages
 */

// Configuration GitHub Pages (à personnaliser)
const GITHUB_QUESTIONS_URL = 'https://VOTRE-USERNAME.github.io/admin-quest/questions.json';

/**
 * NOUVELLE FONCTION : Charge automatiquement les questions depuis GitHub Pages
 * Compatible avec la structure exacte de votre code
 */
async function loadQuestionsFromGitHub() {
    try {
        console.log("🌐 Chargement des questions depuis GitHub Pages...");
        console.log(`📍 URL: ${GITHUB_QUESTIONS_URL}`);
        
        const response = await fetch(GITHUB_QUESTIONS_URL, {
            cache: 'no-cache', // Force refresh
            headers: {
                'Cache-Control': 'no-cache'
            }
        });
        
        if (!response.ok) {
            throw new Error(`Erreur HTTP: ${response.status} - ${response.statusText}`);
        }
        
        const data = await response.json();
        console.log("📦 Données reçues:", data);
        
        // Vérifier la structure des données (même format que votre code)
        if (!data.questions || !Array.isArray(data.questions)) {
            throw new Error('Format de données invalide - questions manquantes');
        }
        
        // Validation supplémentaire pour s'assurer que les questions ont la bonne structure
        const firstQuestion = data.questions[0];
        if (!firstQuestion || !firstQuestion.id || !firstQuestion.question) {
            throw new Error('Structure de question invalide');
        }
        
        console.log(`✅ ${data.questions.length} questions chargées depuis GitHub`);
        console.log(`📊 Version: ${data.metadata?.version || 'inconnue'}`);
        console.log(`📅 Générée le: ${data.metadata?.generatedAt || 'inconnue'}`);
        console.log(`📈 Stats:`, data.metadata?.stats || 'aucune');
        
        return data.questions;
        
    } catch (error) {
        console.error("❌ Erreur lors du chargement depuis GitHub:", error);
        console.log("🔄 Fallback vers questions d'exemple...");
        return null; // Déclenche le fallback
    }
}

/**
 * FONCTION MODIFIÉE : init() avec chargement GitHub automatique
 * Remplace votre fonction init() actuelle
 */
async function init() {
    console.log("🔍 Initialisation Admin'Quest avec GitHub Pages");
    
    // Initialiser les éléments DOM (identique à votre code)
    categoryFilter = document.getElementById('categoryFilter');
    subcategoryFilter = document.getElementById('subcategoryFilter');
    difficultyFilter = document.getElementById('difficultyFilter');
    searchInput = document.getElementById('searchInput');
    randomButton = document.getElementById('randomButton');
    importButton = document.getElementById('importButton');
    resetButton = document.getElementById('resetButton');
    questionsCount = document.getElementById('questionsCount');
    questionList = document.getElementById('questionList');
    
    if (!categoryFilter || !subcategoryFilter || !questionList) {
        console.error("🔍 Éléments DOM manquants pour l'initialisation");
        return;
    }
    
    // Afficher un message de chargement
    questionList.innerHTML = '<div style="text-align: center; padding: 40px; color: #3498db; font-size: 1.2em;"><i class="fas fa-spinner fa-spin"></i> Chargement des questions depuis GitHub...</div>';
    questionsCount.textContent = 'Synchronisation en cours...';
    
    // 1. PRIORITÉ : Essayer de charger depuis GitHub Pages
    let questionsFromGitHub = await loadQuestionsFromGitHub();
    
    if (questionsFromGitHub && questionsFromGitHub.length > 0) {
        // Succès GitHub : utiliser les données distantes
        questions = questionsFromGitHub;
        console.log("🌐 Questions GitHub chargées avec succès");
        
        // Sauvegarder en cache local pour offline
        try {
            localStorage.setItem('examQuestions', JSON.stringify(questions));
            localStorage.setItem('examQuestions_timestamp', new Date().getTime());
            localStorage.setItem('examQuestions_source', 'github');
            console.log("💾 Questions sauvegardées en cache local");
        } catch (e) {
            console.warn("⚠️ Impossible de sauvegarder en cache:", e);
        }
        
    } else {
        // Fallback 1 : localStorage (cache offline)
        console.log("📱 Tentative de chargement depuis le cache local...");
        const savedQuestions = localStorage.getItem('examQuestions');
        const cacheSource = localStorage.getItem('examQuestions_source') || 'unknown';
        
        if (savedQuestions) {
            try {
                questions = JSON.parse(savedQuestions);
                console.log(`💾 ${questions.length} questions chargées depuis le cache local (source: ${cacheSource})`);
                
                // Afficher un message indiquant qu'on utilise le cache
                questionList.innerHTML = '<div style="text-align: center; padding: 20px; background: #fff3cd; border: 1px solid #ffeaa7; border-radius: 5px; color: #856404; margin-bottom: 20px;"><i class="fas fa-exclamation-triangle"></i> <strong>Mode hors ligne</strong> - Questions depuis le cache local. Vérifiez votre connexion internet.</div>';
                
            } catch (e) {
                console.error("❌ Erreur cache local:", e);
                questions = null;
            }
        }
        
        // Fallback 2 : questions d'exemple (dernier recours)
        if (!questions || questions.length === 0) {
            console.log("📝 Chargement des questions d'exemple");
            loadSampleQuestions();
            
            // Afficher un message indiquant qu'on utilise les exemples
            questionList.innerHTML = '<div style="text-align: center; padding: 20px; background: #d1ecf1; border: 1px solid #bee5eb; border-radius: 5px; color: #0c5460; margin-bottom: 20px;"><i class="fas fa-info-circle"></i> <strong>Mode démonstration</strong> - Questions d\'exemple. Connectez-vous à internet pour accéder à la base complète.</div>';
            
            return; // loadSampleQuestions() gère déjà le reste
        }
    }
    
    // Initialiser l'interface avec les questions chargées
    populateSubcategories('all');
    updateTabCounts();
    filterQuestions();
    
    // Configurer les événements (identique à votre code)
    categoryFilter.addEventListener('change', function() {
        populateSubcategories(this.value);
        filterQuestions();
    });
    
    subcategoryFilter.addEventListener('change', filterQuestions);
    difficultyFilter.addEventListener('change', filterQuestions);
    searchInput.addEventListener('input', filterQuestions);
    randomButton.addEventListener('click', showRandomQuestion);
    
    // MODIFICATION : Remplacer le bouton import par un bouton refresh GitHub
    importButton.textContent = '🔄 Actualiser depuis GitHub';
    importButton.title = 'Recharger les dernières questions depuis GitHub Pages';
    importButton.addEventListener('click', refreshFromGitHub);
    
    resetButton.addEventListener('click', resetFilters);
    
    // Écouteur pour les réponses automatiques (identique à votre code)
    const showAutoResponsesCheckbox = document.getElementById('showAutoResponses');
    if (showAutoResponsesCheckbox) {
        showAutoResponsesCheckbox.addEventListener('change', function() {
            const autoResponses = document.querySelectorAll('.auto-response');
            autoResponses.forEach(response => {
                response.style.display = this.checked ? 'block' : 'none';
            });
        });
    }
    
    console.log("✅ Admin'Quest initialisé avec GitHub Pages");
}

/**
 * NOUVELLE FONCTION : Actualisation forcée depuis GitHub
 */
async function refreshFromGitHub() {
    const button = document.getElementById('importButton');
    const originalText = button.textContent;
    
    button.textContent = '🔄 Actualisation...';
    button.disabled = true;
    button.style.opacity = '0.6';
    
    // Message de chargement
    questionList.innerHTML = '<div style="text-align: center; padding: 40px; color: #3498db; font-size: 1.2em;"><i class="fas fa-sync fa-spin"></i> Actualisation depuis GitHub...</div>';
    questionsCount.textContent = 'Synchronisation...';
    
    try {
        const freshQuestions = await loadQuestionsFromGitHub();
        
        if (freshQuestions && freshQuestions.length > 0) {
            questions = freshQuestions;
            
            // Mettre à jour le cache
            try {
                localStorage.setItem('examQuestions', JSON.stringify(questions));
                localStorage.setItem('examQuestions_timestamp', new Date().getTime());
                localStorage.setItem('examQuestions_source', 'github');
            } catch (e) {
                console.warn("⚠️ Impossible de mettre à jour le cache:", e);
            }
            
            // Rafraîchir l'interface
            populateSubcategories('all');
            updateTabCounts();
            filterQuestions();
            
            // Message de succès temporaire
            const successMsg = document.createElement('div');
            successMsg.innerHTML = '<div style="text-align: center; padding: 15px; background: #d4edda; border: 1px solid #c3e6cb; border-radius: 5px; color: #155724; margin-bottom: 20px;"><i class="fas fa-check-circle"></i> <strong>Actualisation réussie !</strong> ' + questions.length + ' questions mises à jour depuis GitHub.</div>';
            questionList.insertBefore(successMsg, questionList.firstChild);
            
            // Supprimer le message après 5 secondes
            setTimeout(() => {
                successMsg.remove();
            }, 5000);
            
        } else {
            // Échec de l'actualisation
            questionList.innerHTML = '<div style="text-align: center; padding: 20px; background: #f8d7da; border: 1px solid #f5c6cb; border-radius: 5px; color: #721c24;"><i class="fas fa-exclamation-circle"></i> <strong>Échec de l\'actualisation</strong> - Impossible de charger les dernières questions depuis GitHub. Vérifiez votre connexion ou réessayez plus tard.</div>';
            
            // Recharger les questions en cache si disponibles
            setTimeout(() => {
                filterQuestions();
            }, 3000);
        }
        
    } catch (error) {
        console.error('❌ Erreur refresh:', error);
        questionList.innerHTML = '<div style="text-align: center; padding: 20px; background: #f8d7da; border: 1px solid #f5c6cb; border-radius: 5px; color: #721c24;"><i class="fas fa-exclamation-circle"></i> <strong>Erreur de synchronisation</strong> - ' + error.message + '</div>';
    }
    
    // Restaurer le bouton
    setTimeout(() => {
        button.textContent = originalText;
        button.disabled = false;
        button.style.opacity = '1';
    }, 2000);
}

/**
 * FONCTION D'AIDE : Vérifier si GitHub Pages est accessible
 */
async function checkGitHubPagesStatus() {
    try {
        const response = await fetch(GITHUB_QUESTIONS_URL, { 
            method: 'HEAD',
            cache: 'no-cache'
        });
        return response.ok;
    } catch {
        return false;
    }
}

/**
 * FONCTION UTILITAIRE : Afficher le statut de connexion GitHub
 */
async function showConnectionStatus() {
    const isOnline = await checkGitHubPagesStatus();
    const statusElement = document.createElement('div');
    
    statusElement.style.cssText = `
        position: fixed;
        bottom: 20px;
        right: 20px;
        padding: 10px 15px;
        border-radius: 20px;
        font-size: 0.9em;
        z-index: 1000;
        ${isOnline ? 
            'background: #28a745; color: white;' : 
            'background: #dc3545; color: white;'
        }
    `;
    
    statusElement.innerHTML = isOnline ? 
        '<i class="fas fa-wifi"></i> GitHub Pages connecté' : 
        '<i class="fas fa-exclamation-triangle"></i> Hors ligne';
    
    document.body.appendChild(statusElement);
    
    setTimeout(() => {
        statusElement.remove();
    }, 3000);
}

// INSTRUCTIONS D'INTÉGRATION DANS VOTRE CODE :

/**
 * 1. MODIFIER LES VARIABLES GLOBALES
 * Ajouter après la ligne : let questions = [];
 */
// const GITHUB_QUESTIONS_URL = 'https://VOTRE-USERNAME.github.io/admin-quest/questions.json';

/**
 * 2. REMPLACER VOTRE FONCTION init()
 * Remplacer complètement la fonction init() par celle ci-dessus
 */

/**
 * 3. OPTIONNEL : Ajouter un indicateur de statut
 * Dans votre event listener DOMContentLoaded, ajouter :
 */
// showConnectionStatus();

console.log("🔧 Module GitHub Pages chargé - Prêt pour l'intégration");
