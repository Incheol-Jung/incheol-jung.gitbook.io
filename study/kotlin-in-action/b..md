---
description: KOTLIN IN ACTION 부록 B를 요약한 내용입니다.
---

# 부록 B. 코틀린 코드 문서화

### 코틀린 문서화 주석 작성

코틀린 선언에 사용하는 문서화 주석의 형식은 자바독\(JavaDoc\)과 비슷하며, 케이독\(KDoc\)이라 불린다. 자바독처럼 케이독 주석도 /\*\*으로 시작하며, 특정 선언을 문서화할 때는 @로 시작하는 태그를 사용한다. 자바독과 케이독의 가장 큰 차이는 HTML이 아니라 마크다운을 문서 작성 형식으로 사용한다는 점이다.

```text
/**
 * Performs a complicated operation.
 *
 * @param remote If true, executes operation remotely   
 * @return The result of executing the operation       
 * @throws IOException if remote connnection fails         
 * @sample com.mycompany.SomethingTest.simple    
 */
fun somethingComplicated(remote: Boolean): ComplicatedResult { ... }
```

각 태그의 문법은 자바독과 같다. @Receiver 태그는 확장 함수나 프로퍼티의 수신 객체를 문서화하는 태그다. 지원하는 모든 태그 목록은 [http://kotlinlang.org/docs/reference/kotlin-doc.html에서](http://kotlinlang.org/docs/reference/kotlin-doc.html%EC%97%90%EC%84%9C) 볼 수 있다.

케이독은 다음과 같은 일부 자바독 태그를 지원하지 않는다.

* @deprecated 태그는 없어지고 @Deprecated 애노테이션이 태그 역할도 대신한다.
* @inheritdoc을 지원하지 않는다. 코틀린에서는 문서화 주석이 오버라이딩한 상위 클래스 멤버의 주석을 언제나 자동 상속한다.
* @code, @literal, @link을 지원하지 않는다. 같은 역할을 하는 마크다운 기능을 사용해야 한다.

## API 문서 생성

코틀린 문서 생성 도구는 도카\(Dokka\)다. 코틀린과 마찬가지로 도카도 자바와 코틀린을 함께 사용하는 프로젝트를 완전히 지원한다. 도카는 자바 코드에 있는 자바 독 주석과 코틀린 코드에 있는 케이독 주석을 읽을 수 있고, 코드 작성에 사용한 언어와 관계없이 모듈 전체를 다루는 문서를 생성할 수 있다. 도카는 일반 HTML, 자바독 형식의 HTML, 마크다운 등의 여러 출력 형식을 지원한다.

![](../../.gitbook/assets/111%20%285%29.jpg)

