/**
 * ESSOR Remote Jobs Aggregator avec Pipeline de Classification IA en 2 Étapes
 * 
 * Sources :
 * 1. We Work Remotely (RSS) - https://weworkremotely.com/remotejobs.rss
 * 2. Remotive (API JSON) - https://remotive.com/api/remote-jobs
 * 3. RemoteOK (API JSON) - https://remoteok.com/api
 * 4. Jobicy (API JSON) - https://jobicy.com/api/v2/remotejobs
 * 5. Himalayas (HTML/Scraping) - https://himalayas.app/jobs
 * 6. Working Nomads (HTML/Scraping) - https://www.workingnomads.com/jobs
 * 7. NoDesk (HTML/Scraping) - https://nodesk.co/remote-jobs/
 * 8. Remote4Africa (HTML/Scraping) - https://remote4africa.com/
 * 9. Jobiglo Cameroun (HTML/Scraping) - https://cm.jobiglo.com/emplois
 */

import { classifierOffreComplete } from './pipeline/classifierOffreComplete.js';

const SUPABASE_URL = process.env.VITE_SUPABASE_URL || 'https://mcmnodtfwhfdqaygxyka.supabase.co';
const SUPABASE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1jbW5vZHRmd2hmZHFheWd4eWthIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODY1MzA5ODgsImV4cCI6MjEwMjEwNjk4OH0.ThRaS3PyfCvv65xizlWLQ2qfQ6kGNXKkzOWwbSorp2M';

const USER_AGENT = 'ESSOR-RemoteJobAggregator/1.0 (Contact: contact@essor.cm - Legal Job Aggregator)';

