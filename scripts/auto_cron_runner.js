/**
 * Runner Automatique Global pour ESSOR Cameroun
 * Exécute tous les scrapers (Offres officielles, Concours, Bourses, Stages, Informel)
 * et planifie une exécution quotidienne automatique chaque jour à 12h00.
 */

import { runMasterScraper } from './master_scraper.js';
import { runScholarshipsScraper } from './scholarships_scraper.js';
import { runInternshipsInformalScraper } from './internships_informal_scraper.js';

export async function runAllScrapers() {
  console.log('⏰ ===================================================');
  console.log(`🕒 ${new Date().toLocaleString('fr-FR', { timeZone: 'Africa/Douala' })} : Lancement du scraping quotidien de 12h00...`);
  console.log('===================================================');

  try {
    console.log('1️⃣ Phase 1 : Scraping des offres officielles & concours...');
    await runMasterScraper();

    console.log('2️⃣ Phase 2 : Scraping des bourses d\'études...');
    await runScholarshipsScraper();

    console.log('3️⃣ Phase 3 : Scraping des stages & secteur informel...');
    await runInternshipsInformalScraper();

    console.log('✅ ===================================================');
    console.log('🎉 TOUTES LES OFFRES ONT ÉTÉ SYNCHRONISÉES AVEC SUCCÈS SUR ESSOR !');
    console.log('===================================================');
  } catch (err) {
    console.error('❌ Erreur lors de l\'exécution du scraper global :', err);
  }
}

// Planification automatique pour exécution quotidienne à 12h00
function scheduleDailyAt12() {
  const now = new Date();
  const target = new Date();

  target.setHours(12, 0, 0, 0);

  // Si 12h00 est déjà passé aujourd'hui, programmer pour 12h00 demain
  if (now.getTime() >= target.getTime()) {
    target.setDate(target.getDate() + 1);
  }

  const msUntil12 = target.getTime() - now.getTime();
  console.log(`⏱️ Prochain scraping automatique programmé pour ${target.toLocaleString('fr-FR')} (dans ${Math.round(msUntil12 / 1000 / 60)} minutes).`);

  setTimeout(async () => {
    await runAllScrapers();
    // Re-programmer pour le lendemain 12h00
    setInterval(runAllScrapers, 24 * 60 * 60 * 1000);
  }, msUntil12);
}

// Si le script est exécuté directement
if (process.argv.includes('--run-now')) {
  runAllScrapers();
} else {
  runAllScrapers();
  scheduleDailyAt12();
}
