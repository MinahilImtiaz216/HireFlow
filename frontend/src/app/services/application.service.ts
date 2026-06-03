import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Application } from '../models/models';

@Injectable({ providedIn: 'root' })
export class ApplicationService {
  private apiUrl = 'http://localhost:5000/api/applications';

  constructor(private http: HttpClient) {}

  apply(jobId: string, data: object): Observable<Application> {
    return this.http.post<Application>(`${this.apiUrl}/jobs/${jobId}/apply`, data);
  }

  getMyApplications(): Observable<Application[]> {
    return this.http.get<Application[]>(`${this.apiUrl}/my`);
  }

  getJobApplications(jobId: string): Observable<Application[]> {
    return this.http.get<Application[]>(`${this.apiUrl}/jobs/${jobId}`);
  }

  updateStatus(id: string, status: string): Observable<Application> {
    return this.http.put<Application>(`${this.apiUrl}/${id}/status`, { status });
  }

  withdraw(id: string): Observable<{ message: string }> {
    return this.http.delete<{ message: string }>(`${this.apiUrl}/${id}`);
  }
}
