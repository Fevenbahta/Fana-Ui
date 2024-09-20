import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { LoginService } from './login.service';
import { Observable, throwError, timer } from 'rxjs';
import { catchError, switchMap, takeWhile } from 'rxjs/operators';
import { Login } from 'app/models/data.model';
import { TransactionService } from './transaction.service';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private isAuthenticated: boolean = false;
  public Role: string;
  public name: string;
  public branch: string;
  public id: number;
  public password: String;
  public res: Login;
  public incorrect: boolean = false;
  public suspended: boolean = false;
  public tra: boolean = false;
  public roleincorrect: boolean = false;
  public locked:boolean=false;
  private MAX_FAILED_ATTEMPTS = 10;
  private failedAttempts: { [username: string]: number } = {};
  public accountLocked: { [username: string]: boolean } = {};

  newUser: Login = {
    id: 0,
    branch: "",
    fullName: "",
    userName: "",
    password: "",
    role: "",
    branchCode: "",
    updatedBy: "",
    updatedDate: "",
    status: "",
  };

  constructor(
    private loginService: LoginService,
    private router: Router,
    private transactionService: TransactionService
  ) {}

  login(username: string, password: string) {
    this.loginService.getAll().pipe(
      switchMap(userExists => {
        const userExistsInMainList = userExists.find(t => t.userName === username);
        if (!userExistsInMainList)
           {
          // User not found in the main list, attempt to fetch user details from another database
          return this.transactionService.GetUserDetailByUserName(username).pipe(
            switchMap(userData => {
              // User found in the other database, register with suspended status
              this.newUser.status = 'Suspended';
              this.newUser.branch = userData.brancH_NAME;
              this.newUser.branchCode = userData.branch ? userData.branch.toString().trim().replace(/^0+/, '') : '';
              this.newUser.role = userData.role ? userData.role.toString().trim().replace(/^0+/, '') : '';
              this.newUser.fullName = userData.fulL_NAME;
              this.newUser.updatedBy = "login";
              this.newUser.updatedDate = Date.now().toString();
              this.newUser.password = '123456';
              this.newUser.userName = username;

              console.log("New User Data:", this.newUser);

              // Register user with suspended status
              return this.loginService.register(this.newUser).pipe(
                switchMap(() => {
                  console.log("User registered with suspended status");
                  this.suspended = true;
                  setTimeout(() => this.resetStatusFlags(), 60000);
           // Reset after 1 minute
this.loginService.getAll()
.subscribe({
    next: (t) => {
      userExists=t
         },
    error(response) {
      console.log(response);
    },
  });
 
           
                  return throwError(new Error('User registered with suspended status')); // Continue throwing error to handle suspended message
                })
              );
            }),
            catchError(err => {
              // User not found in either database
              console.error(`User ${username} not found in any database`);
              this.incorrect = true;
              setTimeout(() => this.resetStatusFlags(), 1000); // Reset after 1 minute
              return throwError(new Error('User not found'));
            })
          );
        }
        
        else {
          if (userExistsInMainList && (userExistsInMainList.status === 'Suspended')) {
           this.suspended=true;
           setTimeout(() => this.resetStatusFlags(), 1000); // Reset after 1 minute
    
            return;
          }
          else if (userExistsInMainList && (userExistsInMainList.status === 'Locked')) {
            this.locked=true;
            setTimeout(() => this.resetStatusFlags(), 1000); // Reset after 1 minute
    
          return;
          }
          else{   // User found in the main list, proceed with login attempt
          return this.loginService.login(username, password).pipe(
            catchError(error => {
              if (error.status == 401) {
                // Handle 401 errors (e.g., too many failed login attempts)
                this.handleLoginFailures(username);
              } else {
                // Handle other login errors
                this.incorrect = true;
                setTimeout(() => this.resetStatusFlags(), 1000); // Reset after 1 minute
                console.error('Login failed:', error);
                return throwError(error);
              }
            })
          );
        }}
      })
    )
    .subscribe(response => {
      if (response && response.token) {
        localStorage.setItem('token', response.token);
        localStorage.setItem('userData', JSON.stringify(response.userData));
        
        this.name = response.userData.userName;
        this.id = response.userData.id;
        this.branch = response.userData.branchCode;
        this.password = response.userData.password;
        this.Role = response.userData.role;
        console.log('rolesss', this.Role);
        
        if (response.userData.status == 'suspended') {
          this.suspended = true;
          console.log('User is suspended');
          // Handle suspended user state
        } else {
          if (this.Role === 'Admin') {
            this.tra = true;
            this.isAuthenticated = true;
            this.router.navigate(['/Admin']);
          }
           else {
            this.getUserData().subscribe({
              next: (tra) => {
                if (tra) {
                  this.tra = true;
                  this.isAuthenticated = true;
                  console.log('Role:', this.Role);
                  if (this.Role === '0052'||this.Role === '0073') {
                    console.log('Navigating to Request');
                    this.router.navigate(['/', 'Request']);
                  } else if (this.Role === '0048' || this.Role === '0041' || this.Role === '0049') {
                    console.log('Navigating to Approval');
                    this.router.navigate(['/', 'Approval']);
                  }  else if (this.Role === '0078'|| this.Role === '0017' ) {
                    console.log('Navigating to FanaReport');
                    this.router.navigate(['/', 'FanaReport']);
                  }else {
                    console.log('Unknown role');
                    this.roleincorrect = true;
                  }
                  this.startTokenExpirationTimer();
                } 
        
                else {
       
                  console.error('User data not found');
                  this.logout();
                }
              },
              error: (err) => {
                this.transactionService.GetUserDetailByUserName(response.userData.userName).subscribe({
                  next: (userDetail) => {
                    if (userDetail) {
                      response.userData.branchCode=userDetail.branch;
                      response.userData.role=userDetail.role;
                      response.userData.branch=userDetail.brancH_NAME;
                      response.userData.status="Suspended";
                      this.loginService.updateAdminUser(response.userData,response.userData.id).subscribe({
                        next: (updatedUserDetail) => {
                          this.suspended = true;
                          setTimeout(() => this.resetStatusFlags(), 60000); // Reset after 1 minute
                      
                        },
                        error: (updateError) => {
                          console.error('Error updating user detail:', updateError);
                          this.logout();
                        }
                      });
                    } else {
                      console.error('User detail not found by username');
                      this.logout();
                    }
                  },
                  error: (err) => {
                    console.error('Error fetching user detail by username:', err);
                    this.logout();
                  }
                });
                console.error('Error fetching user data:', err);
                this.logout();
              }
            });
          }
        }
      } else {
        console.error('Login failed: Invalid response');
      }
    });
  }

  handleLoginFailures(username: string) {
    this.incorrect = true;
    if (!this.failedAttempts[username]) {
      this.failedAttempts[username] = 0; // Initialize if not exists
    }
    
    this.failedAttempts[username]++;
    setTimeout(() => this.resetStatusFlags(), 1000); // Reset after 1 minute
    console.log(`Failed attempts for ${username}:`, this.failedAttempts[username]);

    if (this.failedAttempts[username] >= this.MAX_FAILED_ATTEMPTS) {
      this.accountLocked[username] = true;
      this.locked = true;
      setTimeout(() => this.resetStatusFlags(), 1000); // Reset after 1 minute
      console.error(`Account for ${username} locked due to too many failed login attempts`);

      // Update user status to "Locked" in backend
      this.loginService.getAll().pipe(
        switchMap(userData => {
          const user = userData.find(t => t.userName === username);
          if (user) {
            user.status = 'Locked';
            return this.loginService.updateAdminUser(user, user.id).pipe(
              switchMap(() => {
                console.error(`User ${username} status updated to Locked`);
                return throwError(new Error(`Account for ${username} locked due to too many failed login attempts`));
              })
            );
          } else {
            console.error(`User ${username} not found for locking`);
            return throwError(new Error(`User ${username} not found for locking`));
          }
        })
      ).subscribe({
        error: error => {
          console.error('Error locking account:', error);
        }
      });
    }
  }

  getUserData() {
    const role = this.getrole();
    const branch = this.getbranch();
    const user = this.getuser();
    console.log('r,b,u',role,branch,user);
    return this.transactionService.getUserDetails(branch, user, role);
  }

  getincorrect(): boolean {
    return this.incorrect;
  }

  getrole(): string {
    return this.Role;
  }

  getbranch(): string {
    return this.branch;
  }

  getuser(): string {
    return this.name;
  }

  getid(): number {
    return this.id;
  }

  getpassword(): String {
    return this.password;
  }

  getres(): Login {
    this.res = JSON.parse(localStorage.getItem('userData'));
    return this.res;
  }

  logout(): void {
    localStorage.removeItem('token');
    this.isAuthenticated = false;
    this.Role = '';
    this.router.navigate(['/login']);
  }

  isitAuthenticated(): boolean {
    return !!localStorage.getItem('token');
  }

  private startTokenExpirationTimer(): void {
    const token = localStorage.getItem('token');
    if (!token) return;

    const tokenParts = token.split('.');
    if (tokenParts.length !== 3) {
      console.error('Invalid token format');
      return;
    }

    const payload = JSON.parse(atob(tokenParts[1]));
    if (!payload || !payload.exp) {
      console.error('Expiration time not found in token payload');
      return;
    }

    const expirationTime = payload.exp * 1000; // Convert expiration time to milliseconds
    const currentTime = Date.now();
    const adjustedExpirationTime = currentTime + (120 * 60 * 1000); // 120 minutes from now
    const timeUntilExpiration = Math.max(adjustedExpirationTime - currentTime, expirationTime - currentTime);
    
    timer(timeUntilExpiration)
      .pipe(takeWhile(() => this.isitAuthenticated()))
      .subscribe(() => {
        this.logout();
      });
  }

  private resetStatusFlags(): void {
    this.incorrect = false;
    this.locked = false;
    this.suspended = false;
    this.roleincorrect = false;
  }
}
