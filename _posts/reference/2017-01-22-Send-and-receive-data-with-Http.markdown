---
layout:     reference
title:      CHAPTER 14. Send and receive data with Http
date:       2017-01-22 00:00:00
updated:    2017-01-22 00:00:00
categories: reference
summary:    Send and receive data with Http
navigation_weight: 14
---


## Intro

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



**************************************************************************************************

## Getting data


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


**************************************************************************************************


## Transforming data

Observable 객체를 응답으로 받고 있으므로 데이터를 쉽게 변형 할 수 있다는 사실을 잊지 마시오.
경주 이름의 목록을 원하는가? 인종을 요청하고 이름을 매핑하면 된다!
이렇게 하려면 RxJS에 대한 mapoperator를 가져와야 한다. 
Angular 팀은 앱에 전체 RxJS 라이브러리를 포함하기를 원하지 않으므로 명시 적으로 필요한 연산자를 가져와야 한다.

```javascript
import 'rxjs/add/operator/map';
```

이제 사용할 수 있다.

```javascript
http.get(`${baseUrl}/api/races`)
// extract json body
  .map(res => res.json())
  .subscribe(races => {
   // store the array of the races in the component
   this.races = races;
  });
```

이러한 종류의 작업은 일반적으로 전용 서비스로 수행된다. RaceService와 같은 서비스를 만드는 경향이 있다. 
RaceService는 모든 작업이 완료된 곳이다. 
그런 다음 내 구성 요소는 서비스 방법을 구독 해야하며 후드 내부에서 무슨 일이 일어나고 있는지 알지 못한다.

```javascript
raceService.list()
  .subscribe(races => {
   // store the array of the races in the component
   this.races = races;
  });
```

또한 RxJS를 사용하여 실패한 요청을 몇 번 다시 시도 할 수 있다.

```javascript
raceService.list()
  // if the request fails, retry 3 times
  .retry(3)
  .subscribe(races => {
   // store the array of the races in the component
   this.races = races;
  });
```


**************************************************************************************************

## Advanced options

물론 보다 세밀하게 요청을 조정할 수 있다. 모든 메소드는 RequestOption 객체를 선택적 매개 변수로 사용하여 요청을 구성 할 수 있다. 
몇 가지 옵션이 정말 유용하며 요청의 모든 것을 무시할 수 있다. 이 옵션 중 일부는 Fetch API에서 제공하는 것과 동일한 값을 갖는다. 
url 옵션은 매우 명확하며 요청의 URL을 덮는다. method 옵션은 Request Method.Get과 같이 사용할 HTTP 동사이다. 
수동으로 요청을 작성하려면 다음을 작성할 수 있다.

```javascript
const options = new RequestOptions({ method: RequestMethod.Get });
http.request(`${baseUrl}/api/races/3`, options)
  .subscribe(response => {
   // will get the race with id 3
  });
```

search는 URL에 추가 할 URL 매개 변수를 나타낸다. URLSearchParams 클래스를 사용하여 지정하면 전체 URL이 생성된다.

```javascript
const searchParams = new URLSearchParams();
searchParams.set('sort', 'ascending');
const options = new RequestOptions({ search: searchParams });
http.get(`${baseUrl}/api/races`, options)
  .subscribe(response => {
   // will return the races sorted
   this.races = response.json();
  });
```

헤더 옵션은 요청에 몇 가지 맞춤 헤더를 추가하는 경우에 유용하다. 예를 들어, JSON Web Token과 같은 일부 인증 기술에 필요하다.

```javascript
const headers = new Headers();
headers.append('Authorization', `Bearer ${token}`);
http.get(`${baseUrl}/api/races`, new RequestOptions({ headers }))
  .subscribe(response => {
   // will return the races visible for the authenticated user
   this.races = response.json();
  });
```



**************************************************************************************************

## Jsonp

웹 브라우저에서 시행되는 동일 원점 정책에 의해 차단되지 않고 API에 액세스 할 수 있도록 CORS를 사용하지 않고 JSONP (Padding with JSON)를 사용하는 웹 서비스가 있다.
서버가 JSON 데이터를 직접 반환하지는 않지만 콜백으로 전달 된 함수로 래핑 한다.<br/>

