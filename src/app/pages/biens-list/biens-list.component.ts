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
  
  // État de la sidebar
  isFilterSidebarOpen = false;

  // Filtres de base
  villeFilter = '';
  prixMinFilter: number | null = null;
  prixMaxFilter: number | null = null;
  typeTransactionFilter = '';
  surfaceMinFilter: number | null = null;
  surfaceMaxFilter: number | null = null;
  nombreChambresFilter: number | null = null;
  
  // Filtres équipements
  jardinFilter = false;
  garageFilter = false;
  piscineFilter = false;
  parkingFilter = false;
  climatisationFilter = false;
  meubleFilter = false;
  // ✅ Ajouts manquants
  balconFilter = false;
  ascenseurFilter = false;
  gardienFilter = false;
  securiteFilter = false;
  viabiliseFilter = false;

  constructor(public bienService: BienService) {}

  ngOnInit(): void {
    this.loadBiens();
  }

loadBiens(): void {
  this.loading = true;
  this.bienService.getAllBiens().subscribe({
    next: (data) => {
      this.biens = data.map(bien => ({
        ...bien,
        jardin: bien.jardin ?? false,
        garage: bien.garage ?? false,
        piscine: bien.piscine ?? false,
        climatisation: bien.climatisation ?? false,
        parking: bien.parking ?? false,
        balcon: bien.balcon ?? false,
        meuble: bien.meuble ?? false,
        ascenseur: bien.ascenseur ?? false,
        gardien: bien.gardien ?? false,
        securite: bien.securite ?? false,
        viabilise: bien.viabilise ?? false,
      }));
      this.loading = false;
    },
    // ...
  });
}

  toggleFilterSidebar(): void {
    this.isFilterSidebarOpen = !this.isFilterSidebarOpen;
    document.body.style.overflow = this.isFilterSidebarOpen ? 'hidden' : '';
  }

  closeFilterSidebar(): void {
    this.isFilterSidebarOpen = false;
    document.body.style.overflow = '';
  }

  rechercher(): void {
    this.loading = true;
    this.closeFilterSidebar();
    
    this.bienService.searchBiens(
      this.villeFilter || undefined,
      this.prixMaxFilter || undefined,
      this.typeTransactionFilter || undefined
    ).subscribe({
    next: (data) => {
  const filtered = this.applyAdvancedFilters(data);
  this.biens = filtered.map(bien => ({
    ...bien,
    jardin: bien.jardin ?? false,
    garage: bien.garage ?? false,
    piscine: bien.piscine ?? false,
    climatisation: bien.climatisation ?? false,
    parking: bien.parking ?? false,
    balcon: bien.balcon ?? false,
    meuble: bien.meuble ?? false,
    ascenseur: bien.ascenseur ?? false,
    gardien: bien.gardien ?? false,
    securite: bien.securite ?? false,
    viabilise: bien.viabilise ?? false,
  }));
  this.loading = false;
},
      error: (err) => {
        console.error('Erreur recherche:', err);
        this.error = 'Erreur lors de la recherche';
        this.loading = false;
      }
    });
  }

  applyAdvancedFilters(biens: Bien[]): Bien[] {
    return biens.filter(bien => {
      // Filtres numériques
      if (this.prixMinFilter && bien.prix < this.prixMinFilter) return false;
      if (this.surfaceMinFilter && bien.surface < this.surfaceMinFilter) return false;
      if (this.surfaceMaxFilter && bien.surface > this.surfaceMaxFilter) return false;
      if (this.nombreChambresFilter && bien.nombreChambres !== this.nombreChambresFilter) return false;
      
      // Filtres équipements
      if (this.jardinFilter && !bien.jardin) return false;
      if (this.garageFilter && !bien.garage) return false;
      if (this.piscineFilter && !bien.piscine) return false;
      if (this.parkingFilter && !bien.parking) return false;
      if (this.climatisationFilter && !bien.climatisation) return false;
      if (this.meubleFilter && !bien.meuble) return false;
      // ✅ Ajouts manquants
      if (this.balconFilter && !bien.balcon) return false;
      if (this.ascenseurFilter && !bien.ascenseur) return false;
      if (this.gardienFilter && !bien.gardien) return false;
      if (this.securiteFilter && !bien.securite) return false;
      if (this.viabiliseFilter && !bien.viabilise) return false;
      
      return true;
    });
  }

  resetFilters(): void {
    this.villeFilter = '';
    this.prixMinFilter = null;
    this.prixMaxFilter = null;
    this.typeTransactionFilter = '';
    this.surfaceMinFilter = null;
    this.surfaceMaxFilter = null;
    this.nombreChambresFilter = null;
    this.jardinFilter = false;
    this.garageFilter = false;
    this.piscineFilter = false;
    this.parkingFilter = false;
    this.climatisationFilter = false;
    this.meubleFilter = false;
    // ✅ Ajouts manquants
    this.balconFilter = false;
    this.ascenseurFilter = false;
    this.gardienFilter = false;
    this.securiteFilter = false;
    this.viabiliseFilter = false;
    this.loadBiens();
  }

  get activeFiltersCount(): number {
    let count = 0;
    if (this.villeFilter) count++;
    if (this.prixMinFilter) count++;
    if (this.prixMaxFilter) count++;
    if (this.typeTransactionFilter) count++;
    if (this.surfaceMinFilter) count++;
    if (this.surfaceMaxFilter) count++;
    if (this.nombreChambresFilter) count++;
    if (this.jardinFilter) count++;
    if (this.garageFilter) count++;
    if (this.piscineFilter) count++;
    if (this.parkingFilter) count++;
    if (this.climatisationFilter) count++;
    if (this.meubleFilter) count++;
    // ✅ Ajouts manquants
    if (this.balconFilter) count++;
    if (this.ascenseurFilter) count++;
    if (this.gardienFilter) count++;
    if (this.securiteFilter) count++;
    if (this.viabiliseFilter) count++;
    return count;
  }
}