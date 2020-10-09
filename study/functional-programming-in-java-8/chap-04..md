---
description: Functional Programming in Java 8의 Chapter 4을 요약한 내용 입니다.
---

# Chap 04. 람다 표현식을 이용한 설계

자바에서 OOP와 함수형 스타일은 서로 보완관계이며 함께 사용했을 때 상당한 효과를 볼 수 있다. 이 두 가지 방법을 사용하면 수정과 확장이 쉽고 유연하며 효율적인 설계를 할 수 있다.

객체를 사용하는 대신 경량의 함수형 스타일을 사용할 수 있다. 람다 표현식을 사용하여 로직과 함수를 쉽게 분리하고 더욱 쉽게 확장할 수 있다. 람다 표현식을 사용하면 평범한 인터페이스를 좀 더 활용성이 뛰어나고 직관적인 인터페이스로 변화시킬 수 있다.

## 람다를 사용한 문제의 분리

클래스를 만드는 이유는 코드를 재사용하기 위해서이다. 이것은 좋은 의도이기는 하나 항상 올바른 것은 아니다. 고차 함수를 사용하면 클래스의 복잡한 구조 없이도 같은 목적을 달성할 수 있다.

예제를 만들기 위해 Asset 클래스부터 만들어 보자

```java
@Getter
@Setter
public class Asset {
    public enum AssetType { BOND, STOCK }
    private final AssetType type;
    private final int value;

    public Asset(AssetType type, int value) {
        this.type = type;
        this.value = value;
    }
}
```

이제 주어진 asset의 모든 값을 더하는 메서드를 작성해보자

```java
public static int totalAssetValues(final List<Asset> assets){
    return assets.stream().mapToInt(Asset::getValue).sum();
}
```

### 복잡한 문제 다루기

BOND\(채권\) asset에 대해서만 합계를 구한다고 가정해보자

```java
public static int totalBondValues(final List<Asset> assets) {
    return assets.stream().mapToInt(asset -> asset.getType() == AssetType.BOND ? asset.getValue() : 0).sum();
}
```

다음엔 STOCK\(주식\) asset에 대해서만 합계를 구해보자

```java
public static int totalBondValues(final List<Asset> assets) {
    return assets.stream().mapToInt(asset -> asset.getType() == AssetType.ASSET ? asset.getValue() : 0).sum();
}
```

구현은 되었지만 중복된 코드를 사용해 효율적이지 않아 보인다. 어떻게 리팩토링하면 좋을까?

### 중요한 문제를 분리하기 위한 리팩토링

이전에 보여주었던 메서드 대신에 함수형 인터페이스를 파라미터로 갖는 오직 하나의 메서드로 리팩토링해보자

```java
public static int totalAssetValues(
	final List<Asset> assets, 
	final Predicate<Asset> assetPredicate) {
    return assets.stream()
									.filter(assetPredicate)
									.mapToInt(Asset::getValue)
									.sum();
}
```

* filter\(\) 메서드를 사용하여 asset의 리스트를 필터링한다.
* asset을 mapToInt\(\) 함수를 사용하여 각각의 가격에 매핑한다
* 매핑한 가격의 합계를 구한다.

이러한 리팩토링으로 세 개의 일반적인 메서드를 하나의 고차 함수로 변경했으며 이 함수는 주어진 문제에 따라 처리할 수 있도록 하는 경량 정책을 사용하는 기능을 한다.

그럼 실제로 해당 메소드를 사용하여 구현해보자

```java
totalAssetValues(assets, asset -> asset.getType() == AssetType.BOND);
totalAssetValues(assets, asset -> asset.getType() == AssetType.STOCK);
```

람다 표현식을 사용하여 메서드 자체와 우리가 고민해야 할 문제들을 분리했다. 이것은 추가적인 클래스의 생성 없이 스트레티지 패턴에 대한 간단한 사용 예다. 이 패턴은 약간의 고차 함수 사용이 필요하며, 이러한 함수를 사용하는 사람들은 선택 로직을 직접 고민해야 한다. 그러나 이 람다 표현식을 변수들에 저장하고 람다 표현식이 필요할 때 재사용할 수 있다.

## 람다 표현식을 사용하여 델리게이트하기

