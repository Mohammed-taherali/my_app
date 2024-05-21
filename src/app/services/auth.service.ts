import { Injectable, inject, signal } from '@angular/core';
import { Auth, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, updateProfile, user } from '@angular/fire/auth';
import { Observable, from } from 'rxjs';
import { userInterface } from '../user.interface';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  firebaseAuth = inject(Auth)
  user$ = user(this.firebaseAuth)
  currentUserSig = signal<userInterface | null | undefined>(undefined)

  constructor() { }

  registerUser(username: string, email: string, password: string): Observable<void> {
    const snapshot = createUserWithEmailAndPassword(
      this.firebaseAuth,
      email,
      password)
      .then(response => updateProfile(response.user, { displayName: username }));
    return from(snapshot);
  }

  loginUser(email: string, password: string): Observable<void> {
    const snapshot = signInWithEmailAndPassword(this.firebaseAuth, email, password).then(
      () => {}
    )
    return from(snapshot)
  }

  logoutUser(): Observable<void> {
    const promise = signOut(this.firebaseAuth)
    return from(promise)
  }
}
