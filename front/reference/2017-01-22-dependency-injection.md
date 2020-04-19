---
layout: reference
title: CHAPTER 6. Dependency injection
date: '2017-01-22T00:00:00.000Z'
updated: '2017-01-22T00:00:00.000Z'
categories: reference
summary: Dependency injection
navigation_weight: 6
---

# CHAPTER 6. Dependency injection

## DI yourself

의존성 주입은 잘 알려진 디자인 패턴이다. 우리 애플리케이션의 구성 요소를 살펴 보도록 하자. 이 구성 요소는 앱의 다른 부분에서 제공하는 일부 기능을 필요로 할 수 있다. \(서비스 라고 부르도록 하자\). 그것이 우리가 종속성이라고 부르는 것이다. 구성 요소가 종속성을 만들도록하는 대신, 프레임 워크는이를 작성하여 구성 요소에 제공합니다. 이를 "제어 반전 \(inversion of control\)"이라고 한다.  
  


여기에는 몇 가지 흥미로운 기능이 있다.   
 • 그것은 우리가 원하는 것을 말하고 원하는 곳을 말함으로써 쉽게 개발할 수 있다.   
 • 의존성을 모의 객체로 대체하여 쉽게 테스트 할 수 있다.   
 • 구현을 바꾸면 쉽게 구성 할 수 있다.   


이것은 서버 측에서 광범위하게 사용되는 개념이지만 AngularJS 1.x는 프론트 엔드 측에서 처음으로 사용하는 개념 중 하나이다.

## Easy to develop

의존성 삽입을 사용하려면 몇 가지가 필요하다.  
 • 종속성을 등록하여 다른 구성 요소 / 서비스에 주입 할 수있게하는 방법   
 • 현재 구성 요소 / 서비스에서 어떤 종속성이 필요한지 선언하는 방법   
  


프레임 워크는 나머지 작업을 수행한다. 우리가 컴포넌트에 의존성을 선언 할 때, 레지스트리를 찾을 수 있다면 레지스트리를 조사 할 것이고, 의존성의 인스턴스를 얻거나, 의존성의 인스턴스를 생성 할 것이며 실제로 컴포넌트에 의존성이 주입 될 것이다.  


의존성은 Angular가 제공하는 서비스이거나 우리가 스스로 작성한 서비스 일 수 있습니다.  


이미 동료 중 한 명이 작성한 ApiServiceservice를 예로 들어 보자. 그는 게으른 친구이기 때문에 빈 배열을 반환하는 get 메서드를 생성만 하였다. 해당 서비스가 백엔드 API와 통신하는 데 사용되는 것으로 이미 추측 할 수 있다.

```javascript
export class ApiService {
  get(path) {
   // todo: call the backend API
  }
}
```

TypeScript를 사용하면 구성 요소 나 서비스에 대한 종속성을 선언하기 쉽다.   
 ApiService를 사용하는 RaceService를 작성하려고한다고 가정 해 보자.   


```javascript
import { ApiService } from './api.service';
export class RaceService {
  constructor(private apiService: ApiService) {
  }
}
```

Angular는 ApiService 서비스를 가져 와서 생성자에 삽입되고 RaceService가 필요할 때 생성자가 호출되고 ApiService 필드가 ApiService 서비스를 참조하게된다. 이제 ApiService 서비스를 사용하여 백엔드에 호출 할 메소드 목록 \(\)을 서비스에 추가 할 수 있다.

```javascript
import { ApiService } from './api.service';
export class RaceService {
  constructor(private apiService: ApiService) {
  }
  list() {
   return this.apiService.get('/races');
  }
}
```

Angular 2 에서는 서비스 자체에 의존성이 있음을 알리려면 클래스 데코레이터\('@Injectable\(\)'\)를 추가해야 한다.

```javascript
import { Injectable } from '@angular/core';
import { ApiService } from './api.service';
@Injectable()
export class RaceService {
  constructor(private apiService: ApiService) {
  }
  list() {
   return this.apiService.get('/races');
  }
}
```

