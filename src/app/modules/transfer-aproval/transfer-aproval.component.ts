import { Component, Inject, OnInit, Renderer2 } from '@angular/core';
import { Router } from '@angular/router';
import { Transfer } from 'app/models/data.model';
import { AuthService } from 'app/service/auth.service';
import { TransactionService } from 'app/service/transaction.service';
import { MatSnackBar } from '@angular/material/snack-bar'
import { DOCUMENT } from '@angular/common';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { ToastrService } from 'ngx-toastr';
@Component({
  selector: 'app-transfer-aproval',
  templateUrl: './transfer-aproval.component.html',
  styleUrls: ['./transfer-aproval.component.css']
})
export class TransferAprovalComponent {

 
  filteredTransfers: Transfer[] = [];
  transfers: Transfer[] = [];
  successMessage = false;
  isSearching = false;
  cancelMessage = false;
  approvalSlips: Transfer[] = [];
  networkError:string="";


  constructor(
     private toastr: ToastrService,
     
    private authService: AuthService,
    private router: Router,
    private transactionService: TransactionService,
    private snackBar: MatSnackBar,
    private renderer: Renderer2,
    private ngxService: NgxUiLoaderService,
    @Inject(DOCUMENT) private document: Document
  ) {}

  buttons = [
        // { label: 'Transfer Request', route: '/user/:id/Request' },
         { label: 'Transfer Approval', route: '/Approval' },
    
     ];

  ngOnInit(): void {
    this.loadTransfers();
    //this.approvalSlips = [request];
  }

  private loadTransfers(): void {

    this.transactionService.getAllTransactions().subscribe({
      next: (t) => {
        const branchCode = this.padBranchNumber(this.authService.getbranch());
        this.transfers = t.filter(t => t.status === 'Pending' && t.branch === branchCode);
        this.filteredTransfers = this.transfers;
      },
      error: (response) => {
        console.error(response);
      }
    });
  }

  private padBranchNumber(branch: string): string {
    return branch.padStart(5, '0');
  }

  showSuccessMessage(message: string, isError: boolean = false): void {
    if (isError) {

      this.toastr.error(message, 'Error', {
        timeOut: 1000,
        positionClass: 'toast-top-right',
        closeButton: true
      });
    } else {
  
      this.toastr.success(message, 'Success', {
        timeOut: 1000,
        positionClass: 'toast-top-right',
        closeButton: true
      });
    }
  }
  

