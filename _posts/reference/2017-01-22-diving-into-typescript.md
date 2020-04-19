---
layout: reference
title: CHAPTER 2. Diving into TypeScript
date: '2017-01-22T00:00:00.000Z'
updated: '2017-01-22T00:00:00.000Z'
categories: reference
summary: Diving into TypeScript
navigation_weight: 2
---

# 2017-01-22-Diving-into-TypeScript

## Types as in TypeScript

TypeScript에서 유형 정보를 추가하는 일반적인 구문은 다소 간단합니다.

```javascript
let variable: type;
```

이 유형들은 기억하기 쉽다.

```javascript
const poneyNumber: number = 0;
const poneyName: string = 'Rainbow Dash';
```

이러한 경우에는 유형은 TS 컴파일러가 유형을 추측할 수 있기때문에 선택적이다.   
 유형은 다음의 Pony 클래스와 같이 당신의 앱에서 나올수 있다.

```javascript
const pony: Pony = new Pony();
```

TypeScript는 일부 언어에서 "generic"으로 부르는것을 지원한다.

```javascript
const ponies: Array<Pony> = [new Pony()];
```

해당 코드는 배열이 '&lt;&gt;' 이라는 일반적인 표기를 사용하여 ponies를 담을수 있다는 것을 의미한다.   
 당신은 이것에 대해 의문을 가질지 모른다. 유형 정보를 추가하는 것은 컴파일러가 가능한 실수를 판별하도록 도울수 있을 것이다.   


```javascript
ponies.push('hello'); // error TS2345
// Argument of type 'string' is not assignable to parameter of type 'Pony'.
```

그래서, 만약 당신이 다양한 유형의 변수가 필요하다면 이것은 당신의 코드는 제대로 작성할수 없다는것을 의미하는가? 그렇지 않다. 왜냐하면 TS는 'any' 라고 불리우는 특별한 유형을 가지고 있기 때문이다.

```javascript
let changing: any = 2;
changing = true; // no problem
```

이것은 당신이 라이브러리에서 가져온 값이나 동적으로 생성된 컨텐츠에서 가져온 변수의 유형을 모를 경우에 굉장히 유용할 것이다.

만약 당신이 변수를 number 또는 boolean 유형으로 사용하고 싶을경우에는 union 을 이용해라.

```javascript
let changing: number|boolean = 2;
changing = true; // no problem
```

## Enums

TypeScript는 "enum"을 제공한다. race는 'ready', 'started', 'done'이 될 수 있다.

```javascript
enum RaceStatus {Ready, Started, Done}
   const race = new Race();
   race.status = RaceStatus.Ready;
```

enum은 0부터 시작하는 열거형 변수이지만 원하는 숫자로 셋팅할 수 있다.

```javascript
enum Medal {Gold = 1, Silver, Bronze}
```

## Return types

당신은 함수의 반횐되는 유형을 설정할 수 있다.

```javascript
function startRace(race: Race): Race {
  race.status = RaceStatus.Started;
  return race;
}
```

만약 한수가 아무것도 반환하지 않는다면 'void'를 사용하여 보여주면 된다.

```javascript
function startRace(race: Race): void {
  race.status = RaceStatus.Started;
}
```

## Interfaces

초기에 말하였듯이, 자바스크립트는 동적인 속성으로 굉장히 좋다. 그래서 함수는 일치하는 변수를 가진 함수를 받는다면 정상적으로 동작할 것이다.

```javascript
function addPointsToScore(player, points) {
  player.score += points;
}
```

함수는 score 변수를 가진 어떠한 객체에도 적용될 수 있을 것이다. typeScript는 어떻게 변환하는 것일까? 이것은 매우 간단하다. 당신은 object 유형을 정의하면 된다.

```javascript
function addPointsToScore(player: { score: number; }, points: number): void {
  player.score += points;
}
```

해당 코드는 number 유형의 score 변수를 가진 파라미터여야 한다는 것을 의미한다. 당신은 이것을 interface로 정의 한것이다.

```javascript
interface HasScore {
  score: number;
}
   function addPointsToScore(player: HasScore, points: number): void {
   player.score += points;
   }
```

## Optional arguments

또 Javascript의 다른 대안은 파라미터가 선택적이라는 것이다.  
당신은 파라미터를 누락시킬수 있고 그것들은 'undefined'로 정의될 것이다. 그러나 당신이 유형이 정해진 파라미터로 정의했다면 컴파일러는 당신이 파라미터를 누락했다는 것을 표기할 것이다.

```javascript
addPointsToScore(player); // error TS2346
// Supplied parameters do not match any signature of call target.
```

파라미터가 선택적이라는 것을 보여주기 위해 당신은 파라미터 뒤에 '?' 를 붙여주어야 한다. 여기 points 라는 파라미터가 있다.

```javascript
function addPointsToScore(player: HasScore, points?: number): void {
  points = points || 0;
  player.score += points;
}
```

## Functions as property

당신은 변수 대신에 특정한 함수를 가져야만 하는 파라미터를 기술하는것에 흥미를 가질 것이다.

