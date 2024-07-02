import { Component } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthenticationService } from 'src/app/cors/services/authentication.service';

@Component({
  selector: 'app-sign-up',
  templateUrl: './sign-up.component.html',
  styleUrls: ['./sign-up.component.scss']
})
export class SignUpComponent {
  constructor(private formBuilder: FormBuilder, private router: Router, private authService: AuthenticationService) { }

  form!: FormGroup;
  submitted = false;
  error: string | null = null;

  ngOnInit() {
    this.initForm();
  }

  initForm(): void {
    this.form = this.formBuilder.group({
      username: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.pattern('^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,3}$')]],
      password: ['', [Validators.required]],
      role: ['', [Validators.required]]
    });
  }
  ngOnChange() {
    console.log(this.error);

  }
  onSubmit() {
    this.submitted = true;

    if (this.form.invalid) {
      return;
    }
    
    this.authService.register(this.form.value).subscribe({
      next: (response) => {
        console.log(response);
        this.router.navigate(['/login'])
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
