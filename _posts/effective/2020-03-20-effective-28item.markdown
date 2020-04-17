---
layout: reference
title: "아이템28 배열보다는 리스트를 사용하라"
date: 2020-03-10 00:00:00
categories: effective
summary: Effective Java 3e 아이템 28을 요약한 내용 입니다.
navigation_weight: 28
---

> Effective Java 3e 아이템 28를 요약한 내용 입니다.

`배열`과 `제네릭 타입`에는 중요한 차이가 두 가지 있다.

## 배열은 공변이다.

`Sub`가 `Super`의 하위 타입이라면 배열 `Sub[]`는 배열 `Super[]`의 `하위 타입`이 된다. 반면 제네릭은 `불공변`이다. **이것만 보면 제네릭에 문제가 있다고 생각할 수도 있지만 사실 문제가 있는 건 배열 쪽이다.**

```java
Object[] objectArray = new Long[1];
objectArray[0] = "타입이 달라 넣을 수 없다."; // ArrayStoreException을 던진다.
```

다음 코드도 살펴 보자

```java
List<Object> ol = new ArrayList<Long>(); // 호환되지 않는 타입이다.
ol.add("타입이 달라 넣을 수 없다.");
```

어느 쪽이든 `Long`용 저장소에 String을 넣을 수는 없다. 다만 배열 에서는 그 실수를 `런타임`에야 알게 되지만, 리스트를 사용하면 컴파일할 때 바로 알 수 있다.

## 배열은 실체화가 된다.

배열은 `런타임`에도 자신이 담기로 한 원소의 타입을 인지하고 확인한다. 그래서 이전 예제에서 보듯이 `Long` 배열에 `String`을 넣으려 하면 `ArrayStoreException`이 발생한다. 반면, 앞서 이야기했듯 `제네릭`은 타입 정보가 `런타임`에는 소거된다.

이상의 주요 차이로 인해 `배열`과 `제네릭`은 잘 어우러지지 못한다. 배열은 `제네릭 타입`, `매개변수화 타입`, `타입 매개변수`로 사용할 수 없다. 즉, 코드를 `new List<E>[]`, `new List<String>[]`, `new E[]` 식으로 작성하면 컴파일할 때 제네릭 배열 생성 오류를 일으킨다.

### 제네릭 배열을 만들지 못하게 막은 이유는 무엇일까?

**타입 안전하지 않기 때문이다.** 이를 허용한다면 컴파일러가 자동 생성한 형변환 코드에서 런타임에 `ClassCastException`이 발생할 수 있다.

`E`, `List<E>`, `List<String>` 같은 타입을 `실체화 불가 타입`이라 한다. 실체화 되지 않아서 런타임에는 컴파일 타임보다 타입 정보를 적게 가지는 타입이다. `소거 메커니즘` 때문에 매개 변수화 타입 가운데 실체화 될 수 있는 타입은 `List<?>`와 `Map<?,?>`같은 `비 한정적 와일드 카드` 타입뿐이다.

### 배열을 제네릭으로 만들 수 없어 귀찮을 때도 있다.

`**제네릭 컬렉션`에서는 자신의 원소 타입을 담은 배열을 반환하는 게 보통은 불가능하다.\*\* 또한 제네릭 타입과 `가변 인수 메서드`를 함께 쓰면 해석하기 어려운 경고 메시지를 받게 된다. 이 문제는 `@SafeVarargs` 에너테이션으로 대처할 수 있다.

> @SafeVarargs는 구체적으로 어떻게 사용할 수 있을까?<br/>
> 제네릭을 가변 매개변수로 사용한 경우 잠재적 에러에 대한 경고를 무시할 수 있다.<br/>
> @SuppressWarning를 이용하여 제네릭 매개변수에 대한 경고 무시를 대체하기 위해 나옴

```java
public class JavaExample{  
    @SafeVarargs
    private void print(List... names) {  
        for (List<String> name : names) {  
            System.out.println(name);  
        }  
    }  
    public static void main(String[] args) {  
        JavaExample obj = new JavaExample();  
        List<String> list = new ArrayList<String>();  
        list.add("Kevin");  
        list.add("Rick"); 
        list.add("Negan");
        obj.print(list);  
    }      
}
```

배열로 형변환 할 때 제네릭 배열 생성 오류나 `비검사 형변환` 경고가 뜨는 경우 대부분은 배열인 `E[]` 대신 컬렉션인 `List<E>`를 사용하면 해결된다. 코드가 조금 `복잡`해지고 `성능`이 살짝 나빠질 수도 있지만, 그 대신 타입 안전성과 `상호 운용성`은 좋아진다.

```java
public class Chooser {
    private final Object[] choiceArray;

    public Chooser(Collection<T> choices) {
    choiceArray = choises.toArray();
    }

    public Object choose() {
    Random rnd = ThreadLocalRandom.current();
    return choiceArray[rnd.nectint(choiceArray.length)];
    }
}
```

위 클래스는 매번 형 변환해야 하니 리팩토링이 필요하다.

```java
public class Chooser<T> {
    private final List<T> choiceList;

    public Chooser(Collection choices) {
    choiceList = new ArrayList<>(choises);
    }

    public Object choose() {
    Random rnd = ThreadLocalRandom.current();
    return choiceList.get(rnd.nextint(choiceList.size()));
    }
}
```

이전 예제보다 코드양이 조금 늘었고 아마도 조금 더 느릴 테지만, 런타임에 `ClassCastException`을 만날 일은 없으니 그만한 가치가 있다.

## 정리

**제네릭은 `불공변`이고 타입 정보가 소거된다.** 그 결과 배열은 런타임에는 타입 안전하지만 컴파일 타임에는 그렇지 않다. 제네릭은 반대다. 그래서 둘을 섞어 쓰기란 쉽지 않다. 둘을 섞어 쓰다가 `컴파일 오류`나 경고를 만나면 가장 먼저 배열을 리스트로 `대체`하는 방법을 적용해보자.

## 출처

- [https://blog.itthis.me/115](https://blog.itthis.me/115)
-
