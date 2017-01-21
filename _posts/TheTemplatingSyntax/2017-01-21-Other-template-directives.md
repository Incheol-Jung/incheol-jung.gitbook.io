---
layout: post
title:  "Other template directives "
date:   2017-01-21 00:00:00
categories: TheTemplatingSyntax
comments: true
---

다른 두 개의 지시문은 템플릿을 작성할 때 유용 할 수 있지만 방금 본 것과 같은 구조 지시문은 아니다. 이러한 지시문은 표준 지시문이다.

- NgStyle<br/><br/>

우리는 이미 우리가 요소의 스타일에 따라 행동 할 수 있음을 보았다.

```javascript
<p [style.color]="foreground">Friendship is Magic</p>
```

동시에 여러 스타일을 설정해야하는 경우 ngStyle 지시문을 사용할 수 있습니다.

```javascript
<div [ngStyle]="{fontWeight: fontWeight, color: color}">I've got style</div>
```

지시문은 키가 스타일을 설정할 객체를 기대한다. 키는 camelCase (fontWeight) 또는 대시 ( 'font-weight') 중 하나 일 수 있다.

- NgClass<br/><br/>

같은 문맥으로 클래스 지시어를 사용하면 요소를 동적으로 클래스에 추가하거나 제거 할 수 있다.
스타일은 속성 바인딩을 사용하여 하나의 클래스를 설정할 수 있다.

```javascript
<div [class.awesome-div]="isAnAwesomeDiv()">I've got style</div>
```

또는 여러 항목을 동시에 설정하려는 경우 ngClass를 사용할 수 있다. 

```javascript
<div [ngClass]="{'awesome-div': isAnAwesomeDiv(), 'colored-div': isAColoredDiv()}">I've got style</div>
```