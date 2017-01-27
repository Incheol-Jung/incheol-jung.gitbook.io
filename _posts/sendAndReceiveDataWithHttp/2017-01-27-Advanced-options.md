---
layout: post
title:  "Advanced options"
date:   2017-01-27 00:00:00
categories: sendAndReceiveDataWithHttp
comments: true
---

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

