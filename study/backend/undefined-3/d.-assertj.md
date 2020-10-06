---
description: 테스트 주도 개발 시작하기 부록 D를 요약한 내용입니다.
---

# 부록 D. AssertJ 소개

## AssertJ 사용 이유

JUnit은 테스트 실행을 위한 프레임워크를 제공하지만 한 가지 부족한 점이 있다. 그것은 바로 단언에 대한 표현력이 부족하다는 점이다.

```text
assertTrue(id.contains("a"));
```

이 처럼 단언 코드는 값이 true인지 여부를 확인하는 assertTrue\(\)를 사용하고 있어 실제 검사하는 내용을 표현하고 있지 않다. 이를 AssertJ를 사용하면 다음과 같이 바꿀 수 있다.

```text
assertThat(id).contains("a);
```

AssertJ를 사용하면 테스트 코드의 표현력이 높아질 뿐만 아니라 개발 도구의 자동 완성 기능을 활용할 수 있다. AssertJ가 제공하는 assertThat\(String\) 메서드는 AbstractStringAssert를 리턴하는데 이 클래스는 contains\(\), containsOnlyDigits\(\)를 포함해 다양한 문자열 검증 메서드를 제공하고 있다. 이렇게 AssertJ는 타입별로 다양한 검증 메서드를 제공하고 있어 테스트 코드를 더욱 쉽게 작성할 수 있게 한다.

## AssertJ 기본 사용법

### 기본 검증 메서드

가장 기본적인 검증 메서드는 isEqualTo\(\) 메서드이다.

* isEqualTo\(값\) : 값과 같은지 검증한다.
* isNotEqualTo\(값\) : 값과 같지 않은지 검증한다.
* isNull\(\) : null인지 검증한다
* isNotNull\(\) : null이 아닌지 검증한다.
* isIn\(값 목록\) : 값 목록에 포함되어 있는지 검증한다.
* isNotIn\(값 목록\)

Comparable 인터페이스를 구현한 타입이나 int, double과 같은 숫자 타입의 경우 다음 메서드를 이용해서 값을 검증할 수 있다.

* isLessThan\(값\) : 값 보다 작은지 검증한다.
* isLessThanOrEqualTo\(값\) : 값보다 작거나 같은지 검증한다.
* isGreaterThan\(값\) : 값 보다 큰지 검증한다.
* isGreaterThanOrEqualTo\(값\) : 값보다 크거나 같은지 검증한다.
* isBetween\(값1, 값2\) : 값1과 값2 사이에 포함되는지 검증한다.

### String에 대한 추가 검증 메서드

#### 특정 값을 포함하는지 검사하는 메서드는 다음과 같다.

* contains\(CharSequance... values\) : 인자로 지정한 무자열들을 모두 포함하고 있는지 검증한다.
* containsOnlyOnce\(CharSequance sequance\) : 해당 문자열을 딱 한 번만 포함하는지 검증한다.
* containsOnlyDigits\(\) : 숫자만 포함하는지 검증한다.
* containsWhitespaces\(\) : 공백 문자를 포함하고 있는지 검증한다.
* containsOnlyWhitespaces\(\) : 공백 문자만 포함하는지 검증한다. 공백 문자 여부를 Chracter\#isWhitespace\(\) 메서드를 따른다.

#### 포함하지 않는지 여부를 확인하는 메서드도 있다.

* doesOntContain\(CharSequence... values\) : 인자로 지정한 문자열들을 모두 포함하고 있지 않은지 검증한다.
* doesNotContainAnyWhitespaces\(\) : 공백 문자를 포함하고 있지 않은지를 검증한다.
* doesNotContainOnlyWhitespaces\(\) : 공백 문자만 포함하고 있지 않은지를 검증한다.
* doesNotContainPattern\(Pattern pattern\) : 정규 표현식에 일치하는 문자를 포함하고 있지 않은지를 검증한다.
* doesNotContainPattern\(CharSequence pattern\) : 정규 표현식에 일치하는 문자를 포함하고 있지 않은지를 검증한다.

#### 특정 문자열로 시작하거나 끝나는지 검증할 때에는 다음 메서드를 사용한다.

* startsWith\(CharSequance prefix\) : 지정한 문자열로 시작하는지를 검증한다.
* doesNotStartWith\(CharSequence prefix\) : 지정한 문자열로 시작하지 않는지를 검증한다.
* endsWith\(CharSequence suffix\) : 지정한 문자열로 끝나는지를 검증한다.
* doesNotEndWith\(CharSequence suffix\) : 지정한 문자열로 끝나지 않는지를 검증한다.

### 숫자에 대한 추가 검증 메서드

* isZero\(\) / isNotZero\(\) : 0인지 또는 0이 아닌지를 검증한다.
* isOne\(\) : 1 인지를 검증한다.
* isPositive\(\) / isNotPositive\(\) : 양수인지 또는 양수가 아닌지를 검증한다.
* isNegative\(\) / isNotNegative\(\) : 음수인지 또는 음수가 아닌지를 검증한다.

### 날짜/시간에 대한 검증 메서드

