import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Utente } from '../models/utente.model';
import { UtenteAndLoginService } from '../services/utente-and-login.service';
import { UtilitiesService } from '../services/utilities.service';
import { Ruolo } from '../models/ruolo.model';
import { Router } from '@angular/router';

@Component({
  selector: 'app-registrazione',
  templateUrl: './registrazione.component.html',
  styleUrls: ['./registrazione.component.css']
})
export class RegistrazioneComponent implements OnInit {
  private utente: Utente = null;
  regForm: FormGroup;
  utenteInserito: string;

  constructor(public login: UtenteAndLoginService,
              private utilities: UtilitiesService,
              private router: Router) {
  }

  ngOnInit() {
    this.regForm = new FormGroup({
      'emailSU': new FormControl(null, [Validators.required, Validators.email]),
      'passwordSU': new FormControl(null,
        [
          Validators.required,
          Validators.minLength(4)
          // this.passwordsNotMatching.bind(this)
        ]),
      'passwordRe': new FormControl(null, [
        Validators.required
        // this.passwordReNotMatching.bind(this)
      ])
    });
  }

  onSubmitNewUser() {
    const email: string = this.regForm.get('emailSU').value;
    const password: string = this.regForm.get('passwordSU').value;

    this.utente = new Utente(
      null,
      email,
      password,
      false,
      false,
      0,
      this.utilities.dateToString(new Date()),
      this.utilities.dateToString(new Date()),
      new Ruolo(3, "utente"),
    );
    if (this.regForm.valid) {
      this.login.newUser(this.utente).subscribe((result: boolean) => {
        if (!result) {
          this.utenteInserito = 'error';
        } else {
          this.utenteInserito = 'success';
          this.logNewUserIn(email, password);
        }
      });

      this.regForm.reset();
    }
  }

  private logNewUserIn(email: string, password: string) {
    this.login.login(
      email,
      password
    )
      .subscribe(
        (isLoggedIn: boolean) => {
          if (isLoggedIn) {
            this.login.loadUser(+this.login.id, this.login.jwt).subscribe(
              (utente: Utente) => {
                localStorage.setItem('savedUser', JSON.stringify(utente));
                this.login.utente = utente;
                this.router.navigateByUrl('/home');
              });
          }
        },
        err => {
          this.login.setLoggedInAndUser(false, null);
        }
      );
  }

  passwordsNotMatching(control?: FormControl): { [s: string]: boolean } {
    if (this.regForm &&
      (control.value !== this.regForm.get('passwordRe').value)
    ) {
      return {'passwordDiverse': true};
    }
    // return null;
  }

  passwordReNotMatching(control?: FormControl): { [s: string]: boolean } {
    if (this.regForm &&
      (control.value !== this.regForm.get('passwordSU').value)
    ) {
      return {'passwordDiverse': true};
    }
    // return null;
  }

}
