---
layout: post
title:  "Shadow DOM"
date:   2016-11-27 00:00:00
categories: Components
comments: true
---

당신은 이름을 보고서 강력한 힘이 있는것이라 추측할 것이고 그 추축은 옳다. 
Shadow DOM은 우리의 컴포넌트의 돔 객체를 캡슐화시킬 수 있는 방법이다. 캡슐화는 단신의 앱의 스타일 시트와 자바스크립트 로직이 해당 컴포넌트에 적용이 안될것이고 부주의로 인해 망칠수도 있다는 것을 의미한다. 
Shadow DOM은 컴포넌트를 숨길수 있는 완벽한 도구이고 앱안에 있는 컴포넌트로 부터 어떠한 결함을 보여주지 않을 수 있도록 한다. <br/><br/>

이전의 예제를 살펴보도록 하자. 

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

만약 당신이 살펴본다면 확인할 수 있을 것이다. 

```html
<ns-pony>
  #shadow-root (open)
   <h1>General Soda</h1>
</ns-pony>
```

이제 비록 당신이 ht 태그를 추가할 지라도, 컴포넌트의 보여지는 외관에는 변함이 없을 것이다. : 왜냐하면 Shadow DOM이 장벽과 같은 역활을 한다. <br/><br/>

지금까지도, 우리는 단지 우리의 웹 컴포넌트 템플릿을 문자열 처럼 사용하였다. 그러나 이것은 일반적인 방법이 아니다. 
가장 좋은 방법은 <template> 요소를 사용하는 것이다. 
