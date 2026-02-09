import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject, tap, catchError, of, map } from 'rxjs';

export interface LoginRequest {
  username: string;
  password: string;
}

export interface LoginResponse {
  id: number;
  username: string;
  nom: string;
  prenom: string;
  email: string;
  token: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = '/api/auth';
  private currentUserSubject = new BehaviorSubject<LoginResponse | null>(this.getUserFromStorage());
  public currentUser$ = this.currentUserSubject.asObservable();

  constructor(private http: HttpClient) {}

  login(credentials: LoginRequest): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(`${this.apiUrl}/login`, credentials)
      .pipe(
        tap(response => {
          localStorage.setItem('adminUser', JSON.stringify(response));
          localStorage.setItem('adminToken', response.token);
          this.currentUserSubject.next(response);
        })
      );
  }

  logout(): void {
    localStorage.removeItem('adminUser');
    localStorage.removeItem('adminToken');
    this.currentUserSubject.next(null);
  }

  getCurrentUser(): LoginResponse | null {
    return this.currentUserSubject.value;
  }

  getToken(): string | null {
    return localStorage.getItem('adminToken');
  }

  isAuthenticated(): boolean {
    return this.getToken() !== null;
  }

  private getUserFromStorage(): LoginResponse | null {
    const userJson = localStorage.getItem('adminUser');
    return userJson ? JSON.parse(userJson) : null;
  }

  // ✅ NOUVELLE MÉTHODE - Valider le token côté serveur
  validateToken(): Observable<boolean> {
    const token = this.getToken();
    if (!token) {
      return of(false);
    }

    return this.http.post<boolean>(`${this.apiUrl}/validate`, {})
      .pipe(
        map(() => true),
        catchError(() => {
          // Si le token est invalide, nettoyer le localStorage
          this.logout();
          return of(false);
        })
      );
  }

  initDefaultAdmin(): Observable<string> {
    return this.http.post<string>(`${this.apiUrl}/init`, {});
  }
}