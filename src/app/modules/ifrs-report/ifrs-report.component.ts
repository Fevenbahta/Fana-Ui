import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { IfrsTransfer } from 'app/models/data.model';
import { AuthService } from 'app/service/auth.service';
import { IfrsTransactionService } from 'app/service/Ifrstransaction.service';
import * as ExcelJS from 'exceljs';
import { NgxUiLoaderService } from 'ngx-ui-loader';
function formatNumber(num) {
  return Number(num).toLocaleString('en-US', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
  });
}

@Component({
  selector: 'app-ifrs-report',
  templateUrl: './ifrs-report.component.html',
  styleUrls: ['./ifrs-report.component.css']
})



export class IFRSReportComponent {
 

  constructor(
    private ngxService: NgxUiLoaderService,
    private transactionService: IfrsTransactionService,   

     private dialog: MatDialog,
      private authService: AuthService,) { }
transaction:IfrsTransfer
  reportdata:IfrsTransfer[]=[]
  branchSearchTerm: string = '';
  accountSearchTerm: string = '';
  transferSearchTerm: string = '';
  selectedStatus:string = '';
 statusSearchTerm='Approved';
  DateSearchTerm:string="";
  startDate: string;
  endDate: string;
  addReportData:IfrsTransfer = { 
    id:0,
    updatedDate: "",
    updatedBy: "",
    status: "",
    serviceFee: 0,
    serviceFee2: 0,
    vat: 0,
    vat2: 0,
    inputing_Branch: "",
    transaction_Date:"",
    account_No: "",
    amount1: 0,
    phone_No :"",
    address :"",
    tinNo :"",
    debitor_Name :"",
    paymentMethod :"",
    refno: "",
    branch: "",
    cAccountNo: "",
    createdBy: "",
    approvedBy: "",
    messsageNo: "",
    paymentNo: "",
    paymentType: "",


    
  }; 
   searchText: string[];
  searchTerm: string = '';
  pageSize: number = 100;
  currentPage: number = 1;
  filteredreports:IfrsTransfer[]= [];

  isDeletingreport:boolean=false

  isLoading: boolean = false; // Add loading state variable
  loadingDots: string = ''; // Variable for dot animation
  dotIndex: number = 0; // Index for current dot
  loadingInterval: any; // Interval for dot animation

onMultipleSearch(): void {

  this.ngxService.start();
  // Check if both startDate and endDate are provided, if not return early with an alert
  if (!this.startDate || !this.endDate) {
    alert('Please provide both start date and end date for the search.');
    this.ngxService.stop();
    return; // Stop further execution if dates are not provided
  }
 const start = new Date(this.startDate);
  const end = new Date(this.endDate);

  // Check if the startDate is before the endDate
  if (start > end) {
    alert('Start date cannot be later than end date.');
    this.ngxService.stop();
    return;
  }

  // Set loading state
  this.isLoading = true;
  this.loadingDots = ''; // Reset dots
  this.startLoadingAnimation(); // Start loading animation

  // Convert startDate and endDate to Date objects and strip time
 
  // Fetch transactions with date parameters
  this.transactionService.processIfrsTransactions().subscribe(
    () => {

      // Pass start and end dates to get transactions by date interval
      this.transactionService.getIfrsTransactionsByDateInterval(this.startDate, this.endDate).subscribe(
        (transactions) => {

          this.ngxService.stop();
          // Filter transactions by paymentType
          const filteredTransactions = transactions.filter(transaction => this.isValidPaymentType(transaction));

          // Apply the date range filter
          const filteredByDate = filteredTransactions.filter(transaction => this.isWithinDateRange(transaction, start, end));

          // Apply other filters (branch, account, etc.)
          this.filteredreports = this.applyOtherFilters(filteredByDate);

          this.stopLoadingAnimation(); // Stop loading animation when done
        },
        (error) => {
          this.ngxService.stop();
          console.error('Error fetching transactions:', error);
          this.stopLoadingAnimation();
        }
      );
    },
    (error) => {
      this.ngxService.stop();
      console.error('Error processing transactions:', error);
      this.stopLoadingAnimation();
    }
  );
}


  // Check if payment type is valid for inclusion
  isValidPaymentType(transaction: IfrsTransfer): boolean {
    return ['ATMS', 'Derash'].includes(transaction.paymentType) ||
      ['RTGS', 'Cheque', 'Passbook'].includes(transaction.paymentType);
  }

  // Check if transaction date is within the provided date range
  isWithinDateRange(transaction: IfrsTransfer, start: Date, end: Date): boolean {
    const transactionDate = new Date(transaction.transaction_Date);
    return transactionDate >= start && transactionDate <= end;
  }

