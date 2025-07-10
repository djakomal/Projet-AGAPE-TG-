import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-confirm',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './confirm.component.html',
  styleUrl: './confirm.component.css'
})
export class ConfirmComponent implements OnInit {
  token: string = '';
  isLoading = true;
  success = false;
  error = '';
  message = '';

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private auth: AuthService
  ) {}

  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      this.token = params['token'] || '';
      if (this.token) {
        this.confirmAccount();
      } else {
        this.error = 'Token de confirmation manquant';
        this.isLoading = false;
      }
    });
  }

  confirmAccount() {
    setTimeout(() => {
      const result = this.auth.confirmAccount(this.token);
      if (result.success) {
        this.success = true;
        this.message = 'Votre compte a été activé avec succès ! Vous pouvez maintenant vous connecter.';
      } else {
        this.error = result.error || 'Erreur lors de la confirmation du compte';
      }
      this.isLoading = false;
    }, 1000);
  }

  goToLogin() {
    this.router.navigate(['/login']);
  }
} 