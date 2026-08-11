import { JobOffer } from '../types';

export const MOCK_JOBS: JobOffer[] = [
  {
    id: 'minfopra-admin-2026',
    title: 'Concours Direct MINFOPRA - 45 Administrateurs Civils',
    organization: 'MINFOPRA - Ministère de la Fonction Publique',
    type: 'emploi-formel',
    typeLabel: 'Emploi Formel (Concours)',
    location: 'Yaoundé & Centres Régionaux',
    shortDescription: 'Recrutement direct de 45 élèves Administrateurs Civils à l\'ENAM pour la session 2026-2027.',
    fullDescription: `Le Ministre de la Fonction Publique et de la Réforme Administrative informe le public qu'un concours direct pour le recrutement de quarante-cinq (45) élèves Administrateurs Civils à la Division Administrative de l'École Nationale d'Administration et de Magistrature (ENAM) est ouvert pour la session 2026.

Le concours se déroulera dans le chef-lieu de la région du Centre (Yaoundé) ainsi que dans les centres régionaux d'examen.`,
    requirements: [
      'Être de nationalité camerounaise',
      'Être âgé de 17 ans au moins et de 32 ans au plus au 1er janvier 2026',
      'Titulaire d\'un Master 2, DEA ou Licence en Droit, Sciences Économiques ou Gestion',
      'Casier judiciaire vierge (bulletin n° 3 datant de moins de 3 mois)',
      'Certificat médical attestant de l\'aptitude physique'
    ],
    deadline: '28 Octobre 2026',
    matchPercentage: 96,
    category: 'Fonction Publique',
    externalUrl: 'http://www.minfopra.gov.cm',
    postedDate: 'Il y a 2 heures',
    isUrgent: true
  },
  {
    id: 'minesup-bourse-excellence-2026',
    title: 'Bourse d\'Excellence Scientifique et Technologique MINESUP',
    organization: 'MINESUP - Ministère de l\'Enseignement Supérieur',
    type: 'bourse',
    typeLabel: 'Bourse d\'études (100%)',
    location: 'Yaoundé / Partenariats Internationaux',
    shortDescription: 'Bourse complète d\'études de Master et Doctorat pour les filières scientifiques et technologiques.',
    fullDescription: `Le Ministère de l'Enseignement Supérieur lance l'appel à candidatures pour le programme national de Bourses d'Excellence Scientifique et Technologique au profit des étudiants camerounais méritants.

Cette bourse couvre l'intégralité des frais de scolarité, une allocation mensuelle de subsistance ainsi que la prise en charge de la couverture sanitaire pour la durée des études.`,
    requirements: [
      'Inscrit dans une université publique ou privée homologuée du Cameroun',
      'Moyenne académique minimale de 14/20 sur le cursus antérieur',
      'Projet d\'étude ou de recherche axé sur le développement économique national',
      'Lettre de recommandation d\'un professeur ou chef de département'
    ],
    deadline: '15 Novembre 2026',
    matchPercentage: 92,
    category: 'Enseignement Supérieur',
    externalUrl: 'https://www.minesup.gov.cm',
    postedDate: 'Il y a 5 heures'
  },
  {
    id: 'plombier-sanitaire-akwa',
    title: 'Plombier & Installateur Sanitaire Qualifié (Chantier Urgent)',
    organization: 'Entreprise BTP SABC Hydro',
    type: 'emploi-informel',
    typeLabel: 'Emploi Informel / Prestation',
    location: 'Douala - Akwa',
    shortDescription: 'Recherche urgente d\'un plombier expérimenté pour installation tuyauterie et sanitaire sur immeuble R+4.',
    fullDescription: `Chantier de rénovation et construction d'un immeuble commercial à Akwa Douala. Nous recherchons un plombier installateur sanitaire autonome disponible immédiatement pour une mission de 3 semaines renouvelable.

Possibilité d'embauche permanente selon les performances sur le chantier. Paiement hebdomadaire sécurisé.`,
    requirements: [
      'Minimum 3 ans d\'expérience pratique sur chantier de bâtiment',
      'Maîtrise du soudage cuivre, tuyaux PVC et PPR',
      'Pose de sanitaires, robinetterie, chauffe-eau et réseaux d\'évacuation',
      'Outillage de base personnel apprécié'
    ],
    deadline: '18 Août 2026',
    matchPercentage: 88,
    category: 'Artisanat & Métiers',
    contactWhatsApp: '+237699112233',
    salary: '12 000 FCFA / jour',
    postedDate: 'Hier',
    isUrgent: true
  },
  {
    id: 'livreur-moto-yaounde',
    title: 'Livreur Moto Express avec Permis A (Flotte de 5 Motos)',
    organization: 'KamerExpress Delivery',
    type: 'emploi-informel',
    typeLabel: 'Emploi Informel / Freelance',
    location: 'Yaoundé - Bastos & Omnisports',
    shortDescription: 'Recrutement de 3 livreurs à moto pour livraisons de colis et repas dans la ville de Yaoundé.',
    fullDescription: `KamerExpress recherche des livreurs sérieux et dynamiques ayant une parfaite connaissance des quartiers de Yaoundé (Bastos, Nlongkak, Odza, Mendong, Mvan).

Moto fournie par la société avec carburant et forfait d'entretien inclus. Prime sur le nombre de livraisons réussies.`,
    requirements: [
      'Permis de conduire catégorie A valide',
      'Smartphone Android fonctionnel pour l\'application de livraison',
      'Excellente connaissance de la géographie de Yaoundé',
      'Courtoisie, ponctualité et sens du service client'
    ],
    deadline: '25 Août 2026',
    matchPercentage: 90,
    category: 'Transport & Logistique',
    contactWhatsApp: '+237677889900',
    salary: '120 000 - 180 000 FCFA / mois',
    postedDate: 'Hier'
  },
  {
    id: 'dev-fullstack-douala',
    title: 'Développeur Fullstack React / Node.js (CDI)',
    organization: 'TechKamer Solutions',
    type: 'emploi-formel',
    typeLabel: 'Emploi Formel (CDI)',
    location: 'Douala - Bonanjo (Hybride)',
    shortDescription: 'Conception et développement de solutions web SAAS pour des clients d\'Afrique Centrale.',
    fullDescription: `TechKamer Solutions est une ESN en forte croissance basée à Douala. Nous recherchons un Développeur Fullstack passionné pour intégrer notre équipe produit. Vous travaillerez sur des applications web à fort trafic en React, TypeScript et Node.js/PostgreSQL.`,
    requirements: [
      'BAC+3 à BAC+5 en Informatique ou Génie Logiciel',
      'Au moins 2 ans d\'expérience solide avec React et Node.js',
      'Bases solides en bases de données SQL / PostgreSQL',
      'Esprit d\'équipe, autonomie et rigueur du code'
    ],
    deadline: '05 Septembre 2026',
    matchPercentage: 95,
    category: 'Informatique & Web',
    salary: '350 000 - 550 000 FCFA / mois',
    postedDate: 'Il y a 1 jour'
  },
  {
    id: 'stage-marketing-orange',
    title: 'Stage Académique & Pro en Marketing Digital',
    organization: 'Orange Cameroun',
    type: 'stage',
    typeLabel: 'Stage Professionnel (6 mois)',
    location: 'Douala - Bd de la Liberté',
    shortDescription: 'Assister l\'équipe Brand & Communication dans la création de contenu et le suivi des campagnes digitales.',
    fullDescription: `Dans le cadre de l'expansion de nos services digitaux, la Direction Marketing d'Orange Cameroun recherche un(e) Stagiaire Assistant(e) Community Manager & Content Creator pour une durée de 6 mois renouvelable.`,
    requirements: [
      'Niveau Bac+3/4 en Marketing, Communication ou Commerce',
      'Excellente maîtrise des réseaux sociaux (TikTok, LinkedIn, Facebook, Instagram)',
      'Bonnes capacités rédactionnelles en français (anglais est un plus)',
      'Notions de Canva, Photoshop ou montage vidéo mobile'
    ],
    deadline: '30 Août 2026',
    matchPercentage: 89,
    category: 'Marketing & Vente',
    salary: 'Indemnité de stage : 100 000 FCFA / mois',
    postedDate: 'Il y a 2 jours'
  },
  {
    id: 'comptable-junior-bafoussam',
    title: 'Assistant Comptable Junior (CDI)',
    organization: 'Groupement Agro-Industriel de l\'Ouest',
    type: 'emploi-formel',
    typeLabel: 'Emploi Formel (CDI)',
    location: 'Bafoussam',
    shortDescription: 'Gestion de la tenue de caisse, saisie des pièces comptables et déclarations fiscales OHADA.',
    fullDescription: `Le Groupement Agro-Industriel recherche pour son siège de Bafoussam un Assistant Comptable motivé. Sous la responsabilité du Chef Comptable, vous serez en charge de la saisie quotidienne des opérations et de la préparation des états financiers.`,
    requirements: [
      'BTS ou Licence en Comptabilité et Gestion (OHADA)',
      '1 à 2 ans d\'expérience en cabinet ou en entreprise',
      'Maîtrise du logiciel Sage SAARI Comptabilité 100',
      'Rigueur, discrétion et sens de l\'organisation'
    ],
    deadline: '10 Septembre 2026',
    matchPercentage: 91,
    category: 'Comptabilité & Gestion',
    salary: '200 000 - 280 000 FCFA / mois',
    postedDate: 'Il y a 3 jours'
  },
  {
    id: 'electricien-villa-kribi',
    title: 'Électricien Bâtiment Qualifié (Contrat de Chantier)',
    organization: 'Kribi Resort Builders',
    type: 'emploi-informel',
    typeLabel: 'Emploi Informel / Prestation',
    location: 'Kribi - Ngoye',
    shortDescription: 'Pose du réseau électrique et appareillages pour un complexe hôtelier balnéaire.',
    fullDescription: `Entreprise générale du bâtiment recherche un électricien qualifié pour la réalisation de l'installation électrique basse tension, tableaux, disjoncteurs et luminaires sur un projet hôtelier à Kribi.`,
    requirements: [
      'CAP, BT ou expérience pratique probante de 3 ans+',
      'Lecture de schémas électriques et respect des normes NFC 15-100',
      'Ponctualité et respect des consignes de sécurité'
    ],
    deadline: '20 Août 2026',
    matchPercentage: 84,
    category: 'Bâtiment & Travaux',
    contactWhatsApp: '+237690001122',
    salary: '150 000 FCFA / chantier (10 jours)',
    postedDate: 'Il y a 3 jours'
  },
  {
    id: 'bourse-polytech-douala',
    title: 'Bourse d\'Excellence Polytechnique Douala (Cycle Ingénieur)',
    organization: 'Fondation FOKOU & ENSPD',
    type: 'bourse',
    typeLabel: 'Bourse d\'études (Partielle)',
    location: 'Douala - PK17',
    shortDescription: 'Prise en charge des frais de scolarité pour les étudiants admis en Génie Industriel et Énergétique.',
    fullDescription: `La Fondation FOKOU en partenariat avec l'École Nationale Supérieure Polytechnique de Douala (ENSPD) offre 10 bourses d'études aux candidats admis au concours d'entrée en 1ère année du cycle d'Ingénieur.`,
    requirements: [
      'Admis au concours ENSPD session 2026',
      'Excellents résultats au Baccalauréat C, D, E ou TI',
      'Dossier social attestant du besoin d\'accompagnement'
    ],
    deadline: '12 Septembre 2026',
    matchPercentage: 87,
    category: 'Enseignement Supérieur',
    externalUrl: 'https://enspd-udo.cm',
    postedDate: 'Il y a 4 jours'
  },
  {
    id: 'stage-assistant-rh-yaounde',
    title: 'Stagiaire Assistant(e) Ressources Humaines',
    organization: 'Cabinet Human Capital Cam',
    type: 'stage',
    typeLabel: 'Stage Académique (3 mois)',
    location: 'Yaoundé - Hippodrome',
    shortDescription: 'Participation à la présélection des CV, organisation des entretiens et gestion administrative.',
    fullDescription: `Cabinet de conseil RH réputé à Yaoundé offre un stage d'immersion pratique à un(e) étudiant(e) désireux(se) d'acquérir une première expérience concrète en recrutement et gestion du personnel.`,
    requirements: [
      'Licence 3 ou Master 1 en GRH, Droit du Travail ou Psychologie du Travail',
      'Bon relationnel et maîtrise du Pack Office (Word, Excel)',
      'Sens de l\'écoute et réactivité'
    ],
    deadline: '22 Août 2026',
    matchPercentage: 93,
    category: 'Comptabilité & Gestion',
    salary: 'Indemnité de transport : 60 000 FCFA / mois',
    postedDate: 'Il y a 5 jours'
  }
];
