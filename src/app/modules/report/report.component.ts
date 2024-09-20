import { Component } from '@angular/core';
import { DeleteconfirmationComponent } from '../deleteconfirmation/deleteconfirmation.component';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { DeletesucessfulmessageComponent } from 'app/deletesucessfulmessage/deletesucessfulmessage.component';
import { AuthService } from 'app/service/auth.service';
import { ReportService } from 'app/service/report.service';
import * as ExcelJS from 'exceljs';
import { Report } from 'app/models/data.model';

@Component({
  selector: 'app-report',
  templateUrl: './report.component.html',
  styleUrls: ['./report.component.css']
})
export class ReportComponent {

  constructor(
    private reportService: ReportService,   

     private dialog: MatDialog,
      private authService: AuthService,) { }

  reportdata:Report[]=[]
  
  addReportData:Report = { 
    AccountNo:0 ,	
    SerialNo:0	, 
    MemberCode:0 	,
   MemberType:"",
   TransactionDate :"",
   AccountHolderName:""	, 
   AccountType :""	,
   Debit :0,
   Credit :0	,
   Balance :0,
   BBF :0,
  UnAuthorized :"",
  SiteCode:0 ,
  }; 
   searchText: string[];
  searchTerm: string = '';
  pageSize: number = 100;
  currentPage: number = 1;
  filteredreports:Report[]= [];

  isDeletingreport:boolean=false





  ngOnInit(): void {

       this.reportService.getAllReports().subscribe((t) => {
    this.reportdata = t;
    const startIndex = (this.currentPage - 1) * this.pageSize;
    const endIndex = startIndex + this.pageSize;


    this.filteredreports = t;
    const lastlist = this.reportdata.pop();
    this.reportdata.unshift(lastlist);
    this.filteredreports = this.reportdata.slice(startIndex, endIndex);
    console.log("con",this.reportdata)
    
  });


} 
startDate: string;
endDate: string;
generateReport() {
  if (this.startDate && this.endDate) {
    const start = new Date(this.startDate);
    const end = new Date(this.endDate);
    this.filteredreports = this.reportdata.filter(report => {
      const reportDate = new Date(report.TransactionDate);
      return reportDate >= start && reportDate <= end;
    });
  }
}
onNextPage() {
  this.currentPage++;
  this.updateFilteredreports();
}
onPreviousPage() {
  if (this.currentPage > 1) {
    this.currentPage--;
    this.updateFilteredreports();
  }
}
private updateFilteredreports() {
  const startIndex = (this.currentPage - 1) * this.pageSize;
  const endIndex = startIndex + this.pageSize;

  this.filteredreports = this.reportdata.slice(startIndex, endIndex);
}
 buttons = [

  { label: 'Transfer', route: '/user/:id/Transfer' },
  { label: 'Assign', route: '/user/:id/Assign' },
  { label: 'List', route: '/user/:id/List' },
  { label: 'Register report', route: '/user/:id/Add' }

];



exportToExcel() {
  // Define headers for Excel columns
  const headers = [
    { header: 'AccountNo', key: 'accountNo', width: 15, alignment: { horizontal: 'left' as const } },
    { header: 'SerialNo', key: 'serialNo', width: 15, alignment: { horizontal: 'left' as const } },
    { header: 'MemberCode', key: 'memberCode', width: 20, alignment: { horizontal: 'left' as const } },
    { header: 'MemberType', key: 'memberType', width: 15, alignment: { horizontal: 'left' as const } },
    { header: 'TransactionDate', key: 'transactionDate', width: 20, alignment: { horizontal: 'left' as const } },
    { header: 'AccountHolderName', key: 'accountHolderName', width: 25, alignment: { horizontal: 'left' as const } },
    { header: 'AccountType', key: 'accountType', width: 15, alignment: { horizontal: 'left' as const } },
    { header: 'Debit', key: 'debit', width: 15, alignment: { horizontal: 'left' as const } },
    { header: 'Credit', key: 'credit', width: 15, alignment: { horizontal: 'left' as const } },
    { header: 'Balance', key: 'balance', width: 15, alignment: { horizontal: 'left' as const } },
    { header: 'BBF', key: 'bbf', width: 15, alignment: { horizontal: 'left' as const } },
    { header: 'UnAuthorized', key: 'unauthorized', width: 15, alignment: { horizontal: 'left' as const } },
    { header: 'SiteCode', key: 'siteCode', width: 15, alignment: { horizontal: 'left' as const } },
  ];

  // Create a new workbook
  const workbook = new ExcelJS.Workbook();
  const worksheet = workbook.addWorksheet('Sheet1');
  worksheet.columns = headers;

  // Apply bold style to the first row and adjust font size
  worksheet.getRow(1).font = { bold: true, size: 12 };

  // Populate worksheet with data
  this.filteredreports.forEach((item, index) => {
    const rowData = {
      accountNo: item.AccountNo,
      serialNo: item.SerialNo,
      memberCode: item.MemberCode,
      memberType: item.MemberType,
      transactionDate: item.TransactionDate,
      accountHolderName: item.AccountHolderName,
      accountType: item.AccountType,
      debit: item.Debit,
      credit: item.Credit,
      balance: item.Balance,
      bbf: item.BBF,
      unauthorized: item.UnAuthorized,
      siteCode: item.SiteCode,
    };
    worksheet.addRow(rowData);
  });

  // Save the workbook or trigger download
  workbook.xlsx.writeBuffer().then((buffer) => {
    // Create a Blob from buffer
    const blob = new Blob([buffer], {
      type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    });

    // Trigger the download
    const fileName = 'table_data.xlsx';
    if ((navigator as any).msSaveBlob) {
      // For IE and Edge browsers
      (navigator as any).msSaveBlob(blob, fileName);
    } else {
      // For other browsers
      const link = document.createElement('a');
      link.href = URL.createObjectURL(blob);
      link.download = fileName;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  });
}

formatDate(dateString: string): string {
  const dateObj = new Date(dateString);
  const year = dateObj.getFullYear();
  const month = ('0' + (dateObj.getMonth() + 1)).slice(-2);
  const day = ('0' + dateObj.getDate()).slice(-2);
  return `${year}-${month}-${day}`;
}

onSearch() {
  // this.filteredreports = this.reports;
  if (this.searchTerm.trim() === '') {
    this.filteredreports = this.reportdata;
  } else {
    this.filteredreports = this.reportdata.filter((e) => {
      return (
        e.AccountNo.toString()
          .toLowerCase()
          .startsWith(this.searchTerm.toLowerCase()) ||
        e.AccountHolderName
          .toLowerCase()
          .startsWith(this.searchTerm.toLowerCase()) ||
        e.MemberType
          .toLowerCase()
          .startsWith(this.searchTerm.toLowerCase()) ||
          e.MemberCode.toString()
          .toLowerCase()
          .startsWith(this.searchTerm.toLowerCase()) ||
        e.TransactionDate
          .toLowerCase()
          .startsWith(this.searchTerm.toLowerCase()) 
      
      );
    });
  }
}


      }

