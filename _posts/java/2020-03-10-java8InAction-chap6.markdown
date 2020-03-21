---
layout:     post
title:      "6장 스트림으로 데이터 수집"
date:       2020-03-10 00:00:00
categories: java
summary:    6장 스트림으로 데이터 수집
---

> 자바 8 인 액션 6장을 요약한 내용 입니다.

# 스트림에 대해서 다시 한번 정리해보자

자바 8의 스트림이란 데이터 집합을 멋지게 처리하는 게으른 반복자라고 생각할 수 있다. 

중간 연산 : 

- 스트림을 다른 스트림으로 변환하는 연산으로서, 여러 연산을 연결할 수 있다.
- 스트림 파이프라인을 구성하며 스트림의 요소를 소비하지 않는다.
- filter 또는 map

최종 연산 : 

- 스트림의 요소를 소비해서 최종 결과를 도출한다.
- count, findfirst, forEach, reduce

    Map<Currenct, List<Transaction>> transactionByCurrencies = new HashMap<>();
    
    for(Transaction transaction : transactions) {
    	Currency currency = transaction.getCurrency();
    	List<Transaction> transactionForCurrency = transactionByCurrencies.get(currency);
    	if(transactionForCurrency == null) {
    		transactionForCurrencies = new ArrayList<>();
    		transactionForCurrencies.put(currency, transactionsForCurrency);
    	}
    	transactionForCurrency.add(transaction);
    }
    
    return transactionForCurrency;

어렵게 구현은 했는데 이해하기 어려운 코드가 되어버렸다. 

'통화별로 트랜잭션 리스트를 그룹화하시오'라고 간단히 표현할 수 있지만 코드가 무엇을 실행하는지 한눈에 파악하기 어렵다. 

    Map<Currency, List<Transaction>> transactionByCurrencies = 
    	transactions.stream().collect(groupingBy(transaction::getCurrency));

Stream에 toList를 사용하는 대신 더 범용적인 컬렉터 파라미터를 collect 메서드에 전달함으로써 원하는 연산을 간결하게 구현할 수 있음을 지금부터 배우게 될 것이다. 

# 컬렉터란 무엇인가?

함수형 프로그래밍에서는 '무엇'을 원하는지 직접 명시할 수 있어서 어떤 방법으로 이를 얻을지는 신경 쓸 필요가 없다. 

Collector 인터페이스 구현은 스트림의 요소를 어떤 식으로 도출할지 지정한다. 

명령형 코드에서는 문제를 해결하는 과정에서 다중 루프와 조건문을 추가하며 가독성과 유지보수성이 크게 떨어진다. 

### 고급 리듀싱 기능을 수행하는 컬렉터

훌륭하게 설계된 함수형 API의 또 다른 장점으로 높은 수준의 조합성과 재사용성을 꼽을 수 있다. collect로 결과를 수집하는 과정을 간단하면서도 유연한 방식으로 정의할 수 있다는 점이 컬렉터의 최대 강점이다. 

### 미리 정의된 컬렉터

Collectors에서 제공하는 메서드의 기능은 크게 세 가지로 구분할 수 있다. 

- 스트림 요소를 하나의 값으로 리듀스하고 요약
- 요소 그룹화
- 요소 분할

# 리듀싱과 요약

이전예제에서 배웠듯이 컬렉터(Stream.collect 메서드의 인수)로 스트림의 항목을 컬렉션으로 재구성할 수 있다.  좀 더 일반적으로 말해 컬렉터로 스트림의 모든 항목을 하나의 결과로 합칠수 있다. 

### 스트림값에서 최댓갑과 최솟값 검색

메뉴에서 칼로리가 가장 높은 요리를 찾는다고 가정하자

    Comparator<Dish> dishCaloriesComparator = Comparator.comaringInt(Dish::getCalories);
    OPtional<Dish> mostCalorieDish = menu.stream().collect(max(dishCaloriesComparator));

스트림에 있는 객체의 숫자 필드의 합계나 평균 등을 반환하는 연산에도 리듀싱 기능이 자주 사용된다. 이러한 연산을 요약(summarization)연산이라 부른다. 

### 요약 연산

Collectors 클래스는 Collectors.summingInt라는 특별한 요약 팩토리 메서드를 제공한다. 

    int totalCalories = menu.stream().collect(summingInt(Dish::getCalroeis));

