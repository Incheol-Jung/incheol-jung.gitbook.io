---
layout: post
title:  "Our first Angular module"
date:   2016-11-27 00:00:00
categories: FromZeroToSomething
comments: true
---

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
