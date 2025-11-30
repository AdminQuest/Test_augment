#!/usr/bin/env node

/**
 * Script de conversion CSV → JSON pour Admin'Quest
 * Convertit le fichier questions.csv en questions.json pour GitHub Pages
 * Structure exactement compatible avec le code Admin'Quest
 * 
 * Usage: node convert.js [fichier_csv] [fichier_json]
 * Exemple: node convert.js questions.csv questions.json
 */

const fs = require('fs');
const path = require('path');

// Configuration par défaut
const DEFAULT_CSV_FILE = 'questions.csv';
const DEFAULT_JSON_FILE = 'questions.json';

/**
 * Parse une ligne CSV en tenant compte des guillemets et virgules
 */
function parseCSVLine(line) {
    const result = [];
    let current = '';
    let inQuotes = false;
    
    for (let i = 0; i < line.length; i++) {
        const char = line[i];
        
        if (char === '"') {
            if (inQuotes && line[i + 1] === '"') {
                // Double quote = quote échappée
                current += '"';
                i++; // Skip next quote
            } else {
                // Toggle quote state
                inQuotes = !inQuotes;
            }
        } else if (char === ',' && !inQuotes) {
            // Fin de champ
            result.push(current.trim());
            current = '';
        } else {
            current += char;
        }
    }
    
    // Ajouter le dernier champ
    result.push(current.trim());
    return result;
}

/**
 * Parse le fichier CSV complet
 */
function parseCSV(csvContent) {
    const lines = csvContent.split('\n').filter(line => line.trim());
    if (lines.length === 0) return [];
    
    // Première ligne = headers
    const headers = parseCSVLine(lines[0]);
    const data = [];
    
    for (let i = 1; i < lines.length; i++) {
        const values = parseCSVLine(lines[i]);
        const row = {};
        
        headers.forEach((header, index) => {
            row[header] = values[index] || '';
        });
        
        data.push(row);
    }
    
    return data;
}

/**
 * Convertit les données CSV en format Admin'Quest JSON 
 * (Structure exacte du code fourni)
 */
function convertToAdminQuestFormat(csvData) {
    const questions = [];
    
    csvData.forEach((item, index) => {
        // Ignorer les lignes sans question (même logique que le code)
        if (!item.Question) return;
        
        // Structure EXACTEMENT identique au code Admin'Quest
        const question = {
            id: `Q${index + 1}`,
            question: item.Question,
            category: parseInt(item["Catégorie principale"]) || 1,
            subCategory: parseInt(item["Sous-catégorie"]) || 1,
            difficulty: parseInt(item["Niveau de difficulté"]) || 2,
            type: item["Type"] || "Opinion",
            keywords: item["Mots-clés"] ? 
                item["Mots-clés"].split(",").map(k => k.trim()).filter(k => k) : [],
            attention: item["Points d'attention (éléments clefs à considérer)"] || 
                "Préparez une réponse structurée.",
            responseMethod: item["Méthode de réponse recommandée"] || "",
            phrase1: item["phrase 1"] || "",
            phrase2: item["phrase 2"] || "",
            phrase3: item["phrase 3"] || "",
            phrase4: item["phrase 4"] || "",
            phrase5: item["phrase 5"] || "",
            epreuve: item["Épreuve "] || item["Épreuve"] || "ENTRETIEN"
        };
        
        questions.push(question);
    });
    
    return questions;
}

/**
 * Génère des statistiques détaillées pour le dashboard
 */
function generateStats(questions) {
    const stats = {
        total: questions.length,
        byCategory: {},
        bySubCategory: {},
        byDifficulty: {},
        byEpreuve: {},
        byType: {},
        byResponseMethod: {}
    };
    
    // Noms des catégories (exactement comme dans le code)
    const categoryNames = {
        1: "Personnalité",
        2: "Management", 
        3: "Culture territoriale",
        4: "Mise en situation",
        5: "Question embarrassante"
    };
    
    questions.forEach(q => {
        // Par catégorie
        const catName = categoryNames[q.category] || "Autre";
        stats.byCategory[catName] = (stats.byCategory[catName] || 0) + 1;
        
        // Par sous-catégorie
        const subCatKey = `${q.category}.${q.subCategory}`;
        stats.bySubCategory[subCatKey] = (stats.bySubCategory[subCatKey] || 0) + 1;
        
        // Par difficulté
        stats.byDifficulty[`Niveau ${q.difficulty}`] = 
            (stats.byDifficulty[`Niveau ${q.difficulty}`] || 0) + 1;
        
        // Par épreuve (gérer les épreuves multiples)
        const epreuves = q.epreuve.split(',').map(e => e.trim());
        epreuves.forEach(epreuve => {
            stats.byEpreuve[epreuve] = (stats.byEpreuve[epreuve] || 0) + 1;
        });
        
        // Par type
        stats.byType[q.type] = (stats.byType[q.type] || 0) + 1;
        
        // Par méthode de réponse
        if (q.responseMethod) {
            stats.byResponseMethod[q.responseMethod] = 
                (stats.byResponseMethod[q.responseMethod] || 0) + 1;
        }
    });
    
    return stats;
}

