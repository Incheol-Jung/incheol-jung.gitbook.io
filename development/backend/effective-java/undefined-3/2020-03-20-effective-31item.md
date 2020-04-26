---
layout: reference
title: 아이템31 한정적 와일드카드를 사용해 API 유연성을 높이라
date: '2020-03-10T00:00:00.000Z'
categories: effective
summary: Effective Java 3e 아이템 31을 요약한 내용 입니다.
navigation_weight: 31
description: Effective Java 3e 아이템 31를 요약한 내용 입니다.
---

# 아이템31 한정적 와일드카드를 사용해 API 유연성을 높이라

> Effective Java 3e 아이템 31를 요약한 내용 입니다.

```java
public class Stack<E> {
    public Stack();
    public void push(E e);
    public E pop();
    public boolean isEmpty();
    public void pushAll(Iterable<E> src) {
    for (E e : src)
        push(e);
    }
}
```

이 메서드는 깨끗이 컴파일 되지만 완벽하진 않다. `Integer`는 `Number`의 하위 타입이니 잘 동작해야 할 것 같다.

```java
Strack<Number> numberStack = new Stack<>();
Iterable<Integer> intergers = ...;
numberStack.pushAll(integers);
```

하지만 실제로는 다음의 오류 메시지가 뜬다. 매개변수화 타입이 `불공변`이기 때문이다.

```text
StackTest.java:7: error: incompatible types: Iterable<Integer>
cannot be converted to Iterable<Number>
    numberStack.pushAll(integers);
                        ^
```

자바는 이런 상황에 대처할 수 있는 `한정적 와일드카드` 타입이라는 특별한 매개변수화 타입을 지원한다. `pushAll`의 입력 매개변수 타입은 '`E`의 `Iterable`'이 아니라 'E의 하위 타입의 Iterable'이어야 하며, 와일드카드 타입 `Iterable<? extends E>`가 정확히 이런 뜻이다.

```java
public void pushAll(Iterable<? extends E> src) {
    for (E e : src)
        push(e);
}
```

그렇다면 아래와 같은 메소드가 추가되었다.

```java
public void popAll(Collection<E> dst) {
    when (!isEmpty())
    dst.add(pop())
}
```

그리고 클라이언트에서 다음과 같은 예를 실행한다면 어떻게 해결할 수 있을까?

```java
Strack<Number> numberStack = new Stack<>();
Iterable<Object> objects = ...;
numberStack.pushAll(objects);
```

이 클라이언트 코드를 앞의 popAll 코드와 함께 컴파일하면 "**Collection는 Collection의 하위 타입이 아니다**"라는 비슷한 오류가 발생한다.

이번에도 `와일드카드` 타입으로 해결할 수 있다.

```java
public void popAll(Collection<? super E> dst) {
    when (!isEmpty())
    dst.add(pop())
}
```

유연성을 `극대화`하려면 원소의 생산자나 소비자용 입력 매개변수에 와일드카드 타입을 사용하라 한편, 입력 매개변수가 생산자와 소비자 역할을 동시에 한다면 와일드카드 타입을 써도 좋을 게 없다.

다음 공식을 외워두면 어떤 와일드카드 타입을 써야 하는지 기억하는 데 도움이 될 것이다.

> 팩스\(PECS\) : producer-extends, consumer-super

즉, 매개변수화 타입 T가 `생산자`라면 &lt;? extends T&gt;를 사용하고, `소비자`라면 &lt;? super T&gt;를 사용하라. 이전의 예처럼 pushAll은 Stack이 사용할 E 인스턴스를 생산하고 popAll은 Stack이 E 인스턴스를 소비하는 쪽에 속한다.

그렇다면 아래와 같은 메소드는 어떻게 수정해야 할까?

```java
public static <E> Set<E> union(Set<E> s1, Set<E> s2)
```

s1과 s2 모두 E의 생산자이니 `PECS` 공식에 따라 다음처럼 선언해야 한다.

```java
public static <E> Set<E> union(Set<? extends E> s1, Set<? extends E> s2)
```

그렇다면 클라이언트에서 아래와 같이 메소드를 사용할 수 있다.

```java
Set<Integer> integers = Set.of(1,3,5);
Set<Double> doubles = Set.of(2.0, 4.0, 6.0);
Set<Number> numbers = union(integers, doubles);
```

앞의 코드는 자바8부터 제대로 컴파일된다. `자바7`까지는 이 코드를 컴파일하면 오류 메시지를 보게 될 것이다. 그렇다면 자바7까지는 어떻게 해결할 수 있을까?

컴파일러가 올바른 타입을 추론하지 못할 때면 언제든 명시적 타입 인수를 사용해서 타입을 알려주면 된다.

```java
Set<Number> numbers = Union.<Number>union(integers, doubles);
```

타입 매개변수와 와일드카드에는 공통되는 부분이 있어서, 메서드를 정의할 때 둘 중 어느 것을 사용해도 괜찮을 때가 많다. 예를 들어 주어진 리스트에서 명시한 두 인덱스의 아이템들을 교환\(swap\)하는 `정적 메서드`를 두 방식 모두로 정의 해보자.

```java
public static <E> void swap(List<E> list, int i, int j);
public static void swap(List<?> list, int i, int j);
```

### 어떤 선언이 나을까?

`public API`라면 간단한 두 번째가 낫다. 어떤 리스트든 이 메서드에 넘기면 명시한 인덱스의 원소들을 교환해 줄 것이다.

### 메서드 선언에 타입 매개변수가 한 번만 나오면 와일드카드로 대체하라.

**이때 비한정적 타입 매개변수라면 비한정적 와일드카드로 바꾸고, 한정적 타입 매개변수라면 한정적 와일드 카드로 바꾸면 된다.**

하지만 아래 코드는 컴파일하면 그다지 도움이 되지 않는 오류 메시지가 나온다.

```java
public static void swap(List<?> list, int i, int j) {
    list.set(i, list.set(j, list.get(i));
}
```

원인은 리스트의 타입이 `List<?>`인데, List&lt;?&gt;에는 `null` 외에는 어떤 값도 넣을 수 없다는 데 있다. 다행히 \(런타임 오류를 낼 가능성이 있는\) 형변환이나 리스트의 로 타입을 사용하지 않고도 해결할 방법이 있다. 바로 와일드카드 타입의 실제 타입을 알려주는 메서드를 `private 도우미 메서드`로 따로 작성하여 활용하는 방법이다.

```java
public static void swap(List<?> list, int i, int j) {
    swapHelper(i, list.set(j, list.get(i));
}
public static <E> void swapHelper(List<E> list, int i, int j) {
    list.set(i, list.set(j, list.get(i));
}
```

## 정리

조금 복잡하더라도 `와일드카드` 타입을 적용하면 API가 훨씬 유연해진다. 그러니 널리 쓰일 `라이브러리`를 작성한다면 반드시 와일드카드 타입을 적절히 사용해줘야 한다. `PECS` 공식을 기억하자. 즉, 생산자\(producer\)는 extends를 소비자\(consumer\)는 super를 사용한다. `Comparable`과 `Comparator`는 모두 소비자라는 사실도 잊지 말자

