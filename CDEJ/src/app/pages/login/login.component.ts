import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
  email = '';
  password = '';
  error = '';
  success = '';
  isLoading = false;
  showPassword = false;
  
  // Renvoi email confirmation
  showResendForm = false;
  resendEmail = '';
  resendMessage = '';
  resendSuccess = false;

  constructor(private auth: AuthService, private router: Router) {}

  onSubmit() {
    if (!this.email || !this.password) {
      this.error = 'Veuillez remplir tous les champs';
      return;
    }

    this.isLoading = true;
    this.error = '';
    this.success = '';

    // Simulation d'un délai réseau
    setTimeout(() => {
    const result = this.auth.login(this.email, this.password);
      
      if (result.success) {
        this.success = `Connexion réussie ! Bienvenue ${result.user?.nom}`;
        this.isLoading = false;
        
        // Redirection automatique après 1.5 secondes
        setTimeout(() => {
          this.router.navigateByUrl('/dashboard');
        }, 1500);
    } else {
        this.error = result.error || 'Erreur de connexion';
        this.isLoading = false;
      }
    }, 1000);
  }

  togglePasswordVisibility() {
    this.showPassword = !this.showPassword;
  }

  clearError() {
    this.error = '';
  }

  clearSuccess() {
    this.success = '';
  }

  // Méthode pour tester les comptes rapidement
  fillTestAccount(role: string) {
    switch (role) {
      case 'coordinateur':
        this.email = 'coordinateur@cdej.com';
        this.password = 'coord123';
        break;
      case 'social':
        this.email = 'social@cdej.com';
        this.password = 'social123';
        break;
      case 'medical':
        this.email = 'medical@cdej.com';
        this.password = 'medical123';
        break;
      case 'comptable':
        this.email = 'comptable@cdej.com';
        this.password = 'comptable123';
        break;
    }
    this.clearError();
    this.clearSuccess();
  }

  goToRegister() {
    this.router.navigate(['/register']);
  }

  resendConfirmation() {
    if (!this.resendEmail) {
      this.resendMessage = 'Veuillez saisir votre email';
      this.resendSuccess = false;
      return;
    }
    
    const result = this.auth.resendConfirmationEmail(this.resendEmail);
    if (result.success) {
      this.resendMessage = `Un nouvel email de confirmation a été envoyé à ${this.resendEmail}`;
      this.resendSuccess = true;
      this.showResendForm = false;
    } else {
      this.resendMessage = result.error || 'Erreur lors du renvoi';
      this.resendSuccess = false;
    }
  }
}
