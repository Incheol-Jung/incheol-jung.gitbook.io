---
layout:     reference
title:      Services
date:       2017-01-22 00:00:00
updated:    2017-01-22 00:00:00
categories: reference
summary:    Services
---


## The problem with troubleshooting is that trouble shoots back

나는 자동 테스트를 권장 한다. IDE에서 녹색으로 테스트 진행률 표시 줄을 중심으로 자신의 일을 제대로 하기 위해 내가 뒤에 찌르고 있다. 
그리고 우리가 코드를 작성할 때 유일한 안전망이기 때문에 테스트도 조심해서 해야 한다. 코드를 수동으로 테스트하는 것보다 복잡하지 않는다.<br/>

Angular 2는 테스트를 쉽게 작성할 수 있도록 도와준다. 
그래서 AngularJS 1.x도 부분적으로 내가 그것을 사용하는 것을 좋아했다. AngularJS 1.x와 마찬가지로 두 가지 유형의 테스트를 작성할 수 있다.<br/>
• unit tests<br/>
• end-to-end tests<br/>

첫 번째는 코드의 작은 단위 (컴포넌트, 서비스, 파이프 등)를 주장하기 위해 독립적으로, 즉 종속 관계를 고려하지 않고 제대로 동작한다. 
이러한 단위 테스트를 작성, 구성 요소 / 서비스 / 파이프의 각 메소드를 실행하고 그것이 우리가 입력 한 입력에 대한 예상대로 출력임을 확인해야 한다. 
또한 이 장치가 사용하는 종속성이 제대로 호출되고 있는지 확인 할 수 있다. 
예를 들어, 서비스가 올바른 HTTP 요청을 수행할지 여부를 확인할 수 있다.<br/>

end-to-end 테스트도 만들 수 있다. 그 목적은 실제 인스턴스를 시작하고 브라우저를 실행하고 입력 값을 입력하거나 버튼을 클릭하는 등 실제 사용자와 응용 프로그램 간의 상호 작용을 모방한다.  
렌더링 된 페이지가 예상대로 당신이 생각할 수있는 것이면 URL은 올바른 상태에 있는지 확인 하여라. <br/>


**************************************************************************************************


## Unit test

먼저 본대로, 단위 테스트는 코드의 작은 단위를 단독으로 체크 한다. 이 테스트에서는 의도 한대로 응용 프로그램의 작은 부분을 주장 할 수 밖에 없지만, 몇 가지 장점이 있다.<br/>

• 그들은 정말 빨리 당신은 몇 초에서 몇 백번을 실행시킬 수 있다.<br/>
• 실제 응용 프로그램에서 수동으로 테스트하기 어려운 특히 어려운 케이스 같은 모든 코드를 (거의) 테스트하는 것은 매우 효율적 이다.<br/>

단위 테스트의 핵심 개념 중 하나는 분리입니다. 우리의 테스트가 종속성에 의해 편향되는 것을 원하지 않습니다. 
그래서 우리는 대개 "mock"객체를 종속물로 사용합니다. 이들은 우리가 테스트 목적으로 만 만든 가짜 객체입니다.

이를 위해 우리는 몇 가지 도구에 의존 할 것이다. 먼저 테스트를 작성하는 라이브러리가 필요하다.
가장 인기 있는 것 (가장 인기가 없다면) 중 하나가 Jasmine이므로, 우리는 그것을 사용할 것이다!<br/>

- Jasmine and Karma<br/><br/>

Jasmine은 테스트를 선언 할 수있는 몇 가지 방법을 제공한다.<br/>

• describe()는 테스트 스위트 (테스트 그룹)를 선언한다.<br/>
• it()은 테스트를 선언한다.<br/>
• expect()는 주장을 선언한다.<br/>

Jasmine을 사용한 기본 JavaScript 테스트는 다음과 같다.<br/>

```javascript
class Pony {
  constructor(public name: string, public speed: number) {
  }
  isFasterThan(speed) {
   return this.speed > speed;
  }
}
describe('My first test suite', () => {
  it('should construct a Pony', () => {
   const pony = new Pony('Rainbow Dash', 10);
   expect(pony.name).toBe('Rainbow Dash');
   expect(pony.speed).not.toBe(1);
   expect(pony.isFasterThan(8)).toBe(true);
  });
});
```

