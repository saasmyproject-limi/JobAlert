/**
 * ESSOR Regex Pre-filter (Node.js ESM)
 */

const EXCLUSIONS = [
  { categorie: "US only", regex: /\b(US[- ]?based|United States only|U\.S\. citizens? only|must reside in the (US|United States))\b/i },
  { categorie: "UK only", regex: /\b(UK[- ]?based|United Kingdom only|must be based in the UK)\b/i },
  { categorie: "Canada only", regex: /\b(Canada only|must reside in Canada|Canadian residents only)\b/i },
  { categorie: "EU only", regex: /\b(EU[- ]?based|EU residents only|must be (located|based) in the EU|EEA citizens? only)\b/i },
  { categorie: "Zone restreinte Amérique/Europe/APAC", regex: /\b(North America|US\/Canada|EU\/UK|Europe only|Americas only|APAC only|LATAM only|Asia[- ]?Pacific only)\b/i },
  { categorie: "Liste pays restreinte", regex: /\b(open only to residents of|available in the following countries|candidates located in|only hiring in)\b/i },
  { categorie: "Autorisation travail", regex: /\b(must be authorized to work in|work authorization required for|citizenship required)\b/i },
  { categorie: "Fuseau horaire", regex: /\b(EST|PST|CST|CET|GMT[+-]?\d?)\s?(timezone|time zone|hours?)\b/i },
];

const INCLUSIONS = [
  { categorie: "Visa sponsorship", regex: /\b(visa sponsorship|we sponsor visas?|sponsorship (available|provided))\b/i },
  { categorie: "Relocation", regex: /\b(relocation (package|assistance|provided|covered)|we (cover|provide) relocation)\b/i },
  { categorie: "Permis de travail fourni", regex: /\bwork permit (provided|will be provided|sponsored)\b/i },
  { categorie: "Logement/billet couvert", regex: /\b(accommodation provided|flight(s)? (covered|paid|provided)|travel (costs|expenses) covered)\b/i },
  { categorie: "Ouvert Afrique explicite", regex: /\b(open to (candidates|applicants) (worldwide|globally|from Africa)|remote[- ]?(anywhere|worldwide|global))\b/i },
];

export function filtrerParRegex(titre, description) {
  const texte = `${titre || ''}\n${description || ''}`;

  const isGlobalMentioned = /\b(worldwide|anywhere|global|africa|cameroun|cameroon|emea)\b/i.test(texte);
  const containsRestrictedRegions = /\b(LATAM|Americas|APAC|Asia[- ]?Pacific|Europe|USA|Canada|Israel)\b/i.test(texte);
  
  if (containsRestrictedRegions && !isGlobalMentioned) {
    return { statut: "exclu", motif: "Zone géographique restreinte sans mention d'ouverture globale/Afrique", categorie: "Restriction régionale hors Afrique" };
  }

  for (const { categorie, regex } of EXCLUSIONS) {
    if (regex.test(texte)) {
      return { statut: "exclu", motif: regex.source, categorie };
    }
  }

  for (const { categorie, regex } of INCLUSIONS) {
    if (regex.test(texte)) {
      return { statut: "inclus", motif: regex.source, categorie };
    }
  }

  return { statut: "ambigu", motif: null, categorie: null };
}
