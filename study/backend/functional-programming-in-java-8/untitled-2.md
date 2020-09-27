---
description: Functional Programming in Java 8의 Chapter 2을 요약한 내용 입니다.
---

# Chap 02. 컬렉션의 사용

## 리스트를 사용한 이터레이션

자바는 기존의 for 루프를 사용하는 방식보다는 좀 더 세련된 구조를 제공한다.

```java
// version 1
for(int i = 0; i < friends.size(); i++) {
  System.out.println(friends.get(i));
}

// version 2
for(String name : friends) {
  System.out.println(name);
}
```

이 구조는 내부적으로 Iterator 인터페이스를 사용하고 hasNext\(\)와 next\(\) 메서드를 호출한다. 두 번째 구조는 첫 번째보다는 덜 형식적이다. 특정 인덱스에서 컬렉션을 수정할 의도가 없다면 첫 번째보다는 나은 방법이다. 그러나 이 두 가지 방법 모두 명령형 프로그래밍 스타일이며 자바8에서는 사용하지 않는 것이 좋다.

* for 루프는 본질적으로 순차적인 방식이라 병렬화하기가 어렵다
* 태스크를 수행하기 위해 컬렉션에서 메서드를 호출하는 대신 for문에 컬렉션을 넘긴다.
* 설계 레벨에서부터 이러한 코드는 '요구하지 말고 설명해봐\(Tell, don't ask\)'라는 원칙을 만족시키지 못한다. 이터레이션의 자세한 구현에 대해서 내부 라이브러리에 맡겨두는 대신 실행되는 특정 이터레이션을 직접 구현해야 한다.

#### 함수형 스타일로 변경해보자.

Iterable 인터페이스는 JDK8에서 forEach\(\)라는 메서드를 제공하여 더 강력해졌다. 이 메서드는 Consumer 타입의 파라미터를 받는다. Consumer 인스턴스는 accept\(\) 메서드를 통해 얻은 자원을 소비하는 기능을 한다.

```java
friends.forEach(new Consumer<String>() {
  public void accept(final String name) {
    System.out.println(name);
  }
});
```

이는 람다 표현식과 새로운 컴파일러의 기능을 통해 쉽게 수정할 수 있다.

```text
friends.forEach((name) -> System.out.println(name));
```

내부 이터레이션 방법을 사용하면, 이터레이션을 제어하기 위해 이터레이션의 실행 순서 혹은 반복되는 횟수 등에 초점을 맞추기보다는 오히려 우리가 각 엘리먼트에서 얻으려고 하는 것, 즉 각 엘리먼트를 사용해서 하고자 하는 목적에 초점을 맞출 수 있다.

여기에 메서드 레퍼런스를 사용하면 좀 더 컴팩트하게 만들수 있을 것 같다.

```java
friends.forEach(System.out::println);
```

## 리스트 변형

자바의 String은 불변성이며, 따라서 스트링의 인스턴스 자체는 수정될 수 없다.

```java
final List<String> uppercaseNames = new ArrayList<String>();
    
for(String name : friends) {
  uppercaseNames.add(name.toUpperCase());
}
```

이를 내부 이터레이터로 변경해도 여전히 빈 리스트가 필요하고 그 리스트에 엘리먼트를 추가하는 작업도 필요하다.

```java
final List<String> uppercaseNames = new ArrayList<String>();
friends.forEach(name -> uppercaseNames.add(name.toUpperCase()));
System.out.println(uppercaseNames);
```

### 람다 표현식의 사용

Stream 인터페이스의 map\(\) 메서드를 사용하면 가변성이 발생하지 않도록 할 수 있으며 코드를 더 간결하게 만들 수 있다.

```java
friends.stream()
   .map(name -> name.toUpperCase())
   .forEach(name -> System.out.print(name + " "));
```

### 메서드 레퍼런스의 사용

자바 컴파일러는 람다 표현식 뿐만 아니라 함수형 인터페이스의 구현이 필요한 코드에 대해 메서드의 레퍼런스를 사용할 수 있다.

```java
friends.stream()
   .map(String::toUpperCase)
   .forEach(name -> System.out.println(name));
```

