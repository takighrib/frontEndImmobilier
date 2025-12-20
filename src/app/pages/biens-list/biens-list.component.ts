import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { BienService } from '../../services/bien.service';
import { Bien } from '../../models/bien.model';

@Component({
  selector: 'app-biens-list',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './biens-list.component.html',
  styleUrl: './biens-list.component.css'
})
export class BiensListComponent implements OnInit {
  biens: Bien[] = [];
  loading = true;
  error = '';

  // Filtres
  villeFilter = '';
  prixMaxFilter: number | null = null;
  typeTransactionFilter = '';

  constructor(public bienService: BienService) {}

  ngOnInit(): void {
    this.loadBiens();
  }

  loadBiens(): void {
    this.loading = true;
    this.bienService.getAllBiens().subscribe({
      next: (data) => {
        this.biens = data;
        this.loading = false;
      },
      error: (err) => {
        console.error('Erreur chargement biens:', err);
        this.error = 'Erreur lors du chargement des biens';
        this.loading = false;
      }
    });
  }

  rechercher(): void {
    this.loading = true;
    this.bienService.searchBiens(
      this.villeFilter || undefined,
      this.prixMaxFilter || undefined,
      this.typeTransactionFilter || undefined
    ).subscribe({
      next: (data) => {
        this.biens = data;
        this.loading = false;
      },
      error: (err) => {
        console.error('Erreur recherche:', err);
        this.error = 'Erreur lors de la recherche';
        this.loading = false;
      }
    });
  }

  resetFilters(): void {
    this.villeFilter = '';
    this.prixMaxFilter = null;
    this.typeTransactionFilter = '';
    this.loadBiens();
  }
}
