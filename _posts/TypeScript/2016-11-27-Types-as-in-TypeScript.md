---
layout: post
title:  "Types as in TypeScript"
date:   2016-11-27 00:00:00
categories: TypeScript
comments: true
---

TypeScript에서 유형 정보를 추가하는 일반적인 구문은 다소 간단합니다. 

```javascript
let variable: type;
```

이 유형들은 기억하기 쉽다. 

```javascript
const poneyNumber: number = 0;
const poneyName: string = 'Rainbow Dash';
```

이러한 경우에는 유형은 TS 컴파일러가 유형을 추측할 수 있기때문에 선택적이다. <br/>
유형은 다음의 Pony 클래스와 같이 당신의 앱에서 나올수 있다. 

```javascript
const pony: Pony = new Pony();
```

TypeScript는 일부 언어에서 "generic"으로 부르는것을 지원한다. 

```javascript
const ponies: Array<Pony> = [new Pony()];
```

해당 코드는 배열이 '<>' 이라는 일반적인 표기를 사용하여 ponies를 담을수 있다는 것을 의미한다. <br/>
당신은 이것에 대해 의문을 가질지 모른다. 유형 정보를 추가하는 것은 컴파일러가 가능한 실수를 판별하도록 도울수 있을 것이다. <br/>

```javascript
ponies.push('hello'); // error TS2345
// Argument of type 'string' is not assignable to parameter of type 'Pony'.
```

그래서, 만약 당신이 다양한 유형의 변수가 필요하다면 이것은 당신의 코드는 제대로 작성할수 없다는것을 의미하는가? 그렇지 않다. 왜냐하면 TS는 'any' 라고 불리우는 특별한 유형을 가지고 있기 때문이다.

```javascript
let changing: any = 2;
changing = true; // no problem
```

이것은 당신이 라이브러리에서 가져온 값이나 동적으로 생성된 컨텐츠에서 가져온 변수의 유형을 모를 경우에 굉장히 유용할 것이다.

만약 당신이 변수를 number 또는 boolean 유형으로 사용하고 싶을경우에는 union 을 이용해라.

```javascript
let changing: number|boolean = 2;
changing = true; // no problem
```