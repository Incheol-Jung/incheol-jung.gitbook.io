---
layout:     reference
title:      The wonderful land of Web Components
date:       2017-01-22 00:00:00
updated:    2017-01-22 00:00:00
categories: reference
summary:    The wonderful land of Web Components
---




## A brave new world

컴포넌트는 개발측면에서 오래된 환상이었다. 
그러나 이것은 완전히 새로운것은 아니다. 
우리는 꽤 오랫동안 웹 개발에서 컴포넌트를 가지고 있었으나 컴포넌트들은 당신의 앱에는 필요하지 않더라도 jqeury, dojo, prototype, angularjs 등 몇몇의 종류를 요구하였다. <br/><br/>

웹 컴포넌트는 이 문제를 해결하고자 한다. : 그럼 재사용적이고 캡슐화된 컴포넌트들을 가져보도록 하자. <br/>

컴포넌트들은 브라우져가 완벽하게 지원하지 못하는 신흥 표준에 의존한다. 그러나, 비록 우리가 완전히 사용하기 위해 몇년을 기다려야 하거나, 의존의 개념을 벗어날 수 없을 지라도 
여전히 이것은 흥미로운 이슈이다.<br/>

 새로운 표준은 4가지 규격에 정의되어있다. <br/>
 - Custom elemts
 - Shadow DOM
 - Template
 - HTML Imports

앞으로의 샘플들을 가장 잘 동작하기 위해서는 최신 버젼의 크롬이나 파이어폭스를 이용하라. 


**************************************************************************************************


## Custom elements

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

**************************************************************************************************



## Shadow DOM

미스터리한 이름을 가진 이것은 몬가 엄청난 기능이 있다는것을 당신은 예상할 것이다. 물론 그렇다.
그림자 DOM은 우리의 컴포넌트 DOM객체를 캡슐화 하는 방법이다. 
그리고 캡슐화는 앱의 스타일 시트와 자바 스크립트 로직이 구성 요소에 적용되지 않고 의도하지 않게 파손된다는 것을 의미한다. 
이것은 우리에게 내장 컴포넌트를 숨실수 있는 완벽한 도구를 제공한다. 그리고 컴포넌트에서 앱까지 어떠한 누출도 없다는 것을 의미한다. <br/><br/>

이전 앱으로 돌아가보자.<br/>

```javascript
var PonyComponentProto = Object.create(HTMLElement.prototype);
// add some template in the Shadow DOM
PonyComponentProto.createdCallback = function() {
  var shadow = this.createShadowRoot();
  shadow.innerHTML = '<h1>General Soda</h1>';
};
var PonyComponent = document.registerElement('ns-pony', {prototype: PonyComponentProto});
document.body.appendChild(new PonyComponent());
```

만약 당신이 확인해보았다면 이러한 코드를 확인했을 것이다. 

```javascript
<ns-pony>
  #shadow-root (open)
   <h1>General Soda</h1>
</ns-pony>
```

이제 당신이 h1 엘리먼트에 약간의 스타일을 추가하였을지라도, 컴포넌트의 보이는 관점에서는 어떠한 변화도 없을 것이다. 
그림자 DOM이 방어벽과 같은 역활을 하기 때문이다. <br/>

지금까지도, 우리는 Component의 템플릿으로 문자열을 사용하였다. 그러나 이것은 일반적인 방법이 아니다. 
대신, <template> 요소를 사용하는 것이 가장 좋다. <br/>

**************************************************************************************************



## Template

템플릿은 브라우져에는 표시되지 않는 <template>안에 명시되어진다. 
주된 목적은 특정 시점에서 요소에 복제되는 것이다. 
템플릿은 getElementById() 와 같은 일반적인 메소드를 사용하여 나머지 페이지에서 쿼리 할 수 없으며 페이지의 아무 곳에나 안전하게 배치될 수 있다. <br/><br/>

템플릿을 사용하려면 복제해야한다. 