  approveTransfer(id: number, request: Transfer): void {
   this.ngxService.start();
    if (request.paymentNo.startsWith('FANA') || request.status !="Pending") {
      this.ngxService.stop();
         console.log()
      return;
    }
    request.status = 'Approved';
    request.approvedBy = this.authService.getuser();
    this.isSearching = true;    

    this.transactionService.updateTransaction(request, id).subscribe({
      next: (response) => {
        this.ngxService.stop();
        // Fetch the latest transaction details
        this.transactionService.getTransaction(id).subscribe({
          next: (transactionDetails) => {
            // Assign the fetched transaction to approvalSlips for slip generation
            this.approvalSlips = [transactionDetails];
    
            // Show success message
            this.showSuccessMessage('Successfully Approved!');
            
            // Reload the transfers list
            this.loadTransfers();
    
            // Reset the loading state
            this.isSearching = false;
          },
          error: (fetchError) => {
            console.error('Error fetching transaction details:', fetchError);
            this.ngxService.stop();
            // Show a message for failed slip data fetching
            this.networkError = 'Failed to fetch updated transaction details.';
            setTimeout(() => (this.networkError = ""), 3000);
            this.showSuccessMessage('Failed to update transaction !',true);
     
            this.isSearching = false;
          },
        });
      },
      error: (error) => {
        console.error('Error saving data:', error);
        this.ngxService.stop();
        // Show the extracted error message
        this.networkError = this.extractErrorMessage(error.error);
        setTimeout(() => (this.networkError = ""), 3000);
        this.showSuccessMessage('Error saving data!',true);
     
        // Reset the loading state
        this.isSearching = false;
      },
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
  
  cancelTransfer(id: number, request: Transfer): void {
    this.ngxService.start();
    request.status = 'Cancled';
    request.approvedBy = this.authService.getuser();
    this.isSearching = true;
    this.transactionService.updateTransaction(request, id).subscribe({
      next: (response) => {
        this.ngxService.stop();
        this.showSuccessMessage('Successfully Cancelled!');
        this.loadTransfers();
        this.isSearching = false;
        console.error('request:', request);
      },
      error: (error) => {
        this.ngxService.stop();
        this.showSuccessMessage('Error saving data!',true);
        console.error('Error saving data:', error);
        this.isSearching = false;
      }
    });
  }
}



// import { Component } from '@angular/core';
// import { Router } from '@angular/router';
// import { Transfer } from 'app/models/data.model';
// import { AuthService } from 'app/service/auth.service';
// import { TransactionService } from 'app/service/transaction.service';
// import { MatSnackBar } from '@angular/material/snack-bar';

// @Component({
//   selector: 'app-transfer-aproval',
//   templateUrl: './transfer-aproval.component.html',
//   styleUrls: ['./transfer-aproval.component.css']
// })
// export class TransferAprovalComponent {

//   filteredTransfers:Transfer[]=[]
//   Transfers:Transfer[]=[]
//   successMessage:boolean=false
//   isSearching:boolean=false;
//   cancleMessage :boolean=false

//   buttons = [
//     // { label: 'Transfer Request', route: '/user/:id/Request' },
//     { label: 'Transfer Approval', route: '/user/:id/Approval' },
   
//   ];
//   ngOnInit(): void {
//     this.transactionService.getAllTransactions().subscribe({
//       next: (t) => {

// const ttt=this.padBranchNumber(this.authService.getbranch())
//         this.Transfers = t.filter(t=>t.status=='Pending'&& t.branch==ttt);
//         this.filteredTransfers = t.filter(t=>t.status=='Pending'&& t.branch==ttt);
//         console.log( " branch",this.authService.getbranch());
//         console.log( " this.filteredTransferst",this.filteredTransfers);
//       },
//       error(response) {
//         console.log(response);
//       },
//     });
//   }
//   constructor(
//     private authService: AuthService,
//     private router: Router,
//     private transactionService: TransactionService,
//     private snackBar :MatSnackBar
//   ) {}
//   padBranchNumber(branch: string): string {
//     return branch.padStart(5, '0');
//   }
//   showSucessMessage(message:string) : void{
//     this.snackBar.open(message,'Close',
//     {duration:3000,
    
//     horizontalPosition:'end',
//       verticalPosition:'top',
//         panelClass:['car']
//       })
      
//       }
//   approveTransfer(tra :number, request: Transfer){
//     request.status='Approved'
//     console.log('Data ');
//     request.approvedBy=this.authService.getuser();
//     this.isSearching=true;
//     this.showSucessMessage('Sucessfully Added!!')
//     this.transactionService.updateTransaction(request,tra).subscribe(
//       (response) => {
//         // Handle the response if needed
//         console.log('Data saved successfully:', response);
   
  
//         this.successMessage = true;
//         setTimeout(() => {
//           this.successMessage = false;
//         }, 2000); 

//      this.isSearching=false; 
//         this.transactionService.getAllTransactions().subscribe({
//           next: (t) => {
    
//     const ttt=this.padBranchNumber(this.authService.getbranch())
//             this.Transfers = t.filter(t=>t.status=='Pending'&& t.branch==ttt);
//             this.filteredTransfers = t.filter(t=>t.status=='Pending'&& t.branch==ttt);
//             console.log( " branch",this.authService.getbranch());
//             console.log( " this.filteredTransferst",this.filteredTransfers);
//           },
//           error(response) {
//             console.log(response);
//             this.isSearching=false;
//           },
//         });
//       },
//       (error) => {
//         // Handle any errors
//         console.error('Error saving data:', error);
//         this.successMessage = null; 
//         this.isSearching=false;
//       }
//     );
//     }
//   cancleTransfer(tra :number, request: Transfer){
//       request.status='Cancled'
//       console.log('Data ');
//       request.approvedBy=this.authService.getuser();
//       this.isSearching=true;
    
//       this.transactionService.updateTransaction(request,tra).subscribe(
//         (response) => {
//           // Handle the response if needed
//           console.log('Data saved successfully:', response);
     
    
//           this.cancleMessage = true;
//           setTimeout(() => {
//             this.cancleMessage = false;
//           }, 2000); 
  
//        this.isSearching=false; 
//           this.transactionService.getAllTransactions().subscribe({
//             next: (t) => {
      
//       const ttt=this.padBranchNumber(this.authService.getbranch())
//               this.Transfers = t.filter(t=>t.status=='Pending'&& t.branch==ttt);
//               this.filteredTransfers = t.filter(t=>t.status=='Pending'&& t.branch==ttt);
//               console.log( " branch",this.authService.getbranch());
//               console.log( " this.filteredTransferst",this.filteredTransfers);
//             },
//             error(response) {
//               console.log(response);
//             },
//           });
//         },
//         (error) => {
//           // Handle any errors
//           console.error('Error saving data:', error);
//           this.successMessage = null; 
//           this.isSearching=false;
//         }
//       );
//       }
//   }


