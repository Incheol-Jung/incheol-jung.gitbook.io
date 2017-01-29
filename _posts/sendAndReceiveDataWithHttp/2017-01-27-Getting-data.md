---
layout: post
title:  "Getting data"
date:   2017-01-27 00:00:00
categories: sendAndReceiveDataWithHttp
comments: true
---

놀라운 일은 아니지만 많은 업무는 백엔드 서버에 웹 응용 프로그램에 데이터를 보내고 데이터를 다시 보내도록 요청한다.
일반적으로 WebSocket과 같은 다른 대안이 있더라도 HTTP를 통해 수행된다.
Angular 2는 http 모듈을 제공하지만 강제로 사용하지는 않는다. 
원하는 경우 선호하는 HTTP 라이브러리를 사용하여 비동기 요청을 보낼 수 있다.<br/>

신입 회원 중 하나는 현재 polyfill()로 사용할 수 있지만 브라우저에서 표준이 되어야하는 fetchAPI이다. 
가져 오기 또는 다른 라이브러리를 사용하여 앱을 완벽하게 만들 수 있다. 
사실 그것은 Http 부분이 Angular2에서 수행되기 전에 사용했던 것이다. 
프레임 워크가 데이터를 수신했음을 인식하고 변경 감지를 실행해야한다는 특별한 호출이 필요없이 훌륭하게 작동한다. 
(AngularJS와는 달리 1.x, 여기서 외부 라이브러리를 사용한다면 $ scope.apply ()를 호출해야 한다 : 이것은 Angular 2와 그 영역의 마술이다!)<br/>

그러나 프레임 워크에 익숙하다면 핵심 팀에서 제공하는 HttpModule이라는 작은 모듈을 사용할 것이다. 
그것은 독립적인 모듈이다. 그래서 정말로, 당신이 원하는 대로 하시오. Fetch API 제안을 충분히 밀접하게 반영한다.<br/>

그것을 사용하려면 @ angular / httppackage의 클래스를 사용해야 한다.
왜 이 모듈을 fetch보다 더 선호 하는가? 대답은 간단합니다. 
앞으로 살펴 보겠지만 Http 모듈을 사용하면 백엔드 서버를 모방하고 가짜 응답을 반환 할 수 있다. 
정말, 정말 유용하다!!
API로 들어가기 전에 마지막으로, Http 모듈은 반응 형 프로그래밍 패러다임을 많이 사용한다. 
따라서 Reactive Programming 장을 건너 뛰면 지금 돌아가서 읽을 수 있는 좋은 시간이 될 것이다.)

Http 모듈은 Http라는 서비스를 제공한다. 
이 서비스는 모든 생성자에 삽입 할 수 있다. 
서비스가 다른 모듈에서 오는 것이므로 구성 요소 나 서비스에서 수동으로 서비스를 사용할 수 있도록 해야한다.
이렇게 하려면 HttpModule을 루트 모듈로 가져온다.

```javascript
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpModule } from '@angular/http';
@NgModule({
  imports: [BrowserModule, HttpModule],
  declarations: [PonyRacerAppComponent],
  bootstrap: [PonyRacerAppComponent]
})
export class AppModule {
}
```

이 작업이 완료되면 Httpservice를 필요한 곳 어디 에나 삽입 할 수 있다.

```javascript
@Component({
  selector: 'ponyracer-app',
  template: `<h1>PonyRacer</h1>`
})
export class PonyRacerAppComponent {
  constructor(private http: Http) {
  }
}
```

기본적으로 Http 서비스는 XMLHttpRequest를 사용하여 AJAX 요청을 처리한다.
가장 일반적인 HTTP 동사와 일치하는 여러 가지 방법을 제공한다.

• get
• post
• put
• delete
• patch
• head

AngularJS 1.x에서 $ http 서비스를 사용했다면 약속에 크게 의존하고 있음을 기억할 것이다.
그러나 Angular 2에서는 이러한 모든 메서드가 Observable 객체를 반환한다.<br/>

Observables를 Http를 사용하여 요청을 취소하고, 다시 시도하고, 쉽게 작성하는 등의 몇 가지 이점이 있다.<br/>

PonyRacer에 등록 된 레이스를 가져와 보자. 백엔드가 이미 실행되어 RESTful API를 제공한다고 가정하자. 
경주를 가져 오려면 'http : //backend.url/api/races'와 같은 URL에 GET 요청을 보내야 한다.<br/>

일반적으로 HTTP 호출의 기본 URL은 환경에 따라 쉽게 구성 할 수있는 변수 또는 서비스에 저장된다. 
또는 REST API가 Angular 애플리케이션과 동일한 서버에서 제공되는 경우 상대 URL 인 '/ api / races'를 사용하면 된다.<br/>

이러한 요청은 Http 서비스를 사용하여 간단하다.<br/>

```javascript
http.get(`${baseUrl}/api/races`)
```

이것은 Observable을 반환하며, Observable을 사용하여 응답 수신을 신청할 수 있다. 응답은 몇 가지 필드와 편리한 메소드가 있는 Response 객체이다. 
상태 코드, 헤더 등을 쉽게 액세스 할 수 있다.

```javascript
http.get(`${baseUrl}/api/races`)
  .subscribe(response => {
   console.log(response.status); // logs 200
   console.log(response.headers); // logs []
  });
```

물론 응답 본문이 가장 흥미로운 부분이다. 그러나 액세스하려면 메서드를 사용해야 한다.<br/>
• text () 일부 텍스트가 필요한 경우 분석이 수행된다.<br/>
• json () JSON 객체를 예상하면 구문 분석이 수행된다.<br/>

```javascript
http.get(`${baseUrl}/api/races`)
  .subscribe(response => {
   console.log(response.json());
   // logs the array of races
  });
```

데이터를 보내는 것도 매우 쉽다. 게시 할 URL과 객체가있는 post() 메소드를 호출하기 만하면 된다.

```javascript
// you currently need to stringify the object you send
http.post(`${baseUrl}/api/races`, newRace)
```