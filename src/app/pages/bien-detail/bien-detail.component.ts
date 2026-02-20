import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { BienService } from '../../services/bien.service';
import { Bien } from '../../models/bien.model';

@Component({
  selector: 'app-bien-detail',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './bien-detail.component.html',
  styleUrl: './bien-detail.component.css'
})
export class BienDetailComponent implements OnInit, OnDestroy {
  bien: Bien | null = null;
  loading = true;
  error = '';
  currentImageIndex = 0;

  // Lightbox
  lightboxOpen = false;
  lightboxIndex = 0;

  // Description expand/collapse
  descriptionExpanded = false;

  private keydownListener = (e: KeyboardEvent) => {
    if (!this.lightboxOpen) return;
    if (e.key === 'Escape') this.closeLightbox();
    if (e.key === 'ArrowRight') this.lightboxNext();
    if (e.key === 'ArrowLeft') this.lightboxPrev();
  };

  constructor(
    private route: ActivatedRoute,
    public bienService: BienService
  ) {}

  ngOnInit(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    this.loadBien(id);
    document.addEventListener('keydown', this.keydownListener);
  }

  ngOnDestroy(): void {
    document.removeEventListener('keydown', this.keydownListener);
    document.body.style.overflow = '';
  }

  loadBien(id: number): void {
    this.loading = true;
    this.bienService.getBienById(id).subscribe({
      next: (data) => {
        this.bien = data;
        this.loading = false;
      },
      error: (err) => {
        console.error('Erreur chargement bien:', err);
        this.error = 'Bien non trouvé';
        this.loading = false;
      }
    });
  }

  // ── Galerie principale ──────────────────────────────
  nextImage(): void {
    if (this.bien && this.bien.images.length > 0) {
      this.currentImageIndex = (this.currentImageIndex + 1) % this.bien.images.length;
    }
  }

  prevImage(): void {
    if (this.bien && this.bien.images.length > 0) {
      this.currentImageIndex = (this.currentImageIndex - 1 + this.bien.images.length) % this.bien.images.length;
    }
  }

  selectImage(index: number): void {
    this.currentImageIndex = index;
  }

  // ── Lightbox ────────────────────────────────────────
  openLightbox(index: number): void {
    this.lightboxIndex = index;
    this.lightboxOpen = true;
    document.body.style.overflow = 'hidden';
  }

  closeLightbox(): void {
    this.lightboxOpen = false;
    document.body.style.overflow = '';
  }

  lightboxNext(): void {
    if (this.bien) {
      this.lightboxIndex = (this.lightboxIndex + 1) % this.bien.images.length;
    }
  }

  lightboxPrev(): void {
    if (this.bien) {
      this.lightboxIndex = (this.lightboxIndex - 1 + this.bien.images.length) % this.bien.images.length;
    }
  }

  // ── Description toggle ──────────────────────────────
  toggleDescription(): void {
    this.descriptionExpanded = !this.descriptionExpanded;
  }

  // ── Utilitaires ─────────────────────────────────────
  getWhatsAppLink(): string {
    const message = `Bonjour, je suis intéressé par le bien: ${this.bien?.titre}`;
    return `https://wa.me/21670123456?text=${encodeURIComponent(message)}`;
  }
}