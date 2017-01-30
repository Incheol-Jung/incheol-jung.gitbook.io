---
layout:     reference
title:      The templating syntax
date:       2017-01-22 00:00:00
updated:    2017-01-22 00:00:00
categories: reference
summary:    The templating syntax
---


## Interpolation

보간법은 간단한 컨셉을 위한 하나의 큰 단어이다. 

```javascript
@Component({
  selector: 'ponyracer-app',
  template: `
   <h1>PonyRacer</h1>
   <h2>{{numberOfUsers}} users</h2>
  `
})
export class PonyRacerAppComponent {
  numberOfUsers: number = 146;
}
```

Angular가 <ponyracer-app> 태그를 찾을 때마다 활성화되는 PonyRacerAppComponent가 있다. 
PonyRacerAppComponent는 numberofUsers 라는 변수를 가지고 있다. 
템플릿은 <h2> 태그안에 값을 보여주는 표현식인 이중괄호를 사용하여 보여지고 있다. 

```javascript
<ponyracer-app>
  <h1>PonyRacer</h1>
  <h2>146 users</h2>
</ponyracer-app>
```

{{numberOfUsers}}는 해당 값으로 대체될 것이다. Angular가 <ponyracer-app> 이라는 태그를 
감지할 경우에, Angular는 PonyRacerAppComponent 인스턴스를 생성하고 해당 인스턴스는 템플릿의 표현식에 대한 문맥이다. 
PonyRacerAppComponent 인스턴스는 numberOfUsers 라는 변수를 146으로 설정할것이고 우리는 화면에 146 값을 확인할 것이다. <br/><br/>

객체 안에서 numberOfUsers라는 값이 변경될 때마다 템플릿은 자동으로 변경되어 보여질 것이다. 
이것은 '변화 감지'라고 불리워지며 Angular의 굉장한 장점중에 하나이다. <br/><br/>

기억할 중요한 한 가지 사실은 만약 우리가 value를 존재하지 않는다고 표현하려고 한다면, 
Angular 는 undefined 보다는 빈 문자열로 보여질 것이다. null 일 경우에도 마찬가지이다. <br/><br/>

간단한 변수 대신에 복잡한 객체를 가지고 있다고 가정해보자. 

```javascript
@Component({
  selector: 'ponyracer-app',
  template: `
   <h1>PonyRacer</h1>
   <h2>Welcome {{user.name}}</h2>
  `
})
export class PonyRacerAppComponent {
  user: any = { name: 'Cédric' };
}
```

보시다시피, 우리는 객체의 속성에 접근하는 것과 같이 좀 더 복잡한 표현식을 삽입 할 수 있다. 

```javascript
<ponyracer-app>
  <h1>PonyRacer</h1>
  <h2>Welcome Cédric</h2>
</ponyracer-app>
```

만약 우리가 클래스에 존재하지 않는 변수를 템플릿안에 입력한다면 어떠한 일이 발생할것인가?

```javascript
@Component({
  selector: 'ponyracer-app',
  // typo: users is not user!
  template: `
   <h1>PonyRacer</h1>
   <h2>Welcome {{users.name}}</h2>
  `
})
export class PonyRacerAppComponent {
  user: any = { name: 'Cédric' };
}
```

앱을 로딩하면 우리는 이러한 에러를 확인할 것이다. 

```javascript
Cannot read property 'name' of undefined in [{{users.name}} in PonyRacerAppComponent]
```

이제는 템플릿이 올바른지 확신 할 수 있기 때문에 더 나아졌다. 
Angular 1버젼에서 가장 자주 발생하는 문제 중 하나는 이러한 유형의 오류를 감지할 수 없기 때문에 
해결하는데 오랜 시간이 걸릴 수 있었다. <br/><br/>

내 사용자 객체가 실제로 서버에서 가져와서 서버 호출의 결과로 평가되기 전에 undefined로 초기화되면 어떻게 될까? 
템플릿을 컴파일 할 때 오류를 방지 할 수있는 방법이 있을까?<br/>

그렇다. user.name을 사용하는 대신 user?.name을 사용하면 해결할 수 있다. 

```javascript
@Component({
  selector: 'ponyracer-app',
  // user is undefined
  // but the ?. will avoid the error
  template: `
   <h1>PonyRacer</h1>
   <h2>Welcome {{user?.name}}</h2>
  `
})
export class PonyRacerAppComponent {
  user: any;
}
```

당신은 이제 더이상 어떠한 에러도 없을것이다. "?."는 때때로 안전한 표현이다. <br/>
이제 당신은 템플릿을 안전하게 작성할 수 있고 적절하고 확실하게 수행할 수 있을것이다. <br/>
우리의 예제로 돌아가보자. 우리는 받은 메시지를 표현할 것이다. 
아마도 우리는 다음 스텝에서도 다가오는 pony races를 표현할 수 있을것이다. <br/><br/>

그것은 우리로 하여금 우리의 두 번째 구성 요소를 사용하도록 이끌 것이다. 현재로서는 간단하게 만글 것이다. <br/>

```javascript
// in another file, races.component.ts
import { Component } from '@angular/core';
@Component({
  selector: 'ns-races',
  template: `<h2>Races</h2>`
})
class RacesComponent {
}
```

이제이 구성 요소를 PonyRacerAppComponent 템플릿에 포함하려고 한다. 우리는 무엇을 해야 하는가?



**************************************************************************************************


## Using other components in our templates

