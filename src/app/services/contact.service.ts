import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Contact } from '../models/bien.model';

// ✅ Interface corrigée pour correspondre au backend
export interface ContactWithId {
  id: number;
  nom: string;
  prenom: string;
  email: string;
  telephone: string;
  message?: string;
  bien?: { id: number };  // ✅ Objet bien au lieu de bienId
  dateDemande: string;     // ✅ dateDemande au lieu de dateEnvoi
  statut: string;          // ✅ statut au lieu de traite (NOUVEAU, TRAITE, etc.)
}

@Injectable({
  providedIn: 'root'
})
export class ContactService {
  private apiUrl = '/api/contact';

  constructor(private http: HttpClient) { }

  /**
   * Envoyer une demande de contact (FORMULAIRE PUBLIC)
   */
  envoyer(contact: Contact): Observable<any> {
    return this.http.post(this.apiUrl, contact);
  }

  /**
   * Valider le numéro de téléphone tunisien
   */
  validatePhone(phone: string): boolean {
    const regex = /^(\+216)?[2-9]\d{7}$/;
    return regex.test(phone.replace(/\s/g, ''));
  }

  // ============================================
  // MÉTHODES ADMIN - Gestion des contacts
  // ============================================

  /**
   * Récupérer tous les contacts (ADMIN)
   */
  getAllContacts(): Observable<ContactWithId[]> {
    return this.http.get<ContactWithId[]>(this.apiUrl);
  }

  /**
   * Récupérer un contact par ID (ADMIN)
   */
  getContactById(id: number): Observable<ContactWithId> {
    return this.http.get<ContactWithId>(`${this.apiUrl}/${id}`);
  }

  /**
   * Mettre à jour un contact (ADMIN)
   */
  updateContact(id: number, contact: Partial<ContactWithId>): Observable<ContactWithId> {
    return this.http.put<ContactWithId>(`${this.apiUrl}/${id}`, contact);
  }

  /**
   * Supprimer un contact (ADMIN)
   */
  deleteContact(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  /**
   * Récupérer les contacts non traités (ADMIN)
   */
  getContactsNonTraites(): Observable<ContactWithId[]> {
    return this.http.get<ContactWithId[]>(`${this.apiUrl}/statut/NOUVEAU`);
  }
}