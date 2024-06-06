import { Component, OnInit, inject } from '@angular/core';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { SavingsManagementService } from '../../services/savings-management.service';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatIconModule } from '@angular/material/icon';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-sip-details',
  standalone: true,
  imports: [MatExpansionModule, MatIconModule, CommonModule, RouterModule, MatButtonModule],
  templateUrl: './sip-details.component.html',
  styleUrl: './sip-details.component.css'
})
export class SipDetailsComponent implements OnInit {
  activedRoute: ActivatedRoute = inject(ActivatedRoute);
  savingService: SavingsManagementService = inject(SavingsManagementService)
  sipId: string | any;
  sipDetails: any;
  lastSip: any;
  ngOnInit() {
    this.activedRoute.paramMap.subscribe(params => {
      this.sipId = params.get("sipId")
      if (this.sipId) {
        this.getAllSipsById()
      }
   })
  }

  async getAllSipsById() {
    this.sipDetails = await this.savingService.getAllSips(this.sipId)
    console.log("sip details: ", this.sipDetails);
    this.lastSip = this.sipDetails[0];
    console.log("last sip: ", this.lastSip);
    
  }
}
