---
layout: post
title:  "Template-driven"
date:   2017-01-27 00:00:00
categories: forms
comments: true
---

이 메서드를 사용하여 폼 에서 많은 지시문을 사용하고 프레임 워크에서 필요한 FormControl 및 FormGroup 인스턴스를 만들도록 하자. 
예를 들어, NgForm 지시문은 양식 요소를 강력한 Angular 2 버전으로 변형한다. Bruce Wayne과 Batman의 차이점이라고 생각하면 된다.<br/>

필요한 지시문은 모두 FormsModule 모듈에 포함 되어 있으므로 루트 모듈에서 가져와야 한다.<br/>

```javascript
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
@NgModule({
  imports: [BrowserModule, FormsModule],
  declarations: [PonyRacerAppComponent],
  bootstrap: [PonyRacerAppComponent]
})
export class AppModule {
}
```

FormsModule에는 "템플릿 중심"방식에 대한 지시문이 포함되어 있다. 우리는 나중에 "코드 중심"방식에 필요한 동일한 모듈 @ Angular / Forms에 ReactiveFormsModule이라는 또 다른 모듈이 있음을 보게 될 것이다.

```javascript
import { Component } from '@angular/core';
@Component({
  selector: 'ns-register',
  template: `
  <h2>Sign up</h2>
  <form (ngSubmit)="register()">
   <button type="submit">Register</button>
  </form>
  `
})
export class RegisterFormComponent {
  register() {
   // we will have to handle the submission
  }
}
```

단추를 추가하고 양식 태그에 ngSubmit에 대한 이벤트 처리기를 정의 하였다. ngSubmit 이벤트는 제출이 트리거 될 때 NgForm 지시문에 의해 생성된다. 
나중에 구현 될 컨트롤러의 register () 메서드를 호출한다.
마지막으로 템플릿이 빠르게 커질 수 있으므로 templateUrl을 사용하여 전용 파일에 템플릿을 추출해 보도록 하자.

```javascript
import { Component } from '@angular/core';
@Component({
  selector: 'ns-register',
  templateUrl: 'register-form.component.html'
})
export class RegisterFormComponent {
  register() {
   // we will have to handle the submission
  }
}
```

"템플릿 중심"방식에서는 AngularJS 1.x와 매우 흡사하다. 템플릿에 많은 요소가 있고 구성 요소에는 많지 않다.<br/>

가장 간단한 형식에서는 ngModel 지정 문을 양식 템플리트에 추가하면 된다. NgModel 지시문은 사용자를 위해 FormControl을 만들고 양식은 자동으로 FormGroup을 만든다. 입력에 이름을 지정해야 한다.
이 이름은 프레임 워크에서 FormGroup을 만드는 데 사용된다.

```javascript
<h2>Sign up</h2>
<form (ngSubmit)="register()">
  <div>
   <label>Username</label><input name="username" ngModel>
  </div>
  <div>
   <label>Password</label><input type="password" name="password" ngModel>
  </div>
  <button type="submit">Register</button>
</form>
```

이제 우리는 제출을 위해 무언가를 하고 사용자 이름과 암호를 알아야 한다. 이를 달성하기 위해 로컬 변수를 정의하고 이 변수에 의해 생성 된 NgForm 객체를 할당 할 수 있다.
템플릿 장에서 이들을 기억하는가? 여기서는 폼을 참조하는 변수 userForm을 정의 할 것이다. 
form 디렉티브는 FormGroup 클래스와 동일한 메소드가 있는 NgForm 지시문 인스턴스를 내보내므로 그렇게 할 수 있다. 
고급 지시문을 작성하는 방법을 연구 할 때 내보내기 부분이 더 자세히 표시된다.

```javascript
<h2>Sign up</h2>
<!-- we use a local variable #userForm -->
<!-- and give its value to the register method -->
<form (ngSubmit)="register(userForm.value)" #userForm="ngForm">
  <div>
   <label>Username</label><input name="username" ngModel>
  </div>
  <div>
   <label>Password</label><input type="password" name="password" ngModel>
  </div>
  <button type="submit">Register</button>
</form>
```

