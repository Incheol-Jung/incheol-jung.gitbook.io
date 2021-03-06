---
layout: reference
title: 6장 메시지와 인터페이스
date: '2020-03-11T00:00:00.000Z'
categories: object
summary: 오브젝트의 6장을 요약한 내용 입니다.
navigation_weight: 6
description: 오브젝트의 6장을 요약한 내용 입니다.
---

# 6장 메시지와 인터페이스

훌륭한 퍼블릭 인터페이스를 얻기 위해서는 `책임 주도 설계 방법`을 따르는 것만으로는 부족하다. 유연하고 재사용 가능한 퍼블릭 인터페이스를 만드는 데 도움이 되는 설계 원칙과 기법을 익히고 적용해야 한다.

## 인터페이스와 설계 품질

좋은 인터페이스는 최소한의 인터페이스와 추상적인 인터페이스라는 조건을 만족해야 한다.

퍼블릭 인터페이스의 품질에 영향을 미치는 다음과 같은 원칙과 기법에 관해 살펴보자.

* `디미터 법칙`
* `묻지 말고 시켜라`
* `의도를 드러내는 인터페이스`
* `명령-쿼리 분리`

### 디미터 법칙

디미터 법칙은 객체의 내부 구조에 강하게 결합되지 않도록 `협력 경로를 제한`하는 것이다. 자바나 C\#과 같이 '도트\(.\)'를 이용해 메시지 전송을 표현하는 언어에서는 "`오직 하나의 도트만 사용하라`"라는 말로 요약 되기도 한다.

디미터 법칙을 따르면 `부끄럼타는 코드`를 작성할 수 있다. 부끄럼타는 코드란 불필요한 어떤 것도 다른 객체에게 보여주지 않으며, \`다른 객체의 구현에 의존하지 않는 코드\`\`말한다.

다음은 디미터 법칙을 위반하는 코드의 전형적인 모습이다.

```java
screening.getMovie().getDiscountConditions();
```

디미터 법칙을 따르도록 코드를 개선하면 메시지 전송자는 더 이상 메시지 수신자의 내부 구조에 관해 묻지 않게 된다.

```java
screening.calculateFee(audienceCount);
```

정보를 처리하는 데 필요한 책임을 정보를 알고 있는 객체에게 할당하기 때문에 `응집도가 높은 객체`가 만들어진다.

### 묻지 말고 시켜라

디미터 법칙은 훌륭한 메시지는 `객체의 상태에 관해 묻지 말고 원하는 것을 시켜야 한다는 사실을 강조`한다. 묻지 말고 시켜라는 이런 스타일의 메시지 작성을 장려하는 원칙을 가리키는 용어다.

객체의 외부에서 해당 객체의 상태를 기반으로 결정을 내리는 것은 객체의 `캡슐화를 위반`한다. 훌륭한 인터페이스를 수확하기 위해서는 객체가 어떻게 작업을 수행하는지를 노출해서는 안된다. `인터페이스는 객체가 어떻게 하는지가 아니라 무엇을 하는지를 서술해야 한다.`

### 의도를 드러내는 인터페이스

인터페이스의 메서드명은 어떻게 작성하는게 좋을까?

```java
public class PeriodCondition {
    public boolean isSatisfiedByPeriod(Screening screening) { ... }
}

public class SequenceCondition {
    public boolean isSatisfiedBySequence(Screening screening) { ... }
}
```

위와 같은 코드가 좋지 않은 이유를 두 가지로 요약할 수 있다.

* 메서드의 이름이 다르기 때문에 두 메서드의 내부 구현을 정확하게 이해해야 한다.
* 이 메서드들은 클라이언트로 하여금 협력하는 객체의 종류를 알도록 강요한다.

좋은 메서드명을 짓기 위해서는 객체가 협력 안에서 `수행해야 하는 책임`에 관해 고민해야 한다. 이것은 외부의 객체가 메시지를 전송하는 목적을 먼저 생각하도록 만들며, 결과적으로 협력하는 클라이언트의 의도에 부합하도록 메서드의 이름을 짓게 된다.

클라이언트의 관점에서 두 메서드는 할인 여부를 판단하기 위한 작업을 수행한다.

```java
public class PeriodCondition {
    public boolean isSatisfiedBy(Screening screening) { ... }
}

