import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { tap } from 'rxjs';
import { environment} from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private apiUrl = `${environment.apiUrl}/auth`;

  constructor(private http: HttpClient) {}

  login(email: string, contrasena: string) {
    return this.http.post<any>(`${this.apiUrl}/login`, { email, contrasena })
      .pipe(
        tap(res => {
          localStorage.setItem('token', res.token);
        })
      );
  }

  loginWithGoogle() {
    window.location.href = `${environment.apiUrl}/oauth2/authorization/google`
  }

  getToken(): string | null {
    return localStorage.getItem('token');
  }

  logout() {
    localStorage.removeItem('token');
  }

  isAuthenticated(): boolean {
    return !!this.getToken();
  }

  validateCode(email: string, code: string) {
  return this.http.post<any>(
    `${this.apiUrl}/validate-code?email=${email}&code=${code}`,
    {}
  ).pipe(
    tap(res => {
      localStorage.setItem('token', res.token);
      localStorage.setItem('rol', res.rol);
    })
  );

}

resendCode(email: string) {
  return this.http.post<any>(`${environment.apiUrl}/auth/resend-code`, {
    email: email
  });
}

}