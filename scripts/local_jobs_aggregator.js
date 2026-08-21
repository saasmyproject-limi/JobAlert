/**
 * ESSOR Local Cameroon Jobs Aggregator
 * Agrégateur multi-sources d'offres d'emploi locales au Cameroun (HTML Scraping)
 * 
 * Sources :
 * 1. Emploi.cm - https://www.emploi.cm/
 * 2. MinaJobs.net - https://cameroun.minajobs.net/
 * 3. JobinCamer.com - https://www.jobincamer.com/
 * 4. Louma Jobs Cameroun - https://loumajobs.com/cameroun/
 * 5. Emploiscameroun.com - https://emploiscameroun.com/offres/
 * 6. Job Cameroun - https://job-cameroun.com/
 * 7. Cameroon Desk - https://www.cameroondesks.com/ (Catégorie Emploi uniquement)
 * 8. Jobiglo Cameroun - https://cm.jobiglo.com/emplois (Section locale)
 */

const SUPABASE_URL = process.env.VITE_SUPABASE_URL || 'https://mcmnodtfwhfdqaygxyka.supabase.co';
const SUPABASE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1jbW5vZHRmd2hmZHFheWd4eWthIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODY1MzA5ODgsImV4cCI6MjEwMjEwNjk4OH0.ThRaS3PyfCvv65xizlWLQ2qfQ6kGNXKkzOWwbSorp2M';

const USER_AGENT = 'ESSOR-LocalJobAggregator/1.0 (Contact: contact@essor.cm - Legal Cameroon Job Aggregator)';

// Flag de contrôle individuel par source
export const LOCAL_SOURCES_CONFIG = [
  { id: 'emploi_cm', name: 'Emploi.cm', enabled: true, url: 'https://www.emploi.cm/recherche-jobs-cameroun' },
  { id: 'minajobs', name: 'MinaJobs', enabled: true, url: 'https://cameroun.minajobs.net/' },
  { id: 'jobincamer', name: 'JobinCamer', enabled: true, url: 'https://www.jobincamer.com/' },
  { id: 'loumajobs', name: 'Louma Jobs', enabled: true, url: 'https://loumajobs.com/cameroun/' },
  { id: 'emploiscameroun', name: 'Emploiscameroun', enabled: true, url: 'https://emploiscameroun.com/offres/' },
  { id: 'job_cameroun', name: 'Job Cameroun', enabled: true, url: 'https://job-cameroun.com/' },
  { id: 'cameroon_desk', name: 'Cameroon Desk', enabled: true, url: 'https://www.cameroondesks.com/' },
  { id: 'jobiglo_local', name: 'Jobiglo Cameroun', enabled: true, url: 'https://cm.jobiglo.com/emplois' }
];

/**
 * Fonction d'insertion sécurisée avec dédoublonnage strict dans Supabase public.offers
 */
async function upsertLocalOffer(offer) {
  try {
    // Vérification de sécurité deadline expirée
    let isExpired = false;
    let modStatus = 'publiee';

    if (offer.deadline_at) {
      const deadlineDate = new Date(offer.deadline_at);
      if (!isNaN(deadlineDate.getTime()) && deadlineDate.getTime() < Date.now()) {
        isExpired = true;
        modStatus = 'expiree';
      }
    }

    const payload = {
      title: offer.title,
      organization: offer.organization || 'Entreprise de la place',
      type: offer.type || 'emploi-formel',
      location: offer.city || offer.location || 'Cameroun (Douala / Yaoundé)',
      short_description: (offer.description_raw || offer.title).slice(0, 250) + '...',
      full_description: offer.description_raw || offer.title,
      requirements: offer.requirements || ['Bonne communication', 'Rigueur', 'Esprit d\'équipe'],
      deadline: offer.deadline || 'Permanent / Selon profil',
      category: offer.category || 'Général',
      external_url: offer.external_url,
      source: offer.source,
      moderation_status: modStatus,
      is_urgent: offer.is_urgent || false,
      city: offer.city || 'Douala / Yaoundé',
      contract_type: offer.contract_type || 'CDI / CDD',
      fetched_at: new Date().toISOString(),
      deadline_at: offer.deadline_at || null,
      description_raw: offer.description_raw || offer.title,
      is_expired: isExpired
    };

    // Dédoublonnage : vérifier si l'offre existe déjà par external_url ou par couple (title, organization)
    let checkQuery = `${SUPABASE_URL}/rest/v1/offers?select=id`;
    if (offer.external_url) {
      checkQuery += `&external_url=eq.${encodeURIComponent(offer.external_url)}`;
    } else {
      checkQuery += `&title=eq.${encodeURIComponent(offer.title)}&organization=eq.${encodeURIComponent(offer.organization)}`;
    }

    const checkRes = await fetch(checkQuery, {
      headers: {
        'apikey': SUPABASE_KEY,
        'Authorization': `Bearer ${SUPABASE_KEY}`
      }
    });

    if (checkRes.ok) {
      const existing = await checkRes.json();
      if (Array.isArray(existing) && existing.length > 0) {
        // Offre déjà en base ! Mise à jour silencieuse si nécessaire, ne pas dupliquer.
        return false;
      }
    }

    // Nouvelle offre : insertion unique
    const res = await fetch(`${SUPABASE_URL}/rest/v1/offers`, {
      method: 'POST',
      headers: {
        'apikey': SUPABASE_KEY,
        'Authorization': `Bearer ${SUPABASE_KEY}`,
        'Content-Type': 'application/json',
        'Prefer': 'return=minimal'
      },
      body: JSON.stringify(payload)
    });

    if (!res.ok) {
      const txt = await res.text();
      console.warn(`    ⚠️ Note insertion (${offer.source}): ${txt}`);
      return false;
    }
    return true;
  } catch (err) {
    console.warn(`    ⚠️ Exception insertion (${offer.source}): ${err.message}`);
    return false;
  }
}

