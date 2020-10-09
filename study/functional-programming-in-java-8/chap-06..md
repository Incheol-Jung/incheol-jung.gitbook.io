---
description: Functional Programming in Java 8의 Chapter 6을 요약한 내용 입니다.
---

# CHAP 06. 레이지

코드를 실행할 때 몇몇 코드를 실행 순서가 됐을 때 바로 실행하기보다는 약간 지연\(lazy\)시키게 되면 성능 향상을 얻을 수 있다. eager 방식은 간단하지만 lazy 방식은 효율적이다. 프로그램에서 무거운 객체를 사용한다면, 그 객체에 대한 생성 작업을 되도록 지연 혹은 느리게 하고 싶을 것이다. 실제로 그 객체가 필요하기 전까지는 과도한 연산을 지연하는 것이 좋다. 람다 표현식은 우리의 프로그램을 레이지하면서도 빠르게 수행하도록 해주기 때문에 별다른 노력을 하지 않아도 된다.

## 지연 초기화

캡슐화한다는 것은 적절한 상태 전이를 보장하고 객체의 불변을 유지한다는 의미이다. 이것은 애플리케이션이 실행되는 대부분의 시간 동안 잘 동작하지만, 객체 내부의 일부분이 무거운 리소스인 경우에 그 객체의 생성을 늦추면 이점을 얻을 수 있다. 이러한 작업은 전반적으로 객체 생성의 속도를 향상할 수 있고 프로그램은 사용하지도 않는 객체를 생성하기 위한 노력을 들이지 않아도 된다.

### 익숙한 방법

리소스에 따라 필요한 메모리와 자원이 제각각이기 때문에 이 클래스의 인스턴스를 생성하는 것은 상당한 시간과 메모리가 필요하다.

```java
public class HolderNaive {
  private Heavy heavy;
  
  public HolderNaive() {
    System.out.println("Holder created");
  }
  
  public Heavy getHeavy() {
    if(heavy == null) {
      heavy = new Heavy();
    }
    
    return heavy;
  }
	...
}
```

이 코드는 매우 간단하다. null 레퍼런스인 heavy를 만들고 getHeavy\(\) 메서드에 대한 첫 번째 호출에서 적절한 인스턴스를 할당한다. 이는 잘 동작하는 것 같지만 스레드 세이프티하지 않다.

### 스레드 세이프티의 제공

두 개 이상의 스레드가 동시에 getHeavy\(\) 메서드를 호출한다면 다중 Heavy 인스턴스 갖게 되고 결국 스레드당 하나씩의 인스턴스가 생성된다. 이는 synchronizedd 키워드를 getHeavy 메서드에 추가해주면 해결된다. 레이스 컨디션은 피했지만 다른 부정적인 임팩트가 발생했다. getHeavy\(\) 메서드에 대한 모든 호출은 동기화 오버헤드를 갖게 됐다. 스레드를 호출하는 것은 동시에 경쟁하는 스레드는 없다고 하더라도 메모리 장벽을 넘나드는 오버헤드를 갖는다.

### 인다이렉션 레벨 추가

Supplier&lt;T&gt;는 인스턴스를 리턴한다. 예를 들어, Supplier&lt;Heavy&gt;를 구현해서 Heavy의 인스턴스를 리턴한다.

```java
Supplier<Heavy> supplier = () -> new Heavy();
Supplier<Heavy> supplier = Heavy::new;
```

하지만 이전의 코드는 단순히 생성하는 것보다 더 많은 로직이 필요하다. 인스턴스를 지연시키고 캐시하는 기능이 추가되어야 한다.

```java
public class Holder {
  private Supplier<Heavy> heavy = () -> createAndCacheHeavy();
  
  public Holder() {
    System.out.println("Holder created");
  }

  public Heavy getHeavy() {
    return heavy.get();
  }
  //...

  private synchronized Heavy createAndCacheHeavy() {
    class HeavyFactory implements Supplier<Heavy> {
      private final Heavy heavyInstance = new Heavy();

      public Heavy get() { return heavyInstance; }
    }

    if(!HeavyFactory.class.isInstance(heavy)) {
      heavy = new HeavyFactory();
    }
    
    return heavy.get();
  }
}
```

* heavy는 HeavyFactory로 교체된다.
* getHeavy\(\) 메서드를 호출한다.
* HeavyFactory의 get\(\) 메서드를 호출하며 어떤 동기화 오버헤드도 발생시키지 않는다.

레이지 초기화를 설계했고 동시에 null 체크도 피했다. 더 나아가서 레이지 인스턴스 생성의 스레드 세이프티도 보장했다. 이것은 가상 프록시 패턴의 경량화 구현이다.