지금까지 람다 표현식과 스트레지 패턴을 사용하여 메서드로부터 문제를 분리했다. 또한 이러한 문제를 클래스 레벨에서 분리할 수도 있다. 재사용 측면에서 보면 위임\(delegation\)은 상속보다 더 좋은 설계 도구이다. 위임을 사용하면 다양한 구현을 쉽게 만들 수 있으며 좀 더 동적으로 여러 가지 행위\(Behavior\)를 추가할 수도 있다.

### 위임 생성

책임져야 할 부분을 다른 클래스에 위임하기보다는 그 부분을 람다 표현식과 메서드 레퍼런스로 위임하는 것이 더 좋다. 그렇다면 예제를 통해서 확인해보자

```java
public class CalculateNAV {
    private Function<String, BigDecimal> priceFinder;

    public CalculateNAV(Function<String, BigDecimal> priceFinder) {
        this.priceFinder = priceFinder;
    }

    public BigDecimal computeStockWorth(final String ticker, final int shares) {
        return priceFinder.apply(ticker).multiply(BigDecimal.valueOf(shares));
    }
}
```

### 웹 서비스와의 통합

특정 회사의 주식을 계산해보자

```java
final CalculateNAV calculateNav = new CalculateNAV(YahooFinance::getPrice);
```

```java
public class YahooFinance {
    public static BigDecimal getPrice(final String ticker) {
        try {
            final URL url = new URL("<http://inchar.finance.yahoo.com/table.csv?s=>" + ticker);

            final BufferedReader reader = new BufferedReader(new InputStreamReader(url.openStream()));
            final String data = reader.lines().skip(1).findFirst().get();
            final String[] dataItems = data.split(",");
            return new BigDecimal(dataItems[dataItems.length - 1]);
        } catch (Exception ex){
            throw new RuntimeException(ex);
        }
    }
}
```

getPrice\(\) 메서드에서 Tahoo 웹 서비스에 Request를 전달하고 주식가격을 추출하기 위해 Response를 파싱한다. 결과적으로 코드가 실행되면 구글 주식 100주에 대한 가치를 확인할 수 있다.

그리고 람다 표현식 내부에서 처리하는 것보다 예외 처리를 어디서 해야 하는지 그 위치를 정해야 할 필요가 있다. 이렇게 하면 예외 처리를 다시 발생시켜 업스트림\(upstream\)으로 처리할 수 있도록 해준다.

## 람다 표현식을 사용한 데코레이팅

지금까지는 위임\(Delegate\) 인터페이스를 지원하기 위한 클래스의 구현 부분을 만들지는 않았다. 이제 이 인터페이스를 구현해야 하며, 제대로 동작하도록 해야 한다. 위임은 뛰어난 기능이지만 여기에 더해 위임을 체인으로 묶어서 행위를 추가할 수 있다면 더 유용하게 사용할 수 있다.

데코레이터 패턴은 강력하지만 프로그래머는 종종 이기능을 사용하는 것에 대해 주저한다. 이유는 클래스와 인터페이스의 계층에 대해 부담을 느끼기 때문이다.

### 필터 설계

Camera 예제를 만들고 캡처한 칼라를 처리하는 필터들을 사용하자

```java
public class Camera {
    private Function<Color, Color> filter;
    
    public Color capture(final Color inputColor){
        final Color processedColor = filter.apply(inputColor);
        // more processing of color
        return processedColor;
    }
}
```

apply\(\) 추상 메서드의 추가와 함께 Function 인터페이스는 디폴트 메서드이며 compose\(\)는 여러 Function을 조합하거나 연결한다. Function 파라미터를 람다 표현식으로 대체하면, 이 메서드를 쉽게 사용할 수 있다. compose\(\) 메서드는 두 개의 Function을 조합하거나 연결한다.

```java
public void setFilters(final Function<Color, Color>... filters) {
    filter = Stream.of(filters)
                   .reduce((filter, next) -> filter.compose(next))
                   .orElse(color -> color);
}
```

* setFilters\(\) 메서드에서 각 필터를 이터레이션하고 compose\(\) 메서드를 사용하여 각 필터들을 하나의 연결로 조합한다.
* 필터가 없다면 reduce\(\) 메서드가 Optional.empty를 리턴한다.
* empty일 경우에 orElse\(\) 메서드에 대한 인수로 더미 필터를 제공한다.

