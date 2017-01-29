---
layout: post
title:  "End-to-end tests"
date:   2017-01-22 00:00:00
categories: TestingYourApp
comments: true
---

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