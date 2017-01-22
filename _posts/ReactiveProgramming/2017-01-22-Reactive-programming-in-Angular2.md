---
layout: post
title:  "Reactive programming in Angular 2"
date:   2017-01-22 00:00:00
categories: ReactiveProgramming
comments: true
---

Angular 2는 RxJS를 사용하며, 우리도 그것을 사용할 수 있다. <br/>
프레임 워크는 Observable 객체 주위에 어댑터를 제공한다. : EventEmitter. EventEmitter에는 이벤트에 반응하는 subscribe () 메소드가 있으며 메소드는 세 개의 매개 변수를 수신 할 수 있다.<br/>
• 사건에 대응하는 방법.<br/>
• 오류에 대응하는 방법.<br/>
• 완료시 반응하는 방법.<br/>
EventEmitter는 emit () 메서드를 호출하여 이벤트를 내보낼 수 있다.<br/>

```javascript
const emitter = new EventEmitter();
emitter.subscribe(
  value => console.log(value),
  error => console.log(error),
  () => console.log('done')
);
emitter.emit('hello');
emitter.emit('there');
emitter.complete();
// logs "hello", then "there", then "done"
```

subscribe 메소드는 subscribe 또는 unsubscribe 메소드 등을 사용하여 subscription 객체를 반환한다.

```javascript
const emitter = new EventEmitter();
const subscription = emitter.subscribe(
  value => console.log(value),
  error => console.log(error),
  () => console.log('done')
);
emitter.emit('hello');
subscription.unsubscribe(); // unsubscribe
emitter.emit('there');
// logs "hello" only
```

이제는 반응 형 프로그래밍과 EventEmitter에 대해 조금 더 알아 보았으므로 Angular 2에서 사용하는 방법을 살펴 보도록 하자.

