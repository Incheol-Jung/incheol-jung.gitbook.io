---
layout: reference
title: 아이템26 로 타입은 사용하지 말라
date: '2020-03-10T00:00:00.000Z'
categories: effective
summary: Effective Java 3e 아이템 26을 요약한 내용 입니다.
navigation_weight: 26
---

# 2020-03-20-effective-26item

> Effective Java 3e 아이템 26를 요약한 내용 입니다.

클래스와 인터페이스 선언에 `타입 매개변수`가 쓰이면 이를 `제네릭 클래스` 혹은 `제네릭 인터페이스`라 한다. 제네릭 클래스와 제네릭 인터페이스를 통틀어 `제네릭 타입`이라 한다.

제네릭 타입을 하나 정의하면 그에 딸린 `로 타입(raw type)`도 함께 정의된다. **로 타입이란 제네릭 타입에서 타입 매개변수를 전혀 사용하지 않을 때를 말한다.**

```java
public class StampCollection {
    private final Collection stamps = ...;

    public static void main(String[] args) {
    StampCollection stamps = new StampCollection();
    // 실수로 동전을 넣는다.
    stamps.add(new Coin(...)); // "unchecked call" 경고를 내뱉는다.

    for (Iterator i = stamps.iterator(); i.hasNext();) {
        Stamp stamp = (Stamp) i.next(); // ClassCastException을 던진다.
        stamp.cancel();
    }
}
```

이렇게 되면 `런타임`에 문제를 겪는 코드와 원인을 제공한 코드가 물리적으로 상당히 떨어져 있을 가능성이 커진다.

이렇듯 로 타입\(`타입 매개변수가 없는 제네릭 타입`\)을 쓰는 걸 언어 차원에서 막아 놓지는 않았지만 절대로 써서는 안 된다. 로 타입을 쓰면 제네릭이 안겨주는 `안전성`과 `표현력`을 모두 읽게 된다.

`List` 같은 로 타입은 사용해서는 안 되나, `List<Object>`처럼 임의 객체를 허용하는 매개변수화 타입은 괜찮다.

### List와 List의 차이는 무엇일까?

`List`는 제네릭 타입에서 완전히 발을 뺀 것이고, `List<Object>`는 모든 타입을 `허용`한다는 의사를 컴파일러에 명확히 전달한 것이다. 즉, `List<String>`은 로 타입인 List의 `하위` 타입이지만, `List<Object>`의 하위 타입은 아니다. 그 결과, `List<Object>` 같은 매개 변수 화 타입을 사용할 때와 달리 List 같은 로 타입을 사용하면 `타입 안전성`을 잃게 된다.

```java
static int numElementsInCommon(Set s1, Set s2) {
    int result = 0;
    for (Object o1 : s1)
    if (s2.contains(o1))
        result++;
    return result;
}
```

**이 메서드는 동작은 하지만 로 타입을 사용해 안전하지 않다.** 따라서 비 한정적 `와일드카드 타입`을 대신 사용하는 게 좋다.

```java
static int numElementsInCommon(Set<?> s1, Set<?> s2) { ... }
```

### Set과 Set&lt;?&gt;의 차이는 무엇일까?

**와일드카드 타입은 안전하고, 로 타입은 안전하지 않다.** 로 타입 컬렉션에는 아무 원소나 넣을 수 있으니 `타입 불변식`을 훼손하기 쉽다. 반면, Collection&lt;?&gt;에는 \(`null 외에는`\) 어떤 원소도 넣을 수 없다. 다른 원소를 넣으려 하면 컴파일할 때 다음의 오류 메시지를 보게 될 것이다.

```java
WildCard.java:13: error: incompatible types: String cannot be
converted to CAP#1
    c.add("verboten");
        ^
```

즉, 컬렉션의 타입 불변식을 훼손하지 못하게 막았다.

### 로 타입을 쓰지 말라는 규칙에도 예외는 있다.

class `리터럴`에는 로 타입을 써야 한다. 자바 명세는 class 리터럴에 매개변수화 타입을 사용하지 못하게 했다.

* 허용 : List.class, String\[\].class, int.class
* 허용하지 않음 : List.class, List&lt;?&gt;.class

또 다른 이유는 `런타임`에는 제네릭 타입정보가 지워지므로 `instanceof` 연사자는 비 한정적 와일드카드 타입 이외의 `매개변수화 타입`에는 적용할 수 없다. **비 한정적 와일드 카드 타입의 꺽쇠 괄호와 물음표는 아무런 역할 없이 코드만 지저분하게 만드므로, 차라리 로 타입을 쓰는 편이 깔끔하다.**

```java
if (o instanceof Set) {
    Set<?> s = (Set<?>) o;
    ...
}
```

## 정리

로 타입을 사용하면 `런타임`에 예외가 일어날 수 있으니 사용하면 안 된다. 로 타입은 제네릭이 도입되기 이전 코드와의 `호환성`을 위해 제공될 뿐이다. `Set<Object>`는 어떤 타입의 객체도 저장할 수 있는 매개 변수화 타입이고, `Set<?>`는 모종의 타입 객체만 저장할 수 있는 와일드카드 타입이다.

