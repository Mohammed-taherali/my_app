import { Routes } from '@angular/router';
import { HomeComponent } from './budgeting/home/home.component';
import { SignupComponent } from './signup/signup.component';
import { LoginComponent } from './login/login.component';
import { authGuard } from './auth.guard';
import { UserDashboardComponent } from './user-dashboard/user-dashboard.component';
import { AddTransactionComponent } from './budgeting/add-transaction/add-transaction.component';
import { SavingsComponent } from './savings-component/savings/savings.component';
import { SavingsListComponent } from './savings-component/savings-list/savings-list.component';
import { AddSipComponent } from './savings-component/add-sip/add-sip.component';
import { LandingComponent } from './landing/landing.component';

export const routes: Routes = [
    { path: "", component: LandingComponent, canActivate: [authGuard] },
    { path: "login", component: LoginComponent },
    { path: "signup", component: SignupComponent },
    {
        path: "dashboard",
        component: UserDashboardComponent,
        canActivate: [authGuard],
        children: [
            { path: "home", component: HomeComponent },
            { path: "addTransaction", component: AddTransactionComponent },
            { path: "addSavings", component: SavingsComponent },
            { path: "savingsList", component: SavingsListComponent },
            { path: "addSip/:sipId", component: AddSipComponent },
        ]
    },
    { path: "**", redirectTo: "" }
];
