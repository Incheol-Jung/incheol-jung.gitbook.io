---
description: Effective Java 3e 아이템 60를 요약한 내용 입니다.
---

# 아이템 60 정확한 답이 필요하다면 float와 double은 피하라

float와 double 타입은 과학과 공학 계산용으로 설계되었다. 이진 부동소수점 연산에 쓰이며, 넓은 범위의 수를 빠르게 정밀한 '근사치'로 계산하도록 세심하게 설계되었다. 따라서 float과 double 타입은 특히 금융 관련 계산과는 맞지 않는다.

#### 남은 돈을 계산해보자

```java
// Q1. 1.03달러가 있었는데 그중 42센트를 사용할 경우 얼마가 남았을까?
System.out.println(1.03 - 0.42);
// result : 0.6.10000000000000001

// Q2. 1달러로 10센트짜리 사탕 9개를 살 경우에 얼마가 남았을까?
System.out.println(1.00 - 9 * 0.10);
// result : 0.0999999999999998
```

### 금융 계산에는 BigDecimal, int 혹은 long을 사용하라

다음은 BigDecimal을 사용한 계산법이다.

```java
public static void main(String[] args) {
    final BigDecimal TEN_CENTS = new BigDecimal(".10");

    int itemsBought = 0;
    BigDecimal funds = new BigDecimal("1.00");
    for (BigDecimal price = TEN_CENTS;
        funds.compareTo(price) >= 0;
        price = price.add(TEN_CENTS)) {
        funds = funds.subtract(price);
        itemsBought++;
    }
    System.out.println(itemsBought + "개 구입");
    System.out.println("잔돈(달러): " + funds);
}
```

이 프로그램을 실행하면 사탕 4개를 구입한 후 잔돈은 0달러가 남는다.

### BigDecimal에도 단점은 있다.

* 기본 타입보다 쓰기가 훨씬 불편하고, 훨씬 느리다. 단발성이라면 느리다는 문제는 무시할 수 있지만, 쓰기 불편하다는 점은 못내 아쉬울 것이다.

### BigDecimal의 대안으로 int 혹은 long 타입을 사용하라

int와 long을 사용하여 성능을 향상시킬 순 있지만 다룰 수 있는 값의 크기가 제한되고, 소수점을 직접 관리해야 하는 단점이 있다. 다음은 모든 계산을 달러 대신 센트로 수행한 코드이다.

```java
public static void main(String[] args) {
    int itemsBought = 0;
    int funds = 100;
    for (int price = 10; funds >= price; price += 10) {
        funds -= price;
        itemsBought++;
    }
    System.out.println(itemsBought + "개 구입");
    System.out.println("잔돈(센트): " + funds);
}
```

### 정리

정확한 답이 필요한 계산에는 float나 double을 피하라. 소수점 추정은 시스템에 맡기고, 코딩 시의 불편함이나 성능 저하를 신경 쓰지 않겠다면 BigDecimal을 사용하라. BigDecimal이 제공하는 여덞 가지 반올림 모드를 이용하여 반올림을 완벽히 제어할 수 있다. 법으로 정해진 반올림을 수행해야 하는 비즈니스 계싼에서 아주 편리한 기능이다. 반면, 성능이 중요하고 소수점을 직접 추적할 수 있고 숫자가 너무 크지 않다면 int나 long을 사용하라. 숫자를 아롭 자리 십진수로 표현할 수 있다면 int를 사용하고, 열여덞 자리 십진수로 표현할 수 있다면 long을 사용하라. 열여덞 자리를 넘어가면 BigDeciamal을 사용해야 한다.

