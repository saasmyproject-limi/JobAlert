/**
 * ESSOR Pipeline Classifier Complete (Node.js ESM)
 */
import { filtrerParRegex } from "../filtres/regexFilter.js";
import { classifierOffre } from "../filtres/iaClassifier.js";

export async function classifierOffreComplete(offre) {
  const regex = filtrerParRegex(offre.titre, offre.description);

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

  // Inclus ou ambigu -> on passe par l'IA pour confirmer/affiner
  const ia = await classifierOffre(offre.titre, offre.entreprise, offre.description);

  return {
    ...ia,
    filtre_regex_statut: regex.statut,
    filtre_regex_motif: regex.categorie,
  };
}
