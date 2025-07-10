import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './register.component.html',
  styleUrl: './register.component.css'
})
export class RegisterComponent {
  nom = '';
  email = '';
  password = '';
  confirmPassword = '';
  role: 'agent_social' | 'agent_medical' | 'comptable' | '' = '';
  error = '';
  success = '';
  isLoading = false;

  constructor(private auth: AuthService, private router: Router) {}

  onSubmit() {
    this.error = '';
    this.success = '';
    if (!this.nom || !this.email || !this.password || !this.confirmPassword || !this.role) {
      this.error = 'Tous les champs sont obligatoires';
      return;
    }
    if (this.password !== this.confirmPassword) {
      this.error = 'Les mots de passe ne correspondent pas';
      return;
    }
    if (this.password.length < 6) {
      this.error = 'Le mot de passe doit contenir au moins 6 caractères';
      return;
    }
    if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(this.email)) {
      this.error = 'Email invalide';
      return;
    }
    this.isLoading = true;
    setTimeout(() => {
      const res = this.auth.register(this.nom, this.email, this.password, this.role as 'agent_social' | 'agent_medical' | 'comptable');
      if (res.success) {
        this.success = `Compte créé avec succès ! Un email de confirmation a été envoyé à ${this.email}. Vérifiez votre boîte de réception et cliquez sur le lien pour activer votre compte.`;
        // Ne pas rediriger automatiquement, laisser l'utilisateur lire le message
      } else {
        this.error = res.error || 'Erreur lors de la création du compte';
      }
      this.isLoading = false;
    }, 1000);
  }

  clearMessages() {
    this.error = '';
    this.success = '';
  }
} 