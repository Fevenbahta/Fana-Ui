import { DOCUMENT } from '@angular/common';
import { Component, Inject, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { FanaTransactions, Transfer } from 'app/models/data.model';
import { AuthService } from 'app/service/auth.service';
import { ReportService } from 'app/service/report.service';
import { TransactionService } from 'app/service/transaction.service';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import * as ExcelJS from 'exceljs';
import { catchError, of } from 'rxjs';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
@Component({
  selector: 'app-fana-account-statement',
  templateUrl: './fana-account-statement.component.html',
  styleUrls: ['./fana-account-statement.component.css'],
  
})
export class FanaAccountStatementComponent {
 reportdata: FanaTransactions[] = [];
  approvalSlips: Transfer[] = [];
  alltransaction:Transfer[] = [];
  // Initialize addReportData with the new properties
// Initialize addReportData with empty/default properties
addReportData: FanaTransactions = {
  customeR_NAME: "",                // Empty string
  side: "",                         // Empty string
  discription: "",                  // Empty string
  tdate: "",                       // Empty string (you can use new Date() if you prefer a date object)
  branch: "",                       // Empty string
  inbranch: "",                     // Empty string
  amount: 0,                       // Default number
  event: "",                        // Empty string
  operation: "",                   // Empty string
  pie: "",                          // Empty string
  r_NO: "0",                       // String representation of zero
  balbb: 0,                        // Default number
  typ: "",                          // Empty string
  noseq: 0,                        // Default number
  uti: "",                          // Empty string
  uta: "",                          // Empty string
  debit: null,                     // Set to null
  credit: 0,                       // Default number
  runninG_TOTAL: 0                 // Default number
};
selectedType: string = '';
startDate: Date;
endDate: Date;

  searchText: string[] = [];
  searchTerm: string = '';

  filteredreports: FanaTransactions[] = [];
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
    this.transactionService.getStatementsByDateRange(startDateString, endDateString).pipe(
        catchError(error => {
            console.error('Error fetching transactions:', error);
            this.ngxService.stop();
            return of([]); // Return an empty array if an error occurs
        })
    ).subscribe((t) => {
        this.reportdata = t; // Store the fetched data

        // Filter transactions based on the selected date range
        this.filteredreports = this.reportdata.filter(report => {
            const reportDate = new Date(report.tdate);
            const typeMatch = this.selectedType ? report.side === this.selectedType : true;
            return typeMatch && reportDate >= start && reportDate < end;
        });
        this.calculateTransactionTotals(this.startDate,this.endDate)

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
      { header: 'Transaction Date', key: 'transDate', width: 20, alignment: { horizontal: 'left' as const } },
      { header: 'Credit', key: 'credit', width: 25, alignment: { horizontal: 'left' as const } },
      { header: 'Debit', key: 'debit', width: 15, alignment: { horizontal: 'left' as const } },
      { header: 'Total Remaining', key: 'total', width: 20, alignment: { horizontal: 'left' as const } },
      { header: 'Reason', key: 'reason', width: 15, alignment: { horizontal: 'left' as const } },
    ];

    // Create a new workbook
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('Account Statment');

    worksheet.columns = headers.map(header => ({
      header: " ",
      key: header.key,
      width: header.width,
      alignment: header.alignment,
    }));

    // Add title columns before the data
    const titleColumns1 = [
      ['', '', 'LION INTERNATIONAL BANK'],
      ['', '', 'Account Statment'],
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
      [`Date covered: From ${new Date(this.startDate).toISOString().split('T')[0]} To: ${new Date(this.endDate).toISOString().split('T')[0]}`]
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
        transDate: item.tdate,
        credit: item.credit,
        debit: item.debit,
        total: item.runninG_TOTAL,
        reason: item.discription,
      };
      worksheet.addRow(rowData);
    });


    worksheet.addRow([]);

    // Add summary section
    worksheet.addRow(["Summary"]);
    worksheet.lastRow.font = { bold: true }; // Make header bold
    worksheet.addRow([`Date covered: From ${new Date(this.startDate).toISOString().split('T')[0]} To: ${new Date(this.displayDate).toISOString().split('T')[0]}`]);
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
       <div class="title container2">Account Statment</div>
       <div>Account Name: Fana Youth Saving And Credit Limited Cooperative</div>
       <div>Account Number: 00310095104-87</div>
       <div>BRANCH: MEKELE MARKET</div>
       <div>Date covered: From ${new Date(this.startDate).toISOString().split('T')[0]} To: ${new Date(this.endDate).toISOString().split('T')[0]}</div>
   <table>
          <tr>
            <th>No</th>
            <th>Transaction Date</th>
            <th>Credit</th>
            <th>Debit</th>
            <th>Total Remaining</th>
            <th>Reason</th>
          </tr>
    `;

    this.filteredreports.forEach((item, index) => {
      content += `
        <tr>
          <td>${index + 1}</td>
          <td>${item.tdate}</td>
          <td>${item.credit}</td>
          <td>${item.debit}</td>
          <td>${item.runninG_TOTAL}</td>
          <td>${item.discription}</td>
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


}