이것을 하기 위한 쉬운 방법은 앞에서 본 @NgModule 데코레이터의 providers 속성을 사용하는 것이다.

```javascript
import { NgModule } from '@angular/core';
import { BrowserModule }  from '@angular/platform-browser';
import { PonyRacerAppComponent } from './app.component';
import { ApiService } from './services/api.service';
@NgModule({
  imports: [BrowserModule],
  declarations: [PonyRacerAppComponent],
  providers: [
   ApiService
  ],
  bootstrap: [PonyRacerAppComponent]
})
export class AppModule {
}
```

이제 ReceService 를 다른 서비스 나 구성 요소에 주입 할 수있게하려면 등록해야한다.

```javascript
import { NgModule } from '@angular/core';
import { BrowserModule }  from '@angular/platform-browser';
import { PonyRacerAppComponent } from './app.component';
import { RaceService } from './services/race.service';
import { ApiService } from './services/api.service';
@NgModule({
  imports: [BrowserModule],
  declarations: [PonyRacerAppComponent],
  providers: [
   RaceService,
   ApiService
  ],
  bootstrap: [PonyRacerAppComponent]
})
export class AppModule {
}
```

우리는 우리가 원할 때마다 새로운 서비스를 사용할 수 있다. PonyRacerAppComponent 구성 요소에서 테스트 해 보도록 하자.

```javascript
import { Component } from '@angular/core';
import { RaceService } from './services/race.service';
@Component({
  selector: 'ponyracer-app',
  template: `<h1>PonyRacer</h1>
   <p>{{list()}}</p>`
})
export class PonyRacerAppComponent {
  // add a constructor with RaceService
  constructor(private raceService: RaceService) {
  }
  list() {
   return this.raceService.list();
  }
}
```

우리의 게으른 동료가 ApiService의 get 메소드에서 빈 배열을 반환 했으므로 list \(\) 메서드를 호출하려고하면 아무 것도 얻을 수 없다.

## Easy to Configure

다음 장에서 종속성 주입으로 인한 테스트 가능성 이점으로 들아가 겠지만 구성 문제를 살펴볼 수 있다. 여기서 우리는 존재하지 않는 백엔드를 호출하려고 한다. 어쩌면 백엔드 팀이 아직 준비가되지 않았거나 나중에하고 싶을 수도 있다. 어쨌든 우리는 가짜 데이터를 사용하고 싶다.

```javascript
import { NgModule } from '@angular/core';
import { BrowserModule }  from '@angular/platform-browser';
import { PonyRacerAppComponent } from './app.component';
import { RaceService } from './services/race.service';
import { ApiService } from './services/api.service';
@NgModule({
  imports: [BrowserModule],
  declarations: [PonyRacerAppComponent],
  providers: [
   RaceService,
   ApiService
  ],
  bootstrap: [PonyRacerAppComponent]
})
export class AppModule {
}
```

```javascript
import { NgModule } from '@angular/core';
import { BrowserModule }  from '@angular/platform-browser';
import { PonyRacerAppComponent } from './app.component';
import { RaceService } from './services/race.service';
import { ApiService } from './services/api.service';
@NgModule({
  imports: [BrowserModule],
  declarations: [PonyRacerAppComponent],
  bootstrap: [PonyRacerAppComponent],
  providers: [
   { provide: RaceService, useClass: RaceService },
   { provide: ApiService, useClass: ApiService }
  ]
})
export class AppModule {
}
```

인젝터는 토큰 \(RaceService 유형\)과 RaceService 클래스 사이에 연결 해 주는 것이다.  
Injector는 레지스트리를 유지 관리하여 주입 가능한 구성 요소를 추적하고 필요할 때 실제로 주입하는 서비스이다. 레지스트리는 토큰이라고하는 키를 클래스와 연관시키는 맵이다. 토큰은 많은 의존성 삽입 프레임 워크와 달리 반드시 문자열을 알 필요는 없다. 예를 들어 Type 참조와 같은 요소가 될 수 있고 그것은 보통 경우 이다.  