expect() 호출은 toBe(), toBeLessThan(), toBeUndefined() 등의 많은 메소드로 연결될 수 있다. 
모든 메소드는 expect()에 의해 리턴 된 오브젝트의 not 속성으로 무효화 될 수 있다.<br/>

테스트 파일은 테스트 코드와는 다른 파일에서 일반적으로 .spec.ts 같은 확장자가 있다.
pony.ts 파일에 쓰여진 Pony 클래스의 테스트는 아마 pony.spec.ts라는 파일에 있다.
테스트는 테스트 파일 옆에 두는 것도 모든 테스트 전용 디렉토리에 둘 수 있다. 
나는 코드와 테스트를 같은 디렉토리에 두는 경향이 있지만, 어느 방식도 완전히 유효하다.<br/>

하나의 훌륭한 트릭은 describe() 대신 fdescribe()를 사용하면 이 테스트 만 실행될 것이다. (f는 시점을 나타낸다). 
하나의 테스트만을 실행하고 싶은 경우는 이와 같은 일을 한다 : it() 대신 fit()를 사용한다. 테스트를 배제하려면 스위트 xit() 또는 xdescribe()를 사용해라.<br/>

beforeEach () 메서드를 사용하여 각 테스트 전에 컨텍스트를 설정할 수도 있다. 
: 조명기. 동일한 조랑말에 대해 여러 테스트를 수행하면 모든 테스트에서 같은 것을 복사 / 붙여 넣기 하는 대신 조랑말을 초기화하는 beforeEach ()를 사용하는 것이 좋다.

```javascript
describe('Pony', () => {
  let pony: Pony;
  beforeEach(() => {
   pony = new Pony('Rainbow Dash', 10);
  });
  it('should have a name', () => {
   expect(pony.name).toBe('Rainbow Dash');
  });
  it('should have a speed', () => {
   expect(pony.speed).not.toBe(1);
   expect(pony.speed).toBeGreaterThan(9);
  });
});
```

afterEach 메서드도 있지만 기본적으로 사용하지 않는다.
마지막 트릭 하나 : Jasmine을 사용하면 가짜 오브젝트 (mock 또는 spy, 원하는대로)를 만들거나 실제 오브젝트의 메소드를 스파이로 만들 수 있다. 
그런 다음 메소드가 호출되었는지 확인하는 HaveBeenCalled ()와 toHaveBeenCalledWith ()를 사용하여 이러한 메소드에 대한 내용을 수행 할 수 있다.
스파이 메소드 호출에 대한 정확한 매개 변수를 검사한다. 메소드가 호출 된 횟수를 확인하거나 호출 된 적이 있는지 점검 할 수 있다.

```javascript
describe('My first test suite with spyOn', () => {
  let pony: Pony;
  beforeEach(() => {
   pony = new Pony('Rainbow Dash', 10);
   // define a spied method
   spyOn(pony, 'isFasterThan').and.returnValue(true);
  });
  it('should test if the Pony is fast', () => {
   const runPonyRun = pony.isFasterThan(60);
   expect(runPonyRun).toBe(true); // as the spied method always returns
   expect(pony.isFasterThan).toHaveBeenCalled();
   expect(pony.isFasterThan).toHaveBeenCalledWith(60);
  });
});
```

단위 테스트를 작성할 때는 작고 읽기 쉽도록 명심하고 처음에는 실패로 만드는 것을 잊지 말아라. 올바른 것을 테스트하고 있는지 확인 하여라.<br/>

다음 단계는 테스트를 실행하는 것이다. 따라서 Angular 팀은 Karma을 개발하였다. Karma의 목적은 하나 또는 여러 브라우저에서 테스트를 실행하는 것뿐이다. 
또한 파일을 모니터링하여 저장마다 테스트를 다시 수행 할 수 있다. 테스트 실행은 매우 빠르기 때문에 이를 실행 코드(대부분) 즉각적인 피드백을 붙이는 것은 정말 좋은 것이다.<br/>

나는 카르마를 설치하는 방법에 대한 자세한 내용은 언급하지 않지만, 당신이 사용할 수있는 플러그인이 많이 매우 흥미로운 프로젝트이다. 
좋아하는 도구를 사용하거나 적용 범위 보고서를 만들거나하는 내용은 TypeScript에서 코드로 작성할 수 있다. 
TypeScript 컴파일러가 코드와 테스트를 모니터링하고 다른 출력 디렉토리에 컴파일 된 파일을 생성하고 카르마가 이 디렉토리를 감시하도록 하는 것이다.<br/>

