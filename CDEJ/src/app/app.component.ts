import { Component, OnInit } from '@angular/core';
import { RouterOutlet, Router, NavigationEnd } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, CommonModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent implements OnInit {
  title = 'CDEJ';
  showFallback = false;

  constructor(private router: Router) {
    console.log('🚀 AppComponent - Constructor appelé');
  }

  ngOnInit() {
    console.log('🟢 AppComponent - ngOnInit appelé');
    console.log('📍 URL actuelle:', window.location.href);
    
    // Activer le fallback après 3 secondes si pas de navigation
    setTimeout(() => {
      if (window.location.pathname === '/' || window.location.pathname === '') {
        console.log('⚠️ Aucune navigation détectée, activation du fallback');
        this.showFallback = true;
      }
    }, 3000);
    
    this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        console.log('🔄 Navigation terminée vers:', event.url);
        this.showFallback = false;
      }
    });
  }

  getCurrentUrl(): string {
    return window.location.href;
  }

  navigateToLogin() {
    console.log('🔑 Navigation manuelle vers login');
    this.router.navigate(['/login']).catch(err => {
      console.error('❌ Erreur navigation vers login:', err);
    });
  }

  forceLogin() {
    console.log('🔧 Force redirection vers login');
    window.location.href = '/login';
  }
}
