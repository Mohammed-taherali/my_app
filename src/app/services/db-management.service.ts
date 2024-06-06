import { Injectable } from '@angular/core';
import { inject } from '@angular/core';
import { Firestore, collectionData, collection, addDoc, query, where, orderBy, getDoc, doc, setDoc, onSnapshot, CollectionReference, getDocs, updateDoc, QuerySnapshot, DocumentData } from '@angular/fire/firestore';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DbManagementService {
  // inject required services and modules
  firestore: Firestore = inject(Firestore);

  // Firebase collections
  transactionCollection = collection(this.firestore, "transactions")
  balanceCollection = collection(this.firestore, "balance")

  // variables
  balanceDocId: string = "";
  userBalance: any;

  constructor() { }
  async getAllDocuments(user: string) {
    const docRef = collection(this.firestore, "transactions");
    const q = query(docRef, where("user", "==", user),  orderBy("dateModified", "desc"))
    const snapShot = await getDocs(q);
    return snapShot
  }
  // getAllDocuments(user: string) {
  //   const q = query(collection(this.firestore, "transactions"), where("user", "==", user));
  //   let data: any = [];
  //   onSnapshot(q, (snapshot) => {
  //     snapshot.forEach(doc => {
  //       data.push(doc.data())
  //       console.log("data: ", data);

  //       // console.log("data: ", doc.data());
  //     })
  //   })
  //   return data;
  // }
  // console.log("doc snap: ", docSnap);

  // const querySnapshot = await onSnapshot(q);
  // querySnapshot.forEach((doc) => {
  //   // doc.data() is never undefined for query doc snapshots
  //   console.log(doc.id, " => ", doc.data());
  // });
  // try {
  //   let q: any = this.transactionCollection;
  //   q = query(q, where('user', "==", user));
  //   q = query(q, orderBy('dateModified', 'desc'));
  //   const documents = await collectionData(q, { idField: 'id' });
  //   return documents;
  // } catch (error) {
  //   console.error('Error fetching documents:', error);
  //   throw error;
  // }

  async advanceSearch(user: string, type?: string, startDate?: Date | null, endDate?: Date | null) {
    let whereClause = []
    if (type !== undefined && type !== 'all') {
      whereClause.push(where('type', '==', type))
    }
    if (startDate !== undefined && startDate !== null) {
      console.log("start date: ", startDate);
      whereClause.push(where('dateModified', '>=', startDate))
    }
    if (endDate !== undefined && endDate !== null) {
      console.log("end date: ", endDate);
      
      const endDatePlusOneDay = new Date(endDate!.getTime() + 24 * 60 * 60 * 1000); // Add one day
      whereClause.push(where('dateModified', '<=', endDatePlusOneDay));
    }
    const q = query(collection(this.firestore, "transactions"), ...whereClause, where("user", "==", user));
    const querySnapshot = await getDocs(q);
    let docs: any = []
    let index = 1;
    querySnapshot.forEach((doc) => {
      docs.push({
        ...doc.data(),
        serial: index++,
        id: doc.id
      })
    });
    return docs

    // try {
    //   const snapshot = await this.db.collection(this.TransCollection, (ref) => {
    //     let query: firebase.firestore.Query = ref;

    //     if (typeof filters !== 'undefined') {
    //       filters.forEach(f => {
    //         if (f['value'] !== "all") {
    //           query = query.where(f['key'], "==", f['value']);
    //         }
    //       })
    //     }
    //     query = query.orderBy("dateModified", "desc");
    //     return query;
    //   }).get().toPromise();
    //   return snapshot.docs.map((doc, index) => ({ serial: index + 1, id: doc.id, ...doc.data() }));
    // } catch (error) {
    //   console.error("Error getting documents: ", error);
    //   throw error;
    // }
  }

  async insertTransaction(transaction: any): Promise<any> {
    try {
      const docRef = await addDoc(this.transactionCollection, transaction);
      return docRef;
    } catch (error) {
      console.error('Error adding transaction:', error);
      throw error;
    }
  }

  async getTransactionById(id: string) {
    // try {
    //   const snapshot = await this.db.collection(this.TransCollection).doc(id);
    //   // const snapshot = await this.db.collection(this.IssueCollection).doc(id).get().toPromise();
    //   return snapshot.valueChanges();
    // } catch (error) {
    //   console.error("Error getting document by id: ", error);
    //   throw error;
    // }
  }

  // async updateDoc(uid?: string, doc?: any, balance?: boolean) {
  //   // return this.db.collection(this.TransCollection).doc(uid).update(doc);
  // }

  async addUser(uid: string, userDoc: any) {
    console.log("registering user with uid: ", uid);
    await setDoc(doc(this.firestore, "users", uid), userDoc)
    await setDoc(doc(this.firestore, "balance", uid), { balance: 0 })
  }

  async getUserBalance(uid: string) {
    this.balanceDocId = uid;
    const docRef = doc(this.firestore, "balance", this.balanceDocId);
    onSnapshot(docRef, (doc) => {
      if (doc.exists()) {
        this.userBalance = doc.data()['balance']
        console.log("current user balance is: ", this.userBalance);
      }
    });

  }

  async checkUserPresent(uid: string) {
    const docSnap = await getDoc(doc(this.firestore, "users", uid));
    if (docSnap.exists()) {
      return true
    } else {
      return false
    }
  }

  async updateBalance() {
    const docRef = doc(this.firestore, "balance", this.balanceDocId)
    return await updateDoc(docRef, {
      balance: this.userBalance
    })
    // return await updateDoc
    // return this.db.collection(this.balanceCollection).doc(this.balanceDocId).update({ balance: this.userBalance })
  }
}
