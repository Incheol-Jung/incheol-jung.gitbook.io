---
description: STREAM에 대해서 알아보자
---

# STREAM

![https://www.codementor.io/@duykhoa12t/java-8-stream-api-for-rubyist-x7pcvya2u](../../.gitbook/assets/ucarecdn.png)

## 스트림이란?

스트림이란 '**데이터 처리 연산을 지원하도록 소스에서 추출된 연속된 요소**'로 정의할 수 있다.

* 연속된 요소

  `컬렉션`과 마찬가지로 `스트림`은 특정 요소 형식으로 이루어진 연속된 값 집합의 `인터페이스`를 제공한다. 컬렉션의 주제는 `데이터`이고 스트림의 주제는 `계산`이다. 추후 이 차이에 대해 더 살펴보겠다.

* 소스

  스트림은 `컬렉션`, `배열`, `I/O 자원` 등의 데이터 제공 소스로부터 데이터를 소비\(`consume`\)한다.

* 데이터 처리 연산

  스트림 연산은 `순차적`으로 또는 `병렬`로 실행할 수 있다.

### 스트림 특징

* 파이프라이닝

  연산 파이프라인은 `데이터 소스`에 적용하는 데이터베이스 `질의`와 비슷하다.

* 내부 반복

  반복자를 이용해서 명시적으로 반복하는 컬렉션과 달리 스트림은 `내부 반복`을 지원한다.

### 외부 반복과 내부 반복

컬렉션 인터페이스를 사용하려면 사용자가 `직접` 요소를 반복해야 한다. 반면 `스트림` 라이브러리는 `내부 반복`을 사용한다. 따라서 함수에 어떤 작업을 수행 할 지만 지정하면 모든 것이 알아서 처리된다.

```java
// case 1. 외부 반복
List<String> names = new ArrayList<>();
for(Dish d:menu) {
    names.add(d.getName());
}

// case 2. 내부 반복
List<String> names = menu.stream()
                            .map(Dish::getName)
                            .collect(toList());

```

#### 외부 반복보다 내부 반복이 더 좋은 이유는 무엇일까?‌

스트림 라이브러리의 `내부 반복`은 `데이터 표현`과 `하드웨어`를 활용한 병렬성 구현을 자동으로 선택한다. 반면 `for-each`를 이용하는 `외부 반복`에서는 `병렬성`을 스스로 관리해야 한다. `병렬성`을 스스로 관리한다는 것은 병렬성을 `포기`하든지 아니면 `synchronized`로 시작하는 힘들고 긴 전쟁을 시작함을 의미한다.

## 스트림 연산

스트림 인터페이스의 연산을 크게 두 가지\(중간 연산, 최종 연산\)로 구분할 수 있다.

### 중간 연산

연산결과를 스트림으로 반환하기 때문에 중간 연산을 연속해서 연결할 수 있다. 중간 연산의 중요한 특징은 단말 연산을 스트림 파이프라인에 실행하기 전까지는 아무 연산도 수행하지 않는다. 즉 게으르다\(lazy\)는 것이다.

#### 중간 연산 종류 

| 연산 | 형 | 연산의 인 | 함수 디스크립 |
| :--- | :--- | :--- | :--- |
| filter | 중간 연산 | Predicate&lt;T&gt; | T -&gt; boolean |
| map | 중간 연산 | Function&lt;T,R&gt; | T -&gt; R |
| limit | 중간 연산 |  |  |
| sorted | 중간 연산 | Conparator&lt;T&gt; | \(T, T\) -&gt; int |
| distinct | 중간 연산 |  |  |

### 최종 연산

스트림의 요소를 소모하면서 연산을 수행하기 때문에 단 한번만 연산이 가능하다.

#### 최종 연산 종류 

| 연산 | 형식 | 목적 |
| :--- | :--- | :--- |
| forEach | 최종 연산 | 스트림의 각 요소를 소비하면서 람다를 적용한다. void를 반환한다. |
| count | 최종 연산 | 스트림의 요소 개수를 반복한다. long을 반환한다. |
| collect | 최종 연 | 스트림을 리듀스해서 리스트, 맵, 정수 형식의 컬렉션을 만든다. |

## 스트림 핵심 요소

### 늦은 연산\(Lazy evaluation\)

말 그대로 연산을 최대한 지연 시켜 프로그램 성능을 향상시키는 것이다. 주요한 대상은 리소스를 많이 사용하거나 동기화 같은 추가적인 오버레드가 많이 드는 코드의 실행을 최대한 지연시켜 전체적인 실행 속도를 향상시키는 것이다.

#### 스트림이 아니더라도 우리는 이미 Lazy evaluation을 사용하고 있다.

논리 오퍼레이션을 평가할 때 레이지 실행을 사용한다. 예를 들어 fn1\(\) \|\| fn2\(\)에서 fn1\(\)이 true를 리턴한다면 fn2\(\)는 절대 실행하지 않는다. 불필요한 서술문이나 함수의 평가를 피하고 성능을 향상시키는 데 도움을 준다. 코드의 정확성을 위해 이러한 쇼트 서킷에 종종 의존한다.

```java
public class LazyBoolean {
    public static boolean firstCondition(){
        System.out.println("first condition");
        return true;
    }

    public static boolean secondCondition(){
        System.out.println("second condition");
        return true;
    }

    public static void main(String[] args) {
        if(firstCondition() || secondCondition()){
            System.out.println("condition done!!");
        }
    }
}

// 결과값
// first condition
// condition done!!
```

#### 스트림에 대한 레이지 솔루션은 상당히 강력하다

filter\(\)와 map\(\) 메서드는 본질적으로 레이지 속성을 가진다. 이름의 리스트로 된 체인을 실행하면 filter\(\)와 map\(\) 메서드는 람다 표현식을 저장하고 체인의 다음 호출에게 이 람다 표현식을 전달한다. 평가는 종단 오퍼레이션인 findFirst\(\) 메서드가 호출될 때만 시작한다.‌

중간 오퍼레이션의 모든 함수는 하나의 함수 안에 존재하며 이 함수는 종단 오퍼레이션을 만족할 때까지 적절하게 각 엘리먼트를 평가하는 기능을 한다. 본질적으로 데이터에 대한 하나의 패스만이 존재한다. 그것은 한 번에 필터링, 매핑, 그리고 엘리먼트의 선택하는 것이다.

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
}
```

실행 후 도출되는 결과값은 다음과 같다.

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

다음의 결과를 보면 map\(\) 과 filter\(\)의 println\(\) 결과가 나중에\(정확히는 종단 연산자 전에 출력되는 출력물 보다 이후에\) 출력되는 것을 확인 할 수 있다.

### 쇼트 서킷\(Short circuit\)

전기/전자 분야에서 통용 되는 언어로 잘못된 배선 혹은 누전 등으로 인해 과전류가 흐르면 열이 발생하면서 연결된 선이 끊기게 된다. 선이 녹아내려 끊기게 되면 원래의 길이보다 짧아진다. 그런 의미에서 회로\(circuit\)가 짧아졌다\(short\) 라고 볼 수 있다. 이렇듯 스트림에서 쇼트 서킷이란 특정 조건을 만족하면 불필요한 로직을 더이상 수행하지 않는다는 의미이다. 어떻게 보면 문맥상 과전류와 불필요한 로직이 비슷한 의미로 표현되었다고 할 수 있다.

그렇기 때문에 다음과 같은 로직을 수행하더라도 필요한 조건에 해당하는 결과값을 찾는 로직을 수행할 수 있는 것이다.

```java
List<String> names = menu.stream()
    .filter(d -> {
        System.out.println("filtering" + d.getName());
        return d.getCalories() > 300;
    })
    .map(d -> {
            System.out.println("mapping" : g.getName());
            return d.getName();
    })
    .limit(3)
    .collect(toList());

