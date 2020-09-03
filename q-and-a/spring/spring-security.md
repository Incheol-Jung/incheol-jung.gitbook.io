---
description: Spring Security 동작 과정을 살펴보자
---

# Spring Security

![](../../.gitbook/assets/img1.daumcdn.png)

## Spring Security Process

1. 사용자가 로그인 정보와 함께 인증 요청\(Http Request\) 한다
2. AuthenticationFilter가 이 요청을 가로채서 UsernamePasswordAuthenticationToken이라는 인증용 객체를 생성한다.
3. AuthenticationManager의 구현체인 ProviderManager에게 UsernamePasswdAuthenticationToken 객체를 전달한다.
4. AuthenticationManager에 등록된 AuthenticationProvider에 UsernamePasswordAuthenticationToken 객체를 전달한다.
5. 실제 데이터베이스에서 사용자 인증정보를 가져오는 UserDetailsService에 사용자 정보\(아이디\)를 넘겨주게 된다.
6. 넘겨받은 사용자 정보를 통해 DB에서 찾은 사용자 정보인 UserDetails 객체를 생성한다. 이 때 UserDetails 는 인증용 객체와 도메인용 객체를 분리하지 않고 인증용 객체에 상속해서 사용하기도 한다.
7. AuthenticationProvider는 UserDetails를 넘겨받고 사용자 정보를 비교한다.
8. 인증이 완료되면 권한 등의 사용자 정보를 담은 Authentication 객체를 반환한다.
9. 다시 최초의 AuthenticationFilter에 Authentication 객체가 반환한다.
10. Authentication 객체를 SecurityContext에 저장한다.
11. 최종적으로 SecurityContextHolder는 세션 영역에 있는 SecurityContext에 Authentication 객체를 저장한다. 세션에 사용자 정보를 저장한다는 것은 스프링 시큐리티가 전통적인 세션-쿠키 기반의 인증 방식을 사용한다는 것을 의미한다.

## 모든 절차는 동일한가?

모든 절차는 동일하지 않다. Filter를 구현하지 않고 RequestMatcher를 통해 바로 AuthenticationManager에게 요청값을 그대로 전달할 수 도 있다. 또는, UserDetailsService의 역할을 ProviderManager가 직접 수행하는 경우도 있다.

## AuthenticationManager는 왜 필요하나?

프로세스를 살펴보면 실제로 AuthenticationManager는 직접 수행하는 로직은 없고 등록된 ProviderManager를 통해서 직접적인 인증 처리를 구현하고 있다. 그러므로 AuthenticationManager를 거치치 않고 ProviderManager를 직접 수행해도 문제가 되지는 않는다. 하지만 AuthenticationManager를 거치게 되면 요청값에 따라 다양한 ProviderManager를 분기처리가 가능하다. 그리고 또한 한 종류의 ProviderManager를 사용한다고 하더라도 애플리케이션이 추후에 인증 절차가 변경된다고 하더라도 ProviderManager만 교체 하더라도 별도의 코드 수정은 필요하지 않게 된다.

## 참고

* [https://tech.wheejuni.com/2018/06/04/spring-questions/](https://tech.wheejuni.com/2018/06/04/spring-questions/)
* [https://sjh836.tistory.com/165](https://sjh836.tistory.com/165)