summingInt는 객체를 int로 매핑하여 누적 합계를 계산해준다. 마찬가지로 int뿐 아니라 long이나 double에 대응하는 summaringLong, summarizingDouble 메서드와 관련된 LongSummaryStatistics, DoubleSummaryStatistics 클래스도 있다. 

LongSummaryStatistics, DoubleSummaryStatistics 함수가 제공하는 기능은 어떤게 있을까?

### 문자열 연결

컬렉터에 joining 팩토리 메서드를 이용하면 스트림의 각 객체에 toString 메서드를 호출해서 추출한 모든 문자열을 하나의 문자열로 연결해서 반환한다. 

    String shortMenu = menu.stream().map(Dish::getName).collect(joinging());
    String shortMenu = menu.stream().map(Dish::getName).collect(joinging(", ")); // ,로 구분해줄수 있다. 

joining 메서드는 내부적으로 내부적으로 StringBuilder를 이용해서 문자열을 하나로 만든다. 

### 범용 리듀싱 요약 연산

지금까지 살펴본 모든 컬렉터는 reducing 팩토리 메서드로도 정의할 수 있다. 그럼에도 이전 예제에서 범용 팩토리 메서드 대신 특화된 컬렉터를 사용한 이유는 프로그래밍적 편의성 때문이다. (하지만 프로그래머의 편의성 뿐만 아니라 가독성도 중요하다는 사실을 기억하자)

    int totalCalories = menu.stream().collect(reducing(0, Dish::getCalories, (i, j) -> i + j));

reducing은 세 개의 인수를 받는다. 

- 첫 번째 인수는 리듀싱 연산의 시작값이거나 스트림에 인수가 없을 때는 반환값이다.
- 두 번째 인수는 요리를 칼로리 정수 변환할 때 사용한 변환 함수다
- 세 번째 인수는 같은 종류의 두 항목을 하나의 값으로 더하는 BinaryOperator다.

### collect vs reduce

- collect 메서드는 결과를 누적하는 컨테이너를 변경하도록 설계된 메서드
- reduce 메서드는 두 값을 하나로 도출하는 불변형 연산하는 메서드

### 컬렉션 프레임워크 유연성: 같은 연산도 다양한 방식으로 수행할 수 있다!

    // 1. reduce 메소드만 사용
    int totalCalories = menu.stream().collect(reducing(0, Dish::getCalories, Integer::sum));
    
    // 2. Optional<int> 사용
    int totalCalories = menu.stream().map(Dish::getCalories).reduce(Integer::sum).get();
    
    // 3. intStream 사용
    int totalCalories = menu.stream().mapToInt(Dish::getCalories).sum();

위의 코드는 totalCalories를 구하는 예제로 결과값은 동일하지만 각각의 특성을 고려하여 사용해보자

1. reduce만 사용해서 값을 구할 수 있다. 
2. map을 사용하여 Optional을 사용해서 예외 처리를 할 수 있다. orElse, orElseGet 등을 사용할 수 있다. 
3. intStream으로 autoboxing을 내부적으로 하지 사용하지 않고 합계를 구할 수 있다. 

지금까지 살펴본 예제는 함수형 프로그래밍에서는 하나의 연산을 다양한 방법으로 해결할 수 있음을 보여준다. 

또한 스트림 인터페이스에서 직접 제공하는 메서드를 이용하는 것에 비해 컬렉터를 이용하는 코드가 더 복잡하다는 사실도 보여준다. 코드가 좀 더 복잡한 대신 재사용성과 커스터마이즈 가능성을 제공하는 높은 수준의 추상화와 일반화를 얻을 수 있다. 

## 그룹화

데이터 집합을 하나 이상의 특성으로 분류해서 그룹화하는 연산도 데이터베이스에서 많이 수행되는 작업이다. 

    public enum CaloricLevel { DIET, NORMAL, FAT }
    
    Map<CaloricLevel, List<Dish>> dishesByCaloricLevel = menu.stream().collect(
    																						groupingBy(dish -> {
    																							if (dish.getCalories() <= 400) {
    																								return CaloricLevel.DIET;
    																							} else if (dish.getCalories() <= 700) {
    																								return CaloricLevel.NORMAL;
    																							} else {
    																								return CaloricLevel.FAT ;
    																							}
    																						}));

위와 같이 그룹화 연산의 결과로 그룹화 함수가 반환하는 키 그리고 각 키에 대응하는 스트림의 모든 항목 리스트를 값으로 갖는 맵이 반환된다. 

