import { Component, OnInit } from '@angular/core';
import { ConfigurationService } from '../../services/configuration.service';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';


@Component({
  selector: 'app-configuration',
  standalone: true,
  imports: [FormsModule, RouterLink],
  templateUrl: './configuration.component.html',
  styleUrl: './configuration.component.css'
})
export class ConfigurationComponent implements OnInit{
  configuration: any = {
    totalTickets: 0,
    maxTicketCapacity: 0,
    ticketReleaseRate: 0,
    customerRetrievalRate: 0,
    vendorCount: 0,
    customerCount: 0,
  };

  constructor(private configService: ConfigurationService) {}

  ngOnInit(): void {
      this.configService.getConfiguration().subscribe({
        next: (data) => (this.configuration = data),
        error: (err) => console.error('Failed to load configuration', err),
      });
  }

  get ticketReleaseRate(): number {
    return this.configuration.ticketReleaseRate / 1000;
  }

  set ticketReleaseRate(value: number) {
    this.configuration.ticketReleaseRate = value * 1000;
  }

  get customerRetrievalRate(): number {
    return this.configuration.customerRetrievalRate / 1000;
  }

  set customerRetrievalRate(value: number) {
    this.configuration.customerRetrievalRate = value * 1000;
  }

  updateConfiguration(): void {
    this.configService.updateConfiguration(this.configuration).subscribe({
      next: () => alert('Configuration updated successfully'),
      error: (err) => console.error('Failed to update configuration', err),
    });
  }
}
