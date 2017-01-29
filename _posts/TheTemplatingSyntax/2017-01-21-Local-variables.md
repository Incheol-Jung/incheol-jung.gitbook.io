---
layout: post
title:  "Local variables"
date:   2017-01-21 00:00:00
categories: TheTemplatingSyntax
comments: true
---

Angular가 변수를 찾기 위해 구성 요소 인스턴스를 볼 것이라고 말하면 기술적으로 올바르지 않다. 
실제로 구성 요소 인스턴스와 로컬 변수를 검사한다. 
지역 변수는 #syntax를 사용하여 템플릿에서 동적으로 선언 할 수있는 변수이다.<br/>

입력 값을 표시한다고 가정해 보자. 

```javascript
<input type="text" #name>
{{ name.value }}
```

#syntax를 사용하여 DOM 개체 인 HTMLInputElement를 참조하는 로컬 변수 이름을 만든다.
이 로컬 변수는 템플릿의 어느 위치에서나 사용할 수 있다. 
value 속성을 가지므로 이 속성을 보간 된 표현식에 표시 할 수 있다. 나중에 이 예제로 돌아 오겠다.<br/><br/>

지역 변수의 또 다른 유용한 사용법은 다른 요소에서 어떤 종류의 액션을 실행하고자 할 때이다.<br/><br/>

예를 들어, 버튼을 클릭 할 때 요소에 포커스를 둘 수 있습니다. 
이는 AngularJS 1.x에서 사용자 지정 지시문을 작성해야했기 때문에 약간 번거로운 점이 있었다. 

focus () 메소드는 DOM API의 표준 부분이며이를 활용할 수 있고 지역 변수를 사용하면 Angular 2를 쉽게 접근 할 수 있다.

```javascript
<input type="text" #name>
<button (click)="name.focus()">Focus the input</button>
```

또한 사용자 정의 구성 요소 (응용 프로그램에서 작성한 구성 요소, 다른 프로젝트에서 가져온 구성 요소 또는 실제 웹 구성 요소)와 함께 사용할 수도 있다.

```javascript
<google-youtube #player></google-youtube>
<button (click)="player.play()">Play!</button>
```

여기에서 버튼은 <google-youtube> 구성 요소의 동영상 재생을 시작할 수 있다. 이것은 실제로 Polymer로 작성된 실제 웹 구성 요소이다! 
이 구성 요소에는 단추를 클릭 할 때 Angular가 호출하는 play () 메서드가 있다. <br/><br/>

지역 변수에는 몇 가지 유스 케이스가 있으며, 점진적으로 살펴 보겠습니다. 그 중 하나가 바로 다음 섹션에 설명되어 있습니다.<br/><br>