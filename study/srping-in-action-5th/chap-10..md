---
description: 스프링 인 액션(5판) 챕터 10장을 요약한 내용 입니다.
---

# CHAP 10. 리액터 개요

애플리케이션 코드를 개발할 때는 명령형과 리액티브의 두 가지 형태로 코드를 작성할 수 있다.

* 명령형 코드는 앞에서 상상했던 황당하며 실제가 아닌 신문 구독과 매우 유사하다. 이것은 순차적으로 연속되는 작업이며, 각 작업은 한 번에 하나씩 그리고 이전 작업 다음에 실행된다. 데이터는 모아서 처리되고 이전 작업이 데이터 처리를 끝낸 후에 다음 작업으로 넘어갈 수 있다.
* 리액티브 코드는 실제 신문 구독과 매우 비슷하다. 데이터 처리를 위해 일련의 작업들이 정의되지만, 이 작업들은 병렬로 실행될 수 있다. 그리고 각 작업은 부분 집합의 데이터를 처리할 수 있으며, 처리가 끝난 데이터를 다음 작업에 넘겨주고 다른 부분 집합의 데이터로 계속 작업할 수 있다.

## 리액티브 프로그래밍 이해하기

실제로 우리가 작성하는 대부분\(또는 모든\)의 코드는 여전히 명령형일 가능성이 높다. 명령형 프로그래밍의 발상은 간단하다. 즉, 한 번에 하나씩 만나는 순서대로 실행되는 명령어들로 코드를 작성하면 된다. 그리고 프로그램에서는 하나의 작업이 완전히 끝나기를 기다렸다가 그다음 작업을 수행한다. 각 단계마다 처리되는 데이터는 전체를 처리할 수 있도록 사용할 수 있어야 한다.

그러나 작업이 수행되는 동안 스레드는 차단되며 이렇게 차단되는 스레드는 낭비다. 자바에서는 스레드가 어떤 작업을 계속 수행하는 동안 이 스레드에서 다른 스레드를 시작시키고 작업을 수행하게 하는 것은 매우 쉽다. 그러나 스레드를 생성하는 것은 쉬울지라도 생성된 스레드는 어떤 이유로든 결국 차단된다. 게다가 다중 스레드로 동시성을 관리하는 것은 쉽지 않다.

이에 반해 리액티브 프로그래밍은 본질적으로 함수적이면서 선언적이다. 즉, 순차적으로 수행되는 작업 단계를 나타낸 것이 아니라 데이터가 흘러가는 파이프라인이나 스트림을 포함한다.

### 리액티브 스트림 정의하기

리액티브 프로그맹의 비동기 특성은 동시에 여러 작업을 수행하여 더 큰 확장성을 얻게 해준다. 백 프레셔는 데이터를 소비하는\(읽는\) 컨슈머가 처리할 수 있는 만큼으로 전달 데이터를 제한함으로써 지나치게 빠른 데이터 소스로부터의 데이터 전달 폭주를 피할 수 있는 수단이다.

자바 스트림 vs 리액티브 스트림

자바 스트림과 리액티브 스트림은 많은 유사성이 있다. 우선, 둘 다 Stream이라는 단어가 이름에 포함된다. 또한, 데이터로 작업하기 위한 API를 제공한다. 실제로 나중에 리액터를 살펴볼 때 알게 되겠지만, 다수의 똑같은 오퍼레이션을 공유한다. 그러나 자바 스트림은 대개 동기화되어 있고 한정된 데이터로 작업을 수행한다. 리액티브 스트림은 무한 데이터셋을 비홋해서 어떤 크기의 데이터셋이건 비동기 처리를 지원한다. 그리고 실시간으로 데이터를 처리하며, 백 프레셔를 사용해서 데이터 전달 폭주를 막는다.

리액티브 스트림은 4개의 인터페이스인 Publisher\(발행자\), Subscriber\(구독자\), Subscription\(구독\), Processor\(프로세서\)로 요약할 수 있다.

### Publisher

```java
public interface Publisher<T> {
		void subscribe(Subscriber<? super T> subscriber);
}
```

