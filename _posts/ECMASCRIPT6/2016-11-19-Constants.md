---
layout: post
title:  "Constants"
date:   2016-11-19 00:00:00
categories: ECMASCRIPT6
comments: true
---


새로운 키워드 & 변수들에 대한 주제로써, 또 하나의 흥미로운 것이 있다. ES6는 constants를 선언하기 위해 const를 소개하고 있다. 
당신이 const를 사용하여 변수를 사용하게된다면, 그것은 초기화되어질 것이다. 그리고 당신은 후에 어떠한 값도 할당하지 못할 것이다.  

```javascript
const poniesInRace = 6;
poniesInRace = 7;
```

Let을 사용하여 변수를 선언한다면, constants는 블록 단계에서 오직 정의되어 질것이고 상위에서 선언되어 있지 않을 것이다. 
당신이 놀랄만한 사소한 한가지는 당신은 object와 함께 constants를 초기화할 수 있고, 추후에는 object를 수정할 수도 있다. 
 
```javascript
const PONY = {};
PONY.color = 'blue'; //works
```

그러나 당신은 다른 object를 할당할 수는 없다. 

```javascript
const PONY = {};
PONY = {color = 'blue'}; //SyntaxError
```
 
배열들도 같은 이유이다. 

```javascript
const PONIES = [];
PONIES.push({color : 'blue'}); //works

PONIES = []; //SyntaxError
```