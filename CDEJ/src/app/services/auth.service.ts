import { Injectable } from '@angular/core';

// Interface pour les utilisateurs
interface User {
  email: string;
  password: string;
  role: 'agent_social' | 'agent_medical' | 'comptable' | 'coordinateur';
  nom: string;
  isConfirmed?: boolean;
  confirmationToken?: string;
  createdAt?: Date;
}

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly USER_ROLE_KEY = 'user_role';
  private readonly LOGGED_IN_KEY = 'logged_in';
  private readonly USER_EMAIL_KEY = 'user_email';
  private readonly USER_NOM_KEY = 'user_nom';

  // Base de données simulée des utilisateurs
  private users: User[] = [
    { email: 'coordinateur@cdej.com', password: 'coord123', role: 'coordinateur', nom: 'Coordinateur', isConfirmed: true, createdAt: new Date() },
    { email: 'social@cdej.com', password: 'social123', role: 'agent_social', nom: 'Agent Social', isConfirmed: true, createdAt: new Date() },
    { email: 'medical@cdej.com', password: 'medical123', role: 'agent_medical', nom: 'Agent Médical', isConfirmed: true, createdAt: new Date() },
    { email: 'comptable@cdej.com', password: 'comptable123', role: 'comptable', nom: 'Comptable', isConfirmed: true, createdAt: new Date() },
    // Utilisateurs de test avec emails contenant les mots-clés
    { email: 'coord@test.com', password: 'coord123', role: 'coordinateur', nom: 'Coordinateur Test', isConfirmed: true, createdAt: new Date() },
    { email: 'agent.social@test.com', password: 'social123', role: 'agent_social', nom: 'Social Test', isConfirmed: true, createdAt: new Date() },
    { email: 'agent.medical@test.com', password: 'medical123', role: 'agent_medical', nom: 'Médical Test', isConfirmed: true, createdAt: new Date() },
    { email: 'comptable.test@test.com', password: 'comptable123', role: 'comptable', nom: 'Comptable Test', isConfirmed: true, createdAt: new Date() }
  ];

  login(email: string, password: string): { success: boolean; error?: string; user?: User } {
    // Recherche de l'utilisateur
    const user = this.users.find(u => u.email.toLowerCase() === email.toLowerCase());
    
    if (!user) {
      return { success: false, error: 'Email non trouvé' };
    }
    
    if (user.password !== password) {
      return { success: false, error: 'Mot de passe incorrect' };
    }

    // Vérifier si le compte est confirmé
    if (!user.isConfirmed) {
      return { success: false, error: 'Votre compte n\'est pas encore confirmé. Vérifiez votre email.' };
    }
    
    // Connexion réussie
    localStorage.setItem(this.USER_ROLE_KEY, user.role);
    localStorage.setItem(this.LOGGED_IN_KEY, 'true');
    localStorage.setItem(this.USER_EMAIL_KEY, user.email);
    localStorage.setItem(this.USER_NOM_KEY, user.nom);
    
    console.log('[AuthService] login réussi:', { email: user.email, role: user.role });
    return { success: true, user };
  }

  logout(): void {
    localStorage.removeItem(this.USER_ROLE_KEY);
    localStorage.removeItem(this.LOGGED_IN_KEY);
    localStorage.removeItem(this.USER_EMAIL_KEY);
    localStorage.removeItem(this.USER_NOM_KEY);
    console.log('[AuthService] logout: localStorage cleared');
  }

  getUserRole(): 'agent_social' | 'agent_medical' | 'comptable' | 'coordinateur' | null {
    return localStorage.getItem(this.USER_ROLE_KEY) as any;
  }

  getUserEmail(): string | null {
    return localStorage.getItem(this.USER_EMAIL_KEY);
  }

  getUserNom(): string | null {
    return localStorage.getItem(this.USER_NOM_KEY);
  }

  isLoggedIn(): boolean {
    const logged = localStorage.getItem(this.LOGGED_IN_KEY) === 'true';
    console.log('[AuthService] isLoggedIn:', logged);
    return logged;
  }

  // Méthode pour changer le mot de passe
  changePassword(email: string, oldPassword: string, newPassword: string): { success: boolean; error?: string } {
    const user = this.users.find(u => u.email.toLowerCase() === email.toLowerCase());
    
    if (!user) {
      return { success: false, error: 'Utilisateur non trouvé' };
    }
    
    if (user.password !== oldPassword) {
      return { success: false, error: 'Ancien mot de passe incorrect' };
    }
    
    // Mise à jour du mot de passe
    user.password = newPassword;
    console.log('[AuthService] Mot de passe changé pour:', email);
    return { success: true };
  }

  // Méthode pour récupérer les informations de l'utilisateur connecté
  getCurrentUser(): User | null {
    if (!this.isLoggedIn()) return null;
    
    const email = this.getUserEmail();
    if (!email) return null;
    
    return this.users.find(u => u.email === email) || null;
  }

  // Méthode pour obtenir la liste des utilisateurs (pour l'admin)
  getAllUsers(): User[] {
    return this.users.map(u => ({ ...u })); // copie défensive
  }

  // Méthode pour modifier l'email d'un utilisateur
  updateUserEmail(currentEmail: string, newEmail: string): { success: boolean; error?: string } {
    const user = this.users.find(u => u.email.toLowerCase() === currentEmail.toLowerCase());
    if (!user) {
      return { success: false, error: 'Utilisateur non trouvé' };
    }
    if (this.users.some(u => u.email.toLowerCase() === newEmail.toLowerCase())) {
      return { success: false, error: 'Cet email est déjà utilisé' };
    }
    user.email = newEmail;
    return { success: true };
  }

  // Méthode pour modifier le mot de passe d'un utilisateur
  adminChangePassword(email: string, newPassword: string): { success: boolean; error?: string } {
    const user = this.users.find(u => u.email.toLowerCase() === email.toLowerCase());
    if (!user) {
      return { success: false, error: 'Utilisateur non trouvé' };
    }
    user.password = newPassword;
    return { success: true };
  }

  // Inscription d'un nouvel agent (hors coordinateur) avec confirmation email
  register(nom: string, email: string, password: string, role: 'agent_social' | 'agent_medical' | 'comptable'): { success: boolean; error?: string; confirmationToken?: string } {
    if (!nom || !email || !password || !role) {
      return { success: false, error: 'Tous les champs sont obligatoires' };
    }
    if (password.length < 6) {
      return { success: false, error: 'Le mot de passe doit contenir au moins 6 caractères' };
    }
    if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) {
      return { success: false, error: 'Email invalide' };
    }
    if (this.users.some(u => u.email.toLowerCase() === email.toLowerCase())) {
      return { success: false, error: 'Cet email est déjà utilisé' };
    }

    // Générer un token de confirmation unique
    const confirmationToken = this.generateConfirmationToken();
    
    // Créer l'utilisateur avec statut non confirmé
    this.users.push({ 
      nom, 
      email, 
      password, 
      role, 
      isConfirmed: false, 
      confirmationToken,
      createdAt: new Date()
    });

    // Simuler l'envoi d'email de confirmation
    this.sendConfirmationEmail(email, confirmationToken, nom);
    
    return { success: true, confirmationToken };
  }

  // Confirmer un compte avec le token
  confirmAccount(token: string): { success: boolean; error?: string } {
    const user = this.users.find(u => u.confirmationToken === token);
    
    if (!user) {
      return { success: false, error: 'Token de confirmation invalide' };
    }
    
    if (user.isConfirmed) {
      return { success: false, error: 'Ce compte est déjà confirmé' };
    }
    
    // Activer le compte
    user.isConfirmed = true;
    user.confirmationToken = undefined; // Supprimer le token après utilisation
    
    console.log('[AuthService] Compte confirmé:', user.email);
    return { success: true };
  }

  // Renvoyer l'email de confirmation
  resendConfirmationEmail(email: string): { success: boolean; error?: string } {
    const user = this.users.find(u => u.email.toLowerCase() === email.toLowerCase());
    
    if (!user) {
      return { success: false, error: 'Email non trouvé' };
    }
    
    if (user.isConfirmed) {
      return { success: false, error: 'Ce compte est déjà confirmé' };
    }
    
    // Générer un nouveau token
    const newToken = this.generateConfirmationToken();
    user.confirmationToken = newToken;
    
    // Renvoyer l'email
    this.sendConfirmationEmail(email, newToken, user.nom);
    
    return { success: true };
  }

  // Méthodes privées
  private generateConfirmationToken(): string {
    return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
  }

  private sendConfirmationEmail(email: string, token: string, nom: string): void {
    // Simulation d'envoi d'email
    console.log(`[AuthService] Email de confirmation envoyé à ${email}`);
    console.log(`[AuthService] Lien de confirmation: http://localhost:4200/confirm?token=${token}`);
    console.log(`[AuthService] Contenu de l'email:`);
    console.log(`Bonjour ${nom},`);
    console.log(`Votre compte CDEJ a été créé avec succès.`);
    console.log(`Pour activer votre compte, cliquez sur ce lien :`);
    console.log(`http://localhost:4200/confirm?token=${token}`);
    console.log(`Ce lien expire dans 24h.`);
    console.log(`Cordialement, l'équipe CDEJ`);
  }
}
