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
  `,
  styles: [`
    :host {
      display: flex;
      flex-direction: column;
      min-height: 100vh;
    }

    router-outlet {
      display: none;
    }

    .whatsapp-float {
      position: fixed;
      bottom: 2rem;
      right: 2rem;
      width: 60px;
      height: 60px;
      background: #25D366;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      color: white;
      font-size: 2rem;
      box-shadow: 0 4px 15px rgba(37, 211, 102, 0.4);
      z-index: 999;
      transition: all 0.3s ease;
      animation: pulse 2s infinite;
      text-decoration: none;
    }

    .whatsapp-float:hover {
      transform: scale(1.1);
      box-shadow: 0 6px 20px rgba(37, 211, 102, 0.6);
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
      .whatsapp-float {
        width: 50px;
        height: 50px;
        font-size: 1.5rem;
        bottom: 1rem;
        right: 1rem;
      }
    }
  `]
})
export class AppComponent {
  title = 'Agence Immobilière Premium';
}
