---
layout: reference
title: 아이템30 이왕이면 제네릭 메서드로 만들라
date: '2020-03-10T00:00:00.000Z'
categories: effective
summary: Effective Java 3e 아이템 30을 요약한 내용 입니다.
navigation_weight: 30
---

# 2020-03-20-effective-30item

> Effective Java 3e 아이템 30를 요약한 내용 입니다.

`매개변수화 타입`을 받는 `정적 유틸리티 메서드`는 보통 제네릭이다. 예컨대 Collections의 '알고리즘' 메서드\(`binarySearch`, `sort` 등\)는 모두 제네릭이다.

```java
public static Set union(Set s1, Set s2) {
    Set result = new HashSet(s1);
    result.addAll(s2);
    return result;
}
```

### 이 메서드를 타입 안전하게 만들어보자

메서드 선언에서 세 집합\(입력 2개, 반환 1개\)의 원소 타입을 타입 매개변수로 명시하고, 메서드 안에서도 이 타입 `매개변수`만 사용하게 수정하면 된다.

```java
public static Set<E> union(Set<E> s1, Set<E> s2) {
    Set<E> result = new HashSet(s1);
    result.addAll(s2);
    return result;
}
```

**때때로 불변 객체를 여러 타입으로 활용할 수 있게 만들어야 할 때가 있다.** 제네릭은 `런타임`에 타입 정보가 소거되므로 하나의 객체를 어떤 타입으로든 `매개변수화`할 수 있다. 하지만 이렇게 하려면 요청한 타입 매개변수에 맞게 매번 그 객체의 타입을 바꿔주는 `정적 팩터리`를 만들어야 한다. 이 패턴을 `제네릭 싱글턴 팩터리`라 한다.

```java
// 제네릭 싱글턴 팩터리 예제(Collections.emptySet)
public static final <T> Set<T> emptySet() {
    return (Set<T>) EMPTY_SET;
}

/**
    * @serial include
    */
private static class EmptySet<E>
    extends AbstractSet<E>
    implements Serializable
{
    private static final long serialVersionUID = 1582296315990362920L;

    public Iterator<E> iterator() { return emptyIterator(); }

    public int size() {return 0;}
    public boolean isEmpty() {return true;}

    public boolean contains(Object obj) {return false;}
    public boolean containsAll(Collection<?> c) { return c.isEmpty(); }

    public Object[] toArray() { return new Object[0]; }

    public <T> T[] toArray(T[] a) {
        if (a.length > 0)
            a[0] = null;
        return a;
    }

    // Override default methods in Collection
    @Override
    public void forEach(Consumer<? super E> action) {
        Objects.requireNonNull(action);
    }
    @Override
    public boolean removeIf(Predicate<? super E> filter) {
        Objects.requireNonNull(filter);
        return false;
    }
    @Override
    public Spliterator<E> spliterator() { return Spliterators.emptySpliterator(); }

    // Preserves singleton property
    private Object readResolve() {
        return EMPTY_SET;
    }
}

public class CollectionsEmptySetExample1 {
    public static void main(String[] args) {
        //Create an empty Set
        Set<String> EmptySet = Collections.<String>emptySet();
        System.out.println("Empty Set: "+EmptySet);
    }
}

// result : Empty Set: []
```

위 코드는 `제네릭 싱글턴`을 사용하는 코드이다. 이전과 동일하게 `형변환`을 하지 않아도 컴파일 오류나 경고가 발생하지 않는다.

### 또는, 자기 자신이 들어간 표현식을 사용하여 타입 매개변수의 `허용 범위`를 한정할 수 있다.

바로 재귀적 타입 한정이라는 개념이다. `재귀적 타입 한정`은 주로 타입의 자연적 순서를 정하는 `Comparable` 인터페이스와 함께 쓰인다.

```java
public interface Comparable<T> {
    int compareTo(T o);
}
```

`Comparable`을 구현한 원소의 컬렉션을 입력 받는 메서드들은 주로 그 원소들을 `정렬` 혹은 `검색`하거나, `최솟값`이나 `최댓값`을 구하는 식으로 사용된다. 다음은 이 제약을 코드로 표현한 모습이다.

```java
public static <E extends Comparable<E>> E max(Collection<E> c) {
    if (c.isEmpty())
    throw new IllegalArgumentException("컬렉션이 비어 있습니다.");

    E result = null;
    for (E e : c)
    if (result == null || e.compareTo(result) > 0)
        result = Objects.requireNonNull(e);

    return result;
}
```

타입 한정인 `<E extends Comparable<E>>`는 "**모든 타입 E는 자신과 비교할 수 있다**"라고 읽을 수 있다.

## 정리

`제네릭 타입`과 마찬가지로, 클라이언트에서 `입력 매개변수`와 `반환값`을 명시적으로 `형변환`해야 하는 메서드보다 `제네릭 메서드`가 더 안전하며 사용하기도 쉽다. 타입과 마찬가지로, 메서드도 형변환 없이 사용할 수 있는 편이 좋으며, 많은 경우 그렇게 하려면 제네릭 메서드가 되어야 한다.