우리는 PonyRace 구성 요소 인 RacesComponent를 표시하려는 PonyRacerAppComponent라는 응용 프로그램 구성 요소를 가지고 있다. 

```javascript
// in ponyracer_app.ts
import { Component } from '@angular/core';
@Component({
  selector: 'ponyracer-app',
  // added the RacesComponent component
  template: `
   <h1>PonyRacer</h1>
   <ns-races></ns-races>
  `
})
export class PonyRacerAppComponent {
}
```

보시다시피 템플릿에 이전에 선언한 태그와 매칭하여 RacesComponent 를 템플릿에 추가하였다. <br/>
그러나 이것은 동작하지 않을것이다. 당신의 브라우져는 races 컴포넌트를 보여주지 못한다. <br/>
왜 그럴까? 이유는 매우 간단하다.: Angular는 racesComponent를 아직 알지 못하기 때문이다. <br/>
고치는것은 매우 간단하다. PonyracerAppComponent 를 추가하였던 방법을 기억하는가?<br/><br/>
우리는 이제 두 번째 컴포넌트가 있다. 이것도 반드시 선언해 주어야 한다. <br/>
racesComponent는 root 컴포넌트는 아니다. 그래서, 이것은 선언을 해주어야 한다. 

```javascript
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { PonyRacerAppComponent } from './app.component';
// do not forget to import the component
import { RacesComponent } from './races.component';
@NgModule({
  imports: [BrowserModule],
  declarations: [PonyRacerAppComponent, RacesComponent],
  bootstrap: [PonyRacerAppComponent]
})
export class AppModule {
}
```

클래스를 직접적으로 전달하므로 클래스를 가져와야 한다. 
가져오기를 하기위해서는 소스 파일인 races.component.ts 에서 RacesComponent 클래스를 내보내야 한다. 

```javascript
// in another file, races.component.ts
import { Component } from '@angular/core';
@Component({
  selector: 'ns-races',
  template: `<h2>Races</h2>`
})
export class RacesComponent {
}
```

이제 reces 컴포넌트는 우리의 브라우져에 이렇게 보일 것이다. 

```javascript
<ponyracer-app>
  <h1>PonyRacer</h1>
  <ns-races>
   <h2>Races</h2>
  </ns-races>
</ponyracer-app>
```

**************************************************************************************************

## Property binding

보간법은 템플릿에서 동적인 부분을 갖는 유일한 방법 중 하나이다. <br/>
실제로 우리가 보았던 보간법은 Angular 2 템플릿 시스템의 핵심 인 속성 바인딩을 사용하는 쉬운 방법이다. <br/><br/>

Angular 2에서는 각 대괄호를 대괄호 []로 묶인 HTML 요소의 특수 속성을 통해 작성할 수 있다. 
처음에는 이상하게 보이지만 실제로는 유효한 HTML 이다. 
HTML 속성은 따옴표, 어포 스트로피, 슬래시, 같음, 공백과 같은 몇 가지 문자를 제외하고 원하는 모든 것으로 시작할 수 있다. <br/><br/>

나는 DOM 속성에 대해 이야기하고 있지만 어쩌면 이것이 당신에게 명확하지 않을 수도 있다. 
우리는 일반적으로 HTML 속성에 쓰고 있다. <br/><br/>

```javascript
<input type="text" value="hello">
```

위의 입력 태그에는 두 가지 속성, 즉 유형 속성과 값 속성이 있다. 
브라우저가이 태그를 파싱하면 일치하는 속성 유형 및 값이있는 해당 DOM 노드 (HTMLInputElement)를 만든다.
각 표준 HTML 속성에는 DOM 노드에 해당 속성이 있다. 
그러나 DOM 노드에는 해당 특성이없는 추가 속성도 있다. (예 : childElementCount, innerHTML 또는 textContent )

사용자 이름을 표시하기 위한 보간법은 다음과 같다. 

```javascript
<p>{{user.name}}</p>
```

다음은 간단한 구문이다. 

```javascript
<p [textContent]="user.name"></p>
```

대괄호 구문을 사용하면 DOM 속성 textContent를 수정할 수 있으며 보간 용으로 사용 된 것처럼 현재 구성 요소 인스턴스의 컨텍스트에서 평가되는 user.name 값을 지정한다. 
구문 분석기는 대소문자를 인지하기 때문에 정확한 이름을 사용해야한다. 
DOM 속성은 HTML 속성보다 큰 이점을 가지고 있다. 만약 내가 입력 예제에서 value 속성은 항상 'hello'를 보여주는 반면에
DOM 의 Value 속성 노드는 브라우저에 의해 동적으로 수정되므로 사용자가 텍스트 필드에 입력 한 내용이 모두 포합된다. <br/><br/>

마지막으로 속성은 부울 값을 가질 수 있지만 일부 속성은 시작 태그에 존재하거나 부재함으로써 속성을 반영 할 수 있다. <br/>
예를 들어, <option> 태그에 selected 속성이 있다. <br/>
어떤 값을 지정했는지에 상관없이 옵션이있는 한 옵션을 선택한다. <br/><br/>

```javascript
<option selected>Rainbow Dash</option>
<option selected="false">Rainbow Dash</option> <!-- still selected -->
```

Angular 2 와 같은 속성 접근을 사용하게 되면

```javascript
<option [selected]="isPonySelected" value="Rainbow Dash">Rainbow Dash</option>
```

