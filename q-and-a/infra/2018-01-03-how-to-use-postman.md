---
title: POSTMAN
date: '2018-01-03T00:00:00.000Z'
categories: postman
summary: How to use postman http://ourcstory.tistory.com/6
---

# POSTMAN

![https://velopert.com/362](../../.gitbook/assets/logo-2.png)

## POSTMAN이란?

API 개발을 보다 빠르고 쉽게 구현 할 수 있도록 도와주며, 개발된 API를 테스트하여 문서화 또는 공유 할 수 있도록 도와 주는 플랫폼이다. \
\
&#x20;Postman은 모든 API 개발자를 위해서 다양한 기능을 제공한다. \
&#x20;변수 및 환경, request 설명, 테스트 및 사전 요청에 필요한 스크립트 작성 등 POSTMAN은 현재 워크 플로우를 더 효율적으로 만들 수 있도록 고안되었다.

## POSTMAN을 사용해야 하는 이유?

URL을 통해서 테스트를 하는것은 한계가 있다. 실제로 개발할 경우, 클라이언트에서 버튼을 만들고, 이벤트를 만들고, 버튼에 이벤트를 등록하고, 버튼을 누르면 해당 이벤트를 실행하고, 이벤트에서는 요청을 하고, 요청을 한 이후에는 응답을 받고, 그 응답을 받은 내용을 화면에 출력하는 등의 작업이 너무 길어지게 된다.\
Authorization이나 Header, Body를 수정하는건 더더욱 제한이 많다.\
&#x20;하지만 포스트맨은 해당 작업을 할 수 있도록 인터페이스를 구축해놓은 툴이기 때문에 누구나 쉽게 사용이 가능하다. \
&#x20;또한 OS에 상관없이 어디에서나 사용이 가능하고, 가벼운 툴이여서 가용성이 뛰어 나다. 또한 계정을 보유하고 있다면, 내가 요청한 Request 히스토리, 테스트한 환경을 그대로 저장되기 때문에 언제 어디서나 내가 작업했던 환경이 구축된다는 특징이 있다.

## POSTMAN 설치

[https://www.getpostman.com/](https://www.getpostman.com/) 사이트에서 다운로드 하여 어플리케이션으로 실행할 수 있다.\
&#x20;단기적으로 사용한다고 하면 굳이 회원가입없이 바로 사용 가능하다.&#x20;

![](<../../.gitbook/assets/1 (10).png>)

## POSTMAN 특징

### - REST API

POSTMAN은 REST API를 표현할 수 있다. \


#### 그렇다면 REST API란 무엇일까?

한 문장으로 정의한다면 HTTP URI로 잘 표현된 리소스에 대한 행위를 HTTP Method로 정의한다. 리소스의 내용은 json, xml, yaml등의 다양한 표현 언어로 정의된다.\
&#x20;즉, URI를 이용해서 제어할 자원을 명시하고\
&#x20;HTTP를 이용해서 제어명령을 내린다.

![](<../../.gitbook/assets/2 (6).png>)

### - Variables

POSTMAN에서 사용하는 URI, Resource를 단순 text로 표현할 수도 있지만 별도의 변수를 사용하여 표현할 수 있다.\
&#x20;변수 사용 범위는 모든 텍스트가 들어가는 영역을 대체할 수 있다. \
&#x20;변수를 사용하는 이유는 중복적으로 사용하는 text를 하나의 변수로 재사용이 가능할 뿐만 아니라 text가 변경될 경우에 각각의 text를 변경하는 게 아닌 변수 값만 수정하게 된다면 일괄적용될 수 있는 장점이 있다. &#x20;

![](<../../.gitbook/assets/3 (6) (1).png>)

변수는 크게 전역 변수로 사용할 수 있는 글로벌 환경과 특정 환경에서만 적용되는 지역 환경으로 구분될 수 있다. 지역 환경 변수는 특정 환경에서 사용되는 변수로 환경이 변경될 때마다 해당 환경에 정의된 값으로 변경되어진다.&#x20;

![](<../../.gitbook/assets/4 (2) (1).png>)

글로벌 환경 변수는 특정 환경의 변화와 무관하게 사용되는 전역 변수로 지역 환경 변수가 설정되어 있다고 하더라도 글로벌 변수가 설정되어 있다면 우선순위는 글로벌 환경 변수가 더 높다.&#x20;

![](<../../.gitbook/assets/5 (1) (1) (1).png>)

### - Interceptor

Interceptor 기능은 Chrome 브라우저를 이용하여 브라우저에서 발생한 Request 히스토리를 Postman History로 동기화를 해주는 기능이다.\
&#x20;[https://chrome.google.com/webstore/detail/postman-interceptor/aicmkgpgakddgnaphhhpliifpcfhicfo](https://chrome.google.com/webstore/detail/postman-interceptor/aicmkgpgakddgnaphhhpliifpcfhicfo) 에서 확장 프로그램을 설치한 뒤 우측 상단에서 Request Capture를 활성화 시키고 Postman Application에서도 활성화시켜주게 되면 동기화가 이루어진다.&#x20;

![](<../../.gitbook/assets/postman-interceptor (1).png>)

### - Collections

Collection 관리를 통해서 크게는 프로젝트 별로 구분할 수 있고 세부적으로는 프로젝트 내부에서 각 모듈이나 기능 별로 분리할 수 있다. \
&#x20;back-end와 front-end의 작업이 구분되어 있다면 개발 시작전에 collection 규칙을 협의하여 진행하는 것이 효율적이다.&#x20;

![](<../../.gitbook/assets/6 (2) (1) (1).png>)

유료 서비스를 사용하지 않는다면 팀원 간의 collection 공유는 불가능 하므로 작업한 collection을 export/import하여 공유해야 하는 부분이 있다.&#x20;

![](<../../.gitbook/assets/7 (1) (1).png>)

### - Test scnario

POSTMAN으로 단순하게 API가 동작하는지에 대한 테스트를 진행할 수 있지만 좀 더 구체적인 테스트를 진행하기 위해서는 Response Data를 사용하여 테스트 시나리오를 작성할 수 있다. \
&#x20;예를 들어 Response Data의 address 값의 여부를 테스트 케이스에 넣게 된다면 address 값이 없을 경우에는 API 상태 결과값이 200이더라도 에러라는 테스트 케이스 결과 값을 확인할 수 있다. \
&#x20;또는 Response Data를 이용하여 전역변수 또는 지역변수의 값을 설정할 수도 있다.&#x20;

![](<../../.gitbook/assets/8 (1) (1).png>)

### - Pre-scripts

이전에 설명한 Test scnario는 API 호출 이후 시점에 사용되는 기능이라면, Pre-Scripts의 경우에는 API 호출 이전 시점에 사용되는 기능으로 구분할 수 있다.\
&#x20;예를 들어 파라미터에 현재 날짜를 전송해주어야 한다면 테스트 진행할 때마다 현재 날짜를 텍스트로 입력해주어야 하는 번거로움이 있다. 그러나 이 부분을 pre-script를 사용하여 function으로 구현하였다면 자동으로 파라미터가 현재 날짜로 변경될 것이다.&#x20;

![](<../../.gitbook/assets/9 (1).png>)

### - Monitor

Project 단위로 사용자가 원하는 주기로 Collection을 실행하여 API의 monitoring이 가능하다. \
&#x20;monitoring하는 주기 단위 또는 traffic량에 따라서 유료로 제공되고 있다.&#x20;

![](<../../.gitbook/assets/10 (2).png>)

### - Work flow

Test scnario의 심화 기능으로 Postman.setNextRequest 함수를 이용하여 API 순서를 임의로 지정할 수 있다. \
&#x20;특정 API 호출이후에 테스트할 수 있는 API가 있다면 해당 기능이 유용하게 사용될 것이다. \
&#x20;한가지 단점은 일반적인 실행으로는 setNextRequest 함수가 실행이 안되고 Runner를 통해서만 실행이 가능하다.&#x20;

![](<../../.gitbook/assets/11 (2).png>)

### - Team Library

Team 내부에서 Collection을 공유하는 기능으로 유료 버전에서만 제공한다. \
&#x20;무료버전에서 Collection을 공유하기 위해 export/import하는 번거로움을 줄일수 있고 변경된 내용을 실시간으로 확인할 수 있다.&#x20;

![](<../../.gitbook/assets/12 (1).png>)