async function processAndSaveOffer(offer) {
  try {
    // 1. Classification en 2 étapes (Regex Pre-filter + IA Classifier)
    const classification = await classifierOffreComplete({
      titre: offer.title,
      entreprise: offer.company,
      description: `${offer.location_raw || ''} ${offer.description || ''} ${(offer.tags || []).join(' ')}`
    });

    if (classification.type_offre_final === 'aucun') {
      // Offre non éligible -> loggée dans la table de rejet pour audit
      console.log(`    🔴 [REJETÉE] "${offer.title}" (${offer.company}) - Motif: ${classification.filtre_regex_motif || classification.justification_remote}`);
      
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
      return false;
    }

    // Offre éligible (Remote Afrique ou Relocation/Visa)
    console.log(`    🟢 [ACCEPTÉE - ${classification.type_offre_final.toUpperCase()}] "${offer.title}" (${offer.company})`);

    const fullOfferPayload = {
      ...offer,
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

    const res = await fetch(`${SUPABASE_URL}/rest/v1/remote_jobs`, {
      method: 'POST',
      headers: {
        'apikey': SUPABASE_KEY,
        'Authorization': `Bearer ${SUPABASE_KEY}`,
        'Content-Type': 'application/json',
        'Prefer': 'resolution=merge-duplicates,return=minimal'
      },
      body: JSON.stringify(fullOfferPayload)
    });

    if (!res.ok) {
      const txt = await res.text();
      console.warn(`    ⚠️ Upsert note (${offer.source}): ${txt}`);
    }
    return true;
  } catch (err) {
    console.warn(`    ⚠️ Exception lors du traitement de l'offre (${offer.source}): ${err.message}`);
    return false;
  }
}

// Flag de contrôle individuel des sources
export const SOURCES_CONFIG = [
  { id: 'weworkremotely', name: 'We Work Remotely', type: 'rss', enabled: true, url: 'https://weworkremotely.com/remotejobs.rss' },
  { id: 'remotive', name: 'Remotive', type: 'api', enabled: true, url: 'https://remotive.com/api/remote-jobs' },
  { id: 'remoteok', name: 'RemoteOK', type: 'api', enabled: true, url: 'https://remoteok.com/api' },
  { id: 'jobicy', name: 'Jobicy', type: 'api', enabled: true, url: 'https://jobicy.com/api/v2/remotejobs' },
  { id: 'himalayas', name: 'Himalayas', type: 'html', enabled: true, url: 'https://himalayas.app/jobs' },
  { id: 'workingnomads', name: 'Working Nomads', type: 'html', enabled: true, url: 'https://www.workingnomads.com/jobs' },
  { id: 'nodesk', name: 'NoDesk', type: 'html', enabled: true, url: 'https://nodesk.co/remote-jobs/' },
  { id: 'remote4africa', name: 'Remote4Africa', type: 'html', enabled: true, url: 'https://remote4africa.com/' },
  { id: 'jobiglo', name: 'Jobiglo Cameroun', type: 'html', enabled: true, url: 'https://cm.jobiglo.com/emplois' },
];

// 1. We Work Remotely (RSS XML)
async function fetchWeWorkRemotely() {
  console.log('📡 [1/9] Récupération We Work Remotely (RSS)...');
  const res = await fetch('https://weworkremotely.com/remotejobs.rss', {
    headers: { 'User-Agent': USER_AGENT }
  });
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  const xmlText = await res.text();

  const items = [];
  const itemMatches = xmlText.match(/<item>[\s\S]*?<\/item>/gi) || [];

  for (const itemXml of itemMatches.slice(0, 15)) {
    const titleMatch = itemXml.match(/<title><!\[CDATA\[(.*?)\]\]><\/title>/i) || itemXml.match(/<title>(.*?)<\/title>/i);
    const linkMatch = itemXml.match(/<link>(.*?)<\/link>/i);
    const pubDateMatch = itemXml.match(/<pubDate>(.*?)<\/pubDate>/i);
    const categoryMatch = itemXml.match(/<category><!\[CDATA\[(.*?)\]\]><\/category>/i) || itemXml.match(/<category>(.*?)<\/category>/i);
    const descMatch = itemXml.match(/<description><!\[CDATA\[([\s\S]*?)\]\]><\/description>/i) || itemXml.match(/<description>([\s\S]*?)<\/description>/i);

    const fullTitle = titleMatch ? titleMatch[1].trim() : 'Offre Remote';
    const titleParts = fullTitle.split(':');
    const company = titleParts.length > 1 ? titleParts[0].trim() : 'WeWorkRemotely Employer';
    const title = titleParts.length > 1 ? titleParts.slice(1).join(':').trim() : fullTitle;

    const rawDesc = descMatch ? descMatch[1].replace(/<[^>]*>?/gm, '').trim() : '';

    items.push({
      title,
      company,
      source: 'We Work Remotely',
      source_url: linkMatch ? linkMatch[1].trim() : 'https://weworkremotely.com',
      location_raw: 'Worldwide / Remote',
      category: categoryMatch ? categoryMatch[1].trim() : 'Tech & Product',
      tags: ['Remote', categoryMatch ? categoryMatch[1].trim() : 'General'],
      published_at: pubDateMatch ? new Date(pubDateMatch[1]).toISOString() : new Date().toISOString(),
      fetched_at: new Date().toISOString(),
      salary_raw: 'Non spécifié',
      description: rawDesc.slice(0, 500) + '...'
    });
  }
  return items;
}

// 2. Remotive (API JSON)
async function fetchRemotive() {
  console.log('📡 [2/9] Récupération Remotive (API JSON)...');
  const res = await fetch('https://remotive.com/api/remote-jobs', {
    headers: { 'User-Agent': USER_AGENT }
  });
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  const data = await res.json();
  const jobsList = data.jobs || [];

  return jobsList.slice(0, 15).map(job => ({
    title: job.title || 'Développeur / Pro Remote',
    company: job.company_name || 'Entreprise Internationale',
    source: 'Remotive',
    source_url: job.url || 'https://remotive.com',
    location_raw: job.candidate_required_location || 'Worldwide',
    category: job.category || 'Tech & Digital',
    tags: Array.isArray(job.tags) ? job.tags : ['Remote', job.category || 'Tech'],
    published_at: job.publication_date ? new Date(job.publication_date).toISOString() : new Date().toISOString(),
    fetched_at: new Date().toISOString(),
    salary_raw: job.salary || 'Non spécifié',
    description: (job.description || '').replace(/<[^>]*>?/gm, '').slice(0, 500) + '...'
  }));
}

// 3. RemoteOK (API JSON)
async function fetchRemoteOK() {
  console.log('📡 [3/9] Récupération RemoteOK (API JSON)...');
  const res = await fetch('https://remoteok.com/api', {
    headers: { 'User-Agent': USER_AGENT }
  });
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  const data = await res.json();
  if (!Array.isArray(data)) return [];

  const rawJobs = data.slice(1);

  return rawJobs.slice(0, 15).map(item => ({
    title: item.position || item.title || 'Ingénieur / Spécialiste Remote',
    company: item.company || 'RemoteOK Company',
    source: 'RemoteOK',
    source_url: item.url || item.apply_url || 'https://remoteok.com',
    location_raw: item.location || 'Worldwide',
    category: item.tags?.[0] || 'Software Development',
    tags: Array.isArray(item.tags) ? item.tags : ['Worldwide', 'Remote'],
    published_at: item.date ? new Date(item.date).toISOString() : new Date().toISOString(),
    fetched_at: new Date().toISOString(),
    salary_raw: item.salary || (item.salary_min ? `$${item.salary_min} - $${item.salary_max}` : 'Non spécifié'),
    description: (item.description || '').replace(/<[^>]*>?/gm, '').slice(0, 500) + '...'
  }));
}

// 4. Jobicy (API JSON)
async function fetchJobicy() {
  console.log('📡 [4/9] Récupération Jobicy (API JSON)...');
  const res = await fetch('https://jobicy.com/api/v2/remotejobs', {
    headers: { 'User-Agent': USER_AGENT }
  });
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  const data = await res.json();
  const jobsList = data.jobs || [];

  return jobsList.slice(0, 15).map(job => ({
    title: job.jobTitle || 'Poste Remote International',
    company: job.companyName || 'Jobicy Employer',
    source: 'Jobicy',
    source_url: job.url || 'https://jobicy.com',
    location_raw: job.jobGeo || 'Worldwide',
    category: job.jobCategory || 'Global Tech',
    tags: [job.jobType || 'Full-Time', 'Remote'],
    published_at: job.pubDate ? new Date(job.pubDate).toISOString() : new Date().toISOString(),
    fetched_at: new Date().toISOString(),
    salary_raw: (job.annualSalaryMin && job.annualSalaryMax) ? `${job.annualSalaryMin} - ${job.annualSalaryMax} ${job.salaryCurrency || 'USD'}` : 'Non spécifié',
    description: (job.jobDescription || '').replace(/<[^>]*>?/gm, '').slice(0, 500) + '...'
  }));
}

// 5. Himalayas (HTML Scraping)
async function fetchHimalayas() {
  console.log('📡 [5/9] Récupération Himalayas (HTML Scraping)...');
  const res = await fetch('https://himalayas.app/jobs', {
    headers: { 'User-Agent': USER_AGENT }
  });
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  const html = await res.text();

  const items = [];
  const matches = html.match(/<a[^>]*href="(\/companies\/[^"]+\/jobs\/[^"]+)"[^>]*>([\s\S]*?)<\/a>/gi) || [];

  for (const match of matches.slice(0, 10)) {
    const hrefMatch = match.match(/href="([^"]+)"/i);
    const textClean = match.replace(/<[^>]*>?/gm, ' ').replace(/\s+/g, ' ').trim();
    if (hrefMatch && textClean.length > 5) {
      items.push({
        title: textClean.slice(0, 60),
        company: 'Himalayas Employer',
        source: 'Himalayas',
        source_url: `https://himalayas.app${hrefMatch[1]}`,
        location_raw: 'Worldwide / Anywhere',
        category: 'Engineering & Product',
        tags: ['Remote', 'Himalayas'],
        published_at: new Date().toISOString(),
        fetched_at: new Date().toISOString(),
        salary_raw: 'Non spécifié',
        description: `Offre publiée sur Himalayas: ${textClean}`
      });
    }
  }
  return items;
}