### 필터 추가

필터를 추가하는 것은 간단하다. 이제 필터를 setFilters\(\) 메서드에 전달하면 된다.

```java
public static void main(String[] args) {
    Camera camera = new Camera();
    camera.setFilters(Color::brighter, Color::darker);
}
```

이제 두 개의 필터는 연결되었고 Camera 인스턴스에 있는 filter 레퍼런스는 체인의 헤드를 참조한다.

## 디폴트 메서드 들여다보기

디폴트 메서드는 람다 표현식이나 함수형 스타일의 프로그래밍과 밀접한 관계는 없다. 그러나 컬렉션에 존재하는 많은 메서드가 디폴트 메서드 없이는 불가능하다.

인터페이스의 진화가 디폴트 메서드가 탄생하게 된 중요한 배경이다. 인터페이스를 사용해서 설계할 때 디폴트 메서드를 사용하게 된다. 디폴트 메서드의 행위\(behavior\)에 대해 알아보고 클래스와 어떻게 섞어서 사용하는지 알아보자

#### 자바 컴파일러는 디폴트 메서드를 사용하기 위해 다음과 같은 간단한 규칙을 따른다.

1. 서브 타입은 슈퍼 타입으로부터 자동으로 디폴트 메서드를 넘겨받는다.
2. 디폴트 메서드를 사용하는 인터페이스에서는 서브 타입에서 구현된 디폴트 메서드는 슈퍼 타입에 있는 것보다 우선한다.
3. 추상 선언을 포함하여 클래스에 있는 구현은 모든 인터페이스의 디폴트보다 우선한다.
4. 두 개 이상의 디폴트 메서드의 구현이 충돌하는 경우 혹은 두 개의 인터페이스에서 디폴트 추상 충돌\(default-abstract conflict\)이 발생하는 경우, 상속하는 클래스가 명확하게 해야 한다.

위 규칙에 대해 좀 더 잘 이해하기 위해서 디폴트 메서드를 사용하는 예제를 만들어보자

```java
public interface Fly {
    default void takeOff() { System.out.println("Fly::takeOff"); }
    default void land() { System.out.println("Fly::land"); }
    default void turn() { System.out.println("Fly::turn"); }
    default void cruise() { System.out.println("Fly::cruise"); }
}

public interface FastFly extends Fly {
    default void takeOff() { System.out.println("FastFly::takeOff"); }
}

public interface Sail {
    default void turn() { System.out.println("Sail::turn"); }
    default void cruise() { System.out.println("Sail::cruise"); }
}

public class Vehicle {
    void turn() { System.out.println("Vehicle::turn"); }
}
```

```java
public class SeaPlane extends Vehicle implements FastFly, Sail {
    private int alititude;
}
```

SeaPlane 클래스는 현재 컴파일 오류가 발생한다. default method와 충돌이 나면 인텔리제이에서는 구현된 모든 default 메소드를 다시 구현하라고 경고 문구를 알려준다.

![](../../.gitbook/assets/222%20%287%29.png)

그런데 이는 IDE마다 다를 수 있다. 만약 오류가 안난다고 가정한다면 다음과 같은 예를 실행해보자.

```java
SeaPlane seaPlane = new SeaPlane();
seaPlane.takeOff();
seaPlane.turn();
seaPlane.cruise();
seaPlane.land();
```

결과를 확인해보자

```java
FastFly::takeOff
Vehicle::turn
SeaPlane::cruise currently cruise like: Sail::cruise
Fly::land
```

인터페이스에서는 단지 추상 메서드만이 가능했었다. 이런 점을 보면 인터페이스가 추상 클래스의 형태로 진화한 것처럼 보이지만, 그렇지는 않다. 추상 클래스는 상태를 갖지만 인터페이스는 그렇지 못하다. 다중 인터페이스에서 클래스를 상속\(구현\)할 수 있지만, 하나의 추상 클래스로부터 상속\(확장\)할 수 있다.

## 람다 표현식을 사용하여 인터페이스를 풍부하게 만들기

이제 람다 표현식이 클래스의 외부와 인터페이스를 형성하는 데 어떻게 도움을 주는지에 대해 알아보자

### 설계부터 시작하기

간단한 Mailer 클래스를 사용해서 이 클래스의 인터페이스를 조금씩 향상시켜 보자

