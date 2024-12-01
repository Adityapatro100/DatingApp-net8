import { Component,inject, Input, OnInit, output } from '@angular/core';
import { AbstractControl, ControlContainer, FormBuilder, FormControl, FormGroup, ReactiveFormsModule, ValidatorFn, Validators } from '@angular/forms';
import { AccountService } from '../_services/account.service';
import { ToastrService } from 'ngx-toastr';
import { JsonPipe, NgIf } from '@angular/common';
import { TextInputComponent } from "../_forms/text-input/text-input.component";
import { DatePickerComponent } from "../_forms/date-picker/date-picker.component";
import { Router } from '@angular/router';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [ReactiveFormsModule, TextInputComponent, DatePickerComponent],
  templateUrl: './register.component.html',
  styleUrl: './register.component.css'
})
export class RegisterComponent implements OnInit {

  // @Output() CancelRegister = new EventEmitter();
  private accountService = inject(AccountService);
  private fb = inject(FormBuilder)
  private router = inject(Router);
  CancelRegister = output<any>();
  registerForm : FormGroup = new FormGroup({});
  maxDate= new Date();
  validationErrors:string[]|undefined;

  ngOnInit(): void {
    this.initializeForm();
    this.maxDate.setFullYear(this.maxDate.getFullYear()-18)
  }

  initializeForm(){
    this.registerForm = this.fb.group({
      gender:['male'],
      username:['',Validators.required],
      knownAs:['',Validators.required],
      dateOfBirth:['',Validators.required],
      city:['',Validators.required],
      country:['',Validators.required],
      password:['',[Validators.required,Validators.minLength(4),Validators.maxLength(8)]],
      confirmPassword:['',[Validators.required,this.matchvalues('password')]]   
    });

    this.registerForm.controls['password'].valueChanges.subscribe({
      next: () => this.registerForm.controls['confirmPassword'].updateValueAndValidity()
    })
  }

  matchvalues(matchTo:string):ValidatorFn{
    return (control:AbstractControl) => {
      return control.value === control.parent?.get(matchTo)?.value ? null : {isMatching:true}
    }
  }

  theUserObj:any=null;
  register(){
    const dob = this.getDateOnly(this.registerForm.get('dateOfBirth')?.value);
    //this.registerForm.patchValue({dateOfBirth:dob});
    this.theUserObj=this.registerForm.value
    this.theUserObj.dateOfBirth=dob;    
    this.accountService.register(this.registerForm.value).subscribe({
      next:_=> this.router.navigateByUrl('/members'),
      error: error => this.validationErrors=error
    })
  }

  cancel(){
    this.CancelRegister.emit(false);
  }

  private getDateOnly(dob:string|undefined){
    if (!dob) return;
    return new Date(dob).toISOString().slice(0,10);
  }
}