// 1. Emploi.cm
async function fetchEmploiCm() {
  console.log('📡 [1/8] Scraping Emploi.cm (Portail n°1)...');
  const res = await fetch('https://www.emploi.cm/recherche-jobs-cameroun', {
    headers: { 'User-Agent': USER_AGENT }
  });
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  const html = await res.text();

  const items = [];
  const matches = html.match(/<a[^>]*href="(\/offre-emploi-cameroun\/[^"]+)"[^>]*>([\s\S]*?)<\/a>/gi) || [];

  for (const match of matches.slice(0, 10)) {
    const hrefMatch = match.match(/href="([^"]+)"/i);
    const textClean = match.replace(/<[^>]*>?/gm, ' ').replace(/\s+/g, ' ').trim();
    if (hrefMatch && textClean.length > 10) {
      const url = `https://www.emploi.cm${hrefMatch[1]}`;
      items.push({
        title: textClean.slice(0, 80),
        organization: 'Entreprise Partenaire Emploi.cm',
        source: 'Emploi.cm',
        external_url: url,
        city: 'Douala / Yaoundé',
        category: 'Commerce & Gestion',
        contract_type: 'CDI',
        description_raw: `Offre publiée sur Emploi.cm : ${textClean}`
      });
    }
  }
  return items;
}

// 2. MinaJobs.net
async function fetchMinaJobs() {
  console.log('📡 [2/8] Scraping MinaJobs Cameroun...');
  const res = await fetch('https://cameroun.minajobs.net/', {
    headers: { 'User-Agent': USER_AGENT }
  });
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  const html = await res.text();

  const items = [];
  const matches = html.match(/<a[^>]*href="(https?:\/\/cameroun\.minajobs\.net\/[^"]+)"[^>]*>([\s\S]*?)<\/a>/gi) || [];

  for (const match of matches.slice(0, 10)) {
    const hrefMatch = match.match(/href="([^"]+)"/i);
    const textClean = match.replace(/<[^>]*>?/gm, ' ').replace(/\s+/g, ' ').trim();
    if (hrefMatch && textClean.length > 12 && !hrefMatch[1].endsWith('.css')) {
      items.push({
        title: textClean.slice(0, 80),
        organization: 'Recruteur MinaJobs',
        source: 'MinaJobs',
        external_url: hrefMatch[1],
        city: 'Yaoundé / Douala',
        category: 'Administration & Concours',
        contract_type: 'CDD / CDI',
        description_raw: `Annonce certifiée MinaJobs Cameroun : ${textClean}`
      });
    }
  }
  return items;
}

// 3. JobinCamer.com
async function fetchJobinCamer() {
  console.log('📡 [3/8] Scraping JobinCamer...');
  const res = await fetch('https://www.jobincamer.com/', {
    headers: { 'User-Agent': USER_AGENT }
  });
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  const html = await res.text();

  const items = [];
  const matches = html.match(/<a[^>]*href="(\/job\/[^"]+)"[^>]*>([\s\S]*?)<\/a>/gi) || [];

  for (const match of matches.slice(0, 10)) {
    const hrefMatch = match.match(/href="([^"]+)"/i);
    const textClean = match.replace(/<[^>]*>?/gm, ' ').replace(/\s+/g, ' ').trim();
    if (hrefMatch && textClean.length > 8) {
      const url = `https://www.jobincamer.com${hrefMatch[1]}`;
      items.push({
        title: textClean.slice(0, 80),
        organization: 'Société Locale (JobinCamer)',
        source: 'JobinCamer',
        external_url: url,
        city: 'Douala',
        category: 'Informatique & Web',
        contract_type: 'CDI',
        description_raw: `Offre qualifiée sur JobinCamer : ${textClean}`
      });
    }
  }
  return items;
}

