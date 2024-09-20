import { Injectable } from '@angular/core';
import { HttpClient, HttpEvent, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable, catchError } from 'rxjs';
import { ApiUrlService } from './apiurl.service';
import {  Transfer, UserData, ValidAccount } from 'app/models/data.model';


@Injectable({
  providedIn: 'root'
})
export class TransactionService {
 
  //readonly apiUrl = 'https://localhost:7008/';
  
  padNumber(num: string, targetLength: number): string {
    return num.padStart(targetLength, '0');
  }
  padNumberS(num: String, targetLength: number): string {
    return num.padStart(targetLength, '0');
  }
  constructor(private http: HttpClient,private apiUrlService: ApiUrlService) { }

  getAllTransactions(): Observable<Transfer[]> {
    return this.http.get<Transfer[]>(this.apiUrlService.apiUrl + 'Transaction');
  }
  getTransaction(id:number): Observable<Transfer> {
     return this.http.get<Transfer>(this.apiUrlService.apiUrl + 'Transaction/'+id);
  }

  addTransaction(addTransactionRequest:any): Observable<Transfer> {
    // addTransactionRequest.id="0000000-0000-0000-0000-000000000000"
    const httpOptions = { headers: new HttpHeaders({ 'Content-Type': 'application/json' }) };
    return this.http.post<Transfer>(this.apiUrlService.apiUrl + 'Transaction', addTransactionRequest,httpOptions);
  }

  updateTransaction(TransactionDetails: Transfer,Id:number): Observable<Transfer> {
    const httpOptions = { headers: new HttpHeaders({ 'Content-Type': 'application/json' }) };
    return this.http.put<Transfer>(this.apiUrlService.apiUrl + 'Transaction/'+Id, TransactionDetails, httpOptions);
  }

  deleteTransaction(Id: number): Observable<string> {
    const httpOptions = { headers: new HttpHeaders({ 'Content-Type': 'application/json' }) };
    return this.http.delete<string>(this.apiUrlService.apiUrl + 'Transaction/' + Id+'/' , httpOptions);
  }

  getTransactionUserByAccount(accountNumber:string): Observable<ValidAccount> {
    return this.http.get<ValidAccount>(this.apiUrlService.apiUrl + 'Transaction/GetUserDetailsByAccountNumber/'+accountNumber);
 }
 getUserDetails(branch: string, userName: string, role: string): Observable<any> {
  const paddedBranch = this.padNumber(branch, 5);
  const paddedRole = this.padNumberS(role, 4);

  const params = new HttpParams()
    .set('branch', branch)
    .set('userName', userName)
    .set('role', role);
  const url = `${this.apiUrlService.apiUrl}Transaction/GetUserDetail`;

  return this.http.get<any>(url, { params })
    .pipe(
   
    );
}

GetUserDetailByUserName(userName: string): Observable<any> {


  const params = new HttpParams()
   
    .set('userName', userName)

  const url = `${this.apiUrlService.apiUrl}Transaction/GetUserDetailByUserName`;

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
  return this.http.get<any>(`${this.apiUrlService.apiUrl}Transaction/CheckAccountBalance`, { params: params });
}
}
