---
layout: post
title:  "Shadow DOM"
date:   2016-11-27 00:00:00
categories: WebComponents
comments: true
---

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