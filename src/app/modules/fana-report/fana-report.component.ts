import { DOCUMENT } from '@angular/common';
import { Component, Inject } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import {  Transfer } from 'app/models/data.model';
import { AuthService } from 'app/service/auth.service';
import { ReportService } from 'app/service/report.service';
import { TransactionService } from 'app/service/transaction.service';
import * as ExcelJS from 'exceljs';

@Component({
  selector: 'app-fana-report',
  templateUrl: './fana-report.component.html',
  styleUrls: ['./fana-report.component.css']
})
export class FanaReportComponent {

  constructor(
    private transactionService: TransactionService,   
  
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
  pageSize: number = 100;
  currentPage: number = 1;
  filteredreports:Transfer[]= [];

  isDeletingreport:boolean=false





  ngOnInit(): void {


    this.transactionService.getAllTransactions().subscribe((t) => {
      this.reportdata =t.filter(t=>t.status=='Approved');;
      const startIndex = (this.currentPage - 1) * this.pageSize;
      const endIndex = startIndex + this.pageSize;
  
  
      this.filteredreports = t.filter(t=>t.status=='Approved');
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

    // Adjust start and end to include full day's range
    end.setDate(end.getDate() + 1);

    this.filteredreports = this.reportdata.filter(report => {
      const reportDate = new Date(report.transDate);
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
  { label: 'Statment Report', route: '/FanaReport', role: ['0078','0041', '0048', '0049','0017'] },
    { label: 'Branch Report', route: '/BranchReport', role: ['0041', '0048', '0049'] },
    { label: 'General Report', route: '/GeneralReport', role: ['0078','0017'] },

  
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
      transDate: item.transDate,
      dDepositeName: item.dDepositeName,
      memberId: item.memberId,
      depositorPhone: item.depositorPhone,
      referenceNo: item.referenceNo,
      amount: item.amount,
      transType: item.transType,
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
     <div class="title container">LION INTERNATIONAL BANK S.C </div>
      <div class="title container2 ">Transaction Report</div>
      <div>Account Name: Fana Youth Saving And Credit Limited Cooperative</div>
      <div>Accont Number:00310095104-87</div>
      <div>BRANCH: MEKELE MARKET</div>
      <div>Date covered: From ${this.startDate} To: ${this.endDate}</div>
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