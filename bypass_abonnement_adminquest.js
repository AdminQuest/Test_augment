// SOLUTION BYPASS ABONNEMENT ADMIN'QUEST
// À exécuter dans la console après que GitHub ait chargé

console.log('🚀 === BYPASS ABONNEMENT ADMIN\'QUEST ===');

// 1. BYPASS du système d'abonnement
function bypassSubscription() {
    console.log('🔓 Bypass du système d\'abonnement...');
    
    // Simuler un abonnement valide
    const fakeSubscription = {
        code: 'FABRICE2025',
        valid: true,
        type: 'premium',
        expires: '2026-12-31',
        features: ['unlimited_questions', 'all_categories', 'admin_access']
    };
    
    // Injecter dans localStorage
    localStorage.setItem('subscription', JSON.stringify(fakeSubscription));
    localStorage.setItem('subscriptionValid', 'true');
    localStorage.setItem('subscriptionCode', 'FABRICE2025');
    
    // Variables globales
    window.subscription = fakeSubscription;
    window.subscriptionValid = true;
    
    console.log('✅ Abonnement premium simulé');
    return true;
}

// 2. ATTENDRE que GitHub ait chargé puis injecter nos questions
function waitForGitHubThenInject() {
    console.log('⏳ Attente du chargement GitHub...');
    
    // Vérifier si les questions GitHub sont chargées
    const checkGitHubLoaded = setInterval(() => {
        // Rechercher dans le localStorage ou variables globales
        const githubQuestions = JSON.parse(localStorage.getItem('examQuestions') || '[]');
        
        if (githubQuestions.length > 0) {
            console.log(`📦 GitHub chargé : ${githubQuestions.length} questions trouvées`);
            clearInterval(checkGitHubLoaded);
            
            // Maintenant injecter NOS questions
            injectOurQuestions();
        }
    }, 500); // Vérifier toutes les 500ms
    
    // Timeout après 10 secondes
    setTimeout(() => {
        clearInterval(checkGitHubLoaded);
        console.log('⚠️ Timeout - Injection forcée');
        injectOurQuestions();
    }, 10000);
}

