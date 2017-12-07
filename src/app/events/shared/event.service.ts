import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection, AngularFirestoreDocument } from 'angularfire2/firestore';
import { Event } from './event';
import { Observable } from 'rxjs/Observable';
import { map } from 'rxjs/operators';

@Injectable()
export class EventService {

  eventsCollection: AngularFirestoreCollection<Event>;
  eventDocument:   AngularFirestoreDocument<Event>;

  constructor(private afs: AngularFirestore) {
    this.eventsCollection = this.afs.collection('events');
  }

  getEvents(): Observable<Event[]> {
    return this.eventsCollection.valueChanges();
  }

  getEventsFull(): Observable<Event[]> {
    // ['added', 'modified', 'removed']
    return this.eventsCollection.snapshotChanges().map((actions) => {
      return actions.map((a) => {
        const data = a.payload.doc.data() as Event;
        return { id: a.payload.doc.id, name: data.name, createdAt: data.createdAt };
      });
    });
  }

  getEvent(id: string) {
    return this.afs.doc<Event>(`events/${id}`);
  }

  createEvent(name: string) {
    const event = {
      name,
      createdAt: new Date(),
    };
    return this.eventsCollection.add(event);
  }

  updateEvent(id: string, event: Partial<Event>) {
    return this.getEvent(id).update(event);
  }

  deleteEvent(id: string) {
    return this.getEvent(id).delete();
  }

}