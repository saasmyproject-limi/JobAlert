export type ResultatRegex = "exclu" | "inclus" | "ambigu";

export interface MatchRegex {
  statut: ResultatRegex;
  motif: string | null;
  categorie: string | null;
}

const EXCLUSIONS_GEOGRAPHIQUES = [
  // Amérique du Nord & US
  /\b(US|USA|United States|U\.S\.A?|Canada|North America|Americas)[- ]?(only|based|residents?|citizens?|applicants?|timezone)\b/i,
  /\bmust (reside|be located|live|be based|be working) in (the\s+)?(US|USA|United States|Canada|North America|Americas)\b/i,
  /\b(Remote\s*[-–—:]\s*(US|USA|United States|Canada|North America|Americas))\b/i,
  
  // Europe & UK
  /\b(UK|United Kingdom|EU|Europe|EEA|European Union)[- ]?(only|based|residents?|citizens?|applicants?)\b/i,
  /\bmust (reside|be located|live|be based) in (the\s+)?(UK|United Kingdom|EU|Europe|EEA|Germany|France|Spain|Netherlands|Poland|Italy|Sweden|Switzerland)\b/i,
  /\b(Remote\s*[-–—:]\s*(UK|United Kingdom|EU|Europe|EEA|Germany|France|Spain))\b/i,

  // Autres zones restreintes
  /\b(LATAM|APAC|Asia[- ]?Pacific|Australia|New Zealand|NZ)[- ]?(only|based|residents?)\b/i,
  /\b(open only to residents of|only hiring in|candidates located in|must be physically located in)\b/i,
  
  // Exigences légales / Citoyenneté
  /\b(must be (legally\s+)?authorized to work in|work authorization required for|US citizen|Green Card|EU citizenship required)\b/i,
  /\b(sponsorship (is )?not (available|provided|offered)|no visa sponsorship|we (cannot|do not) sponsor|cannot offer visa|no relocation)\b/i,
];

const INCLUSIONS_RELOCATION = [
  /\b(visa sponsorship|we sponsor visas?|sponsorship (available|provided)|work permit (provided|sponsored))\b/i,
  /\b(relocation (package|assistance|provided|covered)|we (cover|provide) relocation|accommodation provided|flight(s)? (covered|paid|provided)|travel (costs|expenses) covered)\b/i,
];

const INCLUSIONS_WORLDWIDE_EXPLICIT = [
  /\b(open to (candidates|applicants) (worldwide|globally|from Africa|from Cameroon))\b/i,
  /\b(remote (anywhere|worldwide)|work from anywhere|anywhere in the world)\b/i,
  /\b(work from home (anywhere|worldwide))\b/i,
];

const NON_AFRICAN_LOCATION_RAW = [
  /\b(United States|USA|\bUS\b|Canada|United Kingdom|\bUK\b|Germany|France|Spain|Italy|Netherlands|Australia|Brazil|India|Israel|Poland|Sweden|Switzerland|Singapore|Europe|Americas|North America|LATAM|APAC|EMEA)\b/i
];

export function filtrerParRegex(titre: string, description: string, locationRaw: string = ''): MatchRegex {
  const texte = `${titre || ''}\n${locationRaw || ''}\n${description || ''}`;

  // 1. Visa Sponsorship / Relocation explicite positif
  const hasNegativeSponsorship = /\b(no (visa )?sponsorship|sponsorship (is )?not (available|provided|offered)|cannot sponsor|will not sponsor|no relocation)\b/i.test(texte);
  const hasPositiveRelocation = INCLUSIONS_RELOCATION.some(regex => regex.test(texte));

  if (hasPositiveRelocation && !hasNegativeSponsorship) {
    return { statut: "inclus", motif: "Relocation / Visa Sponsorship explicite", categorie: "Relocation" };
  }

  // 2. Exclusions géographiques strictes
  for (const regex of EXCLUSIONS_GEOGRAPHIQUES) {
    if (regex.test(texte)) {
      return { statut: "exclu", motif: regex.source, categorie: "Restriction géographique hors Afrique" };
    }
  }

  // 3. Localisation brute hors Afrique sans Worldwide explicite dans location_raw
  const isExplicitWorldwideLoc = /\b(worldwide|anywhere|africa|cameroon|cameroun)\b/i.test(locationRaw || '');
  const isNonAfricanLoc = NON_AFRICAN_LOCATION_RAW.some(regex => regex.test(locationRaw || ''));

  if (isNonAfricanLoc && !isExplicitWorldwideLoc) {
    return { statut: "exclu", motif: `Localisation restreinte hors Afrique (${locationRaw})`, categorie: "Restriction régionale" };
  }

  // 4. Worldwide / Africa explicite
  const isGlobalExplicitInDesc = INCLUSIONS_WORLDWIDE_EXPLICIT.some(regex => regex.test(texte));
  if (isGlobalExplicitInDesc) {
    return { statut: "inclus", motif: "Remote Worldwide / Afrique explicite", categorie: "Remote Afrique" };
  }

  // 5. Autrement -> ambigu
  return { statut: "ambigu", motif: null, categorie: null };
}
