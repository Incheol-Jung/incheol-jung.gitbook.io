---
description: 테스트 주도 개발 시작하기 5장을 요약한 내용입니다.
---

# CHAP 05. JUnit 5 기초

## JUnit 5 모듈 구성

JUnit 5는 크게 세 개의 요소로 구성되어 있다.

* JUnit 플랫폼 : 테스팅 프레임워크를 구동하기 위한 런처와 테스트 엔진을 위한 API를 제공한다.
* JUnit 주피터\(Jupiter\) : JUnit 5를 위한 테스트 API와 실행 엔진을 제공한다.
* JUnit 빈티지\(Vintage\) : Junit 3과 4로 작성된 테스트를 JUnit 5 플랫폼에서 실행하기 위한 모듈을 제공한다.

## @Test 애노테이션과 테스트 메서드

테스트로 사용할 클래스를 만들고 @Test 애노테이션을 메서드에 붙이기만 하면 된다. 단, private 메서드는 적용이 안된다. JUnit의 Assertions 클래스는 assertEquals\(\) 메서드와 같이 값을 검증하기 위한 목적의 다양한 정적 메서드르 제공한다.

```text
@Test
void 만원_납부하면_한달_뒤가_만료일이_됨() {
    ExpiryDateCalculator cal = new ExpiryDateCalculator();
    LocalDate realExpiryDate = cal.calculateExpiryDate(payData);
    assertEquals(expectedExpiryDate, realExpiryDate);
}
```

## 주요 단언 메서드

| 메서드 | 설명 |
| :--- | :--- |
| assertEquals\(expected, actual\) | 실제 값\(actual\)이 기대하는 값\(exptected\)과 같은지 검사한다. |
| assertNotEquals\(expected, actual\) | 실제 값\(actual\)이 기대하는 값\(exptected\)과 같지 않은지 검사한다. |
| assertSame\(Obect expected, Object actual\) | 두 객체가 동일한 객체인지 검사한다 |
| assertNotSame\(Obect expected, Object actual\) | 두 객체가 동일하지 않은 객체인지 검사한다 |
| assertTrue\(boolean condition\) | 값이 true인지 검사한다 |
| assertFalse\(boolean condition\) | 값이 false인지 검사한다 |
| assertNull\(Object actual\) | 값이 null인지 검사한다 |
| assertNotNull\(Object actual\) | 값이 null이 아닌지 검사한다 |
| fail\(\) | 테스트를 실패 처리한다 |

## 테스트 라이프사이클

### @BeforeEach , @AfterEach

Junit은 각 테스트 메서드마다 다음 순서대로 코드를 실행한다.

1. 테스트 메서드를 포함한 객체 생성
2. \(존재하면\) @BeforeEach 애노테이션이 붙은 메서드 실행
3. @Test 애노테이션이 붙은 메서드 실행
4. \(존재하면\) @AfterEach 애노테이션이 붙은 메서드 실행

@BeforeEach는 테스트를 실행하는데 필요한 준비 작업을 할 때 사용한다. @AfterEach는 테스트를 실행한 후에 정리할 것이 있을 때 사용한다.

### @BeforeAll, @AfterAll

한 클래스의 모든 테스트 메서드가 실행되기 전에 특정 작업을 수행해야 한다면 @BeforeAll 애노테이션을 사용한다. @BeforeAll 애노테이션은 정적 메서드에 붙이는데 이 메서드는 클래스의 모든 테스트 메서드를 실행하기 전에 한 번 실행된다.

@AfterAll 애노테이션은 반대로 클래스의 모든 테스트 메서드를 실행한 뒤에 실행된다. 이 메서드 역시 정적 메서드에 적용한다.

## 테스트 메서드 간 실행 순서 의존과 필드 공유하지 않기

```text
public class BadTest {
    private FileOperator operator = new FileOperator();
    private static File file; // 두 테스트가 데이터를 공유할 목적으로 필드 사용
    
    @Test
    void fileCreationTest() {
        File createdFile = operator.createFile();
        assertTrue(createdFile.length() > 0);
        this.fileCreationTest() = createdFile;
    }

    @Test
    void readFileTest() {
        long data = operator.readData(file);
        assertTrue(data >0);
    }
}
```

이 코드는 file 필드를 이용해서 fileCreationTest\(\) 메서드에서 생성한 File을 보관하고 그 file 필드를 readFileTest\(\) 메서드에서 사용한다. 각 테스트 메서드는 서로 독립적으로 동작해야 한다. 한 테스트 메서드의 결과에 따라 다른 테스트 메서드의 실행 결과가 달라지면 안 된다. 그런 의미에서 테스트 메서드가 서로 필드를 공유한다거나 실행 순서를 가정하고 테스트를 작성하지 말아야 한다.

## 추가 애노테이션: @DisplayName, @Disabled

자바는 메서드 이름에 공백이나 특수 문자를 사용할 수 없기 때문에 메서드 이름만으로 테스트 내용을 설명하기가 부족할 수 있다. 이럴 때는 @DisplayName 애노테이션을 사용해서 테스트에 표시 이름을 붙일 수 있다.

```text
@DisplayName("약한 암호면 가입 실패")
@Test
void weakPassword() {
    stubPasswordChecker.setWeak(true);

    assertThrows(WeakPasswordException.class, () -> {
        userRegister.register("id", "pw", "email");
    });
}
```

특정 테스트를 실행하고 싶지 않을 때는 @Disabled 애노테이션을 사용한다. JUnit은 @Disabled 애노테이션이 붙은 클래스나 메서드는 테스트 실행 대상에서 제외한다. 아직 테스트 코드가 완성되지 않았거나 잠시 동안 테스트를 실행하지 말아야 할 때 이 애노테이션을 사용한다.

```text
@Disabled
@Test
void failMethod() {
    try {
        AuthService authService = new AuthService();
        authService.authenticate(null, null);
        fail();
    } catch(IllegalArgumentException e) {
    }
}
```

