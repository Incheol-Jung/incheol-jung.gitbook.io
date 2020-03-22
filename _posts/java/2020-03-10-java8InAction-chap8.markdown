---
layout:     post
title:      "8장 리팩토링, 테스팅, 디버깅"
date:       2020-03-10 00:00:00
categories: java
summary:    8장 리팩토링, 테스팅, 디버깅
---

> 자바 8 인 액션 8장을 요약한 내용 입니다.

## 코드 가독성 개선

자바 8에서는 코드 가독성에 도움을 주는 다음과 같은 기능을 새롭게 제공한다. 

- 코드의 장황함을 줄여서 쉽게 이해할 수 있는 코드를 구현할 수 있다.
- 메서드 레퍼런스와 스트림 API를 이용해서 코드의 의도를 쉽게 표현할 수 있다.

## 익명 클래스를 람다 표현식으로 리팩토링하기

익명 클래스를 람다 표현식으로 리팩토링하는 이유가 뭘까?

익명 클래스가 얼마나 코드를 장황하게 만들고 쉽게 에러를 일으키는지 이해하였다. 이런 문제를 람다 표현식을 이용해서 간결하고 가독성이 좋은 코드를 구현할 수 있었다. 
```java
    // 익명 클래스를 사용한 이전 코드
    Runnable r1 = new Runnable() {
    	public void run() {
    		System.out.println("Hello");
    	}
    };
    
    // 람다 표현식을 사용한 최신 코드
    Runnable r2 = () -> System.out.println("Hello");
```
하지만 모든 익명 클래스를 람다 표현식으로 변환할 수 있는 것은 아니다. 

- 익명 클래스에서 사용한 this와 super는 람다 표현식에서 다른 의미를 갖는다. 익명 클래스에서 this는 익명 클래스 자신을 가리키지만 람다에서 this는 람다를 감싸는 클래스를 가리킨다.
- 익명 클래스는 감싸고 있는 클래스의 변수를 가릴 수 있다. 하지만 람다 표현식으로는 변수를 가릴 수 없다.
```java
    int a = 10;
    Runnable r1 = () -> {
    	int a = 2; // 컴파일 에러!!!!
    	System.out.println("Hello");
    };
    
    Runnable r2 = new Runnable() {
    	public void run() {
    		int a = 2;
    		System.out.println("Hello");
    	}
    };
```
- 익명 클래스를 람다 표현식으로 바꾸면 콘텍스트 오버로딩에 따른 모호함이 초래 될 수 있다.
```java
    익명 클래스는 인스턴스화할 때 명시적으로 형식이 정해지는 반면 람다의 형식은 콘텍스트에 따라 달라지기 때문이다. 아래 코드에서는 Task라는 Runnable과 같은 시그니처를 갖는 함수형 인터페이스를 선언한다. 

        interface Task {
        	public void execute();
        }
        
        public static void doSomething(Runnable r){ r.run(); }
        public static void doSomething(Task a){ a.execute(); }
        
        // Task를 구현하는 익명 클래스를 전달할 수 있다. 
        doSomething(new Testttt() {
        	public void execute() {
        		System.out.println("Danger danger!!");
        	}
        });
        
        // 람다 표현식으로는 어떤 인터페이스를 사용하는지 알 수 없다. 
        doSomeThing(() -> System.out.println("Danger danger!!"));
        
        // 명시적 형변환을 이용해서 모호함을 제거할 수 있다. 
        doSomeThing((Task)() -> System.out.println("Danger danger!!"));

    넥빈즈와 IntelliJ 등을 포함한 대부분의 통합 개발환경에서 제공하는 리팩토링 기능을 이용하면 이와 같은 문제가 자동으로 해결된다. 
```
## 람다 표현식을 메서드 레퍼런스로 리팩토링하기

람다 표현식 대신 메서드 레퍼런스를 이용하면 가독성을 높일 수 있다. 메서드 레퍼런스의 메서드명으로 코드의 의도를 명확하게 알릴 수 있기 때문이다. 

