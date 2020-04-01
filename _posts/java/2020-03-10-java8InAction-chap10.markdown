---
layout: reference
title:      "10장 null 대신 Optional"
date:       2020-03-10 00:00:00
categories: java
summary:    자바 8 인 액션 10장을 요약한 내용 입니다.
navigation_weight: 10
---

> 자바 8 인 액션 10장을 요약한 내용 입니다.

`NullPointerException`은 초급자, 중급자, 남녀노소를 불문하고 모든 자바 개발자를 괴롭히는 예외이다. 

토니 호어라는 영국 컴퓨터과학자가 처음 null 레퍼런스를 도입하였다. 그 당시에는 null 레퍼런스 및 예외로 값이 없는 상황을 가장 단순하게 구현할 수 있다고 판단했고 결과적으로 null 및 관련 예외가 탄생했다. 호어는 억만 달러짜리 실수라고 했지만 50년이라는 null 레퍼런스의 역사에 비추어볼 때 null로 인한 실질적인 피해비용은 이보다 클 수 있다. 

## 값이 없는 상황을 어떻게 처리할까?

다음 코드에서는 어떤 문제가 발생할까?

    public String getCarInsuranceName(Person person) {
    	return person.getCar().getInsurance().getName();
    }

코드에서 자동차를 소유하지 않은 사람이라면 어떻게 될까? 또는 자동차는 소유하고 있지만 보험을 보유하고 있지 않다면? 이렇듯 여러 방면에서 `NullPointerException이 발생할 가능성`을 가지고 있다. 

## 보수적인 자세로 NullPointerException 줄이기

예기치 않은 NullPointerException을 피하려면 어떻게 해야 할까? 대부분의 프로그래머는 필요한 곳에 다양한 null 확인 코드를 추가해서 null 예외 문제를 해결하여 할 것이다. 

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

이와 같은 반복 패턴 코드를 '`깊은 의심`'이라고 부른다. 이를 반복하다 보면 `코드의 구조가 엉망이 되고 가독성도 떨어진다.` 따라서 뭔가 다른 해결 방법이 필요하다. 

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

위 코드는 조금 다른 방법으로 `중첩 if 블록을 없앴다.` 그러나 null일 때 반환되는 기본값 'Unknown'이 세 곳에서 반복되고 있는데 같은 문자열을 반복하면서 오타 등의 실수가 생길 수 있다. 

## null 때문에 발생하는 문제

자바에서 null 레퍼런스를 사용하면서 발생할 수 있는 `이론적, 실용적 문제`를 확인하자. 

- 에러의 근원이다 : NullPointerException은 자바에서 가장 흔히 발생하는 에러다
- 코드를 어지럽힌다 : null 확인 코드를 추가해야 하므로 `과도한 체크 로직`으로 가독성이 떨어진다.
- 아무 의미가 없다 : 정적 형식 언어에서 값이 없음을 표현하는 방법으로는 적절하지 않다.
- 자바 철학에 위배된다
- 형식 시스템에 구멍을 만든다

## Optional 클래스 소개

Optional은 `선택형값을 캡슐화하는 클래스다.` 값이 있으면 Optional 클래스는 값을 감싼다. 반면 값이 없으면 Optional.empty 메서드로 Optional을 반환한다. 의미상으론 둘이 비슷하지만 실제로는 차이점이 많다. null을 참조하려 하면 NullPointerException이 발생하지만 `Optional.empty()는 Optional 객체이므로 이를 다양한 방식으로 활용할 수 있다.` 

## Optional 적용 패턴

- 빈 Optional

    Optional.empty로 빈 Optional 객체를 얻을 수 있다. 

        Optional<Car> optCar = Optional.empty();

- null이 아닌 값으로 Optional 만들기

        Optional<Car> optCar = Optional.of(car);

    이제 car가 null이라면 즉시 NullPointerException이 발생한다(Optional을 사용하지 않았다면 car의 프로퍼티에 접근하려 할 때 에러가 발생했을 것이다. )

- null값으로 Optional 만들기

        Optional<Car> optCar = Optional.ofNullable(car);

    car가 null이면 빈 Optional 객체가 반환된다. 

`그런데 Optional이 비어있으면 get을 호출했을 때 예외가 발생한다.` 즉, Optional을 잘못 사용하면 결국 null을 사용했을 때와 같은 문제를 겪을 수 있다. 따라서 Optional로 명시적인 검사를 제거할 수 있는 방법을 확인해야 한다. 

## 맵으로 Optional의 값을 추출하고 변환하기

보통 객체의 정보를 추출할 때는 Optional을 사용할 때가 많다. 

    String name = null;
    if(insurance != null) {
    	name = insurance.getName();
    }

이런 유형의 패턴에 사용할 수 있도록 Optional은 map 메서드를 지원한다. 

    Optional<Insurance> optInsurance = Optional.ofNullable(insurance);
    Optional<String> name = optInsurance.map(Insurance::getName);

`Optional이 값을 포함하면 map의 인수로 제공된 함수가 값을 바꾼다.` optional이 비어 있으면 아무 일도 일어나지 않는다. 

## flatMap으로 Optional 객체 연결

    Optional<Person> optPerson = Optional.of(person);
    Optional<String> name = optPerson.map(Person::getCar)
    																	.map(Car::getInsurance)
    																	.map(Insurance::getName);

`안타깝게도 위 코드는 컴파일되지 않는다.` 변수 optPeople의 형식은 Optional<People>이므로 map 메서드를 호출할 수 있다. 하지만 그 다음 연산은 Optional<Optional<car>> 형식의 객체이므로 getInsurance 메서드를 지원하지 않는다. 

