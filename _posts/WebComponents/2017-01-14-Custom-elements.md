---
layout: post
title:  "Custom elements"
date:   2016-11-27 00:00:00
categories: WebComponents
comments: true
---

커스텀 컴포넌트는 개발자에게 <ns-pony></ns-pony>와 같은 유요한 HTML 엘리먼트 같이 그들 자신의 DOM 엘리먼트를 만들수있도록 허용한다. 
이 사양은 이전에 존재하는 엘리먼트를 어떻게 확장할수 있는지를 선언한다. 
커스텀 엘리먼트를 선언하는 것은 "document.registerElement('ns-pony')" 와 같이 선언하면 간단히 정의되어 진다. 

```javascript
// new element
var PonyComponent = document.registerElement('ns-pony');
// insert in current body
document.body.appendChild(new PonyComponent());
```

이름에는 dash가 포함되어야 한다는것을 주의해라. 그래야지 브라우져가 커스터 엘리먼트라는 것을 알 수 있다. 
물론, 당신의 커스텀 엘리먼트는 속성도 있을것이고 함수도 있을것이다. 그리고 그것은 지워지거나 생성되거나 속성이 변경될 경웨 발생하는 라이프 사이클 콜백도 있을것이다. 
이것은 자신의 템플릿을 가진다. 아마도 ns-pone는 그것의 이름이나 이미지를 보여줄것이다. 

```javascript
// let's extend HTMLElement
var PonyComponentProto = Object.create(HTMLElement.prototype);
// and add some template using a lifecycle
PonyComponentProto.createdCallback = function() {
  this.innerHTML = '<h1>General Soda</h1>';
};
// new element
var PonyComponent = document.registerElement('ns-pony', {prototype: PonyComponentProto});
// insert in current body
document.body.appendChild(new PonyComponent());
```

만약 당신이 dom 객체를 확인한다면, 당신은 <ns-pony><h1>General Soda</h1></ns-pony> 를 확인할 수 있을 것이다. 
그러나 이것은 당신의 앱의 CSS나 javascript 로직이 커스텀 컴포넌트에 요구하지 않는 효과를 줄수 있다는 것을 의미한다. 
그래서 주로 템플릿은 그림자 DOM이라는 것으로 캡슐화되어지고 숨겨지며, 만약 당신이 DOM 객체에서 감지하여 브라우져에 pony의 이름이 보여질지라도 
당신은 오직 <ns-pony></ns-pony>를 볼것이다. 