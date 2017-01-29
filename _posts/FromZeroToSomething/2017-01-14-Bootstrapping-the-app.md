---
layout: post
title:  "Bootstrapping the app"
date:   2016-11-27 00:00:00
categories: FromZeroToSomething
comments: true
---

마지막으로 우리는 bootstrapModule 함수를 사용하여 앱을 실행해야 한다. 
해당 메소드는 platformBrowserDynamic 메소드에 의해 반환 된 오브젝트로 표시된다. <br/>
bootStrap 논리를 분리하기 위해 main.ts와 같은 다른 파일을 생성해보자. 

```javascript
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import { AppModule } from './app.module';
platformBrowserDynamic().bootstrapModule(AppModule);
```

우리는 아직 HTML 파일이 없다. 
index.html 이름의 파일을 생성해보자. 

```javascript
<html>
<head></head>
<body>
  <ponyracer-app>
   You will see me while Angular starts the app!
  </ponyracer-app>
</body>
</html>
```

이제 HTML 파일에 스크립트를 추가해야한다. 
AngularJS 1.x에서는 간단했다. angular.js 용 스크립트와 작성한 모든 JS 파일 용 스크립트를 추가하기 만하면 바로 사용할 수 있다. 
하지만 단점있다. 시작시에 모든 것이 정적으로 로드 되어야 했기 때문에 대규모 응용 프로그램의 시작 시간이 길어질 수 있다. <br/><br/>

Angular 2에서는 상황이 더욱 복잡해 지지만 복잡성에는 추가적인 힘이 따른다. <br/>
Angular는 이제 모듈 (ES6 모듈)에 번들로 제공되며 이러한 모듈은 동적으로로드 할 수 있습니다. <br/>
이전에 보았 듯이 우리의 앱은 모듈로 묶여 있습니다. <br/><br/>

몇 가지 문제가 있다. 
- ES5에서는 모듈이 존재하지 않고 브라우져에서는 오직 ES5를 지원한다. 
- ES6 설계자는 모듈을 정의하고 가져 오는 등의 방법을 지정하였다. 브라우저가 패키지화 하고 로드 하는 방법을 아직 지정되지 않았다. <br/><br/>

모듈을 로드 하려면 도구에 의존 해야한다. 
SystemJS는 소형 모듈 로더로써 HTML 페이지에 (정적으로) 추가하고 모듈이 서버에있는 위치를 알려주고 그 중 하나를 로드한다. 
모듈 사이의 의존성을 자동으로 파악하고, 애플리케이션에서 사용하는 모듈을 다운로드한다. <br/><br/>

이것은 JS 파일 다운로드의 bazillion으로 이어질 것이다.
개발하는 동안 괜찮 았지만 생산을 위해서는 문제점이 발생한다.  
다행스럽게도 SystemJS에는 여러 개의 작은 모듈을 더 큰 묶음으로 묶을 수있는 도구가 함께 제공된다. 
모듈이 필요할 때, 그 모듈을 포함한 번들 (그리고 다른 모듈들)이 다운로드가 발생한다. <br/><br/>

이 작업을 수행 할 수있는 유일한 도구는 아니며 원하는 경우 Webpack과 같은 다른 도구를 사용할 수도 있다. <br/><br/>

SystemJS를 설치해보자. 

```javascript
npm install --save systemjs
```

우리는 SystemJS를 정적으로 로드하고 부트 스트랩 모듈이 (메인에) 어디에 있는지 알려줄 필요가 있다. 
@angular와 같이 우리 애플리케이션의 의존성을 어디에서 찾을 지 알려줄 필요가 있다.
하지만 먼저 reflect-metadata와 zone.js를 포함 시켜야한다. 

```javascript
<html>
<head>
  <script src="node_modules/zone.js/dist/zone.js"></script>
  <script src="node_modules/reflect-metadata/Reflect.js"></script>
  <script src="node_modules/systemjs/dist/system.js"></script>
  <script>
   System.config({
   // we want to import modules without writing .js at the end
   defaultJSExtensions: true,
   // the app will need the following dependencies
   map: {
   '@angular/core': 'node_modules/@angular/core/bundles/core.umd.js',
   '@angular/common': 'node_modules/@angular/common/bundles/common.umd.js',
   '@angular/compiler': 'node_modules/@angular/compiler/bundles/compiler.umd.js',
   '@angular/platform-browser': 'node_modules/@angular/platformbrowser/bundles/platform-browser.umd.js',
   '@angular/platform-browser-dynamic': 'node_modules/@angular/platform-browserdynamic/bundles/platform-browser-dynamic.umd.js',
   'rxjs': 'node_modules/rxjs'
   }
   });
   // and to finish, let's boot the app!
   System.import('main');
  </script>
</head>
<body>
  <ponyracer-app>
   You will see me while Angular starts the app!
  </ponyracer-app>
</body>
</html>
```

