import { Component } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthenticationService } from 'src/app/cors/services/authentication.service';
import { TokenService } from 'src/app/cors/services/token.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {
  constructor(private formBuilder: FormBuilder, private router: Router, private authService: AuthenticationService, private tokenService: TokenService) { }

  form!: FormGroup;
  submitted = false;
  error: string | null = null;
  roles: string[] = ['User', 'Admin'];

  ngOnInit() {
    this.initForm();
  }

  initForm(): void {
    this.form = this.formBuilder.group({
      email: ['', [Validators.required]],
      password: ['', [Validators.required]],
      role: ['User']
    });
  }

  onSubmit() {
    this.submitted = true;

    if (this.form.invalid) {
      return;
    }
    console.log(this.form.value)
    this.authService.login(this.form.value).subscribe({
      next: (response) => {
        this.tokenService.setToken(response.data);

        if (this.form.value.role === "Admin") {
          this.router.navigate(['admin'])
        } else if (this.form.value.role === "User") {
          this.router.navigate(['user'])
        }
      },
      error: (err) => {
        this.error = err.error.message
      },
    })
  }

  get f(): { [key: string]: AbstractControl } {
    return this.form.controls;
  }
}
