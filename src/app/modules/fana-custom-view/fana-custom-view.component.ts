import { DOCUMENT } from '@angular/common';
import { Component, Inject } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { FanaTransactions, Transfer } from 'app/models/data.model';
import { AuthService } from 'app/service/auth.service';
import { ReportService } from 'app/service/report.service';
import { TransactionService } from 'app/service/transaction.service';
import { Console } from 'console';
import * as ExcelJS from 'exceljs';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { catchError, of } from 'rxjs';

@Component({
  selector: 'app-fana-custom-view',
  templateUrl: './fana-custom-view.component.html',
  styleUrls: ['./fana-custom-view.component.css']
})
export class FanaCustomViewComponent {
 
   constructor(
     private transactionService: TransactionService,   
   private ngxService: NgxUiLoaderService,
      private dialog: MatDialog,
       private authService: AuthService,) { }
 
   reportdata:Transfer[]=[]
   approvalSlips:Transfer[]=[]
 
 
   addReportData:Transfer = { 
     id:0,
   memberId: "",
 depositorPhone: "",
   amount: 0,
   transType:"",
   transDate:"",
   createdBy:"",
   approvedBy:"",
   status:"",
   updatedDate:"",
   updatedBy:"",
   cAccountBranch: "",
   cAccountNo: "",
   cAccountOwner: "",
   dAccountNo: "",
   dDepositeName: "",
  branch: "",
   referenceNo: "",
   messsageNo: "",
   paymentNo: "",
   }; 
    searchText: string[];
   searchTerm: string = '';

   filteredreports:Transfer[]= [];
 
   isDeletingreport:boolean=false
 
 totalCredited:number=0;
 totalDebited:number=0;
 lastRemainingBalance:number=0;
 displayDate:Date;
 
   ngOnInit(): void {
 
 this.ngxService.start()
     this.transactionService.getAllTransactions().subscribe((t) => {
       this.reportdata =t.filter(t=>t.status=='Approved');;
       const startIndex = (this.currentPage - 1) * this.pageSize;
       const endIndex = startIndex + this.pageSize;
   
   this.ngxService.stop()
       this.filteredreports = t.filter(t=>t.status=='Approved');
      //  const lastlist = this.reportdata.pop();
      //  this.reportdata.unshift(lastlist);
      //  this.filteredreports = this.reportdata.slice(startIndex, endIndex);
 
       
     });
   
 
 } 
 startDate: Date;
 endDate: Date;



 currentPage = 1; // Current page
 pageSize = 100; // Number of items per page
 availablePageSizes = [5, 10, 20, 50,100,200]; // Options for items per page

 // Function to get paginated reports
 get paginatedReports() {
   const startIndex = (this.currentPage - 1) * this.pageSize;
   return this.filteredreports.slice(startIndex, startIndex + this.pageSize);
 }

 // Function to handle page change
 changePage(page: number) {
   this.currentPage = page;
 }

 // Method to calculate total pages
 get totalPages() {
   return Math.ceil(this.filteredreports.length / this.pageSize);
 }

 // Function to update page size and reset to first page
 onPageSizeChange(newPageSize: number) {
   this.pageSize = newPageSize;
   this.currentPage = 1; // Reset to first page
 }



 generateReport() {
  this.ngxService.start()
   if (this.startDate && this.endDate) {
     const start = new Date(this.startDate);
     const end = new Date(this.endDate);
 this.ngxService.stop()
     // Adjust start and end to include full day's range
     end.setDate(end.getDate() + 1);
 
     this.filteredreports = this.reportdata.filter(report => {
       const reportDate = new Date(report.transDate);
       return reportDate >= start && reportDate < end; // Use < end to filter up to but not including end date
     });
   }
   this.calculateTransactionTotals(this.startDate,this.endDate)
   this.ngxService.stop()
 }
 



 private formatDateToApiString(date: Date): string {
  const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are 0-based
  const day = String(date.getDate()).padStart(2, '0');
  const year = date.getFullYear();
  return `${month}/${day}/${year}`; // Return in MM/DD/YYYY format
}


