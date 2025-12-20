import { Component, OnInit } from '@angular/core';
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
export class BienDetailComponent implements OnInit {
  bien: Bien | null = null;
  loading = true;
  error = '';
  currentImageIndex = 0;

  constructor(
    private route: ActivatedRoute,
    public bienService: BienService
  ) {}

  ngOnInit(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    this.loadBien(id);
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

  getWhatsAppLink(): string {
    const message = `Bonjour, je suis intéressé par le bien: ${this.bien?.titre}`;
    return `https://wa.me/21670123456?text=${encodeURIComponent(message)}`;
  }
}