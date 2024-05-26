import { Injectable, inject } from '@angular/core';
import { CollectionReference, Firestore, addDoc, collection } from '@angular/fire/firestore';

@Injectable({
  providedIn: 'root'
})
export class SavingsManagementService {

  firestore: Firestore = inject(Firestore);
  savingsRef: CollectionReference;
  constructor() {
    this.savingsRef = collection(this.firestore, "savings")
  }

  async addSIP(doc: any): Promise<string> {
    const docRef = await addDoc(this.savingsRef, doc)
    return docRef.id
  }
}
