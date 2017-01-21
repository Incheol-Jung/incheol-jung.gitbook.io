---
layout: post
title:  "Structural directives"
date:   2017-01-21 00:00:00
categories: TheTemplatingSyntax
comments: true
---


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

