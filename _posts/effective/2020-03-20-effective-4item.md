---
layout: reference
title: 아이템4 인스턴스화를 막으려거든 private 생성자를 사용하라
date: '2020-03-10T00:00:00.000Z'
categories: effective
summary: Effective Java 3e 아이템 4을 요약한 내용 입니다.
navigation_weight: 4
---

# 2020-03-20-effective-4item

> Effective Java 3e 아이템 4를 요약한 내용 입니다.

이따금 단순히 `정적 메서드`와 `정적 필드`만을 담은 클래스를 만들고 싶을 때가 있을 것이다. 객체 지향적으로 사고하지 않는 이들이 종종 남용하는 방식이기에 그리 곱게 보이지는 않지만 분명 나름의 쓰임새가 있다.

정적 멤버만 담은 유틸리티 클래스는 인스턴스로 만들어 쓰려고 설계한게 아니다.

`추상 클래스`로 만드는 것으로는 인스턴스화를 막을 수 없다.

컬파일러가 기본 생성자를 만드는 경우는 오직 명시된 생성자가 없을 때뿐이니 private 생성자를 추가하면 클래스의 인스턴스화를 막을 수 있다.

```java
    public class UtilityClass {
        // 기본 생성자가 만들어지는 것을 막는다(인스턴스화 방지용)
        private UtilityClass() {
            throw new AssertionError)_'
        }
        ... 
    }
```

명시적 생성자가 private이니 클래스 바깥에서는 접근할 수 없다.

이 방식은 상속을 불가능하게 하는 효과도 있다. 모든 생성자는 명시적이든 묵시적이든 상위 클래스의 생성자를 호출하게 되는데, 이를 private으로 선언했으니 하위 클래스가 상위 클래스의 생성자에 접근할 길이 막혀버린다.

