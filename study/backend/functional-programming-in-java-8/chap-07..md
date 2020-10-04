---
description: Functional Programming in Java 8의 Chapter 6을 요약한 내용 입니다.
---

# CHAP 07. 재귀 호출 최적화

재귀를 사용하면 주어진 하나의 문제를 여러 개의 서브 문제로 나누어 해결한다는 의미다. 이 방법은 이미 잘 알려진 분할 그리고 정보\(Divide and Conquer\)이다. 일반적으로 재귀 방법을 사용했을 때 이점을 얻을 수 있는 문제들은 처리해야 할 데이터가 매우 큰 경우가 대부분이다. 그러나 처리할 데이터가 매우 클 경우, 서브 문제를 분할을 할수록 컴퓨터의 스택에 이전 단계의 서브문제에 대한 상태 정보를 쌓아두게 된다. 어느 정도 이상 스택에 상태 정보가 쌓이게 되면 결국 스택 공간이 모두 차버리고 스택 오버 플로우 오류가 발생한다.

## 테일-콜 최적화 사용

테일 콜은 마지막 오퍼레이션이 실행되는 위치에 있는 재귀 호출이 자기 자신을 호출하는 방법을 말한다. TCO는 대규모의 입력을 처리하기 위해 일반적인 재귀 호출을 테일 콜로 변경하도록 해준다.

### 최적화되지 않은 재귀로 시작하기

최적화되어 있지 않은 간단한 재귀를 사용해서 팩토리얼을 계산하는 코드부터 시작해보자

```java
public static int factorialRec(final int number) {
    if (number == 1) {
        return number;
    } else {
        return number * factorialRec(number - 1);
    }
}

// 실행
System.out.println(factorialRec(2000000));

// 결과
java.lang.StackOverflowError
```

숫자 5를 입력한 경우에는 오류 없이 결과값을 구할 수 있었지만, 200,000과 같은 큰 수에 대한 팩토리얼을 구하는 경우에는 "스택 오버플로우" 오류가 발생했다. 이것은 재귀 자체의 문제가 아니라 재귀가 완료할 때까지 연산의 부분 결과를 계속 스택에 보관하고 있어야 한다는 것이 문제다. 이 문제를 해결하기 위해서는 스택에서 저장하지 않고 재귀를 사용할 수 있는 방법이 필요하다.

### 테일 재귀로 변경

```java
public static TailCall<Integer> factorialTailRec(final int factorial, final int number) {
    if (number == 1) {
        return done(factorial);
    } else {
        return call(() -> factorialTailRec(factorial * number, number - 1));
    }
}
```

마지막 오퍼레이션은 자기 자신에 대한 호출이며, 리턴 결과를 수행하기 위한 추가적인 연산은 없다. 팩토리얼 메서드인 TailRec\(\)을 계속 호출하는 것보다 지연\(lazy/later\) 실행을 위해 이 부분을 람다 표현식으로 래핑\(wrapping\)했다.

### TailCall 함수형 인터페이스의 생성

done\(\) 메서드를 호출하면 재귀 종료 시그널을 보낸다. 한편 call\(\) 메서드를 계속 실행한다면 계속 재귀 호출을 요청하지만 현재 스택 레벨에서 한 스텝 더 들어가게 된 후에 진행된다.

#### TailCall interface

```java
@FunctionalInterface
public interface TailCall<T> {

    TailCall<T> apply();

    default boolean isComplete() { return false; }
    //...

    default T result() { throw new Error("not implemented"); }

    default T invoke() {
        return Stream.iterate(this, TailCall::apply)
					.filter(TailCall::isComplete)
					.findFirst()
					.get()
					.result();
    }
}
```

* isComplete\(\) : 간단하게 false 값을 리턴한다.
* result\(\) : 호출된다면 폭발하게 된다. 따라서 재귀가 진행되는 한 이 메서드를 결코 호출하지 않는다.
* apply\(\) : 다음 실행을 기다리고 있는 TailCall 인스턴스를 리턴한다.
* invoke\(\) :
  * 재귀 과정이 끝날 때까지 대기하고 있는 TailCall 재귀 메서드를 통해 반복적으로 이터레이션한다.
  * 재귀 과정이 끝에 도달하면, 최종 결과\(종단 TailCall 인스턴스의 result\(\) 메서드에 있는\)를 리턴해야 한다.

### TailCalls 컨비니언스 클래스의 생성

이터레이션은 isComplete\(\) 메서드가 완료됐다는 것을 리포트할 때까지 계속 실행된다. 그러나 TailCall 인터페이스에 있는 이 메서드의 default\(\) 구현은 항상 false를 리턴한다. 이것 static TailCalls 클래스가 들어오는 위치에 있다. TailCall 함수형 인터페이스의 두 가지 다른 구현을 제공하는데 하나는 call\(\) 메서드에 존재하고 다른 하나는 done\(\) 메서드에 존재한다.

```java
public class TailCalls {

    public static <T> TailCall<T> call(final TailCall<T> nextCall) {
        return nextCall;
    }

    public static <T> TailCall<T> done(final T value) {
        return new TailCall<T>() {
            @Override
            public boolean isComplete() { return true; }
            @Override
            public T result() { return value; }
            @Override
            public TailCall<T> apply() {
                throw new Error("not implemented");
            }
        };
    }
}
```

call\(\) 메서드는 간단하게 TailCall 인스턴스를 받아서 넘겨주는 역할을 한다.

done\(\) 메서드에서는 TailCall의 특별한 버전을 리턴하며 이 메서드는 재귀 과정이 종료되었음을 알려주는 역할을 한다. 이 메서드에서 전달받은 값을 특정 인스턴스의 오버라이드 result\(\) 메서드로 래핑한다. 특별한 버전의 isComplete\(\)는 true 값을 리턴해서 재귀가 끝났음을 알린다. 마지막으로 apply\(\) 메서드가 TailCall의 종단 구현에서는 결코 호출되지 않기 때문에 예외를 발생시킨다.

### 테일-재귀 함수의 사용

```text
factorialTailRec(1, 2).invoke();
```

첫 번째 인수 1은 팩토리얼의 초깃값이다. 두 번째 인수 2은 팩토리얼을 계산하려는 값이다. factorialTailRec\(\)에 대한 호출은 주어진 숫자가 1과 같은지를 체크해서 같지 않으면 call\(\) 메서드를 사용하고 TailCall의 인스턴스를 합성하는 람다 표현식을 넘긴다.

done\(\)에 대한 호출은 Tailcall의 특별한 인스턴스를 종료하고 재귀 과정을 종료하도록 시그널을 보낸다. invoke\(\) 메서드는 현재 연산의 마지막 결과를 리턴한다. 이 경우에는 2다.