이제 우리는 JavaScript로 단위 테스트를 작성하는 방법을 알고 있다. mix에 Angular 2를 추가합시다.

- Using dependency injection<br/><br/>

RaceService와 같은 간단한 서비스로 Angular 2 애플리케이션이 있고 하드 코드 된 레이스 목록을 반환하는 메소드가 있다고 가정 해보자.

```javascript
export class RaceService {
  list() {
   const race1 = new Race('London');
   const race2 = new Race('Lyon');
   return [race1, race2];
  }
}
```

테스트를 위해 실행해 보자.

```javascript
describe('RaceService', () => {
  it('should return races when list() is called', () => {
   const raceService = new RaceService();
   expect(raceService.list().length).toBe(2);
  });
});
```

RaceService를 받고 테스트에 주입하기 위해 Angular가 제공하는 의존성 주입에 의존 할 수 있다. RaceService는 일부 종속성이 있는 경우 특히 유용하다.
자신이 의존 관계를 인스턴스화하는 것이 아니라 Injector에 의존하여 "이봐, 우리는 RaceService을 찾고, 그것을 만들어 그것을 나에게 건네 줄 필요가 있다고 생각한다"며 테스트 할 수 있다. 
이 방법을 사용하면 테스트 함수 내부의 인젝터에서 특정 종속성을 얻을 수 있다.
TestBed.get이 시간을 사용하여 예제로 돌아가 보자.

```javascript
import { TestBed } from '@angular/core/testing';
describe('RaceService', () => {
  it('should return races when list() is called', () => {
   const raceService = TestBed.get(RaceService);
   expect(raceService.list().length).toBe(2);
  });
});
```

우리가 앱을 시작할 때 루트 모듈에서와 같이 주입에 사용할 수 있는 것이 무엇인지 테스트에 알릴 필요가 있기 때문에 정확하게 작동하지 않는다.<br/>

TestBed 클래스는 여기에 도움이 된다. 그 configureTestingModule 메서드는 필요한 것만을 포함한 테스트 모듈을 작성하여 테스트 주입 할 것을 선언 할 수 있다. 무엇을 주입 하는걸까?
당신의 테스트에 필요한 것들을 응용 프로그램의 나머지 부분과 최대한 느슨하게 결합 시키도록 하자. 이 메소드는 beforeEach Jasmine 메서드 호출 모듈 설정한다.
@NgModule 장식에 전달할 수 있다. providers 속성은 주입이 가능하게 되고 종속성의 배열을 취한다.

```javascript
import { TestBed } from '@angular/core/testing';
describe('RaceService', () => {
  beforeEach(() => TestBed.configureTestingModule({
   providers: [RaceService]
  }));
  it('should return races when list() is called', () => {
   const raceService = TestBed.get(RaceService);
   expect(raceService.list().length).toBe(2);
  });
});
```

지금은 좋은 것입니다! 우리의 RaceService 자체에 일부 종속성이있는 경우는 그들을 inject 특성으로 선언하고 주입 가능하게 할 필요가 있다는 점에 유의해라.
간단한 Jasmine의 예처럼, beforeEach 메소드에서 RaceService 초기화를 이동할 수 있다. BeforeEach에서 TestBed.get을 사용할 수 있으므로 테스트 해보자.

```javascript
import { TestBed } from '@angular/core/testing';
describe('RaceService', () => {
  let service: RaceService;
  beforeEach(() => TestBed.configureTestingModule({
   providers: [RaceService]
  }));
  beforeEach(() => service = TestBed.get(RaceService));
  it('should return races when list() is called', () => {
   expect(service.list().length).toBe(2);
  });
});
```

beforeEach에서 TestBed.getlogic을 이동했는데, 테스트는 깔끔하였다. 인젝터를 실제로 사용하기 전에 항상 TestBed.configureTestingModule (인젝터를 설정)를 호출하도록 주의하여라.
TestBed.get 또는 당신의 테스트가 실패한다.<br/>
물론 실제 RaceService에는 레이스 하드 코드 된 목록은 포함되지 않고 응답이 비동기 일이 될 좋은 기회가 있다. 목록이 약속을 반환한다고 가정 해 보자. 그것은 무엇이 바뀔까?
콜백에서 기대치를 설정해야 한다. 

