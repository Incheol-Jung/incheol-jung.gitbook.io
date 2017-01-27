---
layout: post
title:  "Grouping fields"
date:   2017-01-27 00:00:00
categories: forms
comments: true
---

지금까지 우리는 하나의 그룹, 즉 완벽한 형태를 가졌다. 그러나 그룹 내에서 그룹을 선언 할 수 있다. 
이는 주소와 같은 필드 그룹을 검증하거나 앞의 예의 경우와 같이 암호 및 확인이 일치하는지 확인하려는 경우 매우 유용하다.<br/>
해결책은 코드 주도형을 사용하는 것이다 (앞에서 보았 듯이 원할 경우 템플릿 기반 양식과 결합 할 수 있다).<br/>
먼저 새로운 필드 인 passwordForm을 만들고 두 필드를 userForm 그룹에 추가 한다.

```javascript
import { Component } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
@Component({
  selector: 'ns-register',
  templateUrl: 'register-form.component.html'
})
export class RegisterFormComponent {
  passwordForm: FormGroup;
  userForm: FormGroup;
  usernameCtrl: FormControl;
  passwordCtrl: FormControl;
  confirmCtrl: FormControl;
  static passwordMatch(control: FormGroup) {
   const password = control.controls['password'].value;
   const confirm = control.controls['confirm'].value;
   return password === confirm ? null : { matchingError: true };
  }
  constructor(fb: FormBuilder) {
   this.usernameCtrl = fb.control('', Validators.required);
   this.passwordCtrl = fb.control('', Validators.required);
   this.confirmCtrl = fb.control('', Validators.required);
   this.passwordForm = fb.group(
   { password: this.passwordCtrl, confirm: this.confirmCtrl },
   { validator: RegisterFormComponent.passwordMatch }
   );
   this.userForm = fb.group({ username: this.usernameCtrl, passwordForm: this
.passwordForm });
  }
  register() {
   console.log(this.userForm.value);
  }
}
```


보시다시피, 필드 중 하나가 변경 될 때마다 호출되는 validModifier 그룹에 passwordMatch를 추가했다.<br/>
formGroupName 지시어를 사용하여 새 양식을 반영하도록 템플릿을 업데이트 하자.

```javascript
<h2>Sign up</h2>
<form (ngSubmit)="register()" [formGroup]="userForm">
  <div>
   <label>Username</label><input formControlName="username">
   <div *ngIf="usernameCtrl.dirty && usernameCtrl.hasError('required')">Username is
required</div>
  </div>
  <div formGroupName="passwordForm">
   <div>
   <label>Password</label><input type="password" formControlName="password">
   <div *ngIf="passwordCtrl.dirty && passwordCtrl.hasError('required')">Password is
required</div>
   </div>
   <div>
   <label>Confirm password</label><input type="password" formControlName="confirm">
   <div *ngIf="confirmCtrl.dirty && confirmCtrl.hasError('required')">Confirm your
password</div>
   </div>
   <div *ngIf="passwordForm.dirty && passwordForm.hasError('matchingError')">Your
password does not match</div>
  </div>
  <button type="submit" [disabled]="!userForm.valid">Register</button>
</form>
```