> 메서드 레퍼런스를 언제 사용해야 하는가?

메서드 퍼런스는 람다 표현식이 짧아서 간단하게 만들거나 인스턴스 메서드 혹은 정적 메서드를 직접 호출하는 경우에 유용하다. 다시 말하면, 람다 표현식을 사용할 때 파라미터를 전달하지 않는 경우라면 메서드 레퍼런스를 사용할 수 있다. 그러나 이 편리함은 파라미터를 인수로 전달하기 전에 파라미터를 처리해야 하거나 혹은 리턴하기 전에 호출의 결과를 사용해야 하는 경우에는 사용할 수 없다.

## 엘리먼트 찾기

이름으로 구성된 리스트에서 문자 N으로 시작하는 엘리먼트를 선택해보자.

```java
// version 1
final List<String> startsWithN = new ArrayList<String>();
for(String name : friends) {
  if(name.startsWith("N")) {
    startsWithN.add(name);
  }
}

// version 2 lambda
final List<String> startsWithN =
    friends.stream()
         .filter(name -> name.startsWith("N"))
         .collect(Collectors.toList());
```

filter 메서드는 boolean 결과를 리턴하는 람다 표현식이 필요하다. 람다 표현식이 true를 리턴하면 엘리먼트는 결과 컬렉션에 추가된다. map\(\)과 달리 filter\(\)가 리턴한 결과 컬렉션의 엘이먼트는 입력 컬렉션에 있는 엘리먼트의 서브셋이다.

## 람다 표현식의 재사용성

람다 표현식은 간결한 것처럼 보이지만 코드 안에서 중복해서 사용하기 쉽다. 중복 사용된 코드는 유지 보수가 어렵고 품질이 떨어지는 코드가 되기 십상이다.

friends, editors, comrades 등의 이름으로 된 몇 개의 컬렉션이 있다고 가정하자. 이 컬렉션들을 특정 이름으로 필터링하려고 한다.

```java
final long countFriendsStartN = 
  friends.stream()
         .filter(name -> name.startsWith("N")).count();

final long countEditorsStartN = 
  editors.stream()
         .filter(name -> name.startsWith("N")).count();

final long countComradesStartN = 
  comrades.stream()
          .filter(name -> name.startsWith("N")).count();
```

다행히도 람다 표현식을 변수에 저장해서 다시 사용할 수 있는 방법이 있다.

```java
final Predicate<String> startsWithN = name -> name.startsWith("N");

final long countFriendsStartN = 
  friends.stream()
         .filter(startsWithN)
         .count();
         
final long countEditorsStartN = 
  editors.stream()
         .filter(startsWithN)
         .count();
         
final long countComradesStartN = 
  comrades.stream()
          .filter(startsWithN)
          .count();
```

람다 표현식을 여러 번 되풀이해서 사용하기보다는 한번 생성해서 Predicate 타입의 startsWithN 이름의 레퍼런스에 저장하는 것이 낫다. 불행하게도 여전히 중복된 코드가 남아 있다. 이에 대해서는 다음에 살펴보자.

## 렉시컬 스코프와 클로저 사용하기

몇몇 개발자 사이에는 람다 표현식을 사용하는 것이 코드를 중복 사용하게 하며 코드의 품질을 떨어뜨린다는 잘못된 생각을 하고 있기도 하다. 이전 예제에서 중복된 코드를 다 해결하진 못하였다. 이를 렉시컬 스코프와 클로저로 해결해보자.

### 렉시컬 스코프로 중복 제거하기

파라미터로 스트링 타입의 letter를 인수로 받는 정적 함수인 checkIfStartWith\(\)를 정의한다. 이 함수는 나중에 사용하기 위해 filter\(\) 메서드로 넘기는 Predicate를 리턴한다.

```java
public static Predicate<String> checkIfStartsWith(final String letter) {
  return name -> name.startsWith(letter);
}
```

checkIfStartsWith\(\)가 리턴하는 Predicate는 지금까지 배운 람다 표현식과는 다르다. name → name.startWith\(letter\)를 리턴하며 이것은 name이 무엇이든 명확하다. 이것이 람다 표현식에 전달되는 파라미터다. 그러나 변수 letter의 범위는 이 어노니머스\(anonymous\) 함수의 범위에 있지 않기 때문에 람다 표현식의 정의에 의해 범위를 정하고 그 범위 안에서 변수 letter를 찾는다.

