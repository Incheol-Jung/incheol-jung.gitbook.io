---
layout: reference
title: 5장 스트림 활용
date: '2020-03-10T00:00:00.000Z'
categories: java
summary: 자바 8 인 액션 5장을 요약한 내용 입니다.
navigation_weight: 5
description: 자바 8 인 액션 5장을 요약한 내용 입니다.
---

# 5장 스트림 활용

## 필터링과 슬라이싱

filter 메서드는 predicate를 인수로 받아서 predicate와 일치하는 모든 요소를 포함하는 스트림을 반환한다.

* 스트림은 고유 요소로 이루어진 스트림을 반환하는 distinct라는 메서드도 지원한다.
* 스트림은 주어진 사이즈 이하의 크기를 갖는 새로운 스트림을 반환하는 limit 메서드를 지원한다.
* 스트림은 처음 n개 요소를 제외한 스트림을 반환하는 skip 메서드를 지원한다.

  ```java
  // 300칼로리 이상의 처음 두 요리를 건너띈 다음에 300칼로리가 넘는 나머지 요리를 반환한다. 
  List<Dish> dishes = menu.stream()
    .filter(d -> d.getCalories() > 300)
    .skip(2)
    .collect(toList());
  ```

  **매핑**

스트림은 함수를 인수로 받는 map 메서드를 지원한다. 인수로 제공된 함수는 각 요소에 적용되며 함수를 적용한 결과가 새로운 요소로 매핑된다.

```java
List<Integer> dishNameLengths = menu.stream()
    .map(Dish::getName)
    .map(String::length)
    .collect(toList());
```

매서드 map을 이용해서 리스트의 각 단어의 고유 문자로 이루어진 리스트를 반환해보자.

```java
words.stream()
    .map(word -> word.split(""))
    .distinct()
    .collect(toList());
```

위 코드에서 map으로 전달한 람다는 각 단어의 String\[\]을 반환한다는 점이 문제다. 따라서 map 메서드가 반환한 스트림의 형식은 Stream 이다.

```java
List<String> uniqueCharacters = words.stream()
    .map(w -> w.split(""))
    .flatMap(Arrays::stream)
    .distinct()
    .collect(Collectors.toList());
```

flatMap은 스트림의 각 값을 다른 스트림으로 만든 다음에 모든 스트림을 하나의 스트림으로 연결하는 기능을 수행한다.

## 검색과 매칭

스트림에서 적어도 한 요소와 일치하는지 확인할 때 anyMatch 메서드를 이용한다.

```java
if(menu.stream().anyMatch(Dish::isVegetarian)) {
    System.out.println("The menu is (somewhat) vegetarian friendly!!");
}
```

allMatch 메서드는 anyMatch와 달리 스트림의 모든 요소가 주어진 Predicate와 일치하는지 검사한다.

```java
boolean isHealthy = menu.stream().allmatch(d -> d.getCalories() < 1000);
```

noneMatch는 allMatch와 반대 연산을 수행한다.

```java
boolean isHealthy = menu.stream().noneMatch(d -> d.getCalories() > 1000);
```

표현식에서 하나라도 거짓이라는 결과가 나오면 나머지 표현식의 결과와 상관없이 전체 결과도 거짓이 된다. 이러한 상황을 `쇼트서킷`이라고 부른다. allMatch, noneMatch, findFirst, findAny 등의 연산은 모든 스트림의 요소를 처리하지 않고도 결과를 반환할 수 있다. 또는 원하는 요소를 찾았으면 즉시 결과를 반환할 수 있다. 특히 무한한 요소를 가진 스트림을 유한한 크기로 줄일 수 있는 유용한 연산이다.

findAny 메서드는 현재 스트림에서 임의의 요소를 반환한다.

```java
Optional<Dish> dish = menu.stream()
    .filter(Dish::isVegetarian)
    .findAny();
```

`findFirst`와 `findAny`는 언제 사용하나?? 사용의 차이 유무는 병렬성 때문이다. 병렬 실행에서는 첫 번째 요소를 찾기 어렵다. 따라서 요소의 반환 순서가 상관없다면 병렬 스트림에서는 제약이 적은 findAny를 사용한다.

## Optional이란?

Optional 클래스는 값의 존재나 부재 여부를 표현하는 컨테이너 클래스다. null은 쉽게 에러를 일으킬 수 있으므로 자바 8 라이브러리 설계자는 Optional라는 기능을 만들었다. 일단 Optional은 값이 존재하는지 확인하고 값이 없을 때 어떻게 처리할 것인지 강제하는 기능을 제공한다는 사실만 알아 두자.

