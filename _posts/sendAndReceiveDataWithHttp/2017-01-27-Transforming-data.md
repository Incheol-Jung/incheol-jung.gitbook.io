---
layout: post
title:  "Transforming data"
date:   2017-01-27 00:00:00
categories: sendAndReceiveDataWithHttp
comments: true
---

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