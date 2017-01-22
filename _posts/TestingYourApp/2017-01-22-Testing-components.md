---
layout: post
title:  "Testing components"
date:   2017-01-22 00:00:00
categories: TestingYourApp
comments: true
---

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