/**
 * Valide la cohérence des données
 */
function validateQuestions(questions) {
    const warnings = [];
    const errors = [];
    
    questions.forEach((q, index) => {
        // Vérifications critiques
        if (!q.question) {
            errors.push(`Q${index + 1}: Question vide`);
        }
        
        if (q.category < 1 || q.category > 5) {
            warnings.push(`Q${index + 1}: Catégorie ${q.category} hors limites (1-5)`);
        }
        
        if (q.difficulty < 1 || q.difficulty > 4) {
            warnings.push(`Q${index + 1}: Difficulté ${q.difficulty} hors limites (1-4)`);
        }
        
        // Vérifications méthodes de réponse
        const validMethods = [
            'rafale', 'enjeux', 'albatros', 'poisson', 'japonais', 
            'réflexive', 'theatre', 'technique', 'longue', 'courte'
        ];
        
        if (q.responseMethod) {
            const methodLower = q.responseMethod.toLowerCase();
            const hasValidMethod = validMethods.some(method => 
                methodLower.includes(method)
            );
            
            if (!hasValidMethod) {
                warnings.push(`Q${index + 1}: Méthode "${q.responseMethod}" non reconnue`);
            }
        }
    });
    
    return { warnings, errors };
}

/**
 * Fonction principale
 */
