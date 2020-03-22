---
layout:     post
title:      "아이템2 생성자에 매개변수가 많다면 빌더를 고려하라"
date:       2020-03-10 00:00:00
categories: effective
summary:    Effective Java 3e 아이템 2을 요약한 내용 입니다.
---

> Effective Java 3e 아이템 2를 요약한 내용 입니다.

정적 팩터리와 생성자에는 똑같은 **제약**이 하나 있다. 선택적 매개변수가 많을 때 적절히 대응하기 어렵다는 점이다. 

프로그래머들은 이럴 때 **점층적 생성자 패턴**을 즐겨 사용했다. 

**점층적 생성자 패턴이란?**
필수 매개변수만 받는 생성자 → 필수 매개변수와 선택 매개변수 1개를 받는 생성자
형태로 선택 매개변수를 전부 다 받는 생성자까지 늘려가는 방식

점층적 생성자 패턴도 쓸 수는 있지만, 매개변수 개수가 많아지면 클라이언트 코드를 작성하거나 읽기 어렵다. 

클라이언트가 실수로 **매개변수의 순서**를 바꿔 건네줘도 컴파일러는 알아채지 못하고, 결국 런타임에 엉뚱한 동작을 하게 된다. 

이번에는 선택 매개변수가 많을 때 활용할 수 있는 두 번째 대안인 **자바빈즈패턴**을 보겠다. 매개변수가 없는 생성자로 객체를 만든 후, **Setter 메서드**들을 호출해 원하는 개매변수의 값을 설정하는 방식이다. 
```java
public class NutritionFacts {
	private int servingSize = -1;
	private int servings = -1;
	private int calories = 0;
	private int fat = 0;
	private int sodium = 0;
	private int carbohydrate = 0;

	public NutritionFacts() { }

	public void setServingSize(int val) { ... }
	public void setServings(int servings) { ... }
	public void setCalories(int calories) { ... }
	public void setFat(int fat) { ... }
	public void setSodium(int sodium) { ... }
	public void setCarbohydrate(int carbohydrate) { ... }

}
```

코드가 길어지긴 했지만 인스턴스를 만들기 쉽고, 그 결과 **더 읽기 쉬운 코드**가 되었다. 

자바빈즈패턴에서는 객체 하나를 만들려면 메서드를 **여러 개 호출**해야 하고, 객체가 완전히 생성되기 전까지는 **일관성(consistency)**이 무너진 상태에 놓이게 된다. 

이처럼 일관성이 무너지는 문제 때문에 자바빈즈 패턴에서는 클래스를 **불변**으로 만들 수 없으며 **스레드 안전성**을 얻으려면 프로그래머가 추가 작업을 해줘야만 한다. 

이러한 단점을 완화하고자 생성이 끝난 객체를 수동으로 '**얼리고(freezing)**' 얼리기 전에는 사용할 수 없도록 하기도 한다. 

다행히 우리에겐 세 번째 대안이 있다. 

점층적 생성자 패턴의 **안전성**과 자바빈즈 패턴의 **가독성**을 겸비한 빌더 패턴이다. 클라이언트는 필요한 객체를 직접 만드는 대신, 필수 매개변수만으로 생성자(혹은 정적 팩터리)를 호출해 빌더 객체를 얻는다. 

빌더는 생성할 클래스 안에 정적 멤버 클래스로 만들어두는게 보통이다. 
```java
public class NutritionFacts {
	private final int servingSize;
	private final int servings;
	private final int calories;
	private final int fat;
	private final int sodium;
	private final int carbohydrate;

	public static class Builder {
		// 필수 매개변수
		private final int servingSize;
		private final int servings;

		// 선택 매개변수 - 기본값으로 초기화한다. 
		private int calories = 0;
		private int fat = 0;
		private int sodium = 0;
		private int carbohydrate = 0;

		public Builder(int servingSize, int servings) {
			this.servingSize = servingSize;
			this.servings = servings;
		}

		public Builder calories(int val) { calories = val; return this }
		public Builder fat(int val) { fat = val; return this }
		public Builder sodium(int val) { sodium = val; return this }
		public Builder carbohydrate(int val) { carbohydrate = val; return this }

		private NutritionFacts(Builder builder) {
			servingSize = builder.servingSize;
			servings = builder.servings;
			calories = builder.calories;
			fat = builder.fat;
			sodium = builder.sodium;
			carbohydrate = builder.carbohydrate;
		}
}
```

빌더의 세터 메서드들은 빌더 자신을 반환하기 때문에 연쇄적으로 호출할 수 있다. 
```java
NutritionFacts cocaCola = new NutritionFacts.Builder(240, 8).
																									.calories(100)
																									.fat(35)
																									.sodium(40)
																									.carbohydrate(1)
																									.build();
```
이 클라이언트 코드는 쓰기 쉽고, 무엇보다도 읽기 쉽다. 

빌더 패턴은 상당히 **유연하다**. 빌더 하나로 여러 객체를 **순회**하면서 만들 수 있고, 빌더에 넘기는 매개변수에 따라 다른 객체를 만들 수도 있다. 

빌더 패턴에 장점만 있는 것은 아니다. 객체를 만들려면 그에 앞서 **빌더**부터 만들어야 한다. 빌더 생성 비용이 크지는 않지만 **성능**에 민감한 상황에서는 **문제**가 될 수 있다. 

**자바에서는 빌더 생성과 성능에 대한 이슈를 어떻게 해결하였는가?**

생성자나 **정적 팩터리 방식**으로 시작했다가 나중에 매개변수가 많아지면 **빌더 패턴**으로 전환할 수도 있지만, 이전에 만들어둔 생성자와 정적 팩터리가 아주 도드라져 보일 것이다. 그러니 애초에 빌더로 시작하는 편이 나을 때가 많다.

# 정리

생성자나 정적 팩터리가 처리해야 할 매개변수가 많다면 빌더 패턴을 선택하는 게 더 낫다. 매개변수 중 다수가 필수가 아니거나 같은 타입이면 특히 더 그렇다. 빌더는 점층적 생성자보다 클라이언트 코드를 읽고 쓰기가 훨씬 **간결**하고 자바빈즈보다 훨씬 **안전**하다.