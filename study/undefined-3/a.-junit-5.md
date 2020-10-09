---
description: 테스트 주도 개발 시작하기 부록 A를 요약한 내용입니다.
---

# 부록 A. Junit 5 추가 내용

## 조건에 따른 테스트

JUnit 5는 조건에 따라 테스트를 실행할지 여부를 결정하는 기능을 제공한다.

### @EnabledOnOs, @DisabledOnOs

특정 운영체에따라 테스트를 동작해야 할 경우에 사용할 수 있다.

```java
public class OsTmpPathTest {
    @Test
    @EnabledOnOs(OS.WINDOWS)
    void windowTmpPath() {
        Path tmpPath = Paths.get("c:\\\\Temp");
        assertTrue(Files.isDirectory(tmpPath));
    }

    @Test
    @EnabledOnOs(OS.LINUX)
    void linuxTmpPath() {
        Path tmpPath = Paths.get("/tmp");
        assertTrue(Files.isDirectory(tmpPath));
    }
}
```

### @EnabledOnJre, @DisabledOnJre

자바 버전에 따라 테스트를 실행할 수 있다.

```java
@Test
@EnabledOnJre({JRE.JAVA_8, JRE.JAVA_9, JRE.JAVA_10, JRE.JAVA_11})
void testOnJre() {
    assertEquals(LocalDate.of(1919, 3, 1), LocalDate.of(2019, 3, 1).minusYears(100));
}
```

### @EnabledIfSystemProperty, @DisabledIfSystemProperty

시스템 프로퍼티 값을 비교하여 테스트 실행 여부를 결정한다. named 속성은 시스템 프로피터의 이름을 지정하고 matches 속성에는 값의 일치 여부를 검사할 때 사용할 정규 표현식을 지정한다.

```java
public class SystemPropertyTest {

    @Test
    @EnabledIfSystemProperty(named = "java.vm.name", matches = ".*OpenJDK.*")
    void openJdk() {
        assertEquals(2, 1 + 1);
    }

    @Test
    @DisabledIfSystemProperty(named = "java.vm.name", matches = ".*OpenJDK.*")
    void notOpenJdk() {
        assertEquals(2, 1 + 1);
    }
}
```

### @EnabledIfEnvironmentVariable, @DisabledIfEnvironmentVariable

@EnabledIfSystemProperty, @DisabledIfSystemProperty 속성과 동일하나 차이는 named 속성에 환경변수 이름을 사용한다.

## 태깅과 필터링

@Tag 애노테이션은 테스트에 태그를 달 때 사용한다. @Tag 애노테이션은 클래스와 테스트 메서드에 적용할 수 있다.

```java
@Tag("integration")
public class TagTest {

    @Tag("very-slow")
    @Test
    void verySlow() {
        int result = someVerySlowOp();
        assertEquals(result, 0);
    }

    @Tag("slow")
    @Test
    void slow() {
        int result = someVerySlowOp();
        assertEquals(result, 0);
    }

    private int someVerySlowOp() {
        return 0;
    }

    @Test
    void normal() {
        assertEquals("abc", "abc".substring(0, 3));
    }
}
```

### 태그의 이름은 다음 규칙을 따라야 한다.

* null이나 공백이면 안 된다.
* 좌우 공백을 제거한 뒤에 공백을 포함하면 안 된다.
* ISO 제어 문자를 포함하면 안 된다.
* 다음 글자를 포함하면 안 된다. : , \( \) & \| !

### 태그를 기준으로 테스트 대상을 포함하거나 제외시킬 수 있다.

```java
test {
    useJUnitPlatform {
        includeTags 'integration'
        excludeTags 'slow | very-slow'
    }
    testLogging {
        events "passed", "skipped", "failed"
    }
}
```

* ! : NOT 연산
* & : AND 연산
* \| : OR 연산

## 중첩 구성

@Nested 애노테이션을 사용하면 중첩 클래스에 테스트 메서드를 추가할 수 있다.

```java
public class Outer {

    public Outer() {
        System.out.println("outer constructor");
    }

    @BeforeEach
    void outerBefore() {
        System.out.println("outer before");
    }

    @Test
    void outer() {
        System.out.println("outer");
    }

    @AfterEach
    void outerAfter() {
        System.out.println("outer after");
        System.out.println("---------------");
    }

    @Nested
    class NestedA {

        public NestedA() {
            System.out.println(">> A constructor");
        }

        @BeforeEach
        void nestedBefore() {
            System.out.println(">> A-before");
        }

        @AfterEach
        void nestedAfter() {
            System.out.println(">> A-after");
        }

        @Test
        void nested1() {
            System.out.println(">> A-a1");
        }

        @Test
        void nested2() {
            System.out.println(">> A-a2");
        }
    }
}
```

위 코드를 기준으로 중첩 클래스의 테스트 메서드인 nested1\(\)을 실행하는 순서는 다음과 같다.

1. Outer 객체 생성
2. NestedA 객체 생성
3. outerBefore\(\) 메서드 실행
4. nestedBefore\(\) 메서드 실행
5. nested1\(\) 테스트 실행
6. nextedAfter\(\) 메서드 실행
7. outerAfter\(\) 메서드 실행

## 테스트 메시지

```java
public class MessageTest {
    @Test
    void message() {
        List<Integer> ret = getResults();
        List<Integer> expected = Arrays.asList(1, 2, 3);
        for (int i = 0 ; i < expected.size() ; i++) {
            assertEquals(expected.get(i), ret.get(i), "ret[" + i + "]");
        }
    }

    private List<Integer> getResults() {
        return Arrays.asList(1, 6, 3);
    }

}
```

assertEuqlas 메서드의 세 번째 인자로 설명 문자열을 추가하였다. 이렇게 한 테스트 메서드에 구분이 쉽지 않은 단얼을 여러 번 하는 경우 메시지를 사용해서 각 단얼을 쉽게 구분할 수 있다.

## @TempDir 애노테이션을 이용한 임시 폴더 생성

파일과 관련된 테스트 코드를 만들다 보면 임시로 사용할 폴더가 필요할 때가 있다. 테스트를 시작하기 전에 임시로 사용할 폴더를 만들고 임시 폴더에 파일을 생성하고 테스트가 끝나면 임시 폴더와 파일을 삭제하는 코드를 직접 만들 수 있지만 이는 꽤 성가신 작업이다.

@TempDir 애노테이션을 사용하면 JUnit은 임시 폴더를 생성하고 임시 폴더 경로를 전달한다.

```java
public class TempDirTest {

    @TempDir
    File tempFolderFile;

    @Test
    void test1() {
        System.out.println(tempFolderFile.getAbsolutePath());
    }

    @Test
    void test2(@TempDir Path tempFolderPath) {
        System.out.println(tempFolderFile.getAbsolutePath());
    }
}
```

테스트를 실행 뒤에는 생성한 임시 폴더를 삭제한다. 물론 이 과정에서 임시 폴더에 작성한 파일도 함께 삭제한다.

## @Timeout 애노테이션을 이용한 테스트 실행 시간 검증

@Timeout 애노테이션을 사용하면 테스트가 일정 시간 내에 실행되는지 검증할 수 있다.

```java
public class TimeoutTest {
    @Test
    @Timeout(1)
    void sleep2seconds() throws InterruptedException {
        Thread.sleep(2000);
    }

    @Test
    @Timeout(value = 500, unit = TimeUnit.MILLISECONDS)
    void sleep40Mills() throws InterruptedException {
        Thread.sleep(40);
    }
}
```

