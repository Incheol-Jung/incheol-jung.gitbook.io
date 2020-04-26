---
layout: reference
title: 아이템29 이왕이면 제네릭 타입으로 만들라
date: '2020-03-10T00:00:00.000Z'
categories: effective
summary: Effective Java 3e 아이템 29을 요약한 내용 입니다.
navigation_weight: 29
description: Effective Java 3e 아이템 29를 요약한 내용 입니다.
---

# 아이템29 이왕이면 제네릭 타입으로 만들라

> Effective Java 3e 아이템 29를 요약한 내용 입니다.

JDK가 제공하는 `제네릭 타입`과 `메서드`를 사용하는 일은 일반적으로 쉬운 편이지만, 제네릭 타입을 새로 만드는 일은 조금 더 어렵다.

```java
public class Stack {
    private Object[] elements;
    ...

    public Stack() {
    elements = new Object[DEFAULT_INITIAL_CAPACITY];
    }

    public void push(Object e) {
    ...
    }

    public Object pop() {
    if (size == 0)
        throw new EmptyStackException();
    Object result = elements[--size];
    ...
    }
    ...
}
```

### 위 Stack 클래스를 제네릭으로 만들어 보자

```java
public class Stack<E> {
    private E[] elements;
    ...

    public Stack() {
    elements = (E[]) new Object[DEFAULT_INITIAL_CAPACITY];
    }

    public void push(E e) {
    ...
    }

    public E pop() {
    if (size == 0)
        throw new EmptyStackException();
    E result = elements[--size];
    ...
    }
    ...
}
```

그러면 아래와 같은 경고 메시지를 확인할 수 있을 것이다.

```text
Stack.java:8: warning: [unchecked] unchecked cast
found: Object[], required: E[]
        elements = (E[]) new Object[DEFAULT_INITIAL_CAPACITY];
                        ^
```

문제의 배열 `elements`는 `private` 필드에 저장되고 클라이언트로 반환되거나 다른 메서드에 전달되는 일이 전혀 없다. `push` 메서드를 통해 배열에 저장되는 원소의 타입은 항상 `E`다. 따라서 이 `비검사 형변환`은 확실히 안전하다.

> 비검사 형변환이란? 검사하지 않다고 형변환하는 경우를 말한다. 위와 같이 E가 무슨 타입인지 알 수 없어서 컴파일러가 런타임에도 안전할지 알 수 없다는 경고를 보여주고 있다. 제네릭은 실체화 불가 타입이므로 런타임에서는 타입에 대한 정보가 소거되기 때문이다.

`비검사 형변환`이 안전함을 직접 증명 했다면 범위를 최소로 좁혀 `@SuppressWarnings` 에너테이션으로 해당 경고를 숨긴다.

```java
// 배열 elements는 push(E)로 넘어온 E 인스턴스만 담는다.
// 따라서 타입 안전성을 보장하지만,
// 이 배열의 런타임 타입은 E[] 가 아닌 Object[]다!
@SuppressWarnings("unckecked")
public Stack() {
    elements = (E[]) new Object[DEFAULT_INITIAL_CAPACITY];
}
```

제네릭 배열 생성 오류를 해결하는 두 번째 방법은 `elements` 필드의 타입을 `E[]`에서 `Object[]`로 바꾸는 것이다.

E는 `실체화 불가 타입`이므로 컴파일러는 런타임에 이뤄지는 `형변환`이 안전한지 증명할 방법이 없다. 이번에도 우리가 직접 증명하고 경고를 숨길 수 있다.

```java
public E pop() {
    if (size == 0)
        throw new EmptyStackException();

    // push에서 E 타입만 허용하므로 이 형변환은 안전하다.
    @SuppressWarnings("unckecked") E result = (E) elements[--size];
    ...
}
```

### 타입 매개변수에 제약을 두는 제네릭 타입도 있다.

java.util.concurrent.`DelayQueue`를 보면 확인할 수 있다.

```text
class DelayQueue<E extends Delayed> implements BlockingQueue<E>
```

이렇게 하여 `DelayQueue` 자신과 `DelayQueue`를 사용하는 클라이언트는 DelayQueue의 원소에서 \(형변환 없이\) 곧바로 `Delayed` 클래스의 메서드를 호출할 수 있다.

## 정리

클라이언트에서 직접 `형변환`해야 하는 타입보다 `제네릭` 타입이 더 안전하고 쓰기 편하다. **그러니 새로운 타입을 설계할 때는 형변환 없이도 사용할 수 있도록 하라.** 기존 타입 중 제네릭이었어야 하는 게 있다면 `제네릭` 타입으로 변경하자.

## 출처

* [https://github.com/icarus8050/study/blob/master/effectivejava3rd/src/main/java/item\_28/Chooser.java](https://github.com/icarus8050/study/blob/master/effectivejava3rd/src/main/java/item_28/Chooser.java)

