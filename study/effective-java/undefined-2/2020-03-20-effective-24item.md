---
layout: reference
title: 아이템24 멤버 클래스는 되도록 static으로 만들라
date: '2020-03-10T00:00:00.000Z'
categories: effective
summary: Effective Java 3e 아이템 24을 요약한 내용 입니다.
navigation_weight: 24
description: Effective Java 3e 아이템 24를 요약한 내용 입니다.
---

# 아이템24 멤버 클래스는 되도록 static으로 만들라

`중첩 클래스`는 자신을 감싼 바깥 클래스에서만 쓰여야 하며, 그 외의 쓰임새가 있다면 `톱레벨 클래스`로 만들어야 한다. 중첩 클래스의 종류는 `정적 멤버 클래스`, `(비정적) 멤버 클래스`, `익명 클래스`, `지역 클래스` 이렇게 네 가지다.

### 정적 멤버 클래스

정적 멤버 클래스는 다른 클래스 안에 선언되고, 바깥 클래스의 `private` 멤버에도 접근할 수 있다는 점만 제외하고는 `일반 클래스`와 똑같다. 정적 멤버 클래스는 흔히 바깥 클래스와 `함께` 쓰일 때만 유용한 **private 도우미 클래스로 쓰인다.**

```java
public class StaticCar {
    static String _where="I am a Car from Germany!";
    Country _country;            // object of inner class country
    StaticCar(){
        _country=new Country();    // instantiate the inner class
    }
    static class Country {       // static member inner class
            String showCountry() {
            return _where;
        }
    }

    public static void main(String[] args) {
        
        StaticCar myCar= new StaticCar() ;  // instantiated object of class StaticCar
        System.out.print("Access through an Country reference");
        System.out.println(" created in an object of a StaticCar:");
        System.out.println(myCar._country.showCountry());
        
        // instantiated object of class StaticCar.Country
        StaticCar.Country country= new StaticCar.Country();
        System.out.println("Access through an Country reference that is local:");
        System.out.println(country.showCountry());
    }
}
```

```text
Access through an Country reference created in an object of a StaticCar:
I am from Germany!
Access through an Country reference that is local:
I am from Germany!
```

### 비정적 멤버 클래스

`정적` 멤버 클래스와 `비정적` 멤버 클래스의 구문상 차이는 단지 `static`이 붙어 있고 없고 뿐이지만, **의미상 차이는 이외로 꽤 크다.** 비정적 멤버 클래스의 인스턴스는 바깥 클래스의 인스턴스와 `암묵적`으로 연결된다. 그래서 비정적 멤버 클래스의 인스턴스 메서드에서 정규화된 `this`를 사용해 바깥 인스턴스의 메서드를 호출하거나 `바깥 인스턴스의 참조`를 가져올 수 있다. 정규화된 this란 `클래스명.this` 형태로 바깥 클래스의 이름을 명시하는 용법을 말한다.

비정적 멤버 클래스의 인스턴스와 바깥 인스턴스 사이의 관계는 멤버 클래스가 `인스턴스화`될 때 확립 되며, 더 이상 변경할 수 없다.

비정적 멤버 클래스는 `어댑터`를 정의할 때 자주 쓰인다. **즉, 어떤 클래스의 인스턴스를 감싸 마치 다른 클래스의 인스턴스처럼 보이게 하는 뷰로 사용하는 것이다.** 비슷하게, `Set`과 `List` 같은 다른 컬렉션 인터페이스 구현 들도 자신의 반복자를 구현할 때 비정적 멤버 클래스를 주로 사용한다.

```java
public class MySet<E> extends AbstractSet<E> {
    ... // 생략

    @Override public Iterator<E> iterator() {
    return new MyIterator();
    }

    private class MyIterator implements Iterator<E> {
    ...
    }
}
```

**멤버 클래스에서 바깥 인스턴스에 접근할 일이 없다면 무조건 `static`을 붙여서 정적 멤버 클래스로 만들자.** `static`을 생략하면 바깥 인스턴스로의 `숨은 외부 참조`를 갖게 된다. 그러면 `가비지 컬렉션`이 바깥 클래스의 인스턴스를 수거하지 못하는 `메모리 누수`가 생길 수 있다는 점이다.

