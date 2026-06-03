import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Job } from '../models/models';

@Injectable({ providedIn: 'root' })
export class JobService {
  private apiUrl = 'http://localhost:5000/api/jobs';

  constructor(private http: HttpClient) {}

  getJobs(search?: string, location?: string, status?: string): Observable<Job[]> {
    let params = new HttpParams();
    if (search) params = params.set('search', search);
    if (location) params = params.set('location', location);
    if (status) params = params.set('status', status);
    return this.http.get<Job[]>(this.apiUrl, { params });
  }

  getJob(id: string): Observable<Job> {
    return this.http.get<Job>(`${this.apiUrl}/${id}`);
  }

  getMyJobs(): Observable<Job[]> {
    return this.http.get<Job[]>(`${this.apiUrl}/employer/my-jobs`);
  }

  createJob(data: Partial<Job>): Observable<Job> {
    return this.http.post<Job>(this.apiUrl, data);
  }

  updateJob(id: string, data: Partial<Job>): Observable<Job> {
    return this.http.put<Job>(`${this.apiUrl}/${id}`, data);
  }

  deleteJob(id: string): Observable<{ message: string }> {
    return this.http.delete<{ message: string }>(`${this.apiUrl}/${id}`);
  }
}
