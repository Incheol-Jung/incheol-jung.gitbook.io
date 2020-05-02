---
description: HTTP Header 값의 의미를 알아보자
---

# HTTP Header

2012년 이전에는 X-로 정의한 정보는 사용자 임의 정보를 정의할때 사용하곤 하였다. 

하지만 2012년 이후에는 사용자 정의 헤더 정보에도 'X'를 붙이지 않아도 된다고 한다. 

공통헤더

1. Date : HTTP 메시지가 생성된 날짜
2. Connection : 
3. Content-Length : 요청과 응답 메시지의 본문 크기를 바이트 단위로 표시
4. Cache-Control : 요청과 응답 내의 캐싱 매커니즘
   * 캐싱 알고리즘 종류는?
     * 캐시 능력
       * public : 항상 캐시된다. 
       * private : 단일 사용자를 위한 것이며 공유 캐시에 의해 저장되지 않는다. 
       * no-cache : 요청을 서버에 무조건 요청한다. 
       * only-if-cached : 캐시된 응답만을 원한다. 
     * 만료
       * max-age : 리소스가 최신 상태라고 판단할 최대 시간을 지정 
       * s-maxage : max-age 혹은 Expirces 헤더를 재정의하나 공유 캐시에만 적용되며 사설 캐시에 의해서는 무시된다. 
       * max-stale : 캐시의 만료 시간
       * min-fresh : 클라이언트가 지정된 시간동안 신선한 상태로 유지될 응답을 유지할 시간
       * stale-while-revalidate : 비동기 적으로 백그라운드에서 새로운 것으로 체크인하는 동안 클라이언트가 최신이 아닌 응답을 받아 들일 것임을 나타내는 시
     * 재검증과 리로딩
       * must-revalidate : 캐시는 사용하기 이전에 기존 리소스의 상태를 반드시 확인해야 하는지
       * proxy-revalidate : must-revalidate와 동일하지만 공유 캐시에만 적용되며 사설 캐시에 의해서는 무시된다. 
       * immutable : 응답 본문이 계속해서 변하지 않을 것이라는 것을 나타낸다. 
     * 기타
       * no-store : 캐시는 클라이언트 요청 혹은 서버 응답에 관해서 어떤것도 저장하지 않는다. 
       * no-stransform : 응답에 대해 변형이나 변환이 일어나서는 안된다. 예를 들어, 캐시 공간을 절약하고 느린 링크 상의 트래픽량을 줄이기 위해 이미지 포맷들을 변환한다. 
5. Content-Type : 컨텐츠의 타입과 문자열 인코딩을 명시할 수 있다.
   * MIME 타입이란? \(Multipurpose Internet Mail Extensions\)
     * 이전에는 텍스트만 주고 받으면 됐었는데 바이너리 파일을 전송하면서 바이너리 파일들을 텍스트 파일로 변환이 필요하게 되었다.  파일로 변환하는 과정을 인코딩이라 한다. 
     * 시초는 이메일에 첨부된 파일을 텍스트 문자 형태로 변환해서 이메일과 함께 전송하기 위해 개발된 포맷이다. 
6. Content-Language :  사용자 언어 
7. Content-Encoding : 응답 컨텐츠 압축 알고리

X-Forwarded-For

HTTP 프록시나 로드 밸런서를 통해 웹 서버에 접속하는 클라이언트의 원 IP 주소를 식별하는 표준 헤더다. 클라이언트와 서버 중간에서 트래픽이 프록시나 로드 밸런서를 거치면, 서버 접근 로그에는 프록시나 로드 밸런서의 IP 주소만을 담고 있다. 클라이언트의 원 IP 주소를 보기위해 X-Forwarded-For 요청 헤더가 사용된다. 



### 참고

{% embed url="https://www.zerocho.com/category/HTTP/post/5b611b9e33b4636aa8bb1fc4" %}

{% embed url="https://goddaehee.tistory.com/169" %}

{% embed url="https://developer.mozilla.org/ko/docs/Web/HTTP/Headers/Cache-Control" %}

{% embed url="https://juyoung-1008.tistory.com/4" %}



