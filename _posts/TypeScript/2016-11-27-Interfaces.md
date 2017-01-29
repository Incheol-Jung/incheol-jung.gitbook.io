---
layout: post
title:  "Interfaces"
date:   2016-11-27 00:00:00
categories: TypeScript
comments: true
---

초기에 말하였듯이, 자바스크립트는 동적인 속성으로 굉장히 좋다. 
그래서 함수는 일치하는 변수를 가진 함수를 받는다면 정상적으로 동작할 것이다. 

```javascript
function addPointsToScore(player, points) {
  player.score += points;
}
```

함수는 score 변수를 가진 어떠한 객체에도 적용될 수 있을 것이다. typeScript는 어떻게 변환하는 것일까?
이것은 매우 간단하다. 당신은 object 유형을 정의하면 된다. 

```javascript
function addPointsToScore(player: { score: number; }, points: number): void {
  player.score += points;
}
```

해당 코드는 number 유형의 score 변수를 가진 파라미터여야 한다는 것을 의미한다. 당신은 이것을 interface로 정의 한것이다. 

```javascript
interface HasScore {
  score: number;
}
   function addPointsToScore(player: HasScore, points: number): void {
   player.score += points;
   }
```

