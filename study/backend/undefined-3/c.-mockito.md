---
description: 테스트 주도 개발 시작하기 부록 C를 요약한 내용입니다.
---

# 부록 C. Mockito 기초 사용법

Mockito는 모의 객체 생성, 검증, 스텁을 지원하는 프레임워크이다. Mockito의 기본 사용법을 설명하며 이를 통해 대역을 보다 원활하게 사용할 수 있게 될 것이다.

## 모의 객체 생성

Mockito.mock\(\) 메서드를 이용하면 특정 타입의 모의 객체를 생성할 수 있다.

```java
@Test
void mockClass() {
    GameNumGen mockGen = mock(GameNumGen.class);
    given(mockGen.generate(GameLevel.EASY)).willReturn("123");
    assertEquals("123", mockGen.generate(GameLevel.EASY));
}
```

## 스텁 설정

모의 객체를 생성한 뒤에는 BDDMockito 클래스를 이용해서 모의 객체에 스텁을 구성할 수 있다.

```java
@Test
void mockClass() {
    GameNumGen mockGen = mock(GameNumGen.class);
    given(mockGen.generate(GameLevel.EASY)).willReturn("123");
    assertEquals("123", mockGen.generate(GameLevel.EASY));
}
```

지정한 값을 리턴하는 대신에 익셉션을 발생하게 설정할 수도 있다.

```java
@Test
void mockThrowTest() {
    GameNumGen genMock = mock(GameNumGen.class);
    given(genMock.generate(null)).willThrow(new IllegalArgumentException());

    assertThrows(
            IllegalArgumentException.class,
            () -> genMock.generate(null));
}
```

## 인자 매칭 처리

org.mockito.ArgumentMatchers 클래스를 사용하면 정확하게 일치하는 값 대신 임의의 값에 일치하도록 설정할 수 있다.

```java
import org.junit.jupiter.api.Test;

import java.util.List;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.mockito.ArgumentMatchers.*;
import static org.mockito.BDDMockito.given;
import static org.mockito.BDDMockito.then;
import static org.mockito.Mockito.mock;

public class VerifyTest {
    @Test
    void anyMatchTest() {
        GameNumGen genMock = mock(GameNumGen.class);
        given(genMock.generate(any())).willReturn("456");

        String num = genMock.generate(GameLevel.EASY);

        then(genMock).should().generate(GameLevel.EASY);
    }

}
```

### ArgumentMatchers 클래스는 any\(\) 외에도 다음의 메서드를 제공한다.

* anyInt\(\), anyShort\(\), anyLong\(\), anyByte\(\), anyChar\(\). anyDouble\(\), anyFloat\(\), anyBoolean\(\) : 기본 데이터 타입에 대한 임의 값 일피
* anyString\(\) : 문자열에 대한 임의 값 일치
* any\(\) : 임의 타입에 대한 일치
* anyList\(\), antSet\(\), anyMap\(\), anyCollection\(\) : 임의 콜렉션에 대한 일치
* matches\(String\), matches\(Pattern\) : 정규표현식을 이용한 String 값 일치 여부
* eq\(값\) : 특정 값과 일치 여부

## 행위 검증

모의 객체의 역할 중 하나는 실제로 모의 객체가 불렸는지 검증하는 것이다.

```java
public class VerifyTest {
    @Test
    void anyMatchTest() {
        GameNumGen genMock = mock(GameNumGen.class);
        given(genMock.generate(any())).willReturn("456");

        String num = genMock.generate(GameLevel.EASY);

        then(genMock).should().generate(GameLevel.EASY);
    }

}
```

정확하게 한 번만 호출된 것을 검증하고 싶다면 should\(\) 메서드에 Mockito.only\(\)를 인자로 전달한다.

```java
then(genMock).should(only()).generate(GameLevel.EASY);
```

* only\(\) : 한 번만 호출
* times\(int\) : 지정한 횟수만큼 호출
* never\(\) : 호출하지 않음
* atLeast\(int\) : 적어도 지정한 횟수만큼 호출
* atLeastOnce\(\) : atLeast\(1\)과 동일
* atMost\(int\) : 최대 지정한 횟수만큼 호출

## 인자 캡쳐

단위 테스트를 실행하다보면 모의 객체를 호출할 때 사용한 인자를 검증해야 할 때가 있다. String이나 int와 같은 타입은 쉽게 검증할 수 있지만 많은 속성을 가진 객체는 쉽게 검증하기 어렵다. 이럴 때 사용할 수 있는 것이 인자 캡처이다.

Mockito의 ArgumentCaptor를 사용하면 메서드 호출 여부를 검증하는 과정에서 실제 호출할때 전달한 인자를 보관할 수 있다.

```java
@DisplayName("가입하면 메일을 전송함")
@Test
void whenRegisterThenSendMail() {
    userRegister.register("id", "pw", "email@email.com");

    ArgumentCaptor<String> captor = ArgumentCaptor.forClass(String.class);
    BDDMockito.then(mockEmailNotifier).should().sendRegisterEmail(captor.capture());

    String realEmail = captor.getValue();
    assertEquals("email@email.com", realEmail);
}
```

## JUnit 5 확장 설정

Mockito의 JUnit 5의 확장 기능을 사용하면 애노테이션을 이용해서 모의 객체를 생성할 수 있다. 확장 기능을 사용하려면 mockito-junit-jupiter 의존을 추가해야 한다.

```java
<dependency>
    <groupId>org.junit.jupiter</groupId>
    <artifactId>junit-jupiter</artifactId>
    <version>5.5.0</version>
    <scope>test</scope>
</dependency>
```

의존을 추가했다면 MockitoExtension 확장을 사용할 수 있다.

```java
@ExtendWith(MockitoExtension.class)
public class JUnit5ExtensionTest {

    @Mock
    private GameNumGen genMock;

		...
}
```

