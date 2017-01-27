---
layout: post
title:  "Adding some validation"
date:   2017-01-27 00:00:00
categories: forms
comments: true
---

일반적으로 유효성 검사는 양식 작성의 큰 부분이다. 일부 필드는 필수이고 일부는 서로 의존하고 일부는 특정 형식이어야 하며 일부는 X보다 크거나 작은 값을 가져서는 안된다.
기본 유효성 검사 규칙을 추가하여 된다고 가정해 보자. 

- In a code-friven form
모든 필드가 필수임을 지정하기 위해 우리는 Validator를 사용할 것이다. 
validator는 에러의 맵을 돌려 주는지, 에러를 검출하지 않았던 경우는 null를 돌려준다.<br/>

프레임 워크는 몇 가지 유효성 검사기를 제공한다. <br/>

• Validators.required - 값이 비어 있지 않아야 한다. <br/>
• Validators.minLength (n) - 입력 한 값의 문자 수가 n 자 이하이어야 한다.<br/>
• Validators.maxLength (n) - 입력 된 값의 문자 수는 최대 n 자 이상이어야 한다.<br/>
• Validators.pattern (p) : 값이 정규 표현식 p와 일치해야 한다.<br/>

유효성 검사기는 Validators.compose()를 사용하여 구성 가능하며 FormControl 또는 FormGroup에 적용 할 수 있다. 
여기서는 모든 필드를 필수로 지정하기 위해 각 컨트롤에 필요한 유효성 검사기를 추가하고 사용자 이름이 최소 3 자 이상이어야 한다.

```javascript
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
@Component({
  selector: 'ns-register',
  templateUrl: 'register-form.component.html',
})
export class RegisterFormComponent {
  userForm: FormGroup;
  constructor(fb: FormBuilder) {
   this.userForm = fb.group({
   username: fb.control('', Validators.compose([Validators.required, Validators
.minLength(3)])),
   password: fb.control('', Validators.required)
   });
  }
  register() {
   console.log(this.userForm.value);
  }
}
```

- In a template-driven form

템플릿 중심 양식에 필수 입력란을 추가하는 것도 매우 간단하다. 
필요한 속성을 입력에 추가하기 만하면 된다. 
required는 제공된 지시문이며 유효성 검사기를 이 필드에 자동으로 추가한다. 
minlength와 maxlength와 같은 의미이다.

```javascript
<h2>Sign up</h2>
<form (ngSubmit)="register(userForm.value)" #userForm="ngForm">
  <div>
   <label>Username</label><input name="username" ngModel required minlength="3">
  </div>
  <div>
   <label>Password</label><input type="password" name="password" ngModel required>
  </div>
  <button type="submit">Register</button>
</form>
```