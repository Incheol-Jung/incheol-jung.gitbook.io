---
layout: post
title:  "Our first component"
date:   2016-11-27 00:00:00
categories: FromZeroToSomething
comments: true
---

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