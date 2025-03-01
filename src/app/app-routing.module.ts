import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DefaultComponent } from './layouts/default/default.component';
import { LoginComponent } from './modules/login/login.component';
import { AuthGuardService } from './service/auth-guard.service';
import { AdminAuthGuardService } from './service/admin-auth-guard.service';
import { ChangePasswordComponent } from './modules/change-password/change-password.component';

import { TransferRequestComponent } from './modules/transfer-request/transfer-request.component';
import { TransferAprovalComponent } from './modules/transfer-aproval/transfer-aproval.component';
import { AdminAuthGuardSecondService } from './service/admin-auth-guard-second.service';
import { AdminComponent } from './modules/admin/admin.component';
import { AdminAuthAdminGuardService } from './service/admin-auth-admin-guard.service';
import { ReportAuthGuardService } from './service/report-auth-guard.service';
import { FanaReportComponent } from './modules/fana-report/fana-report.component';
import { BranchreportComponent } from './modules/branchreport/branchreport.component';
import { GeneralReportComponent } from './modules/general-report/general-report.component';
import { IFRSReportComponent } from './modules/ifrs-report/ifrs-report.component';
import { IFRSRequestComponent } from './modules/ifrs-request/ifrs-request.component';
import { IFRSApprovalComponent } from './modules/ifrs-approval/ifrs-approval.component';
import { ReceiptComponent } from './modules/receipt/receipt.component';
import { IFRSAllbranchReportComponent } from './modules/ifrs-allbranch-report/ifrs-allbranch-report.component';
import { FanaCustomViewComponent } from './modules/fana-custom-view/fana-custom-view.component';
import { CustomFanaAuthGuardService } from './service/CustomFana-auth-guard.service ';
import { FanaAccountStatementComponent } from './modules/fana-account-statement/fana-account-statement.component';
 // Create this component for 404 page

const routes: Routes = [
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  {
    path: '',
    component: DefaultComponent,
    canActivate: [AuthGuardService],
    children: [
      { path: 'Change', component: ChangePasswordComponent },
      {
        path: 'Request',
        component: TransferRequestComponent,
        canActivate: [AdminAuthGuardService]
      },
      {
        path: 'Approval',
        component: TransferAprovalComponent,
        canActivate: [AdminAuthGuardSecondService]
      },
      {
        path: 'IfrsRequest',
        component: IFRSRequestComponent,
        canActivate: [AdminAuthGuardService]
      },
      {
        path: 'IfrsApproval',
        component: IFRSApprovalComponent,
        canActivate: [AdminAuthGuardSecondService]
      },
      {
        path: 'Admin',
        component: AdminComponent,
        canActivate: [AdminAuthAdminGuardService],
      },
      {
        path: 'FanaReport',
        component: FanaReportComponent,
        canActivate: [ReportAuthGuardService],
      },
      {
        path: 'GeneralReport',
        component: GeneralReportComponent,
        canActivate: [ReportAuthGuardService],
      },  
 
      {
        path: 'BranchReport',
        component: BranchreportComponent,
        canActivate: [AdminAuthGuardSecondService],
      },
      
      {
        path: 'RtgsReport',
        component: IFRSReportComponent,
        canActivate: [AdminAuthGuardSecondService],
      },
      {
        path: 'RtgsAllReport',
        component: IFRSAllbranchReportComponent,
        canActivate: [ReportAuthGuardService],
      },
      {
        path: 'FanaCustom',
        component: FanaCustomViewComponent,
        canActivate: [CustomFanaAuthGuardService],
      },
      {
        path: 'FanaStatment',
        component: FanaAccountStatementComponent,
        canActivate: [CustomFanaAuthGuardService],
      },
      {
        path: 'Receipt',
        component: ReceiptComponent,
        canActivate: [AdminAuthGuardService],
      },
    ]
  },

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
