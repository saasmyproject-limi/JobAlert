import { filtrerParRegex } from "../filtres/regexFilter";
import { classifierOffre, ResultatClassificationIA } from "../filtres/iaClassifier";

export interface ResultatClassificationComplete extends ResultatClassificationIA {
  filtre_regex_statut: "exclu" | "inclus" | "ambigu";
  filtre_regex_motif: string | null;
}

export async function classifierOffreComplete(offre: {
  titre: string;
  entreprise: string;
  description: string;
  location_raw?: string;
  location?: string;
}): Promise<ResultatClassificationComplete> {
  const locationRaw = offre.location_raw || offre.location || '';
  const regex = filtrerParRegex(offre.titre, offre.description, locationRaw);

  // Exclu par regex -> on rejette direct, pas d'appel IA
  if (regex.statut === "exclu") {
    return {
      eligible_remote_afrique: false,
      confidence_remote: "haute",
      justification_remote: `Offre rejetée par le pré-filtre regex (Motif: ${regex.categorie || 'Restriction géographique'}).`,
      relocation_disponible: false,
      confidence_relocation: "faible",
      justification_relocation: "Non éligible après pré-filtrage regex.",
      pays_destination_relocation: null,
      type_offre_final: "aucun",
      filtre_regex_statut: regex.statut,
      filtre_regex_motif: regex.categorie,
    };
  }

  // Inclus ou ambigu -> qualification / confirmation par l'IA
  const ia = await classifierOffre(offre.titre, offre.entreprise, offre.description, locationRaw);

  return {
    ...ia,
    filtre_regex_statut: regex.statut,
    filtre_regex_motif: regex.categorie,
  };
}