// 4. Louma Jobs Cameroun
async function fetchLoumaJobs() {
  console.log('📡 [4/8] Scraping Louma Jobs Cameroun...');
  const res = await fetch('https://loumajobs.com/cameroun/', {
    headers: { 'User-Agent': USER_AGENT }
  });
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  const html = await res.text();

  const items = [];
  const matches = html.match(/<a[^>]*href="(https?:\/\/loumajobs\.com\/[^\/]+\/[^"]+)"[^>]*>([\s\S]*?)<\/a>/gi) || [];

  for (const match of matches.slice(0, 10)) {
    const hrefMatch = match.match(/href="([^"]+)"/i);
    const textClean = match.replace(/<[^>]*>?/gm, ' ').replace(/\s+/g, ' ').trim();
    if (hrefMatch && textClean.length > 10) {
      items.push({
        title: textClean.slice(0, 80),
        organization: 'Entreprise Louma Jobs',
        source: 'Louma Jobs',
        external_url: hrefMatch[1],
        city: 'Douala / Bafoussam',
        category: 'Distribution & Logistique',
        contract_type: 'CDD',
        description_raw: `Offre d'emploi Louma Jobs Cameroun : ${textClean}`
      });
    }
  }
  return items;
}

// 5. Emploiscameroun.com
async function fetchEmploisCamerounCom() {
  console.log('📡 [5/8] Scraping Emploiscameroun.com...');
  const res = await fetch('https://emploiscameroun.com/offres/', {
    headers: { 'User-Agent': USER_AGENT }
  });
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  const html = await res.text();

  const items = [];
  const matches = html.match(/<a[^>]*href="(https?:\/\/emploiscameroun\.com\/offres\/[^"]+)"[^>]*>([\s\S]*?)<\/a>/gi) || [];

  for (const match of matches.slice(0, 10)) {
    const hrefMatch = match.match(/href="([^"]+)"/i);
    const textClean = match.replace(/<[^>]*>?/gm, ' ').replace(/\s+/g, ' ').trim();
    if (hrefMatch && textClean.length > 10) {
      items.push({
        title: textClean.slice(0, 80),
        organization: 'Recruteur Emploiscameroun',
        source: 'Emploiscameroun',
        external_url: hrefMatch[1],
        city: 'Yaoundé',
        category: 'Finance & Comptabilité',
        contract_type: 'CDI',
        description_raw: `Annonce Emploiscameroun.com : ${textClean}`
      });
    }
  }
  return items;
}

// 6. Job Cameroun
async function fetchJobCameroun() {
  console.log('📡 [6/8] Scraping Job Cameroun...');
  const res = await fetch('https://job-cameroun.com/', {
    headers: { 'User-Agent': USER_AGENT }
  });
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  const html = await res.text();

  const items = [];
  const matches = html.match(/<a[^>]*href="([^"]+)"[^>]*>([\s\S]*?)<\/a>/gi) || [];

  for (const match of matches.slice(0, 10)) {
    const hrefMatch = match.match(/href="([^"]+)"/i);
    const textClean = match.replace(/<[^>]*>?/gm, ' ').replace(/\s+/g, ' ').trim();
    if (hrefMatch && textClean.length > 12 && (textClean.toLowerCase().includes('recrute') || textClean.toLowerCase().includes('cherche'))) {
      const url = hrefMatch[1].startsWith('http') ? hrefMatch[1] : `https://job-cameroun.com${hrefMatch[1]}`;
      items.push({
        title: textClean.slice(0, 80),
        organization: 'PME & Secteur Informel / Proxi',
        source: 'Job Cameroun',
        type: 'emploi-informel',
        external_url: url,
        city: 'Douala / Yaoundé',
        category: 'Artisanat & Services',
        contract_type: 'Prestation / Direct',
        description_raw: `Offre directe Job Cameroun : ${textClean}`
      });
    }
  }
  return items;
}

