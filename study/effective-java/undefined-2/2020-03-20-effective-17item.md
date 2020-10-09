---
layout: reference
title: 아이템17 변경 가능성을 최소화하라
date: '2020-03-10T00:00:00.000Z'
categories: effective
summary: Effective Java 3e 아이템 17을 요약한 내용 입니다.
navigation_weight: 17
description: Effective Java 3e 아이템 17를 요약한 내용 입니다.
---

# 아이템17 변경 가능성을 최소화하라

불변 클래스는 가변 클래스보다 설계하고 구현하고 사용하기 쉬우며, `오류가 생길 여지도 적고 훨씬 안전하다.`

클래스를 불변으로 만들려면 다음 다섯 가지 규칙을 따르면 된다.

* 객체의 상태를 변경하는 `메서드(변경자)`를 제공하지 않는다.
* 클래스를 확장할 수 없도록 한다. 상속을 막는 대표적인 방법은 클래스를 `final`로 선언하는 것이지만, 다른 방법도 뒤에 살펴볼 것이다.
* 모든 필드를 `final`로 선언한다.
* 모든 필드를 `private`으로 선언한다.
* 자신 외에는 내부의 `가변 컴포넌트`에 접근할 수 없도록 한다. 이런 필드는 절대 클라이언트가 제공한 객체 참조를 가리키게 해서는 안 되며, 접근자 메서드가 그 필드를 그대로 반환해서도 안 된다. 생성자, 접근자, readObject 메서드 모두에서 `방어적 복사`를 수행하라

  public final class Complex { private final double re; private final double im;

  ```text
    public Complex(double re, double im) {
        this.re = re;
        this.im = im;
    }

    ...

    public Complex plus(Complex c) {
        return new Complex(re + c.re, im + c.im);
    }

    public Complex minus(Complex c) {
        return new Complex(re - c.re, im - c.im);
    }

    public Complex times(Complex c) {
        return new Complex(re * c.re - im * c.im, re * c.im + im. * c.re);
    }

    @Override public boolean equals(Object o) {
        if (o == this)
            return true;
        if (!(o instanceof Complex))
            return false;
        Complex c = (Complex) o;

        return Double.compare(c.re, re) == 0
                        && Double.compare(c.im, im);
    }
  ```

이 사칙연산 메서드들이 인스턴스 자신은 수정하지 않고 새로운 Complex 인스턴스를 만들어 반환하는 모습에 주목하자. 이처럼 피연산자에 함수를 적용해 그 결과를 반환하지만 피연산자 자체는 그대로인 프로그래밍 패턴을 `함수형 프로그래밍`이라 한다. 이와 달리, 절차적 혹은 명령형 프로그래밍에서는 메서드에서 피연산자인 자신을 수정해 자신의 상태가 변하게 된다.

불변 객체는 근본적으로 `스레드 안전`하여 따로 동기화할 필요 없기 때문에 안심하고 공유할 수 있다. 따라서 불변 클래스라면 한번 만든 인스턴스를 최대한 재활용하기를 권한다.

불변 클래스는 자주 사용되는 인스턴스를 `캐싱`하여 같은 인스턴스를 중복 생성하지 않게 해주는 정적 팩터리를 제공할 수 있다. 새로운 클래스를 설계할 때 public 생성자 대신 `정적 팩터리`를 만들어두면, 클라이언트를 수정하지 않고도 필요에 따라 캐시 기능을 나중에 덧붙일 수 있다.

불변 객체는 자유롭게 `공유`할 수 있음은 물론, 불변 객체끼리는 내부 데이터를 공유할 수 있다. 객체를 만들 때 다른 불변 객체들을 구성요소로 사용하면 이점이 많다. 좋은 예로, 불변 객체는 맵의 키와 집합\(Set\)의 원소로 쓰기에 안성맞춤이다. 맵이나 집합은 안에 담긴 값이 바뀌면 `불변식`이 허물어지는데, 불변 객체를 사용하면 그런 걱정은 하지 않아도 된다.

불변 클래스에도 단점은 있다. 값이 다르면 반드시 독립된 객체로 만들어야 한다는 것이다. 값의 가짓수가 많다면 이들을 모두 만드는 데 `큰 비용`을 치워야 한다.

```text
BigInteger moby = ...;
moby = moby.flipBit(0);
```

이 문제에 대처하는 방법은 두 가지다. 첫 번째는 흔히 쓰일 다단계 연산 들을 `예측`하여 기본 기능으로 제공하는 방법이다. 이러한 다단계 연산을 기본으로 제공한다면 더 이상 각 단계마다 객체를 생성하지 않아도 된다. 클라이언트들이 원하는 복잡한 연산 들을 정확히 예측할 수 있다면 `package-private의 가변 동반 클래스만으로 충분하다.` 자바 플랫폼 라이브러리에서 이에 해당하는 대표적인 예가 바로 `String` 클래스다. 그렇다면 String의 가변 동반 클래스는 바로 StringBuilder이다.

가변 동반 클래스의 동작원리는?

클래스가 불변임을 보장하려면 자신을 상속하지 못하게 `final 클래스`로 선언하는 것이지만 더 유연한 방법이 있다. 모든 생성자를 `private` 혹은 `package-private`으로 만들고 `public 정적 팩터리`를 제공하는 방법이다.

```text
public class Complex {
    private final double re;
    private final double im;

    private Complex(double re, double im) {
        this.re = re;
        this.im = im;
    }
    public static Complex valueOf(double re, double im) {
        return new Complex(re,im);
    }
    ...
}
```

패키지 바깥의 클라이언트에서 바라본 이 불변 객체는 사실상 `final`이다. public 이나 protected 생성자가 없으니 다른 패키지에서는 이 클래스를 확장하는 게 불가능하기 때문이다.

private 생성자로 구현된 클래스를 상속하게 되면 어떻게 될까?

게터\(getter\)가 있다고 해서 무조건 세터\(setter\)를 만들지는 말자. 클래스는 꼭 필요한 경우가 아니라면 불변이어야 한다.

PhoneNumber와 Complex 같은 단순한 값 객체는 항상 불변으로 만들자. 불변으로 만들 수 없는 클래스라도 변경할 수 있는 부분을 `최소환으로 줄이자.` 객체가 가질 수 있는 상태의 수를 줄이면 그 객체를 예측하기 쉬어지고 오류가 생길 가능성이 줄어든다.

java.util.concurrent 패키지의 `CountDownLatch` 클래스가 이상의 원칙을 잘 방증한다. 비록 가변 클래스지만 가질 수 있는 상태의 수가 많지 않다.

`CountDownLatch 구조는 어떻게 되어 있나?`

