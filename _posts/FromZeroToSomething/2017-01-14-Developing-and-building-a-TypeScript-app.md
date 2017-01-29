---
layout: post
title:  "Developing and building a TypeScript app"
date:   2016-11-27 00:00:00
categories: FromZeroToSomething
comments: true
---

이제 우리의 첫번째 Angular 2 앱과 컴포넌트를 만들어 보도록 하자. 
당신은 이미 Node.js와 NPM을 설치하였을 것이다. 당신의 Node.js 버젼이 충분히 최신인지 확인하도록해라.(node --version) 
우리는 typescript 기반으로 앱을 개발할것이다. 그러므로 typescript를 설치해보도록 하자. 

```javascript
npm install -g typescript typings
```

그리고나서 연습을 위해서 빈 폴더를 새로 만들자, 그리고 tsc를 사용하여 빈 폴더에 프로젝트를 초기화 하도록 한다. tsc 는 typescript 컴파일러의 약자이다. 

```javascript
tsc --init --target es5 --sourceMap --experimentalDecorators --emitDecoratorMetadata
```

이제 typescript 컴파일 옵션을 정의한 tsconfig.json파일을 만들것이다. 
우리가 이전의 챕터에서 보았듯이 우리는 decorator를 가진 typescript를 사용하고 있고 우리는 우리의 코드가 모든 브라우져에서 동작하도록 
ECMASCRIPT 5로 변환되기를 원한다. 
sourceMap 옵션은 기존 사용자가 작성한 Typescript code와 생성된 ES5 코드를 연결시켜주는 소스의 맵을 생성해준다.
sourceMap은 디버그를 하기 위한 것으로 브라우져에 의해 사용되어 진다.<br/><br/>

우리는 선호하는 통합 개발환경을 사용하기를 원한다. 당신은 당신이 원하는 것을 매우 잘 알고 있을것이다. 
그러나 당신은 통합 개발환경에서 TypeScript 지원을 활성화해야 한다. ( typescript 1.5 이상을 사용하고 있는지 확인해야 한다. )<br/><br/>

```javascript
{
  "compilerOptions": {
   "target": "es5",
   "experimentalDecorators": true,
   "emitDecoratorMetadata": true,
   "sourceMap": true,
   "module": "commonjs",
   "noImplicitAny": false,
  },
  "exclude": [
   "node_modules"
  ]
}
```

기본으로 설정되어 있는 몇 가지 옵션들을 확인할 수 있을 것이다. 흥미로운 점은 module 옵션이다. 
module option은 우리가 작성한 코드가 commonjs 안으로 패키지될 것이라는 것을 설명한다. <br/><br/>

이제 우리는 typesciprt 컴파일러를 실행할 준비가 되었다. 가끔은 당신의 통합 개발 환경은 당신을 위해 수행될 것이다. 

```javascript
tsc --watch
```

당신은 이렇게 나오는 것을 살펴보아야 한다. 

```javascript
Compilation complete. Watching for file changes.
```

이 기능을 백그라운드에서 실행하고 다음에 제공 할 새로운 터미널을 열어도 된다. <br/><br/>

우리는 이제 Angular 2 라이브러리와 코드를 추가해야 한다. Angular 2 라이브러리를 위해 우리는 NPM 을 사용하여 다운받을 것이다. <br/>
몇가지 문제들을 회피하기 위해 우리는 npm version 3을 사용할 것이다. 당신의 npm version을 확인하도록 해라(npm -v)<br/>

```javascript
npm install --save @angular/core @angular/compiler @angular/common @angular/platformbrowser @angular/platform-browser-dynamic rxjs reflect-metadata zone.js
```

이제 packjage.json 파일을 살펴보도록 해라. 다음의 의존성이 포함되어 있을 것이다. <br/>
• the different @angular packages.
• reflect-metadata, as we are using decorators.
• rxjs, a really cool library called  RxJSfor reactive programming. We have a dedicated chapter on this topic.
• and finally, the  zone.jsmodule, doing the heavy lifting of running our code in isolated zones for detecting the changes (we’ll dive into this later also).

마지막으로 컴파일을 개선하기 위해 ES6와 연관된 typings를 설치해야 한다. 가장 쉬운 방법은 core-js를 설치하는 것이다. <br/>

```javascript
typings init
typings install --save --global dt~core-js
```

그리고 tsconfig.json 파일에 exculde 영역에 추가해라. 

```javascript
"exclude": [
  "node_modules",
  "typings/main.d.ts",
  "typings/main"
]
```