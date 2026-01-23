import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule, ActivatedRoute } from '@angular/router';
import { AuthService, LoginRequest } from '../../services/auth.service';

@Component({
  selector: 'app-admin-login',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './admin-login.component.html',
  styleUrl: './admin-login.component.css'
})
export class AdminLoginComponent implements OnInit {
  credentials: LoginRequest = {
    username: '',
    password: ''
  };

  loading = false;
  error = '';
  showPassword = false;
  returnUrl = '/admin/dashboard';

  constructor(
    private authService: AuthService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    // Récupérer le returnUrl
    this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/admin/dashboard';

    // Rediriger si déjà connecté (avec validation du token)
    if (this.authService.isAuthenticated()) {
      this.authService.validateToken().subscribe({
        next: (isValid) => {
          if (isValid) {
            this.router.navigate([this.returnUrl]);
          }
        },
        error: () => {
          // Token invalide, rester sur la page de login
          this.authService.logout();
        }
      });
    }
  }

  onSubmit(): void {
    if (!this.credentials.username || !this.credentials.password) {
      this.error = 'Veuillez remplir tous les champs';
      return;
    }

    this.loading = true;
    this.error = '';

    this.authService.login(this.credentials).subscribe({
      next: (response) => {
        this.loading = false;
        // Rediriger vers la page demandée ou le dashboard
        this.router.navigate([this.returnUrl]);
      },
      error: (err) => {
        this.loading = false;
        console.error('Erreur de connexion:', err);
        if (err.status === 401) {
          this.error = 'Nom d\'utilisateur ou mot de passe incorrect';
        } else {
          this.error = 'Erreur de connexion au serveur';
        }
      }
    });
  }

  togglePasswordVisibility(): void {
    this.showPassword = !this.showPassword;
  }
}