---
description: Effective Java 3e 아이템 57를 요약한 내용 입니다.
---

# 아이템57 지역변수의 범위를 최소화하라

지역 변수의 유효 범위를 최소로 줄이면 코드 가독성과 유지보수성이 높아지고 오류 가능성은 낮아진다.

## 지역변수의 유효 범위를 줄일수 있는 방법은 어떤게 있을까?

### 가장 처음 쓰일때 선언하라

지역 변수를 생각 없이 선언하다 보면 변수가 쓰이는 범위보다 너무 앞서 선언하거나, 다 쓴 뒤에도 여전히 살아 있게 되기 쉽다.

#### 메소드 상단에 사용할 모든 변수를 선언해서 사용한 경우이다.

```text
public void calculate() {
	int a = 1;
	int b = 2;
	int c = 3;

	b = b + c;
	c = c + c;

	...

	a = b + c;

}
```

#### 변수를 사용하는 위치에서 선언한 경우이다.

```text
public void calculate() {
	int b = 2;
	int c = 3;

	b = b + c;
	c = c + c;

	...

	int a = b + c;

}
```

### 선언과 동시에 초기화 해야 한다

초기화에 필요한 정보다 충분하지 않다면 충분해질 때까지 선언을 미뤄야 한다.

```text
public void calculate() {
	Person person = new Person();

	...

	person.setName("incheol");
	person.setAge(20);
}
```

```text
public void calculate() {
	Person person = new Person("incheol", 20);
	...
}
```

### 반복문은 독특한 방식으로 변수 범위를 최소화해준다

반복문에서는 반복 변수의 범위가 반복문의 몸체, 그리고 for 키워드와 몸체 사이의 괄호 안으로 제한된다. 따라서 반복 변수의 값을 반복문이 종료된 뒤에도 써야 하는 상황이 아니라면 while 문 보다는 for 문을 쓰는 편이 낫다.

다음은 while 문을 잘못 사용하여 버그를 발생한 상황이다.

```text
Iterator<Element> i = c.iterator();
while (i.hasNext()) {
	doSomething(i.next());
}

...

Iterator<Element> i2 = c2.iterator();
while (i.hasNext()) {
	doSomething(i2.next());
}
```

두 번째 while 문에는 새로운 반복 변수 i2를 초기화 했지만, 실수로 이전 while 문에서 쓴 i 를 다시 써서 코드 컴파일엔 오류가 없지만 프로그램 오류가 겉으로 드러나지 않으니 오랜 기간 발견되지 않을 수도 있다.

for 문을 사용하면 이런 오류를 컴파일 타임에 잡아줄 것이다.

```text
for (Iterator<Element> i = c.iterator(); i.hasNext()) {
	doSomething(i.next());
}

...

// 다음 코드는 "i를 찾을 수 없다"는 컴파일 오류를 낸다. 
while (Iterator<Element> i2 = c2.iterator(); i.hasNext()) {
	doSomething(i2.next());
}
```

### 메서드를 작게 유지하고 한 가지 기능에 집중하라

한 메서드에서 여러 가지 기능을 처리한다면 그중 한 기능과 관련된 지역 변수라도 다른 기능을 수행하는 코드에서 접근할 수 있을 것이다. 해결책은 간단하다. 단순히 메서드를 기능별로 쪼개면 된다.

```text
// case1. 하나의 메소드에 여러 기능을 포함한 경우
public void buy() {
	// 아이템의 가격을 확인한다. 
	// 아이템의 할인 정책을 적용한다. 
	// 사용자의 보유 금액을 아이템 가격만큼 차감한다. 
}

// case2. 기능단위로 메소드를 쪼개서 사용한 경우
public void buy() {
	아이템_가격_확인()
	아이템_할인_정책_적용()
	사용자_보유_금액_차감()
}

public Long 아이템_가격_확인() {
	...
}

public void 아이템_할인_정책_적용() {
	...
}

public void 사용자_보유_금액_차감() {
	...
}
```

