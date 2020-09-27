---
description: Optional에 대한 기능 설명과 예시를 설명해보자
---

# Optional

![https://javadeveloperzone.com/java-8/java-8-new-feature-optional-class/](../../.gitbook/assets/optional.png)

## Optional이 도입 이전 상황

**NullPointerException**은 초급자, 중급자, 남녀노소를 불문하고 모든 자바 개발자를 괴롭히는 예외이다.

토니 호어라는 영국 컴퓨터과학자가 처음 null 레퍼런스를 도입하였다. 그 당시에는 null 레퍼런스 및 예외로 값이 없는 상황을 가장 단순하게 구현할 수 있다고 판단했고 결과적으로 null 및 관련 예외가 탄생했다. 호어는 억만 달러짜리 실수라고 했지만 50년이라는 null 레퍼런스의 역사에 비추어볼 때 null로 인한 실질적인 피해비용은 이보다 클 수 있다.

### 값이 없는 상황을 어떻게 처리할까?

다음 코드에서는 어떤 문제가 발생할까?

```java
public String getCarInsuranceName(Person person) {
	return person.getCar().getInsurance().getName();
}
```

코드에서 자동차를 소유하지 않은 사람이라면 어떻게 될까? 또는 자동차는 소유하고 있지만 보험을 보유하고 있지 않다면? 이렇듯 여러 방면에서 **NullPointerException이 발생할 가능성**을 가지고 있다.

### 보수적인 자세로 NullPointerException 줄이기

예기치 않은 NullPointerException을 피하려면 어떻게 해야 할까? 대부분의 프로그래머는 필요한 곳에 다양한 null 확인 코드를 추가해서 null 예외 문제를 해결하여 할 것이다.

```java
public String getCarInsuranceName(Person person) {
	if (person != null) {
		Car car = person.getCar();
		if (car != null) {
			Insurance insurance = car.getInsurance();
			if (insurance != null) {
				return insurance.getName();
			}
		}
	}
	return "Unknown";
}
```

이와 같은 반복 패턴 코드를 '**깊은 의심**'이라고 부른다. 이를 반복하다 보면 **코드의 구조가 엉망이 되고 가독성도 떨어진다.** 따라서 뭔가 다른 해결 방법이 필요하다.

```java
public String getCarInsuranceName(Person person) {
	if (person != null) {
		return "Unknown";
	}

	Car car = person.getCar();
	if (car != null) {
		return "Unknown";
	}

	Insurance insurance = car.getInsurance();
	if (insurance != null) {
		return "Unknown";
	}
		
	return insurance.getName();
}
```

위 코드는 조금 다른 방법으로 **중첩 if 블록을 없앴다.** 그러나 null일 때 반환되는 기본값 'Unknown'이 세 곳에서 반복되고 있는데 같은 문자열을 반복하면서 오타 등의 실수가 생길 수 있다.

### null 때문에 발생하는 문제

자바에서 null 레퍼런스를 사용하면서 발생할 수 있는 **이론적, 실용적 문제**를 확인하자.

* 에러의 근원이다 : NullPointerException은 자바에서 가장 흔히 발생하는 에러다
* 코드를 어지럽힌다 : null 확인 코드를 추가해야 하므로 **과도한 체크 로직**으로 가독성이 떨어진다.
* 아무 의미가 없다 : 정적 형식 언어에서 값이 없음을 표현하는 방법으로는 적절하지 않다.
* 자바 철학에 위배된다
* 형식 시스템에 구멍을 만든다

## Optional 클래스

Optional은 **선택형값을 캡슐화하는 클래스다.** 값이 있으면 Optional 클래스는 값을 감싼다. 반면 값이 없으면 Optional.empty 메서드로 Optional을 반환한다. 의미상으론 둘이 비슷하지만 실제로는 차이점이 많다. null을 참조하려 하면 NullPointerException이 발생하지만 **Optional.empty\(\)는 Optional 객체이므로 이를 다양한 방식으로 활용할 수 있다.**

## Optional 객체 생성

* Optional.of

  value가 null 일 경우 NPE 예외가 발생한다.

  ```text
  Optional<City> city = Optional.of(city);
  ```

* Optional.ofNullable

  value가 null인 경우 비어있는 Optional을 반환한다.

  ```text
  Optional<City> city = Optional.ofNullable(city);
  ```

* Optional.isEmpty

  비어있는 Optional 객체를 생성한다.

  ```text
  Optional<City> city = Optional.isEmpty();
  ```

## Optional 중간처리

* filter

  predicate 값이 참이면 해당 필터를 통과시키고 거짓이면 비어있는 Optional 객체를 반환한다.

  ```text
  return Optional.ofNullable(address)
                   .filter(a -> a.getStreet().contains("seoul"))
                   .map(Address::getStreet)
                   .orElse("incheol");
  ```

* map

  다른 값으로 변환한다.

  ```text
  return Optional.ofNullable(city)
                   .map(City::getAddress)
                   .map(Address::getZipcode)
                   .map(Zipcode::getCode)
                   .orElse("incheol");
  ```

* flatMap

  map과 동일하지만 변환된 값을 Optional로 감싸주는게 차이다. \(&lt;Optional&lt;Optional&lt;&gt;&gt;\)

  ```text
  return Optional.ofNullable(city)
                   .flatMap(City::getAddress)
                   .flatMap(Address::getZipcode)
                   .flatMap(Zipcode::getCode)
                   .orElse("incheol");
  ```

## Optional 종단처리

* ifPresent

  값이 null이 아니라면 실행한다.

  ```text
  City city = new City("seoul");
  Optional.ofNullable(city).ifPresent(i -> System.out.println(i.getName()));
  ```

* isPresent

  값이 null 인지 아닌지 여부만 확인한다.

  ```text
  if(Optional.ofNullable(city).isPresent()){
  	System.out.println(i.getName())
  }
  ```

* get

  Optional 실제 값을 리턴한다. 없으면 예외가 발생한다.

  ```text
  City city = Optional.ofNullable(city).get()
  ```

* orElse

  Optional 객체가 비어있다면 리턴할 값을 정해준다. \(무조건 함수를 실행함으로 실행시에 문제가 발생할 수 있는 연산은 피해야 한다\)

  ```text
  return Optional.ofNullable(city)
                   .map(City::getName)
                   .orElse(printTest());
  ```

* orElseGet

  Optional 객체가 비어있다면 리턴한 공급자 함수\(Supplier\)를 정의할 수 있다. \(비어있을 경우에만 실행됨\)

  ```text
  return Optional.ofNullable(city)
              .map(City::getName)
              .orElseGet(() -> printTest());
  ```

* orElseThrow

  Optional 객체가 비어있다면 사용자가 정의한 예외를 발생시킨다.

  ```text
  return Optional.ofNullable(city)
                   .map(City::getName)
                   .orElseThrow(Exception::new);
  ```

## JAVA 9 에서 추가된 Optional API

* or

  orElseGet과 유사하지만 중간에 우선 순위에 따라 설정하고 싶을 경우 사용할 수 있다.

  ```text
  Address notEmptyAddress = new Address("seongnam");
  Address notEmptyAddress2 = new Address("daegue");

  // 리턴값 : seongnam
  return Optional.ofNullable(address)
                   .filter(a -> a.getStreet().contains("seoul"))
  							   .or(Optional::empty)
                   .or(() -> Optional.ofNullable(notEmptyAddress))
                   .or(() -> Optional.ofNullable(notEmptyAddress2));

  // 리턴값 : daegue
  return Optional.ofNullable(address)
                 .filter(a -> a.getStreet().contains("seoul"))
                 .or(() -> Optional.ofNullable(notEmptyAddress2))
                 .or(() -> Optional.ofNullable(notEmptyAddress));
  ```

* ifPresentOrElse

  ifPresent와 유사하지만 값이 비어있을 경우와 비어있지 않을 경우 모두를 한번에 정의할 수 있다.

  ```text
  // 메서드 시그니처
  public void ifPresentOrElse(Consumer<? super T> action, Runnable emptyAction);
  // 예제
  Optional.ofNullable("test")
      .ifPresentOrElse(value -> System.out.println(value), () -> System.out.println("null")); // print 'test'
  Optional.ofNullable(null)
      .ifPresentOrElse(value -> System.out.println(value), () -> System.out.println("null")); // print 'null'
  ```

* stream

  옵셔널 객체를 스트림 객체로 바로 사용할 수 있다.

  ```text
  // 메서드 시그니처
  public Stream<T> stream();
  // 예제
  List<String> result = List.of(1, 2, 3, 4)
      .stream()
      .map(val -> val % 2 == 0 ? Optional.of(val) : Optional.empty())
      .flatMap(Optional::stream)
      .map(String::valueOf)
      .collect(Collectors.toList());
  System.out.println(result); // print '[2, 4]'
  ```

## JAVA 10 에서 추가된 Optional API

* orElseThrow

  매개변수가 필요없는 예외 메서드가 추가되었다.

  ```text
  // 메서드 시그니처
  public T orElseThrow();
  // 예제 (자바 8)
  Optional.ofNullable(something).orElseThrow(NoSuchElementException::new);
  // 예제 (자바 10)
  Optional.ofNullable(something).orElseThrow();
  ```

## 주의 사항

Optional을 사용하면 여러가지 상황에서 발생할 수 있는 NPE를 줄일 수 있다. 그러나 Optional은 만능 솔루션이 아니다. Optional을 잘 못 사용하면 자칫 성능이 안좋거나 가독성이 좋지 않은 반대의 상황을 직면할 수 있다. 그렇다면 어떤 경우를 주의해야 하는지 살펴보자

* ifPresent\(\), get\(\)을 함께 사용하는 것 보단 orElse\(\), orElseGet\(\), orElseThrow\(\)를 사용하라
  * 성능엔 이슈는 없지만 가독성 측면에서 역효과가 나타난다.
* orElse\(\) 대신 orElseGet\(\)을 사용하라
  * orElse는 조건을 충족하지 않아도 무조건 수행되므로 자칫 불필요한 로직이 수행될 수 있다.
* Optional을 필드로 사용 하지 말아라
  * Optional을 사용하면 직렬화가 구현되어 있지 않아 직렬화를 사용할 수 없다.
* Optional을 컬렉션의 원소로 사용하지 말아라
  * 이미 컬렉션에는 getOrDefault\(\), putIfAbsent\(\), computeIfPresnt\(\) 등 null 체크에 대한 메소드를 제공해주므로 굳이 Optional을 변환하여 원소로 사용할 필요가 없다.
* of\(\), orNullable\(\)을 혼동 하지 말자
  * of\(\)는 null이 아님을 보장하고, null 이면 NPE가 발생한다.
  * ofNummable\(\)은 null일 수도 있어서 NPE는 발생하지 않는다.

## 참고

* [http://homoefficio.github.io/2019/10/03/Java-Optional-바르게-쓰기/](http://homoefficio.github.io/2019/10/03/Java-Optional-%EB%B0%94%EB%A5%B4%EA%B2%8C-%EC%93%B0%EA%B8%B0/)
* [https://jdm.kr/blog/234](https://jdm.kr/blog/234)
* [https://incheol-jung.gitbook.io/docs/study/backend/java-8-in-action/2020-03-10-java8inaction-chap10](https://incheol-jung.gitbook.io/docs/study/backend/java-8-in-action/2020-03-10-java8inaction-chap10)