칼로리에 따른 레벨 그룹을 구해보자
```java
    Map<CaloricLevel, List<Dish>> dishedByCaloricLevel = 
    	menu.stream()
    			.collect(
    				groupingBy(dish -> {
    					if (dish.getCalories() <= 400) return CaloricLevel.DIET;
    					else if (dish.getCalories() <= 700) return CaloricLevel.NORMAL;				
    					else return CaloricLevel.FAT;
    	}));
    
    
    Map<CaloricLevel, List<Dish>> dishedByCaloricLevel = 
    	menu.stream()
    			.collect(
    				groupingBy(dish::getCaloricLevel));
```
또한 comparing과 maxBy 같은 정적 헬퍼 메서드를 활용하는 것도 좋다. 
```java
    inventory.sort(
    	(Apple a1, Apple a2) -> a1.getWeight().compareTo(a2.getWeight())); // 비교 구현에 신경써야 한다. 
    
    inventory.sort(comparing(Apple::getWeight)); // 코드가 문제 자체를 설명한다. 
```
sum, maximum 등 자주 사용하는 리듀싱 연산은 메서드 레퍼런스와 함께 사용할 수 있는 내장 헬퍼 메서드를 제공한다. 

## 명령형 데이터 처리를 스트림으로 리팩토링하기

스트림은 쇼트서킷과 게으름이라는 강력한 최적화뿐 아니라 멀티코어 아키텍처를 활용할 수 있는 지름길을 제공한다. 

하지만 명령형 코드의 break, continue, return 등의 제어 흐름문을 모두 분석해서 같은 기능을 수행하는 스트림 연산으로 유추해야 하므로 명령형 코드를 스트림 API로 바꾸는 것은 쉬운 일이 아니다. 

람다 표현식을 이용하려면 함수형 인터페이스가 필요하다. 따라서 함수형 인터페이스를 코드에 추가해야 한다. 이번에는 조건부 연기 실행과 실행 어라운드 즉 두 가지 자주 사용하는 패턴으로 람다 표현식 리팩토링을 살펴본다. 

다음은 내장 자바 Logger 클래스를 사용하는 예제다. 
```java
    // 조건이 참일 경우에만 로그 메시지를 작성하도록 함
    if (logger.isLoggable(Log.FINER)) {
    	logger.finer("Problem: " + generateDiagnostic());
    }
```
log 메서드는 logger의 수준이 적절하게 설정되어 있을 때만 인수로 넘겨진 람다를 내부적으로 실행한다. 다음은 log 메서드의 내부 구현 코드다. 
```java
    public void log(Level level, Supplier<String> msgSupplier){
    	if(logger.isLoggable(level)){
    		log(level, msgSupplier.get()); // 람다 실행
    	}
    }
    
    
    Logger.log(Level.FINER, () -> "Problem: " + generateDiagnostic());
```
이 기법으로 어떤 문제를 해결할 수 있을까? 

만일 클라이언트 코드에서 객체 상태를 자주 확인하거나 객체의 일부 메서드를 호출하는 상황이라면 내부적으로 객체의 상태를 확인한 다음에 메서드를 호출하도록 새로운 메서드를 구현하는 것이 좋다. 그러면 코드 가독성이 좋아질 뿐 아니라 캡슐화도 강화된다. 

매번 같은 준비, 종료 과정을 반복적으로 수행하는 코드가 있다면 이를 람다로 변환할 수 있다. 준비, 종료 과정을 처리하는 로직을 재사용함으로써 코드 중복을 줄일 수 있다. 

## 람다로 객체지향 디자인 패턴 리팩토링하기

디자인 패턴은 공통적인 소프트웨어 문제를 설계할 때 재사용할 수 있는 검증된 청사진을 제공한다. 람다를 이용하면 이전에 디자인 패턴으로 해결하던 문제를 더 쉽고 간단하게 해결할 수 있다. 또한 람다 표현식으로 기존의 많은 객체지향 디자인 패턴을 제거하거나 간결하게 재구현할 수 있다. 

### 전략 패턴

전략 패턴은 한 유형의 알고리즘을 보유한 상태에서 런타임에 적절한 알고리즘을 선택하는 기법이다. 다양한 기준을 갖는 입력값을 검증하거나, 다양한 파싱 방법을 사용하거나, 입력 형식을 설정하는 등 다양한 시나리오에 전략 패턴을 활용할 수 있다. 

전략 패턴은 세 부분으로 구성된다. 

- 알고리즘을 나타내는 인터페이스
- 다양한 알고리즘을 나타내는 한 개 이상의 인터페이스 구현 클래스
- 전략 객체를 사용하는 한 개 이상의 클라이언트

