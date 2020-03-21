---
layout:     post
title:      "2장 객체지향 프로그래밍"
date:       2020-03-10 00:00:00
categories: object
summary:    2장 객체지향 프로그래밍
---

> 오브젝트의 2장을 요약한 내용 입니다.

# 객체지향 프로그래밍을 향해

## 협력, 객체, 클래스

객체지향 언어에 익숙한 사람이라면 가장 먼저 어떤 **클래스가** 필요한지 고민할 것이다. 대부분의 사람들은 클래스를 결정한 후에 클래스에 **어떤 속성**과 **메서드**가 필요한지 고민한다. 

안타깝게도 이것은 객체지향의 본질과는 거리가 멀다. 진정한 객체지향 패러다임으로의 전환은 클래스가 아닌 **객체에 초점을 맞출 때에만 얻을 수 있다.** 

프로그래밍하는 동안 두 가지에 집중해야 한다. 

- 첫째, **어떤 클래스가 필요한지를 고민하기 전에 어떤 객체들이 필요한지 고민하라 클래스는 공통적인 상태와 행동을 공유하는 객체들을 추상화한 것이다.** 따라서 클래스의 윤곽을 잡기 위해서는 어떤 객체들이 어떤 상태와 행동을 가지는지를 먼저 결정해야 한다. 객체를 중심에 두는 접근 방법은 설계를 단순하고 깔끔하게 만든다.
- 둘째, **객체를 독립적인 존재가 아니라 기능을 구현하기 위해 협력하는 공동체의 일원으로 봐야 한다.** 훌륭한 협력이 훌륭한 객체를 낳고 훌륭한 객체가 훌륭한 클래스를 낳는다.

## 도메인의 구조를 따르는 프로그램 구조

문제를 해결하기 위해 사용자가 프로그램을 사용하는 분야를 **도메인**이라고 부른다. 요구사항과 프로그램을 객체라는 동일한 관점에서 바라볼 수 있기 때문에 도메인을 구성하는 개념들이 프로그램의 객체와 클래스로 매끄럽게 연결될 수 있다. 

