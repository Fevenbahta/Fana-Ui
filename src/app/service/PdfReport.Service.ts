// report.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ReportService {
  private baseUrl = 'http://localhost:5005/api/report'; // Update this to your API base URL

  constructor(private http: HttpClient) {}

  generateReport(branch: string, date: string): Observable<Blob> {
    return this.http.get(`${this.baseUrl}/generate?branch=${branch}&date=${date}`, {
      responseType: 'blob' // Set response type to Blob
    });
  }
}
