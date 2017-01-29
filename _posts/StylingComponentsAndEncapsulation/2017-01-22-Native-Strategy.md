---
layout: post
title:  "Native strategy"
date:   2017-01-22 00:00:00
categories: StylingComponentsAndEncapsulation
comments: true
---

웹 개발자는 종종 CSS 클래스를 요소에 추가한다. 그리고 CSS의 본질은 그것이 Cascade 될 것이라는 것이다. 
목록에서 선택한 요소에 스타일을 추가하려고 한다고 가정해 보자. 일반적으로 CSS에 매우 좁은 CSS 선택기 (예 : li.selected)를 사용한다. 
또는 BEM과 같은 규칙을 사용하여 더 좁은 요소를 선택하여라. 선택한 요소를 앱의 특정 부분에 스타일을 지정하기만 하면 된다.<br/>

이것은 Angular 2가 편리한 우용한 것이다. 
구성 요소에서 정의하는 스타일 (styles 속성을 사용하거나 styleUrls를 가지는 컴퍼넌트의 전용 CSS 파일)이 구성 요소의 범위 내에서 적용된다. 
이 스타일 캡슐화라고 한다. 어떻게 이것을 달성할 수 있을까?<br/>

그것은 당신이 어떤 스타일을 쓰는 것으로 시작한다. 그런 다음 구성 요소 데코레이터의 속성 캡슐화에 대해 선택한 전략에 따라 다르다. 이 속성은 세 가지 다른 값을 가질 수 있다.
• ViewEncapsulation.Emulated는 기본 설정이다.
• ViewEncapsulation.Native는 그림자 캡슐에 의존하는 것을 의미 한다.  
• ViewEncapsulation.None은 캡슐화를 원하지 않는다는 것을 의미 한다.

각각의 가치는 물론 다른 행동을 유도하므로 살펴 보자. 당신이 잘 알고있는 구성 요소, 즉 PonyComponent을 사용한다. 
이것은 구성 요소의 정말 간단한 버전에서 div에 조랑말의 이름을 표시 할뿐 이다. 이 예에서는 div에 CSS 클래스 red를 추가한다.

```javascript
import { Component, ViewEncapsulation } from '@angular/core';
@Component({
  selector: 'ns-pony',
  template: `<div class="red">{{name}}</div>`,
  styles: [`.red {color: red;}`],
  // that's the same as the default mode
  encapsulation: ViewEncapsulation.Emulated
})
export class PonyComponent {
  name: string = 'Rainbow Dash';
}
```

그런 다음 클래스는 구성 요소의 스타일에 사용된다. 

```javascript
.red {
  color: red;
}
```

보시다시피 조랑말의 이름을 빨간색 글꼴로 표시된다. <br/>
Native 옵션을 사용하는 경우 Angular 2에 브라우저의 그림자 DOM을 사용하여 캡슐화를 처리하도록 지시한다. 그림자 DOM은 다소 새로운 웹 구성 요소 사양의 일부이다.
이 스펙은 완벽하게 캡슐화 된 특수 DOM에 요소를 작성할 수 있게 한다. 이 전략을 사용하여 생성 된 DOM을 브라우저의 검사기로 확인할 수 있다. 

```javascript
<ns-pony>
  #shadow-root (open)
   <style>.red {color: red}</style>
   <div class="red">Rainbow Dash</div>
</ns-pony>
```

inspector에 Chrome이 표시 할 # shadow-root (열려 있음)를 확인할 수 있다. 
그 이유는 Google의 구성 요소가 그림자 DOM 요소에 포함 되었기 때문이다. 또한 스타일이 구성 요소의 콘텐츠 상단에 추가 된 것을 볼 수 있다.<br/>
기본 전략은 구성 요소의 스타일이 자식 컴퍼넌트에 '유출'되지 않는 것이 분명하다. PonyComponent에 다른 구성 요소가 있는 경우는 다른 스타일의 독특한 붉은 CSS 클래스를 정의 할 수 있다.
올바른 스타일을 사용하여 상호간에 상호 작용이 없는 것이 확실히 할 수 있다. 

그러나 그림자 DOM은 다소 새로운 사양이므로 모든 브라우저에서 사용할 수있는 것은 아니다. 
멋진 웹 사이트 caniuse.com에서 사용 가능 여부를 확인할 수 있으므로 앱에서 사용할 때는 주의해야 한다.