---
layout: post
title:  "Working with other libraries"
date:   2016-11-27 00:00:00
categories: TypeScript
comments: true
---

JS로 작성된 외부 라이브러리로 작업 할 대, 그 라이브러리에서 어떤 유형의 파라미터가 예상되는지 알지 못하기 때문에 우리는 운명으로 생각할지 모른다. 
TypeScript의 강점중 하나입니다.
해당 멤버는 일반적인 자바 스크립트 라이브러리에 의해 노출 된 유형과 함수를 위한 인터페이스를 정의하였다. 

인터페이스가 포함된 파일에는 특별한 확장자(".d.ts")가 있다.
그들은 라이브러리의 함수의 리스트를 포함한다. 
이 파일을 찾는 좋은 장소는 DefinitelyTyped 이다. 
예를 들어, 만약 당신이 Angularjs 1 버젼의 프로젝트에서 ts 파일을 사용하였다면 
당신은 npm을 사용하여 적절한 파일을 다운 받을 수 있다. 

```javascript
npm install --save-dev @types/angular
```

또는 수동으로 다운받을 수 있다. 그러면 해당 파일은 당신의 코드 상단에 포함될 것이고, 컴파일 체크를 할 수 있을 것이다. 

```javascript
/// <reference path="angular.d.ts" />
angular.module(10, []); // the module name should be a string
// so when I compile, I get:
// Argument of type 'number' is not assignable to parameter of type 'string'.
```

/// <reference path="angular.d.ts" /> 는 TS에 의해 특별하게 선언된 주석으로 컴파일러에게 인터페이스 angular.d.ts를 찾으라는 것을 의미한다. 
이제 당신이 AngularJS 함수를 잘못 사용하였다면 동적으로 실행될 필요 없이 컴파일러는 알려줄 것이고 당신은 해당 영역을 고칠수 있다. 
컴파일러는 node_modules 폴더에 종속물로 패키지 되어 있을 경우에는 인터페이스를 자동으로 발견할수 있다. 
점점 더 많은 프로젝트 들이 해당 방식을 채택하고 있으며 Angular 2 또한 그렇다. 
그래서 당신의 프로젝트에 인터페이스를 포함하는것에 대해서 걱정할 필요가 없다. 당신이 NPM을 사용하여 의존성을 유지한다면 TS 컴파일러는 자동으로 확인할 것이다. 