* isPresent\(\)는 Optional이 값을 포함하면 true를 반환하고 값을 포함하지 않으면 false를 반환한다.
* ifPresent\(Consumer block\)은 값이 있으면 주어진 블록을 실행한다. Consumer 함수형 인터페이스에는 T 형식의 인수를 받으며 void를 반환하는 람다를 전달할 수 있다.
* T get\(\)은 값이 존재하면 값을 반환하고, 값이 없으면 NoSuchElementException을 일으킨다.
* T orElse\(T other\)는 값이 있으면 값을 반환하고, 값이 없으면 기본값을 반환한다.

  ```java
  menu.stream()
    .filter(Dish::isVegetarian)
    .findAny()
    .ifPresent(d -> System.out.println(d.getName()); 
  // 값이 있으면 출력되고, 값이 없으면 아무 일도 일어나지 않는다.
  ```

  **리듀싱**

리듀싱 연산이란 모든 스트림 요소를 처리해서 값으로 도출하는 연산이다.

numbers의 각 요소의 합계를 구하려고 할때, 외부 반복을 사용하면 어떻게 구현해야 할까?

```java
int sum = 0;
for (int x : numbers) {
    sum += x;
}
```

위의 코드를 reduce를 이용해서 다음처럼 스트림의 모든 요소를 더할 수 있다.

```java
int sum = numbers.stream().reduce(0, (a, b) -> a + b);
int product = numbers.stream().reduce(1, (a, b) -> a * b);
```

초기값을 받지 않도록 오버로드된 reduce도 있다. 그러나 이 reduce는 Optional 객체를 반환한다.

```java
Optional<Integer> sum = numbers.stream().reduce((a, b) -> a + b);
```

최댓값과 최솟값을 찾을 때도 reduce를 활용할 수 있다.

```java
Optional<Integer> max = numbers.stream().reduce(a, b) -> a < b);
Optional<Integer> max = numbers.stream().reduce(Integer::max);
```

