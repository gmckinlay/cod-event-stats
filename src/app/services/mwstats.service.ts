import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { EventDto, Friends, TeamDto } from '../models/api.models';

@Injectable({
  providedIn: 'root'
})
export class MwstatsService {

  constructor(private httpClient: HttpClient) { }

  getEvents(): Observable<EventDto[]> {
    return <Observable<EventDto[]>>this.httpClient.get('/api/event');
  }

  addEvent(event: EventDto): Observable<EventDto> {    
    return <Observable<EventDto>>this.httpClient.post('/api/event', event);
  }

  getFriends(): Observable<Friends> {
    return <Observable<Friends>>this.httpClient.get('/api/friend');
  }
}
