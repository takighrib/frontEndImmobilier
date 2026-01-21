import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ImageUploadService {
  private apiUrl = `${environment.apiUrl}/upload`;

  constructor(private http: HttpClient) { }

  uploadImage(file: File): Observable<any> {
    const formData = new FormData();
    formData.append('file', file);
    return this.http.post<any>(`${this.apiUrl}/image`, formData);
  }

  deleteImage(filename: string): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/image`, {
      params: { filename }
    });
  }

  /**
   * Retourne l'URL complète de l'image
   * Les images sont stockées dans /public/images et servies par Angular
   */
  getImageUrl(relativePath: string): string {
    if (!relativePath) return '';
    
    // Si c'est déjà une URL complète (http/https)
    if (relativePath.startsWith('http')) {
      return relativePath;
    }
    
    // Les images dans /public sont servies directement par Angular
    // Exemple: /images/xxx.png est accessible à http://localhost:4200/images/xxx.png
    return relativePath;
  }
}