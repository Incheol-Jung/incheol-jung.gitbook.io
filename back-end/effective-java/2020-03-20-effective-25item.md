---
layout: reference
title: 아이템25 톱레벨 클래스는 한 파일에 하나만 담으라
date: '2020-03-10T00:00:00.000Z'
categories: effective
summary: Effective Java 3e 아이템 25을 요약한 내용 입니다.
navigation_weight: 25
---

# 2020-03-20-effective-25item

> Effective Java 3e 아이템 25를 요약한 내용 입니다.

소스 파일 하나에 `톱레벨` 클래스를 여러 개 선언 하더라도 자바 `컴파일러`는 불평하지 않는다. 하지만 이렇게 되면 한 클래스를 여러 가지로 정의할 수 있으며, 그중 어느 것을 사용할지는 어느 소스 파일을 먼저 `컴파일`하냐에 따라 달라지기 때문에 **사용을 권장 하지는 않는다.**

```java
public class Main {
    public static void main(String[] args) {
    System.out.println(Utensil.NAME + Dessert.NAME);
    }
}
```

Utensil.java

```java
class Utensil {
    static final String NAME = "pan";
}

class Dessert {
    static final String NAME = "cake";
}
```

Dessert.java

```java
class Utensil {
    static final String NAME = "pot";
}

class Dessert {
    static final String NAME = "pie";
}
```

운 좋게 "**javac Main.java Dessert.java**" 명령으로 `컴파일` 한다면 컴파일 오류가 나고 `Utensil`과 `Dessert` 클래스를 중복 정의 했다고 알려줄 것이다. 컴파일러는 가장 먼저 `Main.java`를 컴파일하고, 그 안에서 \(`Dessert` 참조보다 먼저 나오는\) `Utensil` 참조를 만나면 `Utensil.java` 파일을 살펴 `Utensil`과 `Dessert`를 모두 찾아낼 것이다. 그런 다음 컴파일러가 두 번째 명령줄 인수로 넘어온 `Dessert.java`를 처리하려 할 때 같은 클래스의 정의가 이미 있음을 알게 된다.

굳이 여러 톱레벨 클래스를 한 파일에 담고 싶다면 `정적 멤버 클래스`를 사용하는 방법을 고민해볼 수 있다. 읽기 좋고 `private`으로 선언하면 `접근 범위`도 최소로 관리할 수 있기 때문이다.

## 정리

소스 파일 하나에는 반드시 `톱레벨 클래스`\(혹은 `톱레벨 인터페이스`\)를 하나만 담자. 이 규칙만 따른다면 컴파일러가 한 클래스에 대한 정의를 여러 개 만들어 내는 일은 사라진다.

