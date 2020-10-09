---
description: Functional Programming in Java 8의 Chapter 8을 요약한 내용 입니다.
---

# CHAP 08. 람다 표현식의 조합

OOP를 사용할 때는 종종 상태\(state\)를 변형하곤 한다. OOP를 함수형 스타일과 혼합하여 사용하면, 결향화된 객체를 연결된 결합 함수들로 넘겨서 객체 자체를 변형할 수 있다. 이것은 확장하기 쉬운 코드를 생성해주며 함수들을 조합하는 방법을 간단하게 변경하여 다른 결과를 만들어 낼 수도 있다.

## 함수 조합의 사용

OOP 패러다임은 개발자들이 추상화, 캡슐화 그리고 다형성을 이해하는 데 도움을 준다. 함수형 스타일로 프로그래밍하면 고차 함수를 조합하고 불변성과 함수들의 사용을 가능한 최대로 활용할 수 있다.

```java
public static void main(final String[] args) {
    final BigDecimal HUNDRED = new BigDecimal("100");
    System.out.println("Stocks priced over $100 are " + 
       Tickers.symbols.stream()
                       .filter(
													symbol -> YahooFinance.getPrice(symbol).compareTo(HUNDRED) > 0)
                       .sorted()
                       .collect(joining(", ")));
}
```

* 일련의 오퍼레이션들이 체인으로 묶여서 동작한다.
* 주식 시세표 심볼의 스트림은 필터링되고 정렬되며 나중에는 출력을 위해 연결된다.
* 조합 함수를 사용하면 원래의 심볼 리스트는 수정하지 않고 그대로 둔 상태에서 리스트를 심볼의 필터링된 스트림으로 변경한다.
* 마지막으로 출력을 위해 최종 스트림에 있는 심볼들을 서로 연결시킨다.

## 맵리듀스의 사용

맵리듀스 패턴에서는 두 가지의 오퍼레이션을 사용한다.

* 컬렉션에 있는 각 엘리먼트에 대해 실행하는 오퍼레이션
* 최종 결과를 위해 기존의 결과를 조합하는 오퍼레이션

### 연산을 위한 준비

주식의 이름과 가격을 좀 더 쉽게 처리하기 위해 불변 필드를 갖는 클래스를 생성하자

```java
public class StockInfo {

    public final String ticker;
    public final BigDecimal price;

    public StockInfo(final String symbol, final BigDecimal thePrice) {
        ticker = symbol;
        price = thePrice;
    }

    public String toString() {
        return String.format("ticker: %s price: %g", ticker, price);
    }
}
```

유틸성 메서드를 작성해보자.

```java
public class StockUtil {

		// 가격 정보를 리턴해주는 메서드
    public static StockInfo getPrice(final String ticker) {
        return new StockInfo(ticker, YahooFinance.getPrice(ticker));
    }
    
		// 특정 가격보다 작은 주식 리스트 확인하는 메서드
    public static Predicate<StockInfo> isPriceLessThan(final int price) {
        return stockInfo -> stockInfo.price.compareTo(BigDecimal.valueOf(price)) < 0;
    }

		// 가장 높은 가격을 갖는 주식을 선택하는 메서드
    public static StockInfo pickHigh(final StockInfo stock1, final StockInfo stock2) {
        return stock1.price.compareTo(stock2.price) > 0 ? stock1 : stock2;
    }

}
```

### 명령형 스타일에서 벗어나기

$500 이하의 주식에서 가장 높은 가격의 주식을 선택하는 로직을 명령형으로 작성해보자.

```java
public static void main(String[] args) {
    StockInfo highPriced = new StockInfo("", BigDecimal.ZERO);
    final Predicate<StockInfo> isPriceLessThan500 = StockUtil.isPriceLessThan(500);

    for (String symbol : Tickers.symbols) {
        StockInfo stockInfo = StockUtil.getPrice(symbol);

      if (isPriceLessThan500.test(stockInfo)) {
        highPriced = StockUtil.pickHigh(highPriced, stockInfo);
      }
    }
    System.out.println("High priced under $500 is " + highPriced);
}
```

위의 코드에서 재활용할 수 있는 부분은 거의 없다. 원래의 세 단계 과정이 있는 버전으로 되돌아가서 각 파츠를 재사용할 수 있는 함수로 모듈화할 수 있다.

### 함수형 스타일로 바꾸기

```java
public static void findHighPriced(final Stream<String> symbols) {
    final StockInfo highPriced = symbols.map(StockUtil::getPrice)
                                        .filter(StockUtil.isPriceLessThan(500))
                                        .reduce(StockUtil::pickHigh)
                                        .get();

    System.out.println("High priced under $500 is " + highPriced);
}

public static void main(final String[] args) {
    findHighPriced(Tickers.symbols.stream());
}
```

심볼의 컬렉션에 있는 각 항목의 주식 가격을 가져오는 함수에 맵 오퍼레이션을 적용했다. 이 결과로 StockInfo 인스턴스의 스트림을 얻게 됐고, 이 스트림을 필터링해서 주식을 선택하고 최종적으로 리듀스 오퍼레이션을 통해 하나의 StockInfo 객체를 구했다. 이 버전은 이전의 여러 과정이 있는 명령형 버전의 코드보다 약 절반밖에 차지하지 않는다.

#### 코드가 간결해진 것뿐만 아니라 몇 가지 장점이 있다.

* 병렬화하기 쉽게 되어 있다.
* 함수 조합과 고차 함수를 사용하여 가변성을 줄였다.
* 이해하기 쉽다.

## 병렬화 적용

#### 코드를 다시 살펴보자.

1. map\(\) 메서드를 통해 주식 시세표를 전송
2. 가격 범위 내에 있는 주식의 리스트로 추려낸다.
3. 주식의 리스트에서 제일 높은 가격을 선택

이 세 가지 오퍼레이션에서 첫 번째가 가장 느리다. 웹 서비스에 요청해야 하고 네트워크 지연이 발생하며, 각 주식 시세표 심볼마다 한 번씩 수행해야 하기 때문에 약 20번의 오퍼레이션을 해야 한다.

코드를 병렬화하는 것은 쉬운 일이 아니다. 어디서부터 시작해서 어떻게 해야할까? 태스크를 다중 스레드로 나누고, 결과를 모은 후에 순차적 과정으로 옮겨야 한다. 이 작을 하는 동안 레이스 컨디션이 발생하지 않도록 해야 한다. 다른 스레드가 데이터를 업데이트하는 동안 스레드들이 충돌하거나 데이터를 망치면 안 된다.

### parallelStream

방법은 간단하다. stream을 parallelStream으로 변경하면 된다.

```text
findHighPriced(Tickers.symbols.parallelStream());
```

stream\(\)을 호출할지 parallelStream\(\)을 호출할지 결정할 때 몇 가지 이슈를 고려해야 한다.

* 람다 표현식을 동시에 실행하고 싶은가?
* 코드는 사이드 이펙트나 레이스 컨디션 없이 독립적으로 실행 가능한가?
* 솔루션이 올바르다는 것은 동시에 실행되도록 스케줄된 람다 표현식의 실행 순서와는 독립적이어야 한다.

## 정리

람다 표현식은 함수를 조합해서 오퍼레이션의 체인이 되도록 하며, 이 체인은 풀어야 할 문제를 객체 변형의 결합 집합으로 바꾸어준다. 게다가 불변성을 보장하고 사이드 이펙트를 막아주기 때문에 체인 오퍼레이션의 부분들에 대한 실행을 쉽게 병렬화하고 속도 향상의 장점을 얻을 수 있다.

