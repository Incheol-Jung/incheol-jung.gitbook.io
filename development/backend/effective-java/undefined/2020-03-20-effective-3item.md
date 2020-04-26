---
layout: reference
title: 아이템3 private 생성자나 열거 타입으로 싱글턴임을 보증하라
date: '2020-03-10T00:00:00.000Z'
categories: effective
summary: Effective Java 3e 아이템 3을 요약한 내용 입니다.
navigation_weight: 3
description: Effective Java 3e 아이템 3를 요약한 내용 입니다.
---

# 아이템3 private 생성자나 열거 타입으로 싱글턴임을 보증하라

싱글턴\(singleton\)이란 `인스턴스`를 오직 하나만 생성할 수 있는 클래스를 말한다.

그런데 클래스를 싱글턴으로 만들면 이를 사용하는 클라이언트를 `테스트하기가 어려워질 수 있다.`

싱글턴을 만드는 방식은 보통 둘 중 하나다. 두 방식 모두 생성자는 `private`으로 감춰두고, 유일한 인스턴스에 접근할 수 있는 수단으로 `public static` 멤버를 하나 마련해둔다.

```java
    public class Elvis {
        public static final Elvis INSTANCE = new Elvis();
        private Elvis() { ... }

        public void leaveThebuilding() { ... }
    }
```

private 생성자는 `public static final` 필드인 `Elvis.INSTANCE`를 초기화할 때 딱 한 번만 호출된다.

예외는 단 한 가지, 권한이 있는 클라이언트는 `리플렉션 API`인 AccessibleObject.setAccessible을 사용해 private생성자를 호출할 수 있다. 이러한 공격을 방어하려면 생성자를 수정하여 두 번째 객체가 생성되려 할 때 예외를 던지게 하면 된다.

> 이렇게 하면 어떤 장점이 있을까?

* public static 필드가 final이니 절대로 `다른 객체를 참조할 수 없다.`
* 두 번째 장점은 바로 `간결함`이다.

`리플렉션 API란?`

싱글턴을 만드는 두 번째 방법에서는 `정적 팩터리 메서드`를 public static 멤버로 제공한다.

```java
    public class Elvis {
        private static final Elvis INSTANCE = new Elvis();
        private Elvis() { ... }
        public static Elvis getInstance() { return INSTANCE; }

        public void leaveThebuilding() { ... }
    }
```

Elvis.getInstance는 항상 같은 객체의 참조를 반환하므로 제2의 Elvis 인스턴스란 결코 만들어지지 않는다.

> 이렇게 하면 어떤 장점이 있을까?

* API를 바꾸지 않고도 싱글턴이 아니게 변경할 수 있다는 점이다. \(스레드별로 다른 인스턴스를 넘겨주게 할 수 있다\)
* 원한다면 정적 팩터리를 `제네릭 싱글턴 팩터리`로 만들 수 있다.
* 정적 팩터리의 메서드 참조를 `공급자`로 사용할 수 있다.

싱글턴을 만드는 세 번째 방법은 원소가 하나인 열거 타입을 선언하는 것이다.

```java
    private Object readResolve() {
        return INSTANCE;
    }

    public enum Elvis {
        INSTANCE;
        public void leaveTheBuilding() { ... }
    }
```

조금 부자연스러워 보일 수는 있으나 대부분 상황에서는 원소가 하나뿐인 열거 타입이 싱글턴을 만드는 가장 좋은 방법이다.

단, 만들려는 싱글턴이 Enum 외의 클래스를 상속해야 한다면 이 방법은 사용할 수 없다.

