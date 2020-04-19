---
layout: reference
title: 아이템23 태그 달린 클래스보다는 클래스 계층구조를 활용하라
date: '2020-03-10T00:00:00.000Z'
categories: effective
summary: Effective Java 3e 아이템 23을 요약한 내용 입니다.
navigation_weight: 23
description: Effective Java 3e 아이템 23를 요약한 내용 입니다.
---

# 아이템23 태그 달린 클래스보다는 클래스 계층구조를 활용하라

> Effective Java 3e 아이템 23를 요약한 내용 입니다.

`두 가지 이상의 의미`를 표현할 수 있으며, 그중 현재 표현하는 의미를 `태그` 값으로 알려주는 클래스를 본 적이 있을 것이다. 다음 코드는 `원`과 `사각형`을 표현할 수 있는 클래스다.

```java
class Figure P
    enum Shape { RECTANGLE, CIRCLE };

    ...

    // 원용 생성자
    Figure(double radius) {
    shape = Shape.CIRCLE;
    this.radius = radius;
    }

    // 사격형용 생성자
    Figure(double length, double width) {
    shape = Shape.RECTANGLE;
    this.length = length;
    this.width = width;
    }

    double area() {
    switch(shape) {
        case RECTANGLE:
        return length * width;
        case CIRCLE:
        return Math.PI * (radius * radius);
        default:
        throw new AssertionError(shape);
    }
}
```

### 태그 달린 클래스에는 `단점`이 한가득이다.

우선 `열거 타입 선언`, `태그 필드`, `switch` 문 등 쓸데없는 코드가 많다. 여러 구현이 한 클래스에 혼합돼 있어서 `가독성`도 나쁘다. 다른 의미를 위한 코드도 언제나 함께 하니 `메모리`도 많이 사용한다. 필드들을 `final`로 선언하려면 해당 의미에 쓰이지 않는 필드들까지 생성자에서 `초기화`해야 한다.

또한, 새로운 의미를 추가할 때마다 모든 `switch` 문을 찾아 새 의미를 처리하는 코드를 추가해야 하는데, 하나라도 빠뜨리면 역시 `런타임`에 문제가 불거져 나올 것이다. 마지막으로, 인스턴스의 타입만으로는 `현재 나타내는 의미`를 알 길이 전혀 없다. 한마디로, 태그 달린 클래스는 장황하고, 오류를 내기 쉽고 `비효율적`이다.

### 서브타이핑

**다행히 자바와 같은 객체 지향 언어는 타입 하나로 다양한 의미의 객체를 표현하는 훨씬 나은 수단을 제공한다.** 바로 클래스 계층 구조를 활용하는 `서브타이핑(subtyping)`이다.

태그 값에 따라 동작이 달라 지는 메서드들을 `루트 클래스`의 `추상 메서드`로 선언한다.

```java
abstract class Figure {
    abstract double area();
}

class Circle extends Figure {
    final double radius;
    Circle(double radius) { this.radius = radius; }
    @Override double area() { return Math.PI * (radius * radius); }
}

class Rectangle extends Figure {
    final double length;
    final double width;
    Rectangle(double length, double width;) {
    this.length = length;
    this.width = width;
    }
    @Override double area() { return length * width; }
}
```

타입이 의미 별로 따로 존재하니 변수의 의미를 명시하거나 제한할 수 있고, 또 특정 의미만 매개 변수로 받을 수 있다. 또한, 타입 사이의 자연스러운 계층 관계를 반영할 수 있어서 `유연성`은 물론 `컴파일 타임` 타입 검사 능력을 높여줄 수 있다.

```java
class Square extends Rectangle {
    Square(double side) {
    super(side, side);
    }
}
```

## 정리

**태그 달린 클래스를 써야 하는 상황은 거의 없다.** 새로운 클래스를 작성하는 데 `태그 필드`가 등장한다면 태그를 없애도 `계층 구조`로 대체하는 방법을 생각해보자.