function main() {
    const args = process.argv.slice(2);
    const csvFile = args[0] || DEFAULT_CSV_FILE;
    const jsonFile = args[1] || DEFAULT_JSON_FILE;
    
    console.log('🔄 Conversion CSV → JSON pour Admin\'Quest');
    console.log('=' .repeat(60));
    console.log(`📖 Source: ${csvFile}`);
    console.log(`📦 Destination: ${jsonFile}`);
    console.log('');
    
    // Vérifier que le fichier CSV existe
    if (!fs.existsSync(csvFile)) {
        console.error(`❌ Erreur: Le fichier '${csvFile}' n'existe pas.`);
        console.log('\n💡 Usage: node convert.js [fichier.csv] [sortie.json]');
        console.log('💡 Exemple: node convert.js questions.csv questions.json');
        process.exit(1);
    }
    
    try {
        // Lire le fichier CSV
        console.log(`📖 Lecture de ${csvFile}...`);
        const csvContent = fs.readFileSync(csvFile, 'utf-8');
        
        // Parser le CSV
        console.log('🔍 Analyse du CSV...');
        const csvData = parseCSV(csvContent);
        console.log(`   → ${csvData.length} lignes trouvées`);
        
        if (csvData.length === 0) {
            console.error('❌ Fichier CSV vide ou malformé');
            process.exit(1);
        }
        
        // Afficher les colonnes détectées
        const firstRow = csvData[0];
        console.log('\n🔍 Colonnes détectées:');
        Object.keys(firstRow).forEach((col, i) => {
            console.log(`   ${i + 1}. "${col}"`);
        });
        
        // Convertir au format Admin'Quest
        console.log('\n🔄 Conversion au format Admin\'Quest...');
        const questions = convertToAdminQuestFormat(csvData);
        console.log(`   → ${questions.length} questions valides extraites`);
        
        if (questions.length === 0) {
            console.error('❌ Aucune question valide trouvée');
            process.exit(1);
        }
        
        // Validation des données
        console.log('\n🔍 Validation des données...');
        const validation = validateQuestions(questions);
        
        if (validation.errors.length > 0) {
            console.log('❌ Erreurs critiques:');
            validation.errors.forEach(err => console.log(`   - ${err}`));
        }
        
        if (validation.warnings.length > 0) {
            console.log('⚠️  Avertissements:');
            validation.warnings.forEach(warn => console.log(`   - ${warn}`));
        }
        
        if (validation.errors.length === 0 && validation.warnings.length === 0) {
            console.log('   ✅ Toutes les données sont valides');
        }
        
        // Générer les statistiques
        console.log('\n📊 Génération des statistiques...');
        const stats = generateStats(questions);
        
        // Créer le JSON final avec métadonnées
        const output = {
            metadata: {
                version: "1.0",
                generatedAt: new Date().toISOString(),
                totalQuestions: questions.length,
                sourceFile: path.basename(csvFile),
                generator: "Admin'Quest CSV Converter v1.0",
                validation: {
                    errors: validation.errors.length,
                    warnings: validation.warnings.length
                },
                stats: stats
            },
            questions: questions
        };
        
        // Écrire le fichier JSON
        console.log(`\n💾 Écriture vers ${jsonFile}...`);
        fs.writeFileSync(jsonFile, JSON.stringify(output, null, 2), 'utf-8');
        
        // Afficher le résumé détaillé
        console.log('\n✅ Conversion terminée avec succès !');
        console.log('=' .repeat(60));
        
        console.log(`\n📊 STATISTIQUES DÉTAILLÉES`);
        console.log(`   • Total questions : ${stats.total}`);
        
        console.log(`\n   📁 Par catégorie :`);
        Object.entries(stats.byCategory)
            .sort((a, b) => b[1] - a[1])
            .forEach(([cat, count]) => {
                const percent = ((count / stats.total) * 100).toFixed(1);
                console.log(`     - ${cat}: ${count} (${percent}%)`);
            });
        
        console.log(`\n   🎯 Par épreuve :`);
        Object.entries(stats.byEpreuve)
            .sort((a, b) => b[1] - a[1])
            .forEach(([epr, count]) => {
                const percent = ((count / stats.total) * 100).toFixed(1);
                console.log(`     - ${epr}: ${count} (${percent}%)`);
            });
        
        console.log(`\n   📈 Par difficulté :`);
        Object.entries(stats.byDifficulty)
            .sort((a, b) => a[0].localeCompare(b[0]))
            .forEach(([diff, count]) => {
                const percent = ((count / stats.total) * 100).toFixed(1);
                console.log(`     - ${diff}: ${count} (${percent}%)`);
            });
        
        if (Object.keys(stats.byResponseMethod).length > 0) {
            console.log(`\n   🔧 Par méthode de réponse :`);
            Object.entries(stats.byResponseMethod)
                .sort((a, b) => b[1] - a[1])
                .slice(0, 10) // Top 10
                .forEach(([method, count]) => {
                    const percent = ((count / stats.total) * 100).toFixed(1);
                    console.log(`     - ${method}: ${count} (${percent}%)`);
                });
        }
        
        const fileSize = fs.statSync(jsonFile).size;
        console.log(`\n📁 FICHIER GÉNÉRÉ`);
        console.log(`   • Nom : ${jsonFile}`);
        console.log(`   • Taille : ${(fileSize / 1024).toFixed(1)} KB`);
        console.log(`   • Compatible : Admin'Quest ${output.metadata.version}`);
        
        console.log(`\n🚀 PROCHAINES ÉTAPES`);
        console.log(`   1. Testez le JSON : node -e "console.log(JSON.parse(require('fs').readFileSync('${jsonFile}', 'utf8')).metadata)"`);
        console.log(`   2. Déployez sur GitHub Pages`);
        console.log(`   3. Mettez à jour l'URL dans Admin'Quest`);
        
        if (validation.warnings.length > 0) {
            console.log(`\n⚠️  ${validation.warnings.length} avertissement(s) - Vérifiez vos données`);
        }
        
    } catch (error) {
        console.error('\n❌ Erreur lors de la conversion:');
        console.error(error.message);
        if (error.stack) {
            console.error('\n🔍 Stack trace:');
            console.error(error.stack);
        }
        process.exit(1);
    }
}

// Gestion en tant que module ou script direct
if (require.main === module) {
    main();
} else {
    module.exports = {
        parseCSV,
        convertToAdminQuestFormat,
        generateStats,
        validateQuestions
    };
}
