export interface Enfant {
  id: string;
  numero: string;
  nom: string;
  prenom: string;
  age: number;
  classe: string;
  resultat_annee: 'reussi' | 'echoue';
  parrainId?: string | null;
  risqueExclusion?: boolean;
} 