### 익명 클래스

`익명 클래스`는 바깥 클래스의 멤버도 아니다. 멤버와 달리, 쓰이는 시점에 `선언`과 동시에 `인스턴스`가 만들어진다. 그리고 오직 `비정적인 문맥`에서 사용될 때만 바깥 클래스의 인스턴스를 참조할 수 있다. `정적 문맥`에서라도 상수 변수 이외의 정적 멤버는 가질 수 없다. 즉, `상수 표현`을 위해 초기화 된 `final` 기본 타입과 문자열 필드만 가질 수 있다.

```java
interface Inter {
    public void hi();
}

class Anony {
    public void f() {
        System.out.println("Anony.f() 호출.");
    }
}

public class Test {
    private Integer number;

    public void nonStaticMethod(){
        Inter ob2 = new Inter() {
            public void hi() {
                System.out.println("비 정적문맥 메소드 호출" + number);
            }
        };
    }

    public static void staticMethod() {
        Inter ob2 = new Inter() {
            Integer number2 = 1;
            public void hi() {
                System.out.println("정적문맥 메소드 호출" + number); // comile Error
            }
        };
    }

    public static void main(String[] args) throws Exception {
        //Inter ob1 = new Inter(); //Compile Error!!!
        Inter ob2 = new Inter() {
            public void hi() {
                System.out.println("안녕하십니까?");
            }
        };

        ob2.hi();

        Anony a1 = new Anony();
        Anony a2 = new Anony() {
            public void f() {
                System.out.println("이히힛.");
            }
        };

        a1.f();
        a2.f();
    }
}
```

> 정적문맥에서 final 기본 타입과 문자열 필드만 가질 수 있다는 의미는?

익명 클래스를 사용하는 클라이언트는 그 익명 클래스가 `상위 타입`에서 상속한 멤버 외에는 호출할 수 없다.

익명 클래스의 또 다른 주쓰임은 `정적 팩터리 메서드`를 구현할 때다.

```java
static List<Integer> intArrayAsList<int[] a) {
    Objects.requireNonNulkl(a);

    // 다이아몬드 연산자를 이렇게 사용하는 건 자바 9부터 가능하다.
    // 더 낮은 버전을 사용한다면 <Integer>로 수정하자.

    return new AbstractList<>() {
    @Override public Integer get(int i) {
        return a[i];
    }

    @Override public Integer set(int i, Integer val) {
        int oldVal = a[i];
        a[i] = val;
        return oldVal;
    }

    @Override public int size() {
        return a.length;
    }
}
```

### 지역 클래스

`지역 클래스`는 `지역 변수`를 선언할 수 있는 곳이면 실질적으로 어디서든 선언할 수 있고, `유효 범위`도 지역 변수와 같다. 멤버 클래스 처럼 이름이 있고 반복해서 사용할 수 있다. 익명 클래스처럼 `비 정적 문맥`에서 사용될 때만 `바깥 인스턴스`를 참조할 수 있으며, **정적 멤버는 가질 수 없으며, 가독성을 위해 짧게 작성해야 한다.**

## 정리

`중첩 클래스`에는 네 가지가 있으며, 각각의 쓰임이 다르다. `메서드` 밖에서도 사용해야 하거나 메서드 안에 정의하기엔 너무 길다면 `멤버 클래스`로 만든다. 멤버 클래스의 인스턴스 각각이 바깥 인스턴스를 `참조`한다면 `비 정적`으로, 그렇지 않으면 `정적`으로 만들자. 중첩 클래스가 한 메서드 안에서만 쓰이면서 그 인스턴스를 `생성하는 지점`이 단 한 곳이고 `해당 타입`으로 쓰기에 적합한 클래스나 인터페이스가 이미 있다면 `익명 클래스`로 만들고, 그렇지 않으면 `지역 클래스`로 만들자.