이 예에서는 토큰과 삽입 할 클래스가 같으므로 같은 양식을 더 짧은 형식으로 쓸 수 있다.

```javascript
import { NgModule } from '@angular/core';
import { BrowserModule }  from '@angular/platform-browser';
import { PonyRacerAppComponent } from './app.component';
import { RaceService } from './services/race.service';
import { ApiService } from './services/api.service';
@NgModule({
  imports: [BrowserModule],
  declarations: [PonyRacerAppComponent],
  providers: [
   RaceService,
   ApiService
  ],
  bootstrap: [PonyRacerAppComponent]
})
export class AppModule {
}
```

토큰은 종속성을 고유하게 식별해야한다. 이 주사기는 bootstrapModule promise에 의해 반환되므로 우리는 그걸 가지고 놀 수 있다.

```javascript
// in our module
providers: [
  ApiService,
  { provide: RaceService, useClass: RaceService },
  // let's add another provider to the same class
  // with another token
  { provide: 'RaceServiceToken', useClass: RaceService }
]
// let's bootstrap the module
platformBrowserDynamic().bootstrapModule(AppModule)
.then(
  // and play with the returned injector
  appRef => playWithInjector(appRef.injector)
);
```

```javascript
function playWithInjector(inj) {
  console.log(inj.get(RaceService));
  // logs "RaceService {apiService: ApiService}"
  console.log(inj.get('RaceServiceToken'));
  // logs "RaceService {apiService: ApiService}" again
  console.log(inj.get(RaceService) === inj.get(RaceService));
  // logs "true", as the same instance is returned every time for a token
  console.log(inj.get(RaceService) === inj.get('RaceServiceToken'));
  // logs "false", as the providers are different,
  // so there are two distinct instances
}
```

보시다시피 get 메소드와 토큰을 사용하여 인젝터에 의존성을 요청할 수 있다. 두 가지 다른 토큰을 사용하여 RaceService를 두 번 선언 했으므로 두 가지 공급자가 있다. 인젝터는 처음으로 특정 토큰을 요청 받았을 때 RaceService의 인스턴스를 만든 다음 매번이 토큰에 대해 동일한 인스턴스를 반환한다. 각 공급자마다 동일한 작업을 수행하므로 여기서는 실제로 앱에 두 개의 RaceService 인스턴스가 있고 각 토큰에 하나씩 있다.  
  


그러나 토큰을 자주 사용하지 않거나 전혀 사용하지 않을 것이다. TypeScript에서는 형식을 사용하여 작업을 완료하므로 토큰은 Type 참조이며 대개 해당 클래스에 바인딩된다. 다른 토큰을 사용하려면 @Inject \(\) 데코레이터를 사용해야한다. 자세한 내용은 이 장의 마지막 부분을 참조하라.  
  


이 전체 예제는 몇 가지 사항을 지적하기위한 것이다.  
 • 공급자가 토큰을 서비스에 연결한다.  
 • 인젝터는 동일한 토큰을 묻는 때마다 동일한 인스턴스를 반환한다.  
 • 클래스 이름과 다른 토큰 이름을 가질 수 있다.  
  


반환 된 인스턴스가 첫 번째 호출에서 생성 된 다음 항상 동일하게 잘 알려진 디자인 패턴이기도 하다. 이 인스턴스를 싱글 톤이라고 한다. 이는 서비스를 사용하여 구성 요소간에 정보를 공유 할 수 있으므로 실제로 유용하고 동일한 서비스 인스턴스를 공유하게 된다.  
  


이제 가짜 RaceService 문제로 돌아가서 RaceService와 동일한 작업을 하지만 하드 코드 된 데이터를 반환하는 새로운 클래스를 작성할 수 있다.

```javascript
class FakeRaceService {
  list() {
   return [{ name: 'London' }];
  }
}
```

우리는 공급자 선언을 사용하여 RaceService를 FakeRaceService로 대체 할 수 있다.