// filtering pork
// mapping pork
// filtering beef
// mapping beef
// filtering chicken
// mapping chicken
```

## 스트림은 만능이 아니다

### 단 한번만 소비할 수 있다

최종 연산의 특징에서도 알 수 있듯이 한번 스트림을 소비하면 다음에 재 사용할 수 없다. 만약 다음과 같이 스트림을 재사용한다고 하면 어떻게 될지 살펴보자

```java
public class OneUseStream {

    public static void main(String[] args) {
        Stream<String> fruits =Stream.of("apple", "banana", "grape", "orange", "mango");

        String longestName = fruits.sorted(Comparator.comparing(String::length)).findFirst().orElse("");
        String shortestName = fruits.sorted(Comparator.comparing(String::length).reversed()).findFirst().orElse("");
        System.out.println("longestName is " + longestName + ", shortestName is " + shortestName);
    }
}
```

문자열을 가진 스트림을 사용하여 가장 이름이 긴 과일을 찾고 가장 짧은 이름을 찾는 로직을 하나의 스트림을 사용하여 수행하였다. 결과는 다음과 같다.

```text
Exception in thread "main" java.lang.IllegalStateException: stream has already been operated upon or closed
	at java.base/java.util.stream.AbstractPipeline.<init>(AbstractPipeline.java:203)
	at java.base/java.util.stream.ReferencePipeline.<init>(ReferencePipeline.java:94)
	at java.base/java.util.stream.ReferencePipeline$StatefulOp.<init>(ReferencePipeline.java:725)
	at java.base/java.util.stream.SortedOps$OfRef.<init>(SortedOps.java:126)
	at java.base/java.util.stream.SortedOps.makeRef(SortedOps.java:63)
	at java.base/java.util.stream.ReferencePipeline.sorted(ReferencePipeline.java:463)
	at com.example.practice.stream.OneUseStream.main(OneUseStream.java:15)
