import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { DefaultModule } from './layouts/default/default.module';
import { HttpClientModule } from '@angular/common/http';
import { DeleteconfirmationComponent } from './modules/deleteconfirmation/deleteconfirmation.component';
import { LoginComponent } from './modules/login/login.component';

import { NavComponent } from './modules/nav/nav.component';
import { ChangePasswordComponent } from './modules/change-password/change-password.component';
import { ReportComponent } from './modules/report/report.component';
import { TransferRequestComponent } from './modules/transfer-request/transfer-request.component';
import { TransferAprovalComponent } from './modules/transfer-aproval/transfer-aproval.component';
import { FanaReportComponent } from './modules/fana-report/fana-report.component';
import { SlipComponent } from './modules/slip/slip.component';
import { BranchreportComponent } from './modules/branchreport/branchreport.component';
import { GeneralReportComponent } from './modules/general-report/general-report.component';


@NgModule({
  declarations: [
    AppComponent,



  

  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
       DefaultModule,
       HttpClientModule,
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
