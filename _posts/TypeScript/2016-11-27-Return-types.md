---
layout: post
title:  "Return types"
date:   2016-11-27 00:00:00
categories: TypeScript
comments: true
---

당신은 함수의 반횐되는 유형을 설정할 수 있다. 

```javascript
function startRace(race: Race): Race {
  race.status = RaceStatus.Started;
  return race;
}
```

만약 한수가 아무것도 반환하지 않는다면 'void'를 사용하여 보여주면 된다. 

```javascript
function startRace(race: Race): void {
  race.status = RaceStatus.Started;
}
```