```

`stream has already been operated upon or closed` 스트림이 이미 소비되어 사용할 수 없다는 메시지를 확인할 수 있다. 그러므로 스트림을 최종 연산자를 통해 수행할 때는 재사용이 필요한 로직인지 고려할 필요가 있다.

### 원시타입 변환은 주의해서 사용하자

최종 연산을 사용하다 보면 더하거나 합치는 등 원시타입을 사용한 연산을 수행하는 경우가 있다. 자바는 JAVA 5 버전 이후부터는 오토 박싱과 오토 언박싱을 지원하기 때문에 아무런 오류없이 사용할 수 있지만 이는 성능상 큰 이슈가 될 수 있다.

다음의 음식의 칼로리의 합계를 구현하는 로직을 작성해보자

```java
public class MapStream {

    @Getter
    static class Food {

        private String name;
        private Integer calories;

        public Food(String name, int calories) {
            this.name = name;
            this.calories = calories;
        }
    }

    public static void main(String[] args) {
        Stream<Food> foodStream = Stream.of(new Food("apple", 100),
                                            new Food("banana", 300),
                                            new Food("grape", 50),
                                            new Food("mango", 1000),
                                            new Food("pineapple", 200),
                                            new Food("peach", 300));
        int totalCalories = foodStream.map(Food::getCalories)
            .reduce(0, Integer::sum);

        System.out.println("total calories is " + totalCalories);
    }
}
```

### 병렬 스트림이 성능을 항상 성능을 향상 시켜 주지 않는다

스트림은 parallel\(\) 메소드를 사용하게 되면 병렬로 동작한다. 반대로 해당 메소드를 붙여주지 않으면 기본적으로는 단일 스레드로 동작한다. 병렬 스레드로 동작하게 된다는 것은 언뜻 보기에는 매력적으로 다가올 수 있다. 그러나 이펙티브 자바에서 나오는 내용을 발췌해보자면 `잘 알지 못하면 병렬 스트림을 사용하지 말자` 이다. 왜냐하면 생각보다 병렬 스레드 스트림 방식은 단일 스레드 스트림 방식보다 더 안좋은 효율을 나타내기 때문이다. 다음과 같이 순차 덧셈 함수를 이용해서 천만개 숫자의 합계에 걸리는 시간을 계산해보자

```java
// 일반 스트림으로 수행한 결과(sequentialSum)
System.out.println("Sequential sum done in: " + 
    measureSumPerf(ParallelStreams::sequentialSum, 10_000_000) + " msecs");

