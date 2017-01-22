---
layout: post
title:  "Emulated strategy"
date:   2017-01-22 00:00:00
categories: StylingComponentsAndEncapsulation
comments: true
---

전술 한 바와 같이, 이것은 기본 전략이다. 
기본 전략을 에뮬레이트 한다. 그러나 이 그림자 DOM을 사용할 수는 없다. 따라서 어디서나 사용하는 것이 안전하며, 같은 동작을 한다.<br/>

이를 위해 Angular 2는 구성 요소에 대해 정의 된 CSS를 사용하여 페이지의 <head> 요소 내에 인라인으로 작성한다. 
(기본 전략에서 본대로 각 구성 요소에 포함되지는 않는다 ). 
하지만 인라인하기 전에 CSS 셀렉터를 다시 작성하고 고유 한 속성 식별자를 추가해야 한다. 이 독특한 속성은 컴포넌트 템플릿의 모든 요소에 추가되여야 한다. 
그러면 스타일은 우리의 구성 요소에만 적용된다.

```javascript
<html>
  <head>
   <style>.red[_ngcontent-dvb-3] {color: red}</style>
  </head>
  <body>
   ...
   <ns-pony _ngcontent-dvb-2="" _nghost-dvb-3="">
   <div _ngcontent-dvb-3="" class="red">Rainbow Dash</div>
   </ns-pony>
  </body>
</html>
```

빨간색 클래스 선택자는 .red [_ngcontent-dvb-3] 재사용 때문에 클래스 red와 특성 _ngcontent-dvb-3을 모두 가진 요소에만 적용된다.
이 특성은 우리의 div에 자동으로 추가 되었기 때문에 완벽하게 작동한다. 
<ns-pony> 요소는 부모에 대해 생성 된 고유 식별자 인 _ngcontent-dvb-2와 그 부모에 대해 생성 된 _nghost-dvb-3 이것은 호스트 요소 자체의 고유 식별자 이다. 
바로 살펴 같이 호스트 요소에 적용되는 스타일을 추가 할 수 있다.

- None strategy <br/><br/>

이 전략은 캡슐화를 수행하지 않지만 스타일은 적용 된다. (에뮬레이트 전략 등) 페이지 상단에 인라인되만 다시 작성되지 않는다. 그런 다음 아이들은 "정상적인" 스타일처럼 행동한다.<br/>

- Styling the host <br/><br/>

특별한 CSS 셀렉터가 호스트 요소 만 스타일링 할 수 있다. 그것은 host라고 부르며 웹 컴포넌트 명세에서 착안한 것이다.

```javascript
:host {
  display: block;
}
```

그것은 Native 전략에 위해 그대로 보관되어 Emulated를 사용하는 경우 [_nghost-xxx에 다시 작성된다.<br/>

결론적으로, 에뮬레이트 된 전략이 우리에게 이 사업을 담당하기 때문에 완벽하게 캡슐화 된 스타일을 가진 데 많이 할 필요는 없다. 
특정 브라우저만을 대상으로하는 경우는 기본 전략을 사용하거나 스타일을 캡슐화하지 않으면 None을 사용하도록 전략을 전환 할 수 있다. 
이 전략은 구성 요소마다 조정할 수도 루트 모듈의 응용 프로그램 전체에 대해 전체적으로 조정할 수 있다.