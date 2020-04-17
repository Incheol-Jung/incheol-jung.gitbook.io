---
layout: reference
title: "아이템32 제네릭과 가변인수를 함께 쓸 때는 신중하라"
date: 2020-03-10 00:00:00
categories: effective
summary: Effective Java 3e 아이템 32을 요약한 내용 입니다.
navigation_weight: 32
---

> Effective Java 3e 아이템 32를 요약한 내용 입니다.

**`가변인수 메서드`를 호출하면 가변인수를 담기 위한 배열이 자동으로 하나 만들어진다.** 그런데 내부로 감춰야 했을 이 배열을 그만 클라이언트에 노출하는 문제가 생겼다. 그 결과 `varargs` 매개변수에 제네릭이나 매개변수화 타입이 포함되면 알기 어려운 `컴파일 경고`가 발생한다. 
```java
warning: [unchecked] Possible heap pollution from 
    parameterized vararg type List<String>
```
매개변수화 타입의 변수가 타입이 다른 객체를 참조하면 `힙 오염`이 발생한다. 다음 메서드를 통해 확인해보자. 
```java
static void danferous(List<String>... stringLists) {
    List<Integer> intList = List.of(42);
    Object[] objects = stringLists;
    objects[0] = intList; // 힙 오염 발생
    String s = stringLists[0].get(0); // ClassCastException
}
```
이 메서드 에서는 형변환하는 곳이 보이지 않는데도 인수를 건네 호출하면 `ClassCastException`을 던진다. 마지막 줄에 컴파일러가 생성한 `(보이지 않는)형변환`이 숨어 있기 때문이다. 

**제네릭 배열을 프로그래머가 직접 생성하는 건 허용하지 않으면서 제네릭 varargs 매개변수를 받는 메서드를 선언할 수 있게 한 이유는 무엇일까?** 그 답은 `제네릭`이나 `매개변수화` 타입의 varargs 매개변수를 받는 메서드가 실무에서 매우 유용하기 때문이다. 사실 자바 라이브러리도 이런 메서드를 여럿 제공하는데, **Arrays.asList(T... a), Collections.addAll(Collection<? super T> c, T... elements), EnumSet.of(E first, E...rest)**가 대표적이다. 

그래서 사용자는 이 경고 들을 그냥 두거나 (더 흔하게는) 호출하는 곳마다 `@SuppressWarnings("unchkecked")` 에너테이션을 달아 경고를 숨겨야 했다. 그래서 자바 7에서는 `@SafeVarargs` 애너테이션이 추가되어 제네릭 가변인수 메서드 작성자가 클라이언트 측에서 발생하는 경고를 숨길 수 있게 되었다. `@SafeVarargs` 애너테이션은 메서드 작성자가 그 메서드가 타입 안전함을 보장하는 장치다. **컴파일러는 이 약속을 믿고 그 메서드가 안전하지 않을 수 있다는 경고를 더 이상 하지 않는다.** 

### 그렇다면 메서드가 안전한지는 어떻게 확신할 수 있을까?

메서드가 이 배열에 아무것도 저장하지 않고(그 `매개변수`들을 덮어쓰지 않고) 그 배열의 참조가 밖으로 노출되지 않는다면(신뢰할 수 없는 코드가 배열에 접근할 수 없다면)타입 안전하다. 
```java
static <T> T[] toArray(T... args) {
    return args;
}
```
이 메서드가 반환하는 배열의 타입은 이 메서드에 인수를 넘기는 `컴파일 타임`에 결정되는데, 그 시점에는 컴파일러에게 충분한 정보가 주어지지 않아 타입을 잘못 판단할 수 있다. 
```java
static <T> T[] pickTwo(T a, T b, T c) {
    switch(ThreadLocalRandom.current().nextInt(3)) {
    case 0: return toArray(a, b);
    case 0: return toArray(a, b);
    case 0: return toArray(a, b);
    }
    throw new AssertionError(); // 도달할 수 없다. 
}
```
다음 메서드는 T 타입 인수 3개를 받아 그중 2개를 무작위로 골라 담은 배열을 반환한다. 
```java
public static void main(String[] args) {
    String[] attributes = pickTwo("좋은", "빠른", "저렴한");
}
```
아무런 문제가 없는 메서드이니 별다른 경고 없이 컴파일된다. 하지만 실행하려 들면 `ClassCastException`을 던진다. Object[]는 String[]의 하위 타입이 아니므로 이 형변환은 실패하기 때문이다. 

즉, 다음 두 조건을 모두 만족하는 제네릭 `varargs` 메서드는 안전하다. 둘 중 하나라도 어겼다면 수정하라

- **varargs 매개변수 배열에 아무것도 저장하지 않는다.**
- **그 배열(혹은 복제본)을 신뢰할 수 없는 코드에 노출하지 않는다.**

다음은 제네릭 `varargs` 매개변수를 안전하게 사용하는 전형적인 예다. 다음의 `flattern` 메서드는 임의 개수의 리스트를 인수로 받아, 받은 순서대로 그 안의 모든 원소를 하나의 리스트로 옮겨 담아 반환한다. 
```java
@SafeVarargs
static <T> List<T> flatten(List<? extends T>... lists) {
    List<T> result = new ArrayList<>();
    for (List<? extends T> list : lists)
    result.addAll(list);
    return result;
}
```
## 정리

**`가변인수`와 `제네릭`은 궁합이 좋지 않다.** 가변인수 기능은 배열을 노출하여 `추상화`가 완벽하지 못하고, `배열`과 `제네릭`의 타입 규칙이 서로 다르기 때문이다. 메서드에 제네릭 (혹은 매개변수화된) varags 매개변수를 사용하고자 한다면, 먼저 그 메서드가 `타입 안전한지` 확인한 다음 `@SafeVarargs` 애너테이션을 달아 사용하는 데 불편함이 없게끔 하자