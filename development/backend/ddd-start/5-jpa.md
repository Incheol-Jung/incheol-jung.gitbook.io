---
description: 최범균의 DDD START! 5장을 요약한 내용입니다.
---

# 5장 리포지터리의 조회 기능\(JPA 중심\)

## 검색을 위한 스펙

리포지터리에서 애그리거트를 찾을 때 식별자를 이용하는 것이 기본이지만 식별자 외에 다양한 조건으로 애그럭트를 찾아야 할 때가 있다. 검색 조건이 다양할 경우 스펙\(Specification\)을 이용해서 문제를 풀어야 한다.

```java
public interface Specification<T> {
	public boolean isSatisfiedby(T agg);
}
```

isSatisfiedby\(\) 메서드는 검사 대상 객체가 조건을 충족하면 true를 리턴하고, 그렇지 않으면 false를 리턴한다.

```java
public class OrdererSpec implements Specification<Order> {
	private String ordererId;

	public boolean isSatisfiedBy(Order agg) {
		return agg.getOrdererId().getMemberId().getId().equals(ordererId);
	}
}
```

클라이언트는 리포지터리에 전달해 주기만 하면 된다.

```java
Specification<Order> ordererSpec = new OrdererSpec("madvirus");
List<Order> orders = orderRepository.findAll(ordererSpec);
```

### 스펙 조합

스펙의 장점은 조합에 있다. 두 스펙을 AND 연산자나 OR 연산자로 조합해서 새로운 스펙을 만들 수 있고 조합한 스펙을 다시 조합해서 더 복잡한 스펙을 만들 수 있다.

```java
Specification<Order> ordererSpec = new OrdererSpec("madvirus");
Specification<Order> ordererDateSpec = new OrdererDateSpec(fromDate, toDate);
AndSpec<T> spec = new AndSpec(ordererSpec, orderDateSpec);

List<Order> orders = orderRepository.findAll(spec);
```

## JPA를 위한 스펙 구현

앞서 보여준 리포지터리 코드는 모든 애그리거트를 조회한 다음에 스펙을 이용해서 걸러내는 방식이라 성능상 문제가 있다.

실제 구현에서는 쿼리의 where 절에 조건을 붙여서 필요한 데이터를 걸러야 한다.

### JPA 스펙 구현

JPA는 다양한 검색 조건을 조합하기 위해 CreteriaBuilder와 Predicate를 사용하므로 JPA를 위한 스펙은 CriteriaBuilder와 Predicate를 이용해서 검색 조건을 구현해야 한다.

```java
package com.myshop.common.jpaspec;

public interface Specification<T> {
	Predicate toPredicate(Root<T> root, CriteriaBuilder db);
}
```

Specification 인터페이스로 Order 스펙을 구현해보자

```java
public class OrdererSpec implements Specification<Order> {
	private String ordererId;

	public Predicate toPredicate(Root<Order> root, CriteriaBuilder cb) {
		return cb.equal(root.get(Order_.orderer)
											.get(Orderer_.memberId).get(MemberId_.id),
										ordererId);
	}
}
```

클라이언트는 원하는 스펙을 생성하고 리포지터리에 전달해서 검색하면 된다.

```java
Specification<Order> ordererSpec = new OrdererSpec("madvirus");
List<Order> orders = orderRepository.findAll(ordererSpec);
```

Order\_.orderer 코드가 있는데 Order\_ 클래스는 JPA의 정적 메타 모델을 정의한 코드이다. 정적 메타 모델은 @StaticMetamodel 애노테이션을 이용해서 관련 모델을 지정한다. 정적 메타 모델 클래스는 대상 모델의 각 프로퍼티와 동일한 이름을 갖는 정적 필드를 정의한다.

Specification 구현 클래스를 개별적으로 만들지 않고 별도 클래스에 스펙 생성 기능을 모아도 된다.

```java
public class OrderSpecs {
	public static Specification<Order> orderer(String ordererId) {
		return (root, cb) -> cb.equal(
			root.get(Order_.orderer).get(Orderer_.memberId).get(MemberId_.id),
			ordererId);
		}

	public static Specification<Order> between(Date from, Date to) {
		return (root, cb) -> cb.between(root.get(Order_.orderDate), from, to);
	}
}
```

