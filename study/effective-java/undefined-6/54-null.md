---
description: Effective Java 3e 아이템 54를 요약한 내용 입니다.
---

# 아이템 54 null이 아닌, 빈 컬렉션이나 배열을 반환하라

다음은 주변에서 흔히 볼 수 있는 메서드다

#### 컬렉션이 비었으면 null을 반환한다. \(절대 따라 하면 안되는 코드이다\)

```java
private final List<Cheese> cheesesInStock = ...;

/**
 * @return 매장 안의 모든 치즈 목록을 반환한다.
 * 	단, 재고가 하나도 없다면 null을 반환한다.
 */
public List<Cheese> getCheeses() {
	return cheesesInStock.isEmtpy() ? null
		: new ArrayList<>(cheesesInStock);
}
```

재고가 없다고 해서 특별히 취급할 이유는 없다. 그럼에도 이 코드처럼 null을 반환한다면, 클라이언트는 이 null을 처리하는 코드를 추가로 작성해야 한다.

```java
List<Cheese> cheeses = shop.getCheeses();
if (cheeses != null && cheeses.contains(Cheese.M\\ozzarell
	...
}
```

null을 반환하려면 반환하는 쪽에서도 이 상황을 특별히 취급해줘야 해서 코드가 더 복잡해진다.

### 빈 컨테이너보다는 null을 반환하는 것이 나을까?

이는 두 가지 면에서 틀린 주장이다.

1. 성능 분석 결과 이 할당이 성능 저하의 주범이라고 확인되지 않는 한 이정도의 성능 차이는 신경 쓸 수준이 못 된다.
2. 빈 컬렉션과 배열은 굳이 새로 할당하지 않고도 반환할 수 있다.

가능성은 작지만, 사용 패턴에 따라 빈 컬렉션 할당이 성능을 눈에 띄게 떨어뜨릴 수도 있다. 이는 불변 컬렉션을 반환하는 것이다. 왜냐하면 불변 객체는 자유롭게 공유해도 안전하기 때문이다. \(ex. Collections.emptyList, Collections.emptySet, Collections.emptyMap\)

단, 이 역시 최적화에 해당하니 꼭 필요할 때만 사용하자. 최적화가 필요하다고 판단되면 수정 전화 후의 성능을 측정하여 실제로 성능이 개선되는지 꼭 확인하자

이는 배열을 사용할 때도 마찬가지다. 절대 null을 반환하지 말고 길이가 0인 배열을 반환하라.

```java
private static final Cheese[] EMTPY_CHEESE_ARRAY = new Cheese[0];

public Cheese[] getCheeses() {	
	return cheesesInStock.toArray(EMTPY_CHEESE_ARRAY);
}
```

길이 0짜리 배열을 미리 선언해두고 매번 그 배열을 반환하면 된다. 길이 0인 배열은 모두 불변이기 때문이다.

## 정리

null이 아닌, 빈 배열이나 컬렉션을 반환하라. null을 반환하는 API는 사용하기 어렵고 오류 처리 코드도 늘어난다. 그렇다고 성능이 좋은 것도 아니다.

