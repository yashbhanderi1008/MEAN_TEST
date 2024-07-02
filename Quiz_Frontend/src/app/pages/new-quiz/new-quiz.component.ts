import { Component, OnInit } from '@angular/core';
import { APIService } from 'src/app/cors/services/api.service';

@Component({
  selector: 'app-new-quiz',
  templateUrl: './new-quiz.component.html',
  styleUrls: ['./new-quiz.component.scss']
})
export class NewQuizComponent implements OnInit {

  quizData: any; 
  selectedOptions: { [questionId: string]: string } = {}; 
  isQuiz: boolean = true; 
  results: any[] = []; 
  score: number = 0; 
  total: number = 0; 
  showError: boolean = false; 

  constructor(private apiService: APIService) { }

  ngOnInit(): void {
    this.getQuiz();
  }

  getQuiz(): void {
    this.apiService.getQuiz().subscribe({
      next: (response) => {
        this.quizData = response.data;
        this.total = this.quizData.length; 
      },
      error: (err) => {
        console.error('Error fetching quiz:', err);
      }
    });
  }

  submitQuiz(): void {
    this.results = this.quizData.questions.map((question: any) => ({
      questionText: question.question,
      selected: this.selectedOptions[question._id],
      correct: question.options[question.correctOptionIndex],
      isCorrect: this.selectedOptions[question._id] === question.options[question.correctOptionIndex]
    }));

    this.score = this.results.filter(result => result.isCorrect).length;
    
    this.apiService.addResult(this.score, this.quizData._id).subscribe({
      next: (response) => {
        console.log(response);
      },
      error: (err) => {
        console.log(err);
      }
    })
    this.isQuiz = false;

    this.showError = this.results.some(result => !result.selected);
  }
}
