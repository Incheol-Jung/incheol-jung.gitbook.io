---
layout:     reference
title:      A gentle introduction to ECMASCRIPT 6
date:       2017-01-22 00:00:00
updated:    2017-01-22 00:00:00
categories: reference
summary:    A gentle introduction to ECMASCRIPT 6
---




## Transpilers

ES6는 마지막 단계에 도달해왔다. 그리고 그것은 모든 브라우져에서 완전히 지원되지 않는다. 
그리고, 몇몇 브라우져들은 이런 트렌드에 뒤쳐질 것이다. (만약 마이크로소프트가 엣지에서도 잘 동작한다 하더라도). 
만약 내가 사용할 수 있는 것에 대해 걱정한다고 하면 모든 브라우져에서 사용될 수 있는 것은 무엇인가? 라는 생각을 할지도 모른다. 
그리고 당신이 하는 생각이 맞다. 때문에 오래된 브라우져는 무시하는 앱 들이 많다. 그러나, ES 6를 사용하려는 JS 개발자들은 ES6 앱으로 만들기를 원한다. 
그리고 커뮤니티는 그에 대한 해답을 발견하였다. : a transpiler.<br/><br/>
Tanspiler는 모든 브라우져에서 동작할 수 있도록 ES6코드를 취합하여 ES5 코드로 변환해준다. 
그것은 심지어 브라우져에서 ES6 소스를 직접적으로 디버그를 허용해주는 소스맵 파일도 변환해준다. 
이 시점에서, ES6 코드를 변환해주는 두 가지 대안이 있다. 
-	Traceur, a Google project
-	Babeljs, 젊은 개발자로(글을 작성할 당시에 17세 였음)부터 시작된 프로젝트로 다양한 요소를 제공한다. 
각각은 장점과 단점을 가지고 있다. 예를 들어, Babeljs는 Traceur에 비해 가독성 있는 코드를 생성한다. 
그러나 Traceur는 구글 프로젝트로써 Angular와 함께 사용하였을 경우에 더욱 성능이 우수하다. 
Angular 2 소스코드는 TypeScript로 바뀌기 이전에는 Traceur을 사용하여 자체적으로 변환하였다. <br/><br/>
TypeScript는 Microsoft에서 개발된 오픈 소스 언어이다. 자바스크립트의 확장된 기능이다. 그러나 우리는 곧 그 세부적으로 파악해볼 것이다. 
솔직히 Babel은 Traceur보다 더욱 장점이 많다. 그래서 나는 Babel을 사용하라고 충고한다. Babel은 사실상 표준으로 빠르게 확산 되고 있다. 
그래서 만약 너가 ES6를 사용하기를 원한다면, 또는 너의 프로젝트에 적용하길 원한다면, transpilers를 살펴보고 빌드 과정중에 하나로 추가하도록 해라. 
이것은 너의 ES6 소스 파일을 동일한 ES5코드로 변환해줄것이다. 이것은 매우 잘 동작하지만 새로운 몇 가지 기능들은 ES5로 변환하는게 어렵거나 불가능할수도 있다. 
그러나, 현재 관점에서는 아무 걱정없이 사용하기에 충분하다. 그러므로 우리가 자바스크립트 안에서 할 수 있는 이런 새로운 것들을 살펴보도록 해라.



**************************************************************************************************



## Let

만약 당신이 JS를 사용해본적이 있다면, var 선언은 속임수라는 것을 알고 있다. 다양한 많은 언어에서, 변수는 선언하는 곳에서 정의되어진다. 
그러나 JS 컨셉에서는 당신이 나중에 호출을 하였더라도 변수를 선언한 함수의 최 상위에서 선언되는 “hoisting(끌어올리기)”으로 불리어진다.
만약 당신이 if 영역안에서 name을 호출하였다.<br/>

```javascript
function getPonyFullName(pony) {
	if(pony.isChampion){
		var name = 'Champion ' + pony.name;
	}
	return pony.name;
}
```

이것은 함수의 상위에 선언한 것과 동일하다. <br/>

```javascript
function getPonyFullName(pony) {
	var name;
	if(pony.isChampion){
		name = 'Champion ' + pony.name;
		return name;
	}
	// name is still accessible here
	return pony.name;
}
```

ES6는 변수 선언에 대해서 당신이 기대하는 것보다 훨씬 다양한 기능을 제공하는 “let” 이라는 새로운 방법을 소개하고 있다

```javascript
function getPonyFullName(pony) {
	if(pony.isChampion){
		let name = 'Champion ' + pony.name;
		return name;
	}
	// name is still accessible here
	return pony.name;
}
```

name 변수는 지금은 자신의 영역안에서 제한되어 있다. Let은 지속적인 사용하는 영역안에서 var를 대체하기 위해 소개되었다. 
그러므로 너는 오래된 var 단어를 제거하고 let을 대체하여 사용할 수 있다. 
더 좋은 것은 만약 너가 사용하지 않는다면 너의 코드에서 잘못된 어떠한 점을 지적당할 수 있다. 


