---
layout: reference
title: '11장 CompletableFuture: 조합할 수 있는 비동기 프로그래밍'
date: 2020-03-10T00:00:00.000Z
categories: java
summary: 자바 8 인 액션 11장을 요약한 내용 입니다.
navigation_weight: 11
---

# 2020-03-10-java8InAction-chap11

> 자바 8 인 액션 11장을 요약한 내용 입니다.

`멀티코어 프로세서`가 등장하면서 애플리케이션을 효율적으로 실행하려면 이들 멀티코어를 온전히 활용할 수 있도록 소프트웨어를 구현해야 한다. 그러려면 하나의 큰 태스크를 작은 서브태스크로 분할해서 병렬로 실행해야 한다.

우리는 전통적인 스레드 방식 대신 자바 7에서 지원하는 `포크/조인 프레임워크`나 자바 8에서 지원하는 `병렬 스트림`으로 간단하고 효과적으로 병렬 실행을 달성하였다.

최근에는 모든 데이터를 자체적으로 처리하는 웹사이트나 네트워크 애플리케이션을 찾기가 어렵다. 그러면서 우리는 여러 웹 서비스를 이용해야 한다. `하지만 멀리 있는 서비스의 응답을 기다리는 동안 우리 계산이 블록되면서 수많은 CPU 사이클을 낭비하고 싶진 않다.`

이 상황은 멀티태스크 프로그래밍의 두 가지 특징\(`병렬성`과 `동시성`\)을 잘 보여준다. 포크/조인 프레임워크와 병렬 스트림은 훌륭한 `병렬화 도구`다. 이들을 이용해서 하나의 동작을 여러 서브 동작으로 분할하고 각각의 서브 동작을 다른 코어, 다른 CPU, 심지어 다른 기기로 할당할 수 있다.

반면 병렬성이 아니라 동시성을 이용해야 하는 상황, 즉 하나의 CPU 사용을 가장 극대화할 수 있도록 느슨하게 연관된 여러 작업을 수행해야 하는 상황이라면 원격 서비스 결과를 기다리거나 데이터베이스 결과를 기다리면서 스레드를 블록하기 원치 않을 것이다.

> 병렬성과 동시성의 차이를 정확히 숙지하고 있는가?

## Future

자바 5부터는 `Future` 인터페이스를 제공하고 있다. 비동기 계산을 모델링하는 데 Future를 이용할 수 있으며, Future는 계산이 끝났을 때 결과에 접근할 수 있는 레퍼런스를 제공한다. 시간이 걸릴 수 있는 작업을 `Future 내부로 설정하면 호출자 스레드가 결과를 기다리는 동안 다른 유용한 작업을 수행할 수 있다.` Future를 이용하려면 시간이 오래 걸리는 작업을 `Callable` 객체 내부로 감싼 다음에 `ExecutorService`에 제출해야 한다.

## Future 제한

Future로 여러 케이스를 고려하여 구현하는 것은 쉽지 않다. 따라서 다음과 같은 선언형이 필요하다.

* `두 개의 비동기 계산 결과를 하나로 합친다.` 두 가지 계산 결과는 서로 독립적일 수 있으며 또는 두 번째 결과가 첫 번째 결과에 의존하는 상황일 수 있다.
* Future 집합이 실행하는 `모든 태스크의 완료를 기다린다.`
* Future 집합에서 `가장 빨리 완료되는 태스크를 기다렸다가 결과를 얻는다`\(예를 들어 여러 태스크가 다양한 방식으로 같은 결과를 구하는 상황\)
* 프로그램적으로 Future를 완료시킨다.\(즉, 비동기 동작에 수동으로 결과 제공\)
* `Future 완료 동작에 반응한다`\(즉, 결과를 기다리면서 블록되지 않고 결과가 준비되었다는 알림을 받은 다음에 Future의 결과로 원하는 추가 동작을 수행할 수 있음\)

## 비동기 API 구현

