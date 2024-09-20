


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