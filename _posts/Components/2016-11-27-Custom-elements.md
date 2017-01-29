---
layout: post
title:  "Custom Elements"
date:   2016-11-27 00:00:00
categories: Components
comments: true
---

Components 요소는 자신의 DOM 요소를 생성하려는 개발자들에게 허용되는 새로운 기준이다. 
요소들은 어떻게 정의될지 어떻게 존재하는 요소에 확장할지를 정의해준다. <br/>
특정 요소를 정의하는 것은 "document.registerElement('ns-pony')"와 같이 간단하다. 

```javascript
// new element
var PonyComponent = document.registerElement('ns-pony');
// insert in current body
document.body.appendChild(new PonyComponent());
```

이름에는 '-'가 붙어야만 브라우져에서 커스텀 요소라는 것을 알수 있다는 것을 명심해라.
물론 당신의 커스텀 요소는 함수나 속성을 가질수도 있고, 해당 컴포넌트가 생성되거나 변경되거나 삭제될 경우에 발생하는 콜백함수를 가질수 도 있다.
컴포넌트는 자신만의 템플릿을 가지고 있다. 아마도 'ns-pony'는 pony의 이미지 또는 자신의 이름을 표시할지 모른다. <br/>

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

만약 당신이 DOM을 살펴보려고 한다면, 당신은 <ns-pony><h1>General Soda</h1></ns-pony>를 볼것이다. 
그러나 이는 앱의 CSS와 자바 스크립트 로직이 컴포넌트에 원피 않는 영향을 줄 수 있음을 의미한다. 
그래서 주로 템플릿은 숨기거나 Shadow Dom으로 불리우는 것에 캡슐화하여 오직 <ns-pony></ns-pony>만 보여주도록 한다. 
 