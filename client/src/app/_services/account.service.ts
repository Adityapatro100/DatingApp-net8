import { HttpClient } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';
import { map } from 'rxjs';
import { environment } from '../../environments/environment';
import { User } from '../_models/User';
import { LikesService } from './likes.service';

@Injectable({
  providedIn: 'root'
})
export class AccountService {

  private http = inject(HttpClient);
  private likesService = inject(LikesService);
  baseUrl = environment.apiUrl;
  currentUser = signal<User | null>(null)

  login(model:any){
    return this.http.post<User>(this.baseUrl + 'account/login', model).pipe(
      map(user =>{
        if (user){
          this.setCurrentUser(user);  
        }
      })
    )
  }

  register(model:any){
    return this.http.post<User>(this.baseUrl + 'account/register', model).pipe(
      map(user =>{
        if (user){
          this.setCurrentUser(user);
        }
        return user;
      })
    )
  }

  setCurrentUser(user:any){
    localStorage.setItem('user',JSON.stringify(user));
    this.currentUser.set(user);
    this.likesService.getLikeIds();
  }
  logout(){
    localStorage.removeItem('user');
    this.currentUser.set(null);
  }
}
