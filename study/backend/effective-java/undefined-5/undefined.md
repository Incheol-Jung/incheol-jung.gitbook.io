---
description: Effective Java 3e 아이템 46를 요약한 내용 입니다.
---

# 아이템46 스트림에는 부작용 없는 함수를 사용하라

스트림은 그저 또 하나의 API가 아닌, 함수형 프로그래밍에 기초한 패러다임이다. 스트림이 제공하는 표현력, 속도, \(상황에 따라서는\) 병렬성을 얻으려면 API는 말할 것도 없고 이 패러다임까지 함께 받아들여야 한다.

스트림 패러다임의 핵심은 계산을 일련의 변환으로 재구성하는 부분이다. 이때 각 변환 단계는 가능한 한 이전 단계의 결과를 받아 처리하는 순수 함수여야 한다. 순수 함수란 오직 입력만이 결과에 영향을 주는 함수를 말한다. 이렇게 하려면 \(중간 단계든 종단 단계든\) 스트림 연산에 건네는 함수 객체는 모두 부작용이 없어야 한다.

다음은 주위에서 종종 볼 수 있는 스트림 코드로, 텍스트 파일에서 단어별 수를 세어 빈도표로 만드는 일을 한다.

```text
Map<String, Long> freq = new HashMap<>();
try (Stream<String> words = new Scanner(file).tokens()) {
	words.forEach(word -> {
		freq.merge(word.toLowerCase(), 1L, Long::sum;
	});
}
```

이는 스트림 코드를 가장한 반복적 코드다. 스트림 API의 이점을 살리지 못하였다. 이 코드의 모든 작업이 종단 연산인 forEach에서 일어나는데, 이때 외부 상태\(빈도표\)를 수정하는 람다를 실행하면서 문제가 생긴다. forEach가 그저 스트림이 수행한 연산 결과를 보여주는 일 이상을 하는 것을보니 나쁜 코드일 것 같은 냄새가 난다.

forEach 연산은 종단 연산 중 기능이 가장 적고 가장 '덜' 스트림하다. 대놓고 반복적이라서 병렬화할 수도 없다. forEach 연산은 스트림 계산 결과를 보고할 때만 사용하고, 계산하는 데는 쓰지 말자.

위의 코드는 아래와 같이 개선될 수 있다.

```text
Map<String, Long> freq;
try (Stream<String> words = new Scanner(file).tokens()) {
	freq = words.
					collection(groupingBy(String::toLowerCase, counting()));
}
```

## 스트림의 다양한 예제를 살펴보자

수집기가 생성하는 객체는 일반적으로 컬렉션이며, 그래서 "collector"라는 이름을 쓴다.

수집기를 사용하면 스트림의 원소를 손쉽게 컬렉션으로 모을 수 있다.

### 빈도표에서 가장 흔한 단어 10개를 뽑아내는 파이프라인

```text
List<String> topTen = freq.keySet().stream()
	.sorted(comparing(freq::get)).revered()
	.limit(10)
	.collect(toList());
```

comparing 메서드는 키 추출 함수를 받는 비교자 생성 메서드다.

예컨대 다양한 음악가의 앨범들을 담은 스트림을 가지고, 음악가와 그 음악가의 베스트 앨범을 연관 짓고 싶다고 해보자.

### 열거 타입 상수의 문자열을 표현을 열거 타입 자체에 매핑

```text
private static final Map<String, Operation> stringToEnum =
        Stream.of(values()).collect(toMap(Object::toString, e -> e));
```

toMap 형태는 스트림의 각 원소가 고유한 키에 매핑되어 있을 때 적합하다. 스트림 원소 다수가 같은 키를 사용한다면 파이프라인이 IllegalStateException을 던지며 종료될 것이다.

### 각 키와 해당 키의 특정 원소를 연관 짓는 맵을 생성하는 수집기

```text
Map<Artist, Album> topHits = albums.collect(
	toMap(Album::artist, a->a, maxBy(comparing(Album::sales))));
```

위의 코드를 말로 풀어보자면 "앨범 스트림을 맵으로 바꾸는데, 이 맵은 각 음악가와 그 음악가의 베스트 앨범을 짝지은 것이다"는 이야기다.

### 그 외

* groupingBy의 사촌격인 partitioningBy도 있다. 분류 함숭 자리에 프레디키드\(predicate\)를 받고 키가 Boolean인 맵을 반환한다.
* Stream의 count 메서드를 직접 사용하여 같은 기능을 수행할 수 있으니 collect\(counting\(\)\) 형태로 사용할 일은 전혀 없다. Collections에는 이런 속성의 메서드가 16개나 더 있다. 그중 9개는 이름이 summing, averaging, summarizing 으로 시작하며, 각각 int, long, double 스트림용으로 하나씩 존재한다.
* minBy, maxBy는 인수로 받은 비교자를 이용해 스트림에서 값이 가장 작은 혹은 가장 큰 원소를 찾아 반환한다.
* Collectors의 joining 메서드는 CharSequence 인스턴스의 스트림에만 적용할 수 있다. 이 메소드는 연결 부위에 구분문자를 삽입하는데, 예컨대 구분문자로 쉼표\(,\)를 입력하면 CSV 형태의 문자열을 만들어준다.

### 정리

스트림 파이프라인 프로그래밍의 핵심은 부작용 없는 함수 객체에 있다. 스트림뿐 아니라 스트림 관련 객체에 건네지는 모든 함수 객체가 부작용이 없어야 한다. 종단 연산 중 forEach는 스트림이 수행한 계산 결과를 보고할 때만 이용해야 한다. 계산 자체에는 이용하지 말자. 스트림을 올바로 사용하려면 수집기를 잘 알아둬야 한다. 가장 중요한 수집기 팩터리는 toList, toSet, toMap, groupingBy, joining이다.

