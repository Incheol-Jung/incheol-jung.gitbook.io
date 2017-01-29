---
layout: post
title:  "Canonical syntax"
date:   2017-01-21 00:00:00
categories: TheTemplatingSyntax
comments: true
---

우리가 본 모든 구문은 표준 구문이라는보다 긴 상응을 가지고 있다. 
이것은 주로 서버 측의 템플릿 시스템이 [] 또는 () 구문에 문제가있을 경우 또는, () *를 사용할 수없는 경우에 유용하다. <br/>

속성 바인딩을 선언하려는 경우 다음을 수행 할 수 있다.

```javascript
<ns-pony [name]="pony.name"></ns-pony>
```

또는 정규 구문을 사용하여 표현할 수 있다. 

```javascript
<ns-pony bind-name="pony.name"></ns-pony>
```

이벤트 할당도 마찬가지 이다. 

```javascript
<button (click)="onButtonClick()">Click me!</button>
```

또는 정규 구문을 사용하여 표현할 수 있다. 

```javascript
<button on-click="onButtonClick()">Click me!</button>
```

```javascript
<input type="text" ref-name>
<button on-click="name.focus()">Focus the input</button>
```

```javascript
<input type="text" #name>
<button (click)="name.focus()">Focus the input</button>
```