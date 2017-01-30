---
layout:     reference
title:      From zero to something
date:       2017-01-22 00:00:00
updated:    2017-01-22 00:00:00
categories: reference
summary:    From zero to something
---


## Developing and building a TypeScript app

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


**************************************************************************************************


## Our first component

app.component.ts로 불리우는 파일을 생성하라.<br/><br/>

파일을 저장할 경우에, 디렉토리에 app.component.ts라는 새 파일이 나타날것이다. 
이것은 typeScript compoiler가 수행하는 것이다. 
당신은 소스 맵 파일을 확인해야 할 것이다. 만약에 그렇지 않는다면 컴파일러가 중단시킬 수 있을 것이다. <br/><br/>

우리가 이전에 살펴본 섹션에서 컴포넌트는 template의 조합이라고 하였고 어떤 로직이라고 하였다. <br/>
클래스를 생성해보자. <br/>

```javascript
export class PonyRacerAppComponent {
}
```

Angular를 설명하기 위해 우리는 @Component decorator를 사용할 것이다. 이것을 사용하기 위해서는 import 해야한다. 

```javascript
import { Component } from '@angular/core';
@Component()
export class PonyRacerAppComponent {
}
```

IDE에서 지원하는 경우 Angular 2 종속성은 node_modules 디렉토리에 자체 d.ts 파일이 있으므로 코드 완성이 동작해야 하며 typeScript 가 이를 감지 할 수 있습니다. <br/>
원하는 경우에는 정의한 파일의 경로로 이동할 수 있습니다. <br/><br/>

typeScript는 유형 체크 테이블을 사용하여 당신이 어떠한 유형을 실수하였는지 확인할 수 있다. <br/>
그러나 오류가 반드시 차단되는 것은 아니다. 만약 당신이 변수에 유형을 추가하는것을 잊었다면 코드는 적절히 자바스크립트로 동작할 것이다.<br/><br/>

나는 typescript 에러를 0으로 나오도록 시도할 것이다. 그러나 당신은 하고 싶은 대로 해도 된다. 
우리가 소스맵을 사용하여 당신은 ts code를 브라우져에서 바로 확인할 수 있으며 당신의 앱에 중단점을 설정하여 디버깅을 할 수도 있다. <br/><br/>

@Component decorator는 객체의 구성 설정이다. 우리는 당신이 설정한 정보를 @Component 내부에서 확인할 수 있다. 
"selector" 이것은 HTML 페이지에서 어떤 태그로 쓰일지를 알려준다. 

```javascript
import { Component } from '@angular/core';
@Component({
  selector: 'ponyracer-app'
})
export class PonyRacerAppComponent {
}
```

!! 한가지 주의할 점은 selector의 명확한 네이밍 규칙은 존재하지 않는다는 것이다. 
그러나 만약 다른 프로그래머에게 당신의 component를 설명한다고 한다면 namespace-component를 사용하기를 권장한다. 
왜냐하면 selecotr는 유일해야하고 태그를 좀 더 명확하게 사용하기 위한 간단한 팁이라고 할수 있다. <br/><br/>

```javascript
import { Component } from '@angular/core';
@Component({
  selector: 'ponyracer-app',
  template: '<h1>PonyRacer</h1>'
})
export class PonyRacerAppComponent {
}
```

당신은 @angular/code 모듈을 가장 많이 사용할 것이다. 그러나 이것은 항상 필요한 것은 아니다. 
예를들어 http 를 사용하기 위해서는 @angular/http 가 필요하고 router를 사용하기 위해서는 @angular/router가 필요하다. 


**************************************************************************************************

## Our first Angular module

Angular 모듈은 이전에 교차 한 ES6 모듈과는 다르다. <br/><br/>

당신의 어플레이션은 root module 을 가지고 있으므로 최소 하나의 모듈은 가지고 있을것이다.
후에는 다양한 모듈을 추가할 것이다. 예를 들어, 모든 구성 요소와 로직을 포함하는 응용 프로그램의 Admin 부분 전용 모듈을 추가 할 수도 있다. <br/>
우리는 또한 외부 라이브러리를 사용하여 우리의 앱에 외부 모듈을 추가할 수 도 있다. <br/><br/>

Angular app에 모듈을 추가하기 위해서는 Class를 생성해야 한다. 주로 해당 작업은 루트 오듈의 app.module.ts라는 별개의 파일에서 수행된다. <br/>
해당 클래스는 @Ngmodule로 장식된다. 

```javascript
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
@NgModule({
  imports: [BrowserModule],
})
export class AppModule {
}
```

우리가 브라우져에 앱을 빌드할 경우에 root module은 BrowserModule을 추가할 것이다. 
이것은 Angular2에만 가능한 것은 아니다. 당신은 예제를 위해 서버에 앱을 렌더링 할수 있는 선택을 할 수 있다. 
BrowserModule은 component, directive, pipe로 사용되어 질 수 있다. 
당신이 해당 모듈을 추가하였을 경우에 당신은 가져온 모듈에서 내 보낸 모든 지시문, 구성 요소 및 파이프를 모듈에서 사용할 수 있다. 
root 모듈은 import 되어질 수 없기 때문에 exports를 가지고 있지 않지만 여러개를 추가할 수는 있다. <br/><br/>

해당 기술은 초보자에게는 친숙하지 않는다. 우리는 첫 번째 장에서 ES6 및 TS 모듈에 대해 이야기를 하였다. 이 모듈은 import, export를 정의한다. 
그리고 우리는 Angular 모듈에 대해서 이야기 하고 있다.  <br/><br/>