우리의 register 메소드는 이제 Form 값을 인수로 사용하여 호출한다.

```javascript
import { Component } from '@angular/core';
@Component({
  selector: 'ns-register',
  templateUrl: 'register.component.html'
})
export class RegisterFormComponent {
  register(user) {
   console.log(user);
  }
}
```

이것은 단방향 데이터 바인딩 일뿐 이다. 필드를 업데이트하면 모델이 업데이트 되지만 모델을 업데이트해도 필드 값은 업데이트되지 않는다. 
하지만 ngModel은 생각보다 강력하다.

- Two-way data-binding
AngularJS 1.x를 사용하거나 기사에 대한 기사를 읽었다면 입력 값을 표시하는 유명한 예제와 사용자가 입력을 수정할 때마다 업데이트되는 표현식 및 필드를 자동으로 표시해야 한다. 
모델이 변경되면 업데이트 된다.

```javascript
<!-- AngularJS 1.x code example -->
<input type="text" ng-model="username">
<p>{{username}}</p>
```

Angular 2와 비슷한 작업을 할 수 있습니다.
양식에서 채울 내용의 모델을 정의하여 시작한다. 우리는 이것을 Userclass에서 정의할 것이다. 

```javascript
class User {
  username: string;
  password: string;
}
```

RegisterFormComponent에는 User 유형의 필드 사용자가 있어야 한다.

```javascript
import { Component } from '@angular/core';
class User {
  username: string;
  password: string;
}
@Component({
  selector: 'ns-register',
  templateUrl: 'register-form.component.html',
})
export class RegisterFormComponent {
  user = new User();
  register() {
   console.log(this.user);
  }
}
```

예제에서 볼 수 있듯이 register () 메서드는 이제 사용자 객체를 직접 로깅 한다.
우리는 우리 양식의 입력을 추가 할 준비가 되었다. 우리는 우리가 입력 한 모델을 우리가 정의한 모델에 연결 해야 한다.
이를 위해 ngModel 지시문을 사용한다.

```javascript
<h2>Sign up</h2>
<form (ngSubmit)="register()">
  <div>
   <label>Username</label><input name="username" [(ngModel)]="user.username">
  </div>
  <div>
   <label>Password</label><input type="password" name="password" [(ngModel)]= "user.password">
  </div>
  <button type="submit">Register</button>
</form>
```

```javascript
<input name="username" [ngModel]="user.username" (ngModelChange)="user.username = $event ">
```

NgModel 지시문은 입력이 변경 될 때마다 관련 모델 user.username을 업데이트하므로 [ngModel] = "user.username" 부분이 된다. 
그리고 ngModel이라는 출력에서 이벤트를 내 보내고 모델이 업데이트 될 때마다 변경 된다. <br/>

긴 형식을 작성하는 대신 새 구문 [()]을 사용할 수 있다. 
나처럼, 그것이 [()]인지 아니면 []인지 기억하기가 어렵다면 간단한 팁이 있다. 
그것은 바나나 상자이다! : [] , 내부에는 서로 마주하는 두 개의 바나나가 있다 ().

이제는 입력 할 때마다 모델이 업데이트 될것이다. 모델에서 모델이 업데이트 되면 필드에서 자동으로 올바른 값을 표시 된다.


```javascript
<h2>Sign up</h2>
<form (ngSubmit)="register()">
  <div>
   <label>Username</label><input name="username" [(ngModel)]="user.username">
   <small>{{ user.username }} is an awesome username!</small>
  </div>
  <div>
   <label>Password</label><input type="password" name="password" [(ngModel)]=
"user.password">
  </div>
  <button type="submit">Register</button>
</form>
```

위의 예를 시도하면 양방향 데이터 바인딩이 작동하는 것을 볼 수 있다. 그리고 우리의 형식도 마찬가지 이다 : 우리는 그것을 제출할 수 있고, 컴포넌트는 사용자 객체를 기록 할 것이다!