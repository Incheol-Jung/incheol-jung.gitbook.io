---
layout:     post
title:      "4장 스트림 소개"
date:       2020-03-10 00:00:00
categories: java
summary:    4장 스트림 소개
---

> 자바 8 인 액션 4장을 요약한 내용 입니다.

대부분 모든 자바 애플리케이션은 컬렉션을 만들고 처리하는 과정을 포함한다. 

이전에는 SQL 질의어는 우리가 기대하는 것이 무엇인지 직접 표현할 수 있었다. 즉, SQL에서는 질의를 어떻게 구현해야 할지 명시할 필요가 없으며 구현은 자동으로 제공된다. 

> 많은 요소를 포함하는 커다란 컬렉션은 어떻게 처리해야 할까?

성능을 높이려면 멀티코어 아키텍처를 활용해서 병렬로 컬렉션의 요소를 처리해야 한다. 하지만 병렬 처리 코드를 구현하는 것은 단순 반복 처리 코드에 비해 복잡하고 어렵다. 게다가 복잡한 코드는 디버깅도 어렵다!

# 스트림이란 무엇인가?

스트림은 데이터 컬렉션 반복을 멋지게 처리하는 기능이다. 또한 스트림을 이용하면 멀티 스레드 직접 코드를 구현하지 않아도 데이터를 투명하게 병렬로 처리할 수 있다. 

    List<Dish> lowCaloricDishes = new ArrayList<>();
    for(Dish d: menu) {
    	**if(d.getCalories() < 400) {
    		lowCaloricDishes.add(d);
    	}
    }
    
    Collections.sort(lowCaloricDishes, new Comparator<Dish>() {
    	public int compare(Dish d1, Dish d2) {
    		return Integer.compare(d1.getCalories(), d2.getCalories());
    	}
    });
    
    List<String> lowCaloricDishesName = new ArrayList<>();
    for(Dish d: lowCaloricDishes) {
    	lowCaloricDishesName.add(d.getName());
    }

위 코드에서는 lowCaloricDishes라는 '가비지 변수'가 사용 되었다. 즉, lowCaloricDishes는 컨테이너 역할만 하는 중간 변수다. 자바 8에서는 이러한 세부 구현은 라이브러리 내에서 모두 처리한다. 

    List<String> lowCaloricDishesName = menu.stream()
    																					.filter(d -> d.getCalories() < 400)
    																					.sorted(comparing(Dishes::getCalories))
    																					.map(Dish::getName)
    																					.collect(toList());

stream()을 parallelStream()으로 바꾸면 이 코드를 멀티코어 아키텍처에서 병렬로 실행할 수 있다. 

    List<String> lowCaloricDishesName = menu.parallelStream()
    																					.filter(d -> d.getCalories() < 400)
    																					.sorted(comparing(Dishes::getCalories))
    																					.map(Dish::getName)
    																					.collect(toList());

그렇다면 우리는 궁금증이 생길 수 있다!

- parallelStream을 호출 했을 때 정확히 어떤 일이 일어날까?
- 얼마나 많은 스레드가 사용되는 걸까?
- 얼마나 성능이 좋을까?

이에 대한 해답은 천천히 살펴보기로 하자

우선 스트림을 사용하여 얻는 이점은 무엇이 있을까?

- 선언형으로 코드를 구현할 수 있다. 즉, 루프와 if 조건문 등의 제어 블록을 사용해서 어떻게 동작을 구현할지 지정할 필요 없이 ' 저칼로리의 요리만 선택하라' 같은 동작의 수행을 지정할 수 있다.
- 위의 코드에서와 같이 filter, sorted, map, collect 같은 여러 빌딩 블록 연산을 연결해서 복잡한 데이터 처리 파이프라인을 만들 수 있다.

