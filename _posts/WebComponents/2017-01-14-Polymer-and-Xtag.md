---
layout: post
title:  "Polymer and X-tag"
date:   2016-11-27 00:00:00
categories: WebComponents
comments: true
---

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