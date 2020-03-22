---
layout:     post
title:      "3장 람다 표현식"
date:       2020-03-10 00:00:00
categories: java
summary:    3장 람다 표현식
---

> 자바 8 인 액션 3장을 요약한 내용 입니다.

## 람다란 무엇인가?

람다 표현식은 메서드로 전달할 수 있는 익명 함수를 단순화한 것이다. 

- 익명 : 보통의 메서드와 달리 이름이 없으므로 익명이라 표현한다.
- 함수 : 람다는 메서드처럼 특정 클래스에 종속되지 않으므로 함수라고 부른다.
- 전달 : 람다 표현식을 메서드 인수로 전달하거나 변수로 저장할 수 있다.
- 간경성 : 익명 클래스처럼 많은 자질구레한 코드를 구현할 필요가 없다.

람다의 구성 요소

- 파라미터 리스트
- 화살표 : 파라미터 리스트와 바디를 구분한다.
- 바디 : 람다의 반환값에 해당하는 표현식

## 어디에, 어떻게 람다를 사용할까?

함수형 인터페이스는 정확히 하나의 추상 메서드를 지정하는 인터페이스이다. 

@FunctionalInterface 어노테이션을 붙여 주면 메서드가 2개 이상일 경우 컴파일 단계에서 에러를 발생 시킬 수 있다.

람다 표현식으로 함수형 인터페이스의 추상 메서드 구현을 직접 전달할 수 있으므로 전체 표현식을 함수형 인터페이스의 인스턴스로 취급(기술적으로 함수형 인터페이스를 concreate 구현한 클래스의 인스턴스) 할 수 있다. 
```java
    public interface Predicate<T> {
    	boolean test (T t);
    }

    public interface Callable<T> {
    	V call();
    }
```
### 왜 함수형 인터페이스를 인수로 받는 메서드에만 람다 표현식을 사용할 수 있는걸까?

→ 15장 16장에서 다시 확인

## 함수형 인터페이스 사용

### Predicate

java.util.function.Predicate<T> 인터페이스는 test라는 추상 메서드를 정의하며 test는 제네릭 형식 T의 객체를 인수로 받아 불린을 받환한다. 

### Consumer

java.util.function.Consumer<T> 인터페이스는 제네릭 형식 T 객체를 받아서 void를 반환하는 accept라는 추상 메서드를 정의한다. T 형식의 객체를 인수로 받아서 어떤 동작을 수행하고 싶을 때 Consumer 인터페이스를 사용할 수 있다. 

### Function

java.util.function.Function<T,R> 인터페이스는 제네릭 형식 T를 인수로 받아서 제네릭 형식 R 객체를 반환하는 apply라는 추상 메서드를 정의한다. 입력을 출력으로 매핑하는 람다를 정의할 때 Function 인터페이스를 활용할 수 있다. 

자바 8에서는 기본형을 입출력으로 사용하는 상황에서 오토박싱 동작을 피할 수 있도록 특별한 버전의 함수형 인터페이스를 제공한다. 

기본형 참조형 개념(메모리 구조, equals)

## 형식 검사, 형식 추론, 제약

람다 표현식 자체에는 람다가 어떤 함수형 인터페이스를 구현하는지의 정보가 포함되어 있지 않다. 따라서 람다 표현식을 더 제대로 이해하려면 람다의 실제 형식을 파악해야 한다. 

람다 표현식의 형식 검사 과정의 재구성

### 형식 검사
```java
    List<Apple> heavierThan150g = filter(inventory, (Apple a) -> a.getWeight() > 150);
```
1. 람다가 사용된 콘텍스트는 무엇인가? 우선 filter의 정의를 확인하다. 
2. 대상 형식은 Predicate<Apple>이다.
3. Predicate<Apple>인터페이스의 추상 메서드는 무엇인가?
4. Apple을 인수로 받아 boolean을 반환하는 test 메서드다
5. 함수 디스크립터는 Apple → boolean이므로 람다의 시그니처와 일치한다. 람다도 Apple을 인수로 받아 boolean을 반환하므로 코드 형식 검사가 성공적으로 완료된다. 

### 형식 추론

자바 컴파일러는 람다 표현식이 사용된 콘텍스트를 이용해서 람다 표현식과 관련된 함수형 인터페이스를 추론한다. 결과적으로 컴파일러는 람다 표현식의 파라미터 형식에 접긍할 수 있으므로 람다 문법에서 이를 생략할 수 있다. 

### 지역 변수 사용