```javascript
import { async, TestBed } from '@angular/core/testing';
describe('RaceService', () => {
  let service: RaceService;
  beforeEach(() => TestBed.configureTestingModule({
   providers: [RaceService]
  }));
  beforeEach(() => service = TestBed.get(RaceService));
  it('should return a promise of 2 races', async(() => {
   service.list().then(races => {
   expect(races.length).toBe(2);
   });
  }));
});
```

약속이 해제되기 전에 테스트가 종료되고 우리의 기대는 결코 실행되지 않기 때문에, 이것은 잘못 생각하고 있을지도 모른다.
그러나 여기에서는 async () 함수를 사용하여 테스트를 수행한다. 그리고 이 방법은 정말 효율적이다. 테스트에서 열린 비동기 호출을 추적하고 해결 될 때까지 기다린다.<br/>

Angular 2 영역이라는 새로운 개념을 사용하자. 이러한 영역은 실행 컨텍스트를 가지고 단순화하기 위해 실행중인 모든 프로세스 (시간 제한 이벤트 리스너 콜백 ...)를 추적한다. 
또한 영역에 들락날락 할 때 호출되는 후크를 제공한다. Angular 2 응용 프로그램 영역에서 작동한다. 
이것은 비동기 작업이 완료 될 때 DOM을 갱신 할 필요가 있는 것을 프레임 워크가 인식하고자 하는 방법이다.<br/>

이 개념은 테스트에서 async()를 사용하는 경우에도 테스트에서 사용된다.  
테스트는 영역에서 실행되므로 프레임 워크는 모든 비동기 작업이 완료된 시점을 알고 그때까지 완료되지 않는다.
그래서 우리의 비동기적인 기대가 실행될 것이다. 

fakeAsync ()와 tick ()을 사용하여 Angular 2에서 비동기 테스트를 처리하는 또 다른 방법이 있지만 이는 더 고급 장을위한 것이다. 


**************************************************************************************************

## Fake dependencies

테스트 모듈에 대한 종속성을 선언 할 수있는 다른 용도를 가지고 있다. 실제 서비스 대신 가짜 서비스를 종속 서비스로 선언하는 것은 너무 많은 수고를 들이지 않고도 할 수 있다.
이 예에서는 내 RaceService가 로컬 스토리지를 사용하여 레이스를 저장하고 키 'race'를 가지고 있다고 하자. 
당신의 동료는 우리의 RaceService가 사용하는 JSON 직렬화 등을 취급 LocalStorageService라는 서비스를 개발하였다. list ()함수는 다음과 같다.

```javascript
@Injectable()
export class RaceService {
  constructor(private localStorage: LocalStorageService) {
  }
  list() {
   return this.localStorage.get('races');
  }
}
```

이제 우리는 LocalStorageService 서비스를 테스트하고 싶지 않는다. RaceService를 테스트하고 싶다.
의존성 주입 시스템을 활용하여 위조 된 LocalStorageService를 제공함으로써 쉽게 수행 할 수 있다.

```javascript
class FakeLocalStorage {
  get(key) {
   return [{ name: 'Lyon' }, { name: 'London' }];
  }
}
```

provide를 사용하여 RaceService를 테스트로 할 수 있다. 

```javascript
import { TestBed } from '@angular/core/testing';
describe('RaceService', () => {
  beforeEach(() => TestBed.configureTestingModule({
   providers: [
   { provide: LocalStorageService, useClass: FakeLocalStorage },
   RaceService
   ]
  }));
  it('should return 2 races from localStorage', () => {
   const service = TestBed.get(RaceService);
   const races = service.list();
   expect(races.length).toBe(2);
  });
});
```

하지만 이 테스트에 완전히 만족하지는 않는다. 가짜 서비스를 만드는 것은 지루하고 재스민은 서비스를 감지하고 구현을 가짜로 대체하는 것을 도울 수 있습니다. 
또한 get () 메서드가 올바른 키인 'race'와 함께 호출되었는지 확인할 수 있다.