  // Method to calculate total credited, debited amounts and the last remaining balance
calculateTransactionTotals(startDate: Date, endDate: Date): void {
  const startDateString = this.formatDateToApiString(startDate);
  const endDateString = this.formatDateToApiString(endDate);

  // Parse the dates from the input
  const start = new Date(startDate);
  const end = new Date(endDate);

  // Check if the startDate is before the endDate
  if (start > end) {
    alert('Start date cannot be later than end date.');
    this.ngxService.stop();
    return;
  }

  // Adjust end date to include the full day's range
  end.setDate(end.getDate() + 1);

  // Fetch transactions within the date range
  this.transactionService.getStatementsByDateRange(startDateString, endDateString).pipe(
    catchError(error => {
      console.error('Error fetching transactions:', error);
      this.ngxService.stop();
      return of([]); // Return an empty array if an error occurs
    })
  ).subscribe((transactions) => {
    // Filter transactions based on the selected date range
    const filteredReports = transactions.filter(report => {
      const reportDate = new Date(report.tdate);
         return  reportDate >= start && reportDate < end;
    });

    // Calculate total credited and debited amounts
     this.totalCredited = 0;
     this.totalDebited = 0;
     this.lastRemainingBalance = 0;
 
    filteredReports.forEach(report => {
      if (report.side === 'C') {
        this.totalCredited += report.amount;  // Assuming the 'amount' field represents the credited amount
      } else if (report.side === 'D') {
        this.totalDebited += report.amount;  // Assuming the 'amount' field represents the debited amount
      }
      // Set the last remaining balance as the balance after each transaction
      this.lastRemainingBalance = report.runninG_TOTAL;
      this.displayDate=report.tdate;
    });

    // Output the results
   
    this.ngxService.stop(); // Stop the service after processing
  });
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
   { label: 'Statment Report', route: '/FanaReport', role: ['0078','0041', '0048', '0049','0017'] },
     { label: 'Branch Report', route: '/BranchReport', role: ['0041', '0048', '0049'] },
     { label: 'General Report', route: '/GeneralReport', role: ['0078','0017'] },
     { label: 'Fana Report', route: '/FanaCustom', role: ['Admin'] },
     { label: 'Fana-All-Account-Statment', route: '/FanaStatment', role: ['Admin'] },
   
 ];
 
