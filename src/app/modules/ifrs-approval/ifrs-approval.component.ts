import { DOCUMENT } from '@angular/common';
import { Component, Inject, Renderer2 } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { IfrsTransfer } from 'app/models/data.model';
import { AuthService } from 'app/service/auth.service';
import { IfrsTransactionService } from 'app/service/Ifrstransaction.service';


@Component({
  selector: 'app-ifrs-approval',
  templateUrl: './ifrs-approval.component.html',
  styleUrls: ['./ifrs-approval.component.css']
})
export class IFRSApprovalComponent {

  filteredIfrsTransfers: IfrsTransfer[] = [];
  IfrsTransfers: IfrsTransfer[] = [];
  successMessage = false;
  isSearching = false;
  cancelMessage = false;
  approvalSlips: IfrsTransfer[] = [];
  networkError:string="";


  constructor(
    private authService: AuthService,
    private router: Router,
    private IfrsTransactionService: IfrsTransactionService,
    private snackBar: MatSnackBar,
    private renderer: Renderer2,
    @Inject(DOCUMENT) private document: Document
  ) {}

  buttons = [
        // { label: 'IfrsTransfers Request', route: '/user/:id/Request' },
         { label: 'IfrsTransfers Approval', route: '/Approval' },
    
     ];

  ngOnInit(): void {
    this.loadIfrsIfrsTransferss();
    //this.approvalSlips = [request];
  }

  private loadIfrsIfrsTransferss(): void {
    this.IfrsTransactionService.getAllIfrsTransactions().subscribe({
      next: (t) => {
        const branchCode = this.padBranchNumber(this.authService.getbranch());
        this.IfrsTransfers = t.filter(t => t.status === 'Pending' );
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
  

  approveIfrsTransfers(id: number, request: IfrsTransfer): void {

    if ( request.status !="Pending") {
     
            return;
    }
    request.status = 'Approved';
    request.updatedBy = this.authService.getuser();
    this.isSearching = true;    
 
    this.IfrsTransactionService.updateIfrsTransaction(request, id).subscribe({
      next: (response) => {
        // this.approvalSlips = [request];
        // console.log("this.approvalSlips",this.approvalSlips,);
   
        // this.showSuccessMessage('Successfully Approved!');
        this.loadIfrsIfrsTransferss();
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
  
  cancelIfrsTransfers(id: number, request: IfrsTransfer): void {
    request.status = 'Cancled';
    request.updatedBy = this.authService.getuser();
    this.isSearching = true;
    this.IfrsTransactionService.updateIfrsTransaction(request, id).subscribe({
      next: (response) => {
        this.showSuccessMessage('Successfully Cancelled!');
        this.loadIfrsIfrsTransferss();
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