## 레이지 이밸류에이션\(Lazy Evaluation\)

이제는 실행하는 메서드를 지연시켜 설계를 향상해보자. 주요한 대상은 리소스를 많이 사용하거나 동기화 같은 추가적인 오버헤드가 많이 드는 코드의 실행을 최대한 지연시켜 전체적인 실행 속도를 향상시키는 것이다.

자바는 이미 논리 오퍼레이션을 평가할 때 레이지 실행을 사용한다. 예를 들어 fn1\(\) \|\| fn2\(\)에서 fn1\(\)이 true를 리턴한다면 fn2\(\)는 절대 실행하지 않는다. 불필요한 서술문이나 함수의 평가를 피하고 성능을 향상시키는 데 도움을 준다. 코드의 정확성을 위해 이러한 쇼트 서킷에 종종 의존한다.

람다 표현식을 사용하여 선택된 인수의 실행을 지연시킬 수 있다. 자바 컴파일러는 람다 표현식과 메서드 레퍼런스를 호출된 위치의 인수 리스트에서 평가한다.

### eager evaluation으로 시작하기

```java
// 실행 함수
public static boolean evaluate(final int value) {
  System.out.println("evaluating ..." + value);
  simulateTimeConsumingOp(2000);
  return value > 100;
}

// 즉시 실행 함수
public static void eagerEvaluator(
  final boolean input1, final boolean input2) {
  System.out.println("eagerEvaluator called...");
  System.out.println("accept?: " + (input1 && input2));
}

// 즉시 실행 함수 사용 예제
public static void main(final String[] args) {
	System.out.println("//" + "START:EAGER_OUTPUT");
	eagerEvaluator(evaluate(1), evaluate(2));
	System.out.println("//" + "END:EAGER_OUTPUT");
}

// 결과 값
//START:EAGER_OUTPUT
evaluating ...1
evaluating ...2
eagerEvaluator called...
accept?: false
//END:EAGER_OUTPUT
```

eagerEvaluator 메서드는 두 개의 boolean 파라미터를 갖는다. 메서드에서 파라미터로 논리 오퍼레이션인 &&를 수행한다. 안타깝게도 이 오퍼레이션에 진입하기 전에 인수들이 평가되기 때문에 이 오퍼레이션에서 자동적으로 제공하는 레이지 이밸류에이션으로부터 이점을 얻기에는 너무 늦는다. 이는 실행하는데 4초가 걸린다. 그 이유는 evaludate\(\) 메서드에 대한 로출로부터 누적된 시간 때문이다.

### lazy evaluation을 위한 설계

```java
// 지연 실행 함수
public static void lazyEvaluator(
  final Supplier<Boolean> input1, final Supplier<Boolean> input2) {
  System.out.println("lazyEvaluator called...");
  System.out.println("accept?: " + (input1.get() && input2.get()));
}

// 즉시 실행 함수 사용 예제
public static void main(final String[] args) {
	System.out.println("//" + "START:LAZY_OUTPUT");
  lazyEvaluator(() -> evaluate(1), () -> evaluate(2));
  System.out.println("//" + "END:LAZY_OUTPUT");
}

// 결과 값
//START:LAZY_OUTPUT
lazyEvaluator called...
evaluating ...1
accept?: false
//END:LAZY_OUTPUT
```

lazyEvaluator 메서드는 두 개의 boolean 파라미터를 받기보다는 Supplier 인스턴스에 대한 레퍼런스를 받는다. Supplier 함수형 인터페이스는 get\(\) 메서드에 대한 반응으로 인스턴스를 리턴하고 이 경우에는 boolean이다.

lazyEvaluator\(\) 메서드에 인수로 evaludate\(\)에 대한 두 개의 호출을 넘기면 두 번째는 첫 번째 호출이 boolean 값 true를 리턴한 경우에만 평가된다.

```text
lazyEvaluator(() -> evaludate(1), () -> evaludate(2));
```

인수는 lazyEvaluator\(\) 메서드에 진입하기 전에 평가되지 않는다. lazyEvaluator\(\)의 호출에 대한 예제는 단지 약 2초 정도 걸린다.

이 기술은성능 역시 상당히 향상시키지만, 단점은 람다 표현식에 있는 호출을 패키징한 메서드가 호출하는 경우에 부담이 된다. 확실하게 람다 표현식은 간결하지만 인수를 넘기는 방법과 비교하면 어렵다. 컨텍스트에 따라 람다 표현식 대신 메서드 레퍼런스를 사용할 수도 있으며 이것은 코드를 좀 더 간결하게 해주고 람다 표현식을 사용할 때의 어려움을 약간 해소시켜 준다.