```javascript
import { TestBed } from '@angular/core/testing';
describe('RaceService', () => {
  const localStorage = jasmine.createSpyObj('LocalStorageService', ['get']);
  beforeEach(() => TestBed.configureTestingModule({
   providers: [
   { provide: LocalStorageService, useValue: localStorage },
   RaceService
   ]
  }));
  it('should return 2 races from localStorage', () => {
   localStorage.get.and.returnValue([{ name: 'Lyon' }, { name: 'London' }]);
   const service = TestBed.get(RaceService);
   const races = service.list();
   expect(races.length).toBe(2);
   expect(localStorage.get).toHaveBeenCalledWith('races');
  });
});
```


**************************************************************************************************

## Testing components

간단한 서비스를 테스트 한 후 다음 단계는 구성 요소를 테스트하는 것이다. 구성 요소 테스트는 구성 요소를 만들어야하기 때문에 약간 다르다. 
의존성 주입 시스템을 사용하여 테스트 할 구성 요소의 인스턴스를 제공 할 수는 없다. (이제는 다른 구성 요소에 구성 요소가 주입 가능하지 않음을 눈치 챘을 것이다 :))<br/>

먼저 테스트 할 컴포넌트를 작성해 보자. 왜 PonyComponent 컴포넌트가 필요하지 않는가? 포니를 입력으로 가져오고 구성 요소를 클릭 할 때 클릭 한 이벤트 포니를 내 보내 보자.

```javascript
@Component({
  selector: 'ns-pony',
  template: `<img [src]="'/images/pony-' + pony.color.toLowerCase() + '.png'" (click)=
"clickOnPony()">`
})
export class PonyComponent {
  @Input() pony: PonyModel;
  @Output() ponyClicked = new EventEmitter<PonyModel>();
  clickOnPony() {
   this.ponyClicked.emit(this.pony);
  }
}
```

그것은 매우 간단한 템플릿과 함께 제공된다. : 포니 색상에 따라 동적 소스가 있는 이미지 및 클릭 핸들러<br/>

이러한 구성 요소를 테스트하려면 먼저 인스턴스를 작성해야 한다. 이렇게 하기 위해 TestBed도 사용할 수 있다. 
이 클래스는 구성 요소를 만들기 위한 createComponent하는 유틸리티 메소드가 포함되어 있다. 
이 메서드는 구성 요소의 표현이다 ComponentFixture을 반환한다. 
구성 요소를 만들려면 테스트 모듈에서 구성 요소를 알 필요가 있기 때문에 declarations 속성에 추가해야 한다.

```javascript
import { TestBed } from '@angular/core/testing';
import { PonyComponent } from './pony_cmp';
describe('PonyComponent', () => {
  it('should have an image', () => {
   TestBed.configureTestingModule({
   declarations: [PonyComponent]
   });
   const fixture = TestBed.createComponent(PonyComponent);
   // given a component instance with a pony input initialized
   const ponyComponent = fixture.componentInstance;
   ponyComponent.pony = { name: 'Rainbow Dash', color: 'BLUE' };
   // when we trigger the change detection
   fixture.detectChanges();
   // then we should have an image with the correct source attribute
   // depending of the pony color
   const element = fixture.nativeElement;
   expect(element.querySelector('img').getAttribute('src')).toBe('/images/pony-blue.png');
  });
});
```

여기에서는 "Given/When/Then" 패턴에 따라 단위 테스트를 작성해야 한다. 당신은 그 주제에 대한 전문을 찾을 수 있다.<br/>

• 테스트 컨텍스트를 설정하는 "Given"단계. 작성된 구성 요소 인스턴스를 가져 조랑말을 제공한다. 실제 응용 프로그램의 부모 구성 요소로부터의 입력을 에뮬레이트 한다.<br/>
• detectChanges () 메소드를 사용하여 수동으로 변경 탐지를 트리거하는 "When"단계. 테스트는 변경의 검출은 우리의 책임이다. 응용 프로그램에있는 것처럼 자동으로 하지 않는다.<br/>
• 기대를 포함 "Then"단계. 예를 들어, querySelector ()를 사용하여 브라우저와 마찬가지로 기본 요소를 취득하고 DOM을 쿼리 할 수 있다. 여기에서는 이미지 소스가 올바른 것인지를 테스트 해야 한다.<br/>

구성 요소가 실제로 이벤트를 방출하는지 테스트 할 수도 있다.

