import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { element } from 'protractor';
import { Observable, Subscription } from 'rxjs';
import { AuthenticationStore } from 'src/modules/authentication/authentication.store';
import { WebsocketConnection } from 'src/modules/common/WebsocketConnection';
import { AnyNotification } from 'src/modules/notification/notification.model';
import { NotificationStore } from 'src/modules/notification/notification.store'

@Component({
  selector: 'app-app-layout',
  templateUrl: './app-layout.component.html',
  styleUrls: ['./app-layout.component.less']
})
export class AppLayoutComponent implements OnInit, OnDestroy {
  sub?: Subscription;
  notifications$ : Observable<AnyNotification[]>;
  notifications : string[];
  showDrawer: boolean = false;
  constructor(private socket: WebsocketConnection, private authStore: AuthenticationStore, private notificationStore : NotificationStore) {
  }

  async ngOnInit() {
    this.sub = this.authStore.accessToken$.subscribe(accessToken => {
      if (accessToken) {
        this.socket.connect(accessToken);
      } else {
        this.socket.disconnect();
      }
    });
    this.notifications$ = this.notificationStore.get(s => s.notifications);
    this.notifications$.subscribe({
      next : element => {
        this.refreshNotifList(element);
      }
    })
  }

  ngOnDestroy() {
    if (this.sub) {
      this.sub.unsubscribe();
    }
  }
  onToggleNotifications() {
      this.showDrawer = !this.showDrawer;
  }

  refreshNotifList(element : AnyNotification[]){
    let tmpStr : string;
    this.notifications = [];
    element.forEach(notif => {
      switch(notif.subject){
        case 'post_liked' : {
          tmpStr = notif.payload.user.username + " a liké un post.";
          break;
        }
        case 'room_added' : {
          tmpStr = "La room " + notif.payload.room.name + " a été crée.";
          break;
        }
        case 'new_user' : {
          tmpStr = notif.payload.user.username + " a rejoins la room";
          break;
        }
      }
      this.notifications.push(tmpStr);
    })
  }

}
