/**
 * Modèles de données pour l'application immobilière
 */

export interface Bien {
  id: number;
  titre: string;
  
  description: string;
  adresse: string;
  ville: string;
  codePostal?: string;
  quartier?: string;
  surface: number;
  prix: number;
  statut: 'DISPONIBLE' | 'VENDU' | 'LOUE' | 'RESERVE';
  typeTransaction: 'VENTE' | 'LOCATION';
  datePublication?: string;
  misEnAvant: boolean;
  images: ImageBien[];
  
  // IMPORTANT : Type de bien pour le backend (APPARTEMENT, VILLA, MAISON, TERRAIN, BUREAU)
  typeBien?: 'Appartement' | 'Maison' | 'Villa' | 'Terrain' | 'Bureau';
  
  // Propriétés optionnelles
  nombrePieces?: number;
  nombreChambres?: number;
  nombreSallesBain?: number;
  jardin?: boolean;
  garage?: boolean;
  piscine?: boolean;
  climatisation?: boolean;
  etage?: number;
  longitude?: number;
  latitude?: number;
  ascenseur?: boolean;
  balcon?: boolean;
  parking?: boolean;
  meuble?: boolean;
}

export interface Contact {
  nom: string;
  prenom: string;
  email: string;
  telephone: string;
  message: string;
  bienId?: number;
}

export interface Agence {
  nomAgence: string;
  email: string;
  telephone: string;
  adresse: string;
  description?: string;
  whatsappNumber?: string;
}
export interface ImageBien {
  urlImage: string;
  ordre: number;
  estPrincipale: boolean;
}
