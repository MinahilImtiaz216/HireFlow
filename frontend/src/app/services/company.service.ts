import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Company, CandidateProfile, AdminStats, AdminUser } from '../models/models';

@Injectable({ providedIn: 'root' })
export class CompanyService {
  private baseUrl = 'http://localhost:5000/api';

  constructor(private http: HttpClient) {}

  getCompanies(): Observable<Company[]> {
    return this.http.get<Company[]>(`${this.baseUrl}/companies`);
  }

  getMyCompany(): Observable<Company> {
    return this.http.get<Company>(`${this.baseUrl}/companies/me`);
  }

  updateMyCompany(data: Partial<Company>): Observable<Company> {
    return this.http.put<Company>(`${this.baseUrl}/companies/me`, data);
  }

  getDashboard(): Observable<object> {
    return this.http.get(`${this.baseUrl}/companies/me/dashboard`);
  }

  getMyCandidateProfile(): Observable<CandidateProfile> {
    return this.http.get<CandidateProfile>(`${this.baseUrl}/candidates/me`);
  }

  updateCandidateProfile(data: Partial<CandidateProfile>): Observable<CandidateProfile> {
    return this.http.put<CandidateProfile>(`${this.baseUrl}/candidates/me`, data);
  }

  getAdminStats(): Observable<AdminStats> {
    return this.http.get<AdminStats>(`${this.baseUrl}/admin/stats`);
  }

  getAdminUsers(): Observable<AdminUser[]> {
    return this.http.get<AdminUser[]>(`${this.baseUrl}/admin/users`);
  }

  updateUserStatus(id: string, isActive: boolean): Observable<object> {
    return this.http.put(`${this.baseUrl}/admin/users/${id}/status`, { isActive });
  }

  deleteUser(id: string): Observable<object> {
    return this.http.delete(`${this.baseUrl}/admin/users/${id}`);
  }

  getAdminJobs(): Observable<object[]> {
    return this.http.get<object[]>(`${this.baseUrl}/admin/jobs`);
  }

  deleteAdminJob(id: string): Observable<object> {
    return this.http.delete(`${this.baseUrl}/admin/jobs/${id}`);
  }
}
