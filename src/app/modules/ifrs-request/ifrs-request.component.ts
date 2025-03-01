import { DOCUMENT } from '@angular/common';
import { Component, Inject, Renderer2 } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { IfrsTransfer, OutRtgs } from 'app/models/data.model';
import { AuthService } from 'app/service/auth.service';
import { IfrsTransactionService } from 'app/service/Ifrstransaction.service';

@Component({
  selector: 'app-ifrs-request',
  templateUrl: './ifrs-request.component.html',
  styleUrls: ['./ifrs-request.component.css']
})
export class IFRSRequestComponent {

  filteredIfrsTransfers: OutRtgs[] = [];
  IfrsTransfers: OutRtgs[] = [];
  successMessage = false;
  isSearching = false;
  cancelMessage = false;
  approvalSlips: OutRtgs[] = [];
  networkError:string="";
  IfrsRequest: IfrsTransfer={
    updatedDate: "",
    updatedBy: "",
    status: "",
    id: 0,
    inputing_Branch: "",
    transaction_Date:"",
    account_No: "",
    amount1: 0,
    phone_No :"",
    address :"",
    tinNo :"",
    debitor_Name :"",
    paymentMethod :"",
    serviceFee: 0,
    serviceFee2: 0,
    vat: 0,
    vat2: 0,
    refno: "",
    branch: "",
    cAccountNo: "",
    createdBy: "",
    approvedBy: "",
    messsageNo: "",
    paymentNo: "",
    paymentType: "",
   
  };

  constructor(
    private authService: AuthService,
    private router: Router,
    private IfrsTransactionService: IfrsTransactionService,
    private snackBar: MatSnackBar,
    private renderer: Renderer2,
    @Inject(DOCUMENT) private document: Document
  ) {}

  buttons = [
        // { label: 'IfrsTransfer Request', route: '/user/:id/Request' },
         { label: 'IfrsTransfer Approval', route: '/Approval' },
    
     ];

  ngOnInit(): void {
    this.loadIfrsTransfers();
    //this.approvalSlips = [request];
  }

  private loadIfrsTransfers(): void {
    this.IfrsTransactionService.getAllOutRtgs().subscribe({
      next: (t) => {
        const branchCode = this.padBranchNumber(this.authService.getbranch());
        this.IfrsTransfers = t;
        this.filteredIfrsTransfers = this.IfrsTransfers;
      },
      error: (response) => {
        console.error(response);
      }
    });
  }

  private padBranchNumber(branch: string): string {
    return branch.padStart(5, '0');
  }

  private showSuccessMessage(message: string, isError: boolean = false): void {
    const panelClass = isError ? 'error-snackbar' : 'success-snackbar';
    const snackBarRef = this.snackBar.open(message, 'Close', {
      duration: 3000,
      horizontalPosition: 'end',
      verticalPosition: 'top'
    });

    snackBarRef.afterOpened().subscribe(() => {
      const snackBarElement = this.document.querySelector('.mat-snack-bar-container');
      if (snackBarElement) {
            this.renderer.setStyle(snackBarElement, 'background-color', isError ? 'red' : 'green');
        this.renderer.setStyle(snackBarElement, 'color', 'white');
    
          } else {
        console.error('Snackbar element not found');
      }
    });
  }
  

  requestIfrsTransfer(refno: string, request: OutRtgs): void {
  
    this.IfrsRequest.updatedBy=this.authService.getres().userName;
    this.IfrsRequest.updatedDate=Date.now().toString();
    this.IfrsRequest.branch= this.authService.getbranch();
    this.IfrsRequest.account_No=request.accounT_NO
    this.IfrsRequest.amount1=request.amounT1
    this.IfrsRequest.inputing_Branch=request.inputinG_BRANCH
    this.IfrsRequest.refno=request.refno
    this.IfrsRequest.transaction_Date=request.transactioN_DATE
  this.IfrsRequest.status='Pending';

    this.isSearching = true;    
  
    this.IfrsTransactionService.addIfrsTransaction(this.IfrsRequest).subscribe({
      next: (response) => {
     
        this.showSuccessMessage('Successfully Requested!');
        this.loadIfrsTransfers();
        this.isSearching = false;
      },
      error: (error) => {
        console.error('Error saving data:', error);
        this.isSearching = false;
        this.networkError = this.extractErrorMessage(error.error);
  
         setTimeout(() => this.networkError="", 3000); // Reset after 1 minute
                      
      }
    });
  }
  private extractErrorMessage(fullErrorMessage: string): string {
    const regex = /SOAP request failed:\s*(DESA NAUT\s*-\s*)?(.*?)(\r?\n|$)/;
    const match = fullErrorMessage.match(regex);
    
    if (match) {
      let errorMessage = match[2].trim(); // Captures the error message part
      
      // Check if the error message starts with "DESA NAUT - "
      if (match[1]) {
        errorMessage = errorMessage.replace(/^DESA NAUT\s*-\s*/, '');
      }
      
      return errorMessage ? errorMessage : 'An unknown error occurred';
    } else {
      return 'An unknown error occurred';
    }
  }
  
  cancelIfrsTransfer(id: number, request: IfrsTransfer): void {
    request.status = 'Cancled';
    request.updatedBy = this.authService.getuser();
    this.isSearching = true;
    this.IfrsTransactionService.updateIfrsTransaction(request, id).subscribe({
      next: (response) => {
        this.showSuccessMessage('Successfully Cancelled!');
        this.loadIfrsTransfers();
        this.isSearching = false;
        console.error('request:', request);
      },
      error: (error) => {
        console.error('Error saving data:', error);
        this.isSearching = false;
      }
    });
  }
}

