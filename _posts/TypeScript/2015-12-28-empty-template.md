---
layout: post
title:  "Types as in TypeSctipt"
date:   2016-11-19 00:00:00
categories: TypeScript
comments: true
---

ES6는 마지막 단계에 도달해왔다. 그리고 그것은 모든 브라우져에서 완전히 지원되지 않는다. 그리고, 몇몇 브라우져들은 이런 트렌드에 뒤쳐질 것이다. 
(만약 마이크로소프트가 엣지에서도 잘 동작한다 하더라도). 만약 내가 사용할 수 있는 것에 대해 걱정한다고 하면 모든 브라우져에서 사용될 수 있는 것은 무엇인가? 라는 생각을 할지도 모른다. 
그리고 당신이 하는 생각이 맞다. 때문에 오래된 브라우져는 무시하는 앱 들이 많다. 그러나, ES 6를 사용하려는 JS 개발자들은 ES6 앱으로 만들기를 원한다. 
그리고 커뮤니티는 그에 대한 해답을 발견하였다. : a transpiler.<br/><br/>
Tanspiler는 모든 브라우져에서 동작할 수 있도록 ES6코드를 취합하여 ES5 코드로 변환해준다. 그것은 심지어 브라우져에서 ES6 소스를 직접적으로 디버그를 허용해주는 소스맵 파일도 변환해준다. 
이 시점에서, ES6 코드를 변환해주는 두 가지 대안이 있다. 
-	Traceur, a Google project
-	Babeljs, 젊은 개발자로(글을 작성할 당시에 17세 였음)부터 시작된 프로젝트로 다양한 요소를 제공한다. 
각각은 장점과 단점을 가지고 있다. 예를 들어, Babeljs는 Traceur에 비해 가독성 있는 코드를 생성한다. 
그러나 Traceur는 구글 프로젝트로써 Angular와 함께 사용하였을 경우에 더욱 성능이 우수하다. Angular 2 소스코드는 TypeScript로 바뀌기 이전에는 Traceur을 사용하여 자체적으로 변환하였다. 
TypeScript는 Microsoft에서 개발된 오픈 소스 언어이다. 자바스크립트의 확장된 기능이다. 그러나 우리는 곧 그 세부적으로 파악해볼 것이다. 
솔직히 Babel은 Traceur보다 더욱 장점이 많다. 그래서 나는 Babel을 사용하라고 충고한다. Babel은 사실상 표준으로 빠르게 확산 되고 있다. 
그래서 만약 너가 ES6를 사용하기를 원한다면, 또는 너의 프로젝트에 적용하길 원한다면, transpilers를 살펴보고 빌드 과정중에 하나로 추가하도록 해라. <br/><br/>
이것은 너의 ES6 소스 파일을 동일한 ES5코드로 변환해줄것이다. 이것은 매우 잘 동작하지만 새로운 몇 가지 기능들은 ES5로 변환하는게 어렵거나 불가능할수도 있다. 
그러나, 현재 관점에서는 아무 걱정없이 사용하기에 충분하다. 그러므로 우리가 자바스크립트 안에서 할 수 있는 이런 새로운 것들을 살펴보도록 해라.




Check out the [Jekyll docs][jekyll] for more info on how to get the most out of Jekyll. File all bugs/feature requests at [Jekyll’s GitHub repo][jekyll-gh]. If you have questions, you can ask them on [Jekyll’s dedicated Help repository][jekyll-help].

[jekyll]:      http://jekyllrb.com
[jekyll-gh]:   https://github.com/jekyll/jekyll
[jekyll-help]: https://github.com/jekyll/jekyll-help