## 스트림의 레이지 강화하기

### 스트림에 대한 레이지 솔루션은 상당히 강력하다.

1. 레이지 솔루션을 사용할 때의 장점을 얻기 위해 특별히 뭔가를 할 필요는 없다.
2. 하나만 연기하는 것이 아니라 평가하는 순서를 연기해서 필요할 때만 로직의 가장 중요한 부분을 평가할 수 있다.

### 중간 오퍼레이션과 종단 오퍼레이션

스트림은 두 가지 종류의 메서드를 갖고 있다.

* 중간\(Intermediate\) 오퍼레이션
* 종단\(Terminal\) 오퍼레이션

map\(\)과 filter\(\) 메서드가 중간 오퍼레이션이다. 이 메서드를 호출하면 바로 리턴하고 이 메서드에게 전달되는 람다 표현식은 즉시 평가되지 않는다. 이 메서드의 코어 비헤이비어는 나중에 실행될 때를 위해 캐시한다는 것과 이 메서드가 호출될 때 실제 실행되지 않는다는 점이다. 캐시 비헤이비어는 finFirst\(\)와 reduce\(\)와 같은 종단 오퍼레이션 중 하나가 호출된다. 캐시된 코드 모두가 실행되는 것은 아니지만, 연산은 원하는 결과를 삭제하면 바로 완료한다.

```java
public class LazyStreams {
    private static int length(final String name) {
      System.out.println("getting length for " + name);
      return name.length();
    }
    private static String toUpper(final String name ) {
      System.out.println("converting to uppercase: " + name);
      return name.toUpperCase();
    }
    //...

}

public static void main(final String[] args) {
  List<String> names = Arrays.asList("Brad", "Kate", "Kim", "Jack", "Joe",
    "Mike", "Susan", "George", "Robert", "Julia", "Parker", "Benson");
  System.out.println("//" + "START:CHAIN_OUTPUT");
  {

  final String firstNameWith3Letters = 
    names.stream()
         .filter(name -> length(name) == 3)
         .map(name -> toUpper(name))
         .findFirst()
         .get();
}

// 수행 결과 로그
//START:CHAIN_OUTPUT
getting length for Brad
getting length for Kate
getting length for Kim
converting to uppercase: Kim
```

위의 코드를 실행하면 이름 리스트를 갖고 그 이름 리스트를 스트림으로 변환한 후에 세 자리로 된 이름만 필터링한다. 그리고 나서 그 선택된 이름들을 모두 대문자로 바꾸고 그 중 첫번째 이름을 선택한다. 얼핏 보면 이 코드는 컬렉션 변환 작업을 여러 번 하고 있지만, 이는 실제로는 레이지이다.

### 메서드 평가 순서

호출 체인에서 각 단계는 체인에 있는 종단 오퍼레이션을 완료하기 위한 작업을 하게 된다. 코드가 eager 방법으로 되어 있는 경우에 filter\(\) 메서드는 컬렉션에 있는 수십 개의 이름을 모두 처리하여 두 개의 이름으로 된 리스트를 생성한다. 그리고 나서, map\(\) 메서드에 대한 다음 호출에서 두 개의 이름을 평가한다. findFirst\(\) 메서드는 마지막으로 이 두 개의 이름으로 된 리스트에서 첫 번째 엘리먼트를 선택한다.

그러나 filter\(\)와 map\(\) 메서드는 본질적으로 레이지 속성을 가진다. 이름의 리스트로 된 체인을 실행하면 filter\(\)와 map\(\) 메서드는 람다 표현식을 저장하고 체인의 다음 호출에게 이 람다 표현식을 전달한다. 평가는 종단 오퍼레이션인 findFirst\(\) 메서드가 호출될 때만 시작한다.

중간 오퍼레이션의 모든 함수는 하나의 함수 안에 존재하며 이 함수는 종단 오퍼레이션을 만족할 때까지 적절하게 각 엘리먼트를 평가하는 기능을 한다. 본질적으로 데이터에 대한 하나의 패스만이 존재한다. 그것은 한 번에 필터링, 매핑, 그리고 엘리먼트의 선택하는 것이다.

### 레이지에 대한 심도 있는 고찰

```java
public static void main(final String[] args) {
		System.out.println("//" + "START:SPLIT_OUTPUT");
    Stream<String> namesWith3Letters = names.stream()
                                            .filter(name -> length(name) == 3)
                                            .map(name -> toUpper(name));

    System.out.println("Stream created, filtered, mapped...");
    System.out.println("ready to call findFirst...");

    final String firstNameWith3Letters = namesWith3Letters.findFirst().get();

    System.out.println(firstNameWith3Letters);
    System.out.println("//" + "END:SPLIT_OUTPUT");
}
```

