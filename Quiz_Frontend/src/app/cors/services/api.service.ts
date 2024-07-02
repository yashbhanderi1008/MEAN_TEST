import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class APIService {

  constructor(private http: HttpClient) { }

  getAllAQuestion(): Observable<any> {
    return this.http.get('user/questions')
  }

  getAllUsers(): Observable<any> {
    return this.http.get('user/')
  }

  addQuestion(question: any): Observable<any> {
    return this.http.post('user/questions', question)
  }

  userDetails(): Observable<any> {
    return this.http.get('user/details')
  }

  getQuiz(): Observable<any> {
    return this.http.get('user/paper')
  }

  addResult(score: Number, quizId: string): Observable<any> {
    return this.http.post('user/result', { score: score, quizId: quizId });
  }

  userResult(): Observable<any> {
    return this.http.get('user/result')
  }

  userQuizHistory(): Observable<any> {
    return this.http.get('user/history')
  }
}
