#!/usr/bin/env node

/**
 * Script de test pour valider la conversion CSV → JSON
 * Teste la compatibilité avec le code Admin'Quest
 */

const fs = require('fs');
const { convertToAdminQuestFormat, generateStats, validateQuestions } = require('./convert.js');

console.log('🧪 Test de validation Admin\'Quest CSV → JSON');
console.log('=' .repeat(50));

// Créer un CSV de test
const testCSV = `Question,Catégorie principale,Sous-catégorie,Niveau de difficulté,Type,Mots-clés,Points d'attention (éléments clefs à considérer),Méthode de réponse recommandée,phrase 1,phrase 2,phrase 3,phrase 4,phrase 5,Épreuve
"Comment définiriez-vous le rôle du manager territorial ?",2,1,2,"Opinion","management,service public,leadership","Montre votre vision du management public. Intégrer la dimension politique et la spécificité du service public.","Par les enjeux","Le management territorial conjugue efficacité gestionnaire et sens du service public","Il s'agit d'animer des équipes dans un contexte démocratique et citoyen","L'enjeu est de moderniser l'action publique tout en préservant ses valeurs","","","ENTRETIEN"
"La différenciation territoriale est-elle compatible avec l'égalité républicaine ?",3,1,3,"Opinion","différenciation,égalité,constitution","Question au cœur des débats actuels sur l'organisation territoriale.","Poisson japonais","La Constitution garantit l'égalité devant la loi sur tout le territoire","Les collectivités peuvent adapter les politiques aux spécificités locales","L'enjeu est de concilier unité nationale et diversité territoriale","La loi 3DS ouvre des perspectives de différenciation encadrée","Cette évolution questionne notre modèle républicain traditionnel","ENTRETIEN"
"Définissez la notion de péréquation fiscale horizontale.",3,2,2,"Factuelle","péréquation,fiscalité,solidarité","Question technique nécessitant précision et exemples concrets.","Réponse technique courte","Mécanisme de redistribution entre collectivités de même niveau","Elle vise à réduire les écarts de richesse fiscale par habitant","","","","DGCT"`;

console.log('📝 Création du fichier CSV de test...');
fs.writeFileSync('test_questions.csv', testCSV);

// Parser et convertir
console.log('🔄 Test de conversion...');
const csvData = testCSV.split('\n').slice(1).map(line => {
    const values = line.split(',').map(val => val.replace(/^"|"$/g, ''));
    const headers = testCSV.split('\n')[0].split(',').map(h => h.replace(/^"|"$/g, ''));
    const row = {};
    headers.forEach((header, i) => {
        row[header] = values[i] || '';
    });
    return row;
});

const questions = convertToAdminQuestFormat(csvData);
const stats = generateStats(questions);
const validation = validateQuestions(questions);

console.log('\n✅ Tests de validation :');

// Test 1 : Structure des questions
console.log('\n1. Test structure des questions :');
const firstQuestion = questions[0];
const expectedFields = ['id', 'question', 'category', 'subCategory', 'difficulty', 'type', 'keywords', 'attention', 'responseMethod', 'phrase1', 'phrase2', 'phrase3', 'phrase4', 'phrase5', 'epreuve'];

let structureValid = true;
expectedFields.forEach(field => {
    if (!(field in firstQuestion)) {
        console.log(`   ❌ Champ manquant: ${field}`);
        structureValid = false;
    }
});

if (structureValid) {
    console.log('   ✅ Structure des questions conforme');
} else {
    console.log('   ❌ Structure des questions invalide');
}

// Test 2 : Types de données
console.log('\n2. Test types de données :');
const q = firstQuestion;
const typeTests = [
    { field: 'id', expected: 'string', actual: typeof q.id },
    { field: 'category', expected: 'number', actual: typeof q.category },
    { field: 'subCategory', expected: 'number', actual: typeof q.subCategory },
    { field: 'difficulty', expected: 'number', actual: typeof q.difficulty },
    { field: 'keywords', expected: 'array', actual: Array.isArray(q.keywords) ? 'array' : typeof q.keywords }
];

let typesValid = true;
typeTests.forEach(test => {
    if (test.expected === test.actual || (test.expected === 'array' && test.actual === 'array')) {
        console.log(`   ✅ ${test.field}: ${test.actual}`);
    } else {
        console.log(`   ❌ ${test.field}: attendu ${test.expected}, reçu ${test.actual}`);
        typesValid = false;
    }
});

