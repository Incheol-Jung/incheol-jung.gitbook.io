---
layout: post
title: "1장 객체, 설계"
date: 2020-03-10 00:00:00
categories: object
summary: 1장 객체, 설계
---

> 오브젝트의 1장을 요약한 내용 입니다.

# 티켓 판매 애플리케이션 구현하기

여러분은 소극장의 홍보도 겸할 겸 관람객들의 발길이 이어지도록 작은 이벤트를 기획하기로 했다. 이벤트의 내용은 간단한데 추첨을 통해 선정된 관람객에게 공연을 무료로 관람할 수 있는 초대장을 발송하는 것이다.

관람객이 가지고 올 수 있는 소지품은 초대장, 현금, 티켓 세 가지뿐이다. 관람객은 소지품을 보관할 용도로 가방을 들고 올 수 있다고 가정하자.

이제 관람객이 소지품을 보관할 Bag 클래스를 추가하자. 또한 초대장의 보유 여부를 판단하는 hasInvitation 메서드와 티켓의 소유 여부를 판단하는 hasTicket 메서드, 현금을 증가시키거나 감소시키는 plusAmount와 minusAmount 메서드, 초대장을 티켓으로 교환하는 setTicket 메서드를 구현하고 있다.

Bag 인스턴스의 상태는 현금과 초대장을 함께 보관하거나, 초대장 없이 현금만 보관하는 두 가지 중 하나일 것이다.

다음은 관람객이라는 개념을 구현하는 Audience 클래스를 만들 차례다. 관람객은 소지품을 보관하기 위해 가방을 소지할 수 있다.

매표소에는 관람객에게 판매할 티켓과 티켓의 판매 금액이 보관돼 있어야 한다. 매표소를 구현하기 위해 TicketOffice 클래스를 추가할 시간이다. TicketOfifice는 판매하거나 교환해 줄 티켓의 목록(tickets)과 판매 금액(amount)를 인스턴스 변수로 포함한다. 티켓을 판매하는 getTicket 메서드는 편의를 위해 tickets 컬렉션에서 맨 첫 번째 위치에 저장된 Ticket을 반환하는 것으로 구현했다. 또한 판매금액을 더하거나 차감하는 plusAmount와 minusAmount 메서드도 구현돼 있다.

판매원을 구현한 TicketSeller 클래스는 자신이 일하는 매표소(TicketOffice)를 알고 있어야 한다.

