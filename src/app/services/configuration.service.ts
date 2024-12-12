// configuration.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ConfigurationService {
  private apiUrl = 'http://localhost:8080/api/configuration';

  constructor(private http: HttpClient) {}

  getConfiguration(): Observable<any> {
    return this.http.get(this.apiUrl);
  }

  updateConfiguration(config: any): Observable<any> {
    return this.http.put(this.apiUrl, config);
  }
}