`Future는 결과값의 핸들일 뿐이며 계산이 완료되면 get 메서드로 결과를 얻을 수 있다.` getPriceAsync 메서드는 즉시 반환되므로 호출자 스레드는 다른 작업을 수행할 수 있다.

```text
public Future<Double> getPriceAsync(String product) {
    CompletableFuture<Double> futurePrice = new CompletableFuture<>();
    new Thread( () -> {
        double price = calculatePrice(product); // 다른 스레드에서 비동기적으로 계산을 수행
        futurePrice.complete(price); // 오랜 시간이 걸리는 계산이 완료되면 Future에 값을 설정한다
    }).start();
    return futurePrice; // 계산 결과가 완료되길 기자리지 않고 Future를 반환한다
}
```

`실제 가격을 계산할 다른 스레드를 만든 다음에 오래 걸리는 계산 결과를 기다리지 않고 결과를 포함할 Future 인스턴스를 바로 반환한다.` 다음 코드에서 클라이언트가 getPriceAsync를 활용하는 예제를 살펴보자

```text
Shop shop = new Shop("BestShop");
long start = System.nanoTime();
Future<Double> futurePrice = shop.getPriceAsync("my favorite product");
long invocationTime = ((System.nanoTime() - start) / 1_000_000);
System.out.println("Invocation returned after " + invocationTime + " msec");

doSomeThingElse();
try {
    double price = futurePrice.get(); // 가격 정보가 있으면 Future에서 가격 정보를 읽고, 가격 정보가 없으면 가격 정보를 받을때까지 블록한다. 
    System.out.println("Price is %.2f%n", price);
} catch (Exception e) {
    throw new RuntimeException(e);
} 
long retrivalTime = ((System.nanoTime() - start) / 1_000_000);
System.out.println("Price returned after " + retrivalTime + " msec");
```

상점은 비동기 API를 제공하므로 즉시 Future를 반환한다. 클라이언트는 반환된 Future를 이용해서 나중에 결과를 얻을 수 있다. 그 사이 클라이언트는 결과를 기다리면서 대기하지 않고 다른 작업을 처리할 수 있다. `나중에 클라이언트가 특별히 할일이 없으면 Future의 get 메서드를 호출한다.` 이때 Future가 결과값을 가지고 있다면 Future에 포함된 값을 읽거나 아니면 값이 계산될 때까지 블록한다.

```text
Invation returned after 43 msecs
Price is 123.26
Price returned after 1045 msecs
```

## 팩토리 메서드 supplyAsync로 CompletableFuture 만들기

지금까지 CompletableFuture를 직접 만들었다. 하지만 좀 더 간단하게 CompletableFuture를 만드는 방법도 있다.

```text
public Future<Double> getPriceAsync(String product) {
    return CompletableFuture.supplyAsync(() -> calculatePrice(product));
}
```

`supplyAsync` 메서드는 Supplier를 인수로 받아서 CompletableFuture를 반환한다. ForkJoinPool의 Excutor 중 하나가 `Supplier`를 실행할 것이다. 하지만 두 번째 인수를 받는 오버로드 버전의 supplyAsync 메서드를 이용해서 다른 Executor를 선택적으로 전달할 수 있다.

## CompletableFuture로 비동기 호출 구현하기

팩토리 메서드 supplyAsync로 CompletableFuture를 만들 수 있음을 배웠다. 배운 지식을 활용하자

```text
public List<String> findPrices(String product) {
    // 첫번째 스트림 처리
    List<CompletableFuture<String>> priceFutures = 
        shops.stream()
        .map(shop -> CompletableFuture.supplyAsync(
            () -> shop.getName() + " price is " +
                        shop.getPrice(product)))
        .collect(Collectors.toList());

    // 두번째 스트림 처리
    return priceFutures.stream()
                    .map(CompletableFuture::join) // 모든 비동기 동작이 끝나길 기다린다
                    .collect(toList());
}
```

