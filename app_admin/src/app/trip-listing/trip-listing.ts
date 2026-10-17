import { CommonModule } from '@angular/common';
import { Trip } from '../models/trip';
import { TripCard } from '../trip-card/trip-card';
import { TripDataService } from '../services/trip-data';
import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthenticationService } from '../services/authentication';

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

  // Constructor
  constructor(
    private tripDataService: TripDataService,
    private router: Router,
    private cdr: ChangeDetectorRef,
    private authenticationService: AuthenticationService
  ) {}

  // Initialize the component
  ngOnInit(): void {
    console.log('ngOnInit');
    this.getStuff();
  }

  // Navigate to the Add Trip page
  public addTrip(): void {
    this.router.navigate(['add-trip']);
  }

  // Check whether the user is logged in
  public isLoggedIn(): boolean {
    return this.authenticationService.isLoggedIn();
  }

  // Retrieve trips from MongoDB through the API
  private getStuff(): void {

    this.tripDataService.getTrips().subscribe({

      next: (value: Trip[]) => {

        this.trips = value;

        this.message = value.length
          ? `There are ${value.length} trips available.`
          : 'There were no trips retrieved from the database.';

        console.log(this.message);

        // Update Angular change detection
        this.cdr.markForCheck();
      },

      error: (error: unknown) => {

        this.message = 'Unable to retrieve trips.';

        console.error('Error:', error);

        this.cdr.markForCheck();
      }

    });
  }

}