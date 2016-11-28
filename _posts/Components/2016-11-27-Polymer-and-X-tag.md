---
layout: post
title:  "Polymer and X-tag"
date:   2016-11-27 00:00:00
categories: Components
comments: true
---

모든 것들은 웹 컴포넌트를 만들기 위한 것이다.<br/>
웹 컴포넌트가 모든 브라우져에서 지원되지는 않지만, 당신의 앱에 polyfill을 추가한다면 모든 브라우져에서 동작할 것이다. 
polyfill은 web-component.js로 불리어지며, 이것은 Google, Mozilla, Mirosoft 와 그외에 업체의 공동 노력으로 만들어낸 것으로 주목할 만한 가치가 있다. <br/><br/>

모두 웹 컴포넌트 작업을 보다 쉽게 사용하기 위해 준비되어 있으며 일부는 즉시 사용할 수 있는 구성 요소가 제공된다. <br/>

가장 주목할 만한 단계는 이것이다. 
  - Polymer From Google
  - X-tag from Mozilla and Microsoft<br/><br/>

나는 깊게 들어가지 않을것이지만 당신은 이미 손 쉽게 Polymer 컴포넌트를 사용할수 있을 것이다. 만약 앱에서 구글 맵이 필요하다고 가정해 보자. 

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

여기에는 많은 것들이 내포되어 있다. 당신은 해당 URL을 통해서 살펴볼 수 도 있다. <a href='https://customelements.io/'>https://customelements.io/</a><br/>
Polymer는 당신이 만든 컴포넌트도 지원할 수 있다. 

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

당신은 polymer를 사용하여 두 단계 바인딩 또는 속성의 기본값, 특정 이벤트를 부여하는 등 다양하고 멋진 것들을 많이 할수 있다. <br/>
웹 구성 요소에 대한 모든 것을 설명하기에는 너무 짧지만, 당신은 이 글을 읽으면서 컴포넌트의 컨셉이나 하려는 목적은 확인할 수 있을 것이다. 
