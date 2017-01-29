---
layout: post
title:  "Other types of provider"
date:   2017-01-21 00:00:00
categories: DenpendencyInjection
comments: true
---

우리의 예제 에서는 우리가 앱을 개발할 때 FakeRaceServic를 사용하고 실제 RaceServic을 사용할 때 생산 중에 있다. 
물론 수동으로 변경할 수도 있지만 다른 유형의 공급자를 사용할 수도 있다.: useFactory

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

이 예제에서는 useClass 대신에 useFactory를 사용한다. 
팩토리는 하나의 작업으로 인스턴스를 만드는 함수이다. 이 예제는 상수를 테스트하고 가짜 서비스 또는 실제 서비스를 반환한다.<br/>

그러나 RaceService를 생성하기 위해 새로운 서비스를 사용하면서 실제 서비스로 다시 전환하면 ApiService 종속성이 인스턴스화되지 않는다. <br/>
이 예제를 작동 시키려면 ApiService 인스턴스를 생성자 호출에 전달해야 한다. 좋은 소식 : useFactory는 deps라는 다른 속성과 함께 사용할 수 있다. <br/>
deps에서는 종속 배열을 지정할 수 있습니다. <br/>

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

** 몇 가지 종속성이 있는 경우 매개 변수의 순서가 배열의 순서와 동일해야 한다. <br/>
물론,이 예제는 useFactory와 그 의존성의 사용법을 보여주기위한 것이다. 너는 쓸 수 있고,해야한다.

```javascript
// in our module
providers: [
  ApiService,
  { provide: RaceService, useClass: IS_PROD ? RaceService : FakeRaceService }
]
```

IS_PROD에 대한 상수 선언은 번거로운 작업이다. 아마도 우리는 의존성 주입도 사용할 수 있지 않을까? 나는 당신이 볼 수있는 것들을 조금 의견을 주고 있다 :) 
당신은 반드시 DI에서 모든 것을 강제 할 필요는 없지만 이것은 다른 공급자 유형을 보여주기위한 것이다 : useValue

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