```java
public class Mailer {
    public void from(final String address){ System.out.println("Mailer::from"); }
    public void to(final String address){ System.out.println("Mailer::to"); }
    public void subject(final String address){ System.out.println("Mailer::subject"); }
    public void body(final String address){ System.out.println("Mailer::body"); }
    public void send(final String address){ System.out.println("Mailer::send"); }
}
```

이제 Mailer를 사용하는 코드를 작성해보자

```java
public static void main(String[] args) {
    Mailer mailer = new Mailer();
    mailer.from("bluesky761@naver.com");
    mailer.to("bluesky761@naver.com");
    mailer.subject("test subject");
    mailer.body("test content");
    mailer.send();
}
```

이런 코드는 보기 어렵다.

* 비슷한 반복이 너무 많다
* mailer를 너무 많이 반복하고 있다
* 두 번째 호출의 끝부분에 mailer 인스턴스를 사용하여 무슨 일을 하고 있는지 한눈에 보이지 않는다.
* 다른 호출에서 재사용하기 힘들다
* 일회성 코드로 보인다.
* 전체적인 인스턴스의 기능이 보이지 않는다.

### 메서드 체인 사용하기

두 가지 해결해야 할 것이 있다.

* 하나는 반복해서 사용하는 mailer 레퍼런스
* 명확하지 않은 객체의 라이프타임

레퍼런스를 반복하기보다 컨텍스트 객체의 상태를 계속 유지하는 것이 더 명확하다. 간단한 메서드 체인 혹은 cascade method pattern을 사용하여 구현해보자.

#### 체이닝 할 수 있도록 MailBuilder 클래스를 생성해보자.

```java
public class MailerBuilder {
    public MailerBuilder from(final String address){ System.out.println("Mailer::from"); }
    public MailerBuilder to(final String address){ System.out.println("Mailer::to"); }
    public MailerBuilder subject(final String subject){ System.out.println("Mailer::subject"); }
    public MailerBuilder body(final String content){ System.out.println("Mailer::body"); }
    public void send(){ System.out.println("Mailer::send"); }
}
```

새로운 인터페이스는 이전 버전에 비해 사용성이 좋아졌다. 반복된 변수 이름을 제거했고 호출을 연결했다.

```java
new MailerBuilder().from("bluesky761@naver.com")
                   .to("bluesky761@naver.com")
                   .subject("test subject")
                   .body("test content")
                   .send();
```

이러한 설계가 불필요한 작업을 줄일 수는 있지만 약간의 단점도 있다. 새로운 키워드인 new 때문이다. new를 사용하게 되면 API의 다양성과 가독성을 떨어뜨린다. 예를 들어, from\(\)과 같은 메서드가 정확히 한 번만 호출됐다는 것을 보장해야 할 필요가 있다. 이것들을 좀 더 직관적이고 풍성하도록 하기 위해 설계를 수정할 필요가 있다. 이제 지금까지 익힌 람다 표현식을 사용해보자

### API를 직관적이고 풍성하게 만들기

설계를 좀 더 진화시켜보자

```java
public class FluentMailer {

    private FluentMailer() {}

    public FluentMailer from(final String address) {
        System.out.println("Mailer::from");
        return this;
    }

    public FluentMailer to(final String address) {
        System.out.println("Mailer::to");
        return this;
    }

    public FluentMailer subject(final String subject) {
        System.out.println("Mailer::subject");
        return this;
    }

    public FluentMailer body(final String content) {
        System.out.println("Mailer::body");
        return this;
    }

    public void send(final Consumer<FluentMailer> block) {
        final FluentMailer mailer = new FluentMailer();
        block.accept(mailer);
        System.out.println("sending....");
    }
}
```

메서드 체인 버전처럼 모든 비종단 메서드는 인스턴스를 리턴한다. 게다가, 이 버전에서 생성자 private를 만들었다. 이것은 직접 객체 생성을 허용하지는 않는다. 또한 종단 메서드 send\(\)는 정적 메서드이며 파라미터로 Consumer를 사용한다. 이 방법은 약간 우회하는 방법처럼 느껴지지만, 앞에서 언급한 문제는 제거했다. 객체 스코프는 블록 안으로 한정되고, send\(\) 메서드로부터 한번 리턴하면 레퍼런스는 이제 끝난다. 또한 블록 안의 풀족한 메서드 페인으로부터 이점을 얻을 수도 있다.