pony는 isPonySelected가 true이면 선택되어 질 것이고 그렇지 않으면 선택되지 않을 것이다. 
그리고 isPonySelected의 값이 변할 때마다 선택된 속성도 변경될 것이다. <br/>

Angular 1에서는 번거롭지만 많은 것들을 할수 있었다. 예를 들어 이미지를 동적 주소로 바인딩 하는것이 있다. 

```javascript
<img src="{{pony.avatar.url}}">
```
이 구문은 큰 문제가 있다. 브라우져는 src 속성을 읽자마자 이미지를 가져오려고 시도할 것이고 
실패로 보여질 것이다. 왜냐하면 {{pony.avatar.url}}은 유효한 URL이 아닌 HTTP 요청이기 때문이다. <br/>

그래서 Angular 1에서는 특별한 디렉티브가 있었다. : ng-src
```javascript
<img ng-src="{{pony.avatar.url}}">
```

src 대신 ng-src를 사용하여 문제는 해결하였다. 
AngularJS가 앱을 컴파일하고 나면 src 속성에 올바른 URL이 추가되어 이미지 다운로드가 시작된다. 
그러나 이는 두 가지 문제점이 있다. 

- 먼저 개발자로서 ng-src에 제공 할 가치를 알아야 한다. 그것은 'https://gravatar.com'이었습니까? ''https://gravatar.com ''? 'pony.avatar.url'? '{{pony.avatar.url}}'? 문서를 읽는 것 외에는 알 길이 없다. 
-  Angular 팀은 각 표준 속성에 대한 지침을 작성해야했습니다. 
그들은 그렇게했고, 우리는 그것들을 배워야했다. 
그러나 이제는 HTML에 외부 웹 구성 요소가 포함될 수있는 세상에 있다. 

```javascript
<ns-pony name="Rainbow Dash"></ns-pony>
```

Web Component를 사용하려는 경우 Web Component 개발자가 주의 깊게 처리 한 경우를 제외하고 대부분의 JS 프레임 워크에서 동적 값을 전달하는 쉬운 방법이 없다. 
자세한 내용은 Web Component 챕터를 읽어보도록 해라. <br/>

Web Component는 브라우져 엘리먼트처럼 동작해야 한다. 
Web Component들은 Angular 2기반의 속성, 이벤트, 함수 등을 가져야 한다.  

```javascript
<ns-pony [name]="pony.name"></ns-pony>
```

그리고 정상적으로 동작한다. 
Angular는 속성과 요소에 대한 동기화를 유지할것이다. 
더 이상 지시어를 배울 필요가 없다. 요소를 숨기려면 표준 숨김 속성을 사용할 수 있다. 

```javascript
<div [hidden]="isHidden">Hidden or not</div>
```

ishidden이 true일 경우 div는 사라질 것이다. Angular는 숨겨진 속성과 직접 작동하기 때문이다. 
더 이상 Angular에서 사용된 directives 중의 하나 인 ng-hide와 같은 directive를 사용할 필요가 없다. 
스타일 속성의 color 속성과 같이 중첩된 속성에 접근할 수도 있다. 

```javascript
<p [style.color]="foreground">Friendship is Magic</p>
```

foreground의 속성이 '녹색'으로 변한다고 하면, color도 녹색으로 변할 것이다. <br/>
따라서 Angular 2는 속성을 사용하고 있다. 어떤 값을 전달할 수 있을까? 
우리는 이미 보간 속성 property="{{expression}}" 을 이미 보았다. 

```javascript
<ns-pony name="{{pony.name}}"></ns-pony>
```

이것은 [property] ="expression"과 동일하다. 

```javascript
<ns-pony [name]="pony.name"></ns-pony>
```

'Pony' 글자 뒤에 pony의 이름을 덧 붙이기를 원한다면 당신은 두 가지 옵션이 있다. 

 ```javascript
<ns-pony name="Pony {{pony.name}}"></ns-pony>
<ns-pony [name]="'Pony ' + pony.name"></ns-pony>
```

만약 당신이 동적인 변수를 사용하지 않는다면 property = "value" 와 같이 간단하게 적을 수 있다. 

 ```javascript
 name="Rainbow Dash"></ns-pony>
```

이들 모두는 동등하고 구문은 개발자가 구성 요소를 설계하는 방법에 달려 있지 않는다.  
구성 요소가 값 또는 참조 예를 기대하고 있는지를 알아야하는 AngularJS 1.x의 경우와 같다고 할 수 있다. 


**************************************************************************************************

## Events

웹 애플리케이션을 개발한다면, 일을 표시하는 것이 일의 한 부분 일뿐만 아니라 사용자 상호 작용을 처리해야한다는 것을 알고 있어야 한다. 
이를 허용하기 위해 브라우져는 당신이 받을 수 제어 할 수 있도록 이벤트를 발생시킨다. 
click, keyup, mousemove 등 ... AngularJS 1.x는 이벤트 당 하나의 지시문을 가지고 있고,
ng-click, ng-keyup, ng-mousemove 등 ... Angular 2에서 이것을 더욱 기억하기 쉽고 간단하게 설계하였다.<br/><br/>

우리 RacesComponent로 돌아가서, 이제 클릭했을 때 레이스를 표시 할 버튼이 필요하다.<br/>
상호작용은 다음과 같이 작성할 것이다.

```javascript
<button (click)="onButtonClick()">Click me!</button>
```

