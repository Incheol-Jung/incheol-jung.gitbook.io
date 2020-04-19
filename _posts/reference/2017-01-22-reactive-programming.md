---
layout: reference
title: CHAPTER 8. Reactive Programming
date: '2017-01-22T00:00:00.000Z'
updated: '2017-01-22T00:00:00.000Z'
categories: reference
summary: Reactive Programming
navigation_weight: 8
---

# 2017-01-22-Reactive-Programming

## Call me maybe

최근에는 반응 형 또는 기능 형 반응 프로그래밍에 대해 들어 보셨을 것이다. Reactive Extensions 라이브러리가있는 .Net과 같이 여러 언어로 된 플랫폼에서 꽤 유명 해졌으며 이제는 거의 모든 언어 \(RxJava, RxJS 등\)에서 사용할 수 있다.

리 액티브 프로그래밍은 새로운 것이 아니다. 이벤트를 사용하여 앱을 제작하고 이에 대응하는 방식이다. 따라서 이벤트는 작성, 필터링, 그룹화 등의 작업을 할 수 있다. 지도, 필터, 그래서 ... 때때로 "기능적 반응 형 프로그래밍"이라는 용어를 찾는 이유이다.  
하지만, 반응성 프로그래밍은 실제 프로그래밍이 아니다. 불변성, 부작용의 결여 등의 개념을 반드시 포함하지는 않는다. 이벤트에 반응하는 것은 당신도 할 수있는 일이다.  
  


• 브라우저에서는 사용자 이벤트에 리스너를 설정할 때  
 • 백엔드 쪽에서는 메시지 버스에서 오는 이벤트에 반응할 때  


리 액티브 프로그래밍에서는 들어오는 모든 데이터가 스트림에 있게 된다. 이러한 스트림은 물론 \(필터된 데이터, 병합된 데이터 등\) 수정 될 수 있으며, 들을 수 있는 새로운 스트림이 될 수도 있다. 메서드 호출의 결과에 대해 크게 걱정할 필요가 없다. 이벤트를 발생 시키면 이 비즈니스에 관심있는 앱의 모든 부분이 적절하게 반응한다. 그리고 아마 이 부분들 중 하나가 이벤트로 올릴 것입니다.  
  


Angular 2와 관련된 내용인가?  


Angular 2는 리 액티브 프로그래밍을 사용하여 구축되어 있으며, 일부 부분에서도 이 기술을 사용된다.  
 HTTP 요청에 반응하고 있는가? 리 액티브 프로그래밍.   
 구성 요소의 사용자 정의 이벤트를 생성하는가? 리 액티브 프로그래밍.   
 양식의 가치의 변화를 다루는가? 리 액티브 프로그래밍  
  


이 주제에 대해서 더욱 집중할 것이다. 다루기가 힘들지는 않지만 이 문제에 대해 명확한 이해를 하는것은 중요하다.

## General principles

리 액티브 프로그래밍에서는 모든 것이 스트림이다. 스트림은 순서가 지정된 이벤트 시퀀스이다. 이 이벤트는 값 \(모양, 다른 값!\), 오류 \(잘못됨\) 또는 완료 이벤트를 나타낸다. 이 모든 것은 데이터 생성자에서 소비자로 푸시된다. 개발자는 세 가지 가능성을 처리 할 수 있는 리스너를 정의하는 등 이러한 스트림을 구독 해야한다. 그런 청취자는 관측자, 관측 가능한 관측소라고 불린다. 이 용어는 오래전에 만들어 졌는데, 잘 알려진 디자인 패턴 인 옵서버 패턴 이다.  
  


둘 다 비동기 값을 처리하기 때문에 조금 비슷하게 보일지라도 약속과 다르다. 그러나 관찰자는 약속과 같은 일회성이 아니고 '완료'이벤트를 수신 할 때까지 계속 감지 하고 있다.  
  


현재 Observables는 가능 항목은 공식 ECMAScript 사양의 일부는 아니지만, 표준화를 위한 노력이 있기 때문에 향후 버전의 일부가 될 것이다.  


Observables는 배열과 유사하다. 배열은 관측 가능한 것과 같은 값의 집합이라고 할수 있다. 관측 가능 \(observable\)은 시간의 흐름에 따라 값의 개념 만 추가된다. 배열의 모든 값을 한번에 갖지만 값은 시간이 지남에 따라 관찰 할 수 있다.

JavaScript에서 가장 인기있는 반응 형 프로그래밍 라이브러리는 RxJS입니다. Angular 2도 의존하는 것있고 우리도 사용하고 있다.

## RxJS

배열에 담긴 것과 모든 같이 관측 가능한 것은 함수를 사용하여 변환 할 수 있다 :  
 • take \(n\)은 처음 n 개의 이벤트 \(예를 들어 처음 5 개\)을 선택한다.  
 • map \(fn\)은 각 이벤트에 적용되어 결과를 반환한다.  
 • filter \(술어\) 술어를 충족 이벤트 만 통과 시킨다.  
 • reduce \(fn\)은 모든 이벤트에 적용되고 스트림을 단일 값으로 줄인다.  
 • merge \(s1, s2\)는 스트림을 병합한다.  
 • subscribe \(fn\)은 수신 한 각 이벤트에 적용된다.  