ES6 또는 TS import 기능은 Java의 import 문과 같은 문자와 같이 사용하여 가져올 수 있다.
이것은 당신의 소스코드에 classes/function등을 import 할 수 있다. 이것은 또한 bundler 또는 모듈 로더(Webpack or SystemJS)를 위한 위존성을 정의할 수 있다. 
만약 a.ts가 로드되어졌다면 b.ts는 a.ts에서 사용되어 지므로 우선적으로 로드되어야 한다.
Angular 또는 기타 프레임 워크를 사용하느지 여부에 관계없이 ES6 및 TypeScript로 가져오기 및 내보내기를 사용해야한다. <br/><br/>

그러나 자신의 Angular 모듈 (AppModule)에서 Angular 모듈 (예 : BrowserModule)을 가져 오는 것은 기능적 의미가 있다. 
BrowserModules에서 내보내는 모든 구성 요소, 지시문 및 파이프는 Angular 구성 요소 / 템플릿에서 사용할 수 있어야합니다.
이것은 TypeScript 컴파일러에서는 특별한 의미가 없다는 것을 의미한다. <br/><br/>

```javascript
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { PonyRacerAppComponent } from './app.component';
@NgModule({
  imports: [BrowserModule],
  declarations: [PonyRacerAppComponent],
})
export class AppModule {
}
```

이것이 루트 모듈이므로 Angular에 어떤 구성 요소가 루트 구성 요소 (즉, 앱을 부트 스트랩 할 때 시작될 구성 요소)인지 알려줄 필요가 있습니다. 
이것이 설정 객체의 부트 스트랩 필드가 필요한 것입니다.

```javascript
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { PonyRacerAppComponent } from './app.component';
@NgModule({
  imports: [BrowserModule],
  declarations: [PonyRacerAppComponent],
  bootstrap: [PonyRacerAppComponent]
})
export class AppModule {
}
```


**************************************************************************************************

## Bootstrapping the app

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


**************************************************************************************************


## From zero to something better with angular-cli


실제 프로젝트에서는 다음과 같은 몇가지를 설정해야 한다. 
- 우리가 일을 깨뜨리지 않는지 확인하는 몇 가지 테스트
- 빌드 도구, 다양한 작업 (컴파일, 테스트, 패키지 등)을 조율 할 수 있습니다. <br/><br/>

일이 어떻게 진행되는지 이해하기 위해 한 번해야한다고 생각하더라도 모든 것을 스스로 설정하는 것은 약간 번거 로울 수 있다. <br/>

지난 몇 년 동안 많은 소규모 프로젝트 생성기가 Yeonman을 사용하여 빛을 보았다. 
이전 Angularjs 1.x 버젼에서도 Yeonman을 많이 사용하고 2에서도 그런 시도가 있었다. <br/><br/>

그러나 현재 Google 팀에서는 angular-cli를 개발하면서 프로젝트를 쉽게 시작할수 있고, 
다양한 tool, test, packge 들을 설정할 수 있다. <br/>

아이디어는 새로운 것은 아니며 실제로 다른 인기있는 프레임 워크 인 EmberJS와 그 유명한 ember-cli에서 착안 하였다. <br/>

이 도구는 아직 개발 중입니다만, 
향후 Angular 2 앱을 만드는 데 있어 사실상의 표준이 될 것이라고 생각한다. 
그래서 시도해 볼 필요가 있다.
이것은 우리가 수동으로했던 것과 똑같은 효과를 가지고있을 것입니다. <br/><br/>


```javascript
npm i -g angular-cli
ng new ponyracer
```

그러면 프로젝트 ponyracer가 생성된다. 그리고 다음과 함께 앱을 시작할 수 있다.

```javascript
ng serve
```

이렇게하면 핫 리로드 구성을 사용하여 로컬로 작은 HTTP 서버가 시작된다.
즉, 파일을 수정하고 저장할 때마다 브라우저에서 앱이 새로 고침이 된다. <br/>
컴포넌트 ponyracer 생성과 같은 몇 가지 다른 가능성을 사용할 수 있습니다. <br/><br/>

```javascript
ng generate component pony
```

이렇게하면 관련 템플릿, 스타일 시트 및 테스트 파일과 함께 구성 요소 파일이 만들어 질것이다. <br/>
이 도구는 응용 프로그램을 개발하는 데 도움이 될 뿐만 아니라 배포와 같은 몇 가지 작업을 단순화하는 플러그인 시스템과 함께 제공된다. <br/>
예를 들어 github-pagesplugin을 사용하여 Github Pages에 신속하게 배포 할 수 있다. <br/><br/>

```javascript
ng github-pages:deploy
```

이것은 장기적으로 보았을 경우에 성능이 좋을 것이다. <br/>
우리는 프로젝트 전반에 걸쳐 동일한 코드 조직, 앱을 빌드하고 배포하는 일반적인 방법, 
그리고 아마도 일부 작업을 단순화하기위한 거대한 에코 시스템 플러그인을 보유하게 될 것이다. <br/>
그러므로 angular-cli를 살펴보도록 해라. <br/><br/>

**************************************************************************************************


**************************************************************************************************


## Reference URL
- [BEM introduction](http://getbem.com/introduction/)
- [BEMIT(BEM을 기반으로 확장변형 시킨 네이밍 컨벤션)](http://csswizardry.com/2015/08/bemit-taking-the-bem-naming-convention-a-step-further/)
- [SMACSS](https://smacss.com/)