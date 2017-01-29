---
layout: post
title:  "Easy to Configure"
date:   2017-01-21 00:00:00
categories: DenpendencyInjection
comments: true
---

다음 장에서 종속성 주입으로 인한 테스트 가능성 이점으로 들아가 겠지만 구성 문제를 살펴볼 수 있다. 여기서 우리는 존재하지 않는 백엔드를 호출하려고 한다. 
어쩌면 백엔드 팀이 아직 준비가되지 않았거나 나중에하고 싶을 수도 있다. 어쨌든 우리는 가짜 데이터를 사용하고 싶다.

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

인젝터는 토큰 (RaceService 유형)과 RaceService 클래스 사이에 연결 해 주는 것이다.  
Injector는 레지스트리를 유지 관리하여 주입 가능한 구성 요소를 추적하고 필요할 때 실제로 주입하는 서비스이다. 
레지스트리는 토큰이라고하는 키를 클래스와 연관시키는 맵이다. 토큰은 많은 의존성 삽입 프레임 워크와 달리 반드시 문자열을 알 필요는 없다. 
예를 들어 Type 참조와 같은 요소가 될 수 있고 그것은 보통 경우 이다.<br/>

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

토큰은 종속성을 고유하게 식별해야한다. 
이 주사기는 bootstrapModule promise에 의해 반환되므로 우리는 그걸 가지고 놀 수 있다.

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

보시다시피 get 메소드와 토큰을 사용하여 인젝터에 의존성을 요청할 수 있다. 
두 가지 다른 토큰을 사용하여 RaceService를 두 번 선언 했으므로 두 가지 공급자가 있다. 
인젝터는 처음으로 특정 토큰을 요청 받았을 때 RaceService의 인스턴스를 만든 다음 매번이 토큰에 대해 동일한 인스턴스를 반환한다. 
각 공급자마다 동일한 작업을 수행하므로 여기서는 실제로 앱에 두 개의 RaceService 인스턴스가 있고 각 토큰에 하나씩 있다.<br/><br/>

그러나 토큰을 자주 사용하지 않거나 전혀 사용하지 않을 것이다. 
TypeScript에서는 형식을 사용하여 작업을 완료하므로 토큰은 Type 참조이며 대개 해당 클래스에 바인딩된다. 
다른 토큰을 사용하려면 @Inject () 데코레이터를 사용해야한다. 
자세한 내용은 이 장의 마지막 부분을 참조하라.<br/><br/>

이 전체 예제는 몇 가지 사항을 지적하기위한 것이다.<br/>
• 공급자가 토큰을 서비스에 연결한다.<br/>
• 인젝터는 동일한 토큰을 묻는 때마다 동일한 인스턴스를 반환한다.<br/>
• 클래스 이름과 다른 토큰 이름을 가질 수 있다.<br/><br/>

반환 된 인스턴스가 첫 번째 호출에서 생성 된 다음 항상 동일하게 잘 알려진 디자인 패턴이기도 하다.
이 인스턴스를 싱글 톤이라고 한다. 
이는 서비스를 사용하여 구성 요소간에 정보를 공유 할 수 있으므로 실제로 유용하고 동일한 서비스 인스턴스를 공유하게 된다.<br/><br/>

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

앱을 다시 시작하면 이번에 한 번 경주가 있을 것이다. 왜냐하면 우리 앱이 첫 번째 경품 대신 위조 된 서비스를 사용하기 때문이다.<br/>
이는 앱을 수동으로 테스트 할 때 또는 자동 테스트를 작성할 때 곧 보게 될 것이다.