텍스트 입력이 다양한 조건에 맞게 포맷되어 있는지 검증한다고 가정하자
```java
    public interface ValidationStrategy {
    	boolean execute(String s);
    }

    public class IsAllLowerCase implements ValidationStrategy {
    	public boolean execute(String s) {
    		return s.matches("[a-z]+");
    	}
    }
    
    public class IsNumeric implements ValidationStrategy {
    	public boolean execute(String s) {
    		return s.matches("\\d+");
    	}
    }

    public class Validator {
    	private final ValidationStrategy strategy;
    	public Validator(ValidationStrategy strategy) {
    		this.strategy = strategy;
    	}
    	
    	public boolean validate(String s) {
    		return this.strategy.execute(s);
    	}
    }

    Validator numericValidator = new Validator(new IsNumeric());
    boolean b1 = numericValidator.validate("aaaa"); // false
    
    Validator lowerCaseValidator = new Validator(new IsAllLowerCase());
    boolean b2 = lowerCaseValidator.validate("bbbb"); // true
```
람다 표현식 사용하기
```java
    Validator numericValidator = 
    		new Validator((String s) -> s.matches("[a-z]+"));
    boolean b1 = numericValidator.validate("aaaa"); // false
    
    Validator lowerCaseValidator = 
    		new Validator((String s) -> s.matches("\\d+"));
    boolean b2 = lowerCaseValidator.validate("bbbb"); // true
```
위 코드에서 확인할 수 있듯이 람다 표현식을 이용하면 전략 디자인 패턴에서 발생하는 자잘한 코드를 제거할 수 있다. 

### 템플릿 메서드 패턴

템플릿 메서드 패턴이란 알고리즘의 개요를 제시한 다음에 알고리즘의 일부를 고칠 수 있는 유연함을 제공해야 할 때 템플릿 메서드 디자인 패턴을 사용한다. 다시 말해 '이 알고리즘을 사용하고 싶은데 그대로는 안 되고 조금 고쳐야 하는'상황에 적합하다. 

다음은 온라인 뱅킹 애플리케이션의 동작을 정의하는 추상 클래스다. 
```java
    abstract class OnlineBanking {
    	public void processCustomer(int id) {
    		Customer c = Database.getCustomerWithId(id);
    		makeCustomerHappy(c);
    	}
    
    	abstract void makeCustomerHappy(Customer c);
    }
```
각각의 지점은 OnlineBanking 클래스를 상속받아 makeCustomerHappy 메서드가 원하는 동작을 수행하도록 구현할 수 있다. 

람다 표현식 사용하기
```java
    public class OnlineBankingLamda {
    	public void processCustomer(int id, Consumer<Customer> makeCustomerHappy) {
    		Customer c = Database.getCustomerWithId(id);
    		makeCustomerHappy.accept(c);
    	}
    }
    
    new OnlineBankingLamda().processCustomer(1337, (Customer c) -> 
    	System.out/println("Hello "+ c.getName());
```
### 옵저버 패턴

어떤 이벤트가 발생했을 때 한 객체(주제subject)가 다른 객체 리스트(옵저버)에 자동으로 알림을 보내야 하는 상황에서 옵저버 디자인 패턴을 사용한다. 예를 들어 주식의 가격 변동에 반응하는 다수의 거래자 예제에서도 옵저버 패턴을 사용할 수 있다. 
```java
    interface Observer {
    	void notify(String tweet);
    }

    // 트윗에 포함된 다양한 키워드에 다른 동작을 수행할 수 있는 여러 옵저버를 정의할 수 있다. 
    class NYTimes implements Observer {
    	public void notify(String tweet) {
    		if(tweet != null && tweet.contains("money")) {
    			System.out.println("Breaking news in NY! " + tweet);
    		}
    	}
    }
    
    class Guardian implements Observer {
    	public void notify(String tweet) {
    		if(tweet != null && tweet.contains("queen")) {
    			System.out.println("Yet another new in London... " + tweet);
    		}
    	}
    }
    
    class LeMonde implements Observer {
    	public void notify(String tweet) {
    		if(tweet != null && tweet.contains("wine")) {
    			System.out.println("Today cheese, wine and news! " + tweet);
    		}
    	}
    }

    // Subject 인터페이스의 정의다. 
    interface Subject { 
    	void registerObserver(Observer o);
    	void notifyObservers(String tweet);
    }
    

    class Feed implements Subject {
    	private final List<Observer> observers = new ArrayList<>();
    
    	// 새로운 옵저를 등록한다. 
    	public void registerObserver(Observer o) {
    		this.observers.add(o);
    	}
    
    	// 트윗을 등록한 옵저들에게 알린다. 
    	public void notifyObservers(String tweet) {
    		observers.forEach(o -> o.notify(tweet));
    	}
    }

    Feed f = new Feed();
    
    // 구독할 옵저버를 등록한다. 
    f.registerObserver(new NYTimes());
    f.registerObserver(new Guardian());
    f.registerObserver(new LeMonde());
    
    // 옵저버들에게 메시지를 전송한다. 
    f.notifyObservers("The queen said her favorite book is Java 8 in Action!");
```
람다 표현식 사용하기
```java
    Feed f = new Feed();
    
    f.registerObserver((String tweet) {
    	if(tweet != null && tweet.contains("money")) {
    		System.out.println("Breaking news in NY! " + tweet);
    	}
    });
    
    f.registerObserver((String tweet) {
    	if(tweet != null && tweet.contains("queen")) {
    		System.out.println("Yet another new in London... " + tweet);
    	}
    });
```
이 예제에서는 실행해야 할 동작이 비교적 간단하므로 람다 표현식으로 불필요한 코드를 제거하는 것이 바람직하다. 하지만 옵저버가 상태를 가지며, 여러 메서드를 정의하는 등 복잡하다면 람다 표현식보다 기존의 클래스 구현방식을 고수하는 것이 바람직할 수도 있다. 