// 3. INJECTION de nos questions (remplacer celles de GitHub)
function injectOurQuestions() {
    console.log('💉 Injection de nos questions...');
    
    // Questions de test (ou charger depuis votre JSON)
    const ourQuestions = [
        {
            "ID": "750",
            "Question": "Votre Maire vous demande de mettre en place le congé menstruel. Que faites-vous ?",
            "Catégorie principale": "Mises en situation professionnelles",
            "Sous-catégorie": "Innovation sociale",
            "Niveau de difficulté": "3",
            "Épreuve": "DGCT",
            "phrase 1": "L'analyse juridique s'appuie sur l'article L1111-1 du code du travail qui garantit l'égalité professionnelle et l'article 57 de la loi du 26 janvier 1984 qui encadre les congés spéciaux dans la fonction publique territoriale.",
            "phrase 2": "Les études récentes, notamment celle de l'INED de 2024, montrent que 5% des entreprises françaises ont expérimenté cette mesure avec un taux de satisfaction de 70% des bénéficiaires et un impact estimé à 0,1% de la masse salariale.",
            "phrase 3": "La mise en œuvre nécessite une approche progressive : diagnostic des besoins par questionnaire anonyme, concertation avec les partenaires sociaux, et expérimentation sur une direction pilote avant généralisation éventuelle.",
            "phrase 4": "Les principales résistances anticipées portent sur l'équité entre agents, la gestion des remplacements et l'acceptation managériale, nécessitant un accompagnement spécifique des encadrants et une communication transparente sur les objectifs.",
            "phrase 5": "Cette démarche s'inscrit dans une prospective 2030 des politiques RH territoriales axées sur le bien-être au travail, l'égalité réelle et l'adaptation aux évolutions sociétales, positionnant la collectivité comme employeur innovant et attractif."
        },
        {
            "ID": "751",
            "Question": "Les jumelages, simple tradition ou outil stratégique ?",
            "Catégorie principale": "Questions de culture territoriale",
            "Sous-catégorie": "Europe et collectivités",
            "Niveau de difficulté": "3",
            "Épreuve": "DGCT",
            "phrase 1": "Les jumelages doivent dépasser leur dimension symbolique traditionnelle pour devenir de véritables leviers de coopération opérationnelle, structurant des partenariats économiques, culturels et techniques durables entre territoires européens.",
            "phrase 2": "L'innovation dans la coopération passe par l'adaptation aux enjeux contemporains : transition écologique partagée, transformation numérique collaborative, échanges de bonnes pratiques sur les politiques publiques locales et développement de projets Erasmus+ territoriaux.",
            "phrase 3": "La professionnalisation de la coopération décentralisée nécessite la structuration d'équipes dédiées maîtrisant l'ingénierie européenne, le développement de partenariats avec les universités locales et la mise en place d'outils d'évaluation des impacts socio-économiques des échanges.",
            "phrase 4": "Les défis contemporains incluent le renouvellement des générations d'acteurs, la mobilisation de financements européens (FEDER, Interreg), et l'articulation avec les stratégies territoriales de développement économique et touristique.",
            "phrase 5": "L'évaluation de l'efficacité se mesure par des indicateurs concrets : augmentation du tourisme culturel (+15% en moyenne), création d'emplois dans les secteurs créatifs, développement de l'apprentissage des langues et renforcement de l'attractivité territoriale internationale."
        },
        {
            "ID": "752",
            "Question": "Comment améliorer la démocratie européenne au niveau local ?",
            "Catégorie principale": "Questions de culture territoriale", 
            "Sous-catégorie": "Europe et collectivités",
            "Niveau de difficulté": "2",
            "Épreuve": "DGCT",
            "phrase 1": "L'amélioration de la démocratie européenne locale s'appuie sur l'Initiative Citoyenne Européenne (ICE) depuis 2012, permettant à 1 million de citoyens de 7 États membres minimum de saisir la Commission, complétée par des dispositifs de consultation publique numérique et des dialogues citoyens territorialisés.",
            "phrase 2": "Les conférences citoyennes sur l'Europe, développées depuis 2019, mobilisent des panels représentatifs de citoyens avec un taux de participation de 65% selon l'Eurobaromètre 2023, créant un lien direct entre préoccupations locales et politiques européennes.",
            "phrase 3": "Les comités de suivi locaux des fonds européens (FEDER-FSE) associent élus, société civile et partenaires socio-économiques, mais restent sous-exploités par 40% des collectivités françaises qui pourraient y développer une véritable gouvernance participative des projets européens.",
            "phrase 4": "Les outils de participation directe incluent les budgets participatifs européens (expérimentés par 15% des métropoles), les consultations citoyennes sur les projets Interreg et le développement d'assemblées citoyennes transfrontalières sur les enjeux communs.",
            "phrase 5": "La prospective 2027 vise l'hybridation entre outils participatifs traditionnels et plateformes numériques collaboratives, permettant aux citoyens de co-construire les politiques européennes territorialisées et de suivre leur mise en œuvre locale en temps réel."
        }
    ];
    
    // FORCER le remplacement dans TOUS les endroits possibles
    
    // Variables globales
    window.questionsData = ourQuestions;
    window.questions = ourQuestions;
    window.allQuestions = ourQuestions;
    window.currentQuestions = ourQuestions;
    window.filteredQuestions = ourQuestions;
    
    // LocalStorage - ÉCRASER tout
    const questionsWithMetadata = {
        metadata: {
            version: "2.0",
            source: "Fabrice - Questions 750-752 injectées",
            totalQuestions: ourQuestions.length,
            lastUpdated: new Date().toISOString()
        },
        questions: ourQuestions
    };
    
    try {
        localStorage.setItem('examQuestions', JSON.stringify(ourQuestions));
        localStorage.setItem('questionsData', JSON.stringify(ourQuestions));
        localStorage.setItem('questions', JSON.stringify(ourQuestions));
        localStorage.setItem('adminQuest_data', JSON.stringify(questionsWithMetadata));
        console.log('✅ LocalStorage mis à jour');
    } catch (e) {
        console.log('⚠️ LocalStorage plein, mais variables OK');
    }
    
    // Forcer le rafraîchissement d'Admin'Quest
    try {
        if (typeof displayQuestions === 'function') {
            displayQuestions();
            console.log('✅ displayQuestions() appelée');
        }
        
        if (typeof filterQuestions === 'function') {
            filterQuestions();
            console.log('✅ filterQuestions() appelée');
        }
        
        if (typeof showMainApp === 'function') {
            showMainApp();
            console.log('✅ showMainApp() appelée');
        }
    } catch (e) {
        console.log('⚠️ Erreur rafraîchissement:', e.message);
    }
    
    // Notification de succès
    const notification = document.createElement('div');
    notification.style.cssText = `
        position: fixed; top: 20px; left: 50%; transform: translateX(-50%);
        background: linear-gradient(135deg, #28a745, #20c997); color: white;
        padding: 1.5rem 2rem; border-radius: 12px; z-index: 999999;
        font-family: 'Segoe UI', sans-serif; text-align: center;
        box-shadow: 0 8px 25px rgba(0,0,0,0.3);
    `;
    notification.innerHTML = `
        <h3 style="margin: 0 0 0.5rem 0;">🎉 QUESTIONS INJECTÉES !</h3>
        <p style="margin: 0;">${ourQuestions.length} questions • Questions 750-752 incluses</p>
    `;
    document.body.appendChild(notification);
    
    setTimeout(() => notification.remove(), 5000);
    
    console.log(`✅ ${ourQuestions.length} questions injectées avec succès !`);
}

// 4. EXECUTION PRINCIPALE
console.log('🚀 Démarrage du bypass...');

// Étape 1 : Bypass abonnement
bypassSubscription();

// Étape 2 : Attendre GitHub puis injecter
waitForGitHubThenInject();

// Étape 3 : Forcer l'affichage de l'app principale (enlever le formulaire d'abonnement)
setTimeout(() => {
    console.log('🎨 Forçage affichage application...');
    
    // Cacher le formulaire d'abonnement s'il existe
    const subscriptionForm = document.querySelector('#subscription-form, .subscription-form, [id*="subscription"]');
    if (subscriptionForm) {
        subscriptionForm.style.display = 'none';
        console.log('✅ Formulaire abonnement masqué');
    }
    
    // Afficher l'app principale s'elle est cachée
    const mainApp = document.querySelector('#main-app, .main-app, main, #app');
    if (mainApp) {
        mainApp.style.display = 'block';
        console.log('✅ Application principale affichée');
    }
    
    // Appeler showMainApp pour forcer l'affichage
    if (typeof showMainApp === 'function') {
        showMainApp();
        console.log('✅ showMainApp() forcée');
    }
}, 2000);

console.log('✅ === BYPASS EN COURS ===');
console.log('📝 Attendez 2-3 secondes pour voir les questions...');