// 7. Cameroon Desk (Filtre Emploi Uniquement)
async function fetchCameroonDesk() {
  console.log('📡 [7/8] Scraping Cameroon Desk (Filtre Emploi)...');
  const res = await fetch('https://www.cameroondesks.com/', {
    headers: { 'User-Agent': USER_AGENT }
  });
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  const html = await res.text();

  const items = [];
  const matches = html.match(/<a[^>]*href="(https?:\/\/www\.cameroondesks\.com\/[^"]+)"[^>]*>([\s\S]*?)<\/a>/gi) || [];

  for (const match of matches.slice(0, 15)) {
    const hrefMatch = match.match(/href="([^"]+)"/i);
    const textClean = match.replace(/<[^>]*>?/gm, ' ').replace(/\s+/g, ' ').trim();
    // Filtre strict : Ne prendre que les annonces contenant "job", "recrutement", "emploi" ou "vacancy"
    const lower = textClean.toLowerCase();
    if (hrefMatch && (lower.includes('job') || lower.includes('recrutement') || lower.includes('emploi') || lower.includes('vacancy')) && !lower.includes('bourse') && !lower.includes('concours')) {
      items.push({
        title: textClean.slice(0, 80),
        organization: 'Organisme Cameroun Desk',
        source: 'Cameroon Desk',
        external_url: hrefMatch[1],
        city: 'Toutes Régions Cameroun',
        category: 'ONG & Projets',
        contract_type: 'CDI / CDD',
        description_raw: `Avis de recrutement officiel Cameroon Desk : ${textClean}`
      });
    }
  }
  return items;
}

// 8. Jobiglo Cameroun (Section locale)
async function fetchJobigloLocal() {
  console.log('📡 [8/8] Scraping Jobiglo Cameroun (Emplois Locaux)...');
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
    // Exclure la section remote pour garder uniquement le local
    if (hrefMatch && textClean.length > 10 && !textClean.toLowerCase().includes('remote')) {
      const url = hrefMatch[1].startsWith('http') ? hrefMatch[1] : `https://cm.jobiglo.com${hrefMatch[1]}`;
      items.push({
        title: textClean.slice(0, 80),
        organization: 'Entreprise Camerounaise',
        source: 'Jobiglo Cameroun',
        external_url: url,
        city: 'Douala / Yaoundé',
        category: 'Tertiaire & Services',
        contract_type: 'CDI',
        description_raw: `Offre emploi local Jobiglo : ${textClean}`
      });
    }
  }
  return items;
}

/**
 * Runner global pour le scraping d'offres locales au Cameroun
 */
export async function runLocalJobsAggregator() {
  console.log('====================================================');
  console.log('  🇨🇲 ESSOR LOCAL CAMEROON JOBS AGGREGATOR');
  console.log(`  🕒 Horodatage : ${new Date().toLocaleString('fr-FR')}`);
  console.log('====================================================');

  const fetchers = [
    { config: LOCAL_SOURCES_CONFIG[0], fn: fetchEmploiCm },
    { config: LOCAL_SOURCES_CONFIG[1], fn: fetchMinaJobs },
    { config: LOCAL_SOURCES_CONFIG[2], fn: fetchJobinCamer },
    { config: LOCAL_SOURCES_CONFIG[3], fn: fetchLoumaJobs },
    { config: LOCAL_SOURCES_CONFIG[4], fn: fetchEmploisCamerounCom },
    { config: LOCAL_SOURCES_CONFIG[5], fn: fetchJobCameroun },
    { config: LOCAL_SOURCES_CONFIG[6], fn: fetchCameroonDesk },
    { config: LOCAL_SOURCES_CONFIG[7], fn: fetchJobigloLocal },
  ];

  let totalInserted = 0;
  const failureLogs = [];

  for (const { config, fn } of fetchers) {
    if (!config.enabled) {
      console.log(`⏸️ Source locale [${config.name}] désactivée (Flag active=false). Ignorée.`);
      continue;
    }

    try {
      await new Promise(r => setTimeout(r, 1200));
      const offers = await fn();
      console.log(`  ✅ [${config.name}] ${offers.length} offres extraites.`);

      let insertedForSource = 0;
      for (const offer of offers) {
        const isNew = await upsertLocalOffer(offer);
        if (isNew) {
          insertedForSource++;
          totalInserted++;
        }
      }
      console.log(`    📥 [${config.name}] ${insertedForSource} nouvelles offres insérées (Dédoublonnées).`);
    } catch (err) {
      const errorMsg = `❌ Erreur lors du scraping de [${config.name}]: ${err.message}`;
      console.error(errorMsg);
      failureLogs.push({ source: config.name, time: new Date().toISOString(), error: err.message });
    }
  }

  console.log('====================================================');
  console.log(`🎉 SCRAPING LOCAL TERMINÉ : ${totalInserted} nouvelles offres inédites ajoutées.`);
  if (failureLogs.length > 0) {
    console.warn(`⚠️ Log d'échecs (${failureLogs.length} sources en erreur) :`, failureLogs);
  }
  console.log('====================================================');
}

// Exécution directe CLI
if (process.argv[1] && process.argv[1].includes('local_jobs_aggregator')) {
  runLocalJobsAggregator();
}
