---
layout: post
title:  "Using other components in our templates"
date:   2017-01-16 00:00:00
categories: TheTemplatingSyntax
comments: true
---

우리는 PonyRace 구성 요소 인 RacesComponent를 표시하려는 PonyRacerAppComponent라는 응용 프로그램 구성 요소를 가지고 있다. 

```javascript
// in ponyracer_app.ts
import { Component } from '@angular/core';
@Component({
  selector: 'ponyracer-app',
  // added the RacesComponent component
  template: `
   <h1>PonyRacer</h1>
   <ns-races></ns-races>
  `
})
export class PonyRacerAppComponent {
}
```

보시다시피 템플릿에 이전에 선언한 태그와 매칭하여 RacesComponent 를 템플릿에 추가하였다. <br/>
그러나 이것은 동작하지 않을것이다. 당신의 브라우져는 races 컴포넌트를 보여주지 못한다. <br/>
왜 그럴까? 이유는 매우 간단하다.: Angular는 racesComponent를 아직 알지 못하기 때문이다. <br/>
고치는것은 매우 간단하다. PonyracerAppComponent 를 추가하였던 방법을 기억하는가?<br/><br/>
우리는 이제 두 번째 컴포넌트가 있다. 이것도 반드시 선언해 주어야 한다. <br/>
racesComponent는 root 컴포넌트는 아니다. 그래서, 이것은 선언을 해주어야 한다. 

```javascript
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { PonyRacerAppComponent } from './app.component';
// do not forget to import the component
import { RacesComponent } from './races.component';
@NgModule({
  imports: [BrowserModule],
  declarations: [PonyRacerAppComponent, RacesComponent],
  bootstrap: [PonyRacerAppComponent]
})
export class AppModule {
}
```

클래스를 직접적으로 전달하므로 클래스를 가져와야 한다. 
가져오기를 하기위해서는 소스 파일인 races.component.ts 에서 RacesComponent 클래스를 내보내야 한다. 

```javascript
// in another file, races.component.ts
import { Component } from '@angular/core';
@Component({
  selector: 'ns-races',
  template: `<h2>Races</h2>`
})
export class RacesComponent {
}
```

이제 reces 컴포넌트는 우리의 브라우져에 이렇게 보일 것이다. 

```javascript
<ponyracer-app>
  <h1>PonyRacer</h1>
  <ns-races>
   <h2>Races</h2>
  </ns-races>
</ponyracer-app>
```