이것을 렉시컬 스코프라고 한다. 렉시컬 스코프는 사용한 하나의 컨텍스트에서 제공한 값을 캐시해 두었다가 나중에 다른 컨텍스트에서 사용하는 강력한 기술이다.

```java
final long countFriendsStartN =
  friends.stream()
         .filter(checkIfStartsWith("N")).count();
         
final long countFriendsStartB =
  friends.stream()
         .filter(checkIfStartsWith("B")).count();
```

이처럼 checkIfStartsWith\(\)와 같은 고차 함수를 생성하고 렉시컬 스코프를 사용하여 코드에서 중복성을 제거한다.

### 적용 범위를 좁히기 위한 리팩토링

나중에 사용할 각 변수를 미리 저장해두기 위한 목적으로 정적 메서드를 갖는 클래스를 사용하는 것은 그다지 바람직하지 않다. 필요한 곳에만 사용되도록 함수의 범위를 좁게 만드는 것도 좋다. Function 인터페이스를 사용하여 이러한 기능을 만들어보자.

```java
// version 1 : Function 인터페이스를 활용한 메소드 구현
final Function<String, Predicate<String>> startsWithLetter = 
  (String letter) -> {
    Predicate<String> checkStarts = (String name) -> name.startsWith(letter);
    return checkStarts;
};

// version 2 : version 1을 더 간결하게 표현
final Function<String, Predicate<String>> startsWithLetter = 
      (String letter) -> (String name) -> name.startsWith(letter);

// version 3 : version 2을 더 간결하게 표현
final Function<String, Predicate<String>> startsWithLetter = 
      letter -> name -> name.startsWith(letter);
      
// 실제 사용하
long count = list.stream().filter(startsWithLetter.apply("N")).count();
```

이 섹션에서 Function과 Predicate 모두를 사용하는 것이 좋다는 것을 알았지만 이 두가지가 어떻게 다른지 알아보자

* Predicate&lt;T&gt;

  타입 T인 파라미터 하나를 받아 체크한 결과에 대해 알려주기 위해 boolean 결과를 리턴한다.

* Function&lt;T,R&gt;

  타입 T를 파라미터로 갖고 타입 R을 결과로 리턴하는 함수이다.

## 엘리먼트 선택

컬렉션에서 하나의 엘리먼트를 선택하는 것은 여러 엘리먼트를 선택하는 것보다 간단하다는 것은 당연하다. 그러나 몇 가지 복잡한 부분이 있다. 이를 복잡도를 통해 살펴보고 람다 표현식을 사용해 해결해보자.

주어진 문자로 시작하는 엘리먼트를 찾아 출력하는 메서드를 생성하자

```java
public static void pickName(
  final List<String> names, final String startingLetter) {
  String foundName = null;
  for(String name : names) {
    if(name.startsWith(startingLetter)) {
      foundName = name;
      break;
    }
  }
  System.out.print(String.format("A name starting with %s: ", startingLetter));
    
  if(foundName != null) {
    System.out.println(foundName);
  } else {
    System.out.println("No name found");
  }
}
```

#### 이 메서드에는 수정해야 할 부분이 상당히 많다.

* foundName 변수가 null로 초기화되어 있어서 null 체크를 해야 한다.
* 외부 이터레이터를 사용하여 엘리먼트를 찾으면 루프를 빠져나온다.

#### 람다 표현식을 사용해 코드를 개선해보자

```java
public static void pickName(
  final List<String> names, final String startingLetter) {
    
  final Optional<String> foundName = 
    names.stream()
         .filter(name ->name.startsWith(startingLetter))
         .findFirst();
    
  System.out.println(String.format("A name starting with %s: %s",
    startingLetter, foundName.orElse("No name found")));
}
```

코드를 간결하게 만들기 위해 JDK 라이브러리에 있는 몇 가지 기능을 함께 사용했다.