```javascript
// in our module
providers: [
  // we provide a fake service
  { provide: RaceService, useClass: FakeRaceService }
]
```

앱을 다시 시작하면 이번에 한 번 경주가 있을 것이다. 왜냐하면 우리 앱이 첫 번째 경품 대신 위조 된 서비스를 사용하기 때문이다.  
 이는 앱을 수동으로 테스트 할 때 또는 자동 테스트를 작성할 때 곧 보게 될 것이다.

## Other types of provider

우리의 예제 에서는 우리가 앱을 개발할 때 FakeRaceServic를 사용하고 실제 RaceServic을 사용할 때 생산 중에 있다. 물론 수동으로 변경할 수도 있지만 다른 유형의 공급자를 사용할 수도 있다.: useFactory

```javascript
// we just have to change this constant when going to prod
const IS_PROD = false;
  // in our module
  providers: [
   // we provide a factory
   {
   provide: RaceService,
   useFactory: () => IS_PROD ? new RaceService(null) : new FakeRaceService()
   }
  ]
```

이 예제에서는 useClass 대신에 useFactory를 사용한다. 팩토리는 하나의 작업으로 인스턴스를 만드는 함수이다. 이 예제는 상수를 테스트하고 가짜 서비스 또는 실제 서비스를 반환한다.  


그러나 RaceService를 생성하기 위해 새로운 서비스를 사용하면서 실제 서비스로 다시 전환하면 ApiService 종속성이 인스턴스화되지 않는다.   
 이 예제를 작동 시키려면 ApiService 인스턴스를 생성자 호출에 전달해야 한다. 좋은 소식 : useFactory는 deps라는 다른 속성과 함께 사용할 수 있다.   
 deps에서는 종속 배열을 지정할 수 있습니다.   


```javascript
// we just have to change this constant when going to prod
const IS_PROD = true;
  // in our module
  providers: [
   ApiService,
   // we provide a factory
   {
   provide: RaceService,
   // the apiService instance will be injected in the factory
   // so we can pass it to RaceService
   useFactory: apiService => IS_PROD ? new RaceService(apiService) : new
FakeRaceService(),
   deps: [ApiService]
   }
  ]
```

\*\* 몇 가지 종속성이 있는 경우 매개 변수의 순서가 배열의 순서와 동일해야 한다.   
 물론,이 예제는 useFactory와 그 의존성의 사용법을 보여주기위한 것이다. 너는 쓸 수 있고,해야한다.

```javascript
// in our module
providers: [
  ApiService,
  { provide: RaceService, useClass: IS_PROD ? RaceService : FakeRaceService }
]
```

IS\_PROD에 대한 상수 선언은 번거로운 작업이다. 아마도 우리는 의존성 주입도 사용할 수 있지 않을까? 나는 당신이 볼 수있는 것들을 조금 의견을 주고 있다 :\) 당신은 반드시 DI에서 모든 것을 강제 할 필요는 없지만 이것은 다른 공급자 유형을 보여주기위한 것이다 : useValue

```javascript
// in our module
providers: [
  ApiService,
  // we provide a factory
  { provide: 'IS_PROD', useValue: true },
  {
   provide: RaceService,
   useFactory: (IS_PROD, apiService) => IS_PROD ? new RaceService(apiService) : new
FakeRaceService(),
   deps: ['IS_PROD', ApiService]
  }
]
```

## Hierarchical injectors

Angular 2에서 마지막으로 알아야 할 중요한 점은 앱에 여러 개의 인젝터가 있다는 것이다. 실제로 구성 요소마다 하나의 인젝터가 있으며이 인젝터는 해당 인젝터를 상속받는다.  
 다음과 같은 앱이 있다고 가정 해 보자.  


우리는 자식 구성 요소 인 RacesComponent를 가진 루트 컴포넌트 PonyRacerAppComponent를 가진 모듈 AppModule을 가지고 있습니다.  
 앱을 부트 스트랩하면 모듈의 루트 인젝터가 생성된다. 그런 다음 모든 구성 요소가 자체 인젝터를 만들어 부모를 상속한다.  


