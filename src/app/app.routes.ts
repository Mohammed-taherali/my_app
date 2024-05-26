import { Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { SignupComponent } from './signup/signup.component';
import { LoginComponent } from './login/login.component';
import { authGuard } from './auth.guard';
import { UserDashboardComponent } from './user-dashboard/user-dashboard.component';
import { AddTransactionComponent } from './add-transaction/add-transaction.component';
import { SavingsComponent } from './savings/savings.component';

export const routes: Routes = [
    { path: "", component: LoginComponent },
    { path: "signup", component: SignupComponent },
    {
        path: "dashboard",
        component: UserDashboardComponent,
        canActivate: [authGuard],
        children: [
            { path: "home", component: HomeComponent },
            { path: "addTransaction", component: AddTransactionComponent },
            { path: "savings", component: SavingsComponent },
        ]
    },
    { path: "**", redirectTo: "" }
];
