import { Component, OnDestroy, inject, ViewEncapsulation } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { AlertService } from '../services/alert.service';
import { AuthService } from '../services/auth.service';
import { provideMomentDateAdapter } from '@angular/material-moment-adapter';
import { MatDatepicker, MatDatepickerModule } from '@angular/material/datepicker';
import { CommonModule } from '@angular/common';
import * as _moment from 'moment';
// tslint:disable-next-line:no-duplicate-imports
import { default as _rollupMoment, Moment } from 'moment';
import { SavingsManagementService } from '../services/savings-management.service';

const moment = _rollupMoment || _moment;

export const MY_FORMATS = {
  parse: {
    dateInput: 'MM/YYYY',
  },
  display: {
    dateInput: 'MM/YYYY',
    monthYearLabel: 'MMM YYYY',
    dateA11yLabel: 'LL',
    monthYearA11yLabel: 'MMMM YYYY',
  },
};

@Component({
  selector: 'app-savings',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatIconModule,
    MatButtonModule,
    MatDatepickerModule,
  ],
  templateUrl: './savings.component.html',
  styleUrl: './savings.component.css',
  providers: [
    provideMomentDateAdapter(MY_FORMATS),
  ],
})
export class SavingsComponent {
  fb: FormBuilder = inject(FormBuilder);
  sf: FormGroup = new FormGroup({});
  alertService: AlertService = inject(AlertService);
  authService: AuthService = inject(AuthService);
  savingsService: SavingsManagementService = inject(SavingsManagementService);

  constructor() {
    this.sf = this.fb.group({
      totalAmount: [0, [Validators.required, Validators.min(1)]],
      pendingAmount: [0],
      monthlySip: [0, [Validators.required, Validators.min(1)]],
      endDate: [{ value: moment(), disabled: true }],
      dateCreated: [''],
      dateModified: [''],
      sipName: ['', Validators.required],
      sipDetails: [{}],
      user: [this.authService.user]
    });
  }

  async onSubmit() {
    if (!this.sf.valid) {
      console.log("submit invalid form", this.sf.value);
      await this.alertService.showAlert("error", "Please fill in all the fields", "OK", false, 3000)
      return;
    }
    const res = await this.alertService.showAlert("question", "Are you sure you want to add the SIP?", "Yes", true)
    if (!res) {
      return;
    }
    const endDate = this.sf.get("endDate")?.value
    this.sf.get("endDate")?.setValue(moment(endDate, 'YYYY-MM').toDate())
    this.sf.get("pendingAmount")!.setValue(this.sf.controls?.['totalAmount'].value)
    this.sf.get("dateCreated")!.setValue(new Date())
    this.sf.get("dateModified")!.setValue(new Date())

    // use getRawValue since the endDate is disabled
    console.log("final form value: ", this.sf.getRawValue());
    const docId = await this.savingsService.addSIP(this.sf.getRawValue())
    console.log("doc written with ID: ", docId);
    this.alertService.openSnackBar("SIP added successfully")
    this.sf.reset()
    Object.keys(this.sf.controls).forEach(key => {
      this.sf.get(key)?.setErrors(null);
    });
  }
  updateEndDate() {
    const totalAmount = this.sf.get('totalAmount')?.value
    const monthlySip = this.sf.get('monthlySip')?.value
    if (totalAmount && monthlySip && totalAmount >= monthlySip) {
      const noOfMonths = Math.ceil(totalAmount / monthlySip)
      const currentDate = moment();
      const endDate = currentDate.add(noOfMonths, 'months');
      this.sf.get('endDate')?.setValue(endDate.format('YYYY-MM-DD'));
    }
  }

  checkMonthlySipError() {
    const totalAmount = this.sf.get('totalAmount')?.value;
    const monthlySip = this.sf.get('monthlySip')?.value;
    if (monthlySip > totalAmount) {
      this.sf.get('monthlySip')?.setErrors({ 'monthlySipError': true }); // Set custom error
      this.sf.get('endDate')?.reset()
    } else {
      this.sf.get('monthlySip')?.setErrors(null); // Clear error
    }
  }
}