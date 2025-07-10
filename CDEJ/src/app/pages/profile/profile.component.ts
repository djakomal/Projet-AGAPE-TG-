import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.css'
})
export class ProfileComponent {
  userRole: string | null = null;
  userEmail: string | null = null;
  userNom: string | null = null;
  
  // Changement de mot de passe
  oldPassword = '';
  newPassword = '';
  confirmPassword = '';
  passwordError = '';
  passwordSuccess = '';
  isChangingPassword = false;
  showPasswordForm = false;

  constructor(private auth: AuthService) {
    this.userRole = this.auth.getUserRole();
    this.userEmail = this.auth.getUserEmail();
    this.userNom = this.auth.getUserNom();
  }

  changePassword() {
    if (!this.oldPassword || !this.newPassword || !this.confirmPassword) {
      this.passwordError = 'Veuillez remplir tous les champs';
      return;
    }

    if (this.newPassword !== this.confirmPassword) {
      this.passwordError = 'Les nouveaux mots de passe ne correspondent pas';
      return;
    }

    if (this.newPassword.length < 6) {
      this.passwordError = 'Le nouveau mot de passe doit contenir au moins 6 caractères';
      return;
    }

    this.isChangingPassword = true;
    this.passwordError = '';
    this.passwordSuccess = '';

    // Simulation d'un délai réseau
    setTimeout(() => {
      const result = this.auth.changePassword(this.userEmail!, this.oldPassword, this.newPassword);
      
      if (result.success) {
        this.passwordSuccess = 'Mot de passe changé avec succès !';
        this.oldPassword = '';
        this.newPassword = '';
        this.confirmPassword = '';
        this.showPasswordForm = false;
      } else {
        this.passwordError = result.error || 'Erreur lors du changement de mot de passe';
      }
      
      this.isChangingPassword = false;
    }, 1000);
  }

  togglePasswordForm() {
    this.showPasswordForm = !this.showPasswordForm;
    this.passwordError = '';
    this.passwordSuccess = '';
    this.oldPassword = '';
    this.newPassword = '';
    this.confirmPassword = '';
  }

  getRoleDisplayName(role: string | null): string {
    switch (role) {
      case 'coordinateur': return 'Coordinateur';
      case 'agent_social': return 'Agent Social';
      case 'agent_medical': return 'Agent Médical';
      case 'comptable': return 'Comptable';
      default: return 'Utilisateur';
    }
  }

  clearMessages() {
    this.passwordError = '';
    this.passwordSuccess = '';
  }
}