![https://s3-us-west-2.amazonaws.com/secure.notion-static.com/0d33b36e-1dfe-4464-9097-5c8692fb7679/Untitled.png](https://s3-us-west-2.amazonaws.com/secure.notion-static.com/0d33b36e-1dfe-4464-9097-5c8692fb7679/Untitled.png)

일반적으로 클래스의 이름은 대응되는 도메인 개념의 이름과 동일하거나 적어도 유사하게 지어야 한다. **클래스 사이의 관계도 최대한 도메인 개념 사이에 맺어진 관계와 유사하게 만들어서 프로그램의 구조를 이해하고 예상하기 쉽게 만들어야 한다.** 

## 클래스 구현하기

클래스는 내부와 외부로 구분되며 훌륭한 클래스를 설계하기 위한 핵심은 어떤 부분을 외부에 공개하고 어떤 부분을 감출지를 결정하는 것이다. 

그렇다면 클래스의 내부와 외부를 구분해야 하는 이유는 무엇일까? **그 이유는 경계의 명확성이 객체의 자율성을 보장하기 때문이다.** 

## 협력하는 객체들의 공동체

Screening의 reserve 메서드는 영화를 예매한 후 예매 정보를 담고 있는 Resercation의 인스턴스를 생성해서 반환한다. 

    public class Screenning {
    	public Reservation reserve(Customer customer, int audienceCount){
    		return Reservation(customer, this, calculateFee(audienceCount), audienceCount);
    	}
    
    	private Money calculateFee(int audienceCount) {
    		return movie.calculateMovieFee(this).times(audienceCount);
    	}
    
    }

영화를 예매하기 위해 Screening, Movie, Reservation 인스턴스들은 서로의 메서드를 호출하며 상호작용한다. 이처럼 시스템의 어떤 기능을 구현하기 위해 객체들 사이에 이뤄지는 상호작용을 협력이라고 부른다

![https://s3-us-west-2.amazonaws.com/secure.notion-static.com/cf49a680-f598-4350-befa-f6d3c53d1b2f/Untitled.png](https://s3-us-west-2.amazonaws.com/secure.notion-static.com/cf49a680-f598-4350-befa-f6d3c53d1b2f/Untitled.png)

# 할인 요금 구하기

## 할인 요금 계산을 위한 협력 시작하기

    public class Movie {
    	private Money fee;
    	private DiscountPolicy discountpolicy
    	
    	...
    
      public Money calculateMovieFee(Screening screnning) {
    		return fee.minus(discountPolicy.calculateDiscountAmount(screening));
    	}
    }

이 메서드 안에는 한 가지 이상한 점이 있다. 어떤 할인 정책을 사용할 것인지 결정하는 코드가 어디에도 존재하지 않는다는 것이다. 단지 discountPolicy에게 메시지를 전송할 뿐이다. 

### 할인 정책과 할인 조건

할인 정책은 금액 할인 정책과 비율 할인 정책으로 구분된다. 두 가지 할인 정책을 각각 **AmountDiscountPolicy**와 **PercentDiscountPolicy**라는 클래스로 구현할 것이다. 

여기서는 부모 부모 클래스인 DiscountPolicy 안에 중복 코드를 두고 AmountDiscountPolicy와 PercentDiscountPolicy가 이 클래스를 상속받게 할 것이다. 

    public abstract class DiscountPolicy {
    	private List<DiscountCondition> conditions = new ArrayList<>();
    
    	public DiscountPolicy(DiscountCondition ... conditions) {
    		this.conditions = Arrays.asList(conditions);
    	}
    
    	public Monet calculateDiscountAmount(Screening screening) {
    		for(DiscountCondition each : conditions) { 
    			if (each.isSatisfiedBy(screening)) {
    				return getDiscountAmount(screening);
    			}
    		}
    		return Money.ZERO;
    	}
    
    	abstract protected Money getDiscountAmount(Screeing screening);
    }

이처럼 부모 클래스에 기본적인 알고리즘의 흐름을 구현하고 중간에 필요한 처리를 자식 클래스에게 위임하는 디자인 패턴을 **TEMPLATE METHOD 패턴**이라고 부른다. 

영화 예매 시스템에는 순번 조건과 기간 조건의 두 가지 할인 조건이 존재한다. 두 가지 할인 조건은 각각 **SequenceCondition**과 **PeriodCondition**이라는 클래스로 구현할 것이다. 

    public interface DiscountCondition {
    	boolean isStisfiedBy(Screening screening);
    }

![https://s3-us-west-2.amazonaws.com/secure.notion-static.com/3e6542ce-a326-4260-b367-89c774c5fe19/Untitled.png](https://s3-us-west-2.amazonaws.com/secure.notion-static.com/3e6542ce-a326-4260-b367-89c774c5fe19/Untitled.png)

    Movie avatar = new Movie("아바타",
    		Duration.ofMinutes(120),
    		Money.wons(10000),
    		new AmountDiscountPolicy(Money.wons(800),
    			new SequenceCondition(1),
    			new SequenceCondition(10),
    			new PeriodCondition(DayOfWeek.MONDAY, LocalTime.of(10,0), LocalTime.of(11,59)),
    			new PeriodCondition(DayOfWeek.THURSDAY, LocalTime.of(10,0), LocalTime.of(11,59)));

# 상속과 다형성

코드 상에서 Movie는 DiscountPolicy에 의존한다. 코드를 샅샅이 조사해 봐도 Movie가 AmountDiscountPolicy나 PercentDiscountPolicy에 의존하는 곳을 찾을 수는 없다. 그러나 실행 시점에는 Movie의 인스턴스는 AmountDiscountPolicy나 PercentDiscountPolicy의 인스턴스에 의존하게 된다. 

유연하고, 쉽게 **재사용**할 수 있으며, **확장 가능한** 객체지향 설계가 가지는 특징은 코드의 의존성과 실행 시점의 의존성이 다르다는 것이다. 

단, 코드의 의존성과 실행 시점의 의존성이 다르면 다를수록 **코드를 이해하기 어려워진다는 것이다.** 이와 같은 **의존성의 양면성**은 설계가 **트레이드 오프의 산물**이라는 사실을 잘 보여준다. 

훌륭한 객체지향 설계자로 성장하기 위해서는 항상 **유연성**과 **가독성** 사이에서 고민해야 한다. 

## 상속과 인터페이스

상속이 가치 있는 이유는 부모 클래스가 제공하는 모든 인터페이스를 자식 클래스가 물려받을 수 있기 때문이다. 

인터페이스는 객체가 이해할 수 있는 메시지의 목록을 정의한다는 것을 기억하라.

## 다형성

**다형성**은 객체지향 프로그램의 **컴파일 시간** 의존성과 **실행 시간** 의존성이 다를 수 있는 사실을 기반으로 한다. 

지연 바인딩, 동적 바인딩 : 컴파일 시간과 런타임 시간에 의존성이 다른 상태를 말한다. 

초기 바인딩, 정적 바인딩 : 컴파일 시간과 런타임 시간에 의존성이 동일한 상태를 말한다. 

> 구현 상속과 인터페이스 상속
순수하게 코드를 재사용하기 위한 목적으로 상속을 사용하는 것을 구현 상속이라고 부른다. 다형적인 협력을 위해 부모 클래스와 자식 클래스가 인터페이스를 공유할 수 있도록 상속을 이용하는 것을 인터페이스 상속이라고 부른다. 
상속은 구현 상속이 아니라 인터페이스 상속을 위해 사용해야 한다. 구현 상속은 변경에 취약한 코드를 낳게 될 확률이 높다.

## 추상화와 유연성

### 추상화의 힘

추상화를 사용할 경우의 두 가지 장점을 보여준다. 

- 추상화의 계층만 따로 떼어 놓고 살펴보면 요구사항의 정책을 **높은 수준**에서 서술할 수 있다는 것이다.
- 추상화를 이용하면 설계가 좀 더 **유연**해 진다는 것이다.

### 상속

상속의 가장 큰 문제점은 **캡슐화를 위반**한다는 것이다. 상속을 이용하기 위해서는 부모 클래스의 내부 구조를 잘 알고 있어야 한다. **결과적으로 부모 클래스의 구현이 자식 클래스에게 노출되기 때문에 캡슐화가 약화된다.** 캡슐화의 약화는 자식 클래스가 부모 클래스에 **강하게 결합**되도록 만들기 때문에 부모 클래스를 변경할 때 자식 클래스도 함께 변경될 확률을 높인다. **결과적으로 상속을 과도하게 사용한 코드는 변경하기도 어려워진다.** 

상속의 두 번째 단점은 설계가 유연하지 않다는 것이다. **상속은 부모 클래스와 자식 클래스 사이의 관계를 컴파일 시점에 결정한다.** 따라서 실행 시점에 객체의 종류를 변경하는 것이 불가능하다. 

반면 합성을 사용하면 이를 해결할 수 있다. 

    public class Movie {
    	private DiscountPolicy discountpolicy;
    	
    	public void changeDiscountPolicy(DiscountPolicy discountPolicy) {
    		this.discountPolicy = discountPolicy;
    	}
    }

### 합성

합성은 상속이 가지는 두 가지 문제점을 모두 해결한다. 인터페이스에 정의된 메시지를 통해서만 재사용이 가능하기 때문에 구현을 **효과적으로 캡슐화**할 수 있다. 또한 의존하는 **인스턴스를 교체**하는 것이 비교적 쉽기 때문에 설계를 유연하게 만든다. 

그렇다고 해서 상속을 절대 사용하지 말라는 것은 아니다. 이전 처럼 코드를 재사용하는 경우에는 상속보다는 합성을 선호하는 것이 옳지만 다형성을 위해 인터페이스를 재사용하는 경우에는 상속과 합성을 함께 조합해서 사용할 수밖에 없다.된다.** 관람객이 스스로 가방 안의 현금과 초대장을 처리하고 판매원이 스스로 매표소의 티켓과 판매 요금을 다루게 한다면 이 모든 문제를 한 번에 해결할 수 있을 것이다. 

## 자율성을 높이자

Theater의 enter 메서드에서 TicketOffice에 접근하는 모든 코드를 TicketSeller 내부로 숨기는 것이다. TicketSeller에 sellTo 메서드를 추가하고 Thater에 있던 로직을 이 메서드로 옮기자

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

이처럼 개념적이나 물리적으로 객체 내부의 세부적인 사항을 감추는 것을 **캡슐화**라고 부른다. 캡슐화를 통해 객체 내부로의 접근을 제한하면 객체와 객체 사이의 결합도를 낮출 수 있기 때문에 설계를 좀 더 쉽게 변경할 수 있게 된다. 

Theater는 오직 TicketSeller의 인터페이스에만 의존한다. TicketSeller가 내부에 TicketOffice 인스턴스를 포함하고 있다는 사실은 구현의 영역에 속한다. 

TicketSeller 다음으로 Audience의 캡슐화를 개선하자

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

TicketSeller 역시 TicketOffice의 자율권을 침해하였다

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

## 객제치향 설계

### 설계가 왜 필요한가

설계란 코드를 배치하는 것이다. **설계를 구현과 떨어트려서 이야기하는 것은 불가능하다.** 설계는 코드를 작성하는 매 순간 코드를 어떻게 배치할 것인지를 결정하는 과정에서 나온다. 설계는 코드 작성의 일부이며 코드를 작성하지 않고서는 검증할 수 없다. 

### 그렇다면 좋은 설계란 무엇인가?

**좋은 설계란 오늘 요구하는 기능을 온전히 수행하면서 내일의 변경을 매끄럽게 수용할 수 있는 설계다**

개발을 시작하는 시점에 구현에 필요한 모든 요구사항을 수집하는 것은 불가능에 가깝다. 모든 요구사항을 수집할 수 있다고 가정하더라도 개발이 진행되는 동안 요구사항은 바뀔 수밖에 없다. 

> 요구사항 변경은 필연적으로 코드 수정을 초래하고, 코드 수정은 버그가 발생할 가능성을 높인다. 코드 수정을 회피하려는 가장 큰 원인은 **두려움**이다. 그리고 그 두려움은 요구사항 변경으로 인해 버그를 추가할지도 모른다는 **불확실성**에 기인한다.

### 객체지향 설계

객제치향 프로그래밍은 **의존성**을 효율적으로 통제할 수 있는 다양한 방법을 제공함으로써 요구사항 변경에 좀 더 수월하게 대응할 수 있는 가능성을 높여준다. 단순히 데이터와 프로세스를 객체라는 덩어리 안으로 밀어 넣었다고 해서 변경하기 쉬운 설계를 얻을 수 있는 것은 아니다.