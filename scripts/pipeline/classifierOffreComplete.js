/**
 * ESSOR Pipeline Classifier Complete (Node.js ESM)
 * Classification en 2 étapes (Regex Pre-filter + IA Classifier)
 */
import { filtrerParRegex } from "../filtres/regexFilter.js";
import { classifierOffre } from "../filtres/iaClassifier.js";

export async function classifierOffreComplete(offre) {
  const locationRaw = offre.location_raw || offre.location || '';
  const regex = filtrerParRegex(offre.titre, offre.description, locationRaw);

  // Exclu par regex -> on rejette direct, aucun appel IA nécessaire
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

  // Inclus ou ambigu -> qualification / confirmation par le classificateur IA
  const ia = await classifierOffre(offre.titre, offre.entreprise, offre.description, locationRaw);

  return {
    ...ia,
    filtre_regex_statut: regex.statut,
    filtre_regex_motif: regex.categorie,
  };
}
