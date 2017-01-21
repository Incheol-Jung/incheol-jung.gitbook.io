---
layout: post
title:  "Easy to develop"
date:   2017-01-21 00:00:00
categories: DenpendencyInjection
comments: true
---

의존성 삽입을 사용하려면 몇 가지가 필요하다.<br/>
• 종속성을 등록하여 다른 구성 요소 / 서비스에 주입 할 수있게하는 방법 <br/>
• 현재 구성 요소 / 서비스에서 어떤 종속성이 필요한지 선언하는 방법 <br/><br/>

프레임 워크는 나머지 작업을 수행한다. 
우리가 컴포넌트에 의존성을 선언 할 때, 레지스트리를 찾을 수 있다면 레지스트리를 조사 할 것이고, 의존성의 인스턴스를 얻거나, 의존성의 인스턴스를 생성 할 것이며 실제로 컴포넌트에 의존성이 주입 될 것이다.<br/>

의존성은 Angular가 제공하는 서비스이거나 우리가 스스로 작성한 서비스 일 수 있습니다.<br/>

이미 동료 중 한 명이 작성한 ApiServiceservice를 예로 들어 보자.
그는 게으른 친구이기 때문에 빈 배열을 반환하는 get 메서드를 생성만 하였다. 해당 서비스가 백엔드 API와 통신하는 데 사용되는 것으로 이미 추측 할 수 있다.

```javascript
export class ApiService {
  get(path) {
   // todo: call the backend API
  }
}
```

TypeScript를 사용하면 구성 요소 나 서비스에 대한 종속성을 선언하기 쉽다. <br/>
ApiService를 사용하는 RaceService를 작성하려고한다고 가정 해 보자. <br/>

```javascript
import { ApiService } from './api.service';
export class RaceService {
  constructor(private apiService: ApiService) {
  }
}
```

Angular는 ApiService 서비스를 가져 와서 생성자에 삽입되고 RaceService가 필요할 때 생성자가 호출되고 ApiService 필드가 ApiService 서비스를 참조하게된다. 
이제 ApiService 서비스를 사용하여 백엔드에 호출 할 메소드 목록 ()을 서비스에 추가 할 수 있다.

```javascript
import { ApiService } from './api.service';
export class RaceService {
  constructor(private apiService: ApiService) {
  }
  list() {
   return this.apiService.get('/races');
  }
}
```

Angular 2 에서는 서비스 자체에 의존성이 있음을 알리려면 클래스 데코레이터('@Injectable()')를 추가해야 한다.

```javascript
import { Injectable } from '@angular/core';
import { ApiService } from './api.service';
@Injectable()
export class RaceService {
  constructor(private apiService: ApiService) {
  }
  list() {
   return this.apiService.get('/races');
  }
}
```

이것을 하기 위한 쉬운 방법은 앞에서 본 @NgModule 데코레이터의 providers 속성을 사용하는 것이다. 

```javascript
import { NgModule } from '@angular/core';
import { BrowserModule }  from '@angular/platform-browser';
import { PonyRacerAppComponent } from './app.component';
import { ApiService } from './services/api.service';
@NgModule({
  imports: [BrowserModule],
  declarations: [PonyRacerAppComponent],
  providers: [
   ApiService
  ],
  bootstrap: [PonyRacerAppComponent]
})
export class AppModule {
}
```

이제 ReceService 를 다른 서비스 나 구성 요소에 주입 할 수있게하려면 등록해야한다.

```javascript
import { NgModule } from '@angular/core';
import { BrowserModule }  from '@angular/platform-browser';
import { PonyRacerAppComponent } from './app.component';
import { RaceService } from './services/race.service';
import { ApiService } from './services/api.service';
@NgModule({
  imports: [BrowserModule],
  declarations: [PonyRacerAppComponent],
  providers: [
   RaceService,
   ApiService
  ],
  bootstrap: [PonyRacerAppComponent]
})
export class AppModule {
}
```

우리는 우리가 원할 때마다 새로운 서비스를 사용할 수 있다. PonyRacerAppComponent 구성 요소에서 테스트 해 보도록 하자.

```javascript
import { Component } from '@angular/core';
import { RaceService } from './services/race.service';
@Component({
  selector: 'ponyracer-app',
  template: `<h1>PonyRacer</h1>
   <p>{{list()}}</p>`
})
export class PonyRacerAppComponent {
  // add a constructor with RaceService
  constructor(private raceService: RaceService) {
  }
  list() {
   return this.raceService.list();
  }
}
```

우리의 게으른 동료가 ApiService의 get 메소드에서 빈 배열을 반환 했으므로 list () 메서드를 호출하려고하면 아무 것도 얻을 수 없다. 

