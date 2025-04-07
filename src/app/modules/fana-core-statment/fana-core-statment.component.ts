import { DOCUMENT } from '@angular/common';
import { Component, Inject, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { FanaCoreTransactions, FanaTransactions, Transfer } from 'app/models/data.model';
import { AuthService } from 'app/service/auth.service';
import { ReportService } from 'app/service/report.service';
import { TransactionService } from 'app/service/transaction.service';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import * as ExcelJS from 'exceljs';
import { catchError, of } from 'rxjs';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';

@Component({
  selector: 'app-fana-core-statment',
  templateUrl: './fana-core-statment.component.html',
  styleUrls: ['./fana-core-statment.component.css']
})
export class FanaCoreStatmentComponent {
reportdata: FanaCoreTransactions[] = [];
reportdata2:Transfer[]=[]
filteredreports2:Transfer[]=[]
  approvalSlips: Transfer[] = [];
  alltransaction:Transfer[] = [];
  // Initialize addReportData with the new properties
// Initialize addReportData with empty/default properties
addReportData: FanaCoreTransactions = {
  refNo: '',
  operation: '',
  debit_Acc_Branch: '',
  debited_AccNo: '',
  debited_AccName: '',
  credited_Account: '',
  credited_Name: '',
  side: '',
  amount: 0,
  user1: '',
  date1: '', // Default to current date
  time1: '' ,// You can set this to a default time format if needed
  runningTotal:0
};

selectedType: string = '';
startDate: Date;
endDate: Date;

startDatecore: string;
endDatecore: string;
  searchText: string[] = [];
  searchTerm: string = '';

  filteredreports: FanaCoreTransactions[] = [];
  isDeletingreport: boolean = false;
 
  totalCredited:number=0;
  totalDebited:number=0;
  lastRemainingBalance:number=0;
  displayDate:Date;

  constructor(
    private transactionService: TransactionService,   
    private dialog: MatDialog,
    private authService: AuthService, private ngxService: NgxUiLoaderService,

  ) { }
  currentPage = 1; // Current page
  pageSize = 100; // Number of items per page
  availablePageSizes = [5, 10, 20, 50,100,200]; // Options for items per page

  // Function to get paginated reports
  get paginatedReports() {
    const startIndex = (this.currentPage - 1) * this.pageSize;
    return this.filteredreports.slice(startIndex, startIndex + this.pageSize);
  }


  fetchTransactions() {
    if (!this.startDate || !this.endDate) {
      alert('Please select both start and end dates.');
      return;
    }

    this.transactionService.getTransactionsByDateRange(this.startDatecore, this.endDatecore).subscribe({
      next: (data) => {
        this.filteredreports = data;
      },
      error: (err) => {
        console.error('Error fetching transactions:', err);
      }
    });
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
  ngOnInit(): void {
    this.transactionService.getAllTransactions().subscribe((t) => {
      this.reportdata2 =t.filter(t=>t.status=='Approved');;
      const startIndex = (this.currentPage - 1) * this.pageSize;
      const endIndex = startIndex + this.pageSize;

      this.filteredreports2 = t.filter(t=>t.status=='Approved');
     //  const lastlist = this.reportdata.pop();
     //  this.reportdata.unshift(lastlist);
     //  this.filteredreports = this.reportdata.slice(startIndex, endIndex);

      
  })
}
formatDateTime(date: string, time: string): string {
  if (!date || !time) return '';  // Return empty string if either is missing
  
  // Ensure the date and time are in the correct format (2025-04-01 17:44:29.758)
  const formattedDate = new Date(date).toLocaleDateString(); // Convert date to 'MM/DD/YYYY'
  const formattedTime = time;  // Assuming time is already in the correct format
  
  return `${formattedDate} ${formattedTime}`;
}

generateReport() {
  this.ngxService.start();

  // Check if both startDate and endDate are provided, if not return early with an alert
  if (!this.startDate || !this.endDate) {
      alert('Please provide both start date and end date for the search.');
      this.ngxService.stop();
      return; // Stop further execution if dates are not provided
  }

  // Convert the dates to MM/DD/YYYY format for the API call
  const startDateString = this.formatDateToApiString(this.startDate);
  const endDateString = this.formatDateToApiString(this.endDate);

  // Parse the dates from the input
  const start = new Date(this.startDate);
  const end = new Date(this.endDate);

  // Check if the startDate is before the endDate
  if (start > end) {
      alert('Start date cannot be later than end date.');
      this.ngxService.stop();
      return;
  }

  // Adjust end date to include the full day's range
  end.setDate(end.getDate() + 1);

  // Fetch transactions within the date range
  this.transactionService.getTransactionsByDateRange(startDateString, endDateString).pipe(
      catchError(error => {
          console.error('Error fetching transactions:', error);
          this.ngxService.stop();
          return of([]); // Return an empty array if an error occurs
      })
  ).subscribe((t) => {
      this.reportdata = t; // Store the fetched data

      // Filter transactions based on the selected date range
      this.filteredreports = this.reportdata
          .filter(report => {
              const reportDate = new Date(report.date1);
              const typeMatch = this.selectedType ? report.side === this.selectedType : true;
              return typeMatch && reportDate >= start && reportDate < end;
          })
          .map(report => {
              // If debited_AccName is empty, find and assign from filteredreports2 by refNo
              if (report.debited_AccNo === "24107700003" && report.refNo) {
                  var matchingReport = this.filteredreports2.find(r => {
                      // Trim and make both strings lowercase for comparison
                      console.log("Comparing Payment No:", String(r.paymentNo).trim(), "with RefNo:", String(report.refNo).trim());
                      return r.paymentNo && String(r.paymentNo).trim().toLowerCase() === String(report.refNo).trim().toLowerCase();
                  });

                  console.log("Matching Report:", matchingReport);
                  if (matchingReport) {
                      report.debited_AccName = matchingReport.dDepositeName; 
                  } else {
                      console.log("No matching report found for refNo:", report.refNo);
                  }
              }
              return report;
          });

      this.calculateTransactionTotals();

      this.ngxService.stop(); // Stop the service after processing
  });
}


// Helper function to format Date object to MM/DD/YYYY string for API call
private formatDateToApiString(date: Date): string {
    const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are 0-based
    const day = String(date.getDate()).padStart(2, '0');
    const year = date.getFullYear();
    return `${month}/${day}/${year}`; // Return in MM/DD/YYYY format
}

calculateTransactionTotals() {
  this.totalDebited = this.filteredreports.reduce((sum, item) => sum + (item.side === 'D' ? item.amount : 0), 0);
  this.totalCredited = this.filteredreports.reduce((sum, item) => sum + (item.side === 'C' ? item.amount : 0), 0);
  this.lastRemainingBalance = this.filteredreports.length > 0 ? this.filteredreports[0].runningTotal : 0;

  console.log("Total Debit:", this.totalDebited);
  console.log("Total Credit:", this.totalCredited);
  console.log("Total Remaining:", this.lastRemainingBalance);
}


  
  getAccountDetails(date: string, amount: number): { debitorName: string, debitorAccount: string } {
    // Convert date to the desired format (assuming date is in 'YYYY-MM-DD' format)
    const formattedDate = date.split('T')[0]; // This will strip the time portion
  
    const matchingTransaction = this.alltransaction.find(transaction =>
      transaction.transDate.split('T')[0] === formattedDate && transaction.amount === amount
    );
  
    return {
      debitorName: matchingTransaction ? matchingTransaction.dDepositeName : 'Not Found',
      debitorAccount: matchingTransaction ? matchingTransaction.dAccountNo : 'Not Found'
    };
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
      { header: 'No', key: 'no', width: 20, alignment: { horizontal: 'left' as const } },
      { header: 'Reference No', key: 'refNo', width: 20, alignment: { horizontal: 'left' as const } },
      { header: 'Transaction Date', key: 'transDate', width: 20, alignment: { horizontal: 'left' as const } },
      { header: 'Debited Account No', key: 'debitedAccNo', width: 20, alignment: { horizontal: 'left' as const } },
      { header: 'Debited Account Name', key: 'debitedAccName', width: 15, alignment: { horizontal: 'left' as const } },
      { header: 'Credited Account No', key: 'creditedAccount', width: 20, alignment: { horizontal: 'left' as const } },
      { header: 'Credited Account Name', key: 'creditedName', width: 15, alignment: { horizontal: 'left' as const } },
      { header: 'Amount', key: 'amount', width: 25, alignment: { horizontal: 'left' as const } },
      { header: 'Side', key: 'side', width: 15, alignment: { horizontal: 'left' as const } },
      { header: 'RunningTotal', key: 'runningTotal', width: 15, alignment: { horizontal: 'left' as const } },
    ];
  
    // Create a new workbook
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('Account Statement');
  
    worksheet.columns = headers.map(header => ({
      header: " ",
      key: header.key,
      width: header.width,
      alignment: header.alignment,
    }));
  
    // Add title columns before the data
    const titleColumns1 = [
      ['', '', 'LION INTERNATIONAL BANK'],
      ['', '', 'Account Statement'],
    ];
  
    // Insert title columns into worksheet
    titleColumns1.forEach((row, rowIndex) => {
      row.forEach((value, colIndex) => {
        worksheet.getCell(rowIndex + 1, colIndex + 3).value = value; // Insert into 3rd column (colIndex + 3)
        worksheet.getCell(rowIndex + 1, colIndex + 3).font = { bold: true }; // Make bold
      });
    });
  
    // Insert title columns before the data
    const titleColumns = [
      ['Fana Youth Saving And Credit Limited Cooperative'],
      ['00310095104-87'],
      ['BRANCH: MEKELE MARKET'],
      [`Date covered: From ${new Date(this.startDate).toString().split('T')[0]} To: ${new Date(this.endDate).toString().split('T')[0]}`]
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
  
    // Format the transaction date and time before adding to the worksheet
    this.filteredreports.forEach((item, index) => {
      const rowData = {
        no: index + 1, // Adjust index for 1-based numbering
        transDate: this.formatDateTime(item.date1.toString(), item.time1),  // Combine date and time
        refNo: item.refNo,
        amount: item.amount,
        side: item.side,
        debitedAccNo: item.debited_AccNo,
        debitedAccName: item.debited_AccName,
        creditedAccount: item.credited_Account,
        creditedName: item.credited_Name,
        runningTotal: item.runningTotal
      };
      worksheet.addRow(rowData);
    });
  
    worksheet.addRow([]);
  
    // Add summary section
    worksheet.addRow(["Summary"]);
    worksheet.lastRow.font = { bold: true }; // Make header bold
    worksheet.addRow([`Date covered: From ${new Date(this.startDate).toString().split('T')[0]} To: ${new Date(this.endDate).toString().split('T')[0]}`]);
    worksheet.lastRow.font = { bold: true }; // Make the header bold
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
         return;
    }

    // Construct HTML content for PDF
    let content = `
      <html>
      <head>
        <style>
         body {
           font-family: Arial, sans-serif;
               font-size: 10px;
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
           padding: 4px;
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
       <div class="title container2">Account Statment</div>
       <div>Account Name: Fana Youth Saving And Credit Limited Cooperative</div>
       <div>Account Number: 00310095104-87</div>
       <div>BRANCH: MEKELE MARKET</div>
       <div>Date covered: From ${new Date(this.startDate).toString().split('T')[0]} To: ${new Date(this.endDate).toString().split('T')[0]}</div>
   <table>
          <tr>
            <th>No</th> <th>Reference No </th>
            <th>Transaction Date</th>
                  
                     <th>Debit Account</th> 
              <th>Debit Account Name</th>
         <th>Credited Account</th>
          <th>Credited Account Name</th>
          <th>Amount</th>  
                    <th>Side</th>      
         <th>Running Total</th>      
      
         
         
          </tr>
    `;

    this.filteredreports.forEach((item, index) => {
      content += `
        <tr>
          <td>${index + 1}</td>
               <td>${item.refNo}</td>
          <td>${this.formatDateTime(item.date1.toString(), item.time1)}</td>
  
          <td>${item.debited_AccNo}</td>
          <td>${item.debited_AccName}</td>
             <td>${item.credited_Account}</td>
          <td>${item.credited_Name}</td>
                   <td>${item.amount}</td>
          <td>${item.side}</td> 
          <td>${item.runningTotal}</td>
        </tr>
      `;
    });

    content += `
        </table>
      </body>
      </html>
    `;
    content += `
    <div style="margin-top: 20px; font-weight: bold;">
        <div>From ${new Date(this.startDate).toString().split('T')[0]} To: ${new Date(this.endDate).toString().split('T')[0]}</div>

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


}