### 의무 체인

작업처리 객체의 체인을 만들 때는 의무 체인 패턴을 사용한다. 한 객체가 어떤 작업을 처리한 다음에 다른 객체로 결과를 전달하고, 다른 객체도 해야 할 작업을 처리한 다음에 또 다른 객체로 전달하는 식이다. 

일반적으로 다음으로 처리할 객체 정보를 유지하는 필드를 포함하는 작업 처리 추상 클래스로 의무 체인 채턴을 구성한다. 
```java
    public abstract class ProcessingObject<T> {
    	protected ProcessingObject<T> successor;
    
    	public void setSuccessor(ProcessingObject<T> successor) {
    		this.successor = successor;
    	}
    	public T handle(T input) {
    		T r = handleWork(input);
    		if (successor != null) {
    			return successor.handle(r);
    		}
    		return r;
    	}
    
    	abstract protected T handleWork(T input);
    }

    public class HeaderTextProcessing extends ProcessingObject<String> {
    	public String handleWork(String text) {
    		return "From Raoul, Mario and Alan: " + text);
    	}
    }
    
    public class SpellCheckerProcessing extends ProcessingObject<String> {
    	public String handleWork(String text) {
    		return text.replaceAll("labda", "lambda");
    	}
    }

    ProcessingObject<String> p1 = new HeaderTextProcessing();
    ProcessingObject<String> p2 = new SpellCheckerProcessing();
    
    p1.setSuccessor(p2);
    
    String result = p1.handle("Aren't ladas really sexy?!!");
    System.out.println(result); 
    // From Raoul, Mario and Alan: Aren't lambda really sexy?!!
```
람다 표현식 사용하기

작업처리 객체를 Function<String, String>, 더 정확히 표현하자면 UnaryProcessingObject<String> 형식의 인스턴스로 표현할 수 있다. 
```java
    public abstract class UnaryProcessingObject<T> {
    	abstract protected T handleWork(T input);
    }

    UnaryProcessingObject<String> headerProcessing = 
    	(String text) -> "From Raoul, Mario and Alan: " + text;
    
    UnaryProcessingObject<String> spellCheckerProcessing = 
    	(String text) -> text.replaceAll("labda", "lambda");
    
    Function<String, String> pipeline = 
    	headerProcessing.andThen(spellCheckerProcessing);
    
    String result = pipeline.apply("Aren't ladas really sexy?!!");
```
### 팩토리

인스턴스화 로직을 클라이언트에 노출하지 않고 객체를 만들 때 팩토리 디자인 패턴을 사용한다. 예를 들어 우리가 은행에서 일하고 있는데 은행에서 취급하는 대출, 채권, 주식 등 다양한 상품을 만들어야 한다고 가정하자
```java
    public class ProductFactory {
    	public static Product createProduct(String name) {
    		switch (name) {
    			case "loan": return new Loan();
    			case "stock": return new Stock();
    			case "bond": return new Bond();
    			default: throw new RuntimeException("No such product " + name);
    		}
    	}
    }
```
람다 표현식 사용하기
```java
    Supplier<Product> loanSupplier = Loan::new;
    Loan loan = loanSupplier.get();

    final static Map<String, Supplier<Product>> map = new HashMap<>();
    static {
    	map.put("loan", Loan::new);
    	map.put("stock", Stock::new);
    	map.put("bond", Bond::new);
    }

    public static Product createProduct(String name) {
    	Supplier<Product> p = map.get(name);
    	if(p != null) return p.get();
    	throw new IllegalArgumentException("No such product " + name);
    }
```
예제는 생성자 파라미터가 없을 경우라 간단하지만 생성자에 파라미터가 필요하다면 인터페이스로는 이 문제를 해결할 수 없다. 

