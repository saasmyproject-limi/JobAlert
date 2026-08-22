declare const process: any;

export interface ResultatClassificationIA {
  eligible_remote_afrique: boolean;
  confidence_remote: "haute" | "moyenne" | "faible";
  justification_remote: string;
  relocation_disponible: boolean;
  confidence_relocation: "haute" | "moyenne" | "faible";
  justification_relocation: string;
  pays_destination_relocation: string | null;
  type_offre_final: "remote_afrique" | "relocation" | "aucun";
}

const PROMPT_SYSTEME = `Tu es un classificateur ultra-strict d'éligibilité géographique pour la plateforme ESSOR au Cameroun.

Tu reçois le titre, l'entreprise, la localisation brute et la description d'une offre d'emploi.

RÈGLE D'OR :
Une offre ne peut être retenue que sous 2 conditions strictly exclusives :

1. TYPE 'remote_afrique' :
- L'offre peut être réalisée à 100% à distance par un candidat vivant physiquement au Cameroun (ou n'importe où en Afrique).
- REJET OBLIGATOIRE (type_offre_final = 'aucun') si l'offre exige d'être basé physiquement aux USA, Canada, Europe, UK, Amérique du Nord, LATAM, APAC, ou dans un pays spécifique hors Afrique.
- REJET OBLIGATOIRE si l'offre exige une autorisation de travail locale (ex: US work authorization, EU residency, Green Card) sans fournir de visa.
- REJET OBLIGATOIRE si un chevauchement horaire strict (EST/PST/CST/CET) rend le poste impraticable depuis l'Afrique (UTC+0 à UTC+3) sans flexibilité.

2. TYPE 'relocation' :
- L'offre est basée à l'étranger (présentiel ou hybride), MAIS l'employeur prend EXPLICITEMENT en charge le visa de travail, le permis de travail, le billet d'avion ou le logement (relocation package / visa sponsorship).
- REJET OBLIGATOIRE si l'offre mentionne simplement "must be willing to relocate" SANS prise en charge explicite par l'employeur, ou précise "no visa sponsorship" / "cannot sponsor visas".

SI L'OFFRE NE REMPLIT NI LA CONDITION 1 NI LA CONDITION 2, TU DOIS IMPÉRATIVEMENT RÉPONDRE AVEC type_offre_final = "aucun".

Réponds UNIQUEMENT en JSON valide, sans texte avant ni après, selon ce schéma exact :

{
  "eligible_remote_afrique": true | false,
  "confidence_remote": "haute" | "moyenne" | "faible",
  "justification_remote": "citation ou résumé court en français",
  "relocation_disponible": true | false,
  "confidence_relocation": "haute" | "moyenne" | "faible",
  "justification_relocation": "citation ou résumé court en français",
  "pays_destination_relocation": "nom du pays si relocation, sinon null",
  "type_offre_final": "remote_afrique" | "relocation" | "aucun"
}`;

function classifierHeuristique(titre: string, entreprise: string, description: string, locationRaw: string = ''): ResultatClassificationIA {
  const text = `${titre || ''}\n${entreprise || ''}\n${locationRaw || ''}\n${description || ''}`.toLowerCase();

  const hasNegativeVisa = /no (visa )?sponsorship|sponsorship (is )?not (available|provided|offered)|cannot sponsor|will not sponsor|no relocation/i.test(text);

  const hasVisa = !hasNegativeVisa && /visa sponsorship|sponsor visas?|work permit (provided|sponsored)/i.test(text);
  const hasRelocation = !hasNegativeVisa && /relocation (package|assistance|provided|covered)|accommodation provided|flight(s)? (covered|paid|provided)/i.test(text);
  
  let countryMatch: string | null = null;
  const countries = ['Dubai', 'UAE', 'Qatar', 'Saudi Arabia', 'France', 'Canada', 'Germany', 'USA', 'UK', 'Kuweït', 'Oman', 'Belgium', 'Italy'];
  for (const c of countries) {
    if (text.includes(c.toLowerCase())) {
      countryMatch = c;
      break;
    }
  }

  const isRelocation = hasVisa || hasRelocation;

  const hasExclusionRegion = /us only|usa only|uk only|canada only|eu residents|must be authorized to work in|must reside in|us based|uk based|eu based|north america|europe only|latam|apac/i.test(text);
  const hasNonAfricanLoc = /united states|usa|\bus\b|canada|united kingdom|\buk\b|germany|france|spain|italy|netherlands|australia|brazil|india|israel/i.test(locationRaw.toLowerCase());
  const hasExplicitAfricaOrWorldwide = /worldwide|work from anywhere|anywhere in the world|open to candidates from africa|open to candidates globally|remote (worldwide|global|anywhere)/i.test(text);

  const eligibleRemote = !hasExclusionRegion && !hasNonAfricanLoc && hasExplicitAfricaOrWorldwide;

  let typeFinal: "remote_afrique" | "relocation" | "aucun" = "aucun";
  if (isRelocation) {
    typeFinal = "relocation";
  } else if (eligibleRemote) {
    typeFinal = "remote_afrique";
  }

  return {
    eligible_remote_afrique: eligibleRemote,
    confidence_remote: eligibleRemote ? "haute" : "faible",
    justification_remote: eligibleRemote
      ? "Offre ouverte au travail à distance international sans restriction géographique excluant l'Afrique."
      : "Restrictions géographiques ou manque de mention d'ouverture internationale/Afrique.",
    relocation_disponible: isRelocation,
    confidence_relocation: isRelocation ? "haute" : "faible",
    justification_relocation: isRelocation
      ? "Prise en charge du visa ou de la relocation mentionnée par l'employeur."
      : "Aucune prise en charge explicite du visa/relocation.",
    pays_destination_relocation: isRelocation ? countryMatch : null,
    type_offre_final: typeFinal
  };
}

export async function classifierOffre(
  titre: string,
  entreprise: string,
  description: string,
  locationRaw: string = ''
): Promise<ResultatClassificationIA> {
  let apiKey: string | null = null;
  try {
    if (typeof process !== 'undefined' && process?.env) {
      apiKey = process.env.ANTHROPIC_API_KEY || process.env.GEMINI_API_KEY || null;
    }
    if (!apiKey && typeof import.meta !== 'undefined' && (import.meta as any).env) {
      apiKey = (import.meta as any).env.VITE_ANTHROPIC_API_KEY || (import.meta as any).env.VITE_GEMINI_API_KEY || null;
    }
  } catch (e) {
    apiKey = null;
  }

  if (!apiKey) {
    return classifierHeuristique(titre, entreprise, description, locationRaw);
  }

  try {
    const res = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "x-api-key": apiKey,
        "anthropic-version": "2023-06-01",
        "content-type": "application/json"
      },
      body: JSON.stringify({
        model: "claude-sonnet-4-6",
        max_tokens: 500,
        system: PROMPT_SYSTEME,
        messages: [{
          role: "user",
          content: `Titre : ${titre}\nEntreprise : ${entreprise}\nLocalisation Brute : ${locationRaw}\nDescription :\n${description}`
        }]
      })
    });

    if (!res.ok) {
      return classifierHeuristique(titre, entreprise, description, locationRaw);
    }

    const data = await res.json();
    const textContent = data.content?.find((b: any) => b.type === "text")?.text?.trim() || "{}";
    return JSON.parse(textContent);
  } catch (err) {
    return classifierHeuristique(titre, entreprise, description, locationRaw);
  }
}
