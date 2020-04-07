---
layout: reference
title: "아이템21 인터페이스는 구현하는 쪽을 생각해 설계하라"
date: 2020-03-10 00:00:00
categories: effective
summary: Effective Java 3e 아이템 21을 요약한 내용 입니다.
navigation_weight: 21
---

> Effective Java 3e 아이템 21를 요약한 내용 입니다.

자바 8에 와서 기존 인터페이스에 메서드를 추가할 수 있도록 `디폴트 메서드`를 소개했지만 위험이 완전히 사라진 것은 아니다.

자바 8에서는 핵심 `컬렉션 인터페이스`들에 다수의 디폴트 메서드가 추가되었다. **주로 `람다`를 활용하기 위해서다.** 대부분 상황에서 잘 동작하지만 생각할 수 있는 모든 상황에서 `불변식`을 해치지 않는 디폴트 메서드를 작성 하기란 어려운 법이다.

자바 8의 `Collection` 인터페이스에 추가된 `removeIf` 메서드를 예로 생각해보자. 이 메서드는 주어진 불리언 함수(predecate; 프레디키트)가 true를 반환하는 모든 원소를 제거한다.

    default boolean removeIf(predicate<? super E> filter) {
      Objects.requireNonNull(filter);
      boolean result = false;
      for (Iterator<E> it = iterator(); it.hasNext(); ) {
        if (filter.test(it.next())) {
          it.remove();
          result = true;
        }
      return result;
    }

위 코드는 `범용적`으로 구현되었지만 현존하는 모든 Collection 구현체와 잘 어우러지는 것은 아니다.

`SynchronizedCollection`이 대표적인 예다. 아파치 버전은 클라이언트가 제공한 객체로 `락`을 거는 기능을 추가로 제공한다. 즉, 모든 메서드에서 주어진 락 객체로 `동기화`한 후 내부 컬렉션 객체에 기능을 위임하는 래퍼 클래스다. 따라서 SynchronizedCollection 인스턴스를 여러 스레드가 공유하는 환경에서 한 스레드가 `removeIf`를 호출하면 `concurrentModificationException`이 발생하거나 다른 예기치 못한 결과로 이어질 수 있다.

### 디폴트 메서드 호환성을 유지하기 위한 방법

자바 플랫폼 라이브러리 에서도 이런 문제를 `예방`하기 위해 일련의 조치를 취했다. 예를 들어 구현한 인터페이스의 디폴트 메서드를 `재정의`하고, 다른 메서드 에서는 디폴트 메서드를 호출하기 전에 `필요한 작업`을 수행하도록 했다.

예컨대 Collections.synchronizedCollection이 반환하는 `package-private` 클래스 들은 `removeIf`를 `재정의`하고, 이를 호출하는 다른 메서드들은 디폴트 구현을 호출하기 전에 `동기화`를 하도록 했다.

```java
public class SynchronizedCollection<E> implements Collection<E>, Serializable {
    ...

    /**
    * @since 4.4
    */
    @Override
    public boolean removeIf(final Predicate<? super E> filter) {
        synchronized (lock) {
            return decorated().removeIf(filter);
        }
    }
}
```

디폴트 메서드는 (컴파일에 성공하더라도) 기존 구현체에 런타임 오류를 일으킬 수 있다. 자바 8은 컬렉션 인터페이스에 꽤 많은 디폴트 메서드를 추가했고, 그 결과 기존에 짜여진 많은 자바 코드가 영향을 받은 것으로 알려졌다.

디폴트 메서드는 인터페이스로부터 메서드를 `제거`하거나 기존 메서드의 시그니처를 `수정`하는 용도가 아님을 명심해야 한다. 이런 형태로 인터페이스를 변경하면 반드시 기존 클라이언트를 망가뜨리게 된다.

**새로운 인터페이스라면 릴리스 전에 반드시 테스트를 거쳐야 한다.**

## 참고

[https://sejoung.github.io/2018/12/2018-12-17-Design_interfaces_for_posterity/#아이템-21-인터페이스를-구현하는-쪽을-생각해-설계하라](https://sejoung.github.io/2018/12/2018-12-17-Design_interfaces_for_posterity/#%EC%95%84%EC%9D%B4%ED%85%9C-21-%EC%9D%B8%ED%84%B0%ED%8E%98%EC%9D%B4%EC%8A%A4%EB%A5%BC-%EA%B5%AC%ED%98%84%ED%95%98%EB%8A%94-%EC%AA%BD%EC%9D%84-%EC%83%9D%EA%B0%81%ED%95%B4-%EC%84%A4%EA%B3%84%ED%95%98%EB%9D%BC)
