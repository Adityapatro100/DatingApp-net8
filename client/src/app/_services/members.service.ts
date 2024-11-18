import { HttpClient, HttpHeaders } from '@angular/common/http';
import { inject, Injectable, INJECTOR } from '@angular/core';
import { environment } from '../../environments/environment.development';
import { Member } from '../_models/member';

@Injectable({
  providedIn: 'root'
})
export class MembersService {
  private http=inject(HttpClient);
  baseUrl =environment.apiUrl;
  
    
  getmembers(){
    return this.http.get<Member[]>(this.baseUrl+'users');
  }

  getmember(username:string){
    return this.http.get<Member>(this.baseUrl + 'users/' + username);
  }


}