```javascript
function startRunning(pony) {
  pony.run(10);
}
```

interface 선언은 이렇게 될 것이다.

```javascript
interface CanRun {
  run(meters: number): void;
}
   function startRunning(pony: CanRun): void {
      pony.run(10);
   }
   const pony = {
      run: (meters) => logger.log(`pony runs ${meters}m`)
   };
   startRunning(pony);
```

## Classes

클래스는 interface를 구현할 수 있다. Pony 클래스는 우리가 작성한대로 동작하여야 한다.

```javascript
class Pony implements CanRun {
  run(meters) {
   logger.log(`pony runs ${meters}m`);
  }
}
```

컴파일러는 해당 클래스에 num 이라는 함수를 강제로 구현할 것이다. 만약 우리가 안 좋게 구현하기 위해 number 대신에 string을 사용하였다면 컴파일러는 에러를 나타낼 것이다.

```javascript
class IllegalPony implements CanRun {
  run(meters: string) {
   console.log(`pony runs ${meters}m`);
  }
}
// error TS2420: Class 'IllegalPony' incorrectly implements interface 'CanRun'.
// Types of property 'run' are incompatible.
```

만약 원한다면 이렇게도 구현할 수 있다.

```javascript
class HungryPony implements CanRun, CanEat {
  run(meters) {
   logger.log(`pony runs ${meters}m`);
  }
  eat() {
   logger.log(`pony eats`);
  }
}
```

interface는 또다른 interface를 확장할 수 있다.

```javascript
interface Animal extends CanRun, CanEat {}
class Pony implements Animal {
  // ...
}
```

당신이 TypeScript에서 클래스를 정의 하려고 한다면 당신은 클래스에 함수와 변수를 가질수 있다. 당신은 이것이 TypeScript에서만 허용하는 것이지, ES6 표준이 아닌것을 인지해야 할 지도 모른다.

```javascript
class SpeedyPony {
  speed: number = 10;
  run() {
   logger.log(`pony runs at ${this.speed}m/s`);
  }
}
```

모든것은 기본적으로 public으로 설정되어 있지만 당신은 private을 사용하여 함수나 변수를 숨길 수 있다. 만약 당신이 생성자 파라미터에 private또는 public을 추가한다면 이것은 private , public 변수를 초기에 생성될 수 있도록 하는 요약이다.

```javascript
class NamedPony {
  constructor(public name: string, private speed: number) {
  }
  run() {
   logger.log(`pony runs at ${this.speed}m/s`);
  }
}
   const pony = new NamedPony('Rainbow Dash', 10);
   // defines a public property name with 'Rainbow Dash'
   // and a private one speed with 10
```

더 자세한 정보로 표현할 수 있다.

```javascript
class NamedPonyWithoutShortcut {
  public name: string;
  private speed: number;
  constructor(name: string, speed: number) {
   this.name = name;
   this.speed = speed;
  }
  run() {
   logger.log(`pony runs at ${this.speed}m/s`);
  }
}
```

## Working with other libraries

JS로 작성된 외부 라이브러리로 작업 할 대, 그 라이브러리에서 어떤 유형의 파라미터가 예상되는지 알지 못하기 때문에 우리는 운명으로 생각할지 모른다. TypeScript의 강점중 하나입니다. 해당 멤버는 일반적인 자바 스크립트 라이브러리에 의해 노출 된 유형과 함수를 위한 인터페이스를 정의하였다.

인터페이스가 포함된 파일에는 특별한 확장자\(".d.ts"\)가 있다. 그들은 라이브러리의 함수의 리스트를 포함한다. 이 파일을 찾는 좋은 장소는 DefinitelyTyped 이다. 예를 들어, 만약 당신이 Angularjs 1 버젼의 프로젝트에서 ts 파일을 사용하였다면 당신은 npm을 사용하여 적절한 파일을 다운 받을 수 있다.

```javascript
npm install --save-dev @types/angular
```

또는 수동으로 다운받을 수 있다. 그러면 해당 파일은 당신의 코드 상단에 포함될 것이고, 컴파일 체크를 할 수 있을 것이다.

```javascript
/// <reference path="angular.d.ts" />
angular.module(10, []); // the module name should be a string
// so when I compile, I get:
// Argument of type 'number' is not assignable to parameter of type 'string'.
```

"reference path="angular.d.ts" 는 TS에 의해 특별하게 선언된 주석으로 컴파일러에게 인터페이스 angular.d.ts를 찾으라는 것을 의미한다. 이제 당신이 AngularJS 함수를 잘못 사용하였다면 동적으로 실행될 필요 없이 컴파일러는 알려줄 것이고 당신은 해당 영역을 고칠수 있다. 컴파일러는 node\_modules 폴더에 종속물로 패키지 되어 있을 경우에는 인터페이스를 자동으로 발견할수 있다. 점점 더 많은 프로젝트 들이 해당 방식을 채택하고 있으며 Angular 2 또한 그렇다. 그래서 당신의 프로젝트에 인터페이스를 포함하는것에 대해서 걱정할 필요가 없다. 당신이 NPM을 사용하여 의존성을 유지한다면 TS 컴파일러는 자동으로 확인할 것이다.

