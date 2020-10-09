---
description: 객체지향과 디자인 패턴(최범균 저) 전략 패턴 정리한 내용입니다.
---

# 전략패턴

## 상황

한 과일 매장은 상황에 따라 다른 가격 할인 정책을 적용하고 있다. 매장을 열자마자 들어온 첫 손님을 위한 '첫 손님 할인' 정책과 저녁 시간대에 신선도가 떨어진 과일에 대한 '덜 신선한 과일 할인' 정책이 있다.

## 문제

* 서로 다른 계산 정책들이 한 코드에 섞여 있어, 정책이 추가될수록 코드 분석을 어렵게 만든다.
* 가격 정책이 추가될 때마다 calculate 메서드를 수정하는 것이 점점 어려워진다.
* 예를 들어 마지막 손님 50% 할인과 같은 새로운 가격 정책이 추가될 경우, calculate 메서드에 마지막 손님을 구분하기 위한 lastGuest 파라미터가 추가되고 if 블록이 하나 더 추가되어야 한다.

## 해결방법

![](../../../.gitbook/assets/222%20%2813%29.png)

* 가격 할인 알고리즘\(계산 방법\)을 추상화하고 있는 DiscountStrategy를 전략\(Strategy\)이라고 한다.
* 가격 계산 기능 자체의 책임을 갖고 있는 Calulator를 콘텍스트로 정의한다.
* 특정 콘텍스트에서 알고리즘\(전략\)을 별도로 분리하는 설계 방법이 전략 패턴이다.
* 전략 패턴에서 콘텍스트는 사용할 전략을 직접 선택하지 않는다.
* 콘텍스트의 클라이언트가 콘텍스트에 사용할 전략을 전달해 준다.

```java
// 클라이언트는 추상화된 전략을 보유하고 있다. 
public class Calculator {
    private DiscountStrategy discountStrategy;
    
    public Calculator(DiscountStrategy discountStrategy){
        this.discountStrategy = discountStrategy;
    }
    
    public int calculate(List<Item> items){
        int sum = 0;
        for (Item item : items){
            sum += discountStrategy.getDiscountPrice(item);
        }
        return sum;
    }
}

// 추상화된 전략에 대한 스펙을 정의한다.(변경되는 전략을 메소드로 정의한다.)
public interface DiscountStrategy {
		int getDiscountPrice(Item item);
}

// 전략에 따른 구현체를 정의한다. 
public class FirstGuestDiscountStrategy implements DiscountStrategy {
		@Override
		public int getDiscountPrice(Item item) {
				return (int) (item.getPrice() * 0.9);
		}
}

// 특정 이벤트가 발생하였을 경우, 사용할 전략을 주입한다. 
public void onFirstGuestButtonClick() {
    // 첫 손님 할인 버튼 누를 때 생성 됨
    discountStrategy = new FirstGuestDiscountStrategy();
}

// 주입된 전략을 이용하여 계산 로직을 수행한다. 
public void onClaculationButtonClick() {
    // 계산 버튼 누를 때 실행 됨
    Calculator cal = new Calculator(discountStrategy);
    int price = cal.calculate(items);
}
```

