import { Injectable } from '@angular/core';
import { HttpClient, HttpEvent, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable, catchError } from 'rxjs';
import { ApiUrlService } from './apiurl.service';
import {  IfrsTransfer, UserData, ValidAccount } from 'app/models/data.model';


@Injectable({
  providedIn: 'root'
})
export class IfrsTransactionService {
 
  //readonly apiUrl = 'https://localhost:7008/';
  
  padNumber(num: string, targetLength: number): string {
    return num.padStart(targetLength, '0');
  }
  padNumberS(num: String, targetLength: number): string {
    return num.padStart(targetLength, '0');
  }
  constructor(private http: HttpClient,private apiUrlService: ApiUrlService) { }

  getAllIfrsTransactions(): Observable<IfrsTransfer[]> {
    return this.http.get<IfrsTransfer[]>(this.apiUrlService.apiUrl + 'IfrsTransaction');
  }
  getIfrsTransaction(id:number): Observable<IfrsTransfer> {
     return this.http.get<IfrsTransfer>(this.apiUrlService.apiUrl + 'IfrsTransaction/'+id);
  }
  processIfrsTransactions(): Observable<string> { // Expecting text response
    return this.http.post(this.apiUrlService.apiUrl  + 'IfrsTransaction/process', null, { responseType: 'text' });
  }
  addIfrsTransaction(addIfrsTransactionRequest:any): Observable<IfrsTransfer> {
    // addIfrsTransactionRequest.id="0000000-0000-0000-0000-000000000000"
    const httpOptions = { headers: new HttpHeaders({ 'Content-Type': 'application/json' }) };
    return this.http.post<IfrsTransfer>(this.apiUrlService.apiUrl + 'IfrsTransaction', addIfrsTransactionRequest,httpOptions);
  }

  updateIfrsTransaction(IfrsTransactionDetails: IfrsTransfer,Id:number): Observable<IfrsTransfer> {
    const httpOptions = { headers: new HttpHeaders({ 'Content-Type': 'application/json' }) };
    return this.http.put<IfrsTransfer>(this.apiUrlService.apiUrl + 'IfrsTransaction/'+Id, IfrsTransactionDetails, httpOptions);
  }

  deleteIfrsTransaction(Id: number): Observable<string> {
    const httpOptions = { headers: new HttpHeaders({ 'Content-Type': 'application/json' }) };
    return this.http.delete<string>(this.apiUrlService.apiUrl + 'IfrsTransaction/' + Id+'/' , httpOptions);
  }


  getIfrsTransactionsByDateInterval(startDate: string, endDate: string): Observable<IfrsTransfer[]> {
    const requestBody = {
      startDate: startDate,
      endDate: endDate
    };

    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Accept': '*/*'
      })
    };

    return this.http.post<IfrsTransfer[]>(this.apiUrlService.apiUrl + 'IfrsTransaction/GetIfrsTransactionsByDateInterval', requestBody, httpOptions);
  }
  getIfrsTransactionUserByAccount(accountNumber:string): Observable<ValidAccount> {
    return this.http.get<ValidAccount>(this.apiUrlService.apiUrl + 'IfrsTransaction/GetUserDetailsByAccountNumber/'+accountNumber);
 }
 getUserDetails(branch: string, userName: string, role: string): Observable<any> {
  const paddedBranch = this.padNumber(branch, 5);
  const paddedRole = this.padNumberS(role, 4);

  const params = new HttpParams()
    .set('branch', branch)
    .set('userName', userName)
    .set('role', role);
  const url = `${this.apiUrlService.apiUrl}IfrsTransaction/GetUserDetail`;

  return this.http.get<any>(url, { params })
    .pipe(
   
    );
}

GetUserDetailByUserName(userName: string): Observable<any> {


  const params = new HttpParams()
   
    .set('userName', userName)

  const url = `${this.apiUrlService.apiUrl}IfrsTransaction/GetUserDetailByUserName`;

  return this.http.get<any>(url, { params })
    .pipe(
   
    );
}
CheckAccountBalance(branch: string, account: string, amount: number): Observable<any> {
  // Prepare query parameters
  let params = new HttpParams()
    .set('branch', branch)
    .set('account', account)
    .set('amount', amount.toString());

  // Make GET request to API endpoint
  return this.http.get<any>(`${this.apiUrlService.apiUrl}IfrsTransaction/CheckAccountBalance`, { params: params });
}
getAllOutRtgs(): Observable<any> {
  return this.http.get<any>(this.apiUrlService.apiUrl + 'IfrsTransaction/GetAllOutRtgs');
}


}