  // Apply all other filters (branch, account, status, etc.)
  applyOtherFilters(transactions: IfrsTransfer[]): IfrsTransfer[] {
    return transactions.filter(transaction => {

      
  if (transaction.paymentType === 'ATMS' ) {
    return true; // ATM approved (no branch restriction)
}
 else if ((transaction.paymentType === 'RTGS' || transaction.paymentType === 'Derash'||transaction.paymentType === 'Cheque'||transaction.paymentType === 'Passbook') && transaction.inputing_Branch === this.authService.getbranch())
   {
    return true; // RTGS approved and matches the branch
}
      const passesBranchFilter = this.branchSearchTerm === '' || transaction.inputing_Branch.includes(this.branchSearchTerm);
      const passesAccountFilter = this.accountSearchTerm === '' || transaction.account_No.includes(this.accountSearchTerm);
      const passesTransferFilter = this.transferSearchTerm === '' || transaction.paymentType.toLowerCase().includes(this.transferSearchTerm.toLowerCase());
      const passesStatusFilter = this.statusSearchTerm === 'All' ||
        (this.statusSearchTerm === 'Approved' && transaction.status === 'Approved') ||
        (this.statusSearchTerm === '' && transaction.status === '');
      return passesBranchFilter && passesAccountFilter && passesTransferFilter && passesStatusFilter;
    });
  }
  startLoadingAnimation() {
    this.loadingInterval = setInterval(() => {
      this.dotIndex = (this.dotIndex + 1) % 4; // Cycle through 0 to 3
      this.loadingDots = '.'.repeat(this.dotIndex); // Update dots based on index
    }, 500); // Change the dots every 500ms
  }

  stopLoadingAnimation() {
    this.isLoading = false; // Set loading state to false
    clearInterval(this.loadingInterval); // Clear the interval
    this.loadingDots = ''; // Reset dots
  }
  
