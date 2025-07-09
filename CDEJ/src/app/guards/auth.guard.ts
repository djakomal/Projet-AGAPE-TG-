import { Injectable, inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

// On retire l'export du AuthService
 export { AuthService };

export const AuthGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);
  const logged = authService.isLoggedIn();
  console.log('[AuthGuard] URL:', state.url, 'isLoggedIn:', logged, 'localStorage:', localStorage.getItem('logged_in'));
  if (logged) {
    return true;
  } else {
    router.navigate(['/login']);
    return false;
  }
};
