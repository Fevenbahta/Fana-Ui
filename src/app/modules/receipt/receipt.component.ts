import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { IfrsTransfer } from 'app/models/data.model';
import { IfrsTransactionService } from 'app/service/Ifrstransaction.service';

@Component({
  selector: 'app-receipt',
  templateUrl: './receipt.component.html',
  styleUrls: ['./receipt.component.css']
})
export class ReceiptComponent {
//   services = ['Service 1', 'Service 2', 'Service 3'];  // List of available services
//   selectedService: string = '';  // The selected service
//   inputId: string = '';  // ID input by the user
//   transaction: IfrsTransfer | null = null;  // To hold the transaction data
//   buttons = [
//     // { label: 'IfrsTransfer Request', route: '/user/:id/Request' },
//      { label: 'Receipt', route: '/Receipt' },

//  ];
//   constructor(private ifrsTransactionService: IfrsTransactionService) {}

//   generateReceipt() {
//     if (!this.inputId || !this.selectedService) {
//       alert('Please select a service and enter a valid ID');
//       return;
//     }

//     const id = parseInt(this.inputId, 10);

//     this.ifrsTransactionService.getIfrsTransaction(id).subscribe(
//       (transaction: IfrsTransfer) => {
//         this.transaction = transaction;
//         this.printReceipt();  // Trigger print dialog after receiving data
//       },
//       (error) => {
//         console.error('Error fetching transaction:', error);
//         alert('Failed to fetch transaction');
//       }
//     );
//   }

//   printReceipt() {
//     const receiptContent = document.getElementById('receiptContent');

//     if (receiptContent) {
//       // Show the receipt content
//       receiptContent.style.display = 'block';

//       // Print the receipt
//       window.print();

//       // Hide the receipt content again (optional)
//       receiptContent.style.display = 'none';
//     }
//   }
// }

services = [' Rtgs', 'Service 2', 'Service 3'];  // List of available services
selectedService: string = '';  // The selected service
inputId: string = '';  // ID input by the user
transaction: IfrsTransfer | null = null;  // To hold the transaction data
buttons = [
   { label: 'Receipt', route: '/Receipt' },
];

constructor() {}

generateReceipt() {
  if (!this.inputId || !this.selectedService) {
    alert('Please select a service and enter a valid ID');
    return;
  }

  // Using sample data instead of fetching from the server
  this.transaction = {
    id: parseInt(this.inputId, 10),
    amount1: 0,  // Sample amount
    serviceFee: 0,
    serviceFee2: 0,
    vat: 0,
    vat2: 0,
    account_No: '123456789',  // Sample account number
    phone_No :"",
    address :"",
    tinNo :"",
    debitor_Name :"",
    paymentMethod :"",
    status: 'Success',  // Sample status
    refno: "5123358496",  // Sample amount
    transaction_Date: '09/30/2024',  // Sample account number
    inputing_Branch: '00003', 
    updatedDate: '09/30/2024',  // Sample account number
    updatedBy: 'Feven', 
    branch:"00003",
    cAccountNo: "5123358496",
    createdBy: "",
    approvedBy: "",
    messsageNo: "",
    paymentNo: "",
    paymentType: "",
 

  };

  // Trigger print dialog after setting sample data
  this.printReceipt();
}


printReceipt() {
  const receiptContent = document.getElementById('receiptContent');

  if (receiptContent) {
    // Create an iframe
    const printWindow = document.createElement('iframe');
    printWindow.style.display = 'none';  // Hide the iframe
    document.body.appendChild(printWindow);

    // Write the receipt content to the iframe
    printWindow.contentWindow!.document.open();
    printWindow.contentWindow!.document.write(`
      <html>
        <head>
          <title>Receipt</title>
          <style>
            body {
              font-family: 'Times New Roman', Times, serif;
              margin: 20px;
            }
            .receipt-header {
              display: flex;
              justify-content: space-between;
              border-bottom: 2px solid #333;
              padding-bottom: 10px;
              margin-bottom: 20px;
              background-color: #e9ecef;
            }
            .headerlink {
              display: flex;
              flex-direction: row;
              align-items: center;
              background-color: #018ca8 !important;   
              color: #018ca8;
              padding: 10px;
              border-radius: 5px;
              margin-bottom: 10px;
              margin-left: 150px; 
            }
            .logo-img {
              width: 10%;
              height: auto;
              margin-bottom: 5px;
            }
            .slip-title {
              font-weight: bold;
              font-size: 24px;
            }
            .column {
              width: 45%;
            }
            h2 {
              font-size: 24px;
              margin: 4px;
              color: #333;
            }
            p {
              font-size: 16px;
              margin: 15px 5px;
            }
            table {
              width: 100%;
              border-collapse: collapse;
              margin-top: 20px;
              border: 2px solid #e9ae42; /* Set the table border to yellow */
            }
            td, th {
              padding: 15px;
              border: 1px solid #e9ae42; /* Set the cell border to yellow */
              font-size: 16px;
              color: #444;
            }
            td strong {
              color: #000;
            }
            .tra {
              margin-left: 200px;
            }
            .tagline {
              background-color: #018ca8 !important;   
              color: #018ca8;
              text-align: center;
              margin-top: 20px;
              font-size: 22px;
              font-weight: bold;
              padding: 10px;
            }
            .stamp {
              position: absolute;  /* Position it absolutely */
              top: 600px;          /* Adjust the top position as needed */
              right: 400px;       /* Adjust the right position as needed */
              width: 150px;      /* Set a width for the stamp */
              height: auto;      /* Maintain aspect ratio */
              opacity: 0.5;      /* Set opacity to make it look like a stamp */
            }
          </style>
        </head>
        <body>
          <div class="headerlink">
            <a>
              <img src="/assets/img/LIBLogo2.jpg" class="logo-img" />
              <span class="slip-title">LION INTERNATIONAL BANK S.C</span>
            </a>
          </div>
          <div class="receipt-header header">
            <div class="column left-column">
              <p>Country: Ethiopia</p>
              <p>City: Addis Ababa</p>
              <p>Postal Code: 27026/1000</p>
              <p>VAT Reg. No.: &nbsp;&nbsp;&nbsp;</p>
              <p>SWIFT Code: LIBSETAA</p>
            </div>
            <div class="column right-column header">
              <p>Email: info@anbesabank.com</p>
              <p>Tel: (+251) 11 662 60 00/60</p>
              <p>Fax: (+251) 11 662 59 99</p>
              <p>TIN No.: &nbsp;&nbsp;&nbsp;</p>
              <p>Address: Lex Plaza Building, Addis Ababa, Ethiopia</p>
            </div>
          </div>
          <h3 class="tra header">Transaction Information</h3>
          <table>
            <tr>
              <td><strong>Payer:</strong></td>
              <td>${this.transaction.account_No}</td>
            </tr>
            <tr>
              <td><strong>Receiver:</strong></td>
              <td>${this.transaction.account_No}</td>
            </tr>
            <tr>
              <td><strong>Payment Date:</strong></td>
              <td>${this.transaction.transaction_Date}</td>
            </tr>
            <tr>
              <td><strong>Reference No:</strong></td>
              <td>${this.transaction.refno}</td>
            </tr>
            <tr>
              <td><strong>Reason:</strong></td>
              <td>Payment for ${this.selectedService}</td>
            </tr>
            <tr>
              <td><strong>Transferred Amount:</strong></td>
              <td>${this.transaction.amount1}</td>
            </tr>
            <tr>
              <td><strong>Service Fee:</strong></td>
              <td>3.00</td>
            </tr>
            <tr>
              <td><strong>15% VAT:</strong></td>
              <td>3.00</td>
            </tr>
            <tr>
              <td><strong>Total Paid Amount:</strong></td>
              <td>${this.transaction.amount1}</td>
            </tr>
          </table>
          <img src="/assets/img/stamp.jfif" class="stamp" alt="Stamp" /> <!-- Add the stamp here -->
          <div class="tagline">
            <h3 class="tagline">LIB KEY TO SUCCESS</h3>
          </div>
        </body>
      </html>
    `);

    // Close the document stream to prepare for printing
    printWindow.contentWindow!.document.close();

    // Wait for the content to load, then print
    printWindow.onload = () => {
      const win = printWindow.contentWindow; // Get the content window
      if (win) {
        win.focus();  // Focus on the new window
        win.print();  // Trigger the print dialog
      }
      document.body.removeChild(printWindow); // Clean up the iframe
    };
  }
}


}