`두 map 연산을 하나의 스트림 처리 파이프라인으로 처리하지 않고 두 개의 스트림 파이프라인으로 처리했다는 사실에 주목하자.` 스트림 연산은 게으른 특성이 있으므로 하나의 파이프 라인으로 연산을 처리 했다면 모든 가격 정보 요청 동작이 동기적, 순차적으로 이루어지는 결과가 된다. CompletableFuture로 각 상점의 정보를 요청할 때 기존 요청 작업이 완료되어야 join이 결과를 반환 하면서 다음 상점으로 정보를 요청할 수 있기 때문이다.

`스트림 처리를 분리함으로써 CompletableFuture를 리스트로 모은 다음에 다른 작업과는 독립적으로 각자의 작업을 수행하는 모습을 보여준다.`

## 스트림 병렬화와 CompletableFuture 병렬화

지금까지 컬렉션 계산을 병렬화 하는 두 가지 방법을 살펴봤다. 하나는 `병렬 스트림`으로 변환해서 컬렉션을 처리하는 방법이고 다른 하나는 컬렉션을 반복하면서 `CompletableFuture 내부의 연산`으로 만드는 것이다. CompletableFuture를 이용하면 전체적인 계산이 블록되지 않도록 스레드풀의 크기를 조절할 수 있다.

그렇다면 우리는 어느 방법을 선택해야 할까?

* I/O가 포함되지 않은 계산 중심의 동작을 실행할 때는 `스트림 인터페이스`가 가장 구현하기 간단하며 효율적일 수 있다.
* 반면 작업이 I/O를 기다리는 작업을 병렬로 실행할 때는 `CompletableFuture`가 더 많은 유연성을 제공하며 대기/계산의 비율에 적합한 스레드 수를 설정할 수 있다.

블럭킹, 논블럭킹의 차이는 무엇인가? 동기, 비동기의 차이는 무엇인가?

## 독립 CompletableFuture와 비독립 CompletableFuture 합치기

독립적으로 실행된 두 개의 CompletableFuture 결과를 합쳐야 하는 상황이 종종 발생한다. 물론 첫 번째 CompletableFuture의 동작 완료와 관계없이 두 번째 CompletableFuture를 실행할 수 있어야 한다.

이런 상황에서는 `thenCombine` 메서드를 사용한다. thenCombine 메서드는 BiFunction을 두 번째 인수로 받는다. BiFunction은 두 개의 CompletableFuture 결과를 어떻게 합칠지 정의한다.

```text
Future<Double> futurePriceInUSD = 
    CompletableFuture.supplyAsync(() -> shop.getPrice(product))
    .thenCombine(
        CompletableFuture.supplyAsync(
            () -> exchangeService.getRate(Money.EUR, Money.USD)),
            (price, rate) -> price * rate // USD, EUR의 환율 정보를 요청하는 독립적인 두 번째 태스크를 생성한다. 
    ));
```

Future와 CompletableFuture의 차이는 무엇일까?

## 요약

* 한 개 이상의 원격 외부 서비스를 사용하는 긴 동작을 실행할 때는 비동기 방식으로 애플리케이션의 성능과 반응성을 향상시킬 수 있다.
* 우리 고객에게 비동기 API를 제공하는 것을 고려해야 한다. `CompletableFuture`의 기능을 이용하면 쉽게 비동기 API를 구현할 수 있다.
* CompletableFuture를 이용할 때 `비동기 태스크`에서 발생한 에러를 관리하고 전달할 수 있다.
* 동기 API를 CompletableFuture로 감싸서 `비동기적으로 소비할 수 있다.`
* 서로 독립적인 비동기 동작이든 아니면 하나의 비동기 동작이 다른 비동기 동작의 결과에 의존하는 상황이든 여러 비동기 동작을 조립하고 조합할 수 있다.
* CompletableFuture에 콜백을 등록해서 Future가 동작을 끝내고 결과를 생산했을 때 어떤 코드를 실행하도록 지정할 수 있다.
* CompletableFuture 리스트의 모든 값이 완료될 때까지 기다릴지 아니면 하나의 값만 완료되길 기다릴지 선택할 수 있다.

