import { Injectable } from '@angular/core';
import Swal from "sweetalert2";
// import { MatSnackBarModule } from '@angular/material/snack-bar';
import {
  MatSnackBar,
  MatSnackBarHorizontalPosition,
  MatSnackBarVerticalPosition,
} from '@angular/material/snack-bar';
@Injectable({
  providedIn: 'root'
})
export class AlertService {
  private horizontalPosition: MatSnackBarHorizontalPosition = 'right';
  private verticalPosition: MatSnackBarVerticalPosition = 'top';
  constructor(private _snackBar: MatSnackBar) { }

  async showAlert(iconType: any, title?: string, confirmText?: string, showCancelButton?: boolean, time?: number) {
    const result = await Swal.fire({
      icon: iconType,
      title: title,
      showCancelButton: showCancelButton,
      confirmButtonText: confirmText ? confirmText : "OK",
      cancelButtonText: 'Cancel',
      timer: time ? time : undefined
    })
    return result.isConfirmed;
  }

  openSnackBar(message: string, buttonText: string = "Okay") {
    this._snackBar.open(message, buttonText, {
      duration: 5000,
      horizontalPosition: this.horizontalPosition,
      verticalPosition: this.verticalPosition,
    });
  }
}
