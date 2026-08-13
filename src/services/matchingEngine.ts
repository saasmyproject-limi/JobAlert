/**
 * Moteur de Matching ESSOR — Algorithme de correspondance Profils ↔ Offres
 */

import { supabase } from '../lib/supabaseClient';

export interface MatchableProfile {
  id?: string;
  domain?: string;
  location?: string;
  search_types?: string[] | null;
  searchTypes?: string[] | null;
  skills?: string[] | null;
}

export interface MatchableOffer {
  id?: string;
  type?: string;
  location?: string;
  title?: string;
  category?: string;
  short_description?: string;
  shortDescription?: string;
  full_description?: string;
  fullDescription?: string;
  requirements?: string[] | string | null;
}

/**
 * Normalise un texte (minuscules, retrait des accents et ponctuation inutile)
 */
export function normalizeText(text: string): string {
  if (!text) return '';
  return text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .trim();
}

/**
 * Calcule le score de correspondance (%) entre un profil candidat et une offre.
 * @returns Score entre 0 et 100 (0 si le type d'offre ne correspond pas)
 */
export function calculateMatchScore(
  profile: MatchableProfile,
  offer: MatchableOffer
): number {
  const profileTypes = profile.search_types || profile.searchTypes || [];
  const offerType = normalizeText(offer.type || '');

  // 1. CRITÈRE ÉLIMINATOIRE : Type de recherche (Emploi Formel, Informel, Stage, Bourse)
  if (profileTypes.length > 0) {
    const matchesType = profileTypes.some(
      (t) => normalizeText(t) === offerType
    );
    if (!matchesType) {
      return 0; // Éliminé d'office
    }
  }

  let totalScore = 0;

  // 2. LOCALISATION (25%)
  const profileLoc = normalizeText(profile.location || '');
  const offerLoc = normalizeText(offer.location || '');

  const isNationalOrAnywhere =
    offerLoc.includes('toutes localisations') ||
    offerLoc.includes('national') ||
    offerLoc.includes('tout le cameroun') ||
    offerLoc.includes('cameroun') ||
    offerLoc.includes('a distance') ||
    offerLoc.includes('en ligne') ||
    offerLoc.includes('remote');

  if (
    isNationalOrAnywhere ||
    (profileLoc && offerLoc && (profileLoc.includes(offerLoc) || offerLoc.includes(profileLoc)))
  ) {
    totalScore += 25;
  }

  // 3. DOMAINE / SECTEUR (35%)
  const profileDomain = normalizeText(profile.domain || '');
  const offerTextPool = normalizeText(
    `${offer.category || ''} ${offer.title || ''} ${offer.short_description || offer.shortDescription || ''} ${offer.full_description || offer.fullDescription || ''}`
  );

  if (profileDomain && offerTextPool) {
    const domainWords = profileDomain
      .split(/[\s&,/]+/)
      .filter((w) => w.length > 3);

    const hasDomainMatch = domainWords.some((word) => offerTextPool.includes(word));
    if (hasDomainMatch || offerTextPool.includes(profileDomain)) {
      totalScore += 35;
    }
  }

  // 4. MOTS-CLÉS / COMPÉTENCES (40%)
  const profileSkills = (profile.skills || []).filter(
    (s) => typeof s === 'string' && s.trim().length > 0
  );

  if (profileSkills.length > 0) {
    const fullRequirementsText = Array.isArray(offer.requirements)
      ? offer.requirements.join(' ')
      : typeof offer.requirements === 'string'
      ? offer.requirements
      : '';

    const offerSearchTarget = normalizeText(
      `${offer.title || ''} ${offer.short_description || offer.shortDescription || ''} ${offer.full_description || offer.fullDescription || ''} ${fullRequirementsText}`
    );

    let matchedSkillsCount = 0;
    for (const skill of profileSkills) {
      const normSkill = normalizeText(skill);
      if (normSkill && offerSearchTarget.includes(normSkill)) {
        matchedSkillsCount++;
      }
    }

    const skillRatio = matchedSkillsCount / profileSkills.length;
    totalScore += Math.round(skillRatio * 40);
  } else {
    if (totalScore >= 35) {
      totalScore += 20;
    }
  }

  return Math.min(100, Math.round(totalScore));
}

/**
 * Calcule et enregistre les matches pour un profil utilisateur contre toutes les offres en base.
 */
export async function syncProfileMatches(userId: string): Promise<{ matchesCreated: number }> {
  try {
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .maybeSingle();

    if (profileError || !profile) {
      console.warn('Profil introuvable pour matching:', profileError);
      return { matchesCreated: 0 };
    }

    const { data: offers, error: offersError } = await supabase
      .from('offers')
      .select('*');

    if (offersError || !offers || offers.length === 0) {
      return { matchesCreated: 0 };
    }

    const matchRowsToUpsert: any[] = [];
    const THRESHOLD = 70;

    for (const offer of offers) {
      const score = calculateMatchScore(profile, offer);
      if (score >= THRESHOLD) {
        matchRowsToUpsert.push({
          user_id: userId,
          offer_id: offer.id,
          score,
          status: 'nouveau',
          updated_at: new Date().toISOString(),
        });
      }
    }

    if (matchRowsToUpsert.length > 0) {
      const { error: upsertError } = await supabase
        .from('matches')
        .upsert(matchRowsToUpsert, { onConflict: 'user_id,offer_id' });

      if (upsertError) {
        console.error('Erreur upsert matches pour profil:', upsertError);
      }
    }

    return { matchesCreated: matchRowsToUpsert.length };
  } catch (err) {
    console.error('Exception syncProfileMatches:', err);
    return { matchesCreated: 0 };
  }
}

/**
 * Calcule et enregistre les matches pour une nouvelle offre contre tous les profils utilisateurs actifs.
 */
export async function syncOfferMatches(offerId: string): Promise<{ matchesCreated: number }> {
  try {
    const { data: offer, error: offerError } = await supabase
      .from('offers')
      .select('*')
      .eq('id', offerId)
      .maybeSingle();

    if (offerError || !offer) {
      console.warn('Offre introuvable pour matching:', offerError);
      return { matchesCreated: 0 };
    }

    const { data: profiles, error: profilesError } = await supabase
      .from('profiles')
      .select('*');

    if (profilesError || !profiles || profiles.length === 0) {
      return { matchesCreated: 0 };
    }

    const matchRowsToUpsert: any[] = [];
    const THRESHOLD = 70;

    for (const profile of profiles) {
      const score = calculateMatchScore(profile, offer);
      if (score >= THRESHOLD) {
        matchRowsToUpsert.push({
          user_id: profile.id,
          offer_id: offer.id,
          score,
          status: 'nouveau',
          updated_at: new Date().toISOString(),
        });
      }
    }

    if (matchRowsToUpsert.length > 0) {
      const { error: upsertError } = await supabase
        .from('matches')
        .upsert(matchRowsToUpsert, { onConflict: 'user_id,offer_id' });

      if (upsertError) {
        console.error('Erreur upsert matches pour offre:', upsertError);
      }
    }

    return { matchesCreated: matchRowsToUpsert.length };
  } catch (err) {
    console.error('Exception syncOfferMatches:', err);
    return { matchesCreated: 0 };
  }
}
