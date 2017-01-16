---
layout: post
title:  "Property binding"
date:   2017-01-16 00:00:00
categories: TheTemplatingSyntax
comments: true
---

보간법은 템플릿에서 동적인 부분을 갖는 유일한 방법 중 하나이다. <br/>
실제로 우리가 보았던 보간법은 Angular 2 템플릿 시스템의 핵심 인 속성 바인딩을 사용하는 쉬운 방법이다. <br/><br/>

Angular 2에서는 각 대괄호를 대괄호 []로 묶인 HTML 요소의 특수 속성을 통해 작성할 수 있다. 
처음에는 이상하게 보이지만 실제로는 유효한 HTML 이다. 
HTML 속성은 따옴표, 어포 스트로피, 슬래시, 같음, 공백과 같은 몇 가지 문자를 제외하고 원하는 모든 것으로 시작할 수 있다. <br/><br/>

나는 DOM 속성에 대해 이야기하고 있지만 어쩌면 이것이 당신에게 명확하지 않을 수도 있다. 
우리는 일반적으로 HTML 속성에 쓰고 있다. <br/><br/>

```javascript
<input type="text" value="hello">
```

위의 입력 태그에는 두 가지 속성, 즉 유형 속성과 값 속성이 있다. 
브라우저가이 태그를 파싱하면 일치하는 속성 유형 및 값이있는 해당 DOM 노드 (HTMLInputElement)를 만든다.
각 표준 HTML 속성에는 DOM 노드에 해당 속성이 있다. 
그러나 DOM 노드에는 해당 특성이없는 추가 속성도 있다. (예 : childElementCount, innerHTML 또는 textContent )

사용자 이름을 표시하기 위한 보간법은 다음과 같다. 

```javascript
<p>{{user.name}}</p>
```

다음은 간단한 구문이다. 

```javascript
<p [textContent]="user.name"></p>
```

대괄호 구문을 사용하면 DOM 속성 textContent를 수정할 수 있으며 보간 용으로 사용 된 것처럼 현재 구성 요소 인스턴스의 컨텍스트에서 평가되는 user.name 값을 지정한다. 
