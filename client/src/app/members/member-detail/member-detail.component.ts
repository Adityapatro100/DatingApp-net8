import { Component, inject, OnInit } from '@angular/core';
import { MembersService } from '../../_services/members.service';
import { ActivatedRoute } from '@angular/router';
import { Member } from '../../_models/member';
import { TabsModule } from 'ngx-bootstrap/tabs';
import { GalleryItem, GalleryModule, ImageItem } from 'ng-gallery';
import { DatePipe } from '@angular/common';
import { TimeAgoService } from '../../_services/time-ago.service';

@Component({
  selector: 'app-member-detail',
  standalone: true,
  imports: [TabsModule,GalleryModule,DatePipe],
  templateUrl: './member-detail.component.html',
  styleUrl: './member-detail.component.css'
})
export class MemberDetailComponent{
  private memberService =inject(MembersService);
  private timeAgoService =inject(TimeAgoService);
  private route = inject(ActivatedRoute);
  member?:Member;
  images:GalleryItem[]=[];
  ngOnInit(){    
    this.loadMember();
  }

  timeAgo(lastActiveDate:Date){ 
    return this.timeAgoService.timeAgo(lastActiveDate);
  }

  loadMember(){
    const username=this.route.snapshot.paramMap.get('username');
    if(!username) return;
    this.memberService.getmember(username).subscribe({
      next:member=>{
        this.member=member;
        member.photos.map(p => {
          this.images.push(new ImageItem({src:p.url,thumb:p.url}))
       })
      }
    })
  }

}
