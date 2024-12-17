import { Component, OnDestroy, OnInit } from '@angular/core';
import { TicketsService } from '../../services/tickets.service';
import { ConfigurationService } from '../../services/configuration.service';
import { CommonModule } from '@angular/common';
import { interval, Subscription } from 'rxjs';
import { LogMessage } from '../../../models/log-message.model';

@Component({
  selector: 'app-tickets',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './tickets.component.html',
  styleUrl: './tickets.component.css',
})
export class TicketsComponent implements OnInit, OnDestroy {
  logMessages: string[] = [];
  ticketStatusLogs: string[] = [];
  isSimulationRunning: boolean = false;
  configuration: any = {};
  private statusPollingSubscription: Subscription | null = null;

  constructor(
    private ticketsService: TicketsService,
    private configurationService: ConfigurationService
  ) {}

  ngOnInit(): void {
    this.ticketsService.getConfiguration().subscribe(
      (config) => {
        this.configuration = config;
        this.addLog('Configuration loaded successfully');
      },
      (error) => {
        this.addLog('Error loading configuration: ' + error.message);
      }
    );
  }

  // Start simulation
  startSimulation() {
    if (
      this.configuration.totalTickets <= 0 ||
      this.configuration.maxTicketCapacity <= 0
    ) {
      this.addLog('Please provide valid total tickets and max capacity.');
      return;
    }

    this.ticketsService.startSimulation(this.configuration).subscribe(
      (response) => {
        this.isSimulationRunning = true;
        this.addLog(
          'Simulation started successfully with ' +
            this.configuration.vendorCount +
            ' vendors and ' +
            this.configuration.customerCount +
            ' customers.'
        );
        this.startPollingStatus();
      },
      (error) => {
        this.addLog('Error starting simulation: ' + error.message);
      }
    );
  }

  stopSimulation() {
    this.ticketsService.stopSimulation().subscribe(
      (response) => {
        this.addLog('Simulation stopped successfully.');
        this.isSimulationRunning = false;
        this.stopPollingStatus();
      },
      (error) => {
        this.addLog('Error stopping simulation: ' + error.message);
      }
    );
  }

  // Function to log messages with timestamp
  addLog(message: string): void {
    this.logMessages.unshift(`[${new Date().toLocaleTimeString()}] ${message}`);
  }

  addTicketStatusLog(message: string): void {
    this.ticketStatusLogs.unshift(
      `[${new Date().toLocaleTimeString()}] ${message}`
    );
  }

  loadLogs() {
    this.ticketsService.getLogs().subscribe(
      (logs) => {
        this.logMessages = logs.map(
          (log) =>
            `[${new Date(log.timestamp).toLocaleTimeString()}] ${log.message}`
        );
      },
      (error) => {
        this.addLog('Error fetching logs: ' + error.message);
      }
    );
  }
  loadTicketStatus() {
    this.ticketsService.getLogs().subscribe(
      (logs: LogMessage[]) => {
        this.ticketStatusLogs = logs.map(
          (log) =>
            `[${new Date(log.timestamp).toLocaleTimeString()}] ${log.message}`
        );
      },
      (error) => {
        this.addTicketStatusLog(
          'Error fetching ticket status logs: ' + error.message
        );
      }
    );
  }

  startPollingStatus(): void {
    if (!this.statusPollingSubscription) {
      this.statusPollingSubscription = interval(2000).subscribe(() => {
        this.loadTicketStatus();
      });
    }
  }

  stopPollingStatus(): void {
    if (this.statusPollingSubscription) {
      this.statusPollingSubscription.unsubscribe();
      this.statusPollingSubscription = null;
    }
  }

  ngOnDestroy(): void {
    this.stopPollingStatus();
  }
}
