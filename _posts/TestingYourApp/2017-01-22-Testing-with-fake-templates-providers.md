---
layout: post
title:  "Testing with fake templates, providers…"
date:   2017-01-22 00:00:00
categories: TestingYourApp
comments: true
---

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