* 하나의 Subscribtion당 하나의 Subscriber에 발행\(전송\)하는 데이터를 생성한다.
* Subscriber가 Publisher를 구독 신청할 수 있는 subscribe\(\) 메서드 한 개가 선언되어 있다.
* Subscriber가 구독 신청되면 Publisher로부터 이벤트를 수신할 수 있다.

### Subscriber

```java
public interface Subscriber<T> {
		void onSubscribe(Subscription sub);
		void onNext(T item);
		void onError(Throwable ex);
		void onComplete();
}
```

* Publisher가 onSubscribe\(\)를 호출할 때 이 메서드의 인자로 Subscribtion 객체를 Subscriber에 전달한다.
* Subscriber는 Subscription 객체를 통해서 구독을 관리할 수 있다.
* Subscriber의 데이터 요청이 완료되면 데이터가 스트림을 통해 전달되기 시작하며, 이때 onNext\(\) 메서드가 호출되어 Publisher가 전송하는 데이터가 Subscriber에게 전달되며, 만일 에러가 생길 때는 onError\(\)가 호출된다.
* Publisher에서 전송할 데이터가 없고 더 이상의 데이터를 생성하지 않는다면 Publisher가 onComplete\(\)를 호출하여 작업이 끝났다고 Subscriber에게 알려준다.

### Subscription

```java
public interface Subscription {
		void request(long n);
		void cancel();
}
```

* Subscriber는 request\(\)를 호출하여 전송되는 데이터를 요청하거나, 또는 더 이상 데이터를 수신하지 않고 구독을 취소한다는 것을 나타내기 위해 cancel\(\)을 호출할 수 있다.
* request\(\)를 호출할 때 Subscriber는 받고자 하는 데이터 항목 수를 나타내는 long 타입의 값을 인자로 전달한다. 바로 이것이 백 프레셔이며, Subscriber가 처리할 수 있는 것보다 더 많은 데이터를 Publisher가 전송하는 것을 막아준다.

### Processor

```java
public interface Processor<T, R> extends Subscriber<T>, Publisher<R> {}
```

* Subscriber 역할로 Processor는 데이터를 수신하고 처리한다.
* 그다음에 역할을 바꾸어 Publisher 역할로 처리 결과를 자신의 Subscriber들에게 발행한다.

## 리액터 시작하기

리액티브 프로그래밍은 일련의 작업 단계를 기술하는 것이 아니라 데이터가 전달될 파이프라인을 구성하는 것이다. 그리고 이 파이프라인을 통해 데이터가 전달되는 동안 어떤 형태로든 변경 또는 사용될 수 있다.

예를 들어, 사람의 이름을 가져와서 모두 대문자로 변경한 후 이것으로 인사말 메시지를 만들어 출력한다고 해보자. 이를 명령형 프로그래밍 모델에서는 다음과 같은 코드를 작성할 수 있다.

```java
String name = "Craig";
String capitalName = name.toUpperCase();
String greeting = "Hello, " + capitalName + "!";
System.out.println(greeting);
```

이와는 다르게 리액티브 코드에서는 다음과 같이 표현할 수 있다.

```java
Mono.just("Craig")
		.map(n -> n.toUpperCase())
		.map(cn -> "Hello, " + cn + "!")
		.subscribe(System.out::println);
```

> 리액터 vs RxJava\(ReactiveX\)

RxJava나 ReactiveX를 잘 알고 있다면 Mono, Flux가 Observable, Single과 매우 비슷하다고 생각할 것이다. 실제로 이것들은 개념적으로 거의 같으며, 여러 동일한 오퍼레이션을 제공한다.

### 리액티브 플로우의 다이어그램

리액티브 플로우는 마블 다이어그램으로 나타내곤 한다.