* isBefore\(비교할 값\) : 비교할 값보다 이전인지 검증한다.
* isBeforeOrEqualTo\(비교할 값\) : 비교할 값보다 이전이거나 같은지 검증한다.
* isAfter\(비교할 값\) : 비교할 값보다 이후인지 검증한다.
* isAfterOrEqualTo\(비교할 값\) : 비교할 값보다 이후이거나 같은지 검증한다.

#### LocalDateTime, OffsetDateTime, ZonedDateTime 타입에 대한 추가 검증

* isEqualToIgnoringNanos\(비교할 값\) : 나노 시간을 제외한 나머지 값이 같은지 검증한다. 즉 초 단위까지 값이 같은지 검증한다.
* isEqualToIgnoringSeconds\(비교할 값\) : 초 이하 시간을 제외한 나머지 값이 같은지 검증한다. 즉 분 단위까지 값이 같은지 검증한다.
* isEqualToIgnoringMinutes\(비교할 값\) : 분 이하 시간을 제외한 나머지 값이 같은지 검증한다. 즉 시 단위까지 값이 같은지 검증한다.
* isEualToIgnoringHours\(비교할 값\) : 시 이하 시간을 제외한 나머지 값이 같은지 검증한다. 즉 일 단위까지 값이 같은지 검증한다.

### 콜렉션에 대한 검증 메서드

List, Set 등 콜렉션에 대한 주요 검증 메서드는 다음과 같다.

* hasSize\(int expected\) : 콜렉션의 크기가 지정한 값과 같은지 검증한다.
* contains\(E ... values\) : 콜렉션이 지정한 값을 포함하는지 검증한다.
* containsOnly\(E ... values\) : 콜렉션이 지정한 값 중 일부를 포함하는지 검증한다.
* containsOnlyOnce\(E ... values\) : 콜렉션이 지정한 값을 한 번만 포함하는지 검증한다.

#### 다음은 Map을 위한 주요 검증 메서드이다.

* containsKey\(K Key\) : Map이 지정한 키를 포함하는지 검증한다.
* containsKeys\(K... Keys\) : Map이 지정한 키들을 포함하는지 검증한다.
* containsOnlyKeys\(K... Keys\) : Map이 지정한 키만 포함하는지 검증한다.
* doesNotContainKeys\(K... Keys\) : Map이 지정한 키들을 포함하지 않는지 검증한다.
* containsValues\(VALUE... values\) : Map이 지정한 값들을 포함하는지 검증한다.
* contains\(Entry&lt;K,V&gt; ... values\) : Map이 지정한 Entry&lt;K,V&gt;를 포함하는지 검증한다.

### 익셉션 관련 검증 메서드

* assertThatThrownBy\(\) : 인자로 받은 람다에서 익셉션이 발생하는지 검증한다.
* isInstanceOf\(\) : 익셉션의 타입을 추가로 검증할 수 있다.
* assertThatExceptionOfType\(\) : 발생할 익셉션의 타입을 지정하고 isThrownBy\(\) 메서드를 이용해서 익셉션이 발생할 코드 블록을 지정할 수 있다.

### SoftAssertions로 모아서 검증하기

SoftAssertions는 JUnit 5의 assertAll\(\)과 유사하다. 여러 검증을 한 번에 수행하고 싶을 때 사용한다.

```text
public class SoftAssertionsTest {
    @Test
    void softlyAssertAll() {
        SoftAssertions soft = new SoftAssertions();
        soft.assertThat(1).isBetween(0, 2);
        soft.assertThat(1).isGreaterThan(2);
        soft.assertThat(1).isLessThan(0);
        soft.assertAll();
    }

    @Test
    void softlyStatic() {
        SoftAssertions.assertSoftly(soft -> {
            soft.assertThat(1).isBetween(0, 2);
            soft.assertThat(1).isGreaterThan(2);
            soft.assertThat(1).isLessThan(0);
        });
    }

		@Test
    void describeAs() {
        List<Integer> ret = getResults();

        List<Integer> expected = Arrays.asList(1, 2, 3);
        SoftAssertions soft = new SoftAssertions();
        for (int i = 0 ; i < expected.size() ; i++) {
            soft.assertThat(ret.get(i)).describedAs("ret[%d] desc", i).isEqualTo(expected.get(i));
        }
        soft.assertAll();
    }
}
```

### as\(\)와 describedAs\(\)로 설명 달기

as\(\) 메서드는 테스트에 설명을 붙인다.

```text
assertThat(id).as("ID 검사").isEqualTo("abc")
assertThat(id).as("ID 검사: %s", "abc").isEqualTo("abc")
```

한 테스트 메서드에서 다수의 검증 메서드를 실행할 때 as\(\)를 유용하게 사용할 수 있다.

```text
@Test
void as() {
    List<Integer> ret = getResults();

    List<Integer> expected = Arrays.asList(1, 2, 3);
    SoftAssertions soft = new SoftAssertions();
    for (int i = 0 ; i < expected.size() ; i++) {
        soft.assertThat(ret.get(i)).as("ret[%d]", i).isEqualTo(expected.get(i));
    }
    soft.assertAll();
}
```

as\(\) 메서드 대신에 describedAs\(\) 메서드를 사용해도 된다.