  ngOnInit(): void {
    const branchCode = this.authService.getbranch();

    this.stopLoadingAnimation();


} 

generateReport() {
  if (this.startDate && this.endDate) {
    const start = new Date(this.startDate);
    const end = new Date(this.endDate);

    // Adjust start and end to include full day's range
    end.setDate(end.getDate() + 1);

    this.filteredreports = this.reportdata.filter(report => {
      const reportDate = new Date(report.transaction_Date);
      return reportDate >= start && reportDate < end; // Use < end to filter up to but not including end date
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
  { label: 'RtgsReport', route: '/RtgsReport', role: ['0078','0017','0041', '0048', '0049'] },
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

// Assuming this returns a single string




exportToExcel() {
  // Define headers for Excel columns
  const headers = [
    { header: 'No', key: 'no', width: 10, alignment: { horizontal: 'left' as const } },
    { header: 'Transaction Date', key: 'transDate', width: 20, alignment: { horizontal: 'left' as const } },
    { header: 'Debitor Name ', key: 'dName', width: 20, alignment: { horizontal: 'left' as const } },
   
    { header: 'Debited Account', key: 'debitedAccount', width: 25, alignment: { horizontal: 'left' as const } },
    { header: 'Credited Account', key: 'creditedAccount', width: 25, alignment: { horizontal: 'left' as const } },
    { header: 'Inputting Branch', key: 'inputingBranch', width: 25, alignment: { horizontal: 'left' as const } },
  
    { header: 'Refrence No', key: 'refno', width: 15, alignment: { horizontal: 'left' as const } },
    { header: 'Amount in Birr', key: 'amount', width: 15, alignment: { horizontal: 'left' as const } },

    { header: 'Service Fee in Birr', key: 'serviceFee', width: 15, alignment: { horizontal: 'left' as const } },
    { header: 'Vat 15% in Birr', key: 'vat', width: 15, alignment: { horizontal: 'left' as const } },
    { header: 'Service Fee 2 in Birr', key: 'serviceFee2', width: 15, alignment: { horizontal: 'left' as const } },
    { header: 'Vat 2 15% in Birr', key: 'vat2', width: 15, alignment: { horizontal: 'left' as const } },
 
      { header: 'Transaction Type', key: 'transType', width: 20, alignment: { horizontal: 'left' as const } },
      { header: 'Receipt No', key: 'receipt', width: 20, alignment: { horizontal: 'left' as const } },
 
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

       [`Date covered: From ${this.startDate} To: ${this.endDate}`], // Include date range
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
      transDate: item.transaction_Date,
      debitedAccount: item.account_No,
      refno: item.refno,
        amount: item.amount1,
      transType: item.paymentType,
      creditedAccount:item.cAccountNo,
      inputingBranch:item.inputing_Branch,
      serviceFee:item.serviceFee,
      vat:item.vat,
      serviceFee2:item.serviceFee2,
      vat2:item.vat2,
      receipt:this.pad(item.id),
      dName:item.debitor_Name
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
        }
        .logo {
          text-align: center;
          margin-bottom: 20px; /* Space below the logo */
        }
        .logo img {
          width: 100px; /* Adjust logo size */
          height: auto; /* Maintain aspect ratio */
        }
        .container {
          margin-left: 300px;
        }
        .container2 {
          margin-left: 320px;
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
      <div class="logo">
        <img src="path-to-your-logo/logo.png" alt="LION INTERNATIONAL BANK S.C Logo">
      </div>
      <div class="title container">LION INTERNATIONAL BANK S.C</div>
      <div class="title container2">Report</div>
      <div>Date covered: From ${this.startDate} To: ${this.endDate}</div>
      <table>
        <thead>
          <tr>
            <th>No</th>
            <th>Transaction Date</th>
            <th>Debitor Name</th>
            <th>Debitor Account</th>
            <th>Credited Account</th>
            <th>Inputting Branch</th>
            <th>Reference No</th>
            <th>Amount in Birr</th>
            <th>Service Fee in Birr</th>
            <th>VAT 15% in Birr</th>
                     <th>Service Fee 2 in Birr</th>
            <th>VAT 2 15% in Birr</th>
            <th>Transaction Type</th>
            <th>Receipt No</th>
          </tr>
        </thead>
        <tbody>
  `;

  // Add rows of data to the content
  this.filteredreports.forEach((item, index) => {
    content += `
      <tr>
        <td>${index + 1}</td>
        <td>${item.transaction_Date}</td>
        <td>${item.debitor_Name}</td>
        <td>${item.account_No}</td>
        <td>${item.cAccountNo}</td>
        <td>${item.inputing_Branch}</td>
        <td>${item.refno}</td>
        <td>${item.amount1}</td>
        <td>${item.serviceFee}</td>
        <td>${item.vat}</td>
                <td>${item.serviceFee2}</td>
        <td>${item.vat2}</td>
        <td>${item.paymentType}</td>
        <td>${this.pad(item.id)}</td>
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

  // Convert HTML to PDF
  this.convertHtmlToPdf(content);
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


printReceipt(transaction) {
  this.transaction = transaction; // Assuming 'transaction' contains all necessary transaction data.
  const receiptContent = document.getElementById('receiptContent');

  if (receiptContent) {
      // Preload the logo image
      const logoImage = new Image();
      logoImage.src = 'assets/img/LIBLogo2.jpg'; // URL of the image to preload

      logoImage.onload = () => {
          // Create an iframe
          const printWindow = document.createElement('iframe');
          printWindow.style.display = 'none';
          document.body.appendChild(printWindow);
          
          printWindow.contentWindow!.document.open();
          printWindow.contentWindow!.document.write(`
              <html>
                  <head>
                      <title>Receipt</title>
                      <style>
                          body {
                              font-family: 'Times New Roman', Times, serif;
                              margin: 10px 5px; /* Reduced left and right margins */
                              padding: 5px; /* Reduced padding */
                              color: #333333; /* Set text color to #333333 */
                              border: 1px solid #52829e; /* Border around the whole page */
                              font-size: 12px; /* Smaller font size */
                                 background: url('assets/img/LIBLogo2.jpg') no-repeat center center; /* Directly use the image URL */
                          background-size: cover;
                     
                          }
                    
                          .receipt-header {
                          
                              display: flex;
                                  align-items: center; /* Vertically centers the title with the logo */
                              justify-content: space-between; /* Align image and title on left and address on right */
                              border-bottom: 2px solid #52829e; /* Header line in specified color */
                              padding: 1px 0; /* Reduced padding */
                              margin-bottom: 15px; /* Reduced margin bottom */
                          }
                          .logo-img {
                              width: 30%;
                              height: auto;
                          }
                              .logo-title-container {
    display: flex;
    align-items: center; /* Vertically center the logo and title */
}
                          .slip-title {
                            font-weight:bold;
                              font-size: 20px; /* Smaller title size */
                              color: #52829e;; /* Title color changed to #333333 */
                              text-align: left; /* Align title to the left */
                              margin-bottom: 5px;
                      padding:0px;
                               font-family: "Copperplate", "Georgia", serif; /* Bold, distinct serif fonts */

                          }
                                    .address p{
                                    
                          padding: 0px; /* Reduced padding */
                            margin:0px;margin-top:5px;
                                 }
                          .address {
                              text-align: right; /* Align address to the right */
                              width: 30%; /* Set width for address */
                      padding: 0px; /* Reduced padding */
                            margin:0px;
                                 }
                              .add{
                                 text-align: center; /* Align address to the right */
                                   padding: 0px; /* Reduced padding */
                            margin:0px;
                               color:#52829e;
                       font-weight: bold; /* Smaller header size */
                       
                              }
                          h3 {
                              color: #333333; /* Title color changed to #333333 */
                              margin: 10px 0; /* Reduced margin */
                              text-align: center; /* Center align the title */
                              border-bottom: 1px solid #52829e; /* Horizontal line below the title in specified color */
                              padding-bottom: 5px; /* Space below the title */
                              font-size: 16px; /* Smaller header size */                               
                          }
                          .transaction-info {
                              margin: 0; /* Remove margin above and below */
                              border-bottom: 1px solid #52829e; /* Underline for Transaction Information in specified color */
                              padding-bottom: 5px; /* Spacing below the title */
                          }
                          .transaction-info div {
                              padding: 5px 0; /* Reduced padding between entries */
                              display: flex; /* Use flex to align items */
                              justify-content: space-between; /* Space between title and value */
                             margin-right:200px; /* Reduced margin */
                             
                          }
                          .transaction-details {
                              margin-top: 0px; /* Reduced margin */
                              border-collapse: collapse; /* Collapse table borders */
                              width: 100%; /* Full width for table */
                              font-size: 12px; /* Smaller font size for table */
                             
                          }
                          .transaction-details th, .transaction-details td {
                              border: 1px solid #52829e; /* Border for table cells in specified color */
                              padding: 4px; /* Smaller padding for cells */
                           }
                          .transaction-details th {
                              background-color: #f2f2f2; /* Light gray background for headers */
                              color: #333333; /* Header text color */
                               text-align: center;
                          }
                          .transaction-details td.no-border {
                              border: none; /* Remove border for specific cells */
                       text-align: right; /* 
                          }
                          .amount-row {
                              display: flex;
                              justify-content: space-between;
                              padding: 5px 0; /* Padding for spacing */
                              margin-top: 5px; /* Margin to separate rows */
                          }
                          .footer {
                              margin-top: 70px; /* Reduced footer margin */
                              text-align: center;
                              color: #80353c;; /* Footer text color (darker gray) */
                              font-size: 10px; /* Smaller footer size */
                          }
                                 .footer2 {
                              margin-top: 170px; /* Reduced footer margin */
                              text-align: right;
                              color: #52829e;; /* Footer text color (darker gray) */
                              font-size: 10px; /* Smaller footer size */
                          }
                          .qr-code {
                              width: 10%;
                              height: auto;
                          }.amount-in-words { margin-top:10px;}
                              .amount-in-words span{
                             display: inline-block; /* Make span behave like a block for width control */
    border-bottom: 1px solid #52829e; /* Horizontal line below the text */
    padding-right: 40px; /* Extend the line further to the right */
    white-space: nowrap; /* Prevent wrapping if text is too long */    

       margin-top:10px;
                              }
    .background-container {
                          position: relative;
                          width: 100%;
                          height: 100%;
                          overflow: hidden;
                      }
                          .style{
                   font-style: italic;
                          font-family:Snell Roundhand, cursive;
                           color: #80353c;}
.background-image {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    z-index: 0;
    opacity: 0.06; /* Adjust opacity for a watermark effect */
    object-fit: cover; /* This makes the image cover the entire container */
    background-size: cover; /* Ensures the background image covers fully */
    background-position: center; /* Center the image within the container */
}

.red{ color: #80353c;; /* Footer text color (darker gray) */
          padding: 0px; /* Reduced padding */
                            margin:0px;
                                                 
}
                            .blue{ color: #52829e;; /* Footer text color (darker gray) */
          padding: 0px; /* Reduced padding */
                            margin:0px;
                                                 
}
                              .space{
                              margin-top:20px}
                          .field-row {
                              display: flex;
                              justify-content: space-between; /* Align fields in row */
                              margin-top: 5px; /* Reduced margin between fields */
                          }
                          .field-label {
                              color: #333333; /* Label color changed to #333333 */
                              margin-right: 10px; /* Space between label and line */
                          }
                          .field-line {
                              border-bottom: 1px solid #52829e; /* Line to write data in specified color */
                              width: 80%; /* Width of the line */
                              flex-grow: 1; /* Allow line to grow */
                          }
                              .center{
                               text-align: center;
                              }

                              .footer {
    display: flex;
    justify-content: space-between;
    align-items: center;
    font-family: 'Times New Roman', Times, serif;
    font-size: 14px;
    margin: 10px 0;
   
}

.footer-left, .footer-right {
    flex: 1;
}

.footer-center {
    flex: 1;
    text-align: center;
}
    .align{
       text-align: right;}

.stamp-image {
    max-width: 100px; /* Adjust size as needed */
    height: auto;
}

.contact-info {
    font-family: 'Times New Roman', Times, serif;
    font-size: 10px;
margin-top:22%;
       color: #52829e;
}

.contact-info a {
  
    color: #52829e;
    text-decoration: none;
}

                      </style>
                  </head>
                  <body>
                  <div class="background-container">
                      <img src="assets/img/LIBLogo2.jpg" class="background-image" alt="Background Logo" />
                 
                      <div class="receipt">
                          <div class="receipt-header">
                            <div class="logo-title-container">
                                  <img src="${logoImage.src}" alt="Lion International Bank Logo" class="logo-img" />
                                  <span class="slip-title"> 
                                   <p class="red">አንበሳ ኢንተርናሽናል ባንክ አ.ማ</p>Lion International Bank S.C</span>
                                        
                              </div>
                              <div class="address">
                                  <p class="add">Lion International Bank S.C</p>
                                            <p >TIN No:&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; 0003229535 </p>
                                    <p>VAT Reg. No:&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; 3118750003</p>
                                  <p>VAT Reg. Date:&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; 10 December 2010</p>
                                <p>Date:&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;${transaction.transaction_Date}</p>
                                    <p>Receipt  No:&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;${this.pad(transaction.id)}</p>
 </div>
                          </div>
          
                          <h3>Value Add Tax Cash Sales Electronic Reciept  / የተ.እ.ታ የእጅ በእጅ ሽያጭ ኤሌክትሮኒክ ደረሰኝ</h3>
                          <div class="transaction-info">
                              <div>
                                  <span>Payer's Name / የከፋይ ሥም :</span>
                                  <span>${ transaction.debitor_Name||' '}</span>
                              </div>
                                  <div>
                                  <span>Payer's TIN No/ የግብር ከፋይ መለያ ቁጥር :</span>
                                  <span>${ transaction.tin_No||''}</span>
                              </div>
                                 <div>
                                  <span>Payer's Vat Registration NO / የከፋይ የተ.እ..ታ ምዝገባ ቁጥር :</span>
                                  <span>${ ''}</span>
                              </div>
                               
                         <div>
    <span>Payer Bank Acc. No / የባንክ ሂሳብ ቁጥር:</span>
    <span> ${this.maskAccountNumber(transaction.account_No)} </span>
</div>

                               <div>
                                  <span> National Id No/ብሄራዊ መታወቂያ ቁጥር :</span>
                                  <span>${transaction.address||''}</span>
                              </div>
          <div>
                                  <span>Payer's Phone No/የከፋይ ስልክ ቁ.:</span>
                                  <span>${transaction.phone_No||''}</span>
                              </div>
                    
                              <div>
                                  <span>Inputing Branch   / ቅርንጫፍ  :</span>
                                  <span>${transaction.inputing_Branch || 'Unknown'} </span>
                              </div>
                  
                            
                          </div>
          
                          <table class="transaction-details">
                              <thead>
                                  <tr>
                                      <th colspan="3" class="center"><h3>Transaction Details / የአገልግሎት ዝርዝር</h3></th>
                                  </tr>
                                  <tr>
                                      <th>Refrence Number/የአገልግሎት ቁጥር</th>
                                      <th>Transaction Type/የአገልግሎት አይነት</th>
                                      <th>Transaction Amount (Birr) /የገንዘብ መጠን(ብር)</th>
                                  </tr>
                              </thead>
                              <tbody>
                                  <tr>
                                      <td>${transaction.refno || 'Unknown'}</td>
                                      <td>${transaction.paymentType || 'Unknown'}</td>
                                      <td class="align">${formatNumber(transaction.amount1 )|| 'Unknown'} </td>
                                  </tr>
                                  <tr>
                                      <td colspan="2" class="no-border">Service Fee / የአገልግሎት ክፍያ</td>
                                      <td class="align">${formatNumber(transaction.serviceFee) || '0.00'} </td>
                                  </tr>
                                  <tr>
                                      <td colspan="2" class="no-border">VAT (15%) / ተ.እ.ታ (15%)</td>
                                      <td class="align">${formatNumber(transaction.vat) || '0.00'}  </td>
                                  </tr>
                                  
                                  ${transaction.paymentType == 'Derash' ? `
                                    <tr>
                                        <td colspan="2" class="no-border">Service Fee 2 / የአገልግሎት ክፍያ</td>
                                        <td class="align">${formatNumber(transaction.serviceFee2) || '0.00'}</td>
                                    </tr>
                                    <tr>
                                        <td colspan="2" class="no-border">VAT 2(15%) / ተ.እ.ታ (15%)</td>
                                        <td class="align">${formatNumber(transaction.vat2) || '0.00'}</td>
                                    </tr>
                                ` : ``}
                                
                                  <tr>
                                      <td colspan="2" class="no-border"> Grand Total Including VAT/ጠ.ድምር ተ.እ.ታ ጨምሮ</td>
                                      <td class="align">${formatNumber(transaction.amount1 +transaction.vat +transaction.serviceFee +transaction.vat2 +transaction.serviceFee2) || '0.00'}</td>
                                  </tr>
                              </tbody>
                          </table>
          <div class="space">   <div class="amount-in-words">
                         Amount in Words / የገንዘቡ ልክ በፊደል :
                            <span>${this.numberToWords(transaction.amount1 +transaction.vat +transaction.serviceFee+transaction.vat2 +transaction.serviceFee2)|| 'N/A'} </span>
                        </div>
                    
                        <div class="amount-in-words">
                         Payment Mode / የክፍያ ሁኔታ :
                            <span>${transaction.paymentMethod || 'Acoount'}</span>
                        </div>
          </div>
                       
                        
                         <div class="footer">
    <div class="footer-right">
       <p>
            <span>Tel: (+251) 11 662 60 00/60</span><br>
            <span>Fax: (+251) 11 662 59 99</span><br>
            <span>P.O.Box: 27026/1000 Addis Ababa</span><br>
            <span> Ath. Haile G/Selassie Avenue.Lex Plaza Bldg.</span>
        </p>
          
    </div>
    
    <div class="footer-center">
        <img src="assets/img/pngs.png" alt="Bank Stamp" class="stamp-image">

    </div>

    <div class="footer-left">
     <p>Thank you for banking with us!</p>
                               <p>Please retain this receipt for your records.</p>  
                                                      <p>Lion International Bank S.C</p>
                            
            <p class="blue">የስኬትዎ አጋር !</p>
            <p class="red">KEY TO SUCCESS!</p>
       
    </div>
</div>



                      </div><div class="contact-info">
    <p>
        ● SWIFT CODE: LIBSETAA&nbsp;&nbsp;
        ● Website: <a href="http://www.anbesabank.com">www.anbesabank.com</a>&nbsp;&nbsp;
        ● Telegram: <a href="https://t.me/LionBankSC">https://t.me/LionBankSC</a>&nbsp;&nbsp;
        ● E-mail: <a href="mailto:info@anbesabank.com">info@anbesabank.com</a>
    </p>
</div></div>
                  </body>
              </html>
          `);
          printWindow.contentWindow!.document.close();
          printWindow.contentWindow!.focus();
          printWindow.contentWindow!.print();
          printWindow.contentWindow!.close();
      };
  }
  // In your component.ts file


}




maskAccountNumber(accountNo: string): string {
  if (!accountNo || accountNo.length < 4) {
      return 'Invalid Account Number';
  }
  const lastFourDigits = accountNo.slice(-4);
  const maskedPart = '*'.repeat(accountNo.length - 4);
  return maskedPart + lastFourDigits;
}
// printReceipt(transaction) {
//   this.transaction = transaction; // Assuming 'transaction' contains all necessary transaction data.
//   const receiptContent = document.getElementById('receiptContent');

//   if (receiptContent) {
//       // Preload the logo image
//       const logoImage = new Image();
//       logoImage.src = 'assets/img/LIBLogo2.jpg'; // URL of the image to preload

//       logoImage.onload = () => {
//           // Create an iframe
//           const printWindow = document.createElement('iframe');
//           printWindow.style.display = 'none';
//           document.body.appendChild(printWindow);
          
//           printWindow.contentWindow!.document.open();
//           printWindow.contentWindow!.document.write(`
//               <html>
//                   <head>
//                       <title>Receipt</title>
//                       <style>
//                           body {
//                               font-family: 'Times New Roman', Times, serif;
//                               margin: 10px 20px; /* Reduced left and right margins */
//                               padding: 5px; /* Reduced padding */
//                               color: #333333; /* Set text color to #333333 */
//                               border: 1px solid #52829e; /* Border around the whole page */
//                               font-size: 12px; /* Smaller font size */
//                                  background: url('assets/img/LIBLogo2.jpg') no-repeat center center; /* Directly use the image URL */
//                           background-size: cover;
                     
//                           }
                    
//                           .receipt-header {
                          
//                               display: flex;
//                                   align-items: center; /* Vertically centers the title with the logo */
//                               justify-content: space-between; /* Align image and title on left and address on right */
//                               border-bottom: 2px solid #52829e; /* Header line in specified color */
//                               padding: 1px 0; /* Reduced padding */
//                               margin-bottom: 15px; /* Reduced margin bottom */
//                           }
//                           .logo-img {
//                               width: 30%;
//                               height: auto;
//                           }
//                               .logo-title-container {
//     display: flex;
//     align-items: center; /* Vertically center the logo and title */
// }
//                           .slip-title {
//                             font-weight:bold;
//                               font-size: 20px; /* Smaller title size */
//                               color: #52829e;; /* Title color changed to #333333 */
//                               text-align: left; /* Align title to the left */
//                               margin-bottom: 5px;
//                       padding:0px;
//                                font-family: "Copperplate", "Georgia", serif; /* Bold, distinct serif fonts */

//                           }
//                                     .address p{
                                    
//                           padding: 0px; /* Reduced padding */
//                             margin:0px;margin-top:5px;
//                                  }
//                           .address {
//                               text-align: right; /* Align address to the right */
//                               width: 30%; /* Set width for address */
//                       padding: 0px; /* Reduced padding */
//                             margin:0px;
//                                  }
//                               .add{
//                                  text-align: center; /* Align address to the right */
//                                    padding: 0px; /* Reduced padding */
//                             margin:0px;
//                                color:#52829e;
//                        font-weight: bold; /* Smaller header size */
                       
//                               }
//                           h3 {
//                               color: #333333; /* Title color changed to #333333 */
//                               margin: 10px 0; /* Reduced margin */
//                               text-align: center; /* Center align the title */
//                               border-bottom: 1px solid #52829e; /* Horizontal line below the title in specified color */
//                               padding-bottom: 5px; /* Space below the title */
//                               font-size: 16px; /* Smaller header size */
//                           }
//                           .transaction-info {
//                               margin: 0; /* Remove margin above and below */
//                               border-bottom: 1px solid #52829e; /* Underline for Transaction Information in specified color */
//                               padding-bottom: 5px; /* Spacing below the title */
//                           }
//                           .transaction-info div {
//                               padding: 5px 0; /* Reduced padding between entries */
//                               display: flex; /* Use flex to align items */
//                               justify-content: space-between; /* Space between title and value */
//                              margin-right:200px; /* Reduced margin */
                             
//                           }
//                           .transaction-details {
//                               margin-top: 40px; /* Reduced margin */
//                               border-collapse: collapse; /* Collapse table borders */
//                               width: 100%; /* Full width for table */
//                               font-size: 12px; /* Smaller font size for table */
                             
//                           }
//                           .transaction-details th, .transaction-details td {
//                               border: 1px solid #52829e; /* Border for table cells in specified color */
//                               padding: 4px; /* Smaller padding for cells */
//                               text-align: left; /* Left align text */
//                           }
//                           .transaction-details th {
//                               background-color: #f2f2f2; /* Light gray background for headers */
//                               color: #333333; /* Header text color */
//                                text-align: center;
//                           }
//                           .transaction-details td.no-border {
//                               border: none; /* Remove border for specific cells */
//                           }
//                           .amount-row {
//                               display: flex;
//                               justify-content: space-between;
//                               padding: 5px 0; /* Padding for spacing */
//                               margin-top: 5px; /* Margin to separate rows */
//                           }
//                           .footer {
//                               margin-top: 70px; /* Reduced footer margin */
//                               text-align: center;
//                               color: #80353c;; /* Footer text color (darker gray) */
//                               font-size: 10px; /* Smaller footer size */
//                           }
//                                  .footer2 {
//                               margin-top: 170px; /* Reduced footer margin */
//                               text-align: right;
//                               color: #52829e;; /* Footer text color (darker gray) */
//                               font-size: 10px; /* Smaller footer size */
//                           }
//                           .qr-code {
//                               width: 10%;
//                               height: auto;
//                           }
//                               .amount-in-words span{
//                              display: inline-block; /* Make span behave like a block for width control */
//     border-bottom: 1px solid #52829e; /* Horizontal line below the text */
//     padding-right: 100px; /* Extend the line further to the right */
//     white-space: nowrap; /* Prevent wrapping if text is too long */    
//     margin-left:15px;
//                               }
//     .background-container {
//                           position: relative;
//                           width: 100%;
//                           height: 100%;
//                           overflow: hidden;
//                       }
//                           .style{
//                    font-style: italic;
//                           font-family:Snell Roundhand, cursive;
//                            color: #80353c;}
// .background-image {
//     position: absolute;
//     top: 0;
//     left: 0;
//     width: 100%;
//     height: 100%;
//     z-index: 0;
//     opacity: 0.06; /* Adjust opacity for a watermark effect */
//     object-fit: cover; /* This makes the image cover the entire container */
//     background-size: cover; /* Ensures the background image covers fully */
//     background-position: center; /* Center the image within the container */
// }

// .red{ color: #80353c;; /* Footer text color (darker gray) */
//           padding: 0px; /* Reduced padding */
//                             margin:0px;
                                                 
// }
//                               .space{
//                               margin-top:50px}
//                           .field-row {
//                               display: flex;
//                               justify-content: space-between; /* Align fields in row */
//                               margin-top: 5px; /* Reduced margin between fields */
//                           }
//                           .field-label {
//                               color: #333333; /* Label color changed to #333333 */
//                               margin-right: 10px; /* Space between label and line */
//                           }
//                           .field-line {
//                               border-bottom: 1px solid #52829e; /* Line to write data in specified color */
//                               width: 80%; /* Width of the line */
//                               flex-grow: 1; /* Allow line to grow */
//                           }
//                               .center{
//                                text-align: center;
//                               }
//                       </style>
//                   </head>
//                   <body>
//                   <div class="background-container">
//                       <img src="assets/img/LIBLogo2.jpg" class="background-image" alt="Background Logo" />
                 
//                       <div class="receipt">
//                           <div class="receipt-header">
//                             <div class="logo-title-container">
//                                   <img src="${logoImage.src}" alt="Lion International Bank Logo" class="logo-img" />
//                                   <span class="slip-title"> 
//                                    <p class="red">አንበሳ ኢንተርናሽናል ባንክ አ.ማ</p>Lion International Bank S.C</span>
                                        
//                               </div>
//                               <div class="address">
//                                   <p class="add">Lion International Bank S.C</p>
//                                          <p class="add style">Key To Success</p>
//                                   <p >TIN No:&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; 0003229535 </p>
//                                   <p>VAT Reg. No:&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; 3118750003</p>
//                                       <p>Date:&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;${transaction.transaction_Date}</p>
//                                 <p>Receipt  No:&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;${ this.pad(transaction.id)}</p>
//  </div>
//                           </div>
          
//                           <h3>Transaction Information / የክፍያ መረጃ</h3>
//                           <div class="transaction-info">
//                               <div>
//                                   <span>Receipt No / የደረሰኝ ቁጥር:</span>
//                                   <span>${this.pad(transaction.id) || 'Unknown'}</span>
//                               </div>
//                               <div>
//                                   <span>Payer Bank Acc. No /  የባንክ ሂሳብ ቁጥር:</span>
//                                   <span>${transaction.account_No || 'Unknown'}</span>
//                               </div>
//                               <div>
//                                   <span>Acc. No  Branch / የቅርንጫፍ መለያ ቁጥር :</span>
//                                   <span>${transaction.inputing_Branch || 'Unknown'} </span>
//                               </div>
//                               <div>
//                                   <span>Transaction Date /  ቀን:</span>
//                                   <span>${transaction.transaction_Date || 'Unknown'}</span>
//                               </div>
                       
//                           </div>
          
//                           <table class="transaction-details">
//                               <thead>
//                                   <tr>
//                                       <th colspan="3" class="center"><h3>Transaction Details / የክፍያ ዝርዝር</h3></th>
//                                   </tr>
//                                   <tr>
//                                       <th>Transaction Number / የክፍያ ቁጥር</th>
//                                       <th>Payment Type / የክፍያ ዓይነት</th>
//                                       <th>Settled Amount / የተቀመጠው መጠን</th>
//                                   </tr>
//                               </thead>
//                               <tbody>
//                                   <tr>
//                                       <td>${transaction.refno || 'Unknown'}</td>
//                                       <td>${transaction.paymentType || 'Unknown'}</td>
//                                       <td>${formatNumber(transaction.amount1 )|| 'Unknown'} ETB</td>
//                                   </tr>
//                                   <tr>
//                                       <td colspan="2" class="no-border">Service Fee / የአገልግሎት ክፍያ</td>
//                                       <td>${formatNumber(transaction.serviceFee) || '0.00'} ETB</td>
//                                   </tr>
//                                   <tr>
//                                       <td colspan="2" class="no-border">VAT (15%) / ተ.እ.ታ (15%)</td>
//                                       <td>${formatNumber(transaction.vat) || '0.00'}  ETB</td>
//                                   </tr>
//                                   <tr>
//                                       <td colspan="2" class="no-border">Total Paid Amount / አጠቃላይ የተከፈለው መጠን</td>
//                                       <td>${formatNumber(transaction.amount1 +transaction.vat +transaction.serviceFee) || '0.00'}ETB</td>
//                                   </tr>
//                               </tbody>
//                           </table>
//           <div class="space">   <div class="amount-in-words">
//                          Total Amount in Words / የተከፈለው መጠን በፊደል :
//                             <span>${this.numberToWords(transaction.amount1 +transaction.vat +transaction.serviceFee)|| 'N/A'} ETB</span>
//                         </div>
                    
//                         <div class="amount-in-words">
//                          Payment Method / የክፍያ ዘዴ :
//                             <span>${transaction.paymentType || 'N/A'}</span>
//                         </div>
//           </div>
                       
                        
//                           <div class="footer">
//                               <p>Thank you for banking with us!</p>
//                               <p>Please retain this receipt for your records.</p>
//                               <p>Lion International Bank S.C</p>
                             

//                           </div>
//                                 <div class="footer2">
//                             <p>  <span>Tel: (+251) 11 662 60 00/60</span>
//                               <span>Fax: (+251) 11 662 59 99</span></p>
//                            <p>   <span>P.O.Box: 27026/1000 Addis Ababa</span></p>
//                              <p> <span>Address: Haile G.Selassie Avenue, Lex spanlaza Building Addis Ababa, Ethiopia</span></p>
//                              <p> <span>SWIFT Code: LIBSETAA</span>
//                               <span>E-mail: info@anbesabank.com</span></p>
//                           </div>
//                       </div></div>
//                   </body>
//               </html>
//           `);
//           printWindow.contentWindow!.document.close();
//           printWindow.contentWindow!.focus();
//           printWindow.contentWindow!.print();
//           printWindow.contentWindow!.close();
//       };
//   }
// }
// Add this function to your Angular component's TypeScript file
pad(num: number | undefined): string {
  if (num === undefined) {
    console.warn('pad function received undefined, returning default value:', num);
    return 'A0000000000'; // Default value with "A" prefix
  }
  return 'A' + num.toString().padStart(10, '0');
}

numberToWords(num: number): string {
  const a = ['', 'one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine', 'ten', 'eleven', 'twelve', 'thirteen', 'fourteen', 'fifteen', 'sixteen', 'seventeen', 'eighteen', 'nineteen'];
  const b = ['', '', 'twenty', 'thirty', 'forty', 'fifty', 'sixty', 'seventy', 'eighty', 'ninety'];
  const g = ['', 'thousand', 'million', 'billion', 'trillion'];

  if (num === 0) return 'Zero Birr';

  const [integerPart, decimalPart] = num.toFixed(2).split('.').map(Number);  // Ensure 2 decimal places

  let result = '';
  let group = 0;
  let numInt = integerPart;

  // Convert the integer part
  while (numInt > 0) {
      const chunk = numInt % 1000;
      if (chunk) {
          const hundreds = Math.floor(chunk / 100);
          const tens = chunk % 100;
          const units = chunk % 10;

          let chunkStr = '';
          if (hundreds) {
              chunkStr += `${a[hundreds]} hundred `;
          }
          if (tens < 20) {
              chunkStr += `${a[tens]}`;
          } else {
              chunkStr += `${b[Math.floor(tens / 10)]}`;
              if (units) chunkStr += `-${a[units]}`;
          }

          result = `${chunkStr.trim()} ${g[group]} ${result}`.trim();
      }
      group += 1;
      numInt = Math.floor(numInt / 1000);
  }

  // Capitalize the first letter of each word for the integer part
  let birrPart = result
    .split(' ')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ')
    .trim() + ' Birr';

  // Convert the decimal part for cents
  let centPart = '';
  if (decimalPart) {
      if (decimalPart < 20) {
          centPart = `${a[decimalPart]} Cent`;
      } else {
          const tens = Math.floor(decimalPart / 10);
          const units = decimalPart % 10;
          centPart = `${b[tens]}`;
          if (units) centPart += `-${a[units]}`;
          centPart += ' Cent';
      }
  }

  // Construct the final result
  return centPart ? `${birrPart} And ${centPart}` : birrPart;
}




}
