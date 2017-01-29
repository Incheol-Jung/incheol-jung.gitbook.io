---
layout: post
title:  "Destructuring assignment"
date:   2016-11-19 00:00:00
categories: ECMASCRIPT6
comments: true
---


이것은 object나 배열들로부터 변수를 할당하는 방법에 대한 간단한 요약 정리이다.

In ES5:

```javascript
function httpOptions = { timeout: 2000, isCache: true };
// later
var httpTimeout = httpOptions.timeout;
var httpCache = httpOptions.isCache;
```

Now, in ES6, you can do:

```javascript
const httpOptions = { timeout: 2000, isCache: true };
// later
const{ timeout: httpTimeout, isCache: httpCache} = httpOptions;
```


그리고 당신은 같은 결과를 얻을 수 있을 것이다. 이것은 Object 내부의 요소를 키 값으로 사용할 경우에나 변수를 할당할 경우에 약간의 불안감을 줄 수 있다. 
그러나 당신이 간단하게 작성한 요소를 같은 이름의 변수로 선언하길 원할 경우에 이것은 굉장하다.

```javascript
const httpOptions = { timeout: 2000, isCache: true };
// later
const{ timeout, isCache} = httpOptions;
// you now have a variable named 'timeout'
// and one named 'isCache' with correct values
```

굉장한 것은 내부의 object를 포함한 것도 또한 정상적으로 동작한다. 

```javascript
const httpOptions = { timeout: 2000, isCache: true };
// later
const{ timeout, isCache} = httpOptions;
// you now have a variable named 'chortTimeout' with value 1000
// and a variable named 'mediumTimeout' with value 2000
```

그리고 이러한 배열들도 가능하다. 
 
물론 배열 안에 배열 또한 object안에 배열이 있는 것 등등 도 정상적으로 동작한다. 
한가지 흥미로운 것은 변수들을 다양한 방법으로 돌려줄 수 있다는 것이다. race안에 위치와 pony를 돌려주는 randomPonyInRace 함수를 상상해보아라. 

```javascript
function randomPonyInRace(){
    const pony = { name: 'Rainbow Dash' };
    const position = 2;
    // ...
    return { pony, position };
}

const { position, pony } = randomPonyInRace();
```
 
변수의 위치에 해당하는 함수의 의해 돌려받는 위치를 할당해주는 기능은 새롭게 사라진 기능이다. 만약 너가 위치에 대해 상관하지 않는다면 너는 작성할수 있다. 

```javascript
function randomPonyInRace(){
    const pony = { name: 'Rainbow Dash' };
    const position = 2;
    // ...
    return { pony, position };
}

const { pony } = randomPonyInRace();
```

그리고 너는 오직 pony를 가질 것이다. 
