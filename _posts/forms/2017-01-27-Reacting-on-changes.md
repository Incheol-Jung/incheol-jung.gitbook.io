---
layout: post
title:  "Reacting on changes"
date:   2017-01-27 00:00:00
categories: forms
comments: true
---

코드 중심 양식을 사용할 때 마지막으로 유용한 기능 : 관찰 가능한 valueChanges를 사용하여 값 변경에 쉽게 대응할 수 있다. 
리 액티브 프로그래밍 FTW! 예를 들어 비밀번호를 원한다고 가정 해보자.
필드를 사용하여 강도 표시기를 표시한다. 우리는 암호 값이 변경 될 때마다 길이를 계산하려고 한다.

```javascript
import { Component } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import 'rxjs/add/operator/debounceTime';
import 'rxjs/add/operator/distinctUntilChanged';
@Component({
  selector: 'ns-register',
  templateUrl: 'register-form.component.html'
})
export class RegisterFormComponent {
  userForm: FormGroup;
  usernameCtrl: FormControl;
  passwordCtrl: FormControl;
  passwordStrength: number = 0;
  constructor(fb: FormBuilder) {
   this.usernameCtrl = fb.control('', Validators.required);
   this.passwordCtrl = fb.control('', Validators.required);
   this.userForm = fb.group({
   username: this.usernameCtrl,
   password: this.passwordCtrl
   });
   // we subscribe to every password change
   this.passwordCtrl.valueChanges
   // only recompute when the user stops typing for 400ms
   .debounceTime(400)
   // only recompute if the new value is different than the last
   .distinctUntilChanged()
   .subscribe(newValue => this.passwordStrength = newValue.length);
  }
  register() {
   console.log(this.userForm.value);
  }
}
```

이제 구성 요소 인스턴스에 passwordStrength 필드가있어서 사용자에게 표시 할 수 있습니다.

```javascript
<h2>Sign up</h2>
<form (ngSubmit)="register()" [formGroup]="userForm">
  <div>
   <label>Username</label><input formControlName="username">
   <div *ngIf="usernameCtrl.dirty && usernameCtrl.hasError('required')">Username is
required</div>
  </div>
  <div>
   <label>Password</label><input type="password" formControlName="password">
   <div>Strength: {{passwordStrength}}</div>
   <div *ngIf="passwordCtrl.dirty && passwordCtrl.hasError('required')">Password is
required</div>
  </div>
  <button type="submit" [disabled]="!userForm.valid">Register</button>
</form>
```

우리는 RxJS 운영자를 활용하여 몇 가지 유용한 기능을 추가하고 있습니다.

• distinctTime (400)함수는 사용자가 400ms 동안 타이핑을 멈 추면 값을 방출된다. 
따라서 사용자가 입력 한 모든 값에 대해 암호 길이를 계산하지 않아도 된다. 
컴퓨팅에 오랜 시간이 걸리거나 HTTP 요청이 시작되면 정말 흥미로운 일이다.<br/>

• distinctUntilChanged ()는 입력 된 새 값이 마지막 값과 다른 경우에만 값을 내보낸다.
사용자가 'password'를 입력하면 타이핑이 중지된다고 상상해 보아라. 우리는 길이를 계산합니다. 
그런 다음 새로운 글자를 입력하고 빨리 제거한다 (400ms 전). distinctTimewill의 다음 이벤트는 다시 '암호'입니다. 
암호 길이를 다시 계산하는 것은 의미가 없습니다! 이 연산자는 값을 방출하지 않으며 우리에게 다시 계산을 저장한다.

RxJS는 당신을 위해 수 많은 작업을 수행 할 수 있다. 우리가 방금 한 두 줄로 코딩 한 것을 상상해보아라. 
또한 Http 서비스는 관측 가능 기능을 사용하기 때문에 HTTP 작업과 쉽게 결합 할 수 있다.