이제 새로운 API를 사용한 예제를 보자

```java
public static void main(String[] args) {
    new FluentMailer().send(mailer -> mailer.from("bluesky761@naver.com")
                                            .to("bluesky761@naver.com")
                                            .subject("test subject")
                                            .body("test content"));
}
```

인스턴스의 스코프는 쉽게 알 수 있다. 해당 인스턴스를 얻고, 그 인스턴스를 사용하여 작업하며, 리턴한다. 이러한 이유로 인해 이것을 론 패턴\(load pattern\)이라고 한다.

## 예외 처리 다루기

람다 표현식의 컨텍스트에 있는 예외들을 다루기 위한 몇 가지 옵션에 대해 알아보자. path 이름의 리스트를 얻어와서 getCanonicalPath\(\) 메서드를 사용하여 canonical 패스를 요청한다.

```java
public class HandleException {

    public static void main(String[] args) throws IOException {
        Stream.of("/usr", "/tmp")
							.map(path -> new File(path).getCanonicalPath())
							.forEach(System.out::println);
    }
}
```

throw 문을 사용하였지만 자바 컴파일러 에러는 여전히 존재한다. 에러는 map\(\) 메서드에 넘겨진 람다 표현식에서 발생했다. Function 인터페이스의 apply\(\) 메서드는 어떤 체크된 예외도 설정하지 않는다. 따라서 이 예제의 추상 메서드에서 사용한 람다 표현식은 체크된 예외 처리를 발생하는 것이 허용되지 않는다.

여기에 두 가지 옵션으로 제한한다.

* 람다 표현식의 적절한 위치에서 예외를 처리한다
* 예외를 캐치한 후에 언체크 예외로 다시 발생시킨다.

첫 번째 옵션으로 해결해보자

```java
public static void main(String[] args) throws IOException {
    Stream.of("/usr", "/tmp").map(path -> {
        try {
            return new File(path).getCanonicalPath();
        } catch (IOException ex) {
            return ex.getMessage();
        }
    }).forEach(System.out::println);
}
```

예외를 처리하는 대신, 캐치에서 throw new RuntimeException\(ex\);를 리턴할수도 있고 예외를 퍼트릴 수도 있다.

동시 실행의 경우에, 람다 표현식에서 발생하는 예외는 자동적으로 주 스레드를 호출하는 쪽으로 퍼져나간다. 여기에는 두 개의 작은 문제점이 있다.

* 예외 처리가 종료되지 못하거나 동시에 실행하는 다른 람다 표현식의 실행을 방해할 수 있다.
* 예외 처리가 다중 동시 실행으로부터 발생한다면, 그들 중 하나만 캐치 블록에서 리포트된다.

특정 요구에 따라 고차 함수를 설계할 때, 대응하는 함수형 인터페이스를 더 유연하게 설계할 수 있다.

```java
public interface UserInstance<T, X extends Throwable> {
    void accept(T instance) throws X;
}
```

UserInstance 인터페이스의 파라미터를 받는 어떤 메서드라도 적절한 예외 처리를 할 준비가 되어 있고 그 예외를 전파할 수 있는 준비가 되어 있다. 예를 들어 IOException이나 SQLException과 같은, 파라미터 타입 X는 적어도 이 예외의 상한선\(upper-bound\)로 모델링 되어야 한다. 이것을 예외를 발생하지 않는 람다 표현식으로 모델링하고자 하면, 파라미터 타입 X는 Runtime Exception으로 모델링되어야 한다.

## 정리

* 람다 표현식은 단순히 프로그래밍 언어의 기능이 아니다
* 매우 강력한 기능일 뿐 아니라 경량화 설계툴이기도 하다
* 인터페이스와 클래스의 구조를 생성하는 데 많은 노력을 쏟는 대신에 람다 표현식으로 함수형 인터페이스와 패스를 재사용할 수 있으며 메서드 레퍼런스도 사용할 수 있다.
* 전략 패턴, 데코레이터 패턴을 람다 표현식으로 쉽게 구현할 수 있다.
* 람다 표현식과 함께 사용할 때 발생할 수 있는 예외를 어떻게 처리해야 하는지 주의해야 한다.