위 예의 버튼을 클릭하면 onButtonClick () 메소드의 호출이 트리거가 발생한다. 

```javascript
@Component({
  selector: 'ns-races',
  template: `
   <h2>Races</h2>
   <button (click)="refreshRaces()">Refresh the races list</button>
   <p>{{races.length}} races</p>
  `
})
export class RacesComponent {
  races: any = [];
  refreshRaces() {
   this.races = [{ name: 'London' }, { name: 'Lyon' }];
  }
}
```

만약 당신의 브라우져에서 시도하려면, 당신은 처음에 이러한 구조를 확인할 것이다. 

```javascript
<ponyracer-app>
  <h1>PonyRacer</h1>
  <ns-races>
   <h2>Races</h2>
   <button (click)="refreshRaces()">Refresh the races list</button>
   <p>0 races</p>
  </ns-races>
</ponyracer-app>
```

클릭한 이후에 '0 races'는 '2 races'로 변할 것이다. <br/>
명령문은 함수 호출이 될 수도 있지만 실행 가능한 명령문 또는 실행 가능한 명령문의 연속일 수도 있다. 

```javascript
<button (click)="firstName = 'Cédric'; lastName = 'Exbrayat'">
  Click to change name to Cédric Exbrayat
</button>
```

그러나 나는 이것을 권고하지는 않는다. 메서드를 사용하면 동작을 캡슐화 하는데 더 좋은 방법이기 때문이다.
코드를 유지 관리하고 테스트하기가 쉬우며 보기가 더 단순하다. <br/>

좋은 점은 표준 DOM 이벤트뿐만 아니라 발생시킬 수 있는 사용자 정의 이벤트에서도 작동한다는 것이다. 
Angular 구성 요소 또는 웹 구성 요소에서 가져올것이다. 나중에 맞춤 이벤트를 시작하는 방법을 살펴 보겠다. <br/>

잠시 동안 RacesComponent 구성 요소가 새로운 경주를 사용할 수 있음을 앱에 알리기 위해 맞춤 이벤트를 내 보냈다고 가정 해 보자.

```javascript
@Component({
  selector: 'ponyracer-app',
  template: `
   <h1>PonyRacer</h1>
   <ns-races (newRaceAvailable)="onNewRace()"></ns-races>
  `
})
export class PonyRacerAppComponent {
  onNewRace() {
   // add a flashy message for the user.
  }
}
```

<ns-races> 구성 요소에 newRaceAvailable이라는 사용자 지정 이벤트가 있고이 이벤트가 발생하면 PonyRacerAppComponentis의 onNewRace () 메서드가 호출되었음을 쉽게 알 수 있다. <br/>
Angular는 요소와 해당 요소의 이벤트를 수신하므로 거품이 발생하는 이벤트에 반응한다. 템플릿을 고려해보도록 하자. 

```javascript
<div (click)="onButtonClick()">
  <button>Click me!</button>
</div>
```

사용자가 div 안에 포함 된 버튼을 클릭하더라도 onButtonClick () 메서드가 호출된다. 
왜냐하면 이벤트가 거품을 내뿜기 때문이다.<br/>
그리고 당신은라는 메서드에서 이벤트에 액세스 할 수 있다. 단지 $ event를 당신의 메소드에 넘겨 주면된다. 

```javascript
<div (click)="onButtonClick($event)">
  <button>Click me!</button>
</div>
```

그런 다음 구성 요소 클래스에서 이벤트를 처리 할 수 있다.

```javascript
onButtonClick(event) {
  console.log(event);
}
```

기본적으로 이벤트는 지속적으로 거품을 내며 결국 계층에서 다른 이벤트 리스너를 트리거하게된다. <br/>
이 이벤트를 사용하여 기본 동작을 방지하고 원하는 경우 전파를 취소 할 수 있다. 

```javascript
onButtonClick(event) {
  event.preventDefault();
  event.stopPropagation();
}
```

또 하나의 특징은 키보드 이벤트를 보다 쉽게 처리할 수 있다는 것이다. 

```javascript
<textarea (keydown.space)="onSpacePress()">Press space!</textarea>
```

spacekey를 누를 때마다 onSpacePress () 메소드가 호출있고 (keydown.alt.space) 등의 커스터마이징된 콤보를 할 수 있다.<br/>
이 부분을 결론 짓기 위해 나는 다음과 같이 큰 차이가 있음을 지적하고자 한다.

```javascript
<component [property]="doSomething()"></component>
```

```javascript
<component (event)="doSomething()"></component>
```

첫 번째 속성 바인딩은 doSomething () 값은 식이라고 각 변경 검색주기에서 평가 된 속성을 업데이트 할 필요가 있는지 여부를 확인한다. <br/><br/>

그러나 두 번째의 경우는 이벤트 바인딩은 doSomething () 값은 문장이라고 이벤트가 트리거 된 경우에만 평가된다. <br/><br/>

정의에 따르면 그들은 완전히 다른 목표를 가지고 있으며, 당신이 의심 할 수 있듯이, 그들은 다른 제한을 가지고 있다.


**************************************************************************************************


## Expressions vs statements


웹 애플리케이션을 개발한다면, 일을 표시하는 것이 일의 한 부분 일뿐만 아니라 사용자 상호 작용을 처리해야한다는 것을 알고 있어야 한다. 
이를 허용하기 위해 브라우져는 당신이 받을 수 제어 할 수 있도록 이벤트를 발생시킨다. 
click, keyup, mousemove 등 ... AngularJS 1.x는 이벤트 당 하나의 지시문을 가지고 있고,
ng-click, ng-keyup, ng-mousemove 등 ... Angular 2에서 이것을 더욱 기억하기 쉽고 간단하게 설계하였다.<br/><br/>

