import { Component, inject, OnInit } from '@angular/core';
import { RegisterComponent } from "../register/register.component";
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [RegisterComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent implements OnInit {

  users:any;
  http=inject(HttpClient);
  registerMode = false;

  ngOnInit() :void{
    this.getUsers();
  }

  registerToggle(){
    this.registerMode=!this.registerMode;
  }

  cancelRegisterMode(event:boolean){
    this.registerMode = event;
  }
  getUsers(){
    this.http.get('https://localhost:5001/api/users').subscribe({
      next: Response => this.users=Response,
      error: error => console.log('Adi',error),
      complete: ()=> console.log('Request has completed..',this.users) 
      
    })
  }

}