---
layout: post
title:  "Creating a custom validator"
date:   2017-01-27 00:00:00
categories: forms
comments: true
---

포니 레이스는 중독성 게임이므로 18 세 이상인 경우에만 등록 할 수 있다. 
사용자가 실수로 실수하지 않았음을 확인하기 위해 비밀번호를 두 번 입력해야 한다.<br/>
어떻게 해야 할까? 우리는 사용자 정의 유효성 검사기를 만든다.<br/>
이렇게 하려면 FormControl을 사용하고 값을 테스트하고 오류가 있는 객체를 반환하거나 유효성 검사가 통과되면 null을 반환하는 메서드를 만들어야 한다.

```javascript
const isOldEnough = (control: FormControl) => {
  // control is a date input, so we can build the Date from the value
  const birthDatePlus18 = new Date(control.value);
  birthDatePlus18.setFullYear(birthDatePlus18.getFullYear() + 18);
  return birthDatePlus18 < new Date() ? null : { tooYoung: true };
};
```

검증 방법은 매우 쉽다. 우리는 컨트롤의 가치를 취하고, 날짜를 만들고, 18 번째 생일이 전에 있는지 확인하고, 그렇지 않은 경우 'tooYoung'키를 사용하여 오류를 반환 한다.
이제 이 유효성 검사기를 포함해야 한다.

- Using a validator in a code-driven form

FormBuilder를 사용하여이 유효성 검사기를 사용하여 폼에 새 컨트롤을 추가해야 한다.

```javascript
import { Component } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
@Component({
  selector: 'ns-register',
  templateUrl: 'register-form.component.html'
})
export class RegisterFormComponent {
  usernameCtrl: FormControl;
  passwordCtrl: FormControl;
  birthdateCtrl: FormControl;
  userForm: FormGroup;
  static isOldEnough(control: FormControl) {
   // control is a date input, so we can build the Date from the value
   const birthDatePlus18 = new Date(control.value);
   birthDatePlus18.setFullYear(birthDatePlus18.getFullYear() + 18);
   return birthDatePlus18 < new Date() ? null : { tooYoung: true };
  }
  constructor(fb: FormBuilder) {
   this.usernameCtrl = fb.control('', Validators.required);
   this.passwordCtrl = fb.control('', Validators.required);
   this.birthdateCtrl = fb.control('', Validators.compose([Validators.required,
RegisterFormComponent.isOldEnough]));
   this.userForm = fb.group({
   username: this.usernameCtrl,
   password: this.passwordCtrl,
   birthdate: this.birthdateCtrl
   });
  }
  register() {
   console.log(this.userForm.value);
  }
}
```

보시다시피, 우리는 두 개의 유효성 검사기를 사용하여 새로운 제어 생년월일을 추가하였다. 첫 번째 유효성 검사기가 필요하며 다른 클래스는 isOldEnough 클래스의 정적 메서드 이다.
물론 이 메소드는 원할 경우 다른 클래스에 있을 수 있다. (예 : 정적 메소드)

필드를 추가하고 양식에 오류를 표시하는 것을 잊지 말 것!!!

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
   <div *ngIf="passwordCtrl.dirty && passwordCtrl.hasError('required')">Password is
required</div>
  </div>
  <div>
   <label>Birth date</label><input type="date" formControlName="birthdate">
   <div *ngIf="birthdateCtrl.dirty">
   <div *ngIf="birthdateCtrl.hasError('required')">Birth date is required</div>
   <div *ngIf="birthdateCtrl.hasError('tooYoung')">You're way too young to be betting
on pony races</div>
   </div>
  </div>
  <button type="submit" [disabled]="!userForm.valid">Register</button>
</form>
```

- Using a validator in a template-driven form

템플릿 기반 폼에 사용자 정의 유효성 검사기를 추가하려면 ... 템플릿에 추가해야 한다.
이렇게 하려면 입력에 적용 할 사용자 지정 지시문을 작성해야 하지만 정직하게는 "코드 기반" 양식을 사용하면 더 쉽다.
또는 두 세계의 장점을 결합 할 수 있다.

- Combining template-based and code-based approaches for validation

사용자 정의 유효성 검사를 제외하고 "템플릿 기반"으로 모든 작업을 수행 할 수 있습니다! 우리는 보기에 이런 식으로 끝날 것이다.

```javascript
<label>Username</label><input name="username" [formControl]="usernameCtrl" [(ngModel)]=
"user.username" required>
<div class="error" *ngIf="usernameCtrl.dirty && usernameCtrl.hasError('notAllowed')"
>Username is not allowed</div>
```

```javascript
usernameCtrl = new FormControl('', RegisterFormComponent.usernameValidator);
static usernameValidator(control: FormControl) {
  return control.value !== 'admin' ? null : { notAllowed: true };
}
```

이것은 정말 좋은 절충안 이다.<br/>

• 모든 양식을 코드 기반으로 만들 필요는 없다.<br/>
• 필수 및 usernameAllowed 유효성 검사기를 직접 구성 할 필요가 없습니다. Angular가 사용자를 대신 한다.<br/>
• 순수한 코드 중심 접근 방식이 아닌 양방향 바인딩이 여전히 있다.<br/>

이는 간단한 사안과 양방향 바인딩을 위한 템플릿 기반 접근 방식과 맞춤 검증이 필요한 경우 코드 기반 접근 방식을 결합하는 것이다.