import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, ActivatedRoute, RouterModule } from '@angular/router';
import { BienService } from '../../services/bien.service';
import { AdminBienService } from '../../services/admin-bien.service';
import { ImageUploadService } from '../../services/image-upload.service';
import { Bien } from '../../models/bien.model';

interface ImageData {
  url: string;
  uploading: boolean;
}

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

    images: ImageData[] = [{ url: '', uploading: false }];
    isEditMode = false;
    bienId: number | null = null;
    loading = false;
    submitting = false;

    constructor(
        private router: Router,
        private route: ActivatedRoute,
        private bienService: BienService,
        private adminBienService: AdminBienService,
        private imageUploadService: ImageUploadService
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
                if (data.images && data.images.length > 0) {
                    // Les URLs sont déjà au bon format depuis la DB
                    this.images = data.images.map((img: any) => ({
                        url: img.urlImage, // Déjà au format /assets/images/xxx.png
                        uploading: false
                    }));
                }
                this.loading = false;
            },
            error: (err) => {
                console.error('Erreur chargement bien:', err);
                alert('Erreur lors du chargement du bien');
                this.router.navigate(['/admin/biens']);
            }
        });
    }

    /**
     * Extrait le nom du fichier depuis l'URL
     * /assets/images/xxx.png -> xxx.png
     */
    extractFilename(url: string): string {
        if (!url) return '';
        
        // Extraire seulement le nom du fichier
        const parts = url.split('/');
        return parts[parts.length - 1];
    }

    onFileSelected(event: Event, index: number): void {
        const input = event.target as HTMLInputElement;
        if (input.files && input.files.length > 0) {
            const file = input.files[0];
            
            // Vérifier le type de fichier
            if (!file.type.startsWith('image/')) {
                alert('Veuillez sélectionner une image');
                return;
            }

            // Vérifier la taille (max 10MB)
            if (file.size > 10 * 1024 * 1024) {
                alert('L\'image ne doit pas dépasser 10MB');
                return;
            }

            this.uploadImage(file, index);
        }
    }

    uploadImage(file: File, index: number): void {
        this.images[index].uploading = true;
        
        this.imageUploadService.uploadImage(file).subscribe({
            next: (response) => {
                // Le backend retourne déjà /assets/images/xxx.png
                this.images[index].url = response.url;
                this.images[index].uploading = false;
                console.log('Image uploadée:', response);
            },
            error: (err) => {
                console.error('Erreur upload:', err);
                alert('Erreur lors de l\'upload de l\'image');
                this.images[index].uploading = false;
            }
        });
    }

    addImage(): void {
        this.images.push({ url: '', uploading: false });
    }

    removeImage(index: number): void {
        const imageUrl = this.images[index].url;
        
        // Si c'est une image uploadée (commence par /assets/images/)
        if (imageUrl && imageUrl.startsWith('/assets/images/')) {
            const filename = this.extractFilename(imageUrl);
            
            console.log('Suppression de l\'image:', filename);
            
            this.imageUploadService.deleteImage(filename).subscribe({
                next: () => console.log('Image supprimée du serveur'),
                error: (err) => console.error('Erreur suppression:', err)
            });
        }
        
        this.images.splice(index, 1);
        
        // Garder au moins un champ d'image
        if (this.images.length === 0) {
            this.images.push({ url: '', uploading: false });
        }
    }

    onSubmit(): void {
        console.log('Images avant soumission:', this.images);
  console.log('Bien envoyé:', JSON.stringify(this.bien));

        // Les URLs sont déjà au bon format /assets/images/xxx.png
        this.bien.images = this.images
            .filter(img => img.url && img.url.trim() !== '')
            .map((img, index) => ({
                urlImage: img.url.trim(), // Déjà au bon format
                ordre: index,
                estPrincipale: index === 0
            }));

        console.log('Images pour la base de données:', this.bien.images);

        // Validation des champs obligatoires
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