![https://drive.google.com/uc?id=1aH7b83wUZ2g7jM1is6gM051sM23Mls6A](https://drive.google.com/uc?id=1aH7b83wUZ2g7jM1is6gM051sM23Mls6A)

소극장을 구현하는 클래스는 Theater다. Therater 클래스가 관함객을 맞이할 수 있도록 enter 메서드를 구현하자.

```java
    public class Theater {
    	private TicketSeller ticketSeller;

    	public Theater(TicketSeller ticketSeller) {
    		this.ticketSeller = ticketSeller;
    	}

    	public void enter(Audience audience) {
    		if(audience.getBag().hasInvitation()) {
    			Ticket ticket = ticketSeller.getTicketOffice().getTicket();
    			audience.getBag().getTicket(ticket);
    		} else {
    			Ticket ticket = ticketSeller.getTicketOffice().getTicket();
    			audience.getBag().minusAmount(ticket.getFee());
    			ticketSeller.getTicketOffice().plusAmount(ticket.getFee());
    			audience.getBag().setTicket(ticket);
    		}
    	}
    }
```

- 소극장은 먼저 관람객의 가반 안에 초대장이 들어 있는지 확인한다.
- 만약 초대장이 들어 있다면 이벤트에 당첨된 관람객이므로 판매원에게서 받은 티켓을 관람객의 가방 안에 넣어준다.
- 가방안에 초대장이 없다면 티켓을 판매해야 한다.
- 이 경우소극장은 관람객의 가방에서 티켓 금액만큼을 차감한 후 매표소에 금액을 증가시킨다.
- 마지막으로 소극장은 관람객의 가방 안에 티켓을 넣어줌으로써 관람객의 입장 절차를 끝낸다.

# 무엇인 문제인가?

로버트 마틴은 **<클린 소프트웨어: 애자일 월칙과 패턴, 그리고 실천 방법>**에서 소프트웨어 모듈이 가져야 하는 세 가지 기능에 관해 설명한다. 여기서 모듈이란 크기와 상관 없이 클래스나 패키지, 라이브러리와 같이 프로그램을 구성하는 임의의 요소를 의미한다.

### 모든 소프트웨어 모듈에는 세 가지 목적이 있다.

- **첫 번째 목적은 실행 중에 제대로 동작하는 것이다. 이것은 모듈의 존재 이유라고 할 수 있다.**
- **두 번째 목적은 변경을 위해 존재하는 것이다. 변경하기 어려운 모듈은 제대로 동작하더라도 개선해야 한다.**
- **모듈의 세 번째 목적은 코드를 읽는 사람과 의사소통하는 것이다. 모듈은 특별한 훈련 없이도 개발자가 쉽게 읽고 이해할 수 있어야 한다.**

마틴에 따르면 **모든 모듈은 제대로 실행돼야 하고, 변경이 용이해야 하며, 이해하기 쉬어야 한다.**

앞에서 작성한 프로그램은 관람객들을 입장시키는 데 필요한 기능을 오류 없이 정확하게 수행하고 있다. 따라서 제대로 동작해야 한다는 제약은 만족시킨다. 하지만 **변경 용이성**과 읽는 사람과의 **의사소통**이라는 목적은 만족시키지 못한다. 지금부터 그 이유를 살펴보자

## 예상을 빗나가는 코드

문제는 관람객과 판매원이 소극장의 통제를 받는 **수동적인 존재**하는 점이다.

소극장이 여러분의 허락도 없이 매표소에 보관 중인 티켓과 현금에 마음대로 접근할 수 있기 때문이다. 더 큰 문제는 티켓을 꺼내 관람객의 가방에 집어넣고 관람객에게서 받은 돈을 매표소에 적립하는 일은 여러분이 아닌 소극장이 수행한다는 점이다.

현재의 코드는 우리의 상식과는 다르게 동작하기 때문에 코드를 읽는 사람과 제대로 의사 소통하지 못한다.

코드를 이해하기 어렵게 만드는 또 다른 이유가 있다. 이 코드를 이해하기 위해서는 여러 가지 세부적인 내용들을 한꺼번에 기억하고 있어야 한다는 점이다.

Theater의 enter 메서드를 이해하기 위해서는 Audience가 Bag을 가지고 있고, Bag 안에는 현금과 티켓이 들어 있으며 TicketSeller가 TicketOffice에서 티켓을 판매하고, TicketOffice 안에 돈과 티켓이 보관돼 있다는 모든 사실을 동시에 기억하고 있어야 한다.

하지만 가장 심각한 문제는 이것이 아니다. 그것은 Audience와 TicketSeller를 변경할 경우 Theater도 함께 변경해야 한다는 사실이다.

## 변경에 취약한 코드

- 관람객이 가방을 들고 있지 않다면 어떻게 해야 할까?
- 관람객이 현금이 아니라 신용카드를 이용해서 결제 한다면 어떻게 해야 할까?
- 판매원이 매표소 밖에서 티켓을 판매해야 한다면 어떻게 해야 할까?

이런 과정이 변경되는 순간 모든 코드가 일시에 흔들리게 된다.

이것은 객체 사이의 의존성과 관련된 문제다. **의존성이라는 말 속에는 어떤 객체가 변경될 때 그 객체에게 의존하는 다른 객체도 함께 변경될 수 있다는 사실이 내포돼 있다.**

그렇다고 해서 객체 사이의 의존성을 완전히 없애는 것이 정답은 아니다. **객체지향 설계는 서로 의존하면서 협력하는 객체들의 공동체를 구축하는 것이다.** 따라서 우리의 목표는 애플리케이션의 기능을 구현하는 데 필요한 최소한의 의존성만 유지하고 불필요한 의존성을 제거하는 것이다.

객체 사이의 의존성이 과한 경우를 가리켜 **결합도(couping)**가 높다고 말한다. 두 객체 사이의 결합도가 높으면 높을수록 함께 변경될 확률도 높아지기 때문에 객체 사이의 결합도를 낮춰 변경이 용이한 설계를 만들어야 한다.

## 설계 개선하기

코드를 이해하기 어려운 이유는 Theater가 관람객의 가방과 판매원의 매표소에 직접 접근하기 때문이다. 이것은 관람객과 판매원이 자신의 일을 스스로 처리해야 한다는 우리의 직관을 벗어난다. 따라서 Audience와 TicketSeller를 변경할 때 Theater도 함께 변경해야 하기 때문에 전체적으로 코드를 변경하기도 어려워진다.

해결 방법은 간단하다. Theater가 Audience와 TicketSeller에 관해 너무 세세한 부분까지 알지 못하도록 **정보를 차단하면 된다.** 관람객이 스스로 가방 안의 현금과 초대장을 처리하고 판매원이 스스로 매표소의 티켓과 판매 요금을 다루게 한다면 이 모든 문제를 한 번에 해결할 수 있을 것이다.

## 자율성을 높이자

Theater의 enter 메서드에서 TicketOffice에 접근하는 모든 코드를 TicketSeller 내부로 숨기는 것이다. TicketSeller에 sellTo 메서드를 추가하고 Thater에 있던 로직을 이 메서드로 옮기자

```java
    public class TheaterSeller {
    	private TicketOffice ticketOffice;

    	public Theater(TicketOffice ticketOffice) {
    		this.ticketOffice = ticketOffice;
    	}

    	public void sellTo(Audience audience) {
    		if(audience.getBag().hasInvitation()) {
    			Ticket ticket = ticketOffice.getTicket();
    			audience.getBag().getTicket(ticket);
    		} else {
    			Ticket ticket = ticketOffice.getTicket();
    			audience.getBag().minusAmount(ticket.getFee());
    			ticketOffice.plusAmount(ticket.getFee());
    			audience.getBag().setTicket(ticket);
    		}
    	}
    }

    public class Theater {
    	private TicketSeller ticketSeller;

    	public Theater(TicketSeller ticketSeller) {
    		this.ticketSeller = ticketSeller;
    	}

    	public void enter(Audience audience) {
    		ticketSeller.sellTo(audience);
    	}
    }
```

이처럼 개념적이나 물리적으로 객체 내부의 세부적인 사항을 감추는 것을 **캡슐화**라고 부른다. 캡슐화를 통해 객체 내부로의 접근을 제한하면 객체와 객체 사이의 결합도를 낮출 수 있기 때문에 설계를 좀 더 쉽게 변경할 수 있게 된다.

Theater는 오직 TicketSeller의 인터페이스에만 의존한다. TicketSeller가 내부에 TicketOffice 인스턴스를 포함하고 있다는 사실은 구현의 영역에 속한다.

TicketSeller 다음으로 Audience의 캡슐화를 개선하자

```java
    public class Audience {
    	private Bag bag;

    	public Audience(Bag bag) {
    		this.bag = bag;
    	}

    	public Long buy(Ticket ticket) {
    		if(bag.hasInvitation()) {
    			bag.getTicket(ticket);
    			return 0;
    		} else {
    			bag.minusAmount(ticket.getFee());
    			bag.setTicket(ticket);
    			return ticket.getFee();
    		}
    	}
    }

    public class TheaterSeller {
    	private TicketOffice ticketOffice;

    	public Theater(TicketOffice ticketOffice) {
    		this.ticketOffice = ticketOffice;
    	}

    	public void sellTo(Audience audience) {
    		iticketOffice.plusAmount(audience.buy(ticket.getFee()));
    	}
    }
```

수정된 Audience와 TicketSeller는 자신이 가지고 있는 소지품을 스스로 관리한다. 따라서 코드를 읽는 사람과의 의사소통이라는 관점에서 이 코드는 확실히 개선된 것으로 보인다. 더 중요한 점은 Audience나 TicketSeller의 내부 구현을 변경하더라도 Theater를 함께 변경할 필요가 없어졌다는 것이다. 따라서 수정된 코드는 변경 용이성의 측면에서도 확실히 개선됐다고 말할 수 있다.

## 어떻게 한 것인가

**자기 자신의 문제를 스스로 해결하도록 코드를 변경한 것이다.** 우리는 우리의 직관을 따랐고 그 결과로 코드는 변경이 용이하고 이해 가능하도록 수정됐다.

## 캡슐화와 응집도

핵심은 객체 내부의 상태를 **캡슐화**하고 객체 간에 오직 **메시지**를 통해서만 상호작용 하도록 만드는 것이다. 밀접하게 연관된 작업만을 수행하고 연관성 없는 작업은 다른 객체에게 위임하는 객체를 가리켜 응집도가 높다고 말한다. 자신의 데이터를 스스로 처리하는 자율적인 객체를 만들면 **결합도를 낮출 수 있을 뿐더러 응집도를 높일 수 있다.**

**외부의 간섭을 최대한 배제하고 메시지를 통해서만 협력하는 자율적인 객체들의 공동체를 만드는 것이 훌륭한 객체지향 설계를 얻을 수 있는 지름길인 것이다.**

## 절차지향과 객체지향

변경 전 초기 코드를 다시 살펴보자

Theater의 enter 메서드는 **프로세스(Process)**이며 Audience, TicketSeller, Bag, TicketOffice는 **데이터(Data)**이다. 이처럼 프로세스와 데이터를 별도의 모듈에 위치시키는 방식을 절차적 프로그래밍이라고 부른다.

절차적 프로그래밍은 코드를 읽는 사람과 원활하게 의사소통하지 못한다. 더 큰 문제는 데이터의 변경으로 인한 영향을 지역적으로 고립시키기 어렵다

**변경하기 쉬운 설계는 한 번에 하나의 클래스만 변경할 수 있는 설계다.**

해결 방법은 자신의 데이터를 스스로 처리하도록 프로세스의 적절한 단계를 Audience와 TicketSeller로 이동시키는 것이다. 이처럼 데이터와 프로세스가 동일한 모듈 내부에 위치하도록 프로그래밍하는 방식을 객체지향 프로그래밍이라고 부른다.

**훌륭한 객제치향 설계의 핵심은 캡슐화를 이용해 의존성을 적절히 관리함으로써 객체 사이의 결합도를 낮추는 것이다.**

## 책임의 이동

당신의 코드에서 데이터와 데이터를 사용하는 프로세스가 별도의 객체에 위치하고 있다면 절차적 프로그래밍 방식을 따르고 있을 확률이 높다. 데이터와 데이터를 사용하는 프로세스가 동일한 객체 안에 위치한다면 객체 객체지향 프로그래밍 방식을 따르고 있을 확률이 높다.

설계를 어렵게 만드는 것은 의존성 이라는 것을 기억하라. **해결 방법은 불필요한 의존성을 제거함으로써 객체 사이의 결합도를 낮추는 것이다.**

## 더 개선할 수 있다

Audience는 스스로 티켓을 구매하고 가방안의 내용물을 직접 관리한다. 하지만 Bag은 과거의 Audience처럼 스스로 자기 자신을 책임지지 않고 Audience에 의해 끌려다니는 수동적인 존재다.

Bag을 자율적인 존재로 바꿔보자

```java
    public class Bag {
    	private Long amount;
    	private Ticket ticket;
    	private Invitation invitation;

    	public Long hold(Ticket ticket) {
    		if(hasInvitation()) {
    			setTicket(ticket);
    			return 0;
    		} else {
    			setTicket(ticket);
    			minusAmount(ticket.getFee());
    			return ticket.getFee();
    		}
    	}

     ...
    }

    public class Audience {
    	public Long buy(Ticket ticket) {
    		return bag.hold(ticket);
    	}
    }
```

TicketSeller 역시 TicketOffice의 자율권을 침해하였다

```java
    public class TicketOffice {
    	public void sellTicketTo(Audience audience) {
    		plusAmount(audience.buy(getTicket()));
    	}
    	...
    }

    public class TicketSeller {
    	public void sellTo(Audience audience) {
    		ticketOffice.sellTicketTo(audience));
    	}
    }
```

## 객제치향 설계

### 설계가 왜 필요한가

설계란 코드를 배치하는 것이다. **설계를 구현과 떨어트려서 이야기하는 것은 불가능하다.** 설계는 코드를 작성하는 매 순간 코드를 어떻게 배치할 것인지를 결정하는 과정에서 나온다. 설계는 코드 작성의 일부이며 코드를 작성하지 않고서는 검증할 수 없다.

### 그렇다면 좋은 설계란 무엇인가?

**좋은 설계란 오늘 요구하는 기능을 온전히 수행하면서 내일의 변경을 매끄럽게 수용할 수 있는 설계다**

개발을 시작하는 시점에 구현에 필요한 모든 요구사항을 수집하는 것은 불가능에 가깝다. 모든 요구사항을 수집할 수 있다고 가정하더라도 개발이 진행되는 동안 요구사항은 바뀔 수밖에 없다.

> 요구사항 변경은 필연적으로 코드 수정을 초래하고, 코드 수정은 버그가 발생할 가능성을 높인다. 코드 수정을 회피하려는 가장 큰 원인은 **두려움**이다. 그리고 그 두려움은 요구사항 변경으로 인해 버그를 추가할지도 모른다는 **불확실성**에 기인한다.

### 객체지향 설계

객제치향 프로그래밍은 **의존성**을 효율적으로 통제할 수 있는 다양한 방법을 제공함으로써 요구사항 변경에 좀 더 수월하게 대응할 수 있는 가능성을 높여준다. 단순히 데이터와 프로세스를 객체라는 덩어리 안으로 밀어 넣었다고 해서 변경하기 쉬운 설계를 얻을 수 있는 것은 아니다.
