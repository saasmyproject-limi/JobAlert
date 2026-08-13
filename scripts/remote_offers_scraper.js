/**
 * Scraper / Agrégateur d'Offres Remote Occidentales ESSOR (API Officielle & Flux Légaux)
 * Source 1 : Remote OK Official JSON API (https://remoteok.com/api) - robots.txt autorisé
 */

import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = process.env.VITE_SUPABASE_URL || 'https://placeholder.supabase.co';
const SUPABASE_SERVICE_ROLE = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.VITE_SUPABASE_ANON_KEY || 'placeholder-key';

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE);

export async function fetchRemoteOkOffers() {
  console.log('🌐 Interrogation de l\'API officielle Remote OK (Source légale)...');
  try {
    const response = await fetch('https://remoteok.com/api', {
      headers: {
        'User-Agent': 'ESSOR-JobAlert-Bot/1.0 (Contact: contact@essor.cm - Legal Aggregator)',
      },
    });

    if (!response.ok) {
      console.warn(`API Remote OK réponse non-200 (${response.status})`);
      return [];
    }

    const data = await response.json();
    if (!Array.isArray(data)) return [];

    // Ignorer le premier élément qui contient les métadonnées de l'API
    const rawOffers = data.slice(1);

    const mappedOffers = rawOffers.slice(0, 10).map((item: any) => {
      const tags = Array.isArray(item.tags) ? item.tags.join(', ') : '';
      const isAfricaFriendly =
        item.location?.toLowerCase().includes('worldwide') ||
        item.location?.toLowerCase().includes('anywhere') ||
        tags.toLowerCase().includes('worldwide') ||
        true;

      return {
        title: item.position || item.title || 'Développeur Remote',
        organization: item.company || 'Entreprise Internationale Remote',
        type: 'emploi-formel',
        location: isAfricaFriendly ? 'Remote (Worldwide / Afrique)' : 'Remote (International)',
        short_description: (item.description || item.slug || '').replace(/<[^>]*>?/gm, '').slice(0, 200) + '...',
        full_description: (item.description || item.slug || '').replace(/<[^>]*>?/gm, ''),
        requirements: item.tags || ['Anglais courant', 'Travail en autonomie', 'Connexion internet stable'],
        deadline: 'Permanent / Continu',
        category: `Remote International [${item.tags?.[0] || 'Tech'}]`,
        external_url: item.url || item.apply_url || 'https://remoteok.com',
        is_urgent: false,
        source: 'remoteok_official_api',
        moderation_status: 'publiee',
        is_official: true,
      };
    });

    console.log(`✅ ${mappedOffers.length} offres remote officielles récupérées avec succès.`);
    return mappedOffers;
  } catch (err) {
    console.error('Erreur lors du scraping de Remote OK API:', err);
    return [];
  }
}

export async function runRemoteScraper() {
  console.log('====================================================');
  console.log('  SCRAPING OFFRES REMOTE OCCIDENTALES (MVP 3)');
  console.log('====================================================');

  const offers = await fetchRemoteOkOffers();
  if (offers.length > 0) {
    for (const offer of offers) {
      const { error } = await supabase.from('offers').upsert(offer, { onConflict: 'title,organization' });
      if (error) {
        console.warn('Note insertion offre remote (Supabase):', error.message);
      }
    }
  }

  console.log('====================================================');
}

// Exécution directe si appelé par script
if (import.meta.url === `file://${process.argv[1]}`) {
  runRemoteScraper();
}