 filterButtonsByRole(): { label: string; route: string }[] {
   const userRoles = this.authService.getrole();
 
   // Filter buttons based on roles
   return this.buttons.filter(button => {
     // If role is not defined or empty, include the button
     if (!button.role || button.role.length === 0) {
       return true;
     }
     
     // Check if any of the user's roles match with the button's roles
     return button.role.some(role => userRoles.includes(role));
   });
 }
 
 
 exportToExcel() {
   // Define headers for Excel columns
   const headers = [
     { header: 'No', key: 'no', width: 10, alignment: { horizontal: 'left' as const } },
     { header: 'Transaction Date', key: 'transDate', width: 20, alignment: { horizontal: 'left' as const } },
     { header: 'Depositor Full Name', key: 'dDepositeName', width: 25, alignment: { horizontal: 'left' as const } },
     { header: 'Fana Member Id', key: 'memberId', width: 15, alignment: { horizontal: 'left' as const } },
     { header: 'Depositor Phone Number', key: 'depositorPhone', width: 20, alignment: { horizontal: 'left' as const } },
     { header: 'Lib Transaction No', key: 'referenceNo', width: 15, alignment: { horizontal: 'left' as const } },
     { header: 'Amount', key: 'amount', width: 15, alignment: { horizontal: 'left' as const } },
     { header: 'Transaction Type', key: 'transType', width: 20, alignment: { horizontal: 'left' as const } },
     { header: 'Credited To', key: 'cAccountOwner', width: 20, alignment: { horizontal: 'left' as const } },
     
   ];
 
   // Create a new workbook
   const workbook = new ExcelJS.Workbook();
   const worksheet = workbook.addWorksheet('Transaction Report');
 
     
   worksheet.columns = headers.map(header => ({
     header: " ",
     key: header.key,
     width: header.width,
     alignment: header.alignment,
   })); 
 
 
   // Apply headers to worksheet columns
 
     // Add title columns before the data
     const titleColumns1 = [
       ['', '', 'LION INTERNATIONAL BANK'],
       ['', '', 'TRANSACTION REPORT'],
          ];
   
     // Insert title columns into worksheet
     titleColumns1.forEach((row, rowIndex) => {
       row.forEach((value, colIndex) => {
         worksheet.getCell(rowIndex + 1, colIndex + 3).value = value; // Insert into 3rd column (colIndex + 3)
         worksheet.getCell(rowIndex + 1, colIndex + 3).font = { bold: true }; // Make bold
       });
     });
   
   // Add title columns before the data
   const titleColumns = [
 
     ['Fana Youth Saving And Credit Limited Cooperative'],
     ['00310095104-87'],
     ['BRANCH: MEKELE MARKET'],
     [`Date covered: From ${new Date(this.startDate).toISOString().split('T')[0]} To: ${new Date(this.displayDate).toISOString().split('T')[0]}`]
    ];
 
   // Insert title columns into worksheet
   titleColumns.forEach((row, rowIndex) => {
     row.forEach((value, colIndex) => {
       worksheet.getCell(rowIndex + 3, colIndex === 0 ? 1 : 3).value = value; // Insert into 1st column if colIndex is 0, otherwise 3rd column
       worksheet.getCell(rowIndex + 3, colIndex === 0 ? 1 : 3).font = { bold: true }; // Make bold
     });
   });
 
   // Apply headers to worksheet columns starting from the 4th row (after the titles)
 
 
 
     const headerRow = worksheet.addRow(headers.map(header => header.header)); // Add headers
      headerRow.font = { bold: true }; // Make headers bold
 
 
      worksheet.columns.forEach((column, index) => {
      column.width = headers[index].width;
       column.alignment = headers[index].alignment;
      });
 
 
   this.filteredreports.forEach((item, index) => {
     const rowData = {
       no: index + 1, // Adjust index for 1-based numbering
       transDate: item.transDate,
       dDepositeName: item.dDepositeName,
       memberId: item.memberId,
       depositorPhone: item.depositorPhone,
       referenceNo: item.referenceNo,
       amount: item.amount,
       transType: item.transType,
       cAccountOwner:item.cAccountOwner
     };
     worksheet.addRow(rowData);
   });
 
   worksheet.addRow([]);

   // Add summary section
   worksheet.addRow(["Summary"]);
   worksheet.lastRow.font = { bold: true }; // Make header bold
   worksheet.addRow([`Date covered: From ${new Date(this.startDate).toISOString().split('T')[0]} To: ${new Date(this.displayDate).toISOString().split('T')[0]}`]);
  
    worksheet.addRow(["", "Total Credited Amount:", this.totalCredited]);
   worksheet.addRow(["", "Total Debited Amount:", this.totalDebited]);
   worksheet.addRow(["", "Last Remaining Balance:", this.lastRemainingBalance]);
   
   // Format amount cells (optional)
   worksheet.getRow(worksheet.rowCount - 2).getCell(3).numFmt = '#,##0';
   worksheet.getRow(worksheet.rowCount - 1).getCell(3).numFmt = '#,##0';
   worksheet.getRow(worksheet.rowCount).getCell(3).numFmt = '#,##0';
   
   // Save the workbook or trigger download
   workbook.xlsx.writeBuffer().then((buffer) => {
     // Create a Blob from buffer
     const blob = new Blob([buffer], {
       type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
     });
 
     // Trigger the download
     const fileName = 'transaction_report.xlsx';
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
 
 
 exportToPDF() {
   // Ensure filteredreports has data
   if (this.filteredreports.length === 0) {
     console.log('No data to export.');
     return;
   }
 
   // Construct HTML content for PDF
   let content = `
     <html>
     <head>
       <style>
         body {
           font-family: Arial, sans-serif;
         }
         .title {
           font-size: 20px;
           font-weight: bold;
           margin-bottom: 10px;
                margin-top: 10px;
         }
         .container {
           margin-left: 300px;
         }
         .container2 {
           margin-left: 320px;
         }
         .header {
           display: flex;
           justify-content: center;
           align-items: center;
           margin-bottom: 10px;
         }
         .header img {
           width: 50px;
           height: auto;
           margin-right: 10px;
         }
         table {
           width: 100%;
           border-collapse: collapse;
           margin-top: 20px;
         }
         th, td {
           border: 1px solid #dddddd;
           text-align: left;
           padding: 8px;
         }
         th {
           background-color: #f2f2f2;
         }
       </style>
     </head>
     <body>
       <div class="header">
         <img src="/assets/img/logolib.png"alt="LION INTERNATIONAL BANK S.C Logo">
         <div class="title">LION INTERNATIONAL BANK S.C</div>
       </div>
       <div class="title container2">Transaction Report</div>
       <div>Account Name: Fana Youth Saving And Credit Limited Cooperative</div>
       <div>Account Number: 00310095104-87</div>
       <div>BRANCH: MEKELE MARKET</div>
     <div>Date covered: From ${new Date(this.startDate).toISOString().split('T')[0]} To: ${new Date(this.displayDate).toISOString().split('T')[0]}</div>
    <table>
         <thead>
           <tr>
             <th>No</th>
             <th>Transaction Date</th>
             <th>Depositor Full Name</th>
             <th>Fana Member Id</th>
             <th>Depositor Phone Number</th>
             <th>Lib Transaction No</th>
             <th>Amount</th>
             <th>Transaction Type</th>
             <th>Credited To</th>
           </tr>
         </thead>
         <tbody>
   `;
 
   // Add rows of data to the content
   this.filteredreports.forEach((item, index) => {
     content += `
       <tr>
         <td>${index + 1}</td>
         <td>${item.transDate}</td>
         <td>${item.dDepositeName}</td>
         <td>${item.memberId}</td>
         <td>${item.depositorPhone}</td>
         <td>${item.referenceNo}</td>
         <td>${item.amount}</td>
         <td>${item.transType}</td>
          <td>${item.cAccountOwner}</td>
         
       </tr>
     `;
   });



   // Close the table and body tags
   content += `
         </tbody>
       </table>
       
     </body>
     </html>
   `;
   content += `
   <div style="margin-top: 20px; font-weight: bold;">
      <div>From ${new Date(this.startDate).toISOString().split('T')[0]} To: ${new Date(this.displayDate).toISOString().split('T')[0]}</div>

       <p>Total Credited Amount: ${this.totalCredited.toLocaleString()}</p>
     <p>Total Debited Amount: ${this.totalDebited.toLocaleString()}</p>
     <p>Last Remaining Balance: ${this.lastRemainingBalance.toLocaleString()}</p>
   </div>
`;
   const pdfWindow = window.open('', '_blank');
    pdfWindow.document.write(content);
    pdfWindow.document.close();
    pdfWindow.focus();
    pdfWindow.print();
 }
 
 
 convertHtmlToPdf(htmlContent) {
   const filename = 'transaction_report.pdf';
 
   // Create a new iframe element
   const iframe = document.createElement('iframe');
   iframe.style.display = 'none';
   document.body.appendChild(iframe);
 
   // Set iframe content with the provided HTML
   const doc = iframe.contentDocument || iframe.contentWindow.document;
   doc.open();
   doc.write(htmlContent);
   doc.close();
   const style = doc.createElement('style');
   style.textContent = '@page { size: landscape; }';
   doc.head.appendChild(style);
 
   // Wait for iframe to load content
   iframe.onload = () => {
     // Print the iframe content
     iframe.contentWindow.print();
 
     // Remove the iframe from the document
     setTimeout(() => {
       document.body.removeChild(iframe);
     }, 100);
   };
 }
 
 
 
 
 formatDate(dateString: string): string {
   const dateObj = new Date(dateString);
   const year = dateObj.getFullYear();
   const month = ('0' + (dateObj.getMonth() + 1)).slice(-2);
   const day = ('0' + dateObj.getDate()).slice(-2);
   return `${year}-${month}-${day}`;
 }
 
 print(transaction): void {
   const transTypeText = transaction.transType === 'Cash' ? 'Cash Deposit Saving' : 'Account to Account Transfer';
   const transDate = new Date(transaction.transDate);
   const dateOptions: Intl.DateTimeFormatOptions = { day: '2-digit', month: 'long', year: 'numeric' };
   const timeOptions: Intl.DateTimeFormatOptions = { hour: '2-digit', minute: '2-digit', hour12: false };
   const formattedDate = transDate.toLocaleDateString('en-GB', dateOptions);
   const formattedTime = transDate.toLocaleTimeString('en-GB', timeOptions);
 
   const printContent = `
     <div class="approval-slip">
        <a >
     <img src="/assets/img/LIBLogo2.jpg" class="logo-img" />
     <span class="slip-title">LION INTERNATIONAL BANK S.C</span>
   </a>
           <p class="date">Date .....: ${formattedDate} at ${formattedTime}</p>
         <div class="left-section">      <h6 class="cooperative-name"> ${transTypeText}  ACC. SLIP No. ${transaction.id}</h6>
         <p class="currency">Inputing Branch .....: ${transaction.branch}</p>
         <p class="currency">Currency ...: ETB ETHIOPIAN BIRR</p>
         <p class="teller">Authorized By .....: ${transaction.approvedBy}</p>
 
         <hr class="slip-divider">
 
         <div class="slip-section">
           <p>MR / MRS .....: ${transaction.dDepositeName}</p>
           <p>Debit Account No .....: ${transaction.dAccountNo}</p>
           <p>Debited Account Branch .....: ${transaction.cAccountBranch}</p>
           <p>Depositor Phone .....: ${transaction.depositorPhone}</p>
           <p>Member ID ......: ${transaction.memberId}</p>
               <p>Transaction Type ......: ${transaction.transType}</p>
         </div>
       </div>
 
       <div class="right-section">
         <div class="slip-section">
                <p>Credit Account Owner .....: ${transaction.cAccountOwner}</p>   
                <p>Credit Account Number .....: ${transaction.cAccountNo}</p>  
             <p>Amount .....: ${Number(transaction.amount).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} ETB</p>
             <p>Amount credited to account Branch .....: ${transaction.cAccountBranch}</p>
   
       
           <p>Transaction Date .....: ${formattedDate} at ${formattedTime}</p>
         </div>
       </div>
 
       <div class="clear"></div>
     </div>
   `;
 
   const img = new Image();
   img.src = '/assets/img/LIBLogo2.jpg';
   img.onload = () => {
     const WindowPrt = window.open('', '', 'left=0,top=0,width=800,height=900,toolbar=0,scrollbars=0,status=0');
     WindowPrt.document.write(`
       <html>
         <head>
           <title>Print</title>
         <style>
             body { margin: 0; font-family: 'Courier New', Courier, monospace;  font-size: 14px; }
             .approval-slip { max-width: 800px; margin: 0 auto; padding: 20px; border: 1px solid #000; }
                   .header { display: flex; align-items: center; justify-content: center; }
             .logo-img { width: 10%; height: 10%; margin-left: 120px; }
              .slip-title, .cooperative-name, .branch, .date, .teller { font-size: 14px; font-weight: normal; color: black; }
             .slip-divider { border: 0; height: 1px; background: #000; margin: 3px 0; }
             .slip-section { box-sizing: border-box; padding: 5px; }
             .slip-section p { margin: 3px 0; text-align: left; }
             .clear { clear: both; }
             .right-align { text-align: right; }
             .left-section { float: left; width: 50%; }
             .right-section { float: left; width: 50%; margin-top:27%}
             
             .slip-title span{ text-align: center; font-size: 16px; font-weight: bold;}
            
             .date {
   text-align: right;
   font-size: 14px;
 
   font-family: 'Courier New', Courier, monospace;
 }
   .logo-img{
   width:10%;
   height: 5%;
     }
           </style>
         </head>
         <body>
           ${printContent}
         </body>
       </html>
     `);
     WindowPrt.document.close();
     WindowPrt.focus();
     WindowPrt.print();
     WindowPrt.close();
   };
 }
 
 
 
 
 
 }