즉, 구성 요소에 종속성을 선언하면 Angular 2는 현재 인젝터에서 검색을 시작한다. 의존성을 발견하면 완벽하게 반환한다. 그렇지 않은 경우, 부모 인젝터에서 동일한 작업을 수행하고 종속성을 찾을 때까지 다시 수행한다. 그것은 그렇지 않다. 예외를 던질 것이다.  
  


즉, 구성 요소에 종속성을 선언하면 Angular 2는 현재 인젝터에서 검색을 시작한다. 의존성을 발견하면 완벽하게 반환하지만 그렇지 않은 경우, 부모 인젝터에서 동일한 작업을 수행하고 종속성을 찾을 때까지 수행하고 예외를 던질 것이다.  
  


이것에서 우리는 두 가지를 추론 할 수 있다 :   
 • 루트 인젝터에서 선언 된 종속성은 응용 프로그램의 모든 구성 요소에서 사용할 수 있다. 예를 들어 ApiService 및 RaceServicec는 어디에서나 사용할 수 있다.   
 • 모듈과 다른 수준에서 종속성을 선언 할 수 있다. 어떻게 해야할까?   


@Component 데코레이터는 provider 라고 하는 또 다른 구성 옵션을 사용할 수 있다. 이 provider 속성은 @NgModule의 providers 속성에 대해 수행 한 것처럼 종속성 목록이있는 배열을 사용할 수 있다.  


자체 RaceService 공급자를 선언 할 RacesComponent를 상상할 수 있다.

```javascript
@Component({
  selector: 'ns-races',
  providers: [{ provide: RaceService, useClass: FakeRaceService }],
  template: `<strong>Races list: {{list()}}</strong>`
})
export class RacesComponent {
  constructor(private raceService: RaceService) {
  }
  list() {
   return this.raceService.list();
  }
}
```

이 구성 요소에서 RaceService 토큰을 가진 공급자는 루트 인젝터에 정의 된 것과 같은 FakeRaceService 인스턴스를 항상 제공한다. 특정 구성 요소에 대해 다른 서비스 인스턴스를 원하거나 필요한 모든 것을 선언하는 완벽하게 캡슐화 된 구성 요소를 원할 경우에 매우 유용하다.  
  


> 경고!! 앱의 모듈과 구성 요소의 공급자 속성에 종속성을 선언하면 이 종속성의 두 인스턴스가 생성되어 사용된다.

일반적으로 한 구성 요소 만 서비스에 접근 해야하는 경우 provider 속성을 사용하여 구성 요소의 인젝터 에서 이 서비스를 제공하는 것이 좋다. 앱 전체에서 종속성을 사용할 수 있으면 루트 모듈에 선언하여라.

## DI without types

토큰을 사용하고 TypeScript 유형에 의존하지 않으려는 경우 삽입 할 종속성마다 데코레이터를 추가해야 한다. 데코레이터는 @Inject \(\)이며 삽입 할 종속성의 토큰을 받는다. 다음과 같이 ApiService 서비스를 사용하기 위해 동일한 RaceService를 작성할 수 있다.

```javascript
import { Injectable, Inject } from '@angular/core';
import { ApiService } from './api.service';
@Injectable()
export class RaceService {
  constructor(@Inject(ApiService) apiService) {
   this.apiService = apiService;
  }
  list() {
   return this.apiService.get('/races');
  }
}
```

> TypeScript 없이 예제에서 데코레이터를 작동 시키려면 babel을 decorator와 함께 사용해야하고 angle2-annotations 플러그인을 사용해야 한다.

## Reference URL

* [Become a NINJA with Angular 2](https://books.ninja-squad.com/public/samples/Become_a_ninja_with_Angular2_sample.pdf)
* [Learn Angular 2](http://learnangular2.com/)
* [Angular 2 Component](https://www.tutorialspoint.com/angular2/)
* [An Introduction to Angular 2](http://angular-tips.com/blog/2015/05/an-introduction-to-angular-2/)

