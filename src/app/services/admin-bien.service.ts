import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Bien } from '../models/bien.model';

@Injectable({
  providedIn: 'root'
})
export class AdminBienService {
  private apiUrl = 'http://localhost:8080/api/biens';

  constructor(private http: HttpClient) {}

  createBien(bien: Bien): Observable<Bien> {
    return this.http.post<Bien>(this.apiUrl, bien);
  }

  updateBien(id: number, bien: Bien): Observable<Bien> {
    return this.http.put<Bien>(`${this.apiUrl}/${id}`, bien);
  }

  deleteBien(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  toggleMisEnAvant(id: number): Observable<Bien> {
    return this.http.put<Bien>(`${this.apiUrl}/${id}/toggle-featured`, {});
  }
}