import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-about',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './about.component.html',
  styleUrl: './about.component.css'
})
export class AboutComponent {
  stats = [
    { number: '500+', label: 'Biens vendus', icon: 'fa-home' },
    { number: '1000+', label: 'Clients satisfaits', icon: 'fa-users' },
    { number: '10+', label: 'Années d\'expérience', icon: 'fa-calendar' },
    { number: '50+', label: 'Partenaires', icon: 'fa-handshake' }
  ];

  services = [
    {
      icon: 'fa-search',
      title: 'Recherche Personnalisée',
      description: 'Nous vous aidons à trouver le bien qui correspond exactement à vos critères et votre budget.'
    },
    {
      icon: 'fa-file-contract',
      title: 'Accompagnement Juridique',
      description: 'Notre équipe vous accompagne dans toutes les démarches administratives et juridiques.'
    },
    {
      icon: 'fa-calculator',
      title: 'Estimation Gratuite',
      description: 'Profitez d\'une estimation précise et gratuite de votre bien immobilier.'
    },
    {
      icon: 'fa-key',
      title: 'Gestion Locative',
      description: 'Confiez-nous la gestion de vos biens en location en toute sérénité.'
    }
  ];

  values = [
    {
      icon: 'fa-shield-alt',
      title: 'Confiance',
      description: 'Transparence totale dans toutes nos transactions'
    },
    {
      icon: 'fa-award',
      title: 'Excellence',
      description: 'Un service de qualité supérieure à chaque étape'
    },
    {
      icon: 'fa-heart',
      title: 'Engagement',
      description: 'Votre satisfaction est notre priorité absolue'
    },
    {
      icon: 'fa-lightbulb',
      title: 'Innovation',
      description: 'Des solutions modernes pour vos projets immobiliers'
    }
  ];
}
