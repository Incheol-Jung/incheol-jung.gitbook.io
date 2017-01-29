---
layout: post
title:  "Values"
date:   2016-11-19 00:00:00
categories: ECMASCRIPT6
comments: true
---
자바스크립트의 특징 중 하나는 개발자가 파라미터의 개수를 아무렇게나 사용하여 함수를 실행하여도 허용한다는 것이었다 : <br/>
-	만약 당신이 파라미터의 개수보다 더 많은 파라미터를 넘긴다면, 나머지 파라미터 들은 무시되어 질 것이다. ( 당신은 특별한 변수들과 함께 사용할 수 있을 것이다. )
-	만약 당신이 파라미터의 개수보다 더 적은 파라미터를 넘긴다면, 부족한 파라미터들은 undefined로 할당될 것이다.
두 번째 경우는 우리에게 가장 관련 있는 경우이다. 파라미터가 선택적일 경우에 우리는 주로 적은 파라미터들을 넘긴다. <br/><br/>

```javascript
function getPonies(size, page){
    size = size || 10;
    page = page || 1;
    // ...
    server.get(size, page);
}
```

선택적인 파라미터들은 주로 기본 값들을 가지고 있다. OR 기호는 만약 왼쪽의 변수가 undefined일 경우에 기호의 오른쪽 변수를 넘길 것이다. 만약 파라미터가 정확하게 공급되지 않는 다면 해당 경우에는 
0,false,””이 될 것이다. 이 속임수를 사용하여 getPoines 함수는 다음과 같이 호출될 것이다. <br/><br/>


```javascript
getPonies(20, 2);
getPonies(); // same as getPonies(10, 1);
getPonies(15); // same as getPonies(15, 1);
```

이것은 정확하게 동작하겠지만 함수 body를 읽지 않은 상태에서 기본 값을 가지고 있는 선택적인 변수들은 명백하지는 않을 것이다. ES6는 기본 파라미터를 가질 수 있는 더 유용한 방법을 소개한다. <br/><br/>

```javascript
function getPonies(size = 10, page = 1){
    // ...
    server.get(size, page);
}
```

만약 완벽히 정의되지 않았다면 size 파라미터는 10이 될 것이고 Page parameter는 1이 될 것이다.<br/>
-	NOTE : 작은 차이가 있다. 만약 0 또는 “” 값이 유요한 값들이라면 이것은 하나의 기본값으로 size = size || 10 으로 작성되어 지었듯이 변경될 것이다. 이것은 size = size === undefined ? 10 : size; 로 정의된 것과 같다. 
기본 값은 함수 실행이 될 수도 있다. <br/><br/>

또는 다른 변수들, 전역 변수들, 또는 함수의 다른 파라미터들<br/>

```javascript
function getPonies(size = defaultSize(), page = size - 1){
    // if page is not provided, it will be set to the value
    // of the size parameter minus one.
    // ...
    server.get(size, page);
}
```

만약 당신이 오른쪽 파라미터에 접근 하기를 원한다면, 함수의 파라미터는 항상 undefined 일것이다. <br/>

```javascript
function getPonies(size = page, page = 1){
    // size will always be undefined, as the page parameter is on its right
    server.get(size, page);
}
```

파라미터에 대한 원리는 변수들에 적용될 수 있다. 만약 감소된 할당을 사용한다면 <br/>

```javascript
const { timeout = 1000 } = httpOptions;
// you now have a variable named 'timeout'
// with the value of 'httpOptions.timeout' if it exists
// or 1000 if not
```