// 6. Working Nomads (HTML Scraping)
async function fetchWorkingNomads() {
  console.log('📡 [6/9] Récupération Working Nomads (HTML Scraping)...');
  const res = await fetch('https://www.workingnomads.com/jobs', {
    headers: { 'User-Agent': USER_AGENT }
  });
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  const html = await res.text();

  const items = [];
  const jobMatches = html.match(/<a[^>]*href="(\/jobs\/[^"]+)"[^>]*>([\s\S]*?)<\/a>/gi) || [];

  for (const match of jobMatches.slice(0, 10)) {
    const hrefMatch = match.match(/href="([^"]+)"/i);
    const textClean = match.replace(/<[^>]*>?/gm, ' ').replace(/\s+/g, ' ').trim();
    if (hrefMatch && textClean.length > 10) {
      items.push({
        title: textClean.slice(0, 70),
        company: 'Working Nomads Partner',
        source: 'Working Nomads',
        source_url: `https://www.workingnomads.com${hrefMatch[1]}`,
        location_raw: 'Worldwide',
        category: 'Digital & Tech',
        tags: ['Worldwide', 'Nomad'],
        published_at: new Date().toISOString(),
        fetched_at: new Date().toISOString(),
        salary_raw: 'Non spécifié',
        description: `Offre Working Nomads: ${textClean}`
      });
    }
  }
  return items;
}

