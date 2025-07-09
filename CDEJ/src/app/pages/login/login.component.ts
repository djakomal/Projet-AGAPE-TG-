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

  constructor(private auth: AuthService, private router: Router) {}

  onSubmit() {
    const result = this.auth.login(this.email, this.password);
    console.log('[LoginComponent] onSubmit:', { email: this.email, result,  });
    if (result) {
      
      this.router.navigateByUrl('dashboard');
      alert('connexion reussi ');
    } else {
      this.error = 'Identifiants invalides';
    }
  }
}
