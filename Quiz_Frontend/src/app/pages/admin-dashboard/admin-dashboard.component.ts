import { Component, ElementRef, OnChanges, OnInit, SimpleChanges, ViewChild } from '@angular/core';
import { AbstractControl, FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { APIService } from 'src/app/cors/services/api.service';

@Component({
  selector: 'app-admin-dashboard',
  templateUrl: './admin-dashboard.component.html',
  styleUrls: ['./admin-dashboard.component.scss']
})
export class AdminDashboardComponent implements OnInit {

  constructor(private formBuilder: FormBuilder, private apiService: APIService) { }

  form!: FormGroup;
  submitted = false;
  @ViewChild('closeForm') closeForm!: ElementRef
  data = {
    questions: [],
    users: []
  }

  ngOnInit(): void {
    this.getAllQuestion();
    this.getAllUsers();
    this.initForm();
  }

  currentComponent: string = 'overview';

  initForm() {
    this.form = this.formBuilder.group({
      question: ['', [Validators.required]],
      options: this.formBuilder.array(this.createOptionControls()),
      correctOptionIndex: ['', [Validators.required, Validators.max(3)]],
      difficultyRating: ['', [Validators.required, Validators.max(10)]]
    })
  }

  createOptionControls(): FormGroup[] {
    return Array(4).fill(0).map(() => this.formBuilder.group({
      option: ['', Validators.required]
    }));
  }

  get f(): { [key: string]: AbstractControl } {
    return this.form.controls;
  }

  get options() {
    return this.form.get('options') as FormArray;
  }

  onSubmit() {
    this.submitted = true;
    if (this.form.invalid) {
      return;
    }

    const optionsArray = this.options.value.map((option: { option: string }) => option.option);

    const formData = {
      question: this.form.value.question,
      options: optionsArray,
      correctOptionIndex: this.form.value.correctOptionIndex,
      difficultyRating: this.form.value.difficultyRating
    };

    this.apiService.addQuestion(formData).subscribe({
      next: (response) => {
        console.log(response.data);
        this.getAllQuestion();
      },
      error: (err) => {
        console.log(err);
      }
    })

    this.closeForm.nativeElement.click()
  }

  showComponent(component: string) {
    this.currentComponent = component;
  }

  getAllQuestion() {
    this.apiService.getAllAQuestion().subscribe({
      next: (response) => {
        this.data.questions = response.data
        console.log(response);

      },
      error: (err) => {
        console.log(err);
      }
    })
  }

  getAllUsers() {
    this.apiService.getAllUsers().subscribe({
      next: (response) => {
        this.data.users = response.data
        console.log(response);

      },
      error: (err) => {
        console.log(err);
      }
    })
  }
}
