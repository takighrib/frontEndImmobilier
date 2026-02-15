import { Component, OnInit } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { RouterOutlet } from '@angular/router';
import { NavbarComponent } from './components/navbar/navbar.component';
import { FooterComponent } from './components/footer/footer.component';
import { filter } from 'rxjs/operators';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, NavbarComponent, FooterComponent, CommonModule],
  template: `
    <app-navbar></app-navbar>
    <router-outlet></router-outlet>
    <app-footer></app-footer>
    
    <!-- WhatsApp Float Button avec message dynamique -->
    <a 
      [href]="whatsappLink" 
      class="whatsapp-float" 
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Contactez-nous sur WhatsApp">
      <i class="fab fa-whatsapp"></i>
    </a>

    <!-- Instagram Float Button -->
    <a 
      [href]="instagramLink" 
      class="instagram-float" 
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Suivez-nous sur Instagram">
      <i class="fab fa-instagram"></i>
    </a>
  `,
  styles: [`
    :host {
      display: flex;
      flex-direction: column;
      min-height: 100vh;
    }

    /* WhatsApp Float Button */
    .whatsapp-float {
      position: fixed;
      bottom: 2rem;
      right: 2rem;
      width: 60px;
      height: 60px;
      background: linear-gradient(135deg, #25D366, #128c7e);
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      color: white;
      font-size: 2rem;
      box-shadow: 
        0 8px 32px rgba(37, 211, 102, 0.4),
        0 0 0 1px rgba(255, 255, 255, 0.1) inset;
      z-index: 999;
      transition: all 0.4s cubic-bezier(0.16, 1, 0.3, 1);
      animation: pulse 2s infinite;
      text-decoration: none;
    }

    .whatsapp-float:hover {
      transform: translateY(-8px) scale(1.1);
      box-shadow: 
        0 16px 48px rgba(37, 211, 102, 0.5),
        0 0 0 1px rgba(255, 255, 255, 0.2) inset;
    }

    /* Instagram Float Button */
    .instagram-float {
      position: fixed;
      bottom: 2rem;
      right: 6.5rem;
      width: 60px;
      height: 60px;
      background: linear-gradient(135deg, #f09433 0%, #e6683c 25%, #dc2743 50%, #cc2366 75%, #bc1888 100%);
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      color: white;
      font-size: 2rem;
      box-shadow: 
        0 8px 32px rgba(225, 48, 108, 0.4),
        0 0 0 1px rgba(255, 255, 255, 0.1) inset;
      z-index: 999;
      transition: all 0.4s cubic-bezier(0.16, 1, 0.3, 1);
      animation: pulse 2s infinite 0.5s;
      text-decoration: none;
    }

    .instagram-float:hover {
      transform: translateY(-8px) scale(1.1);
      box-shadow: 
        0 16px 48px rgba(225, 48, 108, 0.5),
        0 0 0 1px rgba(255, 255, 255, 0.2) inset;
    }

    @keyframes pulse {
      0%, 100% {
        transform: scale(1);
      }
      50% {
        transform: scale(1.05);
      }
    }

    @media (max-width: 768px) {
      .whatsapp-float,
      .instagram-float {
        width: 50px;
        height: 50px;
        font-size: 1.5rem;
        bottom: 1rem;
      }

      .whatsapp-float {
        right: 1rem;
      }

      .instagram-float {
        right: 4.5rem;
      }
    }

    @media (max-width: 480px) {
      .instagram-float {
        right: 4rem;
      }
    }
  `]
})
export class AppComponent implements OnInit {
  title = 'Hajri Immo - Agence Immobilière';
  
  // ========================================
  // 📱 CONFIGURATION WHATSAPP
  // ========================================
  private whatsappNumber = '21628195645'; // ✅ Votre vrai numéro WhatsApp
  
  // ========================================
  // 📸 CONFIGURATION INSTAGRAM
  // ========================================
  private instagramUsername = 'fedy_hajri_10'; // ✅ Votre compte Instagram
  
  // Liens dynamiques
  whatsappLink = '';
  instagramLink = '';
  
  // Message par défaut
  private defaultMessage = 'Bonjour, je souhaite obtenir des informations sur vos biens immobiliers.';
  
  constructor(private router: Router) {
    // Initialiser les liens
    this.updateLinks(this.defaultMessage);
  }
  
  ngOnInit(): void {
    // Écouter les changements de route pour adapter les messages
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe((event: any) => {
      this.updateLinksBasedOnRoute(event.url);
    });
  }
  
  /**
   * Met à jour les liens selon la route active
   */
  private updateLinksBasedOnRoute(url: string): void {
    let message = this.defaultMessage;
    
    // Page d'accueil
    if (url === '/' || url === '') {
      message = 'Bonjour, je visite votre site Hajri Immo et j\'aimerais obtenir des informations.';
    }
    // Page de détail d'un bien
    else if (url.includes('/bien/')) {
      const bienId = url.split('/bien/')[1]?.split('?')[0];
      message = `Bonjour, je suis intéressé(e) par le bien référence #${bienId} sur votre site Hajri Immo. Pouvez-vous me donner plus d'informations ?`;
    }
    // Page liste des biens
    else if (url.includes('/biens')) {
      message = 'Bonjour, je consulte vos biens sur Hajri Immo. Pouvez-vous m\'aider dans ma recherche ?';
    }
    // Page contact
    else if (url.includes('/contact')) {
      message = 'Bonjour, je souhaite vous contacter via votre site Hajri Immo pour discuter de mes besoins immobiliers.';
    }
    // Page à propos
    else if (url.includes('/about')) {
      message = 'Bonjour, j\'aimerais en savoir plus sur Hajri Immo et vos services.';
    }
    
    this.updateLinks(message);
  }
  
  /**
   * Génère les liens WhatsApp et Instagram
   */
  private updateLinks(message: string): void {
    // WhatsApp avec message pré-rempli
    this.whatsappLink = `https://wa.me/${this.whatsappNumber}?text=${encodeURIComponent(message)}`;
    
    // Instagram - Lien vers le profil
    this.instagramLink = `https://www.instagram.com/${this.instagramUsername}/`;
  }
}