[중간 연산과 최종 연산](https://www.notion.so/8802562f484b4632b48fc203ce14bdae)

## 실전 연습

### 2011년에 일어난 모든 트랜잭션을 찾아서 값을 오름차순으로 정렬하시오

```java
List<Transaction> tr2011 = treansactions.stream()
    .filter(transaction -> transaction.getYear() == 2011)
    .sorted(comparting(Transaction::getValue))
    .collect(toList());
```

### 거래자가 근무하는 모든 도시를 중복 없이 나열하시오

```java
transactions.stream()
    .map(transaction -> transaction.getTrader().getCity())
    .distinct()
    .collect(toList());
```

### 케임브리지에서 근무하는 모든 거래자를 찾아서 이름순으로 정렬하시오

```java
transactions.stream()
    //.map(Transaction::gettrader)
    .filter(trader -> Transaction::gettrader.getCity().equals("Cambridge"))
    .distinct()
    .sorted(comparing(Trader::getName))
    .collect(toList());
```

### 모든 거래자의 이름을 알파벳순으로 정렬해서 반환하시오

```java
transactions.stream()
    .map(transaction -> transaction.getTrader().getName())
    .distinct()
    .sorted()
    .reduce("", (n1, n1) -> n1 + n2);
```

### 밀란에 거래자가 있는지?

```java
transactions.stream()
.anyMatch(transaction -> transaction.getTrader()
                                .getCity()
                                .equals("Milan"));
```

### 케임브리지에 거주하는 거래자의 모든 트랜잭션값을 출력하시오

```java
transactions.stream()
    .filter(t -> "Cambridge".equals(t.getTrader().getCity())
    .map(Transaction::getValue)
    .forEach(System.out::println);
```

### 전체 트랜잭션 중 최댓값/최솟값은 얼마인가?

```java
    // 최대값 
    transactions.stream()
                            .map(Transaction::getValue)
                            .reduce(Integer::max);

    // 최소값
    transactions.stream()
                            .min((t1, t2) -> t1.getVlaue() < t2.getValue() ? t1 : t2);
```

## 숫자형 스트림

이전의 소스코드에서 reduce 메서드로 스트림 요소의 합을 구하는 예제를 살펴봤다.

```java
    menu.stream()
            .map(Dish::getCalories)
            .reduce(0, Integer::sum);
```

사실 위 코드에는 박싱 비용이 숨어있다. 내부적으로 합계를 계산하기 전에 Integer를 기본형으로 언박싱해야 한다. 다행히도 스트림 API 숫자 스트림을 효율적으로 처리할 수 있도록 기본형 특화 스트림\(primitive stream speciailzation\)을 제공한다.

```java
    menu.stream()
            .mapToInt(Dish::getCalories) // IntStream 반환
            .sum();
```

mapToInt 메서드는 각 요리에서 모든 칼로리\(Integer 형식\)을 추출한 다음에 IntStream을 반환한다. 따라서 IntStream 인터페이스에서 제공하는 sum 메서드를 이용해서 칼로리 합계를 계산할 수 있다. \(스트림이 비어있으면 sum은 기본값 0을 반환한다.\)

### 객체 스트림으로 복원하기

```java
    IntStream intStream = menu.stream().mapToInt(Dish::getCalories);
    Stream(Integer> stream = intStream.boxed(); // 숫자 스트림을 일반 스트림으로 변환도 가능하다
```

### 기본값: OptionalInt

스트림을 특화 스트림으로 변환할 때는 mapToInt, mapToDouble, mapToLong 세 가지 메서드를 가장 많이 사용한다.

```java
    OptionalInt maxCalories =    menu.stream()
                                                                .mapToInt(Dish::getCalories)
                                                                .max();

    int max = maxCalories.orElse(1); // 값이 없을 때 기본 최댓값을 명시적으로 설정
```

합계 예제에서는 0이라는 기본값이 있었으므로 별 문제가 없었다. 하지만 IntStream에서 최댓값을 찾을 때는 0이라는 기본값 때문에 잘못된 결과가 도출될 수 있다. 그럴 경우 Optional을 사용하여 최댓값이 없는 상황에 사용할 기본값을 명시적으로 정의할 수 있다.

### 숫자 범위

```java
    IntStream evenNumbers = IntStream.rangeClosed(1, 100)
                                                                        .filter(x -> x % 2 == 0); // 1부터 100까지의 짝수 스트림
```

rangedClosed를 이용해서 1부터 100까지의 숫자를 만들 수도 있다. rangedClosed는 시작과 끝을 포함하고 range는 포함하지 않는다.

## 스트림 만들기

다양한 방식으로 스트림을 만들 수 있다.

### 값으로 스트림 만들기

```java
    Stream<String> stream = Stream.of("Java 8", "Lambdas", "In", "Action")
    stream.map(String::toUpperCase).forEach(System.out::println);
```

### 배열로 스트림 만들기

```java
    int[] numbers = {2, 3, 4, 5, 6}
    int sum = Arrays.stream(numbers).sum();
```

## 무한 스트림

스트림 API는 함수에서 스트림을 만들 수 있는 두 개의 정적 메서드 Stream.iterate와 Stream.getnerate를 제공한다. iterate와 generate에서 만든 스트림은 요청할 때마다 주어진 함수를 이용해서 값을 만든다. 따라서 무제한으로 값을 계산할 수 있어서 보통 무한한 값을 출력하지 않도록 limit\(n\)함수를 함께 연결해서 사용한다.

### Iterate

```java
    Stream.iterate(0, n -> n + 2)
                .limit(10)
                .forEach(System.out::println); // 0, 2, 4, 6, 8, 10, 12, 14, 16, 18, 20
```

### Generate

iterate와 비슷하게 generate도 요구할 때 값을 계산하는 무한 스트림을 만들 수 있다. 하지만 iterate와 달리 generate는 생산된 각 값을 연속적으로 계산하지 않는다.

```java
    Stream.getnerate(Math::random)
                .limit(5)
                .forEach(System.out::println);
```

## 요약

* 스트림 API를 이용하면 복잡한 데이터 처리 질의를 표현할 수 있다.
* filter, distinct, skip, limit 메서드로 스트림을 필터링하거나 자를 수 있다.
* map, flatMap 메서드로 스트림의 요소를 추출하거나 변환할 수 있다.
* findFirst, findAny 메서드로 스트림의 요소를 검색할 수 있다. allMatch, nonMatch, anyMatch 메서드를 이용해서 주어진 Predicate와 일치하는 요소를 스트림에서 검색할 수 있다.
* 이들 메서드는 쇼트서킷\(short-circuit\), 즉 결과를 찾는 즉시 반환하며, 전체 스트림을 처리하지는 않는다.
* reduce 메서드로 스트림의 모든 요소를 반복 조함하며 값을 도출할 수 있다. 예를 들어 reduce로 스트림의 최댓값이나 모든 요소의 합계를 계산할 수 있다.
* filter, map 등은 상태를 저장하지 않는 상태 없는 연산이다. reduce 같은 연산은 값을 계산하는 데 필요한 상태를 저장한다. sorted, distinct 등의 메서드는 새로운 스트림을 반환하기에 앞서 스트림의 모든 요소를 버퍼에 저장해야 한다. 이런 메서드를 상태 있는 연산이라고 부른다.
* IntStream, DoubleStream, LongStreeam은 기본형 특화 스트림이다. 이들 연산은 각각의 기본형에 맞게 특화되어 있다.
* 컬렉션뿐 아니라 값, 배열, 파일, iterate와 generate 같은 메서드로도 스트림을 만들 수 있다.
* 크기가 정해지지 않은 스트림을 뭏산 스트림이라고 한다.

