import{NgModule} from '@angular/core';
import { CommonModule } from '@angular/common';
import { DatePipe } from '@angular/common';




import {MatButtonModule} from '@angular/material/button';
import {MatInputModule} from '@angular/material/input';
import {MatNativeDateModule, MatPseudoCheckbox, MatPseudoCheckboxModule, MatRippleModule} from '@angular/material/core';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatTooltipModule} from '@angular/material/tooltip';
import {MatSelectModule} from '@angular/material/select';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatMenuModule } from '@angular/material/menu';
import { MAT_RADIO_DEFAULT_OPTIONS, MatRadioModule } from '@angular/material/radio';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatDividerModule } from '@angular/material/divider';
import { MatCardModule } from '@angular/material/card';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatTableModule } from '@angular/material/table';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

import { ToastrModule } from 'ngx-toastr';

import { SharedModule } from 'app/shared/shared.module';
import { DefaultComponent } from './default.component';
import { MatToolbarModule } from '@angular/material/toolbar';
import { FlexLayoutModule } from '@angular/flex-layout';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { DeletesucessfulmessageComponent } from 'app/deletesucessfulmessage/deletesucessfulmessage.component';
import { MatDialogModule } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon'
import { DeleteconfirmationComponent } from 'app/modules/deleteconfirmation/deleteconfirmation.component';
import { LoginComponent } from 'app/modules/login/login.component';

import { NavComponent } from 'app/modules/nav/nav.component';
import { ExportAsModule } from 'ngx-export-as';

import { ChangePasswordComponent } from 'app/modules/change-password/change-password.component';

import { ReportComponent } from 'app/modules/report/report.component';
import { TransferRequestComponent } from 'app/modules/transfer-request/transfer-request.component';
import { TransferAprovalComponent } from 'app/modules/transfer-aproval/transfer-aproval.component';
import { AdminComponent } from 'app/modules/admin/admin.component';
import { FanaReportComponent } from 'app/modules/fana-report/fana-report.component';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { SlipComponent } from 'app/modules/slip/slip.component';
import { BranchreportComponent } from 'app/modules/branchreport/branchreport.component';
import { GeneralReportComponent } from 'app/modules/general-report/general-report.component';
import { IFRSRequestComponent } from 'app/modules/ifrs-request/ifrs-request.component';
import { IFRSApprovalComponent } from 'app/modules/ifrs-approval/ifrs-approval.component';
import { IFRSReportComponent } from 'app/modules/ifrs-report/ifrs-report.component';
import { ReceiptComponent } from 'app/modules/receipt/receipt.component';
import { IFRSAllbranchReportComponent } from 'app/modules/ifrs-allbranch-report/ifrs-allbranch-report.component';
import { FanaCustomViewComponent } from 'app/modules/fana-custom-view/fana-custom-view.component';
import { FanaAccountStatementComponent } from 'app/modules/fana-account-statement/fana-account-statement.component';
import { FanaCoreStatmentComponent } from 'app/modules/fana-core-statment/fana-core-statment.component';

@NgModule({
  declarations: [
    DefaultComponent,
    DeletesucessfulmessageComponent,
    DeleteconfirmationComponent,
    LoginComponent,
    NavComponent,
    AdminComponent,
    ChangePasswordComponent,
    ReportComponent,
    TransferRequestComponent,
    TransferAprovalComponent,
    FanaReportComponent,
    SlipComponent,
    BranchreportComponent,
    GeneralReportComponent,
    IFRSRequestComponent,
    IFRSApprovalComponent,
    IFRSReportComponent,
    ReceiptComponent,
  FanaCustomViewComponent,
  FanaAccountStatementComponent,
    IFRSAllbranchReportComponent,
    FanaCoreStatmentComponent,
  ],
  imports: [
   
    CommonModule,
    RouterModule,
    FormsModule,
    MatIconModule,
    MatFormFieldModule,
    ReactiveFormsModule,
    MatDialogModule ,
    MatButtonModule,
    MatRadioModule,
    MatRippleModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatTooltipModule,
    MatToolbarModule,
 MatPseudoCheckboxModule,
 MatNativeDateModule,
 MatDatepickerModule,
 MatSlideToggleModule,
 MatMenuModule,
 MatSidenavModule,
 MatDividerModule,
 FlexLayoutModule,
 MatCardModule,
 MatPaginatorModule,
 MatTableModule,
 SharedModule,
 ExportAsModule,
  DatePipe,
  MatProgressSpinnerModule,
  BrowserAnimationsModule,
  MatSnackBarModule,
  ToastrModule.forRoot({
    timeOut: 3000,
    positionClass: 'toast-top-right',
    closeButton: true,
    progressBar: true
  })

  ],

providers: [
  {   provide: MAT_RADIO_DEFAULT_OPTIONS,
    useValue: { color: 'primary' },}
],
})
export class DefaultModule { }
