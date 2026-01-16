import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, ActivatedRoute, RouterModule } from '@angular/router';
import { BienService } from '../../services/bien.service';
import { AdminBienService } from '../../services/admin-bien.service';
import { Bien } from '../../models/bien.model';

@Component({
    selector: 'app-admin-bien-form',
    standalone: true,
    imports: [CommonModule, FormsModule, RouterModule],
    templateUrl: './admin-bien-form.component.html',
    styleUrl: './admin-bien-form.component.css'
})
export class AdminBienFormComponent implements OnInit {
    bien: Partial<Bien> = {
        titre: '',
        description: '',
        adresse: '',
        ville: '',
        codePostal: '',
        quartier: '',
        surface: 0,
        prix: 0,

        statut: 'DISPONIBLE',
        typeTransaction: 'VENTE',
        misEnAvant: false,
        images: [],
        // Propriétés optionnelles
        nombrePieces: undefined,
        nombreChambres: undefined,
        nombreSallesBain: undefined,
        jardin: false,
        garage: false,
        longitude: 0,
        latitude: 0,
        piscine: false,
        climatisation: false,
        parking: false,
        balcon: false,
        meuble: false,
        ascenseur: false,

    };

    imageUrls: string[] = [''];
    isEditMode = false;
    bienId: number | null = null;
    loading = false;
    submitting = false;

    constructor(
        private router: Router,
        private route: ActivatedRoute,
        private bienService: BienService,
        private adminBienService: AdminBienService
    ) { }

    ngOnInit(): void {
        const id = this.route.snapshot.paramMap.get('id');
        if (id) {
            this.isEditMode = true;
            this.bienId = Number(id);
            this.loadBien();
        }
    }

    loadBien(): void {
    if (!this.bienId) return;

    this.loading = true;
    this.bienService.getBienById(this.bienId).subscribe({
        next: (data) => {
            this.bien = data;
            // On extrait uniquement les urlImage dans imageUrls (string[])
            this.imageUrls = data.images && data.images.length > 0
                ? data.images.map((img: any) => img.urlImage)
                : [''];
            this.loading = false;
        },
        error: (err) => {
            console.error('Erreur chargement bien:', err);
            alert('Erreur lors du chargement du bien');
            this.router.navigate(['/admin/biens']);
        }
    });
}


    addImageUrl(): void {
        this.imageUrls.push('');
    }

    removeImageUrl(index: number): void {
        this.imageUrls.splice(index, 1);
    }

    onSubmit(): void {
  // Debug : vérifier imageUrls
  console.log('imageUrls:', this.imageUrls);

  // Transformer imageUrls (string[]) en ImageBien[]
  this.bien.images = this.imageUrls
    .filter(url => typeof url === 'string' && url.trim() !== '')
    .map((url, index) => ({
      urlImage: url.trim(),
      ordre: index,
      estPrincipale: index === 0 // La première image est principale par exemple
    }));

  // Validation basique des champs obligatoires
  if (
    !this.bien.titre ||
    !this.bien.ville ||
    !this.bien.adresse ||
    !this.bien.surface ||
    !this.bien.prix
  ) {
    alert('Veuillez remplir tous les champs obligatoires');
    return;
  }

  this.submitting = true;

  if (this.isEditMode && this.bienId != null) {
    this.adminBienService.updateBien(this.bienId, this.bien as Bien).subscribe({
      next: () => {
        alert('Bien mis à jour avec succès !');
        this.router.navigate(['/admin/biens']);
      },
      error: (err) => {
        console.error('Erreur mise à jour:', err);
        alert('Erreur lors de la mise à jour du bien');
        this.submitting = false;
      }
    });
  } else {
    this.adminBienService.createBien(this.bien as Bien).subscribe({
      next: () => {
        alert('Bien créé avec succès !');
        this.router.navigate(['/admin/biens']);
      },
      error: (err) => {
        console.error('Erreur création:', err);
        alert('Erreur lors de la création du bien');
        this.submitting = false;
      }
    });
  }
}


}