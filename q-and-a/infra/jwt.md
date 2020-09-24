---
description: JWT에 대해 알아보자
---

# JWT

![https://velog.io/@yoju/%EC%9D%B8%EC%A6%9DAuthentication-%EC%9D%B8%EA%B0%80Authorization](../../.gitbook/assets/token.jpg)

## JWT란 무엇일까?

JWT는 서버와 클라이언트 간 정보를 주고 받을 때 HTTP Request Header에 넣어 주는 JSON 토큰을 말한다. 토큰을 사용하여 서버는 별도의 인증 과정 없이 토큰 정보만으로 인증을 처리할 수 있게 된다.

## JWT는 왜 사용할까?

### 보안 이슈

* 쿠키 또는 세션을 탈취하여 발생하는 보안 이슈를 막을 수 있다.
* JWT는 쿠키를 사용하지 않기 때문에, Cross-Origin Resource Sharing \(CORS\) 이슈가 발생하지 않는다.

### 데이터 용량

* JWT는 기존의 XML보다 덜 복잡하고 인코딩 된 사이즈가 작다.
* HTTP와 HTML 환경에서 사용하기 좋습니다.

### 사용성

* 서버 확장시, 토큰 정보만 공유하면 새롭게 추가된 서버에서도 바로 사용할 수 있으니 확장성에 용이하다.
* 토큰 기반으로 하는 다른 인증 시스템과 상호 호환이 가능하다.
* 토큰에 필요한 별도의 저장소 관리를 할 필요가 없다.

## OAuth는 무엇이지?

* OAuth는 Open Authorization, Open Authentication 뜻하는 것으로 애플리케이션\(페이스북,구글,트위터\)\(Service Provider\)의 유저의 비밀번호를 Third party앱에 제공 없이 인증,인가를 할 수 있는 오픈 스탠다드 프로토콜이다.
* OAuth 인증을 통해 애플리케이션 API를 유저 대신에 접근할 수 있는 권한을 얻을 수 있다. OAuth가 사용 되기 전에는 외부 사이트와 인증 기반의 데이터를 연동할 때 인증 방식의 표준이 없었기 때문에 기존의 기본 인증인 아이디와 비밀번호를 사용하였는데, 이는 보안상 취약한 구조 였다. 유저의 비밀번호가 노출될 가망성이 크기 때문이다

### JWT는 OAuth를 적용하기 위한 하나의 도구 일 뿐이다.

JWT를 사용하게 되면 Payload안에 클라이언트나 서버 간에 다양한 정보를 포함할 수 있다. 그렇기 때문에 JWT가 범용적으로 사용하게 된 것일지도 모르겠다. 그로 인해 사람들이 하는 오해중에 하나가 Oauth는 JWT이다. 라고 생각하는 사람도 적지 않다.

### JWT를 사용하지 않고도 OAuth Token을 사용할 수 있다.

OAuth token을 사용하게 되면 token을 사용하여 별도의 저장 공간에 저장하여 다양한 인증 정보를 보관하게 된다. 그렇게 되면 클라이언트 요청 시 서버는 매번 토큰 저장 공간에서 필요한 인증 정보를 찾아서 사용하게 된다.

![](../../.gitbook/assets/111%20%287%29.png)

[https://bcho.tistory.com/999](https://bcho.tistory.com/999) \[조대협님 블로그에서 인용\]

## JWT 구조

![https://blog.kakaocdn.net/dn/dgmsn1/btqz4K9YW27/Qv25KQkx9nPSAQMkhsb3MK/img.png](https://blog.kakaocdn.net/dn/dgmsn1/btqz4K9YW27/Qv25KQkx9nPSAQMkhsb3MK/img.png)

### header

토큰의 타입과 해시 암호화 알고리즘으로 구성되어 있다.

### payload

토큰에 담을 클레임\(claim\) 정보를 포함하고 있다. name-value 한 쌍으로 이루어져있고, 여러개의 클레임 들을 넣을 수 있다.

### signature

서명\(Signature\)은 위에서 만든 헤더\(Header\)와 페이로드\(Payload\)의 값을 각각 BASE64로 인코딩하고, 인코딩한 값을 비밀 키를 이용해 헤더\(Header\)에서 정의한 알고리즘으로 해싱을 하고, 이 값을 다시 BASE64로 인코딩하여 생성한다.

## JWT가 만능은 아니다

* 페이로드의 데이터가 많아지면 토큰의 사이즈가 커질 수 있다.
* 토큰은 클라이언트에 그대로 노출되므로 토큰에 대한 위변조 체크를 하지 않는다면 자칫 잘못된 요청을 수행할 수 있다.
* JWT 토큰은 누구나 복호화 할 수 있기 때문에 페이로드에는 민감정보는 들어가면 안된다.
* 토큰을 매 요청시 서버에 전송해야 하기 때문에 클라이언트에서는 별도로 저장할 필요가 있다.

## 참고

* [https://velopert.com/2350](https://velopert.com/2350)
* [https://velog.io/@geuni1013/JWT-정리-개인정리](https://velog.io/@geuni1013/JWT-%EC%A0%95%EB%A6%AC-%EA%B0%9C%EC%9D%B8%EC%A0%95%EB%A6%AC)
* [http://www.opennaru.com/opennaru-blog/jwt-json-web-token/](http://www.opennaru.com/opennaru-blog/jwt-json-web-token/)
* [https://brownbears.tistory.com/440](https://brownbears.tistory.com/440)
* [https://mangkyu.tistory.com/56](https://mangkyu.tistory.com/56)
* [https://bcho.tistory.com/999](https://bcho.tistory.com/999)