**************************************************************************************************



## Constants

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

**************************************************************************************************



## Creating Objects

새로운 키워드는 아니지만 ES6코드를 읽고 있다면 당신의 시선을 사로잡을 것이다. 
지금은 당신이 변수로써 유용하게 사용되어질 만큼 Object 요소를 생성 하기를 원할 경우에 object를 생성하는 가벼운 요약 정리이다.
 
```javascript
function createPony() {
	const name = 'Rainbow Dash';
    const color = 'blue';
    return { name: name, color: color };
}
```
더욱 간단하게 정의할 수 있다. 

```javascript
function createPony() {
	const name = 'Rainbow Dash';
    const color = 'blue';
    return { name, color };
}
```



### css 중첩
- 미디어 쿼리와 같이 규칙 세트 내부에 다시 선언되는 구조에서는 1레벨 씩 추가하여 들여쓰기 합니다.

```scss
@media screen and (min-width: 750px) {
	html, body { font-size: 19px; }
	.measure {
		margin: 5rem;
		padding: 0 3rem;
	}
}
```

**************************************************************************************************


## Destructuring assignment

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


**************************************************************************************************


## Default parameters and values

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

**************************************************************************************************

## Rest Operator

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

**************************************************************************************************

## Classes

가장 상징적인 특징중에 하나이며 우리는 Angular app을 작성할 경우에 대단히 자주 사용할 것이다. 
ES6는 자바스크립트에 Classes를 소개하고 있다. 당신은 쉽게 class와 상속을 사용할 수 있다. 당신은 프로토타입 상속을 이용할 수 있다. 그러나 이것은 초보자에겐 쉽지 않은 작업이다. <br/>

```javascript
class Pony {
    constructor(color){
        this.color = color;
    }

    toString(){
        return '${this.color} pony';
        // set that? It is another cool feature of ES6, called template literals
        // we'll talk about these quickly!
    }
}

const bluePony = new Pony('blue');
console.log(bluePony.toString()); // blue pony

```

Class 선언은 함수 선언과 다르게 끌어당김이 아니다. 그래서 당신은 함수를 사용하기 이전에 선언할 필요가 있다. 당신은 특별한 constructor 함수를 선언해야할지 모른다. 
그것은 새로운 pony를 사용하려고 할 때 new 연산자와 함께 실행되어진다. Pony는 color가 필요하고 우리는 color가 “blue”로 구성된 color 를 가진 pony 인스턴스를 만든다. 
해당 클래스는 함수를 가지고 있고 toString()으로 되어 있다. 

```javascript
class Pony {
    static defaultSpeed() {
        return 10;
    }
}
```
정적인 함수는 클래스에서 바로 사용될수 있다. 

```javascript
const speed = Pony.defaultSpeed();
```
만약 당신이 연산자로 변수를 연결하길 원한다면 Class는 getter / setter를 가질 수 있다. 

```javascript
Class Pony {
    get color() {
        console.log('get color');
        return this._color;
    }

    set color(newColor) {
        console.log('set color ${newColor}');
        this._color = newColor;
    }
}
const pone = new Pony();
pony.color = 'red';
// set color red
console.log(pony.color);
// get color
// red
```

물론, 당신이 클래스를 가지고 있다면 당신은 ES6에서 상속을 사용할 수 있다. 

```javascript
class Animal {
    speed(){
        return 10;
    }
}
class Pony extends Animal {

}
const pony = new Pony();
console.log(pony.speed()); // 10, as Pony overrides the parent method
```
 
Animal은 기본 클래스이고, Pony는 파생된 클래스이다. 보시다시피, 파생된 클래스는 기본 클래스의 함수를 가지고 있다. 이것은 다시 재정의할 수 있다. 
 
 ```javascript
class Animal {
    speed(){
        return 10;
    }
}
class Pony extends Animal {
    speed(){
        return super.speed() + 10;
    }
}
const pony = new Pony();
console.log(pony.speed()); // 20, as Pony overrides the parent method
```

보시다시피, super라는 키워드는 기본 클래스의 함수를 호출하는 것을 허용한다. 
Super 키워드는 constructor안에서 사용될수있다. 기본 클래스 constructor 함수를 호출하는 것으로. 
  
```javascript
class Animal {
    constructor(speed) {
        this.speed = speed;
    }
}
class Pony extends Animal {
    constructor(speed, color){
        super(speed);
        this.color = color;
    }
}
const pny = new Pony(20, 'blue');
console.log(pony.speed); // 20
```

**************************************************************************************************



**************************************************************************************************



## Reference URL
- [BEM introduction](http://getbem.com/introduction/)
- [BEMIT(BEM을 기반으로 확장변형 시킨 네이밍 컨벤션)](http://csswizardry.com/2015/08/bemit-taking-the-bem-naming-convention-a-step-further/)
- [SMACSS](https://smacss.com/)