// 결과값
Sequential sum done in: 97 msecs

--- 

// for loop로 실행한 결과(iterativeSum)
System.out.println("Iterative sum done in: " + 
    measureSumPerf(ParallelStreams::iterativeSum, 10_000_000) + " msecs");

// 결과값
Iterative sum done in: 2 msecs

---

// 병렬 스트림으로 실행환 결과(parallelSum)
System.out.println("Parallel sum done in: " + 
    measureSumPerf(ParallelStreams::parallelSum, 10_000_000) + " msecs");

// 결과값
Iterative sum done in: 164 msecs
```

#### 병렬 버전이 순차 버전보다 느리다는 것을 확인할 수 있다. 그 이유는 무엇일까?

* iterate가 박싱된 객체를 생성하므로 이를 다시 언박싱하는 과정이 필요했다.
* iterate는 병렬로 실행될 수 있도록 독립적인 청크로 분할하기가 어렵다.

우리에겐 병렬로 수행될 수 있는 스트림 모델이 필요하기 때문이다. 특히 이전 연산의 결과에 따라 다음 함수의 입력이 달라지기 때문에 iterate 연산을 청크로 분할하기가 어렵다. 리듀싱 과정을 시작하는 시점에 전체 숫자 리스트가 준비되지 않았으므로 스트림을 병렬로 처리할 수 있도록 청크로 분할할 수 없다. 스트림이 병렬로 처리되도록 지시했고 각각의 합계가 다른 스레드에서 수행되었지만 결국 순차처리 방식과 크게 다른 점이 없으므로 스레드를 할당하는 오버헤드만 증가하게 된다.

#### 멀티코어 프로세서를 활용해서 효과적으로 합계 연산을 병렬로 실행 하려면 어떻게 해야 할까?

* LongStream.rangeClosed는 기본형 long을 직접 사용하므로 박싱과 언박싱 오버헤드가 사라진다.
* LongStream.rangeClosed는 쉽게 철크로 분할할 수 있는 숫자 범위를 생산한다. 예를 들어 1-20 범위의 숫자를 각각 1-5, 6-10,11-15,16-20 범위의 숫자로 분할할 수 있다.

#### 이번엔 순차적으로 누적 합계를 구하는 로직을 작성해보자

```java
public static long sideEffectSum(long n) {
    Accumulator accumulator = new Accumulator();
    LongStream.rangeClosed(1, n).forEach(accumulator::add);
    return accumulator.total;
}

public class Accumulator {
    public long total = 0;
    public void add(long value) { total += value; }
}
```

위 코드는 본질적으로 순차 실행할 수 있도록 구현되어 있으므로 병렬로 실행하면 참사가 일어난다. 특히 total을 접근할 때마다 \(다수의 스레드에서 동시에 데이터에 접근하는\) 데이터 레이스 문제가 일어난다. 동기화로 문제를 해결하다보면 결국 병렬화라는 특성이 없어져 버릴 것이다.

## 참조

* [https://incheol-jung.gitbook.io/docs/study/java-8-in-action/2020-03-10-java8inaction-chap7](https://incheol-jung.gitbook.io/docs/study/java-8-in-action/2020-03-10-java8inaction-chap7)
* [https://incheol-jung.gitbook.io/docs/study/functional-programming-in-java-8/untitled-2](https://incheol-jung.gitbook.io/docs/study/functional-programming-in-java-8/untitled-2)
* [https://futurecreator.github.io/2018/08/26/java-8-streams/](https://futurecreator.github.io/2018/08/26/java-8-streams/)
* [https://effectivesquid.tistory.com/entry/Java-Stream이란](https://effectivesquid.tistory.com/entry/Java-Stream%EC%9D%B4%EB%9E%80)