// 7. NoDesk (HTML Scraping)
async function fetchNoDesk() {
  console.log('📡 [7/9] Récupération NoDesk (HTML Scraping)...');
  const res = await fetch('https://nodesk.co/remote-jobs/', {
    headers: { 'User-Agent': USER_AGENT }
  });
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  const html = await res.text();

  const items = [];
  const linkMatches = html.match(/<a[^>]*href="(\/remote-jobs\/[^"]+)"[^>]*>([\s\S]*?)<\/a>/gi) || [];

  for (const match of linkMatches.slice(0, 10)) {
    const hrefMatch = match.match(/href="([^"]+)"/i);
    const textClean = match.replace(/<[^>]*>?/gm, ' ').replace(/\s+/g, ' ').trim();
    if (hrefMatch && textClean.length > 10 && !hrefMatch[1].endsWith('/remote-jobs/')) {
      items.push({
        title: textClean.slice(0, 70),
        company: 'NoDesk Remote Company',
        source: 'NoDesk',
        source_url: `https://nodesk.co${hrefMatch[1]}`,
        location_raw: 'Worldwide / Global',
        category: 'Remote Work',
        tags: ['Worldwide', 'NoDesk'],
        published_at: new Date().toISOString(),
        fetched_at: new Date().toISOString(),
        salary_raw: 'Non spécifié',
        description: `Offre disponible sur NoDesk: ${textClean}`
      });
    }
  }
  return items;
}

// 8. Remote4Africa (HTML Scraping)
async function fetchRemote4Africa() {
  console.log('📡 [8/9] Récupération Remote4Africa (HTML Scraping)...');
  const res = await fetch('https://remote4africa.com/', {
    headers: { 'User-Agent': USER_AGENT }
  });
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  const html = await res.text();

  const items = [];
  const matches = html.match(/<a[^>]*href="([^"]+)"[^>]*>([\s\S]*?)<\/a>/gi) || [];

  for (const match of matches.slice(0, 10)) {
    const hrefMatch = match.match(/href="([^"]+)"/i);
    const textClean = match.replace(/<[^>]*>?/gm, ' ').replace(/\s+/g, ' ').trim();
    if (hrefMatch && textClean.length > 15 && hrefMatch[1].includes('http')) {
      items.push({
        title: textClean.slice(0, 70),
        company: 'Africa Remote Hiring Enterprise',
        source: 'Remote4Africa',
        source_url: hrefMatch[1],
        location_raw: 'Africa / Cameroon Open',
        category: 'Tech & Services',
        tags: ['Africa Dedicated', 'Remote'],
        published_at: new Date().toISOString(),
        fetched_at: new Date().toISOString(),
        salary_raw: 'Non spécifié',
        description: `Offre dédiée aux talents africains: ${textClean}`
      });
    }
  }
  return items;
}

