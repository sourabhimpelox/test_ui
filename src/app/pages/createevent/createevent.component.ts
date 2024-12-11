import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { EventsService } from 'src/app/services/events.service';

@Component({
  selector: 'app-createevent',
  templateUrl: './createevent.component.html',
  styleUrls: ['./createevent.component.css']
})
export class CreateeventComponent {
  constructor(private eventData: EventsService,
    private router: Router,
  ) {

  }

  
  getUserFormData(data: any) {
    
    this.eventData.sendData(data).subscribe((data) => console.log(data));
    this.router.navigate(['/list']);
  }
}