람다 표현식에서는 익명 함수가 하는 것처럼 자유 변수(파라미터로 넘겨진 변수가 아닌 외부에서 정의된 변수)를 활용할 수 있다. 이를 람다 캡처링이라고 부른다. 

하지만 람다 표현식은 한 번만 할당할 수 있는 지역 변수를 캡처할 수 있다. (final로 선언된 변수만 사용 가능)

> 왜 지역 변수에 이런 제약이 필요할까?

인스턴스 변수는 힙에 저장되는 반면 지역 변수는 스택에 위치한다. 

자바 메모리 구조 이해 필요!!

람다에서 지역 변수에 바로 접긍할 수 있다는 가정 하에 람다가 스레드에서 실행된다면 변수를 할당한 스레드가 사라져서 변수 할당이 해제되었는데도 람다를 실행하는 스레드에서는 해당 변수에 접근하려 할 수 있다. 따라서 자바 구현에서는 원래 변수에 접근을 허용하는 것이 아니라 자유 지역 변수의 복사본을 제공한다. 따라서 복사본의 값이 바뀌지 않아야 하므로 지역 변수에는 한 번만 값을 할당해야 한다는 제약이 생긴 것이다. 

### 메서드 레퍼런스

메서드 레퍼런스는 특정 메서드만을 호출하는 람다의 축약형이다. 

메서드 레퍼런스를 새로운 기능이 아니라 하나의 메서드를 참조하는 람다를 편히라게 표현할 수 있는 문법으로 간주 할 수 있다. 

