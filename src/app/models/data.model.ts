


export interface Login {
  id: number;
  branch: string;
 fullName: string;
  userName: string;
  password: String;
  role: String;
  branchCode:string
  updatedBy:string;
  updatedDate:String;
  status:string,
 

}
export interface TokenResponse {
  token: string;
userData:{
  id: number;
  branch: string;
 fullName: string;
  userName: string;
  password: String;
  role: string;
  branchCode:string
  updatedBy:string;
  updatedDate:String;
  status:string
}  

}

export interface UserData {
  branch:number;
   branchName:number;
   userName:number ;
  fullName:string;
  role :string;
  createdDate:string; 
  updatedDate :string;
status:string

}
export interface Report {
  AccountNo:number;
   SerialNo:number;
   MemberCode:number ;
  MemberType:string;
  TransactionDate :string;
  AccountHolderName:string; 
  AccountType :string;
  Debit :number;
  Credit :number;
  Balance :number;
  BBF :number;
 UnAuthorized :string;
 SiteCode:number ;

}
export interface Transfer {
  id:number,
  memberId: string;
depositorPhone: string;
  amount: number;
  transType:string;
  transDate:string;
  createdBy:string;
  approvedBy:string;
  status:string;
  updatedDate:string;
  updatedBy:string;
  cAccountBranch: string,
  cAccountNo: string,
  cAccountOwner: string,
  dAccountNo: string,
  dDepositeName: string,
 branch: string,
  referenceNo: string,
  messsageNo: string,
  paymentNo: string,

}

export interface ValidAccount {
  customer_Id: string;
  fulL_NAME: string;
  accountNumber: string;
  branch: string;
  telephonenumber: string;

}
export interface IfrsTransfer {

    updatedDate: string,
    updatedBy: string,
    status: string,
    id: number,
    inputing_Branch: string,
    transaction_Date:string,
    account_No: string,
    amount1: number,
     phone_No :string,
     address :string,
     tinNo :string,
     debitor_Name :string,
     paymentMethod :string,
    refno: string,
    branch: string,
    cAccountNo: string,
    createdBy: string,
    approvedBy: string,
    messsageNo: string,
    paymentNo: string,
    paymentType: string
    serviceFee: number,    
    serviceFee2: number,
    vat: number,
    vat2: number,

}

export interface FanaTransactions {
  customeR_NAME: string;     // string, nullable
  side: string;              // string, nullable
  discription: string;       // string, nullable
  tdate: string;             // Date as string, nullable (or use Date type if preferred)
  branch: string;            // string, nullable
  inbranch: string;          // string, nullable
  amount: number;            // decimal, nullable
  event: string;             // string, nullable
  operation: string;         // string, nullable
  pie: string;               // string, nullable
  r_NO: string;              // string, nullable (to match the JSON format)
  balbb: number;             // decimal(19,4), nullable
  typ: string;               // string, nullable
  noseq: number;             // decimal, nullable
  uti?: string;              // string, nullable
  uta?: string;              // string, nullable
  debit?: number | null;     // decimal, nullable (allowing null)
  credit?: number;           // decimal, nullable
  runninG_TOTAL: number;     // decimal, nullable
}



export interface OutRtgs {



    inputinG_BRANCH: string,
    transactioN_DATE:string,
    accounT_NO: string,
    amounT1: number,
    refno: string,

 }
 