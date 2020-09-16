---
description: 상속과 합성에 대해 알아보자
---

# 상속보단 합성

![https://realpython.com/inheritance-composition-python/](../../.gitbook/assets/robocrop.realpython.webp)

## 상속이란?

상속은 자식 클래스가 부모 클래스를 상속받아 설계된 구조를 일컫는다. 상속으로 이루어진 관계에서는 부모 클래스의 멤버 변수나 메소드를 사용할 수 있다.

```java
public class Animal {
    ...
}

public class Bird extends Animal {
    ...
}
```

### 자식 클래스는 부모 클래스의 모든 접근이 가능한가?

모두 접근 가능한 것은 아니다. 부모 클래스의 멤버 변수나 메소드의 접근자가 private이 아닌 public 이나 protected일 경우에만 사용할 수 있다. default 접근자는 패키지 구조에 따라 접근할 수 있거나 없다.

### protected 접근자는 왜 사용할까?

#### 우선, public과 protected의 차이를 살펴 보자.

* public 접근자는 외부에 노출이 가능하다.
* public 접근자는 자식 클래스가 접근할 수 있다.
* protected 접근자는 외부에는 노출 되지는 않는다.
* protected 접근자는 자식 클래스가 접근할 수 있다.

결론은, 두 접근자 모두 자식 클래스에게 노출이 되지만 외부에 노출 여부가 차이가 있다.

#### 외부로 노출하고 싶지 않고 자식 클래스에 노출하고 싶은 경우는?

protected를 사용하는 이유는 두 가지로 나열할 수 있다.

* 상속받은 자식 클래스의 특성에 따라 변경 가능성이 열려 있다는 것을 암시한다.
* 미 구현 되었으므로 상속받은 자식 클래스에서 구현을 완성시켜야 한다는 것이다.

public 접근자는 외부로 노출되어 있기 때문에 이미 구현이 완성이 되었다는 것을 의미한다.

예제를 통해서 protected를 사용하는 경우를 살펴보자. 이전의 예로 들었던 Animal과 Bird를 다시 살펴보자. Animal의 move 메소드는 이동한다는 행동을 표현한 것이고 일반적인 동물은 이동할 경우에 걸어서 이동한다는 일반적인 경우를 메소드로 정의하였다. 그러나 자식 클래스인 Bird는 움직일 경우 날개를 이용하여 하늘을 날아서 이동한다.

> 그러므로 같은 이동한다는 의미가 상속받은 자식클래스에 따라서 변한다는 것을 알 수 있다.

그렇다면 move는 protected가 더 명확할 수 있겠다. 접근자를 변경하였으니 외부에 노출될 수 있는 go 메소드를 추가하겠다.

```java
public class Animal {
    private int legCount;
    private String name;

    public void printName(){
        System.out.println("I'm " + this.name);
    }

    private void run(){
        System.out.println("run with legs");
    }

    protected void move(){
        this.run();
    }

    public void go(){
        this.move();
    }
}

public class Bird extends Animal {
    private int wingCount;

    public void printName(){
        super.printName();
        System.out.println("I have ${wingCount} wings");
    }
    private void fly() {
        System.out.println("fly with wings");
    }

    protected void move(){
        this.fly();
    }

    public static void main(String[] args) {
        Bird bird = new Bird();
        bird.printName();
    }
}
```

### 상속은 언제 사용해야 할까?

상속을 사용해야 하는 명확한 이유는 SOLID 원칙에서 제시해주고 있다. SOLID 원칙의 Liskov Subsustitution Principle을 통해서 해답을 얻을 수 있다. 리스코프 치환 원칙은 상속받은 자식 클래스는 부모 클래스를 대체할 수 있는 경우에만 상속을 해야 한다고 명시하고 있다.

자식 클래스가 부모 클래스를 대체 할 수 있는 경우는 부모 클래스의 외부로 노출되는 메소드를 자식 클래스에서도 같은 의미로 제공되어야 한다는 것을 의미한다. 그렇기 때문에 우리가 많이 들어보았던 'IS-A' 관계가 성립해야 할 수 있다는 것을 알 수 있다.

### 상속으로 얻을 수 있는 장점은 무엇이 있을까?

상속 관계에서는 외부로부터 다형성을 보장하면서 클래스 내부 구현 코드를 모두 구현하지 않고 공통된 로직을 그대로 사용할 수 있고, 클래스 타입에 따라 변경되는 로직만 일부분 구현하면 된다는 것이 장점이 될 수 있다. 하지만 이런 장점도 Java 8부터는 인터페이스의 디폴트 메소드 기능이 나오면서 인터페이스내에서 로직 구현이 가능하여 상속의 장점이 약화되었다고 할 수 있다. 그래서 더 상속보다는 인터페이스를 사용해야 한다는 주장이 힘이 실리는 것 같다고 생각한다.

### 그럼 추상 클래스는 왜 사용하지?

추상 클래스는 protected 접근자를 사용하는 이유를 더 명확하게 나타내기 위해서 사용한다고 할 수 있다. 부모 클래스에서는 변경되는 로직을 abstract로 정의하여 내부 로직은 구현하지 않고 상속받은 자식 클래스에서는 무조건 구현할 수 있게 만들어 변경되어야 할 부분과 변경되지 않을 부분을 더 명확하게 구분할 수 있게 되었다. 또한, 컴파일 단계에서 자식클래스가 abstrct 메소드를 오버라이드 하지 않을 경우에는 에러가 발생하므로 런타임단계에서 발생할 수 있는 예외를 명확하게 확인할 수 있는 장점이 있다.

이런 추상 클래스를 사용한 대표적인 사례가 템플릿 메소드 패턴이라고 할 수 있다. 템플릿 메소드 패턴은 외부로 노출되는 메소드는 그대로이나 내부에서 변경되는 로직만 별도로 추상화하여 외부에서 필요한 전략을 선택하여 내부 구현만 변경되도록 노출하는 디자인 패턴이다.

아래는 오브젝트책에서 발췌한 내용으로 상품 할인이라는 부모 클래스를 두고 public 메소드는 calculateDiscountAmount\(\)를 사용하지만 메소드 내부에선 할인 정책을 추상화하여 상속받은 자식 클래스에게 할인 정책에 대한 계산을 위임하는 것을 확인 할 수 있다.

```java
public abstract class DiscountPolicy {
    private List<DiscountCondition> conditions = new ArrayList<>();

    public DiscountPolicy(DiscountCondition ... conditions) {
        this.conditions = Arrays.asList(conditions);
    }

    public Monet calculateDiscountAmount(Screening screening) {
        for(DiscountCondition each : conditions) {
            if (each.isSatisfiedBy(screening)) {
                return getDiscountAmount(screening);
            }
        }
        return Money.ZERO;
    }

    abstract protected Money getDiscountAmount(Screeing screening);
}
```

## 잘못된 상속 방법은?

간혹 어떤 이는 상속은 코드를 재사용 하기 위해 사용한다고 주장하는 이도 있다. 이는 전형적인 상속의 잘못된 사용 사례이고 이는 추후에 커다란 오류를 범할 수 있다.

> 그렇다면 코드 재사용을 위해 상속을 하면 어떤 단점이 있을까?

### 캡슐화를 위반할 수 있다.

부모의 public 메소드는 외부에 노출하기 위한 용도로 사용된다. 그러나 자식 클래스에서도 부모 클래스의 public 메소드는 외부로 노출되기 때문에 자식 클래스에서 의도하지 않는 동작을 수반할 수 있게 되며 이는 캡슐화를 위반하게 되는 것이다. 다음은 전형적인 캡슐화 위반 사례를 볼 수 있다.

Stack 클래스는 Vector 클래스를 상속받는다. 그래서 Stack 클래스가 제공하는 push, pop 이지만 Vector 클래스의 add 메소드 또한 외부로 노출되게 된다. 그러면서 아래와 같이 의도치 않은 동작이 실행되면서 오류를 범하게 된다.

```java
Stack<String> stack = new Stack<>();
stack.push("1st");
stack.push("2nd");
stack.push("3rd");

stack.add(0, "4th");

assertEquals("4th", stack.pop()); // 실패!!!!
```

테스트 코드 결과가 실패가 되는 이유는 stack은 LIFO\(Last Input First Out\) 구조로 가장 나중에 추가된 엘리먼트가 pop\(\) 메소드를 실행할 경우에 리턴되어야 한다. 그러나 add 메소드를 호출함으로써 stack의 의미와는 다르게 특정 인덱스의 값이 추가가 되므로 테스트 결과값이 일치하지 않아서 테스트 실패 결과를 도출하게 되었다.

### 설계가 유연하지 않는다.

상속으로 인해 결합도가 높아지면 다음과 같은 두 가지 문제점이 발생한다.

* 하나의 기능을 추가하거나 수정하기 위해 불필요하게 많은 수의 클래스를 추가하거나 수정해야 한다.
* 단일 상속만 지원하는 언어에서는 상속으로 인해 오히려 중복 코드의 양이 늘어날 수 있다.

![&#xC624;&#xBE0C;&#xC81D;&#xD2B8;\(&#xC870;&#xC601;&#xD638;&#xB2D8;\) &#xBC1C;&#xCDCC;](../../.gitbook/assets/class_explosion.jpg)

이처럼 상속의 남용으로 하나의 기능을 추가하기 위해 필요 이상으로 많은 수의 클래스를 추가해야 하는 경우를 가리켜 `클래스 폭발(class explosion)` 문제 또는 `조합의 폭발(combinational explosion)` 문제라고 부른다.

상속 관계는 `컴파일 타임`에 결정되고 고정되기 때문에 코드를 실행하는 도중에는 변경할 수 없다. 따라서 여러 기능을 조합해야 하는 설계에 상속을 이용하면 모든 조합 가능한 경우 별로 클래스를 추가 해야 한다.

## 합성이란?

합성은 객체가 다른 객체의 참조자를 얻는 방식으로 런타임시에 동적으로 이뤄진다. 이는 보통 has-a 관계라고 일컫는다. 따라서 다른 객체의 참조자를 얻은 후 그 참조자를 이용해서 객체의 기능을 이용하기 때문에 해당 객체의 인터페이스만을 바라보게 됨으로써 캡슐화가 잘 이뤄질 수 있다.

### 합성은 언제 사용해야 할까?

합성은 이전에 살펴본 상속의 잘못 사용 사례와 같이 구현 코드를 재사용하고 싶을 때 사용하면 유리하다. 또한 합성으로 사용된 코드는 사용하는 클래스에 따라 외부로 노출시킬 수 있고 내부로 캡슐화할 수도 있어 클래스 특성에 맞게 캡슐화를 할 수 있다.

그리고 합성을 사용하고 인터페이스 타입을 사용한다면 런타임시에 외부에서 필요한 전략에 따라 교체하며 사용할 수 있으므로 좀 더 유연한 설계를 할 수 있다. 대표적인 사례가 디자인 패턴 중에 전략 패턴이 될 수 있다.

![](../../.gitbook/assets/composition.jpg)

다음은 오브젝트 책에서 발췌한 전화 통신비 세율 계산 기능이다. 전화 통신비 세율은 평일 낮 시간에는 통화한 금액만 부과가 되고, 늦은 저녁시간 부터는 할인을 해주는 제도가 있다. 이럴 경우에 세율을 계산하는 인터페이스를 두고 인터페이스를 구현한 일반적인 할인 클래스와 저녁시간 할인 클래스를 구현하여 시간에 따라서 세율 구현 전략을 변경할 수 있다.

```text
public interface RatePolicy {
    Money calculateFee(Phone phone);
}
```

```text
public abstract class BasicRatePolicy implements RatePolicy {
    @Override
    public Money calculateFee(Phone phone) {
        Money result = Money.ZERO;

        for(Call call : phone.getCalls()) {
            result.plus(calculateCallFee(call));
        }

        return result;
    }

    abstract protected Money calculateCallFee(Call call);
}
```

```text
public class RegularPolicy extends BasicRatePolicy {
    private Money amout;
    private Duration seconds;

    public RegularPolicy(Money amount, Duration seconds) {
        this.amount = amount;
        this.seconds = seconds;
    }

    @Override
    protected Money calculateCallFee(Call call) {
        return amount.times(call.getDuration().getSeconds() / seconds.getSeconds());
    }
}
```

### 합성에는 단점은 없는가?

합성에도 단점은 있다. 우선 합성은 객체 간의 관계가 수직관계가 아닌 수평 관계가 된다. 따라서 큰 시스템에서 많은 부분에 걸쳐 합성이 사용될 때 객체나 메서드명이 명확하지 않으면 코드가 가독성이 떨어지고 이해하기 어려워지게 된다. 따라서 합성을 사용할 때에는 그 용도에 따라 클래스들을 패키지로 적적하게 분리해야 하고 각각의 사용 용도가 명확하게 드러나도록 인터페이스를 잘 설계해야 한다.

## 결론을 내보자

* 상속을 사용하고 싶다면 단순히 코드를 재사용하는 용도가 아닌 부모 클래스를 대체할 수 있는 IS-A 관계인지 고려해야 한다. 또한 IS-A 관계에서도 변경되는 부분이 있다고 하면 protected 접근자나 abstract 를 사용하여 자식 클래스에게 명확하게 전달해야 한다.
* 단순히 코드를 재사용하고 싶다면 합성을 고려해보자. 합성을 사용하면 코드 재사용도 가능할 뿐더러 캡슐화도 지킬 수 있다. 또한 다양한 전략에 따라 런타임시에 교체도 가능하여 유연하게 설계가 가능하다. 단, 합성을 하려는 클래스에 너무 많은 기능들이 정의되어 있거나 합성하는 인터페이스의 기능이 단일 책임보다 많은 책임을 가진 설계라면 분리해야 할 필요가 있다.

## 참고

* [https://realpython.com/inheritance-composition-python/](https://realpython.com/inheritance-composition-python/)
* [https://biggwang.github.io/2019/07/31/OOP/상속보다는 합성을 사용해야 하는 이유/](https://biggwang.github.io/2019/07/31/OOP/%EC%83%81%EC%86%8D%EB%B3%B4%EB%8B%A4%EB%8A%94%20%ED%95%A9%EC%84%B1%EC%9D%84%20%EC%82%AC%EC%9A%A9%ED%95%B4%EC%95%BC%20%ED%95%98%EB%8A%94%20%EC%9D%B4%EC%9C%A0/)
* [https://velog.io/@ljinsk3/11.-합성과-유연한-설계](https://velog.io/@ljinsk3/11.-%ED%95%A9%EC%84%B1%EA%B3%BC-%EC%9C%A0%EC%97%B0%ED%95%9C-%EC%84%A4%EA%B3%84)
* [http://www.darkkaiser.com/2007/07/16/상속과-합성/](http://www.darkkaiser.com/2007/07/16/%EC%83%81%EC%86%8D%EA%B3%BC-%ED%95%A9%EC%84%B1/)
* [https://m.blog.naver.com/PostView.nhn?blogId=2feelus&logNo=220576845725&proxyReferer=https:%2F%2Fwww.google.com%2F](https://m.blog.naver.com/PostView.nhn?blogId=2feelus&logNo=220576845725&proxyReferer=https:%2F%2Fwww.google.com%2F)

