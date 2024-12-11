import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class EventsService {

  constructor(private http: HttpClient) {}

  url = 'http://localhost:3000/api';

  getData():any {
    let users = this.http.get(`${this.url}/events`);
    console.log(users);
    return users;
  }

  getUser(id: any) {
    return this.http.get(`${this.url}/events/${id}`);
  }

  sendData(data: any) {
    return this.http.post(`${this.url}/events`, data);
  }


  updateUser(id:any, user:any) {
    return this.http.patch(`${this.url}/events/${id}`, user);
  }

  deleteUser(id:any){
    return this.http.delete(`${this.url}/events/${id}`);
  }
}