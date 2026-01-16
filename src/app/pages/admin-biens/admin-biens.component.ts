import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { BienService } from '../../services/bien.service';
import { AdminBienService } from '../../services/admin-bien.service';
import { Bien } from '../../models/bien.model';

@Component({
  selector: 'app-admin-biens',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './admin-biens.component.html',
  styleUrl: './admin-biens.component.css'
})
export class AdminBiensComponent implements OnInit {
  biens: Bien[] = [];
  biensFiltered: Bien[] = [];
  loading = true;
  error = '';

  // Filtres
  searchTerm = '';
  filterStatut = '';
  filterType = '';

  constructor(
    private bienService: BienService,
    private adminBienService: AdminBienService
  ) {}

  ngOnInit(): void {
    this.loadBiens();
  }

  loadBiens(): void {
    this.loading = true;
    this.error = '';

    this.bienService.getAllBiens().subscribe({
      next: (data) => {
        this.biens = data;
        this.biensFiltered = data;
        this.loading = false;
      },
      error: (err) => {
        console.error('Erreur chargement biens:', err);
        this.error = 'Erreur lors du chargement des biens';
        this.loading = false;
      }
    });
  }

  filterBiens(): void {
    this.biensFiltered = this.biens.filter(bien => {
      const matchSearch = !this.searchTerm || 
        bien.titre.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        bien.ville.toLowerCase().includes(this.searchTerm.toLowerCase());
      
      const matchStatut = !this.filterStatut || bien.statut === this.filterStatut;
      const matchType = !this.filterType || bien.typeTransaction === this.filterType;

      return matchSearch && matchStatut && matchType;
    });
  }

  updateStatut(bien: Bien): void {
    this.adminBienService.updateBien(bien.id, bien).subscribe({
      next: () => {
        console.log('Statut mis à jour');
      },
      error: (err) => {
        console.error('Erreur mise à jour statut:', err);
        alert('Erreur lors de la mise à jour du statut');
        this.loadBiens();
      }
    });
  }

  toggleFeatured(bien: Bien): void {
    bien.misEnAvant = !bien.misEnAvant;
    
    this.adminBienService.updateBien(bien.id, bien).subscribe({
      next: () => {
        console.log('Mise en avant mise à jour');
      },
      error: (err) => {
        console.error('Erreur toggle featured:', err);
        bien.misEnAvant = !bien.misEnAvant; // Rollback
        alert('Erreur lors de la mise à jour');
      }
    });
  }

  deleteBien(bien: Bien): void {
    if (!confirm(`Êtes-vous sûr de vouloir supprimer "${bien.titre}" ?`)) {
      return;
    }

    this.adminBienService.deleteBien(bien.id).subscribe({
      next: () => {
        this.loadBiens();
      },
      error: (err) => {
        console.error('Erreur suppression bien:', err);
        alert('Erreur lors de la suppression');
      }
    });
  }

  formatPrix(prix: number): string {
    return new Intl.NumberFormat('fr-TN').format(prix);
  }

  get biensVente(): number {
    return this.biens.filter(b => b.typeTransaction === 'VENTE').length;
  }

  get biensLocation(): number {
    return this.biens.filter(b => b.typeTransaction === 'LOCATION').length;
  }
}