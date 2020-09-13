---
description: Spring Framework 5 특징에 대해서 살펴보자
---

# Spring 5 특징

![https://blog.algaworks.com/spring-framework-5/](../../.gitbook/assets/cp036-para-artigo-1-sfe-1200x628.png)

## Spring 5 특징

* JDK 기준 업데이트
* 핵심 프레임 워크 개정
* 핵심 컨테이너 업데이트
* Kotlin을 사용한 함수형 프로그래밍
* 반응 형 프로그래밍 모델
* 테스트 개선
* 라이브러리 갱신

## 핵심 프레임워크 개정

Spring Framework 5.0 에서는 Java 8에 도입 된 새로운 기능을 활용하도록 수정되었다.

* Java 8 리플렉션 향상을 기반으로 Spring Framework 5.0의 메서드 매개 변수에 효율적으로 액세스 가능
* @Nullable 및 @NotNull 주석은 명시 적으로 nullable 인수를 표시하고 값을 반환
* 표준 Commons Logging 대신 spring-jcl이라는 Commons Logging 브리지 모듈과 함께 기본 제공

## 핵심 컨테이너 업데이트

* 클래스 경로 스캔의 대안으로 후보 컴포넌트 인덱스를 지원한다. 이 지원은 클래스 경로 스캐너에서 후보 구성 요소 식별 단계를 바로 가기 위해 추가 되었다.
* 클래스 경로를 스캔하지 않고 색인에서 항목을 읽는 것은 클래스가 200 개 미만인 소규모 프로젝트의 경우 큰 차이가 없다. 그러나 대규모 프로젝트에는 상당한 영향이 있을 수 있다. 구성 요소 인덱스를 로드하는 것은 저렴하기 때문에 클래스 수가 증가함에 따라 일정하게 유지된다.
* 컴포넌트 인덱스 스캔 기능은 의존성을 추가하면 바로 사용할 수 있다.

  ```text
  <dependencies>
      <dependency>
          <groupId>org.springframework</groupId>
          <artifactId>spring-context-indexer</artifactId>
          <version>5.0.3.RELEASE</version>
          <optional>true</optional>
      </dependency>
  </dependencies>
  ```

## 코틀린을 사용한 함수형 프로그래밍

Spring Framework 5.0은 JetBrains Kotlin 언어를 지원한다. Kotlin은 함수형 프로그래밍 스타일을 지원하는 객체 지향 언어이다.

```kotlin
@Bean
fun apiRouter() = router {
    (accept(APPLICATION_JSON) and "/api").nest {
        "/book".nest {
            GET("/", bookHandler::findAll)
            GET("/{id}", bookHandler::findOne)
        }
        "/video".nest {
            GET("/", videoHandler::findAll)
            GET("/{genre}", videoHandler::findByGenre)
        }
    }
}
```

## 리액티브 프로그래밍 모델

* 반응형 스택 웹 프레임워크를 지원한다.
* 반응형이며 논 블록킹으로 동작하여 소수의 스레드로 확장할 수 있는 리벤트 루프 스타일 처리에 적합하다.
* java 8 lambda를 사용한 함수형 스타일 라우팅 및 처리가 가능하다.
* @Controller와 Spring MVC의 Annotation 기반으로 구현 가능하다.
* Reactive Streams API는 공식적으로 Java 9의 일부이므로, Java 8에서는 의존성을 추가해야 한다.

```java
// Option1. @Controller 기반
@RestController
public class BookController {
 
    @GetMapping("/book")
    Flux list() {
        return this.repository.findAll();
    }
 
    @GetMapping("/book/{id}")
    Mono findById(@PathVariable String id) {
        return this.repository.findOne(id);
    }
}

// Option2. Router/Handler 기반

RouterFunction personRoute =
    route(
        GET("/books/{id}").and(accept(APPLICATION_JSON)), handler::getBook)
        .andRoute(GET("/books").and(accept(APPLICATION_JSON)), handler::listBooks);
```

## 향상된 테스트

* Junit 5 Jupiter 완벽지원
* 리액티브 모델의 경우 Spring Webflux에 대한 테스트를 지원하기 위해 WebTestClient를 사용할 수 있다.
* Spring TestContext Framework에서 병렬 테스트 실행을 지원한다.

```java
// WebClient 사용한 테스트 케이스 
Mono book = WebClient.create("<http://localhost:8080>")
      .get()
      .url("/books/{id}", 1234)
      .accept(APPLICATION_JSON)
      .exchange(request)
      .then(response -> response.bodyToMono(Book.class));
```

## 라이브러리 갱신

### 갱신된 지원 패키지 

* Jackson 2.6 이상
* EhCache 2.10+ / 3.0 GA
* 최대 절전 모드 5.0 이상
* JDBC 4.0 이상
* XmlUnit 2.x 이상
* OkHttp 3.x 이상
* Netty 4.1 이상

### 지원 중단 패키

* beans.factory.access
* jdbc.support.nativejdbc
* web.view.tiles2M
* orm.hibernate3 및 orm.hibernate4
* JasperReports
* XMLBeans
* JDO
* Guava

## 참고

* [https://dzone.com/articles/whats-new-in-spring-framework-5](https://dzone.com/articles/whats-new-in-spring-framework-5)
* [https://www.journaldev.com/20714/spring-5](https://www.journaldev.com/20714/spring-5)
* [https://shuiky.tistory.com/entry/springframework-5-새로운-기능](https://shuiky.tistory.com/entry/springframework-5-%EC%83%88%EB%A1%9C%EC%9A%B4-%EA%B8%B0%EB%8A%A5)











