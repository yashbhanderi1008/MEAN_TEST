import { AfterViewInit, Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup } from '@angular/forms';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { APIService } from 'src/app/cors/services/api.service';

@Component({
  selector: 'app-user-dashboard',
  templateUrl: './user-dashboard.component.html',
  styleUrls: ['./user-dashboard.component.scss']
})
export class UserDashboardComponent implements OnInit, AfterViewInit {
  constructor(private apiService: APIService, private formBuilder: FormBuilder) {
    this.dataSource = new MatTableDataSource<any>([]);
   }

  userDetails: any
  lastResult: any
  quizHistory: any

  displayedColumns: string[] = ['quizNo', 'score', 'date'];
  dataSource: MatTableDataSource<any>;

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  @Input() data: any;
  @Output() bookUpdate: EventEmitter<any> = new EventEmitter();
  @Output() bookDelete: EventEmitter<any> = new EventEmitter();

  submitted = false;
  form!: FormGroup;

  ngOnInit(): void {
    this.getUserDetails()
    this.getUserResult()
    this.getUserQuizHistory()    
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  get f(): { [key: string]: AbstractControl } {
    return this.form.controls;
  }

  onSubmit() {
    this.submitted = true;

    if (this.form.invalid) {
      return;
    }
  }

  getUserDetails() {
    this.apiService.userDetails().subscribe({
      next: (response) => {
        this.userDetails = response.data
      },
      error: (err) => {
        console.log(err);
      }
    })
  }

  getUserResult() {
    this.apiService.userResult().subscribe({
      next: (response) => {
        this.lastResult = response
      },
      error: (err) => {
        console.log(err);
      }
    })
  }

  getUserQuizHistory(){
    this.apiService.userQuizHistory().subscribe({
      next: (response) => {
        this.dataSource.data = response.data
      },
      error: (err) => {
        console.log(err);
      }
    })
  }
}
