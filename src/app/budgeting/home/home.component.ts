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
import { Sort } from "@angular/material/sort";
import { animate, state, style, transition, trigger } from '@angular/animations';
import { DbManagementService } from '../../services/db-management.service';
import { AlertService } from '../../services/alert.service';

@Component({
  selector: 'app-home',
  standalone: true,
  providers: [provideNativeDateAdapter()],
  imports: [MatDatepickerModule, CommonModule, MatFormFieldModule, FormsModule, MatSelectModule, RouterModule, MatNativeDateModule, MatInputModule, ReactiveFormsModule, MatPaginatorModule, MatTableModule, MatSortModule, MatIconModule, MatButtonModule],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css',
  animations: [
    trigger('detailExpand', [
      state('collapsed', style({ height: '0px', minHeight: '0' })),
      state('expanded', style({ height: '*' })),
      transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
    ]),
  ],
})
export class HomeComponent implements OnInit {
  @ViewChild(MatPaginator, { static: true }) paginator!: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort!: MatSort;

  authService: AuthService = inject(AuthService)
  _router: Router = inject(Router)
  dbService: DbManagementService = inject(DbManagementService)
  alertService: AlertService = inject(AlertService)

  range = new FormGroup({
    start: new FormControl<Date | null>(null),
    end: new FormControl<Date | null>(null),
  });
  transactions: any;
  dataSource!: MatTableDataSource<any>;
  // columnsToDisplay = ['serial', 'transactionName', 'amount', 'expand'];
  columnsToDisplay = ['transactionName', 'amount', 'type'];
  // columnsToDisplay = ['serial', 'transactionName', 'amount', 'type', 'balance', 'transDate'];
  expandedElement: any | null;
  isFiltered: boolean = false;
  openFilters: boolean = false;
  type: string = "all";
  transName: string = "";
  userBalance: any;

  async resetFiters() {
    this.type = "all";
    this.transName = ""
    this.range.reset()
    this.initializeData()
    this.isFiltered = false
    this.openFilters = false
  }

  async advanceSearch() {
    const startDate = this.range.get("start")?.value
    const endDate = this.range.get("end")?.value
    console.log("start and end dates: ", startDate, endDate);

    if ((endDate?.getTime() && startDate?.getTime()) && endDate?.getTime() < startDate?.getTime()) {
      await this.alertService.showAlert("error", "End date cannot be greater than start date!", "Ok")
      return
    }
    if (endDate !== null && startDate === null) {
      this.alertService.showAlert("error", "Please enter start date", "Ok")
      return;
    }

    let docs = await this.dbService.advanceSearch(this.authService.user, this.type, startDate, endDate)
    this.transactions = docs
    this.dataSource = new MatTableDataSource(this.transactions)
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
    this.dataSource.paginator.firstPage()
    this.isFiltered = true
    // console.log("docs ", docs);

    // console.log("start and end dates and type", this.range.get("start")?.value, this.range.get("end")?.value, this.type);
  };

  sortData(sort: Sort) {
    const data = this.transactions.slice();
    if (!sort.active || sort.direction === "") {
      this.dataSource = data;
      return;
    }
    this.dataSource = data.sort((a: any, b: any) => {
      const isAsc = sort.direction === "asc";
      switch (sort.active) {
        case "serial":
          return this.compare(a.serial, b.serial, isAsc);
        case "amount":
          return this.compare(a.amount, b.amount, isAsc);
        case "transactionName":
          return this.compare(a.transactionName, b.transactionName, isAsc);
        case "type":
          return this.compare(a.type, b.type, isAsc);
        default:
          return 0;
      }
    });
  }

  // mat table filter
  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  compare(a: number | string, b: number | string, isAsc: boolean) {
    return (a < b ? -1 : 1) * (isAsc ? 1 : -1);
  }

  ngOnInit() {
    this.initializeData()
  }

  async initializeData() {
    const documents = await this.dbService.getAllDocuments(this.authService.user)
    let docs: any = []
    let index = 1;
    documents.forEach((doc) => {
      docs.push({
        ...doc.data(),
        serial: index++,
        id: doc.id
      })
    })
    this.transactions = docs
    this.dataSource = new MatTableDataSource(this.transactions)
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
    this.dataSource.paginator.firstPage()

    this.userBalance = this.dbService.userBalance
  }
}
