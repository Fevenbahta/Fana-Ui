

import { Component, Inject, Renderer2 } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Transfer } from 'app/models/data.model';
import { AuthService } from 'app/service/auth.service';
import { ReferenceNumberService } from 'app/service/numbergenerator.service';
import { TransactionService } from 'app/service/transaction.service';
import { MatSnackBar } from '@angular/material/snack-bar'
import { DOCUMENT } from '@angular/common';
import { Observable } from 'rxjs';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { ToastrService } from 'ngx-toastr';
@Component({
  selector: 'app-transfer-request',
  templateUrl: './transfer-request.component.html',
  styleUrls: ['./transfer-request.component.css']
})
export class TransferRequestComponent {

  constructor(
    private toastr: ToastrService,
    private ngxService: NgxUiLoaderService,
    private formBuilder: FormBuilder, 
    private router: Router,
    private transactionService: TransactionService,
    private authService: AuthService,
    private referenceNumberService: ReferenceNumberService,
    private snackBar: MatSnackBar,
    private renderer: Renderer2,
    @Inject(DOCUMENT) private document: Document
  ) {}

  buttons = [
    { label: 'Transfer Request', route: '/Request' },
    // { label: 'Transfer Approval', route: '/user/:id/Approval' },
  ];
  isSearching:boolean=false;
  isSuccess: boolean = false;
AccountBranch:string="";
  selectedMethod: string = "";
  accountChecked: boolean = false;
  accountChecked2: boolean = false;
invalid:boolean=false;
inSufficentBalance:boolean=false;
  transferRequestForm: FormGroup = this.formBuilder.group({
    id: [0],
    memberId: [, Validators.required],
    depositorPhone: [""],
    amount: [, Validators.required],
    transType: [""],
    transDate: [""],
    createdBy: [""],
    approvedBy: [""],
    status: [""],
    updatedDate: [""],
    updatedBy: [""],
    cAccountBranch: [""],
    cAccountNo: [{ value: '00310095104', disabled: true }, Validators.required],
    cAccountOwner: [{ value: 'FANA YOUTH AND CREDIT LIMITED COOPERATIVE', disabled: true }, Validators.required],
   
    dAccountNo: ["", Validators.required],
    dDepositeName: [""],
    branch: [""],
    referenceNo: [""],
    messsageNo: [""],
    paymentNo: [""]
  });

  cashTransferRequestForm: FormGroup = this.formBuilder.group({
    id: [0],
    memberId: [, Validators.required],
    depositorPhone: ["", Validators.required],
    amount: [, Validators.required],
    transType: [""],
    transDate: [""],
    createdBy: [""],
    approvedBy: [""],
    status: [""],
    updatedDate: [""],
    updatedBy: [""],
    cAccountBranch: [""],
 
    cAccountNo: [{ value: '00310095104', disabled: true }, Validators.required],
    cAccountOwner: [{ value: 'FANA YOUTH AND CREDIT LIMITED COOPERATIVE', disabled: true }, Validators.required],
      dAccountNo: [{ value: '24107700003', disabled: true }, Validators.required],
      dDepositeName: [ "", Validators.required],
   branch: [""],
    referenceNo: [""],
    messsageNo: [""],
    paymentNo: [""]
  });

  ngOnInit(): void {
  
  }
  // private showSuccessMessage(message: string, isError: boolean = false): void {
  //   const panelClass = isError ? 'error-snackbar' : 'success-snackbar';
  //   const snackBarRef = this.snackBar.open(message, 'Close', {
  //     duration: 3000,
  //     horizontalPosition: 'end',
  //     verticalPosition: 'top'
  //   });

  //   snackBarRef.afterOpened().subscribe(() => {
  //     const snackBarElement = this.document.querySelector('.mat-snack-bar-container');
  //     if (snackBarElement) {
  //           this.renderer.setStyle(snackBarElement, 'background-color', isError ? 'red' : 'green');
  //       this.renderer.setStyle(snackBarElement, 'color', 'white');
    
  //         } else {
  //       console.error('Snackbar element not found');
  //     }
  //   });
  // }

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
  markFormGroupTouched(formGroup: FormGroup) {
    Object.keys(formGroup.controls).forEach(field => {
      const control = formGroup.get(field);
      control.markAsTouched({ onlySelf: true });
    });
  }
  onMethodChange() {

  }

  checkAccount() {
    this.ngxService.start();
    const dAccountNoControl = this.transferRequestForm.get('dAccountNo');
    if (dAccountNoControl.invalid) {
      dAccountNoControl.markAsTouched();
      this.ngxService.stop();
      return;
    }
    this.isSearching=true;
    this.transactionService.getTransactionUserByAccount(this.transferRequestForm.value.dAccountNo).subscribe(response => {
      if (response) {
        this.showSuccessMessage("Successful!")
        this.ngxService.stop();
        this.isSearching=false;
        this.AccountBranch=response.branch
        this.transferRequestForm.patchValue({
          dDepositeName: response.fulL_NAME.trim(),
          depositorPhone: response.telephonenumber,
          cAccoutBranch: response.branch
        }); 
        this.accountChecked = true;
      } else {
        this.showSuccessMessage("Try Again!",true)
        this.accountChecked = false;
        this.ngxService.stop();
        this.isSearching=false;
        this.invalid=true;
        setTimeout(() => {
          this.invalid = false;
        }, 2000);
      }
    }, error => {
      this.ngxService.stop();
      console.error('Error checking account:', error);
      this.showSuccessMessage("Try Again!",true)
    
      this.accountChecked = false;
      alert('Error checking account details');
      this.isSearching=false;
    });
  }