### 다수준 그룹화

두 인수를 받는 팩토리 메서드 Collectors.groupingBy를 이용해서 항목을 다수준으로 그룹화 할 수 있다. 

    Map<Dish.Type, Map<CaloricLevel, List<Dish>>> dishesByTypeCaloricLevel = 
    																					menu.stream().collect(
    																						groupingBy(Dish::getType, 
    																							groupingBy(dish -> {
    																								if (dish.getCalories() <= 400) {
    																									return CaloricLevel.DIET;
    																								} else if (dish.getCalories() <= 700) {
    																									return CaloricLevel.NORMAL;
    																								} else {
    																									return CaloricLevel.FAT ;
    																								}
    																							})));
    
    // 결과값
    {
    	MEAT={DIET=[chicken], NORMAL=[beef], FAT=[pork]},
    	FISH={DIET=[prawns], NORMAL=[salmon]},
    	OTHER={DIET=[rice, seasonal fruit], NORMAL=[french fries, pizza]}
    }

### 서브그룹으로 데이터 수집

groupingBy로 넘겨주는 컬렉터의 형식은 제한이 없다. 

요리 종류별 갯수를 구해보자

    Map<Dish.Type, Long> typesCount = menu.strea().collect(
    																				groupingBy(Dish::getType, counting()));
    
    // 결과값
    {MEAT=3, FISH=2, OTHER=4}

요리의 종류별로 가장 높은 칼로리를 가진 요리를 찾아보자

    Map<Dish.Type, Optional<Dish>> mostCaloricByType = menu.stream().collect(
    																				groupingBy(
    																						Dish::getType,
    																						maxBy(comparingInt(Dish::getCalories))));
    
    // 결과값
    {FISH= Optional[salmon], OTHER=Optional[pizza], MEAT=Optional[pork]}

### 컬렉터 결과를 다른 형식에 적용하기