따라서 숫자의 배열을 취하여 각각에 2를 곱하고 5보다 작은 값을 필터링하여 인쇄하면 할 수 있다.

```javascript
[1, 2, 3, 4, 5]
  .map(x => x * 2)
  .filter(x => x > 5)
  .forEach(x => console.log(x)); // 6, 8, 10
```

RxJS는 배열에서 관측 가능을 구축한다. 보시다시피, 우리는 똑같은 일을 할 수 있다.

```javascript
Observable.from([1, 2, 3, 4, 5])
  .map(x => x * 2)
  .filter(x => x > 5)
  .subscribe(x => console.log(x)); // 6, 8, 10
```

그러나 관측 대상은 컬렉션 이상이다. 시간이 지남에 따라 이벤트가 도착하는 비동기 컬렉션이다. 좋은 예가 브라우저 이벤트이다. 시간이 지남에 따라 일어날 수 있으므로 관찰 가능한 것을 사용할 수있는 좋은 후보가 된다. 다음은 jQuery를 사용한 예제이다.

```javascript
const input = $('input');
Observable.fromEvent(input, 'keyup')
  .subscribe(() => console.log('keyup!'));
input.trigger('keyup'); // logs "keyup!"
input.trigger('keyup'); // logs "keyup!"
```

물론 함수에서 AJAX 요청, 브라우저 이벤트, 웹 소켓 응답, 약속 등을 통해 관찰 할 수있는 것을 만들 수 있다.

```javascript
const observable = Observable.create((observer) => observer.next('hello'));
observable.subscribe((value) => console.log(value));
// logs "hello"
```

Observable.creat는 매개 변수로 주어진 옵저버에서 이벤트를 방출하는 함수를 만들어 보자. 여기에서는 단순히 데모를 위한 하나의 이벤트만 내보낸다.  


관찰 내용이 잘못 될 수 있기 때문에 오류를 처리 할 수도 있고 subscribe 메소드는 오류를 처리하도록 설계된 다른 콜백을 사용할 수 있다.  


여기서 map 메소드는 예외를 throw하므로 subscribe 메소드의 두 번째 핸들러 로그를 기록한다.  


```javascript
Observable.range(1, 5)
  .map(x => {
   if (x % 2 === 1) {
   throw new Error('something went wrong');
   } else {
   return x;
   }
  })
  .filter(x => x > 5)
  .subscribe(x => console.log(x), error => console.log(error)); // something went wrong
```

관찰 가능이 완료되면 세 번째 처리기로 잡을 수 있는 완료 이벤트를 내보낸다.  
 여기에서 우리가 이벤트를 생성하기 위해 사용하는 범위 메서드는 1에서 5까지 반복 한 다음 'completed'신호를 내보낸다.  


```javascript
Observable.range(1, 5)
  .map(x => x * 2)
  .filter(x => x > 5)
  .subscribe(x => console.log(x), error => console.log(error), () => console.log('done'
));
// 6, 8, 10, done
```

그리고 당신은 관찰 할 수있는 많은 것들을 할 수 있다 :  
 • transformation \(delaying, debouncing…\)  
 • combination \(merge, zip, combineLatest…\)  
 • filtering \(distinct, filter, last…\)  
 • maths \(min, max, average, reduce…\)  
 • conditions \(amb, includes…\)  


당신이 더 많은 것을 알고 싶다면 책이 필요할 것입니다! Rx Book을 확인해 보아라.  
 이 주제에는 내가 찾은 최고의 소개가 포함되어 있다. 각 기능이 무엇을 하는지 시각적으로 잘 나타내려면 rxmarbles.com을 방문 하여라.  


## Reactive programming in Angular 2

Angular 2는 RxJS를 사용하며, 우리도 그것을 사용할 수 있다.   
 프레임 워크는 Observable 객체 주위에 어댑터를 제공한다. : EventEmitter. EventEmitter에는 이벤트에 반응하는 subscribe \(\) 메소드가 있으며 메소드는 세 개의 매개 변수를 수신 할 수 있다.  
 • 사건에 대응하는 방법.  
 • 오류에 대응하는 방법.  
 • 완료시 반응하는 방법.  
 EventEmitter는 emit \(\) 메서드를 호출하여 이벤트를 내보낼 수 있다.  


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

## Reference URL

* [Become a NINJA with Angular 2](https://books.ninja-squad.com/public/samples/Become_a_ninja_with_Angular2_sample.pdf)
* [Learn Angular 2](http://learnangular2.com/)
* [Angular 2 Component](https://www.tutorialspoint.com/angular2/)
* [An Introduction to Angular 2](http://angular-tips.com/blog/2015/05/an-introduction-to-angular-2/)