```javascript
it('should emit an event on click', () => {
  TestBed.configureTestingModule({
   declarations: [PonyComponent]
  });
  const fixture = TestBed.createComponent(PonyComponent);
  // given a pony
  const ponyComponent = fixture.componentInstance;
  ponyComponent.pony = { name: 'Rainbow Dash', color: 'BLUE' };
  // we fake the event emitter with a spy
  spyOn(ponyComponent.ponyClicked, 'emit');
  // when we click on the pony
  const element = fixture.nativeElement;
  const image = element.querySelector('img');
  image.dispatchEvent(new Event('click'));
  // and we trigger the change detection
  fixture.detectChanges();
  // then the event emitter should have fired an event
  expect(ponyComponent.ponyClicked.emit).toHaveBeenCalled();
});
```

다른 구성 요소를 살펴 보겠습니다.

```javascript
@Component({
  selector: 'ns-race',
  template: `<div>
   <h1>{{race.name}}</h1>
   <ns-pony *ngFor="let currentPony of race.ponies" [pony]="currentPony"></ns-pony>
  </div>`
})
export class RaceComponent {
  @Input() race: any;
}
```

그리고 테스트 해보자. 

```javascript
describe('RaceComponent', () => {
  let fixture: ComponentFixture<RaceComponent>;
  beforeEach(() => {
   TestBed.configureTestingModule({
   declarations: [RaceComponent, PonyComponent]
   });
   fixture = TestBed.createComponent(RaceComponent);
  });
  it('should have a name and a list of ponies', () => {
   // given a component instance with a race input initialized
   const raceComponent = fixture.componentInstance;
   raceComponent.race = { name: 'London', ponies: [{ name: 'Rainbow Dash', color: 'BLUE'
}] };
   // when we trigger the change detection
   fixture.detectChanges();
   // then we should have a name with the race name
   const element = fixture.nativeElement;
   expect(element.querySelector('h1').textContent).toBe('London');
   // and a list of ponies
   const ponies = fixture.debugElement.queryAll(By.directive(PonyComponent));
   expect(ponies.length).toBe(1);
   // we can check if the pony is correctly initialized
   const rainbowDash = ponies[0].componentInstance.pony;
   expect(rainbowDash.name).toBe('Rainbow Dash');
  });
});
```

여기에서는 첫 번째 포니가 올바르게 초기화되었는지 여부를 확인하기 위해 PonyComponent 형의 모든 지시어와 test를 조회 한다.

자식 컴퍼넌트를 사용하여 구성 요소의 구성 요소를 가져 오거나 query () 및 queryAll ()를 사용하여 구성 요소를 쿼리 할 수 있다. 
이 메소드는 인수로 술어를 취한다. 이것은 By.cssor By.directive도 괜찮다.
이것은 PonyComponent의 인스턴스이므로 조랑말을 표시하기 위해 실시하는 것이다. 
이것은 querySelector ()를 사용하여 DOM 쿼리와는 다르다.
Angular 의해 처리되는 요소만을 검색하여 DOM 요소가 아닌 ComponentFixture를 반환한다. (따라서 결과 componentInstance에 액세스 할 수 있다)



**************************************************************************************************

## Testing with fake templates, providers…


구성 요소를 테스트 할 때 구성 요소를 사용하는 부모 구성 요소를 만들 수 있다. 
유스 케이스가 여러 개있는 경우 다른 입력을 시도하는 일부 부모 구성 요소를 작성해야 한다.
잘하면 테스트 중에 구성 요소를 변경하여 템플릿을 재정의하면 다양한 테스트 구성 요소를 재사용 할 수 있다.<br/>

이렇게 하기 위해 TestBed는 overrideComponent () 메소드를 제공하고 createComponent () 메소드 전에 호출한다.<br/>

```javascript
describe('RaceComponent', () => {
  let fixture: ComponentFixture<RaceComponent>;
  beforeEach(() => {
   TestBed.configureTestingModule({
   declarations: [RaceComponent, PonyComponent]
   });
   TestBed.overrideComponent(RaceComponent, { set: { template: '<h2>{{race.name}}</h2>'
} });
   fixture = TestBed.createComponent(RaceComponent);
  });
  it('should have a name', () => {
   // given a component instance with a race input initialized
   const raceComponent = fixture.componentInstance;
   raceComponent.race = { name: 'London' };
   // when we trigger the change detection
   fixture.detectChanges();
   // then we should have a name
   const element = fixture.nativeElement;
   expect(element.querySelector('h2').textContent).toBe('London');
  });
});
```