```javascript
<template id="pony-tpl">
  <style>
   h1 { color: orange; }
  </style>
  <h1>General Soda</h1>
</template>
var PonyComponentProto = Object.create(HTMLElement.prototype);
// add some template using the template tag
PonyComponentProto.createdCallback = function() {
  var template = document.querySelector('#pony-tpl');
  var clone = document.importNode(template.content, true);
  this.createShadowRoot().appendChild(clone);
};
var PonyComponent = document.registerElement('ns-pony', {prototype: PonyComponentProto});
document.body.appendChild(new PonyComponent());
```

아마 우리는 한 파일안에서 선언을 할수 있고, 우리는 완벽하게 캡슐화된 컴포넌트를 가진것이다. 


**************************************************************************************************


## HTML Imports


이것은 마지막 사양이다. HTML import는 HTML 안에 HTML을 가져오는것을 허용한다. 
<link rel="import" href="ns-pony.html"> 와 같은 형태이다. 
ns-pony.html 파일은 필요한 모든것을 담을 수 있다. <br/><br/>

만약 누군가 우리의 훌륭한 컴포넌트를 사용하길 원한다면 그들은 단지 HTML import 해서 사용하기만 하면 된다.  


**************************************************************************************************


## Polymer and X-tag


웹 컴포넌트가 모든 브라우져에서 지원하지 않기 때문에 polyfill을 당신의 앱에 포함하면 정상적으로 동작할 것이다. 
polyfill은 web-component.js로 불리어져 있고 google, mozila, microsoft등 공동으로 노력하고 있는 결과물이라는 점은 주목할 만한 가치가 있다. <br/><br/>

주목할 만한 기능을 확인해보도록 하자. 
- Polymerfrom google
- X-tagfrom Mozilla and Microsoft<br/>

디테일하게는 설명하지 않을것이다. 그러나 당신은 이미 polymer component를 쉽게 사용하고 있을것이다.
당신의 앱안에 있는 구글 맵을 살펴보도록 하자. 

```javascript
<!-- Polyfill Web Components support for older browsers -->
<script src="webcomponents.js"></script>
<!-- Import element -->
<link rel="import" href="google-map.html">
<!-- Use element -->
<body>
  <google-map latitude="45.780" longitude="4.842"></google-map>
</body>
```

polymer안에는 매우 다양한 구성요소가 있다.  https://customelements.io 해당 사이트에서 살펴볼 수 있다.<br/>
polymer는 커스텀 컴포넌트를 빌드하는데에도 도움을 준다.  

```javascript
<dom-module id="ns-pony">
  <template>
   <h1>[[name]]</h1>
  </template>
  <script>
   Polymer({
   is: 'ns-pony',
   properties: {
   name: String
   }
   });
  </script>
</dom-module>
```

```javascript
<!-- Polyfill Web Components support for older browsers -->
<script src="webcomponents.js"></script>
<!-- Polymer -->
<link rel="import" href="polymer.html">
<!-- Import element -->
<link rel="import" href="ns-pony.html">
<!-- Use element -->
<body>
  <ns-pony name="General Soda"></ns-pony>
</body>
```

당신은 Polymer를 가지고 굉장한 것들을 많이 할수 있다. (양방향 바인딩, 기본 속성 설정, 커스텀 이벤트, 속성변경시 발생하는 이벤트 등)<br/><br/>

지금까지 당신에게 말한 웹 컴포넌트에 대한 설명은 매우 짧게 요약한 것이다. 그러나 웹 컴포넌트에 대한 컨셉은 명확하게 설명하였다. 
그리고 구글 팀은 Angular 2 컴포넌트에 따라서 웹 컴포넌트 사용을 매우 쉽게 사용하기 위해 Angular 2를 디자인 했다는 것을 이해할 수 있을 것이다. 

**************************************************************************************************


**************************************************************************************************


## Reference URL
- [BEM introduction](http://getbem.com/introduction/)
- [BEMIT(BEM을 기반으로 확장변형 시킨 네이밍 컨벤션)](http://csswizardry.com/2015/08/bemit-taking-the-bem-naming-convention-a-step-further/)
- [SMACSS](https://smacss.com/)