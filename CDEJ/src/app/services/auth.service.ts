import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly USER_ROLE_KEY = 'user_role';
  private readonly LOGGED_IN_KEY = 'logged_in';

  login(email: string, password: string): boolean {
    // Simulation : login toujours OK, rôle selon l'email
    let role: 'agent_social' | 'agent_medical' | 'comptable' | 'coordinateur' = 'agent_social';
    if (email.includes('medical')) role = 'agent_medical';
    else if (email.includes('comptable')) role = 'comptable';
    else if (email.includes('coord')) role = 'coordinateur';
   
    localStorage.setItem(this.USER_ROLE_KEY, role);
    localStorage.setItem(this.LOGGED_IN_KEY, 'true');
    // console.log('[AuthService] login:', { role, logged_in: true });
    return true;
  }

  logout(): void {
    localStorage.removeItem(this.USER_ROLE_KEY);
    localStorage.removeItem(this.LOGGED_IN_KEY);
    console.log('[AuthService] logout: localStorage cleared');
  }

  getUserRole(): 'agent_social' | 'agent_medical' | 'comptable' | 'coordinateur' | null {
    return localStorage.getItem(this.USER_ROLE_KEY) as any;
  }

  isLoggedIn(): boolean {
    const logged = localStorage.getItem(this.LOGGED_IN_KEY) === 'true';
    console.log('[AuthService] isLoggedIn:', logged, 'localStorage:', localStorage.getItem(this.LOGGED_IN_KEY));
    return logged;
  }
}
