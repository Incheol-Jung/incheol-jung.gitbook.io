---
layout: post
title:  "Optional arguments"
date:   2016-11-27 00:00:00
categories: TypeScript
comments: true
---

또 Javascript의 다른 대안은 파라미터가 선택적이라는 것이다.  
당신은 파라미터를 누락시킬수 있고 그것들은 'undefined'로 정의될 것이다. 
그러나 당신이 유형이 정해진 파라미터로 정의했다면 컴파일러는 당신이 파라미터를 누락했다는 것을 표기할 것이다. 

```javascript
addPointsToScore(player); // error TS2346
// Supplied parameters do not match any signature of call target.
```

파라미터가 선택적이라는 것을 보여주기 위해 당신은 파라미터 뒤에 '?' 를 붙여주어야 한다. 
여기 points 라는 파라미터가 있다. 

```javascript
function addPointsToScore(player: HasScore, points?: number): void {
  points = points || 0;
  player.score += points;
}
```

