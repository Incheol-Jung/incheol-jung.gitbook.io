---
layout: reference
title:      "아이템5 자원을 직접 명시하지 말고 의존 객체 주입을 사용하라"
date:       2020-03-10 00:00:00
categories: effective
summary:    Effective Java 3e 아이템 5을 요약한 내용 입니다.
---

> Effective Java 3e 아이템 5를 요약한 내용 입니다.

많은 클래스가 하나 이상의 자원에 의존한다. 이런 클래스를 `정적 유틸리티 클래스`로 구현한 모습을 드물지 않게 볼 수 있다. 
```java
    public class SpellChecker {
    	privte static final Lexion dictionary = ...;
    
    	private SpellChecker() {} // 객체 생성 방지
    	public static SpellChecher INSTANCE = new SpellChecker(...);
    
    	public boolean isValid(String word) { ... }
    	public List<String> suggertions(String type) {...}
    }
```

실전에서는 사전이 언어별로 따로 있고 특수 어휘용 사전을 별도로 두기도 한다. 

필드에서 `final 한정자`를 제거하고 다른 사전으로 교체하는 메서드를 추가할 수 있지만, 아쉽게도 이 방식은 어색하고 `오류`를 내기 쉬우며 `멀티스레드 환경`에서는 쓸 수 없다. 사용하는 자원에 따라 동작이 달라지는 클래스에는 `정적 유틸리티 클래스`나 `싱글턴 방식`이 적합하지 않다. 

이 조건을 만족하는 간단한 패턴이 있으니, 바로 인스턴스를 생성할 때 생성자에 필요한 자원을 넘겨주는 방식이다. 
```java
    public class SpellChecker {
    	privte static final Lexion dictionary = ...;
    
    	public SpellChecker(Lexion dictionary) {
    		this.dictionary = Objects.requireNonNull(dictionar);
    
    	public boolean isValid(String word) { ... }
    	public List<String> suggertions(String type) {...}
    }
```

불변을 보장하여 (같은 자원을 사용하려는) 여러 클라이언트가 의존 객체들을 안심하고 공유할 수 있기도 한다. 의존 객체 주입은 생성자, 정적 팩터리, 빌더 모두에 똑같이 응용할 수 있다. 

이 패턴의 쓸만한 변형으로 생성자에 자원 팩터리를 넘겨주는 방식이 있다. 팩터리란 호출할 때마다 특정 타입의 인스턴스를 반복해서 만들어주는 객체를 말한다. 

이 방식을 사용해 클라이언트는 자신이 명시한 타입의 하위 타입이라면 무엇이든 생성할 수 있는 팩터리를 넘길 수 있다. 

의존 객체 주입이 `유연성`과 `테스트 용이성`을 개선해주긴 하지만, 의존성이 수천 개나 되는 큰 프로젝트에서는 코드를 이지럽게 만들기도 한다. 

프레임워크 활용법은 이 책에서 다룰 주제는 아니지만, 이들 프레임워크는 의존 객체를 직접 주입하도록 설계된 API를 알맞게 응용해 사용하고 있음을 언급해둔다. 

# 정리

클래스가 내부적으로 하나 이상의 자원에 의존하고, 그 자원이 클래스 동작에 영향을 준다면 싱글턴과 정적 유틸리티 클래스는 사용하지 않는 것이 좋다. 이 자원들을 클래스가 직접 만들게 해서도 안된다.