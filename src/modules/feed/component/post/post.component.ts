import { Component, Input, OnInit, AfterViewInit, ViewChild, ElementRef } from '@angular/core';
import { Post } from '../../post.model';
import { PostService } from '../../services/post.service';
import { AppNotification, PostLikedNotification} from 'src/modules/notification/notification.model';
import { User } from 'src/modules/user/user.model';
import { NotificationStore } from 'src/modules/notification/notification.store';
import { DateTime } from 'luxon';

class postNotif{
  user : User;
  postId : string;
  preview : string;
}

@Component({
  selector: 'app-post',
  templateUrl: './post.component.html',
  styleUrls: ['./post.component.less']
})

export class PostComponent implements OnInit, AfterViewInit {
  @Input()
  post: Post;

  @ViewChild("anchor")
  anchor: ElementRef<HTMLDivElement>;

  constructor(
    private postService: PostService,
    private notificationStore : NotificationStore,
  ) { }

  ngOnInit(): void {
  }

  get date() {
    return DateTime.fromISO(this.post.createdAt).setLocale("fr").toFormat("DDDD TT");
  }

  ngAfterViewInit() {
    this.anchor.nativeElement.scrollIntoView();
  }

  async like() {
    // TODO like du post
    this.postService.like(this.post);
    this.post.liked = !this.post.liked;

    //Notification
    let postLikeNOtificationData : postNotif = {
      user : this.post.createdBy,
      postId : this.post.id,
      preview : this.post.message.text.content,
    };

    let postLikeNotification : AppNotification<'post_liked', postNotif> = {
      id : "post_liked",
      timestamp : 0,
      subject : 'post_liked',
      payload : postLikeNOtificationData
    }

    this.notificationStore.appendNotification(postLikeNotification)
  }
}