![ &#x200B;https://taes-k.github.io/2020/08/12/spring-reactive-1/](../../.gitbook/assets/111%20%2824%29.png)

마블 다이어그램의 제일 위에는 Flux나 Mono를 통해 전달되는 데이터의 타임라인을 나타내고, 중앙에는 오퍼레이션을, 제일 밑에는 결과로 생성되는 Flux나 Mono의 타임라인을 나타낸다.

### 리액터 의존성 추가하기

리액터를 시작하려면 다음 의존성을 프로젝트 빌드에 추가해야 한다.

```java
<dependency>
		<groupId>io.projectreactor</groupId>
		<artifactId>reactor-core</artifactId>
</dependency>
```

만일 리액터 코드의 여러 테스트를 작성하고자 한다면 다음 의존성도 빌드에 추가해야 한다.

```java
<dependency>
		<groupId>io.projectreactor</groupId>
		<artifactId>reactor-test</artifactId>
		<scope>test</scope>
</dependency>
```

## 리액티브 오퍼레이션 적용하기

Flux와 Mono에는 500개 이상의 오퍼레이션이 있으며, 각 오퍼레이션은 다음과 같으 분류될 수 있다.

* 생성\(creation\) 오퍼레이션
* 조합\(combination\) 오퍼레이션
* 변환\(transformation\) 오퍼레이션
* 로직\(logic\) 오퍼레이션

### 리액티브 타입 생성하기

#### 객체로부터 생성하기

```java
@Test
public void createAFlux_just() {
		Flux<String> fruitFlux = Flux
															.just("Apple","Orange","Grape","Banana");
```

#### 컬렉션으로부터 생성하기

```java
@Test
public void createAFlux_fromArray() {
		String[] fruits = new String[] {
					"Apple","Orange","Grape","Banana"};

		Flux<String> fruitFlux = Flux.fromArray(fruits);
}
```

#### Flux 데이터 생성하기

```java
@Test
public void createAFlux_range() {
		Flux<Integer> intervalFlux = 
				Flux.range(1,5);
}
```

### 리액티브 타입 조합하기

두 개의 리액티브 타입을 결합해야 하거나 하나의 Flux를 두 개 이상의 리액티브 타입으로 분할해야 하는 경우가 있을 수 있다. 여기서는 리액터의 Flux나 Mono를 결합하거나 분할하는 오퍼레이션을 알아본다.

#### 리액티브 타입 결합하기

두 개의 Flux 스트림을 하나의 결과 Flux로 생성해보자.

```java
@Test
public void mergeFluxes() {

    // delays needed to avoid the first flux from streaming the
    // data through before subscribing to the second flux.

    Flux<String> characterFlux = Flux.just("Garfield", "Kojak", "Barbossa").delayElements(Duration.ofMillis(500));
    Flux<String> foodFlux = Flux.just("Lasagna", "Lollipops", "Apples")
                                .delaySubscription(Duration.ofMillis(250))
                                .delayElements(Duration.ofMillis(500));

    Flux<String> mergedFlux = characterFlux.mergeWith(foodFlux);

    StepVerifier.create(mergedFlux)
                .expectNext("Garfield")
                .expectNext("Lasagna")
                .expectNext("Kojak")
                .expectNext("Lollipops")
                .expectNext("Barbossa")
                .expectNext("Apples")
                .verifyComplete();
}
```

일반적으로 Flux는 가능한 빨리 데이터를 방출한다. 따라서 생성되는 Flux 스트림 두 개 모두에 delayElements\(\) 오퍼레이션을 사용해서 조금 느리게 방출되도록 하였다. 또한, foodFlux가 characterFlux 다음에 스트리밍을 시작하도록 foodFlux에 delaySubscription\(\) 오퍼레이션을 적용하여 250밀리초가 지난 후에 구독 및 데이터를 방출하도록 하였다.

mergedFlux로부터 방출되는 항목의 순서는 두 개의 소스 Flux로부터 방출되는 시간에 맞춰 결정된다. 여기서는 두 Flux 객체 모두 일정한 속도로 방출되게 설정되었으므로 두 Flux의 값은 번갈아 mergedFlux에 끼워진다.

mergeWith\(\)는 소스 Flux들의 값이 완벽하게 번갈아 방출되게 보장할 수 없으므로 필요하다면 zip\(\) 오퍼레이션을 대신 사용할 수 있다. 이 오퍼레이션은 각 Flux 소스로부터 한 항목씩 번갈아 가져와 새로운 Flux를 생성한다.

```java
@Test
public void zipFluxes() {
    Flux<String> characterFlux = Flux.just("Garfield", "Kojak", "Barbossa");
    Flux<String> foodFlux = Flux.just("Lasagna", "Lollipops", "Apples");

    Flux<Tuple2<String, String>> zippedFlux = Flux.zip(characterFlux, foodFlux);

    StepVerifier.create(zippedFlux)
                .expectNextMatches(p -> p.getT1().equals("Garfield") && p.getT2().equals("Lasagna"))
                .expectNextMatches(p -> p.getT1().equals("Kojak") && p.getT2().equals("Lollipops"))
                .expectNextMatches(p -> p.getT1().equals("Barbossa") && p.getT2().equals("Apples"))
                .verifyComplete();
}
```

#### 먼저 값을 방출하는 리액티브 타입 선택하기

두 개의 Flux 객체가 있는데, 이것을 결합하는 대신 먼저 값을 방출하는 소스 Flux의 값을 발행하는 새로운 Flux를 생성하고 싶다고 해보자.

다음의 테스트 메서드에서는 빠른 Flux와 느린 Flux\(100밀리초가 경과한 후 구독이 신청되고 항목을 발행하므로 느리다고 한 의미이다\)를 생성한다. 그리고 first\(\)를 사용하여 새로운 Flux를 생성한다. 이 Flux는 먼저 값을 방출하는 소스 Flux의 값만 발행한다.

```java
@Test
public void firstFlux() {
    // delay needed to "slow down" the slow Flux

    Flux<String> slowFlux = Flux.just("tortoise", "snail", "sloth").delaySubscription(Duration.ofMillis(100));
    Flux<String> fastFlux = Flux.just("hare", "cheetah", "squirrel");

    Flux<String> firstFlux = Flux.first(slowFlux, fastFlux);

    StepVerifier.create(firstFlux).expectNext("hare").expectNext("cheetah").expectNext("squirrel").verifyComplete();
}
```

### 리액티브 스트림의 변환과 필터링

데이터가 스트림을 통해 흐르는 동안 일부 값을 필터링하거나 다른 값으로 변경해야 할 경우가 있다.

#### 리액티브 타입으로부터 데이터 필터링하기

skip\(\) 오퍼레이션은 소스 Flux의 항목에서 지정된 수만큼 건너뛴 후 나머지 항목을 방출하는 새로운 Flux를 생성한다.

```java
@Test
public void skipAFew() {
    Flux<String> countFlux = Flux.just("one", "two", "skip a few", "ninety nine", "one hundred").skip(3);

    StepVerifier.create(countFlux).expectNext("ninety nine", "one hundred").verifyComplete();
}
```

그러나 특정 수의 항목을 건너뛰는 대신, 일정 시간이 경과할 때까지 처음의 여러 항목을 건너뛰어야 하는 경우가 있다. 다음의 테스트 메서드에서는 skip\(\)을 사용해서 4초 동안 기다렸다가 값을 방출하는 결과 Flux를 생성한다.

```java
@Test
public void skipAFewSeconds() {
    Flux<String> countFlux = Flux.just("one", "two", "skip a few", "ninety nine", "one hundred")
                                 .delayElements(Duration.ofSeconds(1))
                                 .skip(Duration.ofSeconds(4));

    StepVerifier.create(countFlux).expectNext("ninety nine", "one hundred").verifyComplete();
}
```

skip\(\) 오퍼레이션의 반대 기능이 필요할 때는 take\(\)를 고려할 수 있다. skip\(\)이 처음의 여러 개 항목을 건너뛰는 반면, take\(\)는 처음부터 지정된 수의 항목만을 방출한다.

```java
@Test
public void take() {
    Flux<String> nationalParkFlux = Flux.just("Yellowstone", "Yosemite", "Grand Canyon", "Zion", "Acadia").take(3);

    StepVerifier.create(nationalParkFlux).expectNext("Yellowstone", "Yosemite", "Grand Canyon").verifyComplete();
}
```

Flux를 통해 항목을 전달할 것인가의 여부를 결정하는 조건식\(Predicate\)이 지정되면 filter\(\) 오퍼레이션에서 우리가 원하는 조건을 기반으로 선택적인 발행을 할 수 있다.

```java
@Test
public void filter() {
    Flux<String> nationalParkFlux = Flux.just("Yellowstone", "Yosemite", "Grand Canyon", "Zion", "Grand Teton")
                                        .filter(np -> !np.contains(" "));

    StepVerifier.create(nationalParkFlux).expectNext("Yellowstone", "Yosemite", "Zion").verifyComplete();
}
```

### 리액티브 데이터 매핑하기

Flux나 Mono에 가장 많이 사용하는 오퍼레이션 중 하나는 발행된 항목을 다른 형태나 타입으로 매핑\(변환\)하는 것이다. 리액터의 타입은 이런 목적의 map\(\)과 flatMap\(\) 오퍼레이션을 제공한다.

```java
@Test
public void map() {
    Flux<Player> playerFlux = Flux.just("Michael Jordan", "Scottie Pippen", "Steve Kerr").map(n -> {
        String[] split = n.split("\\\\s");
        return new Player(split[0], split[1]);
    });

    StepVerifier.create(playerFlux)
                .expectNext(new Player("Michael", "Jordan"))
                .expectNext(new Player("Scottie", "Pippen"))
                .expectNext(new Player("Steve", "Kerr"))
                .verifyComplete();
}
```

map\(\)에서는 한 객체를 다른 객체로 매핑하는 정도였지만, flatMap\(\)에서는 각 객체를 새로운 Mono나 Flux로 매핑하여, 해당 Mono나 Flux들의 결과는 하나의 새로운 Flux가 된다. flatMap\(\)을 subscribeOn\(\)과 함께 사용하면 리액터 타입의 변환을 비동기적으로 수행할 수 있다.

```java
@Test
public void flatMap() {
    Flux<Player> playerFlux = Flux.just("Michael Jordan", "Scottie Pippen", "Steve Kerr")
                                  .flatMap(n -> Mono.just(n).map(p -> {
                                      String[] split = p.split("\\\\s");
                                      return new Player(split[0], split[1]);
                                  }).subscribeOn(Schedulers.parallel()));

    List<Player> playerList = Arrays.asList(new Player("Michael", "Jordan"),
                                            new Player("Scottie", "Pippen"),
                                            new Player("Steve", "Kerr"));

    StepVerifier.create(playerFlux)
                .expectNextMatches(p -> playerList.contains(p))
                .expectNextMatches(p -> playerList.contains(p))
                .expectNextMatches(p -> playerList.contains(p))
                .verifyComplete();
}
```

subscribeOn\(\)의 이름은 subscribe\(\)와 유사하지만, 두 오퍼레이션은 매우 다르다. subscribe\(\)는 이름이 동사형이면서 리액티브 플로우를 구독 요청하고 실제로 구독하는 반면, subscribeOn\(\)은 이름이 더 서술적이면서 구독이 동시적으로 처리되어야 한다는 것을 지정한다. 우리가 사용하기 원하는 동시성 모델을 subscribeOn\(\)의 인자로 지정할 수 있다.

### 리액티브 스트림의 데이터 버퍼링하기

Flux를 통해 전달되는 데이터를 처리하는 동안 데이터 스트림을 작은 덩어리로 분할하면 도움이 될 수 있다. 이때 buffer\(\) 오퍼레이션을 사용할 수 있다. 다음의 테스트 코드는 문자열 값을 갖는 Flux가 지정되었을 때 이 Flux로부터 List 컬렉션들을 포함하는 새로운 Flux를 생성할 수 있다.

```java
@Test
public void bufferAndFlatMap() throws Exception {
    Flux.just("apple", "orange", "banana", "kiwi", "strawberry")
        .buffer(3)
        .flatMap(x -> Flux.fromIterable(x).map(y -> y.toUpperCase()).subscribeOn(Schedulers.parallel()).log())
        .subscribe();
}
```

이 경우 String 요소의 Flux는 List 컬렉션을 포함하는 새로운 Flux로 버퍼링한다. 따라서 5개의 String 값을 방출하는 원래의 Flux는 두 개의 컬렉션을 방출하는 Flux로 변환된다.

이처럼 리액티브 Flux로부터 리액티브가 아닌 List 컬렉션으로 버퍼링되는 값은 비생상적인 것처럼 보인다. 그러나 buffer\(\)를 flatMap\(\)과 같이 사용하면 각 List 컬렉션을 병행으로 처리할 수 있다.

```java
@Test
public void bufferAndFlatMap() throws Exception {
    Flux.just("apple", "orange", "banana", "kiwi", "strawberry")
        .buffer(3)
        .flatMap(x -> Flux.fromIterable(x).map(y -> y.toUpperCase()).subscribeOn(Schedulers.parallel()).log())
        .subscribe();
}
```

여기서는 5개의 값으로 된 Flux를 새로운 Flux로 버퍼링하지만, 이 Flux는 여전히 List 컬렉션을 포함한다. 그러나 그다음에 List 컬렉션의 Flux에 flatMap\(\)을 적용한다. 이 경우 flatMap\(\)에서는 각 List 버퍼를 가져와서 해당 List의 요소로부터 새로운 Flux를 생성하고 map\(\) 오퍼레이션을 적용한다. 따라서 버퍼링된 각 List는 별도의 스레드에서 병행으로 계속 처리될 수 있다. 정말 이렇게 실행되는지 로그를 통해 확인할 수 있다.

collectList는 List를 발행하는 Flux 대신 Mono를 생성한다. Flux가 방출하는 항목들을 모으는 훨씬 더 흥미로운 방법으로 collectMap\(\)이 있다. collectMap\(\) 오퍼레이션은 Map을 포함하는 Mono를 생성한다.

```java
@Test
public void collectMap() {
    Flux<String> animalFlux = Flux.just("aardvark", "elephant", "koala", "eagle", "kangaroo");

    Mono<Map<Character, String>> animalMapMono = animalFlux.collectMap(a -> a.charAt(0));

    StepVerifier.create(animalMapMono).expectNextMatches(map -> {
        return map.size() == 3 && map.get('a').equals("aardvark") && map.get('e').equals("eagle") && map.get('k')
                                                                                                        .equals(
                                                                                                            "kangaroo");
    }).verifyComplete();
}
```

1. Flux\(animalFlux\)는 소수의 동물 이름을 방출한다.
2. 그리고 이 Flux로부터 collectMap\(\)을 사용해서 Map을 방출하는 새로운 Mono\(animalMapMono\)를 생성한다.
3. 이때 Map의 키는 동물 이름의 첫 번째 문자로 결정되며, 키의 항목 값은 동물 이름 자체가 된다.

### 리액티브 타입에 로직 오퍼레이션 수행하기

Mono나 Flux가 발행한 항목이 어떤 조건과 일치하는지만 알아야 할 경우가 있다. 이때는 all\(\)이나 any\(\) 오퍼레이션이 그런 로직을 수행한다.

Flux가 발행하는 모든 문자열이 문자 a나 k를 포함하는지 알고 싶다고 하자

```java
@Test
public void all() {
    Flux<String> animalFlux = Flux.just("aardvark", "elephant", "koala", "eagle", "kangaroo");

    Mono<Boolean> hasAMono = animalFlux.all(a -> a.contains("a"));
    StepVerifier.create(hasAMono).expectNext(true).verifyComplete();

    Mono<Boolean> hasKMono = animalFlux.all(a -> a.contains("k"));
    StepVerifier.create(hasKMono).expectNext(false).verifyComplete();
}
```

또는 '모 아니면 도'와 같은 검사를 수행하지 않고 최소한 하나의 항목이 일치하는지 검사할 경우가 있다. 이때는 any\(\) 오퍼레이션을 사용한다.

```java
@Test
public void any() {
    Flux<String> animalFlux = Flux.just("aardvark", "elephant", "koala", "eagle", "kangaroo");

    Mono<Boolean> hasAMono = animalFlux.any(a -> a.contains("a"));

    StepVerifier.create(hasAMono).expectNext(true).verifyComplete();

    Mono<Boolean> hasZMono = animalFlux.any(a -> a.contains("z"));
    StepVerifier.create(hasZMono).expectNext(false).verifyComplete();
}
```

## 요약

* 리액티브 프로그래밍에서는 데이터가 흘러가는 파이프라인을 생성한다.
* 리액티브 스트림은 Publisher, Subscriber, Subscription, Transformer의 네 가지 타입을 정의한다.
* 프로젝트 리액터는 리액티브 스트림을 구현하며, 수많은 오퍼레이션을 제공하는 Flux와 Mono의 두 가지 타입으로 스트림을 정의한다.
* 스프링 5는 리액터를 사용해서 리액티브 컨트롤러, 리퍼지터리, REST 클라이언트를 생성하고 다른 리액티브 프레임워크를 지원한다.

