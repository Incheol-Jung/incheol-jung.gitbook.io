---
layout: post
title:  "A Brave new world"
date:   2016-11-27 00:00:00
categories: Components
comments: true
---

Components는 개발쪽에서는 오래된 판타지였다. 당신이 어떠한 것들을 앱에 추가하면, 그것은 즉시 작동하고 필요한 기능을 사용자에게 제공해준다. <br/><br/>

이것은 완전히 새롭지만은 않다. 우리는 가끔 웹 개발할 경우에 컴포넌트들을 가지고 있다. 그러나 그것들은 몇몇의 종속성을 필요로 한다.(Jqury, Dojo, Prototype, AngularJS, etc...)
당신이 필요한 라이브러리를 넣어주어야 한다. <br/><br/>

Web Components는 이 문제를 해결하기 위해 시도하였다. 재사용되고 캡슐화 되어있는 Component를 가져보자. <br/><br/>

그들은 모든 브라우져에서 완벽히 지원되지 않는다. 그러나 여전히 흥미로운 주제가 있다. 만약 그들을 완전히 사용하기 위해 몇 년의 시간이 필요할 지라도 그 개념은 절대 벗어날수 없다는 것이다. <br/><br/>

여기 긴급한 기준이 있다. 
    - Custom Elements
    - Shadow DOM
    - Template
    - HTML imports

해당 예제는 Chrome과 FireFox에서는 동작한다. 