![https://s3-us-west-2.amazonaws.com/secure.notion-static.com/d7237912-43a9-46fc-a38b-8c40f7b53ce9/Untitled.png](https://s3-us-west-2.amazonaws.com/secure.notion-static.com/d7237912-43a9-46fc-a38b-8c40f7b53ce9/Untitled.png)

자바 8의 스트림 API의 특징을 다음처럼 요약할 수 있다. 

- 선언형 : 더 간결하고 가독성이 좋아진다.
- 조립할 수 있음 : 유연성이 좋아진다.
- 병렬화 : 성능이 좋아진다.

# 스트림 시작하기

> 스트림이란 정확히 뭘까?

스트림이란 '데이터 처리 연산을 지원하도록 소스에서 추출된 연속된 요소'로 정의할 수 있다. 

- 연속된 요소

    컬렉션과 마찬가지로 스트림은 특정 요소 형식으로 이루어진 연속된 값 집합의 인터페이스를 제공한다. 컬렉션의 주제는 데이터이고 스트림의 주제는 계산이다. 추후 이 차이에 대해 더 살펴보겠다. 

- 소스
스트림은 컬렉션, 배열, I/O 자원 등의 데이터 제공 소스로부터 데이터를 소비(consume)한다.
- 데이터 처리 연산
스트림 연산은 순차적으로 또는 병렬로 실행할 수 있다.

> 스트림은 다음과 같은 두 가지 중요한 특징을 갖는다.

- 파이프라이닝
연산 파이프라인은 데이터 소스에 적용하는 데이터베이스 질의와 비슷하다.
- 내부 반복
반복자를 이용해서 명시적으로 반복하는 컬렉션과 달리 스트림은 내부 반복을 지원한다.

# 스트림과 컬렉션

이제 컬렉션과 스트림의 차이를 살펴보자

> 데이터를 언제 계산하느냐가 컬렉션과 스트림의 가장 큰 차이라고 할 수 있다.

- 컬렉션은 현재 자료구조가 포함하는 모든 값을 메모리에 저장하는 자료구조다.
- 스트림은 이론적으로 요청할 때만 요소를 계산하는 고전된 자료구조다.
또한 스트림은 사용자가 데이터를 요청할 때만 값을 계산한다.

> 외부 반복과 내부 반복

컬렉션 인터페이스를 사용하려면 사용자가 직접 요소를 반복해야 한다. 

반면 스트림 라이브러리는 내부 반복을 사용한다. 따라서 함수에 어떤 작업을 수행 할 지만 지정하면 모든 것이 알아서 처리된다. 

    List<String> names = new ArrayList<>();
    for(Dish d:menu) {
    	names.add(d.getName());
    }

    List<String> names = menu.stream()
    													.map(Dish::getName)
    													.collect(toList());

### 외부 반복보다 내부 반복이 더 좋은 이유는 무엇일까?

스트림 라이브러리의 내부 반복은 데이터 표현과 하드웨어를 활용한 병렬성 구현을 자동으로 선택한다.

반면 for-each를 이용하는 외부 반복에서는 병렬성을 스스로 관리해야 한다.  

병렬성을 스스로 관리한다는 것은 병렬성을 포기하든지 아니면 synchronized로 시작하는 힘들고 긴 전쟁을 시작함을 의미한다. 

# 스트림 연산

스트림 인터페이스의 연산을 크게 두 가지(중간 연산, 최종 연산)로 구분할 수 있다. 

    List<String> names = menu.stream()
    													.filter(d -> d.getCalories() > 300) // 중간 연산
    													.map(Dish::getName) // 중간 연산
    													.limit(3) // 중간 연산
    													.collect(toList()); // 최종 연산

- 중간 연산

    중간 연산의 중요한 특징은 단말 연산을 스트림 파이프라인에 실행하기 전까지는 아무 연산도 수행하지 않는다. 즉 게으르다(lazy)는 것이다. 

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

        filtering pork
        mapping pork
        filtering beef
        mapping beef
        filtering chicken
        mapping chicken

    스트림의 게으른 특성 덕분에 몇 가지 최적화 효과를 얻을 수 있었다. 

    - 300 칼로리가 넘는 요리는 여러 개지만 오직 처음 3개만 선택되었다. 이는 limit 연산 그리고 쇼트서킷이라 불리는 기법 덕분이다.
    - filter와 map은 서로 다른 연산이지만 한 과정으로 병합되었다.( 이 기법을 루프 퓨전이라고 한다.)

    쇼트 서킷 :
    루프 퓨전 :

- 최종 연산

    최종 연산은 스트림 파이프라인에서 결과를 도출한다. 

    보통 최종 연산에 의해 List, Integer, void 등 스트림 이외의 결과가 반환된다. 

[중간 연산](https://www.notion.so/0005229638ae4b648a52916f62deaa89)

[최종 연산](https://www.notion.so/f5e9b5df5496429c85bc835098ce1ad1)

## 요약

- 스트림은 소스에서 추출된 연속 요소로, 데이터 처리 연산을 지원한다.
- 스트림은 내부 반복을 지원한다. 내부 반복은 filter, map, sorted 등의 연산으로 반복을 추상화한다.
- 스트림에는 중간 연산과 최종 연산이 있다.
- filter와 map처럼 스트림을 반환 하면서 다른 연산과 연결될 수 있는 연산을 중간 연산 이라고 한다. 중간 연산을 이용해서 파이프라인을 구성할 수 있지만 중간 연산으로는 어떤 결과도 생성할 수 없다.
- forEach나 count처럼 스트림 파이프라인을 처리해서 스트림이 아닌 결과를 반환하는 연산을 최종 연산이라고 한다.
- 스트림의 요소는 요청할 때만 계산된다.

[예제 코드](https://www.notion.so/e300ef0c11cf4767bf246f64a6cf37c2)    	List<T> result = new ArrayList<>();
    	for(T e: list) {
    		if(p.test(e)) {
    			result.add(e);
    		}
    	}
    	return result;
    }	

이제 바나나, 오렌지, 정수, 문자열 등의 리스트에 필터 메서드를 사용할 수 있다. 

    List<Apple> redApples = filter(inventory, (Apple apple) -> "red".equals(apple.getColor()));
    List<String> evenNumbers = filter(numbers, (Integer i) -> i % 2 == 0);

## 실전 예제

### Comparator로 정렬하기

자바 8 List에는 sort 메서드가 포함되어 있다(물론 Collections.sort도 존재한다). 다음과 같은 인터페이스를 갖는 java.util.Comparator 객체를 이용해서 sort의 동작을 파라미터화할 수 있다. 

    // java.util.Comparator
    public interface Comparator<T> {
    	public int compare(T o1, T o2);
    }

Comparator를 구현해서 sort 메서드의 동작을 다양화할 수 있다. 

    inventory.sort(new Comparator<Apple>() {
    	public int compare(Apple a1, Apple a2) {
    		return a1.getWeight().compareTo(a2.getWeight());
    	}
    });kjh

실제 정렬 세부사항은 추상화되어 있으므로 신경 쓸 필요가 없다. 람다 표현식을 이용하면 다음처럼 단간하게 코드를 구현할 수 있다. 

    inventory.sort((Apple a1, Apple a2) -> a1.getWeight().compareTo(a2.getWeight()));

### Runnable로 코드 블록 실행하기

각각의 스레드는 다른 코드를 실행할 수 있다. 자바에서는 Runnable 인터페이스를 이용해서 실행할 코드 블록을 지정할 수 있다. 

    // java.lang.Runnable
    public interface Runnable {
    	public void run();
    }

Runnable을 이용해서 다양한 동작을 스레드로 실행할 수 있다. 

    Thread t = new Tread(new Runnable() {
    	public void run() {
    		System.out.println("Hello world");
    	}
    });

람다 표현식으로는 다음처럼 간경하게 코드를 구현할 수 있다. 

    Thread t = new Thread(() -> System.out.println("Hello world"));

## 요약

- 동작 파라미터화에서드 메서드 내부적으로 다양한 동작을 수행할 수 있도록 코드를 메서드 인수로 전달한다.
- 동작 파라미터화를 이용하면 변화하는 요구사항에 더 잘 대응할 수 있는 코드를 구현할 수 있으며 나중에 엔지니어링 비용을 줄일 수 있다.
- 코드 전달 기법을 이용하면 동작을 메서드의 인수로 전달할 수 있다. 하지만 자바 8 이전에는 코드를 지저분하게 구현해야 했다. 익명 클래스로도 어느 정도 코드를 깔끔하게 만들 수 있지만 자바 8에서는 인터페이스를 상속받아 여러 클래스를 구현해야 하는 수고를 없앨 수 있는 방법을 제공한다.
- 자바 API의 많은 메서드는 정렬, 스레드, GUI 처리 등을 포함한 다양한 동작으로 파라미터화할 수 있다.

#