우리 RacesComponent로 돌아가서, 이제 클릭했을 때 레이스를 표시 할 버튼이 필요하다.<br/>
상호작용은 다음과 같이 작성할 것이다.

```javascript
<button (click)="onButtonClick()">Click me!</button>
```

위 예의 버튼을 클릭하면 onButtonClick () 메소드의 호출이 트리거가 발생한다. 

```javascript
@Component({
  selector: 'ns-races',
  template: `
   <h2>Races</h2>
   <button (click)="refreshRaces()">Refresh the races list</button>
   <p>{{races.length}} races</p>
  `
})
export class RacesComponent {
  races: any = [];
  refreshRaces() {
   this.races = [{ name: 'London' }, { name: 'Lyon' }];
  }
}
```

만약 당신의 브라우져에서 시도하려면, 당신은 처음에 이러한 구조를 확인할 것이다. 

```javascript
<ponyracer-app>
  <h1>PonyRacer</h1>
  <ns-races>
   <h2>Races</h2>
   <button (click)="refreshRaces()">Refresh the races list</button>
   <p>0 races</p>
  </ns-races>
</ponyracer-app>
```

클릭한 이후에 '0 races'는 '2 races'로 변할 것이다. <br/>
명령문은 함수 호출이 될 수도 있지만 실행 가능한 명령문 또는 실행 가능한 명령문의 연속일 수도 있다. 

```javascript
<button (click)="firstName = 'Cédric'; lastName = 'Exbrayat'">
  Click to change name to Cédric Exbrayat
</button>
```

그러나 나는 이것을 권고하지는 않는다. 메서드를 사용하면 동작을 캡슐화 하는데 더 좋은 방법이기 때문이다.
코드를 유지 관리하고 테스트하기가 쉬우며 보기가 더 단순하다. <br/>

좋은 점은 표준 DOM 이벤트뿐만 아니라 발생시킬 수 있는 사용자 정의 이벤트에서도 작동한다는 것이다. 
Angular 구성 요소 또는 웹 구성 요소에서 가져올것이다. 나중에 맞춤 이벤트를 시작하는 방법을 살펴 보겠다. <br/>

잠시 동안 RacesComponent 구성 요소가 새로운 경주를 사용할 수 있음을 앱에 알리기 위해 맞춤 이벤트를 내 보냈다고 가정 해 보자.

```javascript
@Component({
  selector: 'ponyracer-app',
  template: `
   <h1>PonyRacer</h1>
   <ns-races (newRaceAvailable)="onNewRace()"></ns-races>
  `
})
export class PonyRacerAppComponent {
  onNewRace() {
   // add a flashy message for the user.
  }
}
```

<ns-races> 구성 요소에 newRaceAvailable이라는 사용자 지정 이벤트가 있고이 이벤트가 발생하면 PonyRacerAppComponentis의 onNewRace () 메서드가 호출되었음을 쉽게 알 수 있다. <br/>
Angular는 요소와 해당 요소의 이벤트를 수신하므로 거품이 발생하는 이벤트에 반응한다. 템플릿을 고려해보도록 하자. 

```javascript
<div (click)="onButtonClick()">
  <button>Click me!</button>
</div>
```

사용자가 div 안에 포함 된 버튼을 클릭하더라도 onButtonClick () 메서드가 호출된다. 
왜냐하면 이벤트가 거품을 내뿜기 때문이다.<br/>
그리고 당신은라는 메서드에서 이벤트에 액세스 할 수 있다. 단지 $ event를 당신의 메소드에 넘겨 주면된다. 

```javascript
<div (click)="onButtonClick($event)">
  <button>Click me!</button>
</div>
```

그런 다음 구성 요소 클래스에서 이벤트를 처리 할 수 있다.

```javascript
onButtonClick(event) {
  console.log(event);
}
```

기본적으로 이벤트는 지속적으로 거품을 내며 결국 계층에서 다른 이벤트 리스너를 트리거하게된다. <br/>
이 이벤트를 사용하여 기본 동작을 방지하고 원하는 경우 전파를 취소 할 수 있다. 

```javascript
onButtonClick(event) {
  event.preventDefault();
  event.stopPropagation();
}
```

또 하나의 특징은 키보드 이벤트를 보다 쉽게 처리할 수 있다는 것이다. 

```javascript
<textarea (keydown.space)="onSpacePress()">Press space!</textarea>
```

spacekey를 누를 때마다 onSpacePress () 메소드가 호출있고 (keydown.alt.space) 등의 커스터마이징된 콤보를 할 수 있다.<br/>
이 부분을 결론 짓기 위해 나는 다음과 같이 큰 차이가 있음을 지적하고자 한다.

```javascript
<component [property]="doSomething()"></component>
```

```javascript
<component (event)="doSomething()"></component>
```

첫 번째 속성 바인딩은 doSomething () 값은 식이라고 각 변경 검색주기에서 평가 된 속성을 업데이트 할 필요가 있는지 여부를 확인한다. <br/><br/>

그러나 두 번째의 경우는 이벤트 바인딩은 doSomething () 값은 문장이라고 이벤트가 트리거 된 경우에만 평가된다. <br/><br/>

