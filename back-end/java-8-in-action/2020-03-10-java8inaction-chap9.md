---
layout: reference
title: 9장 디폴트 메서드
date: '2020-03-10T00:00:00.000Z'
categories: java
summary: 자바 8 인 액션 9장을 요약한 내용 입니다.
navigation_weight: 9
description: 자바 8 인 액션 9장을 요약한 내용 입니다.
---

# 9장 디폴트 메서드

자바 8 이전에는 인터페이스를 구현하는 클래스는 인터페이스에서 정의하는 모든 메서드 구현을 제공하거나 아니면 슈퍼클래스의 구현을 상속받아야 한다. 라이브러리 설계자 입장에서 인터페이스를 바꾸면 이전에 해당 인터페이스를 구현했던 모든 클래스의 구현도 고쳐야 하기 때문에 인터페이스 기능 확장에 어려움이 있었다.

하지만 걱정할 필요 없다. 자바 8에서는 기본 구현을 포함하는 인터페이스를 정의하는 두 가지 방법을 제공한다.

* 정적 메서드
* 디폴트 메서드

대표적인 예로 List 인터페이스의 sort와 Collection 인터페이스의 stream 메서드를 살펴봤다.

```java
    default void sort(Comparator<? super E> c) {
        Collections.sort(this, c);
    }

    List<Integer> numbers = Arrays.asList(3, 5, 1, 2, 6);
    numbers.sort(Comparator.narualOrder()); // 알파벳 순서로 요소를 정렬할 수 있다. 

    default Stream<E> stream() {
        return StreamSupport.stream(spliterator(), false);
    }
```

그렇다면 디폴트 메서드를 사용하는 이유는 뭘까? 디폴트 메서드를 이용하면 자바 API의 호환성을 유지하면서 라이브러리를 확장하기 위함이다.

## 디폴트 메서드란 무엇인가?

자바 8에서는 호환성을 유지하면서 API를 바꿀 수 있도록 새로운 기능인 디폴트 메서드를 제공한다.

자바 8 API 에서는 디폴트 메서드가 상당히 많이 활용 되었을 것 임을 추측할 수 있다. Collection 인터페이스의 stream 메서드처럼 부지불식간에 많은 디폴트 메서드를 사용했다. List 인터페이스의 sort 메서드도 디폴트 메서드다. 이전에 살펴본 Predicate, Function, Comparator 등 많은 함수형 인터페이스도 Predicate.and 또는 Function.andThen 같은 다양한 디폴트 메서드를 포함한다.

추상 클래스와 자바 8의 인터페이스는 뭐가 다를까?

* 클래스는 하나의 추상 클래스만 상속받을 수 있지만 인터페이스는 여러 개 구현할 수 있다. 
* 추상 클래스는 인스턴스 변수로 공통 상태를 가질 수 있지만 인터페이스는 인스턴스 변수를 가질 수 없다. 

### 디폴트 메서드 활용 패턴

디폴트 메서드를 생성하는 두 가지 방식에 대해서 살펴보자.

#### 선택형 메서드

Iterator는 hasNext와 next뿐 아니라 remove 메서드도 정의한다. 사용자들이 remove 기능은 잘 사용하지 않으므로 자바 8 이전에는 remove 기능을 무시했다. 결과적으로 Iterator를 구현하는 많은 클래스에서는 remove에 빈 구현을 제공했다.

```java
    interface Iterator<T> {
        boolean hasNext();
        T next();
        default void remove() {
            throw new UnsupportedOperationException();
        }
    }
```

default 메서드를 활용하여 Iterator 인터페이스를 구현하는 클래스는 빈 remove 메서드를 구현할 필요가 없어졌고, 불필요한 코드를 줄일 수 있다.

#### 동작 다중 상속

디폴트 메서드를 이용하면 기존에는 불가능했던 동작 다중 상속 기능도 구현할 수 있다. 자바 8에서는 인터페이스가 구현을 포함할 수 있으므로 클래스는 여러 인터페이스에서 동작\(구현 코드\)을 상속받을 수 있다.

인터페이스에 디폴트 구현을 포함시키면 또 다른 장점이 있다. 인터페이스를 구현한 클래스들의 공통 구현을 변경해야 할 경우 디폴트 메서드만 수정하면 일괄적으로 변경이 가능하다는 점이다. \(물론 구현 클래스에서 메서드를 정의하지 않은 상황에 한해서다.\)