컬렉션을 스트림으로 변형하고, 값을 필터링한 후에 결과 컬렉션에 매핑한다. 그리고 나서, 종단 오퍼레이션을 호출한다. 평가 순서를 보기 위해 코드를 실행해보자.

```text
// 수행 결과 로그
//START:SPLIT_OUTPUT
Stream created, filtered, mapped...
ready to call findFirst...
getting length for Brad
getting length for Kate
getting length for Kim
converting to uppercase: Kim
KIM
//END:SPLIT_OUTPUT
```

결과에서 보듯이 중간 오퍼레이션이 실제 작업에는 필요한 순간이 되기 전까지 지연되고 있다는 것을 알 수 있다. 그 필요한 순간은 종단 오퍼레이션이 호출되는 순간이다. 종단 오퍼레이션을 만족하는 최소한의 작업만 실행됐다.

## 무한, 그리고 레이지 컬렉션의 생성

무한 컬렉션은 점점 증가하는 혹은 자라나는 연속된 뎅이터들을 처리하는 코드를 생성하는 데 사용된다. 예를 들면, 피보나치 수열 등이며 이 무한 컬렉션을 사용하면 더 명확하고 쉽게 표현할 수 있다. 자바에서 컬렉션은 유한하지만 스트림은 무한하다. 레이지가 무한 스트림이 가능하도록 하는 것이다.

### 가망 없는 시도

주어진 숫자가 소수이면 소수의 리스트에 추가하고 그렇지 않으면 제거하고 다음수를 검사한다.

```java
public static List<Integer> primes(final int number) {
  if(isPrime(number))
    return concat(number, primes(number + 1));
  else
    return primes(number + 1);
}
```

이 코드는 얼핏 보면 문제가 없어지보이지만 불행하게도 동작하지 않을 것이다. concat\(\) 메서드를 구현하고 코드를 실행하면, 결코 끝나지 않는 재귀 호출에 빠져들고 결국 StackOverFlowError가 발생하게 된다.

#### 이는 어떻게 해결할 수 있을까?

```java
public static List<Integer> primes(final int fromNumber, final int count) {
  return Stream.iterate(primeAfter(fromNumber - 1), Primes::primeAfter)
               .limit(count)
               .collect(Collectors.<Integer>toList());
}
```

Stream 인터페이스는 정적 메서드 iterate\(\)를 가지며 이 메서드는 무한 스트림을 생성한다. iterate\(\) 메서드가 리턴하는 스트림은 terminating 메서드를 사용하기 전까지 엘리먼트에 대한 생성을 지연한다. 첫 번째 엘리먼트를 얻기 위해서 findFirst\(\) 메서드를 호출한다. 10개의 엘리먼트를 얻기 위해서는 스트림에서 limit\(\) 메서드를 호출한다.

```java
public static void main(final String[] args) {
  System.out.println("10 primes from 1: " + primes(1, 10));
  System.out.println("5 primes from 100: " + primes(100, 5));
}

// 결과
10 primes from 1: [2, 3, 5, 7, 11, 13, 17, 19, 23, 29]
5 primes from 100: [101, 103, 107, 109, 113]
```

두 종류의 소수를 구했고 하나는 1부터 시작을 했으며 다른 하나는 100부터 시작했다. 이 결과는 primes\(\) 메서드 안에 있는 무한 연속 집합에서 구했다. 바로 이 부분이 스트림의 레이지와 람다 표현식/메서드 레퍼런스의 강점이다.

람다 표현식과 메서드 레퍼런스를 사용하면 코드가 좀 더 깔끔하고 우아해지며 간결해지지만, 자바8 애플리케이션이 얻을 수 있는 실질적인 성능 향상은 스트림에 있다.

## 정리

효율성은 자바8의 강점이다. 레이지를 사용하여 코드가 필요한 순간까지 해당 코드의 실행을 지연시킬 수 있다. 무거운 리소스에 대한 초기화를 지연시키고 가상 프록시 패턴을 사용하여 쉽게 구현할 수도 있다. 또한 메서드의 호출을 좀 더 효율적으로 하기 위해 메서드 인수의 평가를 지연할 수도 있다. JDK에 있는 진짜 강력한 기능 중 하나는 Stream 인터페이스와 관련된 클래스들이다. 이것들의 레이지 비헤이비어를 사용하여 적은 라인 수의 코딩만으로 무한 컬렉션을 만들 수도 있다. 이것은 매우 서술적이고 간결한 코드를 의미하며 복잡한 오퍼레이션을 이전 자바에서는 상상할 수 없는 간결한 방법으로 만들어준다는 것을 의미한다.

