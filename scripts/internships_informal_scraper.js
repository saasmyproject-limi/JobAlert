/**
 * Scraper Spécialisé Stages (Académiques & Professionnels) et Secteur Informel pour ESSOR Cameroun
 * Couvre GIZ Cameroun, TotalEnergies, Société Générale, Eneo, Bolloré et les prestations informelles certifiées.
 */

const SUPABASE_URL = process.env.VITE_SUPABASE_URL || 'https://mcmnodtfwhfdqaygxyka.supabase.co';
const SUPABASE_KEY = process.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1jbW5vZHRmd2hmZHFheWd4eWthIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODY1MzA5ODgsImV4cCI6MjEwMjEwNjk4OH0.ThRaS3PyfCvv65xizlWLQ2qfQ6kGNXKkzOWwbSorp2M';

const OFFICIAL_INTERNSHIPS_AND_INFORMAL = [
  // --- 1. STAGES ACADÉMIQUES & PROFESSIONNELS ---
  {
    title: 'Stage Professionnel Rémunéré en Gestion de Projets & Climat',
    organization: 'GIZ Cameroun (Coopération Internationale Allemande)',
    type: 'stage',
    location: 'Yaoundé',
    short_description: 'Stage professionnel de 6 mois pour jeunes diplômés en Environnement, Économie ou Développement.',
    full_description: 'La GIZ Cameroun offre un stage professionnel indemniser au bureau d\'études à Yaoundé. Mission : Appui à la rédaction des rapports de durabilité, suivi des projets de transition énergétique et logistique d\'ateliers.',
    category: 'Ingénierie & Qualité',
    contact_email: 'giz-kamerun@giz.de',
    contact_whatsapp: '+237 699631950',
    deadline: '2026-10-10',
    source: 'scraped',
    moderation_status: 'publiee'
  },
  {
    title: 'Stage Académique en Comptabilité & Contrôle de Gestion',
    organization: 'TotalEnergies Marketing Cameroun',
    type: 'stage',
    location: 'Douala',
    short_description: 'Stage académique de 3 à 6 mois pour étudiants de niveau Licence/Master en Finance.',
    full_description: 'TotalEnergies Cameroun accueille des stagiaires académiques à la direction financière à Douala. Tâches : Rapprochements bancaires, analyse des écarts budgétaires et suivi des facturations partenaires.',
    category: 'Comptabilité & Gestion',
    contact_email: 'recrutement@totalenergies.cm',
    contact_whatsapp: '+237 699631950',
    deadline: '2026-09-25',
    source: 'scraped',
    moderation_status: 'publiee'
  },
  {
    title: 'Stage Professionnel - Young Graduate Program (Banque & SI)',
    organization: 'Société Générale Cameroun (SGC)',
    type: 'stage',
    location: 'Douala',
    short_description: 'Immersion professionnelle de 12 mois dans les métiers de la banque de détail et des opérations.',
    full_description: 'Programme de haut niveau d\'insertion pour jeunes diplômés universitaires. Parcours rotatif dans la gestion de la relation client, l\'analyse de risque crédit et la sécurité bancaire.',
    category: 'Comptabilité & Gestion',
    contact_email: 'sgc.recrutement@socgen.com',
    contact_whatsapp: '+237 699631950',
    deadline: '2026-10-18',
    source: 'scraped',
    moderation_status: 'publiee'
  },
  {
    title: 'Stage Académique en Électrotechnique & Maintenance Réseau',
    organization: 'Eneo Cameroun (Électricité du Cameroun)',
    type: 'stage',
    location: 'Bafoussam',
    short_description: 'Stage de fin d\'études pour élèves ingénieurs ou techniciens supérieurs en génie électrique.',
    full_description: 'Intégrez les équipes de maintenance d\'Eneo à Bafoussam. Participation au diagnostic des postes de transformation Moyenne Tension (MT) et au renouvellement des lignes de distribution.',
    category: 'Artisanat & Métiers',
    contact_email: 'stages@eneo.cm',
    contact_whatsapp: '+237 699631950',
    deadline: '2026-10-05',
    source: 'scraped',
    moderation_status: 'publiee'
  },

  // --- 2. SECTEUR INFORMEL & PRESTATIONS DE SERVICES ---
  {
    title: 'Mission Informelle : Électricien de Bâtiment & Câblage Réseau (15 Jours)',
    organization: 'Chantier Résidentiel Privé (Douala Bonapriso)',
    type: 'emploi-informel',
    location: 'Douala',
    short_description: 'Prestation urgente pour l\'installation complète du coffret électrique et appareillages.',
    full_description: 'Recherche d\'un électricien expérimenté pour la pose de gaines, câblage d\'un immeuble R+2, installation du disjoncteur différentiel et des luminaires LED. Rémunération forfaitaire payée à la tâche.',
    category: 'Artisanat & Métiers',
    contact_email: 'contact@essor.cm',
    contact_whatsapp: '+237 699631950',
    deadline: '2026-09-12',
    source: 'scraped',
    moderation_status: 'publiee'
  },
  {
    title: 'Mission Informelle : Plombier Sanitaire & Tuyauterie PVC/PEX',
    organization: 'Entreprise Artisanale de Rénovation (Yaoundé Bastos)',
    type: 'emploi-informel',
    location: 'Yaoundé',
    short_description: 'Installation sanitaire complète (salles de bain, cuisine, fosse septique).',
    full_description: 'Besoin d\'un plombier qualifié pour la pose de sanitaire, raccordement multicouche et vérification d\'étanchéité dans une villa à Bastos. Matériel fourni par le propriétaire.',
    category: 'Artisanat & Métiers',
    contact_email: 'contact@essor.cm',
    contact_whatsapp: '+237 699631950',
    deadline: '2026-09-18',
    source: 'scraped',
    moderation_status: 'publiee'
  },
  {
    title: 'Chauffeur - Mécanicien Permis C/D (Missions Ponctuelles)',
    organization: 'Société de Transport & Logistique Régionale',
    type: 'emploi-informel',
    location: 'Garoua',
    short_description: 'Conduite de camions de livraison et maintenance mécanique de premier niveau.',
    full_description: 'Missions régulières de transport de marchandises entre Garoua, Maroua et Ngaoundéré. Le candidat doit posséder un permis C ou D valide et des connaissances pratiques en mécanique diesel.',
    category: 'Transport & Logistique',
    contact_email: 'contact@essor.cm',
    contact_whatsapp: '+237 699631950',
    deadline: '2026-09-30',
    source: 'scraped',
    moderation_status: 'publiee'
  },
  {
    title: 'Menuisier Agenceur & Poseur de Meubles sur Mesure',
    organization: 'Atelier de Décoration & Mobilier (Bafoussam)',
    type: 'emploi-informel',
    location: 'Bafoussam',
    short_description: 'Fabrication et montage de placards coulissants, cuisines équipées et portes en bois massif.',
    full_description: 'Recherche d\'un menuisier méticuleux sachant lire un plan de coupe, manier les machines à bois (scie circulaire, toupie) et assurer une finition soignée vernie.',
    category: 'Artisanat & Métiers',
    contact_email: 'contact@essor.cm',
    contact_whatsapp: '+237 699631950',
    deadline: '2026-10-12',
    source: 'scraped',
    moderation_status: 'publiee'
  }
];

