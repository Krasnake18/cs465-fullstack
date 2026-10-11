import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators
} from '@angular/forms';
import { Router } from '@angular/router';
import { Trip } from '../models/trip';
import { TripDataService } from '../services/trip-data';

@Component({
  selector: 'app-edit-trip',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './edit-trip.html',
  styleUrl: './edit-trip.css'
})
export class EditTrip implements OnInit {
  editForm!: FormGroup;
  submitted = false;

  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private tripDataService: TripDataService
  ) {}

  ngOnInit(): void {
    const tripCode = localStorage.getItem('tripCode');

    this.editForm = this.formBuilder.group({
      code: [tripCode ?? '', Validators.required],
      name: ['', Validators.required],
      length: ['', Validators.required],
      start: ['', Validators.required],
      resort: ['', Validators.required],
      perPerson: ['', Validators.required],
      image: ['', Validators.required],
      description: ['', Validators.required]
    });

    if (!tripCode) {
      this.router.navigate(['/']);
      return;
    }

    this.tripDataService.getTrip(tripCode).subscribe({
      next: (trips: Trip[]) => {
        const trip = trips[0];
        if (trip) {
          const date = new Date(trip.start);
          this.editForm.patchValue({
            ...trip,
            start: Number.isNaN(date.getTime())
              ? ''
              : date.toISOString().slice(0, 10)
          });
        }
      },
      error: (error) => console.error('Unable to load trip:', error)
    });
  }

  get f() {
    return this.editForm.controls;
  }

  onSubmit(): void {
    this.submitted = true;
    if (this.editForm.invalid) return;

    this.tripDataService
      .updateTrip(this.editForm.getRawValue() as Trip)
      .subscribe({
        next: () => this.router.navigate(['/']),
        error: (error) => console.error('Unable to update trip:', error)
      });
  }
}
   