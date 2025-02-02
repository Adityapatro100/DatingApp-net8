import { Component, inject, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Member } from '../../_models/member';
import { TabDirective, TabsetComponent, TabsModule } from 'ngx-bootstrap/tabs';
import { GalleryItem, GalleryModule, ImageItem } from 'ng-gallery';
import { DatePipe } from '@angular/common';
import { TimeAgoService } from '../../_services/time-ago.service';
import { MemberMessagesComponent } from "../member-messages/member-messages.component";
import { TimeagoModule } from 'ngx-timeago';
import { MessageService } from '../../_services/message.service';
import { Message } from '../../_models/message';
import { PresenceService } from '../../_services/presence.service';
import { AccountService } from '../../_services/account.service';
import { MembersService } from '../../_services/members.service';

@Component({
  selector: 'app-member-detail',
  standalone: true,
  imports: [TabsModule, GalleryModule, DatePipe,TimeagoModule, MemberMessagesComponent],
  templateUrl: './member-detail.component.html',
  styleUrl: './member-detail.component.css'
})
export class MemberDetailComponent implements OnInit,OnDestroy {
  @ViewChild('memberTabs', {static:true}) memberTabs?: TabsetComponent;
  private messageService =inject(MessageService);
  private memberService =inject(MembersService);
  private accountService =inject(AccountService);
  presenceService =inject(PresenceService);
  private timeAgoService =inject(TimeAgoService);
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  member: Member ={} as Member;
  images:GalleryItem[]=[];
  activeTab?: TabDirective; 
  messages: Message[] =[];

  ngOnInit(){    
    this.route.data.subscribe({
      next: data => {
        this.member = data['member'];
        this.member && this.member.photos.map(p => {
          this.images.push(new ImageItem({src: p.url, thumb: p.url}))
        })
      }
    })
    // this.route.paramMap.subscribe({
    //   next: _ => this.onRouteParamsChange()
    // })
    this.route.queryParams.subscribe({
      next: params => {
        params['tab'] && this.selectTab(params['tab'])
      }
    })
  }
  onUpdateMessages(event:Message){
    this.messages.push(event);
  }

  selectTab(heading: string){
    if(this.memberTabs){
      const messageTab = this.memberTabs.tabs.find(x => x.heading === heading);
      if (messageTab) messageTab.active=true;
    }
  }

  // onRouteParamsChange() {
  //   const user = this.accountService.currentUser();
  //   if (!user) return;
  //   if (this.messageService.hubConnection?.state === HubConnectionState.Connected && this.activeTab?.heading === 'Messages') {
  //     this.messageService.hubConnection.stop().then(() => {
  //       this.messageService.createHubConnection(user, this.member.username);
  //     })
  //   }
  // }
  onTabActivated(data:TabDirective){
    this.activeTab = data;
    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: {tab: this.activeTab.heading},
      queryParamsHandling: 'merge'
    })
    if (this.activeTab.heading ==='Messages' && this.messages.length === 0 && this.member){
      this.messageService.getMessagesThread(this.member.username).subscribe({
        next:messages => this.messages=messages
      })
    }

  }
  // onTabActivated(data:TabDirective){
  //   this.activeTab = data;
  //   if (this.activeTab.heading ==='Messages' && this.member){
  //     const user = this.accountService.currentUser();
  //     if (!user) return; 
  //     this.messageService.createHubConnection(user,this.member.username);
  //     }
  //   else{
  //      this.messageService.stopHubConnection();
  //   } 
  // }

  

  timeAgo(lastActiveDate:Date){ 
    return this.timeAgoService.timeAgo(lastActiveDate);
  }

  ngOnDestroy(): void {
    this.messageService.stopHubConnection();
  }

}
