import { Component, inject } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatSelectModule } from '@angular/material/select';
import { DbManagementService } from '../services/db-management.service';
import { CommonModule } from '@angular/common';
import { AlertService } from '../services/alert.service';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-add-transaction',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule, MatSelectModule],
  templateUrl: './add-transaction.component.html',
  styleUrl: './add-transaction.component.css'
})
export class AddTransactionComponent {

  fb = inject(FormBuilder);
  dbService = inject(DbManagementService)
  alertService = inject(AlertService)
  authService = inject(AuthService)
  username: string | null | undefined = this.authService.user;
  type: string = "expense";
  tf: FormGroup = new FormGroup({});

  constructor() {
    this.tf = this.fb.group({
      amount: [0, [Validators.required, Validators.min(1)]],
      balanceAmount: [this.dbService.userBalance],
      dateCreated: [""],
      dateModified: [""],
      fromIncome: [true],
      transactionName: ["", Validators.required],
      type: [""],
      user: [this.username]
    });
  }

  async onSubmit() {
    this.markFormGroupTouched(this.tf);
    if (!this.tf.valid) {
      await this.alertService.showAlert("error", "Please fill in all the required fields", "Dismiss", false);
      return;
    }

    const res = await this.alertService.showAlert('question', 'Are you sure you want to add this transaction?', 'Yes', true);
    if (!res) {
      return;
    }
    if (this.type == "income") {
      this.tf.removeControl("fromIncome")
      this.dbService.userBalance += parseInt(this.tf.get("amount")!.value)
    } else if (this.type == "expense" && this.tf.get("fromIncome")!.value == true) {
      this.dbService.userBalance -= parseInt(this.tf.get("amount")!.value)
    }
    this.tf.get("balanceAmount")!.setValue(this.dbService.userBalance);
    this.tf.get("type")!.setValue(this.type)
    this.tf.get("dateCreated")!.setValue(new Date())
    this.tf.get("dateModified")!.setValue(new Date())
    console.log("final form value: ", this.tf.value);

    // insert transaction and then update the user balance
    const docRef = await this.dbService.insertTransaction(this.tf.value);
    console.log("document: ", docRef.id);
    this.alertService.openSnackBar("Transaction added successfully")
    await this.dbService.updateBalance();
    this.tf.get("transactionName")!.reset()
    this.tf.get("amount")!.reset()

    // again add the type fromIncome parameter for new transaction addition
    if (!this.tf.contains("fromIncome")) {
      this.tf.addControl("fromIncome", new FormControl(false))
    }
  }

  markFormGroupTouched(formGroup: FormGroup) {
    Object.values(formGroup.controls).forEach((control) => {
      control.markAsTouched();

      if (control instanceof FormGroup) {
        this.markFormGroupTouched(control);
      }
    });
  }
}