응답은 스크립트로 돌아오고 스크립트는 동일한 출처 정책의 적용을받지 않습니다. 일단로드되면 응답에 포함 된 JSON 값에 액세스 할 수 있습니다.

HttpModule 외에도 JsonpService를 제공하는 JsonpModule이 있다. 
JsonpModule은 이러한 API와 쉽게 상호 작용할 수있게 해주며, 우리 모두에게 필요한 일을 한다. 
호출 할 서비스의 URL을 지정하고 JSONP_CALLBACK을 콜백 매개 변수 값으로 추가하기만 하면 된다.<br/>

다음 예제에서는 JSONP를 사용하여 Github 조직에서 모든 공개 Repos를 가져온다.

```javascript
jsonp.get('https://api.github.com/orgs/Ninja-Squad/repos?callback=JSONP_CALLBACK')
// extract json
  .map(res => res.json())
  // extract data
  .map(res => res.data)
  .subscribe(response => {
   // will return the public repos of Ninja-Squad
   this.repos = response;
  });
```


**************************************************************************************************

## Tests


이제 우리는 종족을 가져 오기 위해 HTTP 종점을 호출하는 서비스를 갖게 된다. 어떻게 테스트 하는가?

```javascript
@Injectable()
export class RaceService {
  constructor(private http: Http) {
  }
  list() {
   return this.http.get('/api/races').map(res => res.json());
  }
}
```

단위 테스트에서는 HTTP 서버를 실제로 호출하고 싶지 않고 가짜 데이터를 반환하기 위해 HTTP 호출을 "가짜"로 만들고 싶다. 
이를 위해 MockBackend라는 프레임 워크가 제공하는 클래스를 사용하여 가짜 구현으로 Http 서비스에 대한 의존성을 대체 할 수 있다.

```javascript
import { async, TestBed } from '@angular/core/testing';
import { BaseRequestOptions, Response, ResponseOptions, RequestMethod } from '@angular/http';
import { MockBackend, MockConnection } from '@angular/http/testing';
import 'rxjs/add/operator/map';

describe('RaceService', () => {
  let raceService;
  let mockBackend;
  beforeEach(() => TestBed.configureTestingModule({
   providers: [
   MockBackend,
   BaseRequestOptions,
   {
   provide: Http,
   useFactory: (backend, defaultOptions) => new Http(backend, defaultOptions),
   deps: [MockBackend, BaseRequestOptions]
   },
   RaceService
   ]
  }));
  beforeEach(() => {
   raceService = TestBed.get(RaceService);
   mockBackend = TestBed.get(MockBackend);
  });
  it('should return an Observable of 2 races', async(() => {
   // fake response
   const hardcodedRaces = [new Race('London'), new Race('Lyon')];
   const response = new Response(new ResponseOptions({ body: hardcodedRaces }));
   // on a the connection
   mockBackend.connections.subscribe((connection: MockConnection) => {
   // return the fake response when we receive a request
   connection.mockRespond(response);
   });
   // call the service
   raceService.list().subscribe(races => {
   // check that the returned array is deserialized as expected
   expect(races.length).toBe(2);
   });
  }));
});
```

또한 기본 HTTP 요청에 몇 가지 단정문을 추가 할 수 있다.

```javascript
mockBackend.connections.subscribe((connection: MockConnection) => {
  // return the fake response when we receive a request
  connection.mockRespond(response);
  // check that the underlying HTTP request was correct
  expect(connection.request.method).toBe(RequestMethod.Get);
  expect(connection.request.url).toBe('/api/races');
});
```


**************************************************************************************************



## Reference URL

- [Become a NINJA with Angular 2](https://books.ninja-squad.com/public/samples/Become_a_ninja_with_Angular2_sample.pdf)
- [Learn Angular 2](http://learnangular2.com/)
- [Angular 2 Component](https://www.tutorialspoint.com/angular2/)
- [An Introduction to Angular 2](http://angular-tips.com/blog/2015/05/an-introduction-to-angular-2/)