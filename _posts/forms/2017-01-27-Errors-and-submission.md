---
layout: post
title:  "Errors and submission"
date:   2017-01-27 00:00:00
categories: forms
comments: true
---

물론 사용자가 오류가 남아있는 동안 양식을 제출할 수 없어야하며 오류가 완벽하게 표시 되어야 한다.<br/>
예제를 사용하면 필드가 필요한 경우에도 양식을 제출할 수 있다.
아마도 우리가 그것에 대해 뭔가 할 수 있을까?<br/>

disabled 속성을 사용하여 버튼을 쉽게 비활성화 할 수 있다는 것을 알고 있지만 현재 양식의 상태를 반영하는 표현식을 제공해야 한다.

- Errors and submission in a code-driven form

FormGroup 유형의 userForm 필드를 우리 구성 요소에 추가했다. 이 필드는 양식 및 필드 상태 및 오류에 대한 완전한 뷰를 제공한다.
예를 들어 양식이 유효하지 않은 경우 양식 제출을 사용 중지 할 수 있다.

```javascript
<h2>Sign up</h2>
<form (ngSubmit)="register()" [formGroup]="userForm">
  <div>
   <label>Username</label><input formControlName="username">
  </div>
  <div>
   <label>Password</label><input type="password" formControlName="password">
  </div>
  <button type="submit" [disabled]="!userForm.valid">Register</button>
</form>
```

마지막 줄에서 볼 수 있듯이 disabled를 userForm의 유효한 속성에 연결하기 만하면 된다.<br/>
이제 모든 컨트롤이 유효 할 때만 제출할 수 있다. 사용자가 양식을 제출할 수 없는 이유를 이해하도록 돕기 위해 오류 메시지를 표시해야 한다.

```javascript
<h2>Sign up</h2>
<form (ngSubmit)="register()" [formGroup]="userForm">
  <div>
   <label>Username</label><input formControlName="username">
   <div *ngIf="userForm.get('username').hasError('required')">Username is required</div>
   <div *ngIf="userForm.get('username').hasError('minlength')">Username should be 3
characters min</div>
  </div>
  <div>
   <label>Password</label><input type="password" formControlName="password">
   <div *ngIf="userForm.get('password').hasError('required')">Password is required</div>
  </div>
  <button type="submit" [disabled]="!userForm.valid">Register</button>
</form>
```

필드가 비어 있으면 오류가 표시되고 값이 있으면 오류가 사라진다.
그러나 양식이 표시되면 바로 표시된다. 사용자가 값을 변경할 때까지 숨길 수 있을까?

```javascript
<h2>Sign up</h2>
<form (ngSubmit)="register()" [formGroup]="userForm">
  <div>
   <label>Username</label><input formControlName="username">
   <div *ngIf="userForm.get('username').dirty &&
userForm.get('username').hasError('required')">
   Username is required
   </div>
   <div *ngIf="userForm.get('username').dirty &&
userForm.get('username').hasError('minlength')">
   Username should be 3 characters min
   </div>
  </div>
  <div>
   <label>Password</label><input type="password" formControlName="password">
   <div *ngIf="userForm.get('password').dirty &&
userForm.get('password').hasError('required')">
   Password is required
   </div>
  </div>
  <button type="submit" [disabled]="!userForm.valid">Register</button>
</form>
```

그러나 구성 요소의 각 컨트롤에 대한 참조를 만들 수 있다.

```javascript
@Component({
  selector: 'ns-register',
  templateUrl: 'register-form.component.html'
})
export class RegisterFormComponent {
  userForm: FormGroup;
  usernameCtrl: FormControl;
  passwordCtrl: FormControl;
  constructor(fb: FormBuilder) {
   this.usernameCtrl = fb.control('', Validators.required);
   this.passwordCtrl = fb.control('', Validators.required);
   this.userForm = fb.group({
   username: this.usernameCtrl,
   password: this.passwordCtrl
   });
  }
  register() {
   console.log(this.userForm.value);
  }
}
```

```javascript
<h2>Sign up</h2>
<form (ngSubmit)="register()" [formGroup]="userForm">
  <div>
   <label>Username</label><input formControlName="username">
   <div *ngIf="usernameCtrl.dirty && usernameCtrl.hasError('required')">Username is
required</div>
   <div *ngIf="usernameCtrl.dirty && usernameCtrl.hasError('minlength')">Username should
be 3 characters min</div>
  </div>
  <div>
   <label>Password</label><input type="password" formControlName="password">
   <div *ngIf="passwordCtrl.dirty && passwordCtrl.hasError('required')">Password is
required</div>
  </div>
  <button type="submit" [disabled]="!userForm.valid">Register</button>
</form>
```

- Errors and submission in a template-driven form

템플릿 중심 양식에서는 FormGroup을 참조하는 구성 요소에 필드가 없지만 서식 지시문에서 내 보낸 NgForm 객체를 참조하여 템플릿의 로컬 변수를 이미 선언 하였다.
다시 한번,이 변수는 폼의 상태를 알 수 있고 컨트롤에 액세스 할 수 있게 한다.

```javascript
<h2>Sign up</h2>
<form (ngSubmit)="register(userForm.value)" #userForm="ngForm">
  <div>
   <label>Username</label><input name="username" ngModel required>
  </div>
  <div>
   <label>Password</label><input type="password" name="password" ngModel required>
  </div>
  <button type="submit" [disabled]="!userForm.valid">Register</button>
</form>
```

이제 각 필드의 오류를 표시해야 한다.
form 지시문과 마찬가지로 각 컨트롤은 FormControl 객체를 내 보낸다. 
따라서 오류에 액세스하는 로컬 변수를 만들 수 있다.

```javascript
<h2>Sign up</h2>
<form (ngSubmit)="register(userForm.value)" #userForm="ngForm">
  <div>
   <label>Username</label><input name="username" ngModel required #username="ngModel">
   <div *ngIf="username.control.dirty && username.control.hasError('required')">Username
is required</div>
  </div>
  <div>
   <label>Password</label><input type="password" name="password" ngModel required
#password="ngModel">
   <div *ngIf="password.control.dirty && password.control.hasError('required')">Password
is required</div>
  </div>
  <button type="submit" [disabled]="!userForm.valid">Register</button>
</form>
```