스트림의 `flatMap`은 함수를 인수로 받아서 다른 스트림을 반환하는 메서드다. 즉  flatMap은 인수로 받은 함수를 적용해서 생성된 각각의 스트림에서 콘텐츠만 남기게 되므로 위와 같은 이슈를 해결할 수 있다. 

    Optional<Person> optPerson = Optional.of(person);
    Optional<String> name = optPerson.flatMap(Person::getCar)
    																	.flatMap(Car::getInsurance)
    																	.map(Insurance::getName)
    																	.orElse("Unknown");

## 디폴트 액션과 Optional 언랩

Optional 클래스는 Optional 인스턴스에서 값을 읽을 수 있는 다양한 인스턴스 메서드를 제공한다. 

- get() : 래핑된 값이 있으면 해당 값을 반환하고 값이 없으면 NoSuchElementException을 발생시킨다.
- orElse(T other) : Optional이 값을 포함하지 않을 때 디폴트값을 제공할 수 있다.
- orElseGet(Supplier<? extends T> other) : orElse 메서드에 대응하는 `게으른 버전의 메서드`다. Optional에 값이 없을 때만 Supplier가 실행되기 때문이다.
- orElseThrow(Supplier<? extends T> exceptionSupplier) : Optional이 비어있을때 예외를 발생시킨다는 점에서 get 메서드와 비슷하다
- ifPresent(Consumer<? super T> consumer) : `값이 존재할 때 인수로 넘겨준 동작을 실행할 수 있다.` 값이 없으면 아무 일도 일어나지 않는다.

## 두 Optional 합치기

이제 Person과 Car 정보를 이용해서 가장 저렴한 보럼료를 제공하는 보험회사를 찾는 기능을 구현해보자.

    public Optional<Insurance> nullSafeFindCheapestInsurance(
    														Optional<Person> person, Optional<Car> car) {
    	if (person.isPresent() && car.isPersent()) {
    		return Optional.of(findCheapestInsurance(person.get(), car.get());
    	} else {
    		return Optional.empty();
    	}
    }

안타깝게도 구현 코드는 null 확인 코드와 크게 다른점이 없다. Optional 클래스에서 제공하는 기능을 이용해서 이코드를 더 자연스럽게 개선할 수 없을까?

    public Optional<Insurance> nullSafeFindCheapestInsurance(
    														Optional<Person> person, Optional<Car> car) {
    		return person.flatMap(p -> car.map(c ->findCheapestInsurance(p, c));
    }

첫 번째 Optional에 flatMap을 호출했으므로 첫 번째 Optional이 비어있다면 인수로 전달한 람다 표현식이 실행되지 않고 그대로 빈 Optional을 반환한다. 

## 필터로 특정값 거르기

종종 객체의 메서드를 호출해서 어떤 프로퍼티를 확인해야 할 때가 있다. 예를 들어 보험회사 이름이 "CambridgeInsurance"인지 확인해야 한다고 가정하자

    Insurance insurance = ...;
    if(insurance != null && "CambridgeInsurance".equals(insurance.getName())) {
    	System.out.println("ok");
    }

Optional 객체에 filter 메서드를 이용해서 다음과 같이 코드를 재구현할 수 있다. 

    Optional<Insurance> optInsurance = ...;
    optInsurance.filter(insurance ->
    											"CambridgeInsurance".equals(insurance.getName()))
    											.ifPresent(x -> System.out.println("ok"));

Optional이 비어있다면 filter 연산은 아무동작도 하지 않는다. 

[Optional 클래스의 메서드](https://www.notion.so/f2b595d807914c95b66ad49636e30ece)

## 예외와 Optional

Integer.parseInt(String)은 정적 메서드다. 이 메서드는 문자열을 정수로 바꾸지 못할 때 `NumberFormatException`을 발생시킨다. 즉, 문자열이 숫자가 아니라는 사실을 예외로 알리는 것이다. 기존에 값이 null일 수 있을 때는 if 문으로 null 여부를 확인했지만 예외를 발생시키는 메서드에서는 try/catch 블록을 사용해야 한다는 점이 다르다.

    public static Optional<Integer> stringToInt(String s) {
    	try {
    		return Optional.of(Integer.parseInt(s));
    	} catch (NumberFormatException e) {
    		return Optional.empty();
    	}
    }

기존 자바 메서드 parseInt를 직접 고칠 수는 없지만 다름 코드처럼 parseInt를 감싸는 작은 `유틸리티 메서드`를 구현해서 Optional을 반환할 수 있다. 

## 요약

- 역사적으로 프로그래밍 언어에서는 null 레퍼런스로 값이 없는 상황을 표현해왔다.
- 자바 8에서는 값이 있거나 없음을 표현할 수 있는 클래스 java.util.Optional<T>를 제공한다.
- 팩토리 메서드 Optional.empty, Optional.of, Optional.ofNullable 등을 이용해서 Optional 객체를 만들 수 있다.
- Optional 클래스는 스트림과 비슷한 연산을 수행하는 map, flatMap, filter 등의 메서드를 제공한다.
- Optional로 값이 없는 상황을 적절하게 처리하도록 강제할 수 있다. 즉, Optional로 예상치 못한 null 예외를 방지할 수 있다.
- Optional을 활용하면 더 좋은 API를 설계할 수 있다. 즉, 사용자는 메서드의 시그니처만 보고도 Optional값이 사용되거나 반환되는지 예측할 수 있다.