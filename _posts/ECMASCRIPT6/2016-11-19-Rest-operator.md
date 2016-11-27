---
layout: post
title:  "Rest Operator"
date:   2016-11-19 00:00:00
categories: ECMASCRIPT6
comments: true
---
ES6는 함수내에서 변수 선언하는 새로운 방식을 소개한다. 이전 부분에서도 언급하였듯이, 당신은 함수에 그 외에 파라미터를 넘길 수 있다. 그리고 특별한 변수들을 사용한 것들을 얻을 수 있다. <br/>

```javascript
function addPonies(ponies){
    for (var i=0; i<arguments.length; i++){
        poniesInRace.push(arguments[i]);
    }
}

addPonies('Rainbow Dash', 'Pinkie Pie');
```

그러나 우리가 나쁘지도 않고 명백하지도 않는다는 것을 동의한다고 생각한다. Poines 파라미터를 절대 사용되지 않았기 때문에 우리는 어떻게 몇몇의 ponies를 넘겨야 할지 알고 있는가?<br/>
ES6는  …을 사용하여 우리에게 더 나은 문법을 제공한다.<br/>

```javascript
function addPonies(...ponies){
    for (let pony of ponies){
        poniesInRace.push(pony);
    }
}
```
 
Poines는 이제 우리가 반복할수 있는 배열이다. For … of 구조는 반복문을 위해 사용되어져있다. ES6에서 새로운 특징으로 추가되었다. 이것은 집합 변수들을 반복하는 것도 허용한다. 
그리고 for … in으로써 사용할 수도 있다. 우리의 코드가 더 아름답고 명확하는것에 동의 하는가?<br/>
 나머지 연산자는 감소하는 데이터를 사용할때도 동작한다. <br/>

```javascript
const [winner, ...losers] = poniesInRace;
// assuming 'poniesInRace' is an array containing serveral ponies
// 'winner' will have the first pony,
// and 'losers' will be an array of the others cones
```

나머지 연산자는 확산 연사자와 혼동되지 않는다. 나는 당신에게 굉장히 비슷한 코드를 보여줄 것이다. 그러나 확산 연산자는 정 반대이다.
 이것은 배열을 가져올 수 있고 가치있는 의미있는 파라미터안에서 그것을 확산한다. 이예제는 최소값, 최대값 같은 함수로 사용될수 있다. 
 너는 아마도 배열을 호출하길 원할지도 모른다. <br/>
 
```javascript
const ponyPrices = [12,3,4];
const minPrice = Math.min(...ponyPrices);
```