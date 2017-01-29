---
layout: post
title:  "The templating syntax"
date:   2017-01-16 00:00:00
categories: TheTemplatingSyntax
comments: true
---

컴포넌트는 뷰가 반드시 필요하다. 뷰를 정의하기 위해서는 템플릿을 인라인이나 별도의 파일로 정의할 수 있다. 
당신은 아마도 Angular1 버젼으로 부터 착안한 인라인 구문이 친숙할지도 모른다. 단순화 하기위해 템플릿을 
사용하면 데이터에 따라 동적인 부분을 엔더링 할 수 있다. <br/><br/>

그러면 간단한 예제로 살펴보록 하자. 

```javascript
import { Component } from '@angular/core';
@Component({
  selector: 'ponyracer-app',
  template: '<h1>PonyRacer</h1>'
})
export class PonyRacerAppComponent {
}
```

이제 우리는 첫번째 페이지에 동적인 데이터를 보여주기를 원한다. 아마도 앱에 등록된 사용자 수일 것이다. 
그러나 지금은 우리가 서버로부터 데이터를 확인한 후에 우리의 클래스에 직접적으로 하드 코딩할 것이다. 

```javascript
@Component({
  selector: 'ponyracer-app',
  template: '<h1>PonyRacer</h1>'
})
export class PonyRacerAppComponent {
  numberOfUsers: number = 146;
}
```

그럼 이제 어떻게 우리는 템플릿에 있는 변수를 변할것인가?