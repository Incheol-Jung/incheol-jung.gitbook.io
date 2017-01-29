---
layout: post
title:  "Events"
date:   2017-01-18 00:00:00
categories: TheTemplatingSyntax
comments: true
---

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