정의에 따르면 그들은 완전히 다른 목표를 가지고 있으며, 당신이 의심 할 수 있듯이, 그들은 다른 제한을 가지고 있다.

**************************************************************************************************

## Local variables

Angular가 변수를 찾기 위해 구성 요소 인스턴스를 볼 것이라고 말하면 기술적으로 올바르지 않다. 
실제로 구성 요소 인스턴스와 로컬 변수를 검사한다. 
지역 변수는 #syntax를 사용하여 템플릿에서 동적으로 선언 할 수있는 변수이다.<br/>

입력 값을 표시한다고 가정해 보자. 

```javascript
<input type="text" #name>
{{ name.value }}
```

#syntax를 사용하여 DOM 개체 인 HTMLInputElement를 참조하는 로컬 변수 이름을 만든다.
이 로컬 변수는 템플릿의 어느 위치에서나 사용할 수 있다. 
value 속성을 가지므로 이 속성을 보간 된 표현식에 표시 할 수 있다. 나중에 이 예제로 돌아 오겠다.<br/><br/>

지역 변수의 또 다른 유용한 사용법은 다른 요소에서 어떤 종류의 액션을 실행하고자 할 때이다.<br/><br/>

예를 들어, 버튼을 클릭 할 때 요소에 포커스를 둘 수 있습니다. 
이는 AngularJS 1.x에서 사용자 지정 지시문을 작성해야했기 때문에 약간 번거로운 점이 있었다. 

focus () 메소드는 DOM API의 표준 부분이며이를 활용할 수 있고 지역 변수를 사용하면 Angular 2를 쉽게 접근 할 수 있다.

```javascript
<input type="text" #name>
<button (click)="name.focus()">Focus the input</button>
```

또한 사용자 정의 구성 요소 (응용 프로그램에서 작성한 구성 요소, 다른 프로젝트에서 가져온 구성 요소 또는 실제 웹 구성 요소)와 함께 사용할 수도 있다.

```javascript
<google-youtube #player></google-youtube>
<button (click)="player.play()">Play!</button>
```

여기에서 버튼은 <google-youtube> 구성 요소의 동영상 재생을 시작할 수 있다. 이것은 실제로 Polymer로 작성된 실제 웹 구성 요소이다! 
이 구성 요소에는 단추를 클릭 할 때 Angular가 호출하는 play () 메서드가 있다. <br/><br/>

지역 변수에는 몇 가지 유스 케이스가 있으며, 점진적으로 살펴 보겠습니다. 그 중 하나가 바로 다음 섹션에 설명되어 있습니다.<br/><br>

**************************************************************************************************

## Structural directives


702/5000
이제 우리의 RacesComponent는 여전히 레이스를 표시하지 않는다. 
Angular 2의 "적절한 방법"은 각 레이스를 표시하는 또 다른 구성 요소 인 RaceComponent를 만드는 것을 의미한다.
약간 더 간단한 작업을 수행하기 위해 간단한 <ul> <li> 목록을 사용할 것이다.<br/><br/>

속성 및 이벤트 바인딩은 훌륭하지만 컬렉션을 반복하고 항목 당 요소를 추가하는 것과 같이 DOM 구조를 변경할 수는 없다. 이를 위해서는 구조 지시문을 사용해야한다. 
Angular의 지시문은 실제로 구성 요소와 비슷하지만 템플릿이 없다. 요소에 비헤이비어를 추가하는 데 사용된다.
Angular 2에서 제공하는 구조 지시문은 HTML 사양의 표준 태그 인 template 요소를 사용한다. 

```javascript
<template>
  <div>Races list</div>
</template>
```

여기에 템플릿을 정의하고 간단한 div를 표시한다. 브라우져가 표시하지 않으므로 단일로는 사용되지 않는다. 
그러나 하나의 'template'요소를 뷰에 추가한다면 Angular 2 는 해당 내용을 사용할 수 있다. 
구조적 지시문에는 내용을 표시하거나 표시하지 않고 반복하는 등의 간단한 작업을 수행 할 수 있다. 

- NgIf<br/><br/>


조건이 일치하는 경우에만 템플릿을 사용하길 원한다면 ngIf를 사용하면 된다. 

```javascript
<template [ngIf]="races.length > 0">
  <div><h2>Races</h2></div>
</template>
```

여기서 템플릿은 race가 적어도 하나의 요소를 가지고있을 때, 즉 race가 있다면 인스턴스화 될 것이다. 이 구문은 약간 길기 때문에 짧은 버전으로 보여주었다.

```javascript
<div *ngIf="races.length > 0"><h2>Races</h2></div>
```

구문은 *를 사용하여 구조 지시문임을 나타낸다. 
ngIf 또는 경주 값이 변경 될 때마다 div가 표시되지 않는다. 
더 이상 경주가 없으면 div는 사라질것이다.
프레임 워크에서 제공되는 지시문은 이미 사전 로드되어 있으므로 @Componentdecorator의 지시어 속성에서 NgIf를 가져오고 선언 할 필요가 없다.

```javascript
import { Component } from '@angular/core';
@Component({
  selector: 'ns-races',
  template: `<div *ngIf="races.length > 0"><h2>Races</h2></div>`
})
export class RacesComponent {
  races: Array<any> = [];
}
```

- NgFor<br/><br/>

