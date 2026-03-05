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
          console.group(`🏠 Bien #${data.id} — ${data.titre}`);
      console.log('📋 Type bien:',        data.typeBien);
      console.log('🔄 Transaction:',      data.typeTransaction);
      console.log('📍 Localisation:',     `${data.adresse}, ${data.ville} ${data.codePostal}`);
      console.log('💰 Prix:',             data.prix, 'DT');
      console.log('📐 Surface:',          data.surface, 'm²');
      console.log('🏷️  Statut:',          data.statut);
      console.log('⭐ Mis en avant:',     data.misEnAvant);

      console.group('🛏️  Caractéristiques');
      console.log('Pièces:',              data.nombrePieces ?? 'N/A');
      console.log('Chambres:',            data.nombreChambres ?? 'N/A');
      console.log('Salles de bain:',      data.nombreSallesBain ?? 'N/A');
      console.log('Étage:',              (data as any).etage ?? 'N/A');
      console.log('Nombre étages:',      (data as any).nombreEtages ?? 'N/A');
      console.groupEnd();

      console.group('🔧 Équipements');
      console.log('Jardin:',              data.jardin       ?? false);
      console.log('Garage:',              data.garage       ?? false);
      console.log('Piscine:',             data.piscine      ?? false);
      console.log('Climatisation:',       data.climatisation ?? false);
      console.log('Parking:',             data.parking      ?? false);
      console.log('Balcon:',              data.balcon       ?? false);
      console.log('Meublé:',             data.meuble       ?? false);
      console.log('Ascenseur:',           (data as any).ascenseur ?? false);
      console.log('Gardien:',             (data as any).gardien   ?? false);
      console.groupEnd();

      console.group(`🖼️  Images (${data.images?.length ?? 0})`);
      data.images?.forEach((img: any, i: number) => {
        console.log(`  [${i}] ${img.urlImage} — principale: ${img.estPrincipale}`);
      });
      console.groupEnd();

      console.log('📦 Objet complet:', data);
      console.groupEnd();
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
    return `https://wa.me/21628195645?text=${encodeURIComponent(message)}`;
  }
}