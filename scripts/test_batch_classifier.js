/**
 * ESSOR Batch Classifier Test & Cleanup Script
 */

import { classifierOffreComplete } from './pipeline/classifierOffreComplete.js';

const SUPABASE_URL = process.env.VITE_SUPABASE_URL || 'https://mcmnodtfwhfdqaygxyka.supabase.co';
const SUPABASE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1jbW5vZHRmd2hmZHFheWd4eWthIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODY1MzA5ODgsImV4cCI6MjEwMjEwNjk4OH0.ThRaS3PyfCvv65xizlWLQ2qfQ6kGNXKkzOWwbSorp2M';

export async function testBatchClassification() {
  console.log('====================================================');
  console.log('  🧪 BATCH TEST CLASSIFICATEUR 2 ÉTAPES (REGEX + IA)');
  console.log('====================================================');

  const res = await fetch(`${SUPABASE_URL}/rest/v1/remote_jobs?select=*`, {
    headers: {
      'apikey': SUPABASE_KEY,
      'Authorization': `Bearer ${SUPABASE_KEY}`
    }
  });

  if (!res.ok) {
    console.error('❌ Impossible de récupérer les offres:', await res.text());
    return;
  }

  const offers = await res.json();
  console.log(`📦 ${offers.length} offres extraites pour l'évaluation batch...`);

  let countRemoteAfrique = 0;
  let countRelocation = 0;
  let countAucun = 0;
  let countRegexExclu = 0;
  let countRegexInclus = 0;
  let countRegexAmbigu = 0;

  for (let i = 0; i < offers.length; i++) {
    const offer = offers[i];
    await new Promise(r => setTimeout(r, 300)); // Rate limit pause

    const classification = await classifierOffreComplete({
      titre: offer.title,
      entreprise: offer.company,
      description: `${offer.location_raw || ''} ${offer.description || ''} ${(offer.tags || []).join(' ')}`
    });

    console.log(`\n[${i + 1}/${offers.length}] "${offer.title}" (${offer.company})`);
    console.log(`   └─ Location Raw: ${offer.location_raw}`);
    console.log(`   └─ Regex Statut: ${classification.filtre_regex_statut} ${classification.filtre_regex_motif ? `(Motif: ${classification.filtre_regex_motif})` : ''}`);
    console.log(`   └─ Type Final: ${classification.type_offre_final.toUpperCase()}`);

    if (classification.filtre_regex_statut === 'exclu') countRegexExclu++;
    else if (classification.filtre_regex_statut === 'inclus') countRegexInclus++;
    else countRegexAmbigu++;

    if (classification.type_offre_final === 'remote_afrique') countRemoteAfrique++;
    else if (classification.type_offre_final === 'relocation') countRelocation++;
    else countAucun++;

    try {
      if (classification.type_offre_final === 'aucun') {
        const rejectedPayload = {
          title: offer.title,
          company: offer.company,
          source: offer.source,
          source_url: offer.source_url,
          location_raw: offer.location_raw,
          description: offer.description,
          filtre_regex_statut: classification.filtre_regex_statut,
          filtre_regex_motif: classification.filtre_regex_motif,
          justification_remote: classification.justification_remote,
          justification_relocation: classification.justification_relocation
        };

        await fetch(`${SUPABASE_URL}/rest/v1/remote_jobs_rejetees`, {
          method: 'POST',
          headers: {
            'apikey': SUPABASE_KEY,
            'Authorization': `Bearer ${SUPABASE_KEY}`,
            'Content-Type': 'application/json',
            'Prefer': 'resolution=merge-duplicates,return=minimal'
          },
          body: JSON.stringify(rejectedPayload)
        });

        await fetch(`${SUPABASE_URL}/rest/v1/remote_jobs?id=eq.${offer.id}`, {
          method: 'DELETE',
          headers: {
            'apikey': SUPABASE_KEY,
            'Authorization': `Bearer ${SUPABASE_KEY}`
          }
        });
        console.log(`   🗑️ Offre [${offer.id}] supprimée et archivée.`);
      } else {
        const updatePayload = {
          type_offre_final: classification.type_offre_final,
          eligible_remote_afrique: classification.eligible_remote_afrique,
          confidence_remote: classification.confidence_remote,
          justification_remote: classification.justification_remote,
          relocation_disponible: classification.relocation_disponible,
          confidence_relocation: classification.confidence_relocation,
          justification_relocation: classification.justification_relocation,
          pays_destination_relocation: classification.pays_destination_relocation,
          filtre_regex_statut: classification.filtre_regex_statut,
          filtre_regex_motif: classification.filtre_regex_motif,
          classifie_le: new Date().toISOString()
        };

        await fetch(`${SUPABASE_URL}/rest/v1/remote_jobs?id=eq.${offer.id}`, {
          method: 'PATCH',
          headers: {
            'apikey': SUPABASE_KEY,
            'Authorization': `Bearer ${SUPABASE_KEY}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(updatePayload)
        });
      }
    } catch (err) {
      console.warn(`   ⚠️ Supabase sync note: ${err.message}`);
    }
  }

  console.log('\n====================================================');
  console.log('📊 RÉSULTAT DU NETTOYAGE BATCH :');
  console.log(`   • Total analysé : ${offers.length}`);
  console.log(`   • Pré-filtre Regex Exclu : ${countRegexExclu}`);
  console.log(`   • Pré-filtre Regex Inclus : ${countRegexInclus}`);
  console.log(`   • Pré-filtre Regex Ambigu (Qualifié IA) : ${countRegexAmbigu}`);
  console.log('----------------------------------------------------');
  console.log(`   🟢 Offres Valides Remote Afrique : ${countRemoteAfrique}`);
  console.log(`   ✈️ Offres Valides Relocation / Visa : ${countRelocation}`);
  console.log(`   🔴 Offres Supprimées (Transférées) : ${countAucun}`);
  console.log('====================================================');
}

testBatchClassification();
