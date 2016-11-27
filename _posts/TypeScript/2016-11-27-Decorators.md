---
layout: post
title:  "Decorators"
date:   2016-11-27 00:00:00
categories: TypeScript
comments: true
---

이것은 새로운 특징이며 Angularjs를 지원하기 위해 오직 TypeScript 1.5 에 추가되었다.
게다가 곧 알수 있듯이 Angular 2 Componenet는 Decorator를 사용하여 설명될 수 있다. 
이것은 모든 언어에서 가지고 있지 않기 때문에, decorator에 대해서 들어보지 않았을 수도 있다. 
decorator는 메타 프로그래밍을 할수 있는 방법이라 할 수 있다. 
그들은 java, c#, python 또는 내가 알지 못하는 언어에서 주로 사용되어지는 선언과 같은 것과 매우 유사할 것이다. 
언어에 따라서 당신은 속성, 함수, 변수를 추가할수 있다. 일반적으로 선언은 언어에 의해 사용되어지지 않고 프레임워크나 라이브러리에서 주로 사용된어 진다.<br/><br/>

Decorator는 매우 강력하다. 그들은 메소드, 클래스 등을 수정할 수 있으며 예를 들어 호출의 파라미터를 변경하고,
결과를 간섭할 수 있으며, 대상이 호출 될 때 다른 메소드를 호출하더나 프레임 워크에 대한 메타 데이터를 추가 할 수 있습니다. 
지금까지도 자바스크립트에서는 몇몇은 가능하지 않는다. 그러나 언어는 진화하고 있고 향후에는 표준화 시키자는 공식 제안이 있습니다. 
TypeScript 구현은 제안 된 표준 보다 약간 더 가깝다. <br/><br/>

Angular2에서는 프레임워크에 의해 제공하는 decorator를 사용할 것이다. 
decorator의 역활은 매우 간단하다. 
decorator는 우리의 클래스에 약간의 메타 데이터를 추가한다. " 해당 클래스는 컴포넌트이다.", "이것은 선택적인 의존이다."
"이것은 커스터마이징된 속성이다." 당신이 메타데이터를 수정으로 넣는다면 decorator를 사용하라고 요구 하지 않는다.<br/><br/>

TypeScript에서는 decorator는 @로 시작한다. 그리고 클래스에 적용할수 있고 변수 또는 함수 또는 파라미터에도 적용할 수 있다. 
decorator는 생성자에는 적용될수 없으나 생성자의 파라미터에는 적용될 수 있다. 

이것에 대해 더 확실히 이해하기 위해서 간단한 decorator를 빌드해보자. @log는 모든 함수가 호출될때 사용된다. 

```javascript
class RaceService {
  @Log()
  getRaces() {
   // call API
  }
  @Log()
  getRace(raceId) {
   // call API
  }
}
```

정의하기 위해, 우리는 이 와같이 반환하는 함수를 작성해야 한다. 

```javascript
const Log = function () {
  return (target: any, name: string, descriptor: any) => {
   logger.log(`call to ${name}`);
   return descriptor;
  };
};
```

당신이 decorator에 적용하길 원하는 것에 따라서, 함수는 매번 같은 파라미터를 갖지 않을 것이다.
해당 함수 decorator는 세가지 파라미터를 가진다. 
    - target : decorator의 의해 목표로 하는 함수
    - name : targeted 함수의 이름
    - descriptor : targeted된 함수의 설명

우리는 함수 이름을, 그러나 당신은 당신이 원하는 어떤 것이든 할수 있다. <br/><br/>
그래서 간단한 예를 들어, getRace() 또는 getRaces() 함수는 매 번 호출한다. 
우리는 브라우져 로그에서 추적되는 것을 확인할 수 있다. 

```javascript
raceService.getRaces();
// logs: call to getRaces
raceService.getRace(1);
// logs: call to getRace
```
user 와 같이, Angular2의 decorator가 어떻게 생겼는지 살펴 보겠다. 

```javascript
@Component({ selector: 'ns-home' })
class HomeComponent {
  constructor(@Optional() hello: HelloService) {
   logger.log(hello);
  }
}
```

@Component decorator는 Home 클래스에 추가되었다. Angular2 가 로드되었을 때, 그것은 Home 클래스를 확인할 것이고 component라는 것으로 이해할 것이다. 
보시다시피, decorator는 파라미터를 받을 수 있다. <br/><br/>

나는 decorator의 가공되지 않은 개념을 소개하길 원한다. 우리는 모든 decorator를 책 전체에서 살펴볼 것이다. 
TypeScript 대신에 Babel과 함께 사용할 수 있다는 점을 지적해야 한다.
모든 Angular 2 decorator를 지원하는 플러그인도 있다. : angular2-annotations
Babel은 클래스 속성도 지원하지만 TypeScript에서 제공하는 유형 시스템은 지원하지 않는다. 
당신은 Babel을 사용할수 있고 "ES6+"로 작성하여라. 그러나 당신은 유형들을 사용할수 없을것이고 그들은 의존성 주입에 매우 유용하게 사용될 것이다. 
예를 들면, 완전히 가능하지만 유형을 대체하기 위해 더 많은 decorator를 추가해야 한다. 

그래서 나의 조언은 TypeScript 시도하라는 것이다. 그것으로 부터 나온 나의 모든 경험은 사용할 수 있다. 
당신이 나머지에 대한 것을 잊고 융용한곳에 사용할수 있다면 이것은 방해되지 않는다. 
만약 당신이 싫다면, decorator는 Babel또는 Traceur 를 사용한 ES6 또는 심지어 ES5로 전환하는 것이 그리 어렵지 않을 것이다. 
(솔직히 ES5로는 angular 2 앱이 안좋은 코드를 가지고 있다.)