import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { EventsService } from 'src/app/services/events.service';

@Component({
  selector: 'app-updateevent',
  templateUrl: './updateevent.component.html',
  styleUrls: ['./updateevent.component.css']
})
export class UpdateeventComponent implements OnInit {
  userForm: FormGroup;
  userId: number=-1

  constructor(
    private fb: FormBuilder,
    private eventService: EventsService,
    private route: ActivatedRoute,
    private router: Router
  ) {
    this.userForm = this.fb.group({
      title: ['', Validators.required],
      description: ['', Validators.required],
    });
  }

  ngOnInit(): void {
    const userId = this.route.snapshot.paramMap.get('id');
    if (userId) {
      this.userId = +userId;
      this.loadUserData(this.userId);
    }
  }

  // Method to load the user data
  loadUserData(id: number): void {
    this.eventService.getUser(id).subscribe((event:any) => {
      this.userForm.patchValue({
        title: event.data.title,
        description: event.data.description,
      });
    });
  }

  // Method to submit the update form
  onSubmit(): void {
    if (this.userForm.valid) {
      this.eventService.updateUser(this.userId, this.userForm.value).subscribe(
        (updatedUser) => {
          this.router.navigate(['/list']);
        },
        (error) => {
          console.error('Error updating user:', error);
        }
      );
    }
  }
}
