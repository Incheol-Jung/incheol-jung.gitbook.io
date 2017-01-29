---
layout: post
title:  "Add some style"
date:   2017-01-27 00:00:00
categories: forms
comments: true
---

양식을 만드는 방식에 관계없이 Angular 2는 또 다른 멋진 작업을 수행한다.
각 필드 (및 양식)에 CSS 클래스를 자동으로 추가 및 제거하여 시각적 스타일을 추가 할 수 있다.

예를 들어, 필드는 발리 데이터 중 하나가 실패하면 ng-invalid 클래스를 가지며, 모든 valid 데이터가 성공하면 ng-valid 데이터를 가진다. 
즉, 유효성 검사에 실패한 필드 주위에 멋진 빨강 테두리와 같은 스타일을 쉽게 추가 할 수 있다.

```javascript
<style>
  input.ng-invalid {
   border: 3px red solid;
  }
</style>
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

또 다른 유용한 CSS 클래스는 ng-dirty이며 사용자가 값을 변경 한 경우 표시된다. 
그 반대는 ng-pristine이며, 사용자가 결코 값을 변경하지 않으면 나타난다. 
나는 일반적으로 사용자가 값을 한 번 이상 변경 한 경우에만 빨간색 테두리를 표시한다.

```javascript
<style>
  input.ng-invalid.ng-dirty {
   border: 3px red solid;
  }
</style>
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

마지막으로 마지막 CSS 클래스 인 ng-touch가 있다. 사용자가 필드에 적어도 한 번 이상 들어가고 나가면 (심지어 값을 변경하지 않았더라도) 나타난다. 그 반대는 아무런 변화가 없다.
양식을 처음으로 표시 할 때 필드에는 대개 CSS 클래스 ng-pristine ng-untouched ng-invalid가 있다.
그런 다음 사용자가 입력하고 필드를 떠날 때 ng-pristine ng-touched ng-invalid로 전환된다.
사용자가 값을 변경하면 여전히 유효하지 않은 값으로 값이 변경되고 ng-dirty가 ng-invalid로 설정 된다.
마지막으로 값이 유효한 경우는 ng-dirty ng-touch ng-valid로 변환 될것이다. 