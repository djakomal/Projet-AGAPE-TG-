export interface User {
  id: string;
  nom: string;
  email: string;
  role: 'agent_social' | 'agent_medical' | 'comptable' | 'coordinateur';
  mot_de_passe: string;
} 