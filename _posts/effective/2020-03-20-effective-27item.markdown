---
layout: reference
title: "아이템27 비검사 경고를 제거하라"
date: 2020-03-10 00:00:00
categories: effective
summary: Effective Java 3e 아이템 27을 요약한 내용 입니다.
navigation_weight: 27
---

> Effective Java 3e 아이템 27를 요약한 내용 입니다.

`제네릭`에 익숙해질수록 마주치는 경고 수는 줄겠지만 새로 작성한 코드가 한번에 깨끗하게 `컴파일` 되리라 기대하지는 말자. 코드를 다음처럼 잘못 작성했다고 해보자.

```java
Set<Lark> exaltation = new HashSet();

Venery.java:4: warning: [unchecked] unchecked conversion
    Set<Lark> exaltation = new HashSet();
                            ^
```

컴파일러가 알려준 대로 수정하면 경고가 사라진다.

```java
Set<Lark> exaltation = new HashSet<>();
```

경고를 제거할 수는 없지만 `타입 안전`하다고 확신할 수 있다면 `@SuppressWarnings("unchecked")` 에노테이션을 달아 경고를 숨기자

안전하다고 검증된 `비검사 경고`를 (숨기지 않고)그대로 두면, **진짜 문제를 알리는 새로운 경고가 나와도 눈치채지 못할 수 있다.**

하지만 `@SuppressWarnings` 에너테이션은 항상 가능한 한 `좁은 범위`에 적용하자. **자칫 심각한 경고를 놓칠 수 있으니 절대로 클래스 전체에 적용해서는 안 된다.**

한 줄이 넘는 메서드나 생성자에 달린 `@SuppressWarnings` 에너테이션을 발견하면 `지역 변수` 선언 쪽으로 옮기자.

```java
public <T> T[] toArray(T[] a) {
    if(a.length < size) {
    // 생성한 배열과 매개변수로 받은 배열의 타입이 모두 T[]로 같으므로
    // 올바른 형변환이다.
    @SuppressWarnings("unchecked") T[] result =
        (T[]) Arrays.copyOf(elements, size, a.getClass());
        return result;
    }
    ...
}
```

@SuppressWarnings("unchecked") 에너테이션을 사용할 때면 그 경고를 무시해도 안전한 이유를 항상 `주석`으로 남겨야 한다.

[SuppressWarnings 종류](https://www.notion.so/e86a17bac0fe42a1b049e2feba9a078c)

## 정리

`비검사 경고`는 중요하니 무시하지 말자. 모든 비검사 경고는 `런타임`에 `ClassCastException`을 일으킬 수 있는 `잠재적 가능성`을 뜻하니 최선을 다해 제거하라. 경고를 없앨 방법을 찾지 못하겠다면, 그 코드가 `타입 안전함`을 증명하고 가능한 한 `범위`를 좁혀 @SuppressWarnings("unchecked") 에너테이션으로 경고를 숨겨라. 그런 다음 경고를 숨기기로 한 근거를 `주석`으로 남겨라
