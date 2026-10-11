import { CommonModule } from '@angular/common';
import { Trip } from '../models/trip';
import { TripCard } from '../trip-card/trip-card';
import { TripDataService } from '../services/trip-data';
import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import{ Router } from '@angular/router';


@Component({
  selector: 'app-trip-listing',
  standalone: true,
  imports: [CommonModule, TripCard],
  providers: [TripDataService],
  templateUrl: './trip-listing.html',
  styleUrl: './trip-listing.css',
})
export class TripListing implements OnInit {
  trips: Trip[] = [];
  message = '';

constructor(
  private tripDataService: TripDataService,
  private router: Router,
  private cdr: ChangeDetectorRef
) {}


  ngOnInit(): void {
    console.log('ngOnInit')
    this.getStuff();
  }
  public addTrip(): void {
    this.router.navigate(['add-trip']);
}
  private getStuff(): void {
    this.tripDataService.getTrips().subscribe({
      next: (value: Trip[]) => {
        this.trips = value;
        this.message = value.length
          ? `There are ${value.length} trips available.`
          : 'There were no trips retrieved from the database.';
        console.log(this.message);
        this.trips = value;
        this.message = value.length
          ? `There are ${value.length} trips available.`
          : 'There were no trips retrieved from the database.';

    this.cdr.markForCheck();
        console.log(this.message);
      },
      
      error: (error: unknown) => {
        this.message = 'Unable to retrieve trips.';
        console.error('Error:', error);
      },
    });

    
  }
}