[람다와 메서드 레퍼런스 단축 표현 예제](https://www.notion.so/5b770f4a72124216b86c31b89ba10659)

## 람다, 메서드 레퍼런스 활용하기

> 코드전달 → 익명 클래스 사용 → 람다 표현식 사용 → 메서드 레퍼런스 사용

Comparator는 Comparable 키를 추출해서 Comparator 객체로 만드는 Function 함수를 인수로 받는 정적 메서드 comparing을 포함한다.  그러므로 다음처럼 사용할 수 있다. 
```java
    import static java.util.Comparator.comparing;
    inventory.sort(comparing((a) -> a.getWeight()));
```
메서드 레퍼런스를 이요하면 더 깔끔하게 표현도 가능하다. 
```java
    inventory.sort(comparing(Apple::getWeight));
```
## 람다 표현식을 조합할 수 있는 유용한 메서드

### 역정렬

비교자 구현을 그대로 재사용하여 사과의 무게를 기준으로 역정렬할 수 있다. 
```java
    // 무게를 내림차순으로 정렬
    Inventory.sort(comparing(Apple::getWeight).reserved()); 
```
### Comparator 연결

 thenComparing은 함수를 인수로 받아 첫 번째 비교자를 이요해서 두 객체가 같다고 판단되면 두 번째 비교자에 객체를 전달한다. 
```java
    // 무게를 내림차순으로 정렬하고 두 사과의 무게가 같으면 국가별로 정렬할것
    inventory.sort(comparing(Apple::getWeight)
    					.recered()
    					.thenComparing(Apple::getContry));
```
### Predicate 조합

Predicate 인터페이스는 복잡한 Predicate를 만들 수 있도록 negate, and, or 세 가지 메서드를 제공한다. 
```java
    // 빨간색이면서 무거운(150그램 이상) 사과 또는 그냥 녹색 사과
    Predicate<Apple> redAndHeavyAppleOrGreen = 
    											redApple.and(a -> a.getWeight() > 150)
    															.or(a -> "green".equals(a.getColor()));
```
### Function 조합

Function 인터페이스는 andThen, compose 두 가지 디폴트 메서드를 제공한다. 

andThen 메서드는 주어진 함수를 먼저 적용한 결과를 다른 함수의 입력으로 전달하는 함수를 반환한다. 
```java
    Function<Integer, Integer> f = x -> x + 1;
    Function<Integer, Integer> g = x -> x * 2;
    Function<Integer, Integer> h = f.andThen(g);
    int result = h.apply(1); // 4
```
compose 메서드는 인수로 주어진 함수를 먼저 실행한 다음에 그 결과를 외부 함수의 인수로 제공한다. 
```java
    Function<Integer, Integer> f = x -> x + 1;
    Function<Integer, Integer> g = x -> x * 2;
    Function<Integer, Integer> h = f.compose(g);
    int result = h.compose(1); // 3
```
## 요약

- 람다 표현식은 익명 함수의 일종이다. 이름은 없지만 파라미터 리스트, 바디, 반환 형식을 가지며 예외를 던질 수 있다.
- 람다 표현식으로 간결한 코드를 구현할 수 있다.
- 함수형 인터페이스는 하나의 추상 메서드만을 정의하는 인터페이스다.
- 함수형 인터페이스를 기재하는 곳에서만 람다 표현식을 사용할 수 있다.
- 람다 표현식을 이용해서 함수형 인터페이스의 추상 메서드를 즉석으로 제공할 수 있으며 람다 표현식 전체가 함수형 인터페이스의 인스턴스로 취급된다.
- 자바 8은 Predicate<T>와 Function<T,R> 같은 제네릭 함수형 인터페이스와 관련된 박싱 동작을 피할 수 있도록 IntPredicate, IntToLongFunction 등과 같은 기본형 특화 인터페이스도 제공한다.
- 실행 어라운드 패턴을 람다와 활용하면 유연성과 재사용성을 추가로 얻을 수 있다.
- 메서드 레퍼런스를 이용하면 기존의 메서드 구현을 재사용하고 직접 전달할 수 있다.
- Comparator, Predicate, Function 같은 함수형 인터페이스는 람다 표현식을 조합할 수 있는 다양한 디폴트 메서드를 제공한다.    	
```java
List<T> result = new ArrayList<>();
    	for(T e: list) {
    		if(p.test(e)) {
    			result.add(e);
    		}
    	}
    	return result;
    }	
```

이제 바나나, 오렌지, 정수, 문자열 등의 리스트에 필터 메서드를 사용할 수 있다. 
```java
    List<Apple> redApples = filter(inventory, (Apple apple) -> "red".equals(apple.getColor()));
    List<String> evenNumbers = filter(numbers, (Integer i) -> i % 2 == 0);
```
## 실전 예제

### Comparator로 정렬하기

자바 8 List에는 sort 메서드가 포함되어 있다(물론 Collections.sort도 존재한다). 다음과 같은 인터페이스를 갖는 java.util.Comparator 객체를 이용해서 sort의 동작을 파라미터화할 수 있다. 
```java
    // java.util.Comparator
    public interface Comparator<T> {
    	public int compare(T o1, T o2);
    }
```

Comparator를 구현해서 sort 메서드의 동작을 다양화할 수 있다. 
```java
    inventory.sort(new Comparator<Apple>() {
    	public int compare(Apple a1, Apple a2) {
    		return a1.getWeight().compareTo(a2.getWeight());
    	}
    });
```

실제 정렬 세부사항은 추상화되어 있으므로 신경 쓸 필요가 없다. 람다 표현식을 이용하면 다음처럼 단간하게 코드를 구현할 수 있다. 
```java
    inventory.sort((Apple a1, Apple a2) -> a1.getWeight().compareTo(a2.getWeight()));
```
### Runnable로 코드 블록 실행하기

각각의 스레드는 다른 코드를 실행할 수 있다. 자바에서는 Runnable 인터페이스를 이용해서 실행할 코드 블록을 지정할 수 있다. 
```java
    // java.lang.Runnable
    public interface Runnable {
    	public void run();
    }
```

Runnable을 이용해서 다양한 동작을 스레드로 실행할 수 있다. 
```java
    Thread t = new Tread(new Runnable() {
    	public void run() {
    		System.out.println("Hello world");
    	}
    });
```
람다 표현식으로는 다음처럼 간경하게 코드를 구현할 수 있다. 
```java
    Thread t = new Thread(() -> System.out.println("Hello world"));
```
## 요약

- 동작 파라미터화에서드 메서드 내부적으로 다양한 동작을 수행할 수 있도록 코드를 메서드 인수로 전달한다.
- 동작 파라미터화를 이용하면 변화하는 요구사항에 더 잘 대응할 수 있는 코드를 구현할 수 있으며 나중에 엔지니어링 비용을 줄일 수 있다.
- 코드 전달 기법을 이용하면 동작을 메서드의 인수로 전달할 수 있다. 하지만 자바 8 이전에는 코드를 지저분하게 구현해야 했다. 익명 클래스로도 어느 정도 코드를 깔끔하게 만들 수 있지만 자바 8에서는 인터페이스를 상속받아 여러 클래스를 구현해야 하는 수고를 없앨 수 있는 방법을 제공한다.
- 자바 API의 많은 메서드는 정렬, 스레드, GUI 처리 등을 포함한 다양한 동작으로 파라미터화할 수 있다.

#