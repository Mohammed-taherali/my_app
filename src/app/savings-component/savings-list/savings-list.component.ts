import { Component, inject, OnInit, ViewChild } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { Router, RouterModule } from '@angular/router';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from "@angular/material/form-field";
import { provideNativeDateAdapter } from '@angular/material/core';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { FormGroup, FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MatNativeDateModule } from '@angular/material/core';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { MatSortModule } from '@angular/material/sort';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { Sort } from "@angular/material/sort";
import { animate, state, style, transition, trigger } from '@angular/animations';
import { SavingsManagementService } from '../../services/savings-management.service';

@Component({
  selector: 'app-savings-list',
  standalone: true,
  providers: [provideNativeDateAdapter()],
  imports: [MatDatepickerModule, CommonModule, MatFormFieldModule, FormsModule, MatSelectModule, RouterModule, MatNativeDateModule, MatInputModule, ReactiveFormsModule, MatPaginatorModule, MatTableModule, MatSortModule, MatIconModule, MatButtonModule, MatMenuModule],
  templateUrl: './savings-list.component.html',
  styleUrl: './savings-list.component.css',
  animations: [
    trigger('detailExpand', [
      state('collapsed', style({ height: '0px', minHeight: '0' })),
      state('expanded', style({ height: '*' })),
      transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
    ]),
  ],
})
export class SavingsListComponent {
  @ViewChild(MatPaginator, { static: true }) paginator!: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort!: MatSort;

  authService: AuthService = inject(AuthService);
  _router: Router = inject(Router);
  savingService: SavingsManagementService = inject(SavingsManagementService);
  savings: any;
  dataSource!: MatTableDataSource<any>;
  columnsToDisplay = ['sipName', 'totalAmount', 'endDate', 'pendingAmount', 'paidAmount', 'star'];

  sortData(sort: Sort) {
    const data = this.savings.slice();
    if (!sort.active || sort.direction === "") {
      this.dataSource = data;
      return;
    }
    this.dataSource = data.sort((a: any, b: any) => {
      const isAsc = sort.direction === "asc";
      switch (sort.active) {
        case "sipName":
          return this.compare(a.sipName, b.sipName, isAsc);
        case "totalAmount":
          return this.compare(a.totalAmount, b.totalAmount, isAsc);
        case "endDate":
          return this.compare(a.endDate, b.endDate, isAsc);
        case "pendingAmount":
          return this.compare(a.pendingAmount, b.pendingAmount, isAsc);
        case "paidAmount":
          return this.compare(a.paidAmount, b.paidAmount, isAsc);
        default:
          return 0;
      }
    });
  }

  compare(a: number | string, b: number | string, isAsc: boolean) {
    return (a < b ? -1 : 1) * (isAsc ? 1 : -1);
  }

  trackByIdentity(index: any, item: any) {
    return item.id;
  }

  ngOnInit() {
    this.initializeData()
  }

  async initializeData() {
    const docs = await this.savingService.getAllDocuments(this.authService.user)
    this.savings = docs
    this.dataSource = new MatTableDataSource(this.savings)
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
    this.dataSource.paginator.firstPage()
  }
}
