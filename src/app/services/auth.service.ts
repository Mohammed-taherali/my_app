import { Injectable, inject, signal } from '@angular/core';
import { Auth, UserCredential, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, updateProfile, user } from '@angular/fire/auth';
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
  uid: string = "";
  router = inject(Router)
  firebaseAuth = inject(Auth)
  dbService = inject(DbManagementService)
  alertService: AlertService = inject(AlertService)
  user$ = user(this.firebaseAuth)
  currentUserSig = signal<userInterface | null | undefined>(undefined)

  constructor() { }

  registerUser(username: string, email: string, password: string): Observable<void> {
    const snapshot = createUserWithEmailAndPassword(
      this.firebaseAuth,
      email,
      password)
      .then(response => {
        this.uid = response.user.uid;
        this.dbService.addUser(this.uid, {
          email: response.user.email,
          name: username,
          uid: this.uid,
          role: "user"
        })
        updateProfile(response.user, { displayName: username })
      });
    return from(snapshot);
  }

  async loginUser(email: string, password: string): Promise<void> {
    let response: UserCredential | undefined;
    try {
      response = await signInWithEmailAndPassword(this.firebaseAuth, email, password)
    } catch (error: any) {
      // console.log("error code: ", error.code);
      // console.log("error message: ", error.message);
      this.handleAuthError(error.code)
      // this.alertService.showAlert("error", "some error: " + error,)
      return
    }
    this.user = response?.user.email!
    this.uid = response?.user.uid!
    await this.dbService.getUserBalance(this.uid);
    this.router.navigateByUrl("/dashboard/home")
  }

  logoutUser(): Observable<void> {
    const promise = signOut(this.firebaseAuth)
    return from(promise)
  }

  getCurrentUser(): Observable<any | null> {
    return of(this.firebaseAuth.currentUser); // Return the current user immediately
  }

  initializeUser() {
    if (this.firebaseAuth.currentUser?.email !== undefined && this.firebaseAuth.currentUser.uid !== undefined) {
      this.user = this.firebaseAuth.currentUser?.email as string
      this.uid = this.firebaseAuth.currentUser?.uid
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
        errorMsg = "This email is already in user! Please use another email ID."
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
