import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { NavbarComponent } from './components/navbar/navbar.component';
import { FooterComponent } from './components/footer/footer.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, NavbarComponent, FooterComponent],
  template: `
    <app-navbar></app-navbar>
    <router-outlet></router-outlet>
    <app-footer></app-footer>
    
    <!-- WhatsApp Float Button -->
    <a 
      href="https://wa.me/21670123456" 
      class="whatsapp-float" 
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Contactez-nous sur WhatsApp">
      <i class="fab fa-whatsapp"></i>
    </a>

    <!-- ✅ NOUVEAU: Messenger Float Button -->
    <a 
      href="https://m.me/YOUR_PAGE_USERNAME" 
      class="messenger-float" 
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Contactez-nous sur Messenger">
      <i class="fab fa-facebook-messenger"></i>
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

    /* ✅ NOUVEAU: Messenger Float Button */
    .messenger-float {
      position: fixed;
      bottom: 2rem;
      right: 6.5rem; /* Positionné à gauche de WhatsApp */
      width: 60px;
      height: 60px;
      background: linear-gradient(135deg, #00B2FF, #006AFF);
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      color: white;
      font-size: 2rem;
      box-shadow: 
        0 8px 32px rgba(0, 178, 255, 0.4),
        0 0 0 1px rgba(255, 255, 255, 0.1) inset;
      z-index: 999;
      transition: all 0.4s cubic-bezier(0.16, 1, 0.3, 1);
      animation: pulse 2s infinite 0.5s; /* Délai pour alterner l'animation */
      text-decoration: none;
    }

    .messenger-float:hover {
      transform: translateY(-8px) scale(1.1);
      box-shadow: 
        0 16px 48px rgba(0, 178, 255, 0.5),
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
      .messenger-float {
        width: 50px;
        height: 50px;
        font-size: 1.5rem;
        bottom: 1rem;
      }

      .whatsapp-float {
        right: 1rem;
      }

      .messenger-float {
        right: 4.5rem; /* Ajusté pour mobile */
      }
    }

    @media (max-width: 480px) {
      .messenger-float {
        right: 4rem;
      }
    }
  `]
})
export class AppComponent {
  title = 'Agence Immobilière Premium';
}