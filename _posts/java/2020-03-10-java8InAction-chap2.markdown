---
layout: reference
title:      "2장 동작 파라미터화 코드 전달하기"
date:       2020-03-10 00:00:00
categories: java
summary:    자바 8 인 액션 2장을 요약한 내용 입니다.
---

> 자바 8 인 액션 2장을 요약한 내용 입니다.

## 동작 파라미터화

- 아직은 어떻게 실행할 것인지 결정하지 않은 코드 블록을 의미한다.
- 자주 바뀌는 요구사항에 효과적으로 대응할 수 있다.

초기 요구사항은 단순히 녹색 사과만 얻기를 바랬다. 
```java
    public static List<Apple> filterGreenApples(List<Apple> inventory) {
    	List<Apple> result = new  ArrayList<>();
    	for (Apple apple: inventory) {
    		if ("green".equals(apple.getColor()) {
    			result.add(apple);
    		}
    	}
    	return result;
    }
```

그러다 점차 요구사항이 증가하여 사과의 모든 요소에 대한 필터링한 결과값이 필요한 기능이 추가되었다. 
```java
    public static List<Apple> filterApples(List<Apple> inventory, String color, int weight, boolean flag) {
    	List<Apple> result = new  ArrayList<>();
    	for (Apple apple: inventory) {
    		if ((flag && apple.getColor().equals(color)) ||
    					(!flag && apple.getWight() > weight)) { // 색이나 무게에 따라 필터링 한다. 
    			result.add(apple);
    		}
    	}
    	return result;
    }
```

형편없는 코드다! 대체 true와 false는 뭘 의미하는 걸까? 게다가 앞으로 요구사항이 바뀌었을때 유연하게 대응할 수도 없다. 
예를 들어 사과의 크기, 모양, 출하지 등으로 사과를 필터링하고 싶다면 어떻게 될까? 심지어 녹색 사과 중에 무거운 사과를 필터링하고 싶다면? 결국 여러 중복된 필터 메서드를 만들거나 아니면 모든 것을 처리하는 거대한 하나의 필터 메서드를 구현해야 할 것이다. 
```java
    public static List<Apple> filterGreenApples(List<Apple> inventory, ApplePredicate p) {
    	List<Apple> result = new  ArrayList<>();
    	for (Apple apple: inventory) {
    		if (p.test(apple)) {
    			result.add(apple);
    		}
    	}
    	return result;
    }
```
첫 번째 코드에 비해 더 유연한 코드를 얻었으며 동시에 가독성도 좋아졌을 뿐 아니라 사용하기도 쉬워졌다. 이제 필요한 대로 다양한 ApplePredicate를 만들어서 filterApples 메서드로 전달할 수 있다. 
```java
    public class AppleeRedAndHeavyPredicate implements ApplePredicate {
    	public boolean test(Apple apple) {
    		return "red".equals(apple.getColor()) && apple.getWeight() > 150;
    	}
    }

    List<Apple> redAndHeavyApples = fileter(inventory, new AppleRedAndHeavyPredicate());
```
지금까지 살펴본 것처럼 컬렌션 탐색 로직과 각 항목에 적용할 동작을 분리할 수 있다는 것이 동작 파라미터화의 강점이다. 

그러나 요구사항이 복잡해지면서 filterApples 메서드로 새로운 동작을 전달하려면 ApplePredicate 인터페이스를 구현하는 여러 클래스를 정의한 다음에 인스턴스화해야 한다. 이는 상당히 번거로운 일일 것이다. 
```java
    public class AppleHeavyWeightPredicate implements ApplePredicate {
    	public boolean test(Apple apple) {
    		return apple.getWeight() > 150;
    	}
    }
    
    public class AppleGreenColorPredicate implements ApplePredicate {
    	public boolean test(Apple apple) {
    		return "green".equals(apple.getColor());
    	}
    }
    
    public class FilteringApples {
    	public static void main(String[] args) {
    		List<Apple> inventory = Arrays.aslist(new Apple(80,"green"),
    																					new Apple(155, "green"),
    																					new Apple(120, "red"));
    		List<Apple> heavyApples = filterApples(inventory, new AppleHeavyWeightPredicate());
    		List<Apple> greenApples = filterApples(inventory, new AppleGreenColorPredicate ());
    }
```
## 익명 클래스

익명 클래스는 말 그대로 이름이 없는 클래스다. 익명 클래스를 이용하면 클래스 선언과 인스턴스화를 동시에 할 수 있다. 즉, 즉석에서 필요한 구현을 만들어서 사용할 수 있다. 
```java
    List<Apple> greenApples = filterApples(inventory, `new AppleGreenColorPredicate() {`
    	public boolean test(Apple apple) {
    		return "green".equals(apple.getColor());
    	}
    });
```

익명 클래스로도 아직 부족한 점이 있다. 

- 아래 굵은 표시로 표현한 부분에서 알 수 있는 것처럼 익명 클래스는 여전히 많은 공간을 차지한다.
- 많은 프로그래머가 익명 클래스의 사용에 익숙하지 않다.

## 람다 표현식

자바 8의 람다 표현식을 이용해서 이전 예제 코드를 다음처럼 간단하게 재구현할 수 있다. 
```java
    List<Apple> result = filterApples(inventory, (Apple apple) -> "red".equals(apple.getColor));
```

### 추상화

현재 filterApples는 Apple과 관련한 동작만 수행한다. 하지만 Apple 이외의 다양한 물건에서 필터링이 작동하도록 리스트 형식을 추상화할 수 있다. 
```java
    public interface Predicate<T> {
    	boolean test(T t);
    }
    
    public static <T> List<T> filter(List<T> list, predicate<T> p) {
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

    List<Apple> redApples = filter(inventory, (Apple apple) -> "red".equals(apple.getColor()));
    List<String> evenNumbers = filter(numbers, (Integer i) -> i % 2 == 0);

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
