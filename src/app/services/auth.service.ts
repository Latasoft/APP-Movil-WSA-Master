import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { jwtDecode } from 'jwt-decode';
import { environment } from 'src/environments/environment';
interface DecodedToken {
  authorities: string[];
  exp: number;
  _id:string;
  // Añade otros campos según tu JWT
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly TOKEN_KEY = 'token';
  private isAuthenticatedSubject = new BehaviorSubject<boolean>(false);
  private roleSubject = new BehaviorSubject<string[]>([]);
  private apiUrl = `${environment.apiUrl}/auth`;

  constructor(private http:HttpClient) { 
    this.checkAuthStatus(); // <-- Llamada al constructor
  }

  

  login(username: string, password: string) {
    return this.http.post(`${this.apiUrl}/login`, { username, password });
  }

  setToken(token: string): void {
    localStorage.setItem(this.TOKEN_KEY, token);
    this.checkAuthStatus();
  }

  getToken(): string | null {
    return localStorage.getItem(this.TOKEN_KEY);
  }

  // Método para hacer logout
  logout(): Observable<void> {
    // Limpiar el token de localStorage
    localStorage.removeItem(this.TOKEN_KEY);
    
    // Actualizar el estado de autenticación
    this.isAuthenticatedSubject.next(false);

    return of(undefined); // Devuelve un observable vacío para suscribirse si es necesario
  }

  isAuthenticated(): Observable<boolean> {
    return this.isAuthenticatedSubject.asObservable();
  }

  
  getTokenExpirationDate(): Date | null {
    const token = this.getToken();
    if (token) {
      try {
        const decodedToken = jwtDecode<DecodedToken>(token);
        if (decodedToken.exp) {
          return new Date(decodedToken.exp * 1000); // Convertir segundos a milisegundos
        }
      } catch {
        return null;
      }
    }
    return null;
  }

  isTokenExpired(): boolean {
    const expirationDate = this.getTokenExpirationDate();
    if (!expirationDate) return true;
    return expirationDate.valueOf() <= new Date().valueOf();
  }

  private checkAuthStatus(): void {
    const token = this.getToken();
    if (token && !this.isTokenExpired()) {
      try {
        const decodedToken = jwtDecode<DecodedToken>(token);
        this.isAuthenticatedSubject.next(true);
        this.roleSubject.next(decodedToken.authorities || []);
      } catch {
        this.logout();
      }
    } else {
      this.logout();
    }
  }

  getRoleFromToken(): string | null {
    const token = localStorage.getItem('token');
    if (token) {
      const decodedToken: any = jwtDecode(token);  // Use the named import jwtDecode
      
      return decodedToken.role || null; // Adjust "authorities" according to your token's claim structure
    }
    return null;
  }


  getIdFromToken(): string | null {
    const token = localStorage.getItem('token');
    if (token) {
      const decodedToken: any = jwtDecode(token);  // Use the named import jwtDecode
      
      return decodedToken._id || null; // Adjust "authorities" according to your token's claim structure
    }
    return null;
  }

  getUsernameFromToken(): string | null {
    const token = localStorage.getItem('token');
    if (token) {
      const decodedToken: any = jwtDecode(token);  // Use the named import jwtDecode
      
      return decodedToken.username || decodedToken.email || null; // Try username first, then email
    }
    return null;
  }


  resetPassword(email: string):Observable<{message:string}> {
    return this.http.post<{ message: string }>(`${this.apiUrl}/reset-password`, { email });
  }

  getDecodedToken(): any {
  const token = this.getToken();
  if (!token) return null;

  try {
    return jwtDecode(token);
  } catch (error) {
    console.error('Error al decodificar el token:', error);
    return null;
  }
}

}