## 람다 테스팅

람다는 익명(결국 익명 함수)이므로 테스트 코드 이름을 호출할 수 없다. 

따라서 필요하다면 람다를 필드에 저장해서 재사용할 수 있으며 람다의 로직을 테스트할 수 있다. 
```java
    public class Point {
    	pubic final static Comparator<Point> compareByXAndThenY =
    		comparing(Point::getX).thenComparing(Point::getY);
    		...
    }

    @Test
    public void testComparingTwoPoints() throws Exception {
    	Point p1 = new Point(10, 15);
    	Point p2 = new Point(10, 20);
    	int result = Point.compareByXAndThenY.compare(p1, p2);
    	assertEquals(-1, result);
    }
```
람다 표현식을 사용하는 메서드의 동작을 테스트함으로써 람다를 공개하지 않으면서도 람다 표현식을 검증할 수 있다. 

## 디버깅

문제가 발생한 코드를 디버깅할 때 개발자는 다음 두 가지를 가장 먼저 확인해야 한다. 

- 스택 트레이스
- 로깅

하지만 람다 표현식과 스트림은 기존의 디버깅 기법을 무력화한다. 

### 람다와 스택 트레이스

람다 표현식은 이름이 없기 때문에 조금 복잡한 스택 트레이스가 생성된다. 따라서 람다 표현식과 관련한 스택 트레이스는 이해하기 어려울 수 있다는 점을 염두에 두자. 이는 미래의 자바 컴파일러가 개션해야 할 부분이다. 

### 정보 로깅

스트림 파이프라인에 적용된 각각의 연산(map, filter, limit)이 어떤 결과를 도출하는지 확인할 수 있다면 좋을 것 같다. 

바로 peek이라는 스트림 연산을 활용할 수 있다. peek은 스트림의 각 요소를 소비한 것처럼 동작을 실행한다. 하지만 forEach처럼 실제로 스트림의 요소를 소비하지는 않는다. peek은 자신이 확인한 요소를 파이프라인의 다음 연산으로 그대로 전달한다. 
```java
    List<Integer> result = 
    	numbers.stream()
    					.peek(x -> System.out.println("From stream: " + x))
    					.map(x -> x + 17)
    					.peek(x -> System.out.println("after map: " + x))
    					.filter(x -> x % 2 == 0)
    					.peek(x -> System.out.println("after filter: " + x))
    					.lmit(3)
    					.peek(x -> System.out.println("after limit: " + x))
    					.collect(toList());

    // rersult
    
    from stream: 2
    after map: 19
    from stream: 3
    after map: 20
    after filter: 20
    after limit: 20
    from stream: 4
    after map: 21
    from stream: 5
    after map: 22
    after filter: 22
    after limit: 22
```
## 요약

- 람다 표현식으로 가독성이 좋고 더 유연한 코드를 만들 수 있다.
- 익명 클래스는 람다 표현식으로 바꾸는 것이 좋다. 하지만 이때 this, 변수 섀도 등 미묘하게 의미상 다른 내용이 있음을 주의하자. 메서드 레퍼런스로 람다 표현식보다 더 가독성이 좋은 코드를 구현할 수 있다.
- 반복적으로 컬렉션을 처리하는 루틴은 스트림 API로 대체할 수 있을지 고려하는 것이 좋다.
- 람다 표현식으로 전략, 템플릿 메서드, 옵저버, 의무 체인, 팩토리 등의 객체지향 디자인 패턴에서 발생하는 불필요한 코드를 제거할 수 있다.
- 람다 표현식도 단위 테스트를 수행할 수 있다. 하지만 람다 표현식 자체를 테스트하는 것보다는 람다 표현식이 사용되는 메서드의 동작을 테스트하는 것이 바람직하다.
- 람다 표현식을 사용하면 스택 트레이스를 이해하기 어려워진다.
- 스트림 파이프라인에서 요소를 처리할 때 peek 메서드로 중간값을 확인할 수 있다.