실제 데이터로 작업하면 필연적으로 무언가의 목록을 표시하게 된다. NgFor는 매우 유용하게 사용 된다. 
컬렉션의 항목 당 하나의 템플릿을 인스턴스화 할 수 있다. 우리의 RacesComponent 구성 요소에는 아마 추측 할 수 있듯이 표시 할 경주의 배열 인 필드 경주가 있습니다.

```javascript
import { Component } from '@angular/core';
@Component({
  selector: 'ns-races',
  template: `<div *ngIf="races.length > 0">
  <h2>Races</h2>
  <ul>
   <li *ngFor="let race of races">{{race.name}}</li>
  </ul>
  </div>`
})
export class RacesComponent {
  races: Array<any> = [{ name: 'London' }, { name: 'Lyon' }];
}
```

이제 우리 컬렉션에는 항목 당 하나의 li 태그가있는 멋진 목록이 있다. 

```javascript
<ul>
  <li>London</li>
  <li>Lyon</li>
</ul>
```

NgFor가 microsyntax라고 하는 특정 구문을 사용하고 있다. 

```javascript
<ul>
  <li *ngFor="let race of races">{{race.name}}</li>
</ul>
```

```javascript
<ul>
  <template ngFor let-race [ngForOf]="races">
   <li>{{race.name}}</li>
  </template>
</ul>
```

여기서 당신이 인지할 수 있는 것들이 있다. 
- template 요소는 template 안에 있는 요소들을 정의한다. 
- NgFor 지시문이 적용되어 있다. 
- NgForOf 요소는 표현할 집합에 대한 정의 이다. 
- race 변수는 현재 요소를 반영하고 함춥된 변수를 사용하는 것을 허용한다. 

그러나 이 모든 것을 기억하는 것보다는 짧은 형식으로 사용하는 게 더 효과적이다. 

```javascript
<ul>
  <li *ngFor="let race of races">{{race.name}}</li>
</ul>
```

현재 요소의 색인에 바인드 된 다른 지역 변수를 선언 할 수 있다. 

```javascript
<ul>
  <li *ngFor="let race of races; let i=index">{{i}} - {{race.name}}</li>
</ul>
```

지역 변수 i는 0에서 시작하여 현재 요소의 인덱스를 받는다.

```javascript
<ul>
  <li>0 - London</li>
  <li>1 - Lyon</li>
</ul>
```

유용 할 수있는 다른 내 보낸 변수도 있습니다.
• even, 요소가 짝수 인덱스를 갖는 경우 참인 부울 값이다. 
• odd, 부울 값은 요소에 홀수 색인이있는 경우 true이다.
• first : 요소가 컬렉션의 첫 번째 요소 인 경우 참인 부울값 이다.
• last : 요소가 컬렉션의 마지막 요소 인 경우 참인 부울값 이다.

- NgSwtich<br/><br/>

이름에서 짐작할 수 있듯이 지시문은 조건에 따라 다른 템플릿을 전환 할 수있게 해준다. 

```javascript
<div [ngSwitch]="messageCount">
  <p *ngSwitchCase="0">You have no message</p>
  <p *ngSwitchCase="1">You have a message</p>
  <p *ngSwitchDefault>You have some messages</p>
</div>
```

보시다시피 ngSwitch는 조건을 취하고 * ngSwitchCase는 가능한 값을 취한다. 
일치하는 값이 없을 경우 * ngSwitchDefault를 표시 할 수도 있다.



**************************************************************************************************

## Other template directives

다른 두 개의 지시문은 템플릿을 작성할 때 유용 할 수 있지만 방금 본 것과 같은 구조 지시문은 아니다. 이러한 지시문은 표준 지시문이다.

- NgStyle<br/><br/>

우리는 이미 우리가 요소의 스타일에 따라 행동 할 수 있음을 보았다.

```javascript
<p [style.color]="foreground">Friendship is Magic</p>
```

동시에 여러 스타일을 설정해야하는 경우 ngStyle 지시문을 사용할 수 있습니다.

```javascript
<div [ngStyle]="{fontWeight: fontWeight, color: color}">I've got style</div>
```

지시문은 키가 스타일을 설정할 객체를 기대한다. 키는 camelCase (fontWeight) 또는 대시 ( 'font-weight') 중 하나 일 수 있다.

- NgClass<br/><br/>

같은 문맥으로 클래스 지시어를 사용하면 요소를 동적으로 클래스에 추가하거나 제거 할 수 있다.
스타일은 속성 바인딩을 사용하여 하나의 클래스를 설정할 수 있다.

```javascript
<div [class.awesome-div]="isAnAwesomeDiv()">I've got style</div>
```

또는 여러 항목을 동시에 설정하려는 경우 ngClass를 사용할 수 있다. 

```javascript
<div [ngClass]="{'awesome-div': isAnAwesomeDiv(), 'colored-div': isAColoredDiv()}">I've got style</div>
```

**************************************************************************************************

## Canonical syntax

우리가 본 모든 구문은 표준 구문이라는보다 긴 상응을 가지고 있다. 
이것은 주로 서버 측의 템플릿 시스템이 [] 또는 () 구문에 문제가있을 경우 또는, () *를 사용할 수없는 경우에 유용하다. <br/>

속성 바인딩을 선언하려는 경우 다음을 수행 할 수 있다.

```javascript
<ns-pony [name]="pony.name"></ns-pony>
```

또는 정규 구문을 사용하여 표현할 수 있다. 

```javascript
<ns-pony bind-name="pony.name"></ns-pony>
```

