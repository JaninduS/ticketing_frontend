import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { LogMessage } from '../../models/log-message.model';

@Injectable({
  providedIn: 'root',
})
export class TicketsService {
  private baseUrl: string = 'http://localhost:8080/simulation'; 
  private configurationUrl = 'http://localhost:8080/api/configuration';

  constructor(private http: HttpClient) {}

  getConfiguration(): Observable<any> {
    return this.http.get(this.configurationUrl); // GET request to retrieve configuration
  }

  // Start the simulation by making a POST request
  startSimulation(configuration: any): Observable<string> {
    return this.http.post<string>(`${this.baseUrl}/start`, configuration, { responseType: 'text' as 'json' });
  }

  // Stop the simulation by making a POST request
  stopSimulation(): Observable<string> {
    return this.http.post<string>(`${this.baseUrl}/stop`, {}, {responseType: 'text' as 'json' });
  }

  getLogs(): Observable<LogMessage[]> {
    return this.http.get<LogMessage[]>('http://localhost:8080/logs/all');
  }
}
