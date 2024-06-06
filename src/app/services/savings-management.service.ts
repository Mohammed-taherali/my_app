import { Injectable, inject } from '@angular/core';
import { CollectionReference, Firestore, addDoc, collection, doc, getDoc, getDocs, orderBy, query, updateDoc, where } from '@angular/fire/firestore';

@Injectable({
  providedIn: 'root'
})
export class SavingsManagementService {

  firestore: Firestore = inject(Firestore);
  savingsRef: CollectionReference;
  savingsDetailRef: CollectionReference;
  constructor() {
    this.savingsRef = collection(this.firestore, "savings")
    this.savingsDetailRef = collection(this.firestore, "savingsDetails")
  }


  // Add functions
  async addSIP(doc: any): Promise<string> {
    const docRef = await addDoc(this.savingsRef, doc)
    return docRef.id
  }

  async addSavingsDetail(doc: any): Promise<string> {
    const docRef = await addDoc(this.savingsDetailRef, doc)
    return docRef.id
  }

  // Update functions
  async updateSipBalance(docId: string, data: any) {
    const docRef = doc(this.firestore, "savings", docId)
    return await updateDoc(docRef, data);
  }

  // Get functions
  async getSipById(sipId: string) {
    const docRef = doc(this.firestore, "savings", sipId);
    const docSnap = await getDoc(docRef);
    return docSnap.data()
  }

  async getAllDocuments(user: string) {
    const q = query(this.savingsRef, where("user", "==", user), orderBy("dateModified", "desc"))
    const snapShot = await getDocs(q);
    let docs: any = []
    let index = 1;
    snapShot.forEach((doc) => {
      docs.push({
        ...doc.data(),
        serial: index++,
        id: doc.id
      })
    });
    return docs
  }

  async getAllSips(sipId: string) {
    const q = query(collection(this.firestore, "savingsDetails"), where("sipId", "==", sipId), orderBy("dateCreated", "desc"))
    const docSnap = await getDocs(q)
    let docData: any[] = [];
    docSnap.forEach(doc => {
      docData.push(doc.data())
    })
    return docData
    // const docSnap = getDocs(doc(this.firestore, "savingsDetails"))
  }
}