public class SequenceCondition {
    public boolean isSatisfiedBy(Screening screening) { ... }
}
```

메서드가 어떻게 수행하느냐가 아니라 `무엇을 하느냐`에 초엄을 맞추면 클라이언트의 관점에서 동일한 작업을 수행하는 메서드들을 하나의 타입 계층으로 묶을 수 있는 가능성이 커진다.

## 원칙의 함정

디미터 법칙과 묻지 말고 시켜라 스타일은 객체의 퍼블릭 인터페이스를 깔끔하고 유연하게 만들 수 있는 훌륭한 설계 원칙이다. 하지만 절대적인 법칙은 아니다. `소프트웨어 설계에 법칙이란 존재하지 않는다. 법칙에는 예외가 없지만 원칙에는 예외가 넘쳐난다.`

설계를 적절하게 `트레이드 오프` 할 수 있는 능력이 숙련자와 초보자를 구분하는 가장 중요한 기준이라고 할 수 있다. 초보자는 맹목적으로 추종한다. 원칙이 현재 상황에 부적합하다고 판단된다면 과감하게 원칙을 무시하라

### 디미터 법칙은 하나의 도트\(.\)를 강제하는 규칙이 아니다

```java
IntStream.of(1, 15, 20, 3, ().filter(x -> x > 10).distinct().count();
```

디미터 법칙은 결합도와 관련된 것이며 이 결합도가 문제가 되는 것은 객체의 내부 구조가 외부로 노출되는 경우로 한정된다. `기차 충돌`처럼 보이는 코드라도 객체의 내부 구현에 대한 어떤 정보도 외부로 노출하지 않는다면 그것은 디미터 법칙을 준수한 것이다.

### 결합도와 응집도의 충돌

일반적으로 어떤 객체의 상태를 물어본 후 반환된 객체의 상태를 물어본 후 반환된 상태를 기반으로 결정을 내리고 그 결정에 따라 객체의 상태를 변경하는 코드는 묻지 말고 시켜라 스타일로 변경해야 한다.

```java
public class Theater {
    public void enter(Audience audience) {
        if(audience.getBag().hasInvitation()) {
            ...
}
```

Theater는 Audience 내부에 포함된 Bag에 대해 질문한 후 반환된 결과를 이용해 Bag의 상태를 변경한다.

```java
public class Audience {
    public Long buy(Ticket ticket) {
        if(bag.hasInvitation()) {
            ...
}
```

이 예제에서 알 수 있는 것처럼 `위임 메서드`를 통해 내부 구조를 감추는 것은 협력에 참여하는 객체들의 결합도를 낮출 수 있는 동시에 객체의 응집도를 높일 수 있는 가장 효과적인 방법이다.

모든 상황에서 맹목적으로 위임 메서드를 추가하면 같은 `퍼블릭 인터페이스 안에 어울리지 않은 오퍼레이션들이 공존하게 된다`. `결과적으로 객체는 상관 없는 책임들을 한꺼번에 떠안게 되기 때문에 결과적으로 응집도가 낮아진다.`

클래스는 하나의 변경 원인만을 가져야 한다.\(SRP\) 서로 상관없는 책임들이 함께 뭉쳐있는 클래스는 응집도가 낮으며 작은 변경으로도 쉽게 무너질 수 있다.

### 명령-쿼리 분리 원칙

명령-쿼리 분리 원칙은 퍼블릭 인터페이스에 오퍼레이션을 정의할 때 참고할 수 있는 지침을 제공한다.

어떤 절차를 묶어 호출 가능하도록 이름을 부여한 기능 모듈을 루틴\(routine\)이라고 부른다. 루틴은 다시 `프로시저(procedure)`와 `함수(function)`로 구분할 수 있다.

* `프로시저는 부수효과를 발생시킬 수 있지만 값을 반환할 수 없다`
* `함수는 값을 반환할 수 있지만 부수효과를 발생시킬 수 없다`

객체의 상태를 수정하는 오퍼레이션을 명령이라고 부르고 객체와 관련된 정보를 반환하는 오퍼레이션을 쿼리라고 부른다.

#### 어떤 오퍼레이션도 명령인 동시에 쿼리여서는 안된다.

* 객체의 상태를 변경하는 명령은 반환값을 가질 수 없다.
* 객체의 정보를 반환하는 쿼리는 상태를 변경할 수 없다.

#### 그렇다면 명령과 쿼리를 분리해서 얻게 되는 장점은 무엇일까?

어떤 회사에서 주기적으로 이벤트를 추가하는 기능을 추가하였다. 해당 이벤트 클래스는 현재 정의한 스케줄이 설정되어 있는지 검사하는 isSatisfied 메서드를 제공하였다고 가정하자

```java
public class Event {
    public boolean isSaisfied(RecurringSchedule schedule) {
        if(조건에 만족하는 스케줄이 없다?) {
            reschedule(schedule);
            return false;
        }

        return true;
    }

    private void reschedule(RecurringSchedule schedule) { ... }
}
```

이 메서드는 만족하는 스케줄이 없을 경우 reschedule\(현재 스케줄 수정\)하면서 false를 리턴하게 된다.

예를 들어 매주 수요일마다 반복적으로 이벤트를 생성하는데 누군가 목요일까지 이벤트 진행하는 이벤트를 isSatisfied 메서드를 호출하여 확인하였다. 처음에 리턴한 결과값은 false 였을 것이다. 그러나 한번 더 호출하게 되면 true를 반환하게 된다.

사실 isSatisfied 메서드가 처음 구현됐을 때는 그 안에서 reschdule 메서드를 호출하는 부분이 빠져 있었다. 기능을 추가하는 과정에서 누군가 Event가 조건에 맞지 않을 경우 Event 상태를 수정해야 한다는 요구사항을 추가했고, 프로그래머는 별다른 생각 없이 기존에 있던 isSatisfied 메서드에 reschdule 메서드를 호출하는 코드를 추가해 버린 것이다.

`결과는 참담했고 이 버그를 찾기 위해 개발팀은 주말을 고스란히 반납해야 했다.`

가장 깔끔한 해결책은 명령과 쿼리를 명확하게 분리하는 것이다.

```java
public class Event {
    public boolean isSaisfied(RecurringSchedule schedule) { ... }
    public void reschedule(RecurringSchedule schedule) { ... }
}
```

반환 값을 돌려주는 메서드는 쿼리이므로 부수 효과에 대한 부담이 없다. 따라서 몇 번을 호출하더라도 다른 부분에 영향을 미치지 않는다.

### 명령-쿼리 분리와 참조 투명성

명령과 쿼리를 분리함으로써 명령형 언어의 틀 안에서 `참조 투명성`의 장점을 제한적이나마 누릴 수 있게 된다. 참조 투명성이라는 특성을 잘 활용하면 버그가 적고, 디버깅이 용이하며, 쿼리의 순서에 따라 실행 결과가 변하지 않는 코드를 작성할 수 있다.

#### 참조 투명성이란 무엇인가?

참조 투명성이란 "`어떤 표현식 e가 있을 때 e의 값으로 e가 나타나는 모든 위치를 교체하더라도 결과가 달라지지 않는 특성`"을 의미한다.

```java
f(1) + f(1) = 6
f(1) * 2 = 6
f(1) - 1 = 2

// 계산한 결과 f(1) = 3이라는 결과값을 도출할 수 있었다. 이제 f(1)을 3으로 변경해보자.

3 + 3 = 6
3 * 2 = 6
3 - 1 = 2
```

이처럼 어떤 값이 변하지 않는 성질을 `불변성`이라고 부른다.

참조 투명성을 만족하는 식은 우리에게 두 가지 장점을 제공한다.

* 모든 함수를 이미 알고 있는 하나의 결과값으로 대체할 수 있기 때문에 식을 쉽게 계산할 수 있다.
* 모든 속에서 함수의 결과값이 동일하기 때문에 식의 순서를 변경 하더라도 각 식의 결과는 달라 지지 않는다.

> 함수형 프로그래밍은 부수효과가 존재하지 않는 수학적인 함수에 기반한다. 따라서 함수형 프로그래밍에서는 참조 투명성의 장점을 극대화할 수 있으며 명령형 프로그래밍에 비해 프로그램의 실행 결과를 이해하고 예측하기가 더 쉽다.

### 책임에 초점을 맞춰라

* 디미터 법칙 : 협력이라는 컨텍스트 안에서 객체보다 메시지를 먼저 결정하면 두 객체 사이의 `구조적인 결합도를 낮출 수 있다.` 수신할 객체를 알지 못한 상태에서 메시지를 먼저 선택하기 때문에 객체의 내부 구조에 대해 고민할 필요가 없어진다. 따라서 메시지가 객체를 선택하게 함으로써 의도적으로 디미터 법칙을 위반할 위험을 최소화할 수 있다.
* 묻지 말고 시켜라 : 메시지를 먼저 선택하면 묻지 말고 시켜라 스타일에 따라 협력을 구조화하게 된다. 클라이언트의 관점에서 메시지를 선택하기 때문에 필요한 정보를 물을 필요 없이 `원하는 것을 표현한 메시지를 전송하면 된다.`
* 의도를 드러내는 인터페이스 : 메시지를 먼저 선택한다는 것은 메시지를 전송하는 클라이언트의 관점에서 메시지의 이름을 정한다는 것이다. 당연히 `그 이름에는 클라이언트가 무엇을 원하는지 그 의도가 분명하게 드러날 수 밖에 없다.`
* 명령-쿼리 분리 원칙 : 메시지를 먼저 선택한다는 것은 협력 이라는 문맥 안에서 객체의 인터페이스에 관해 고민한다는 것을 의미한다. 객체가 단순히 어떤 일을 해야 하는지 뿐만 아니라 협력 속에서 객체의 상태를 예측하고 이해하기 쉽게 만들기 위한 방법에 관해 고민하게 된다. `따라서 예측 가능한 협력을 만들기 위해 명령과 쿼리를 분리하게 될 것이다.`

