import { Component, inject } from '@angular/core';
import { MembersService } from '../../_services/members.service';
import { MemberCardComponent } from "../member-card/member-card.component";
import { PaginationModule } from 'ngx-bootstrap/pagination';
import { UserParams } from '../../_models/userParams';
import { AccountService } from '../../_services/account.service';
import { FormsModule } from '@angular/forms';
import { ButtonsModule } from 'ngx-bootstrap/buttons';

@Component({
  selector: 'app-member-list',
  standalone: true,
  imports: [MemberCardComponent,PaginationModule,FormsModule,ButtonsModule],
  templateUrl: './member-list.component.html',
  styleUrl: './member-list.component.css'
})
export class MemberListComponent {
  accountService=inject(AccountService);
  memberService=inject(MembersService);
  userParams = new UserParams(this.accountService.currentUser())
  genderList=[{value:'male',display:'Males'},{value:'female',display:'Females'}]

  ngOnInit(): void{
    if (!this.memberService.paginatedResult()) this.loadMembers();
  }

  loadMembers(){
    this.memberService.getmembers(this.userParams);
  }

  resetFilters(){
    this.userParams= new UserParams(this.accountService.currentUser());
    this.loadMembers();
  }

  pageChanged(event:any){
    if (this.userParams.pageNumber != event.pageNumber){
      this.userParams.pageNumber = event.pageNumber;
      this.loadMembers();
    }
  }
}
