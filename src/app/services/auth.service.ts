import { Injectable, inject, signal } from '@angular/core';
import { Auth, UserCredential, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, updateProfile, user, GoogleAuthProvider, signInWithRedirect, getRedirectResult, signInWithPopup } from '@angular/fire/auth';
import { Observable, from, of } from 'rxjs';
import { userInterface } from '../user.interface';
import { DbManagementService } from './db-management.service';
import { Router } from '@angular/router';
import { AlertService } from './alert.service';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  user: string = "";
  username: string = "";
  uid: string = "";
  router = inject(Router)
  firebaseAuth = inject(Auth)
  dbService = inject(DbManagementService)
  alertService: AlertService = inject(AlertService)
  user$ = user(this.firebaseAuth)
  currentUserSig = signal<userInterface | null | undefined>(undefined)
  Gprovider: GoogleAuthProvider = new GoogleAuthProvider()

  constructor() { }

  async registerUser(username: string, email: string, password: string) {
    try {
      const response = await createUserWithEmailAndPassword(this.firebaseAuth, email, password)
      this.uid = response.user.uid
      this.dbService.addUser(this.uid, {
        email: response.user.email,
        name: username,
        uid: this.uid,
        role: "user"
      })
      updateProfile(response.user, { displayName: username })
      return true
    } catch (error: any) {
      console.log("auth error: ", error.code);
      this.handleAuthError(error.code)
      return false
    }
  }

  signInWithGoogle() {
    signInWithPopup(this.firebaseAuth, this.Gprovider)
      .then((result) => {
        // This gives you a Google Access Token. You can use it to access the Google API.
        const credential = GoogleAuthProvider.credentialFromResult(result)!;
        const token = credential.accessToken;
        // The signed-in user info.
        const user = result.user;
        console.log("user result: ", user);
        this.uid = result?.user.uid!
        this.dbService.checkUserPresent(this.uid).then(resp => {
          if (resp === false) {
            this.dbService.addUser(this.uid, {
              email: result?.user.email,
              name: result?.user.displayName,
              uid: this.uid,
              role: "user"
            })
          }
          this.router.navigateByUrl("/dashboard/home")
        })

      }).catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        const email = error.customData.email;
        const credential = GoogleAuthProvider.credentialFromError(error);
      });
  }

  async loginUser(email: string, password: string): Promise<boolean> {
    try {
      const response = await signInWithEmailAndPassword(this.firebaseAuth, email, password)
      this.user = response.user.email!
      this.uid = response.user.uid!
      this.username = response.user.displayName!
      await this.dbService.getUserBalance(this.uid);
      // this.router.navigateByUrl("/dashboard/home")
      return true
    } catch (error: any) {
      this.handleAuthError(error.code)
      return false
    }
  }

  logoutUser(): Observable<void> {
    const promise = signOut(this.firebaseAuth)
    return from(promise)
  }

  getCurrentUser(): Observable<any | null> {
    return of(this.firebaseAuth.currentUser);
  }

  initializeUser() {
    if (this.firebaseAuth.currentUser?.email !== undefined && this.firebaseAuth.currentUser.uid !== undefined) {
      this.user = this.firebaseAuth.currentUser?.email as string
      this.uid = this.firebaseAuth.currentUser?.uid
      this.username = this.firebaseAuth.currentUser.displayName!
      this.dbService.getUserBalance(this.uid)
    }
  }

  handleAuthError(code: any) {
    let errorMsg = "";
    switch (code) {
      case "auth/user-not-found":
        errorMsg = "No user found! Please create an account."
        break;
      case "auth/email-already-exists":
        errorMsg = "This email is already in use! Please use another email ID."
        break;
      case "auth/email-already-in-use":
        errorMsg = "This email is already in use! Please use another email ID."
        break;
      case "auth/invalid-credential":
        errorMsg = "Incorrect ID or password!"
        break;
      default:
        break;
    }
    this.alertService.showAlert("error", errorMsg, "OK", undefined, 3000)
  }
}
