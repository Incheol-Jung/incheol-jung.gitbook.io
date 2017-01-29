---
layout: post
title:  "Hierarchical injectors"
date:   2017-01-21 00:00:00
categories: DenpendencyInjection
comments: true
---

Angular 2에서 마지막으로 알아야 할 중요한 점은 앱에 여러 개의 인젝터가 있다는 것이다. 실제로 구성 요소마다 하나의 인젝터가 있으며이 인젝터는 해당 인젝터를 상속받는다.<br/>
다음과 같은 앱이 있다고 가정 해 보자.<br/>

우리는 자식 구성 요소 인 RacesComponent를 가진 루트 컴포넌트 PonyRacerAppComponent를 가진 모듈 AppModule을 가지고 있습니다.<br/>
앱을 부트 스트랩하면 모듈의 루트 인젝터가 생성된다. 그런 다음 모든 구성 요소가 자체 인젝터를 만들어 부모를 상속한다.<br/>

즉, 구성 요소에 종속성을 선언하면 Angular 2는 현재 인젝터에서 검색을 시작한다. 
의존성을 발견하면 완벽하게 반환한다. 그렇지 않은 경우, 부모 인젝터에서 동일한 작업을 수행하고 종속성을 찾을 때까지 다시 수행한다. 
그것은 그렇지 않다. 예외를 던질 것이다.<br/><br/>

즉, 구성 요소에 종속성을 선언하면 Angular 2는 현재 인젝터에서 검색을 시작한다. 의존성을 발견하면 완벽하게 반환하지만 
그렇지 않은 경우, 부모 인젝터에서 동일한 작업을 수행하고 종속성을 찾을 때까지 수행하고 예외를 던질 것이다.<br/><br/>

이것에서 우리는 두 가지를 추론 할 수 있다 : <br/>
• 루트 인젝터에서 선언 된 종속성은 응용 프로그램의 모든 구성 요소에서 사용할 수 있다. 예를 들어 ApiService 및 RaceServicec는 어디에서나 사용할 수 있다. <br/>
• 모듈과 다른 수준에서 종속성을 선언 할 수 있다. 어떻게 해야할까? <br/>

@Component 데코레이터는 provider 라고 하는 또 다른 구성 옵션을 사용할 수 있다. 
이 provider 속성은 @NgModule의 providers 속성에 대해 수행 한 것처럼 종속성 목록이있는 배열을 사용할 수 있다.<br/>

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

이 구성 요소에서 RaceService 토큰을 가진 공급자는 루트 인젝터에 정의 된 것과 같은 FakeRaceService 인스턴스를 항상 제공한다. 
특정 구성 요소에 대해 다른 서비스 인스턴스를 원하거나 필요한 모든 것을 선언하는 완벽하게 캡슐화 된 구성 요소를 원할 경우에 매우 유용하다.<br/><br/>

** 경고!! 앱의 모듈과 구성 요소의 공급자 속성에 종속성을 선언하면 이 종속성의 두 인스턴스가 생성되어 사용된다.<br/>

일반적으로 한 구성 요소 만 서비스에 접근 해야하는 경우 provider 속성을 사용하여 구성 요소의 인젝터 에서 이 서비스를 제공하는 것이 좋다. 
앱 전체에서 종속성을 사용할 수 있으면 루트 모듈에 선언하여라.