마지막 그룹화 연산에서 맵의 모든 값을 Optional로 감쌀 필요가 없으므로 Optional을 삭제할 수 있다. 

    Map<Dish.Type, Optional<Dish>> mostCaloricByType = menu.stream().collect(
    																				groupingBy(
    																					Dish::getType,
    																					collectingAndThen(
    																						maxBy(comparingInt(Dish::getCalories)),
    																					Optional::get));
    
    // 결과값
    {FISH= salmon, OTHER=pizza, MEAT=pork}

팩토리 메서드 collectingAndThen은 적용할 컬렉터와 변환 함수를 인수로 받아 다른 컬렉터를 반환한다. 반환되는 컬렉터는 기존 컬렉터의 래퍼 역활을 하며 collect의 마지막 과정에서 변환함수로 자신이 반환하는 값을 매핑한다. 

그럼 위의 코드가 실제로 어떤 과정을 거치는지 확인해보자

![https://s3-us-west-2.amazonaws.com/secure.notion-static.com/1042bb4e-f5e1-4d9b-9c34-ec79c92a6d84/KakaoTalk_Photo_2020-03-08-11-16-07.jpeg](https://s3-us-west-2.amazonaws.com/secure.notion-static.com/1042bb4e-f5e1-4d9b-9c34-ec79c92a6d84/KakaoTalk_Photo_2020-03-08-11-16-07.jpeg)

- 컬렉터는 점선으로 표시되어 있으며 groupingBy는 가장 바깥쪽에 위치하면서 요리의 종류에 따라 메뉴 스트림을 세 개의 서브스트림으로 그룹화한다.
- groupingBy 컬렉터는 collectingAndThen 컬렉터를 감싼다. 따라서 두 번째 컬렉터는 그룹화된 세 개의 서브스트림에 적용된다.
- collectingAndThen 컬렉터는 세 번째 컬렉터 maxBy를 감싼다
- 리듀싱 컬렉터가 서브스트림에 연산을 수행한 결과에 collectingAndthen의 Optional::get 변환 함수가 적용된다.
- groupingBy 컬렉터가 반환하는 맵의 분류 키에 대응하는 세 값이 각각의 요리 형식에서 가장 높은 칼로리다.

### groupingBy와 함께 사용하는 다른 컬렉터 예제

일반적으로 스트림에서 같은 그룹으로 분류된 모든 요소에 리듀싱 작업을 수행할 때는 팩토리 메서드 groupingBy에 두 번째 인수로 전달한 컬렉터를 사용한다. 

모든 요리의 칼로리 합계를 구하려고 만든 컬렉터를 재사용할 수 있다. 

    Map<Dish.Type, Integer> totalCaloriesByType= menu.stream().collect(
    																				groupingBy(Dish::getType,
    																					summingInt(Dish::getCalories)));

mapping 메서드는 스트림의 인수를 변환하는 함수와 변환 함수의 결과 객체를 누적하는 컬렉터를 인수로 받는다. mapping은 입력 요소를 누적하기 전에 매핑 함수를 적용해서 다양한 형식의 객체를 주어진 형식의 컬렉터에 맞게 변환하는 역할을 한다. 

    Map<Dish.Type, Set<CaloricLevel>> dishesByTypeCaloricLevel = 
    																					menu.stream().collect(
    																						groupingBy(Dish::getType, 
    																							mapping(dish -> {
    																								if (dish.getCalories() <= 400) {
    																									return CaloricLevel.DIET;
    																								} else if (dish.getCalories() <= 700) {
    																									return CaloricLevel.NORMAL;
    																								} else {
    																									return CaloricLevel.FAT ;
    																								}
    																							},
    																						toSet())));
    
    // 결과값
    {
    	MEAT={DIET, NORMAL, FAT},
    	FISH={DIET, NORMAL},
    	OTHER={DIET, NORMAL}
    }

mapping 메서드에 전달한 변환 함수는 Dish를 CaloricLevel로 매핑한다. 그리고 CaloricLevel 결과 스트림은 (toList와 비슷한) toSet 컬렉터로 전달되면서 리스트가 아닌 집합으로 스트림의 요소가 누적된다(따라서 중복된 값은 저장되지 않는다)

### 분할

분할은 분할 함수라 불리는 Predicate를 분류 함수로 사용하는 특수한 그룹화 기능이다. 분할 함수는 Boolean을 반환하므로 맵의 키 형식은 Boolean이다. 결과적으로 그룹화 맵은 최대(참 아니면 거짓의 값을 갖는) 두 개의 그룹으로 분류된다. 

    Map<Boolean, List<Dish> partitionedMenu = menu.stream().collect(
    																			partitioningBy(Dish::isVegetarian));
    
    // 결과값
    {
    	false = [pork, beef, chicken, prawns, salmon],
    	true = [french fries, rice, season fruit, pizza]
    }
    
    partitionedMenu.get(true);
    
    // 결과값
    [french fries, rice, season fruit, pizza]
    
    List<Dish> vegeterianDishes = menu.stream()
    													.filter(Dish::isVegetarian)
    													.collect(toList());
    
    // 결과값
    [french fries, rice, season fruit, pizza]

### 분할의 장점

분할 함수가 반환하는 참, 거짓 두 가지 요소의 스트림 리스트를 모두 유지한다는 것이 분할의 장점이다. 다음 코드에서 보여주는 것처럼 컬렉터를 두 번째 인수로 전달할 수 있는 오버로드된 버전의 partitioningBy 메서드도 있다. 

    Map<Boolean, Map<Dish.Type,List<Dish>>> vegetarianDishesByType = 
    																						menu.stream().collect(
    																							partitioningBy(Dish::isVegetarian,
    																								groupingBy(Dish::getType)));
    
    // 결과값
    {
    	false = {FISH=[prawns, salmon], MEAT=[pork, beef, chicken]},
    	true = {OTHER=[french fries, rice, season fruit, pizza]}
    }

[Collectors 클래스의 정적 팩토리 메서드](https://www.notion.so/daabf2ec466a4c90a890698b75565288)

## 요약

- collect는 스트림의 요소를 요약 결과로 누적하는 다양한(컬렉터라 불리는)을 인수로 갖는 최종 연산이다.
- 스트림의 요소를 하나의 값으로 리듀스하고 요약하는 컬렉터뿐 아니라 최솟값, 최댓값, 평균값을 계산하는 컬렉터 등이 미리 정의되어 있다.
- 미리 정의된 컬렉터인 groupingBy로 스트림의 요소를 그룹화하거나, partitioningBy로 스트림의 요소를 분할할 수 있다.
- 컬렉터는 다수준의 그룹화, 분할, 리듀싱 연산에 적합하게 설계되어 있다.
- Collector 인터페이스에 정의된 메서드를 구현해서 커스텀 컬렉터를 개발할 수 있다.    	List<T> result = new ArrayList<>();
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