import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Login, TokenResponse } from 'app/models/data.model';
import { Observable } from 'rxjs';
import { ApiUrlService } from './apiurl.service';

@Injectable({
  providedIn: 'root'
})
export class LoginService {
 // readonly apiUrl = 'https://localhost:7008/';

  constructor(private http: HttpClient,private apiUrlService: ApiUrlService) { }

  login(username: string, password: string): Observable<TokenResponse> {
    const requestBody = { username, password };
    const httpOptions = { headers: new HttpHeaders({ 'Content-Type': 'application/json' }) };
    return this.http.post<TokenResponse>(this.apiUrlService.apiUrl + 'Login', requestBody, httpOptions);
  }

  getUser(id: number) {
    return this.http.get<Login>(`${this.apiUrlService.apiUrl }Login/user/${id}`);
  }

  register(userDto: Login) {
    return this.http.put<Login>(this.apiUrlService.apiUrl  + 'Login', userDto);
  }
  
  getAll(): Observable<Login[]> {
    return this.http.get<Login[]>(this.apiUrlService.apiUrl  + 'Login');
  }
  updateAdminUser(userDetails: Login,Id:number): Observable<Login> {
    const httpOptions = { headers: new HttpHeaders({ 'Content-Type': 'application/json' }) };
    return this.http.put<Login>(this.apiUrlService.apiUrl  + 'Login/Admin/'+Id, userDetails, httpOptions);
  }
  updateUser(id: number, oldPassword: String, oldInput: String, userDetails: Login): Observable<Login> {
    // Construct the URL with query parameters
    const url = `${this.apiUrlService.apiUrl}Login/${id}?old=${oldPassword}&oldInput=${oldInput}`;
    
    const httpOptions = {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' })
    };

    return this.http.put<Login>(url, userDetails, httpOptions);
  }
  deleteUser(Id: number): Observable<string> {
    const httpOptions = { headers: new HttpHeaders({ 'Content-Type': 'application/json' }) };
    return this.http.delete<string>(this.apiUrlService.apiUrl  + 'Login/' + Id, httpOptions);
}
}