보시다시피,이 메서드는 두 가지 인수를 취한다.
• 무시하려는 구성 요소<br/>
• 설정하거나 추가하거나 제거하려는 메타 데이터 (예 : 템플릿을 설정)<br/>

즉, 테스트 중인 구성 요소의 템플릿 또는 해당 하위 중 하나를 수정할 수 있다. (구성 요소를 큰 템플릿으로 바꾸려면 무언가를 바꾼다.)

템플릿 만 사용 가능한 메타 데이터가 아니다.

• 공급자가 구성 요소의 종속성을 대체
• 구성 요소의 템플릿에 사용 된 스타일을 대체 할 스타일
• 또는 @Component 데코레이터에서 설정할 수있는 모든 속성

**************************************************************************************************

## End-to-end tests (e2e)

엔드 - 투 - 엔드 테스트는 수행 할 수있는 또 다른 유형의 테스트이다. 
엔드 - 투 - 엔드 테스트는 실제로 브라우저에서 응용 프로그램을 시작하고 버튼을 클릭하거나 양식을 작성하는 등 사용자와 상호 작용하는 사용자를 에뮬레이트 한다. 
그들은 전체 응용 프로그램을 정말 테스트하는 장점이 있다:<br/>
• 속도가 느린 (테스트마다 몇 초)<br/>
• 엣지 케이스를 테스트하는 것은 어렵다.<br/>
당신이 추측하는 것처럼 단위 테스트와 e2e 테스트 중 하나를 선택할 필요가 없다. 둘을 결합하여 전체 응용 프로그램과 의도 한대로 작동한다는 보장을받을 수 있다.
E2e 테스트는 Angular라는 도구에 의존하고 있다. AngularJS 1.x에서 같은 목적으로 사용하는 도구와 동일하다. 
놀라운 것은, AngularJS 1.x와 Angular 2 모두에서 작동한다. 
단위 테스트처럼 Jasmine를 사용하여 테스트를 만들지 만, Angular API를 사용하여 응용 프로그램과 상호 작용한다.

간단한 테스트는 다음과 같다. 

```javascript
describe('Home', () => {
  it('should display title, tagline and logo', () => {
   browser.get('/');
   expect(element.all(by.css('img')).count()).toEqual(1);
   expect($('h1').getText()).toContain('PonyRacer');
   expect($('small').getText()).toBe('Always a pleasure to bet on ponies');
  });
});
```

Angular는 우리 브라우저 객체를주고 get()과 같은 몇 가지 유틸리티 메소드를 사용하여 페이지로 이동한다. 
다음 술어와 일치하는 모든 요소를 선택하기 위해 element.all ()를 사용한다.
이 조건은 종종 다양한 방법 (by.css () id 등에서 요소를 취득하는 CSS 조회, by.id ()에 의존한다). 
element.all()는 위의 테스트에서 사용된 특별한 방법 count()를 사용하여 약속을 반환한다. <br/><br/>

$ ('h1')은 요소 (by.css ( 'h1'))를 쓸 경우에 해당하는 단축키 이다. CSS 쿼리와 일치하는 최초의 요소를 가져온다. 
정보를 얻을 getText()와 getAttribute()와 이 요소에 작용하는 click()과 sendKeys()와 같은 메소드처럼 $()에 의해 반환 된 약속에 대해 몇 가지 방법을 사용 수 있다.<br/>

이러한 테스트는 쓰기 및 디버깅 (단위 테스트보다 훨씬 긴)이 상당히 길어질 수 있지만, 실제로는 편리하다.
당신은 어떤 브라우저를 테스트하는 테스트가 실패 할 때마다 스크린 샷을 찍는 등 그들을 사용하여 모든 종류의 좋은 일을 할 수 있다.<br/>
단위 테스트와 e2e 테스트는 견고하고 유지 보수 할 수있는 애플리케이션을 구축하는 열쇠가 된다. <br/>


**************************************************************************************************


## Reference URL
- [BEM introduction](http://getbem.com/introduction/)
- [BEMIT(BEM을 기반으로 확장변형 시킨 네이밍 컨벤션)](http://csswizardry.com/2015/08/bemit-taking-the-bem-naming-convention-a-step-further/)
- [SMACSS](https://smacss.com/)