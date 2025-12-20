import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Contact } from '../models/bien.model';

@Injectable({
  providedIn: 'root'
})
export class ContactService {
  private apiUrl = 'http://localhost:8080/api/contact';

  constructor(private http: HttpClient) { }

  /**
   * Envoyer une demande de contact
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
}