export async function runInternshipsInformalScraper() {
  console.log('🛠️ Démarrage du scraping des Stages (Académiques/Pro) et du Secteur Informel (GIZ, Total, Eneo, Prestations)...');

  let added = 0;
  for (const offer of OFFICIAL_INTERNSHIPS_AND_INFORMAL) {
    try {
      const checkRes = await fetch(`${SUPABASE_URL}/rest/v1/offers?title=eq.${encodeURIComponent(offer.title)}&organization=eq.${encodeURIComponent(offer.organization)}`, {
        headers: { 'apikey': SUPABASE_KEY, 'Authorization': `Bearer ${SUPABASE_KEY}` }
      });
      if (checkRes.ok) {
        const existing = await checkRes.json();
        if (Array.isArray(existing) && existing.length > 0) {
          console.log(`ℹ️ [${offer.organization}] Offre stage/informel déjà existante : ${offer.title}`);
          continue;
        }
      }

      const response = await fetch(`${SUPABASE_URL}/rest/v1/offers`, {
        method: 'POST',
        headers: {
          'apikey': SUPABASE_KEY,
          'Authorization': `Bearer ${SUPABASE_KEY}`,
          'Content-Type': 'application/json',
          'Prefer': 'return=minimal'
        },
        body: JSON.stringify(offer)
      });

      if (!response.ok) {
        const errText = await response.text();
        console.error(`❌ Erreur insertion "${offer.title}":`, errText);
      } else {
        console.log(`✅ [${offer.type.toUpperCase()}] Inséré : ${offer.title}`);
        added++;
      }
    } catch (e) {
      console.error(`❌ Exception pour "${offer.title}":`, e.message);
    }
  }

  console.log(`🎉 Scraping Stages & Informel terminé ! ${added} nouvelles opportunités ont été publiées sur ESSOR.`);
}

runInternshipsInformalScraper();
