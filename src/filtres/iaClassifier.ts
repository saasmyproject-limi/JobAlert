declare const process: any;

export interface ResultatClassificationIA {
  eligible_remote_afrique: boolean | null;
  confidence_remote: "haute" | "moyenne" | "faible";
  justification_remote: string;
  relocation_disponible: boolean;
  confidence_relocation: "haute" | "moyenne" | "faible";
  justification_relocation: string;
  pays_destination_relocation: string | null;
  type_offre_final: "remote_afrique" | "relocation" | "aucun";
}

const PROMPT_SYSTEME = `Tu es un classificateur expert en éligibilité géographique pour offres d'emploi, spécialisé dans le marché africain.

Tu reçois le titre et la description complète d'une offre d'emploi. Ta tâche est de déterminer :
1. Si cette offre est réellement accessible à un candidat physiquement basé n'importe où en Afrique
2. Si l'offre implique une relocation/visa pris en charge par l'employeur

RÈGLES D'ANALYSE :

Pour le REMOTE :
- Une offre "remote" n'est éligible que si aucune restriction géographique n'exclut l'Afrique
- Cherche activement les restrictions implicites : fuseaux horaires imposés (ex: "must overlap 9am-5pm EST" exclut de facto un candidat en Afrique de l'Ouest/Est selon le cas — calcule le chevauchement), zones autorisées listées ("US/Canada only", "EU residents", "UK-based"), exigences d'autorisation de travail dans un pays précis, exigences de citoyenneté
- Une offre "remote-first" ou "hybrid" avec un bureau physique hors Afrique n'est PAS éligible sauf mention explicite contraire
- Si la description ne précise AUCUNE restriction géographique et parle de "remote" ou "work from anywhere", considère-la éligible mais avec confidence modérée
- Les fuseaux horaires africains vont de UTC+0 à UTC+3 — utilise ça pour évaluer le chevauchement avec les exigences horaires mentionnées

Pour la RELOCATION :
- Cherche des mentions explicites : "visa sponsorship", "relocation package/assistance", "work permit provided", "accommodation provided", "flight/travel covered", "we sponsor visas"
- Ne classe PAS comme relocation une simple mention "must be willing to relocate" sans précision de prise en charge
- Secteurs fréquents : hôtellerie-restauration, santé/soins infirmiers, BTP, agriculture saisonnière, aide à domicile

Réponds UNIQUEMENT en JSON valide, sans texte avant ni après, selon ce schéma exact :

{
  "eligible_remote_afrique": true,
  "confidence_remote": "haute",
  "justification_remote": "citation ou résumé court",
  "relocation_disponible": false,
  "confidence_relocation": "faible",
  "justification_relocation": "résumé court",
  "pays_destination_relocation": null,
  "type_offre_final": "remote_afrique"
}`;

/**
 * Analyse heuristique déterministe intelligente (utilisée si aucune clé API d'IA externe n'est configurée)
 */
function classifierHeuristique(titre: string, entreprise: string, description: string): ResultatClassificationIA {
  const text = `${titre}\n${entreprise}\n${description}`.toLowerCase();

  // Relocation detection
  const hasVisa = /visa sponsorship|sponsor visas?|work permit (provided|sponsored)/i.test(text);
  const hasRelocation = /relocation (package|assistance|provided|covered)|accommodation provided|flight(s)? (covered|paid|provided)/i.test(text);
  
  let countryMatch: string | null = null;
  const countries = ['Dubai', 'UAE', 'Qatar', 'Saudi Arabia', 'France', 'Canada', 'Germany', 'Germany', 'USA', 'UK', 'Kuweït', 'Oman'];
  for (const c of countries) {
    if (text.includes(c.toLowerCase())) {
      countryMatch = c;
      break;
    }
  }

  const isRelocation = hasVisa || hasRelocation;

  // Remote Africa detection
  const hasExclusion = /us only|usa only|uk only|canada only|eu residents|must be authorized to work in|must reside in/i.test(text);
  const hasExplicitAfrica = /worldwide|anywhere|global|africa|cameroon|sub-saharan|emea/i.test(text);

  const eligibleRemote = !hasExclusion && (hasExplicitAfrica || text.includes('remote'));

  let typeFinal: "remote_afrique" | "relocation" | "aucun" = "aucun";
  if (eligibleRemote) {
    typeFinal = "remote_afrique";
  } else if (isRelocation) {
    typeFinal = "relocation";
  }

  return {
    eligible_remote_afrique: eligibleRemote,
    confidence_remote: eligibleRemote ? (hasExplicitAfrica ? "haute" : "moyenne") : "faible",
    justification_remote: eligibleRemote
      ? "Offre ouverte au travail à distance international sans restriction géographique stricte excluant l'Afrique."
      : "Restrictions géographiques ou d'autorisation de travail identifiées hors Afrique.",
    relocation_disponible: isRelocation,
    confidence_relocation: isRelocation ? "haute" : "faible",
    justification_relocation: isRelocation
      ? "Prise en charge du visa, logement ou frais de voyage mentionnée par l'employeur."
      : "Aucune prise en charge explicite de relocation ou visa détectée.",
    pays_destination_relocation: countryMatch,
    type_offre_final: typeFinal
  };
}

export async function classifierOffre(
  titre: string,
  entreprise: string,
  description: string
): Promise<ResultatClassificationIA> {
  const apiKey = (import.meta as any).env?.VITE_ANTHROPIC_API_KEY || (import.meta as any).env?.VITE_GEMINI_API_KEY || process.env.ANTHROPIC_API_KEY || process.env.GEMINI_API_KEY;

  if (!apiKey) {
    return classifierHeuristique(titre, entreprise, description);
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
          content: `Titre de l'offre : ${titre}\nEntreprise : ${entreprise}\nDescription complète :\n${description}`
        }]
      })
    });

    if (!res.ok) {
      return classifierHeuristique(titre, entreprise, description);
    }

    const data = await res.json();
    const textContent = data.content?.find((b: any) => b.type === "text")?.text?.trim() || "{}";
    return JSON.parse(textContent) as ResultatClassificationIA;
  } catch (err) {
    return classifierHeuristique(titre, entreprise, description);
  }
}
