---
description: Filter와 Interceptor의 차이에 대해 알아보자
---

# Filter와 Interceptor

![](../../.gitbook/assets/997bae4d5c8b3f7d10.jpg)

## Filter

* DispatcherServlet 이전에 실행 된다.
*   모든 요청을 처리하는 DispatcherServlet 앞단에 실행되기 때문에 모든 일괄적인 요청에 대해 변경하거나 유효성 검사를 한곳에서 처리할 수 있다. (인코딩 변환, 로그인 여부확인, XSS 방어)

    ```
    public class SomeFilter implements Filter {
      //...
      
      public void doFilter(ServletRequest request, ServletResponse response, FilterChain chain) {
        chain.doFilter(new CustomServletRequest(), new CustomResponse());
      }
    }
    ```
* 스프링 빈이 아니므로 web.xml에 등록한다.
* Filter는 빈으로 등록 되지 않아서 주입을 받을 수는 없지만 애플리케이션 컨텍스트의 생성된 빈들을 주입 받을 수는 있다. (ex. SpringSecurity Filter)

## Interceptor

* Interceptor는 DispatcherServlet 다음에 실행되는 스프링 내부 영역으로 Application Context 내에서 관리되므로 Bean 으로 등록할 수 있다.
* Interceptor는 특정 HandlerMapping 에 종속되어 다양한 전략의 Interceptor를 생성할 수 있다.
* Interceptor는 @ControllerAdvice @ExceptionHandler를 이용해 예외 처리가 가능하다

## 참고

* [https://javawork.tistory.com/entry/Spring-Filter-Interceptor-AOP](https://javawork.tistory.com/entry/Spring-Filter-Interceptor-AOP)
* [https://goddaehee.tistory.com/154](https://goddaehee.tistory.com/154)
* [https://meetup.toast.com/posts/151](https://meetup.toast.com/posts/151)
* [https://insight-bgh.tistory.com/153](https://insight-bgh.tistory.com/153)