* filter\(\) 메서드를 사용하여 원하는 패턴과 매칭되는 모든 엘리먼트를 가져온다.
* findFirst\(\) 메서드를 사용하면 컬렉션에서 첫 번째 값을 추출한다.
* filter\(\) 에 해당하는 엘리먼트가 없다면 Optional 객체에 null을 담아 리턴할 것이다.

Optional을 더 개선할 수 있을 것 같다. 예를 들어 인스턴스가 없는 경우에 대안되는 값을 제공하기보다는 값이 존재할 때만 Optional이 코드 블록이나 람다 표현식을 실행하는게 명확할 것 같다.

```java
foundName.ifPresent(name -> System.out.println("Hello " + name));
```

## 컬렉션을 하나의 값으로 리듀스

이 섹션에서는 어떻게 엘리먼트들을 비교하고 컬렉션에서 하나의 값으로 연산하는 기술에 대해 알아보자

#### friends 컬렉션에 있는 값들을 살펴보고 문자의 전체 수를 계산해보자

```java
friends.stream()
   .mapToInt(name -> name.length())
   .sum());
```

reduce\(\) 메서드를 사용하여 두 개의 엘리먼트를 서로 비교하고 컬렉션에 남아 있는 엘리먼트와의 비교를 통해 결과를 얻어낼 수 있다.

```java
final Optional<String> aLongName = 
  friends.stream()
         .reduce((name1, name2) -> 
            name1.length() >= name2.length() ? name1 : name2);

aLongName.ifPresent(name ->
  System.out.println(String.format("A longest name: %s", name)));
```

reduce\(\) 메서드는 컬렉션을 이터레이션하면, 첫 번째로 리스트에 있는 처음 두개 엘리먼트를 사용하여 람다 표현식을 호출한다. 람다 표현식의 결과는 다음 호출에서 사용된다. 마지막 호출에 대한 결과는 reduce\(\) 메서드 호출의 전체 결과로 리턴된다.

만약 기본값을 설정하고 싶다면 아래와 같이 작성할 수 있다.

```java
final String steveOrLonger = 
    friends.stream()
           .reduce("Steve", (name1, name2) -> 
              name1.length() >= name2.length() ? name1 : name2);
```

주어진 기준\("steve"\)보다 긴 이름이 있다면, 그 이름이 선택된다. 그렇지 않으면 함수는 준값을 리턴한다.

## 엘리먼트 조인

friends 리스트를 콤마로 분리해서 이름의 리스트를 출력해보자.

```java
for(String name : friends) {
  System.out.print(name + ", ");
}

// result
// Brian, Nate, Neal, Raju, Sara, Scott,
```

하지만 결과물의 맨 끝에 콤마가 출력됐다. 이를 해결하기 위해 조건문을 넣으려고 할 것이다.

```java
for(int i = 0; i < friends.size() - 1; i++) {
  System.out.print(friends.get(i) + ", ");
}

if(friends.size() > 0) 
  System.out.println(friends.get(friends.size() - 1));
```

결과는 나왔지만 코드는 좋아보이지 않는다. 이는 String 클래스의 join\(\) 메소드로 간단히 구현할 수 있다.

```java
System.out.println(String.join(", ", friends));
```

엘리먼트의 리스트를 어떻게 조인하는지 알아보았다. 이제 엘리먼트들을 조인하기 전에 엘리먼트를 변경시킬 수도 있다.

```java
friends.stream()
   .map(String::toUpperCase)
   .collect(joining(", ")));
```

변경된 리스트에서 collect\(\)를 호출해서 그 결과를 joining\(\) 메서드에 의해 리턴된 컬렉터에 제공한다. 이 메서드는 Collectors 유틸리티 클래스에 있는 정적 메서드다.

### 정리

내부 이터레이터를 사용하면 컬렉션을 탐색하고, 불변성을 유지하면서 컬렉션을 변경하고 많은 노력 없이도 컬렉션에 있는 엘리먼트를 선택할 수 있다. 유지보수가 쉬운 코드와 도메인이나 애플리케이션과 관련된 로직에 유용한 코드를 작성할 수 있으며, 기본적인 부분을 처리하기 위한 코드의 양을 줄일 수 있다.