옮지 못한 상속 상속으로 코드 재사용 문제를 모두 해결할 수 있는 것은 아니다. 예를 들어 한 개의 메서드를 재사용하려고 100개의 메서드와 필드가 정의되어 있는 클래스를 상속받는 것은 좋은 생각이 아니다. 이럴 때는 delegation, 즉 멤버 변수를 이용해서 클래스에서 필요한 메서드를 직접 호출하는 메서드를 작성하는 것이 좋다. 종종 'final'로 선언된 클래스를 볼 수 있다. 이는 다른 클래스를 상속받지 못하게 함으로써 원래 동작이 바뀌지 않길 원하기 때문이다. \(ex. String\)

우리의 디폴트 메서드에도 이 규칙을 적용할 수 있다. 필요한 기능만 포함하도록 인터페이스를 최소한으로 유지한다면 필요한 기능만 선택할 수 있으므로 쉽게 기능을 조립할 수 있다.

### 해석 규칙

자바 8에는 디폴트 메서드가 추가되었으므로 같은 시그니처를 갖는 디폴트 메서드를 상속받는 상황이 생길 수 있다. 이런 상황에서는 어떤 인터페이스의 디폴트 메서드를 사용하게 될까?

```java
    public interface A {
        default void hello() {
            System.out.println("Hello from A");
        }
    }

    public interface B extends A {
        default void hello() {
            System.out.println("Hello from B");
        }
    }

    public class C implements B, A {
        public static void main(String... args) {
            new C().hello();
        }
    }
```

#### 알아야 할 세 가지 해결 규칙

1. 클래스가 항상 이긴다. 클래스나 슈퍼클래스에서 정의한 메서드가 디폴트 메서드보다 우선권을 갖는다. 
2. 1번 규칙 이외의 상황에서는 서브 인터페이스가 이긴다. 상속 관계를 갖는 인터페이스에서 같은 시그니터를 갖는 메서드를 정의할 때는 서브인터페이스가 이긴다. 즉, B가 A를 상속받는다면 B가 A를 이긴다. 
3. 여전히 디폴트 메서드의 우선순위가 결정되지 않았다면 여러 인터페이스를 상속받는 클래스가 명시적으로 디폴트 메서드를 오버라이드하고 호출해야 한다. 

위의 규칙을 이용해서 이전에 작성한 C 클래스에서 호출하는 메서드는 B 인터페이스의 hello 메서드를 호출할 것이다.

#### 충돌 그리고 명시적인 문제 해결

그렇다면 아래와 같은 클래스는 어떤 메서드가 호출될까?

```java
    public interface A {
        default void hello() {
            System.out.println("Hello from A");
        }
    }

    public interface B {
        default void hello() {
            System.out.println("Hello from B");
        }
    }

    public class C implements B, A {
        public static void main(String... args) {
            new C().hello();
        }
    }
```

위와 같을 경우 A와 B의 hello 메서드를 구별할 기준이 없다. 따라서 자바 컴파일러는 어떤 메서드를 호출해야 할지 알수 없으므로 "Error: class C inherits unrelated defaults for hello\(\) from types B and A"같은 에러가 발생한다.

#### 충돌 해결

클래스와 메서드 관계로 디폴트 메서드를 선택할 수 없는 상황에서는 선택할 수 있는 방법이 없다. 개발자가 직접 클래스 C에서 사용하려는 메서드를 명시적으로 선택해야 한다.

자바 8에서는 X.super.m\(...\) 형태의 새로운 문법을 제공한다. 여기서 X는 호출하려는 메서드 m의 슈퍼인터페이스다

```java
    public class C implements B, A {
        void hello() {
            B.super.hello();
        }
    }
```

### 요약

* 자바 8의 인터페이스는 구현 코드를 포함하는 디폴트 메서드, 정적 메서드를 정의할 수 있다.
* 디폴트 메서드의 정의는 default 키워드로 시작하며 일반 클래스 메서드처럼 바디를 갖는다.
* 공개된 인터페이스에 추상 메서드를 추가하면 소스 호환성이 깨진다.
* 디폴트 메서드 덕분에 라이브러리 설계자가 API를 바꿔도 기존 버전과 호환성을 유지할 수 있다.
* 선택형 메서드와 동작 다중 상속에도 디폴트 메서드를 사용할 수 있다.
* 클래스가 같은 시그니처를 갖는 여러 디폴트 메서드를 상속하면서 생기는 충돌 문제를 해결하는 규칙이 있다.
* 클래스나 슈퍼클래스에 정의된 메서드가 다른 디폴트 메서드 정의보다 우선한다. 이 외의 상황에서는 서브인터페이스에서 제공하는 디폴트 메서드가 선택된다.
* 두 메서드의 시그니처가 같고, 상속관계로도 충돌 문제를 해결할 수 없을 때는 디폴트 메서드를 사용하는 클래스에서 메서드를 오버라이드해서 어떤 디폴트 메서드를 호출할지 명시적으로 결정해야 한다.