// 9. Jobiglo Cameroun (HTML Scraping)
async function fetchJobiglo() {
  console.log('📡 [9/9] Récupération Jobiglo Cameroun (HTML Scraping)...');
  const res = await fetch('https://cm.jobiglo.com/emplois', {
    headers: { 'User-Agent': USER_AGENT }
  });
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  const html = await res.text();

  const items = [];
  const matches = html.match(/<a[^>]*href="([^"]+)"[^>]*>([\s\S]*?)<\/a>/gi) || [];

  for (const match of matches.slice(0, 10)) {
    const hrefMatch = match.match(/href="([^"]+)"/i);
    const textClean = match.replace(/<[^>]*>?/gm, ' ').replace(/\s+/g, ' ').trim();
    if (hrefMatch && (textClean.toLowerCase().includes('remote') || textClean.toLowerCase().includes('télétravail'))) {
      const url = hrefMatch[1].startsWith('http') ? hrefMatch[1] : `https://cm.jobiglo.com${hrefMatch[1]}`;
      items.push({
        title: textClean.slice(0, 70),
        company: 'Entreprise Partenaire Cameroun',
        source: 'Jobiglo Cameroun',
        source_url: url,
        location_raw: 'Cameroun (Télétravail / Remote)',
        category: 'Emploi Local & Remote',
        tags: ['Cameroun', 'Télétravail'],
        published_at: new Date().toISOString(),
        fetched_at: new Date().toISOString(),
        salary_raw: 'FCFA / Devises',
        description: `Offre en télétravail au Cameroun: ${textClean}`
      });
    }
  }
  return items;
}

/**
 * Runner global de l'agrégateur Remote avec classification IA
 */
export async function runRemoteJobsAggregator() {
  console.log('====================================================');
  console.log('  🌐 ESSOR REMOTE & RELOCATION JOBS AGGREGATOR (CLASSIFIATEUR IA)');
  console.log(`  🕒 Horodatage : ${new Date().toLocaleString('fr-FR')}`);
  console.log('====================================================');

  const fetchers = [
    { config: SOURCES_CONFIG[0], fn: fetchWeWorkRemotely },
    { config: SOURCES_CONFIG[1], fn: fetchRemotive },
    { config: SOURCES_CONFIG[2], fn: fetchRemoteOK },
    { config: SOURCES_CONFIG[3], fn: fetchJobicy },
    { config: SOURCES_CONFIG[4], fn: fetchHimalayas },
    { config: SOURCES_CONFIG[5], fn: fetchWorkingNomads },
    { config: SOURCES_CONFIG[6], fn: fetchNoDesk },
    { config: SOURCES_CONFIG[7], fn: fetchRemote4Africa },
    { config: SOURCES_CONFIG[8], fn: fetchJobiglo },
  ];

  let totalAccepted = 0;
  let totalRejected = 0;
  const failureLogs = [];

  for (const { config, fn } of fetchers) {
    if (!config.enabled) {
      console.log(`⏸️ Source [${config.name}] désactivée. Ignorée.`);
      continue;
    }

    try {
      if (config.type === 'html') {
        await new Promise(r => setTimeout(r, 1200));
      }

      const offers = await fn();
      console.log(`  ✅ [${config.name}] ${offers.length} offres récupérées. Passage au pipeline de classification...`);

      for (const offer of offers) {
        const saved = await processAndSaveOffer(offer);
        if (saved) totalAccepted++;
        else totalRejected++;
      }
    } catch (err) {
      const errorMsg = `❌ Erreur lors de la récupération depuis [${config.name}]: ${err.message}`;
      console.error(errorMsg);
      failureLogs.push({ source: config.name, time: new Date().toISOString(), error: err.message });
    }
  }

  console.log('====================================================');
  console.log(`🎉 AGREGATION & CLASSIFICATION TERMINÉES :`);
  console.log(`   🟢 ${totalAccepted} offres validées (Remote Afrique / Relocation).`);
  console.log(`   🔴 ${totalRejected} offres rejetées (Archivées dans remote_jobs_rejetees).`);
  if (failureLogs.length > 0) {
    console.warn(`⚠️ Log d'échecs (${failureLogs.length} sources) :`, failureLogs);
  }
  console.log('====================================================');
}

// Exécution directe CLI
if (process.argv[1] && process.argv[1].includes('remote_jobs_aggregator')) {
  runRemoteJobsAggregator();
}
