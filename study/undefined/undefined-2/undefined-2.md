---
description: 객체지향과 디자인 패턴(최범균 저) 상태 패턴 정리한 내용입니다.
---

# 상태 패턴

## 상황

단일 상품을 판매하는 자판기에 들어갈 소프트웨어를 개발해 달라는 요구가 들어왔다.

#### 자판기 프로그램의 최초 요구 사항&#x20;

| 동작     | 조건         | 실행          | 결과                           |
| ------ | ---------- | ----------- | ---------------------------- |
| 동전을 넣음 | 동전 없음이면    | 금액을 증가      | 제품 선택 가능                     |
| 동전을 넣음 | 제품 선택 가능이면 | 금액을 증가      | 제품 선택 가능                     |
| 제품 선택  | 동전 없음이면    | 아무 동작 하지 않음 | 동전 없음 유지                     |
| 제품 선택  | 제품 선택 가능이면 | 제품 주고 잔액 감소 | 잔액 있으면 제품 선택 가능 잔액 없으면 동전 없음 |

## 문제

상태가 많아질수록 복잡해지는 조건문이 여러 코드에서 중복해서 출현하고, 그만큼 코드 변경을 어렵게 만든다. (예를 들어, 새로운 상태를 추가하거나 기존 상태를 제거하려면 모든 조건문을 찾아서 수정해 줘야 한다.)

## 해결방법

> 상태에 따라 동일한 기능 요청의 처리를 다르게 한다

* 상태 패턴의 중요한 점은 상태 객체가 기능을 제공한다는 점이다.
* 콘텍스트는 클라이언트로부터 기능 실행 요청을 전달 받는다.
* 콘텍스트는 상태 객체에 처리를 위임하는 방식으로 구현한다.

```java
/**
 * @author Incheol Jung
 */
public class VendingMachine {
    private State state;

    public VendingMachine() {
        state = new NoCoinState();
    }
    
    public void insertConin(int coin) {
        state.increateCoin(coin, this); // 상태 객체에 위임
    }
    
    public void select(int productid) {
        state.select(productid, this); // 상태 객체에 위임
    }
    
    public void changeState(State newState){
        this.state = newState;
    }
}

public class NoCoinState implements State {
    @Override
    public void increateConin(int coin, VendingMachine vm){
        vm.increaseCoin(coin);
        vm.changeState(new SelecableState());
    }
    
    @Override
    public void select(int productId, VendingMachine vm){
        SoundUtil.beep();
    }
}
```

## 상태 변경은 누가?

상태 패턴을 적용할 때 고려할 문제는 콘텍스트의 상태 변경을 누가 하느냐에 대한 것이다. 상태 변경을 하는 주체는 콘텍스트나 상태 객체 둘 중 하나가 된다. 콘텍스트의 상태 변경을 누가 할지는 주어진 상황에 알맞게 정해 주어야 한다. 먼저 콘텍스트에서 상태를 변경하는 방식은 비교적 상태 개수가 적고 상태 변경 규칙이 거의 바뀌지 않는 경우에 유리하다. 왜냐면 상태 종류가 지속적으로 변경되거나 상태 변경 규칙이 자주 바뀔 경우 콘텍스트의 상태 변경 처리 코드가 복잡해질 가능성이 높기 때문이다. 상태 변경 처리 코드가 복잡해질수록 상태 변경의 유연함이 떨어지게 된다.

반면에 상태 객체에서 콘텍스트의 상태를 변경할 경우, 콘텍스트에 영향을 주지 않으면서 상태를 추가하거나 상태 변경 규칙을 바꿀 수 있게 된다. 하지만, 상태 변경 규칙이 여러 클래스에 분산되어 있기 때문에, 상태 구현 클래스가 많아질수록 상태 변경 규칙을 파악하기가 어려워지는 단점이 있다. 또한, 한 상태 클래스에서 다른 상태 클래스에 대한 의존도 발생한다.
