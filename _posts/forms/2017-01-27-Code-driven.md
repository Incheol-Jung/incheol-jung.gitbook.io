---
layout: post
title:  "Code-driven"
date:   2017-01-27 00:00:00
categories: forms
comments: true
---

AngularJS 1.x에서는 주로 템플릿에 양식을 작성해야 했다. Angular 2는 명령형이 아니라 템플릿을 사용하지 않고 프로그래밍 방식으로 양식을 작성할 수 있게 한다.<br/>
이제 코드에서 직접 양식을 처리 할 수 있다. 더 장황하지만 더 강력하다.
구성 요소 코드에서 양식을 작성하기 위해 FormControl 및 FormGroup에 대해 설명한 추상화를 사용한다.<br/>

이러한 기본 요소를 사용하여 구성 요소에 양식을 작성할 수 있다. 
그러나 새로운 FormControl() 또는 새 FormGroup()을 작성하는 대신 우리가 삽입 할 수있는 도우미 클래스 인 FormBuilder를 사용할 것이다.

```javascript
import { Component } from '@angular/core';
import { FormBuilder } from '@angular/forms';
@Component({
  selector: 'ns-register',
  templateUrl: 'register-form.component.html'
})
export class RegisterFormComponent {
  constructor(fb: FormBuilder) {
   // we will have to build the form
  }
  register() {
   // we will have to handle the submission
  }
}
```

FormBuilder는 헬퍼 클래스이며 컨트롤과 그룹을 만드는 몇 가지 메소드가 있다. 
간단히 시작하고 두 개의 컨트롤, 사용자 이름과 암호로 작은 폼을 만든다.

```javascript
import { Component } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
@Component({
  selector: 'ns-register',
  templateUrl: 'register-form.component.html'
})
export class RegisterFormComponent {
  userForm: FormGroup;
  constructor(fb: FormBuilder) {
   this.userForm = fb.group({
   username: '',
   password: ''
   });
  }
  register() {
   // we will have to handle the submission
  }
}
```

우리는 두 개의 컨트롤이있는 form을 만들었다. 각 컨트롤은 값 ''으로 생성된다는 것을 알 수 있다. 
FormBuilder 헬퍼 메서드 control()를 이 문자열을 매개 변수로 사용하는 것과 동일하다.
새 FormControl('') 생성자를 호출하는 것과 같다. 문자열은 양식에 표시 할 초기 값을 나타 낸다. 
여기서는 비어있어 입력이 비어있게 된다. 그러나 예를 들어 기존 엔티티를 편집하려는 경우 여기서도 가치를 얻을 수 있다. 
도우미 메서드는 다른 특정 특성을 가질 수도 있다.<br/>

우리는 register 메소드를 구현해야 한다. 앞서 보았 듯이 FormGroup 객체에는 value 속성이 있으므로 단순히

```javascript
import { Component } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
@Component({
  selector: 'ns-register',
  templateUrl: 'register-form.component.html'
})
export class RegisterFormComponent {
  userForm: FormGroup;
  constructor(fb: FormBuilder) {
   this.userForm = fb.group({
   username: fb.control(''),
   password: fb.control('')
   });
  }
  register() {
   console.log(this.userForm.value);
  }
}
```

이제 템플릿에서 일부 작업을 수행해야 한다. 우리는 "템플릿 중심" 양식에서 본 지시문 이외의 지시어를 사용하려고 한다. 
이러한 지시문은 사용자가 루트 모듈에서 가져와야 하는 ReactiveFormsModule에 있다. 
그것들의 이름은 "template-driven"폼의 경우처럼 form 대신 시작된다.

formGroup 지시문 덕분에 양식을 userForm 객체에 바인딩 해야 한다. 각 입력 필드는 formControlName 지시문 덕분에 컨트롤에 바인딩 된다.

```javascript
<h2>Sign up</h2>
<form (ngSubmit)="register()" [formGroup]="userForm">
  <div>
   <label>Username</label><input formControlName="username">
  </div>
  <div>
   <label>Password</label><input type="password" formControlName="password">
  </div>
  <button type="submit">Register</button>
</form>
```

우리는 구성 요소의 속성 인 userForm 객체를 formGroup에 바인딩 하려고 하므로 괄호 표기법 [formGroup] = "userForm"을 사용한다. 
각 입력은 바인딩 된 컨트롤을 나타내는 문자열 리터럴을 사용하여 formControlName 지시문을 수신한다. 
존재하지 않는 이름을 지정하면 오류가 발생 한다.
값을 전달할 때 (그리고 표현식이 아닌 경우) formControlName을 []로 묶지 않는다.<br/>

제출 버튼을 클릭하면 사용자 이름과 선택한 비밀번호가 포함 된 객체가 기록된다!
필요한 경우 setValue()를 사용하여 컴포넌트에서 FormControl의 값을 업데이트 할 수 있다.<br/>

```javascript
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, FormControl } from '@angular/forms';
@Component({
  selector: 'ns-register',
  templateUrl: 'register-form.component.html',
})
export class RegisterFormComponent {
  usernameCtrl: FormControl;
  passwordCtrl: FormControl;
  userForm: FormGroup;
  constructor(fb: FormBuilder) {
   this.usernameCtrl = fb.control('');
   this.passwordCtrl = fb.control('');
   this.userForm = fb.group({
   username: this.usernameCtrl,
   password: this.passwordCtrl
   });
  }
  reset() {
   this.usernameCtrl.setValue('');
   this.passwordCtrl.setValue('');
  }
  register() {
   console.log(this.userForm.value);
  }
}
```