## Decorators

이것은 새로운 특징이며 Angularjs를 지원하기 위해 오직 TypeScript 1.5 에 추가되었다. 게다가 곧 알수 있듯이 Angular 2 Componenet는 Decorator를 사용하여 설명될 수 있다. 이것은 모든 언어에서 가지고 있지 않기 때문에, decorator에 대해서 들어보지 않았을 수도 있다. decorator는 메타 프로그래밍을 할수 있는 방법이라 할 수 있다. 그들은 java, c\#, python 또는 내가 알지 못하는 언어에서 주로 사용되어지는 선언과 같은 것과 매우 유사할 것이다. 언어에 따라서 당신은 속성, 함수, 변수를 추가할수 있다. 일반적으로 선언은 언어에 의해 사용되어지지 않고 프레임워크나 라이브러리에서 주로 사용된어 진다.  
  


Decorator는 매우 강력하다. 그들은 메소드, 클래스 등을 수정할 수 있으며 예를 들어 호출의 파라미터를 변경하고, 결과를 간섭할 수 있으며, 대상이 호출 될 때 다른 메소드를 호출하더나 프레임 워크에 대한 메타 데이터를 추가 할 수 있습니다. 지금까지도 자바스크립트에서는 몇몇은 가능하지 않는다. 그러나 언어는 진화하고 있고 향후에는 표준화 시키자는 공식 제안이 있습니다. TypeScript 구현은 제안 된 표준 보다 약간 더 가깝다.   
  


Angular2에서는 프레임워크에 의해 제공하는 decorator를 사용할 것이다. decorator의 역활은 매우 간단하다. decorator는 우리의 클래스에 약간의 메타 데이터를 추가한다. " 해당 클래스는 컴포넌트이다.", "이것은 선택적인 의존이다." "이것은 커스터마이징된 속성이다." 당신이 메타데이터를 수정으로 넣는다면 decorator를 사용하라고 요구 하지 않는다.  
  


TypeScript에서는 decorator는 @로 시작한다. 그리고 클래스에 적용할수 있고 변수 또는 함수 또는 파라미터에도 적용할 수 있다. decorator는 생성자에는 적용될수 없으나 생성자의 파라미터에는 적용될 수 있다.

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

당신이 decorator에 적용하길 원하는 것에 따라서, 함수는 매번 같은 파라미터를 갖지 않을 것이다. 해당 함수 decorator는 세가지 파라미터를 가진다.

* target : decorator의 의해 목표로 하는 함수
* name : targeted 함수의 이름
* descriptor : targeted된 함수의 설명

우리는 함수 이름을, 그러나 당신은 당신이 원하는 어떤 것이든 할수 있다.   
  
 그래서 간단한 예를 들어, getRace\(\) 또는 getRaces\(\) 함수는 매 번 호출한다. 우리는 브라우져 로그에서 추적되는 것을 확인할 수 있다.

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

@Component decorator는 Home 클래스에 추가되었다. Angular2 가 로드되었을 때, 그것은 Home 클래스를 확인할 것이고 component라는 것으로 이해할 것이다. 보시다시피, decorator는 파라미터를 받을 수 있다.   
  


나는 decorator의 가공되지 않은 개념을 소개하길 원한다. 우리는 모든 decorator를 책 전체에서 살펴볼 것이다. TypeScript 대신에 Babel과 함께 사용할 수 있다는 점을 지적해야 한다. 모든 Angular 2 decorator를 지원하는 플러그인도 있다. : angular2-annotations  


Babel은 클래스 속성도 지원하지만 TypeScript에서 제공하는 유형 시스템은 지원하지 않는다. 당신은 Babel을 사용할수 있고 "ES6+"로 작성하여라. 그러나 당신은 유형들을 사용할수 없을것이고 그들은 의존성 주입에 매우 유용하게 사용될 것이다. 예를 들면, 완전히 가능하지만 유형을 대체하기 위해 더 많은 decorator를 추가해야 한다.

그래서 나의 조언은 TypeScript 시도하라는 것이다. 그것으로 부터 나온 나의 모든 경험은 사용할 수 있다. 당신이 나머지에 대한 것을 잊고 융용한곳에 사용할수 있다면 이것은 방해되지 않는다. 만약 당신이 싫다면, decorator는 Babel또는 Traceur 를 사용한 ES6 또는 심지어 ES5로 전환하는 것이 그리 어렵지 않을 것이다. \(솔직히 ES5로는 angular 2 앱이 안좋은 코드를 가지고 있다.\)

## Reference URL

* [Become a NINJA with Angular 2](https://books.ninja-squad.com/public/samples/Become_a_ninja_with_Angular2_sample.pdf)
* [Learn Angular 2](http://learnangular2.com/)
* [Angular 2 Component](https://www.tutorialspoint.com/angular2/)
* [An Introduction to Angular 2](http://angular-tips.com/blog/2015/05/an-introduction-to-angular-2/)