이벤트 할당도 마찬가지 이다. 

```javascript
<button (click)="onButtonClick()">Click me!</button>
```

또는 정규 구문을 사용하여 표현할 수 있다. 

```javascript
<button on-click="onButtonClick()">Click me!</button>
```

```javascript
<input type="text" ref-name>
<button on-click="name.focus()">Focus the input</button>
```

```javascript
<input type="text" #name>
<button (click)="name.focus()">Focus the input</button>
```

**************************************************************************************************

## Summary

Angular 2 템플릿 시스템은 HTML의 동적 부분을 표현하는 강력한 구문을 제공한다. 
데이터와 속성 바인딩, 이벤트 바인딩 및 템플릿 관련 문제를 명확한 방법으로 표현할 수 있다. 
각각 고유 한 심볼이 있다.

• 보간을 위한 {{}}
• 속성 바인딩을 위한 []
• 이벤트 바인딩을 위한 ()
• 변수 선언을 위한 #for
• 구조 지시문을 위한 *

다른 프레임 워크처럼 표준 웹 구성 요소와 상호 작용할 수있는 방법을 제공한다. 
다양한 의미 사이에 모호성이 없으므로 템플릿과 IDE가 점진적으로 향상되어 템플릿에서 작성한 내용에 대한 의미있는 경고를 얻을 수 있다.
이 모든 기호는 정식 버전의 짧은 버전으로, 원하는 경우 사용할 수도 있다.<br/>
이 구문을 유창하게하려면 시간이 좀 걸리 겠지만 곧 속도가 빨라진다. 그러면 읽고 쓰는 것이 쉽다.<br/>
계속 진행하기 전에 전체 예제를 살펴 보도록 하자.<br/>

pony 목록을 표시하는 PoniesComponent 구성 요소를 작성하고 싶다. 
각 조랑말은 PonyComponent 구성 요소로 나타내야하지만 구성 요소에 매개 변수를 전달하는 방법을 아직 보지 못했다. 
이제는 간단한 목록을 보여줄 것이다. 목록은 표시되지 않는 경우에만 표시되어야 한다.
비어있는, 그리고 내 목록의 짝수 라인에 대한 몇 가지 색상을 갖고 싶다. 
마지막으로 버튼 클릭으로 목록을 새로 고침하고 싶다.

```javascript
import { Component } from '@angular/core';
@Component({
  selector: 'ns-ponies',
  template: ``
})
export class PoniesComponent {
}
```

이전 장에서 테스트 한 PonyRacerAppComponent 구성 요소에 추가 할 수 있다. 이를 가져 와서 지시문에 추가하고 <ns-ponies> </ ns-ponies> 태그를 템플릿에 삽입해야 한다.

```javascript
import { Component } from '@angular/core';
@Component({
  selector: 'ns-ponies',
  template: ``
})
export class PoniesComponent {
  ponies: Array<any> = [{ name: 'Rainbow Dash' }, { name: 'Pinkie Pie' }];
}
```

우리는 Ngfor를 사용하여 리스트를 보여줄것이다. 

```javascript
import { Component } from '@angular/core';
@Component({
  selector: 'ns-ponies',
  template: `<ul>
   <li *ngFor="let pony of ponies">{{pony.name}}</li>
  </ul>`
})
export class PoniesComponent {
  ponies: Array<any> = [{ name: 'Rainbow Dash' }, { name: 'Pinkie Pie' }];
}
```

추가 버튼도 추가해보자.

```javascript
import { Component } from '@angular/core';
@Component({
  selector: 'ns-ponies',
  template: `<button (click)="refreshPonies()">Refresh</button>
  <ul>
   <li *ngFor="let pony of ponies">{{pony.name}}</li>
  </ul>`
})
export class PoniesComponent {
  ponies: Array<any> = [{ name: 'Rainbow Dash' }, { name: 'Pinkie Pie' }];
  refreshPonies() {
   this.ponies = [{ name: 'Fluttershy' }, { name: 'Rarity' }];
  }
}
```

```javascript
import { Component } from '@angular/core';
@Component({
  selector: 'ns-ponies',
  template: `<button (click)="refreshPonies()">Refresh</button>
  <ul>
   <li *ngFor="let pony of ponies; let isEven=even"
   [style.color]="isEven ? 'green' : 'black'">
   {{pony.name}}
   </li>
  </ul>`
})
export class PoniesComponent {
  ponies: Array<any> = [{ name: 'Rainbow Dash' }, { name: 'Pinkie Pie' }];
  refreshPonies() {
   this.ponies = [{ name: 'Fluttershy' }, { name: 'Rarity' }];
  }
}
```

보시다시피, 우리는 템플릿 구문의 모든 범위를 사용했으며, 우리는 완벽하게 작동하는 구성 요소를 가지고 있다. 
우리의 데이터는 여전히 하드 코드되어 있다. 곧 서비스를 사용하여 가져 오는 방법을 살펴 보자! 
이것은 의존성 주입을 먼저 배우므로 HTTP 서비스를 사용할 수 있음을 의미한다.


**************************************************************************************************


## Reference URL
- [BEM introduction](http://getbem.com/introduction/)
- [BEMIT(BEM을 기반으로 확장변형 시킨 네이밍 컨벤션)](http://csswizardry.com/2015/08/bemit-taking-the-bem-naming-convention-a-step-further/)
- [SMACSS](https://smacss.com/)