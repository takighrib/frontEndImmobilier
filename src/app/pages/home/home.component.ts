import { Component, OnInit, AfterViewInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule, ViewportScroller } from '@angular/common';
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
export class HomeComponent implements OnInit, AfterViewInit {
  biensFeatured: Bien[] = [];
  biensRecents: Bien[] = [];
  loading = true;
  error = '';
  
  constructor(
    public bienService: BienService,
    private viewportScroller: ViewportScroller,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    // ✅ Forcer le scroll en haut dès l'initialisation
    this.scrollToTop();
    this.loadBiens();
  }

  ngAfterViewInit(): void {
    // ✅ Double vérification après le rendu de la vue
    setTimeout(() => {
      this.scrollToTop();
      this.cdr.detectChanges();
    }, 0);
  }

  /**
   * ✅ Méthode pour forcer le scroll en haut
   */
  private scrollToTop(): void {
    this.viewportScroller.scrollToPosition([0, 0]);
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
  }

  loadBiens(): void {
    this.loading = true;
    
    // Charger les biens mis en avant
    this.bienService.getBiensFeatured().subscribe({
      next: (data) => {
        this.biensFeatured = data;
        this.loading = false;
        // ✅ Forcer la détection des changements après chargement
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('Erreur chargement biens featured:', err);
        this.error = 'Erreur lors du chargement des biens';
        this.loading = false;
        this.cdr.detectChanges();
      }
    });

    // Charger les biens récents
    this.bienService.getBiensRecents().subscribe({
      next: (data) => {
        this.biensRecents = data;
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('Erreur chargement biens récents:', err);
      }
    });
  }
}