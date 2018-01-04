---
layout:     post
title:      "POSTMAN"
date:       2018-01-03 00:00:00
categories: postman
summary:    How to use postman http://ourcstory.tistory.com/6 
---

## POSTMAN이란?

API 개발을 보다 빠르고 쉽게 구현 할 수 있도록 도와주며, 개발된 API를 테스트하여 문서화 또는 공유 할 수 있도록 도와 주는 플랫폼<br><br>
Postman은 모든 API 개발자를 위해서 다양한 기능을 제공한다. <br>
변수 및 환경, request 설명, 테스트 및 사전 요청에 필요한 스크립트 작성 등 POSTMAN은 현재 워크 플로우를 더 빠르고 잘 만들 수 있도록 고안되었다.

## POSTMAN을 사용해야 하는 이유?

URL을 통해서 테스트를 하는것은 한계가 있다. 실제로 개발할때 클라이언트에서 버튼을 만들고, 이벤트를 만들고, 버튼에 이벤트를 등록하고, 버튼을 누르면 해당 이벤트를 실행하고, 이벤트에서는 요청을 하고, 요청을 한 이후에는 응답을 받고, 그 응답을 받은 내용을 화면에 출력하는 등의 작업이 너무 길어지게 된다.  
Authorization이나 Header, Body를 수정하는건 더욱더 제한이 있다.<br> 
하지만 포스트맨은 해당 작업을 할 수 있도록 인터페이스를 구축해놓은 툴이기 때문에 누구나 쉽게 사용이 가능하다. <br>
또한 OS에 상관없이 어디에서나 사용이 가능하고, 가벼운 툴이여서 빠르게 사용이 가능하다. 또한 계정을 보유하고 있다면, 내가 요청한 Request 히스토리, 테스트한 환경을 그대로 보유하고 있기 때문에 언제 어디서나 내가 작업했던 환경이 구축된다는 특징이 있다. 

## POSTMAN 설치

https://www.getpostman.com/ 사이트에서 다운로드 하여 어플리케이션으로 실행할 수 있다.<br>
단기적으로 사용한다고 하면 굳이 회원가입없이 바로 사용 가능하다. <br><br>
<img src="/resource/images/post/postman_download.png" style="max-width: 638px;" alt="">

## POSTMAN 특징

### - REST API

POSTMAN은 REST API를 표현할 수 있다. <br>
#### 그렇다면 REST API란 무엇일까? <br>
한 문장으로 정의한다면 HTTP URI로 잘 표현된 리소스에 대한 행위를 HTTP Method로 정의한다. 리소스의 내용은 json, xml, yaml등의 다양한 표현 언어로 정의된다. <br><br>
<img src="/resource/images/post/restapi.png" style="max-width: 638px;" alt="">

### - Variables

POSTMAN에서 사용하는 API는 단순 text로 표현할 수도 있지만 별도의 변수를 사용하여 표현할 수 있다.<br>
변수 사용 범위는 URI / Parameter 등 모든 텍스트가 들어가는 부분을 대체할 수 있다. <br>
변수를 사용하는 이유는 중복적으로 사용하는 text를 하나의 변수로 재사용이 가능할 뿐만 아니라 text가 변경될 경우에 각각의 text를 변경하는 게 아닌 변수 값만 수정한다면 일괄적용될 수 있는 장점이 있다. <br><br>
<img src="/resource/images/post/variable.png" style="max-width: 638px;" alt="">

### - Interceptor

내용<br>
내용

### - Collections

내용<br>
내용

### - Test scnario

내용<br>
내용

### - Pre-scripts

내용<br>
내용

### - Monitor

내용<br>
내용

### - Work flow

내용<br>
내용

### - Team Library

내용<br>
내용

Thank you!!!