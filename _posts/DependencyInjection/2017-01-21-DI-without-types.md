---
layout: post
title:  "DI without types"
date:   2017-01-21 00:00:00
categories: DenpendencyInjection
comments: true
---

토큰을 사용하고 TypeScript 유형에 의존하지 않으려는 경우 삽입 할 종속성마다 데코레이터를 추가해야 한다. 
데코레이터는 @Inject ()이며 삽입 할 종속성의 토큰을 받는다. 다음과 같이 ApiService 서비스를 사용하기 위해 동일한 RaceService를 작성할 수 있다.

```javascript
import { Injectable, Inject } from '@angular/core';
import { ApiService } from './api.service';
@Injectable()
export class RaceService {
  constructor(@Inject(ApiService) apiService) {
   this.apiService = apiService;
  }
  list() {
   return this.apiService.get('/races');
  }
}
```

** TypeScript없이 예제에서 데코레이터를 작동 시키려면 babel을 decorator와 함께 사용해야하고 angle2-annotations 플러그인을 사용해야 한다.