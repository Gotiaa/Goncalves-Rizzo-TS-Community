import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { FeedStore } from 'src/modules/feed/feed.store';
import { Room } from '../../room.model';
import { RoomStore } from '../../room.store';
import { RoomQueries } from '../../services/room.queries';
import { RoomService } from '../../services/room.service';
import { RoomSocketService } from '../../services/room.socket.service';

const LASTROOM = "last-room";

@Component({
  selector: 'app-room-menu',
  templateUrl: './room-menu.component.html',
  styleUrls: ['./room-menu.component.less']
})
export class RoomMenuComponent implements OnInit {
  roomId$: Observable<string | undefined>;
  rooms: Room[];
  rooms$: Observable<Room[]>
  lastRoom : string | null;

  constructor(private feedStore: FeedStore, private queries: RoomQueries, private roomSocketService: RoomSocketService, private router: Router, private roomStore : RoomStore) {
    this.roomId$ = feedStore.roomId$;
    this.rooms = [];
  }

  async ngOnInit() {
    this.rooms = await this.queries.getAll();
    
    this.rooms$ = this.roomStore.get(s => s.rooms);

    this.lastRoom = localStorage.getItem(LASTROOM);

    if(this.lastRoom != null){
      this.goToRoomByID(this.lastRoom);
      console.log(`L'id enregistré est : ${localStorage.getItem(LASTROOM)}`);
    }else if(this.feedStore.value.roomId != null){
      this.goToRoomByID("default")
    }
  }

  goToRoom(room: Room) {
    // TODO naviguer vers app/[id de la room]
    console.log(`Navigate to : ${room.id}`)
    this.router.navigate([`/app/${room.id}`]);
    localStorage.setItem(LASTROOM, room.id);
  }

  goToRoomByID(roomId : string){
    this.router.navigate([`/app/`+roomId]);
  }
}

