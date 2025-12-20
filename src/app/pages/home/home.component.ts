import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { BienService } from '../../services/bien.service';
import { Bien } from '../../models/bien.model';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent implements OnInit {
  biensFeatured: Bien[] = [];
  biensRecents: Bien[] = [];
  loading = true;
  error = '';

  constructor(public bienService: BienService) {}

  ngOnInit(): void {
    this.loadBiens();
  }

  loadBiens(): void {
    this.loading = true;
    
    // Charger les biens mis en avant
    this.bienService.getBiensFeatured().subscribe({
      next: (data) => {
        this.biensFeatured = data;
        this.loading = false;
      },
      error: (err) => {
        console.error('Erreur chargement biens featured:', err);
        this.error = 'Erreur lors du chargement des biens';
        this.loading = false;
      }
    });

    // Charger les biens récents
    this.bienService.getBiensRecents().subscribe({
      next: (data) => {
        this.biensRecents = data;
      },
      error: (err) => {
        console.error('Erreur chargement biens récents:', err);
      }
    });
  }
}