  getCurrentFormattedDate(): string {
    const now = new Date();
    return now.toISOString();
  }
  padBranchNumber(branch: string): string {
    return branch.padStart(5, '0');
  }

  enableAllControls(form: FormGroup) {
    Object.keys(form.controls).forEach(controlName => {
      form.controls[controlName].enable();
    });
  }
  addRequest() {
    this.ngxService.start();
    let requestForm;
    if (this.selectedMethod === 'Transfer') {
      if (this.transferRequestForm.invalid) {
        this.ngxService.stop();
         this.markFormGroupTouched(this.transferRequestForm);
        return;
      }
     
      requestForm = this.transferRequestForm;
      requestForm.patchValue({
        transType: 'Transfer',
        referenceNo: "",
        messsageNo: "",
        paymentNo: "",
        transDate: this.getCurrentFormattedDate(),
        createdBy: this.authService.getuser(),
        branch: this.padBranchNumber(this.authService.getbranch()),
        status: 'Pending',
      cAccountBranch:this.AccountBranch

      });
     
      this.checkBalance(
        this.transferRequestForm.value.cAccountBranch,
        this.transferRequestForm.value.dAccountNo,
        this.transferRequestForm.value.amount
      ).subscribe(
        (success) => {
          if (success) {
            this.sumitRequest(requestForm)
          } else {
            // Handle insufficient balance scenario
            if (!this.accountChecked2) {
              this.ngxService.stop(); return;
       }      }
        },
        (error) => {
          this.ngxService.stop();
          console.error('Error checking balance:', error);
        }
      );

 
    } else if (this.selectedMethod === 'Cash') {
      if (this.cashTransferRequestForm.invalid) {
        this.markFormGroupTouched(this.cashTransferRequestForm);
        return;
      }
      requestForm = this.cashTransferRequestForm;
      requestForm.patchValue({
        transType: 'Cash',

        referenceNo: "",
        messsageNo: "",
        paymentNo: "",
        transDate: this.getCurrentFormattedDate(),
        createdBy: this.authService.getuser(),
        branch: this.padBranchNumber(this.authService.getbranch()),
        status: 'Pending',
        cAccountBranch: this.padBranchNumber(this.authService.getbranch()),
        // cAccountBranch: "00003",
      });
      this.sumitRequest(requestForm)
    }
    
  }

sumitRequest(requestForm){

    this.enableAllControls(this.cashTransferRequestForm);
    this.enableAllControls(this.transferRequestForm);

    this.transactionService.addTransaction(requestForm.value).subscribe({
      next: () => {
        this.ngxService.stop();
        this.showSuccessMessage('Successfully Added!');
      
        this.transferRequestForm = this.formBuilder.group({
          id: [0],
          memberId: [, Validators.required],
          depositorPhone: [""],
          amount: [, Validators.required],
          transType: [""],
          transDate: [""],
          createdBy: [""],
          approvedBy: [""],
          status: [""],
          updatedDate: [""],
          updatedBy: [""],
          cAccountBranch: [""],
          cAccountNo: [{ value: '00310095104', disabled: true }, Validators.required],
          cAccountOwner: [{ value: 'FANA YOUTH AND CREDIT LIMITED COOPERATIVE', disabled: true }, Validators.required],
         
          dAccountNo: ["", Validators.required],
          dDepositeName: [""],
          branch: [""],
          referenceNo: [""],
          messsageNo: [""],
          paymentNo: [""]
        });
    this.AccountBranch=""
        this.cashTransferRequestForm = this.formBuilder.group({
          id: [0],
    memberId: [, Validators.required],
    depositorPhone: ["", Validators.required],
    amount: [, Validators.required],
    transType: [""],
    transDate: [""],
    createdBy: [""],
    approvedBy: [""],
    status: [""],
    updatedDate: [""],
    updatedBy: [""],
    cAccountBranch: [""],
 
    cAccountNo: [{ value: '00310095104', disabled: true }, Validators.required],
    cAccountOwner: [{ value: 'FANA YOUTH AND CREDIT LIMITED COOPERATIVE', disabled: true }, Validators.required],
      dAccountNo: [{ value: '24107700003', disabled: true }, Validators.required],
      dDepositeName: [ "", Validators.required],
   branch: [""],
    referenceNo: [""],
    messsageNo: [""],
    paymentNo: [""]
        });
      },
      error: (response) => {
        this.ngxService.stop();
        this.showSuccessMessage('Error sending request!',true);
      
      },
    });
}
  checkBalance(branch: string, account: string, amount: number): Observable<boolean> {
    return new Observable<boolean>((observer) => {
      this.isSearching = true;
      this.accountChecked2 = false;
      this.ngxService.start();
      this.transactionService.CheckAccountBalance(branch, account, amount).subscribe(
        (response) => {
          this.isSearching = false;

          if (response.success) {
            this.accountChecked2 = true;
            this.ngxService.stop();
            observer.next(true); // Emit true for success
          } else {
            this.ngxService.stop();
            this.accountChecked2 = false;
            this.showSuccessMessage('InSufficent Balance!',true);
            this.inSufficentBalance = true;
            setTimeout(() => {
              this.inSufficentBalance = false;
            }, 2000);
            observer.next(false); // Emit false for failure
          }
          observer.complete();
        },
        (error) => {
          this.ngxService.stop();
          this.showSuccessMessage('Error checking balance!',true);
          console.error('Error checking balance', error);
               }
      );
    });
  }
  

}
