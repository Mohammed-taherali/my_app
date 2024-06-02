import { Component, OnInit, inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { SavingsManagementService } from '../../services/savings-management.service';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { AlertService } from '../../services/alert.service';

@Component({
  selector: 'app-add-sip',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatIconModule,
    MatButtonModule,
    MatDatepickerModule
  ],
  templateUrl: './add-sip.component.html',
  styleUrl: './add-sip.component.css'
})
export class AddSipComponent implements OnInit {
  router: Router = inject(Router)
  activatedRoute: ActivatedRoute = inject(ActivatedRoute);
  savingsService: SavingsManagementService = inject(SavingsManagementService);
  authService: AuthService = inject(AuthService);
  alertService: AlertService = inject(AlertService);
  sipId: string = "";
  sipDetails: any;
  isLoaded: boolean = false;
  fb: FormBuilder = inject(FormBuilder);
  sf: FormGroup = new FormGroup({});

  async ngOnInit() {
    this.sipId = this.activatedRoute.snapshot.paramMap.get("sipId")!
    this.sipDetails = await this.savingsService.getSipById(this.sipId);
    this.sf = this.fb.group({
      totalAmount: [{ value: this.sipDetails.totalAmount, disabled: true }, [Validators.required, Validators.min(1)]],
      pendingAmount: [{ value: this.sipDetails.pendingAmount, disabled: true }],
      monthlySip: [this.sipDetails.monthlySip, [Validators.required, Validators.min(1), Validators.max(this.sipDetails.pendingAmount)]],
      dateCreated: [new Date()],
      dateModified: [new Date()],
      sipName: [{ value: this.sipDetails.sipName, disabled: true }, Validators.required],
      savedAmount: [{ value: this.sipDetails.savedAmount, disabled: true }],
      sipId: this.sipId,
      user: [this.authService.user]
    });
    this.isLoaded = true
  }

  async onSubmit() {
    if (!this.sf.valid) {
      await this.alertService.showAlert("error", "Please add the SIP amount!", "Dismiss", false);
      return;
    }
    const res = await this.alertService.showAlert("question", 'Are you sure you want to add this saving?', 'Yes', true);
    if (!res) {
      return;
    }
    this.sf.get("savedAmount")?.setValue(this.sf.get("savedAmount")?.value + this.sf.get("monthlySip")?.value)
    this.sf.get("pendingAmount")?.setValue(this.sf.get("pendingAmount")?.value - this.sf.get("monthlySip")?.value)
    console.log("final form value ", this.sf.getRawValue());
    const docId = await this.savingsService.addSavingsDetail(this.sf.getRawValue())
    await this.savingsService.updateSipBalance(
      this.sipId,
      {
        dateModified: new Date(),
        pendingAmount: this.sf.get("pendingAmount")?.value,
        savedAmount: this.sf.get("savedAmount")?.value
      }
    )
    console.log("savings detail added with docId: ", docId);
    this.alertService.openSnackBar("Savings successfully added!")
    this.router.navigateByUrl("/dashboard/savingsList")
  }

}