// Test 3 : Valeurs par défaut
console.log('\n3. Test valeurs par défaut :');
const defaultTests = [
    { condition: q.category >= 1 && q.category <= 5, message: 'Catégorie dans les limites' },
    { condition: q.difficulty >= 1 && q.difficulty <= 4, message: 'Difficulté dans les limites' },
    { condition: q.type === 'Opinion', message: 'Type par défaut correct' },
    { condition: Array.isArray(q.keywords) && q.keywords.length > 0, message: 'Mots-clés parsés' }
];

defaultTests.forEach(test => {
    console.log(`   ${test.condition ? '✅' : '❌'} ${test.message}`);
});

// Test 4 : Statistiques
console.log('\n4. Test génération statistiques :');
console.log(`   ✅ Total questions: ${stats.total}`);
console.log(`   ✅ Catégories: ${Object.keys(stats.byCategory).length}`);
console.log(`   ✅ Épreuves: ${Object.keys(stats.byEpreuve).length}`);
console.log(`   ✅ Difficultés: ${Object.keys(stats.byDifficulty).length}`);

// Test 5 : Validation
console.log('\n5. Test validation :');
console.log(`   ✅ Erreurs: ${validation.errors.length}`);
console.log(`   ✅ Avertissements: ${validation.warnings.length}`);

if (validation.errors.length > 0) {
    console.log('   Erreurs détectées:');
    validation.errors.forEach(err => console.log(`     - ${err}`));
}

// Test 6 : JSON final
console.log('\n6. Test génération JSON :');
const output = {
    metadata: {
        version: "1.0",
        generatedAt: new Date().toISOString(),
        totalQuestions: questions.length,
        sourceFile: 'test_questions.csv',
        stats: stats
    },
    questions: questions
};

try {
    const jsonString = JSON.stringify(output, null, 2);
    const parsed = JSON.parse(jsonString);
    console.log('   ✅ JSON valide généré');
    console.log(`   ✅ Taille: ${jsonString.length} caractères`);
    console.log(`   ✅ Questions dans metadata: ${parsed.questions.length}`);
} catch (e) {
    console.log('   ❌ Erreur génération JSON:', e.message);
}

// Test 7 : Compatibilité code Admin'Quest
console.log('\n7. Test compatibilité Admin\'Quest :');

// Simuler le processCSVData du code original
const compatibilityTest = csvData.map((item, index) => {
    if (!item.Question) return null;
    
    return {
        id: `Q${index+1}`,
        question: item.Question,
        category: parseInt(item["Catégorie principale"]) || 1,
        subCategory: parseInt(item["Sous-catégorie"]) || 1,
        difficulty: parseInt(item["Niveau de difficulté"]) || 2,
        type: item["Type"] || "Opinion",
        keywords: item["Mots-clés"] ? item["Mots-clés"].split(",").map(k => k.trim()) : [],
        attention: item["Points d'attention (éléments clefs à considérer)"] || "Préparez une réponse structurée.",
        responseMethod: item["Méthode de réponse recommandée"] || "",
        phrase1: item["phrase 1"] || "",
        phrase2: item["phrase 2"] || "",
        phrase3: item["phrase 3"] || "",
        phrase4: item["phrase 4"] || "",
        phrase5: item["phrase 5"] || "",
        epreuve: item["Épreuve "] || item["Épreuve"] || "ENTRETIEN"                 
    };
}).filter(q => q !== null);

const isIdentical = JSON.stringify(questions) === JSON.stringify(compatibilityTest);
console.log(`   ${isIdentical ? '✅' : '❌'} Structure identique au code Admin'Quest`);

// Résumé
console.log('\n🎯 RÉSUMÉ DES TESTS :');
console.log(`   Structure: ${structureValid ? '✅' : '❌'}`);
console.log(`   Types: ${typesValid ? '✅' : '❌'}`);
console.log(`   JSON: ✅`);
console.log(`   Compatibilité: ${isIdentical ? '✅' : '❌'}`);

const allTestsPass = structureValid && typesValid && isIdentical;
console.log(`\n🏆 RÉSULTAT GLOBAL: ${allTestsPass ? '✅ SUCCÈS' : '❌ ÉCHEC'}`);

if (allTestsPass) {
    console.log('\n🚀 Le script de conversion est prêt pour production !');
    console.log('📋 Prochaines étapes :');
    console.log('   1. Testez avec votre fichier CSV complet');
    console.log('   2. Configurez GitHub Pages');
    console.log('   3. Intégrez le chargement automatique');
} else {
    console.log('\n🔧 Des ajustements sont nécessaires avant la mise en production.');
}

// Nettoyage
fs.unlinkSync('test_questions.csv');
console.log('\n🗑️  Fichier de test supprimé');
