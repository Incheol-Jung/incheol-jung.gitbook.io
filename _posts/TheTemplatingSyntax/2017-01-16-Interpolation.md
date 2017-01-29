---
layout: post
title:  "Interpolation"
date:   2017-01-16 00:00:00
categories: TheTemplatingSyntax
comments: true
---

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

