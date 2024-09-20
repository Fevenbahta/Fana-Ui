import { Injectable } from '@angular/core';
import { HttpClient, HttpEvent, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ApiUrlService } from './apiurl.service';
import { Report } from 'app/models/data.model';


@Injectable({
  providedIn: 'root'
})
export class ReportService {
 
  //readonly apiUrl = 'https://localhost:7008/';
  

  constructor(private http: HttpClient,private apiUrlService: ApiUrlService) { }

  getAllReports(): Observable<Report[]> {
    return this.http.get<Report[]>(this.apiUrlService.apiUrl + 'Report');
  }
  getReport(id:number): Observable<Report> {
     return this.http.get<Report>(this.apiUrlService.apiUrl + 'Report/'+id);
  }

  addReport(addReportRequest:Report): Observable<Report> {
    // addReportRequest.id="0000000-0000-0000-0000-000000000000"
    const httpOptions = { headers: new HttpHeaders({ 'Content-Type': 'application/json' }) };
    return this.http.post<Report>(this.apiUrlService.apiUrl + 'Report', addReportRequest,httpOptions);
  }

  updateReport(ReportDetails: Report,Id:number): Observable<Report> {
    const httpOptions = { headers: new HttpHeaders({ 'Content-Type': 'application/json' }) };
    return this.http.put<Report>(this.apiUrlService.apiUrl + 'Report/'+Id, ReportDetails, httpOptions);
  }

  deleteReport(Id: string): Observable<string> {
    const httpOptions = { headers: new HttpHeaders({ 'Content-Type': 'application/json' }) };
    return this.http.delete<string>(this.apiUrlService.apiUrl + 'Report/' + Id+'/' , httpOptions);
  }

  

}
