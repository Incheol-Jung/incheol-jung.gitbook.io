---
layout: post
title:  "From zero to something better with angular-cli"
date:   2016-11-27 00:00:00
categories: FromZeroToSomething
comments: true
---

실제 프로젝트에서는 다음과 같은 몇가지를 설정해야 한다. 
- 우리가 일을 깨뜨리지 않는지 확인하는 몇 가지 테스트
- 빌드 도구, 다양한 작업 (컴파일, 테스트, 패키지 등)을 조율 할 수 있습니다. <br/><br/>

일이 어떻게 진행되는지 이해하기 위해 한 번해야한다고 생각하더라도 모든 것을 스스로 설정하는 것은 약간 번거 로울 수 있다. <br/>

지난 몇 년 동안 많은 소규모 프로젝트 생성기가 Yeonman을 사용하여 빛을 보았다. 
이전 Angularjs 1.x 버젼에서도 Yeonman을 많이 사용하고 2에서도 그런 시도가 있었다. <br/><br/>

그러나 현재 Google 팀에서는 angular-cli를 개발하면서 프로젝트를 쉽게 시작할수 있고, 
다양한 tool, test, packge 들을 설정할 수 있다. <br/>

아이디어는 새로운 것은 아니며 실제로 다른 인기있는 프레임 워크 인 EmberJS와 그 유명한 ember-cli에서 착안 하였다. <br/>

이 도구는 아직 개발 중입니다만, 
향후 Angular 2 앱을 만드는 데 있어 사실상의 표준이 될 것이라고 생각한다. 
그래서 시도해 볼 필요가 있다.
이것은 우리가 수동으로했던 것과 똑같은 효과를 가지고있을 것입니다. <br/><br/>


```javascript
npm i -g angular-cli
ng new ponyracer
```

그러면 프로젝트 ponyracer가 생성된다. 그리고 다음과 함께 앱을 시작할 수 있다.

```javascript
ng serve
```

이렇게하면 핫 리로드 구성을 사용하여 로컬로 작은 HTTP 서버가 시작된다.
즉, 파일을 수정하고 저장할 때마다 브라우저에서 앱이 새로 고침이 된다. <br/>
컴포넌트 ponyracer 생성과 같은 몇 가지 다른 가능성을 사용할 수 있습니다. <br/><br/>

```javascript
ng generate component pony
```

이렇게하면 관련 템플릿, 스타일 시트 및 테스트 파일과 함께 구성 요소 파일이 만들어 질것이다. <br/>
이 도구는 응용 프로그램을 개발하는 데 도움이 될 뿐만 아니라 배포와 같은 몇 가지 작업을 단순화하는 플러그인 시스템과 함께 제공된다. <br/>
예를 들어 github-pagesplugin을 사용하여 Github Pages에 신속하게 배포 할 수 있다. <br/><br/>

```javascript
ng github-pages:deploy
```

이것은 장기적으로 보았을 경우에 성능이 좋을 것이다. <br/>
우리는 프로젝트 전반에 걸쳐 동일한 코드 조직, 앱을 빌드하고 배포하는 일반적인 방법, 
그리고 아마도 일부 작업을 단순화하기위한 거대한 에코 시스템 플러그인을 보유하게 될 것이다. <br/>
그러므로 angular-cli를 살펴보도록 해라. <br/><br/>