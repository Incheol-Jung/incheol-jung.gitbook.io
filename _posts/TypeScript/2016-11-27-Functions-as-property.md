---
layout: post
title:  "Functions as property"
date:   2016-11-27 00:00:00
categories: TypeScript
comments: true
---

당신은 변수 대신에 특정한 함수를 가져야만 하는 파라미터를 기술하는것에 흥미를 가질 것이다. 

```javascript
function startRunning(pony) {
  pony.run(10);
}
```

interface 선언은 이렇게 될 것이다. 

```javascript
interface CanRun {
  run(meters: number): void;
}
   function startRunning(pony: CanRun): void {
      pony.run(10);
   }
   const pony = {
      run: (meters) => logger.log(`pony runs ${meters}m`)
   };
   startRunning(pony);
```
