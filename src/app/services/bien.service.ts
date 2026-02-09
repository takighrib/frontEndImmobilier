import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Bien } from '../models/bien.model';

@Injectable({
  providedIn: 'root'
})
export class BienService {
  private apiUrl = '/api/biens';

  constructor(private http: HttpClient) { }

  /**
   * Récupérer tous les biens
   */
  getAllBiens(): Observable<Bien[]> {
    return this.http.get<Bien[]>(this.apiUrl);
  }

  /**
   * Récupérer un bien par ID
   */
  getBienById(id: number): Observable<Bien> {
    return this.http.get<Bien>(`${this.apiUrl}/${id}`);
  }

  /**
   * Récupérer les biens mis en avant
   */
  getBiensFeatured(): Observable<Bien[]> {
    return this.http.get<Bien[]>(`${this.apiUrl}/featured`);
  }

  /**
   * Récupérer les biens récents
   */
  getBiensRecents(): Observable<Bien[]> {
    return this.http.get<Bien[]>(`${this.apiUrl}/recents`);
  }

  /**
   * Rechercher des biens avec filtres
   */
  searchBiens(ville?: string, prixMax?: number, typeTransaction?: string): Observable<Bien[]> {
    let params = new HttpParams();
    
    if (ville) {
      params = params.set('ville', ville);
    }
    if (prixMax) {
      params = params.set('prixMax', prixMax.toString());
    }
    if (typeTransaction) {
      params = params.set('typeTransaction', typeTransaction);
    }

    return this.http.get<Bien[]>(`${this.apiUrl}/search`, { params });
  }

  /**
   * Formater le prix
   */
  formatPrix(prix: number): string {
    return new Intl.NumberFormat('fr-TN', {
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(prix);
  }

  /**
   * Obtenir l'image principale
   */
 getImagePrincipale(bien: Bien): string {
  if (!bien.images || bien.images.length === 0) {
    return 'assets/placeholder.jpg';
  }
  return bien.images[0].urlImage;
}
}
