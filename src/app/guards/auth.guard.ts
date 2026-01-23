import { Injectable } from '@angular/core';
import { Router, CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { Observable, of } from 'rxjs';
import { map, catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  constructor(
    private router: Router,
    private authService: AuthService
  ) {}

  canActivate(
    route: ActivatedRouteSnapshot, 
    state: RouterStateSnapshot
  ): Observable<boolean> {
    // Vérification rapide : si pas de token, rediriger immédiatement
    if (!this.authService.isAuthenticated()) {
      this.router.navigate(['/admin/login'], { queryParams: { returnUrl: state.url } });
      return of(false);
    }

    // Validation du token côté serveur
    return this.authService.validateToken().pipe(
      map(isValid => {
        if (isValid) {
          return true;
        } else {
          // Token invalide, rediriger vers login
          this.router.navigate(['/admin/login'], { queryParams: { returnUrl: state.url } });
          return false;
        }
      }),
      catchError(() => {
        // En cas d'erreur, rediriger vers login
        this.router.navigate(['/admin/login'], { queryParams: { returnUrl: state.url } });
        return of(false);
      })
    );
  }
}