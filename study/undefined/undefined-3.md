---
description: 객체지향과 디자인 패턴(최범균 저) 다형성과 추상 타입 파트 정리한 내용입니다.
---

# 다형성과 추상 타입

## 객체 지향이 주는 장점은 구현 변경의 유연함이다

상속은 한 타입을 그대로 사용하면서 구현을 추가할 수 있도록 해주는 방법을 제공한다. 다형성은 한 객체가 여러 가지\(poly\) 모습\(morph\)을 갖는다는 것을 의미한다.

구현 상속은 클래스 상속을 통해서 이루어진다. 구현 상속은 보통 상위 클래스에 정의된 기능을 재사용하기 위한 목적으로 사용된다. 추상화는 데이터나 프로세스 등을 의미가 비슷한 개념이나 표현으로 정의하는 과정이다. 추상화된 타입은 오퍼레이션의 시그니터만 정의할 뿐 실제 구현을 제공하지는 못한다.

#### 콘크리트 클래스를 직접 사용해도 문제가 없는데, 왜 추상 타입을 사용하는 것일까?

```java
public class FlowController {
	private boolean useFile;
	public FlowController(boolean useFile) {
		this.useFile = useFile;
	}

	public void process() {
		byte[] data = null;
		if (useFile) {
			FileDataReader fileReader = new FileDataReader();
			data = fileReader.read();
		} else {
			SockerDataReader sockerReader = new SockerDataReader();
			data = sockerReader.read();
		}
		...
} 
```

FlowController 자체는 파일이건 소켓이건 상관없이 데이터를 읽어 오고 이를 암호화해서 특정 파일에 기록하는 책임을 진다.

그런데, flowController의 본연의 책임\(흐름 제어\)과 상관없는 데이터 읽기 구현의 변경 때문에 FlowController도 함께 바뀌는 것이다.

```java
ByteSource source = null;
if (useFile)
	source = new FileDataReader();
else
	source = new SockerDataReader();
byte[] data = source.read();
```

이전 코드보다 약간 단순해졌지만, 여전히 if-else 블록이 남아있다.

#### ByteSource의 종류가 FlowController가 바뀌지 않도록 하는 방법에는 다음의 두 가지가 존재한다.

* ByteSource 타입의 객체를 생성하는 기능을 별도 객체로 분리한 뒤, 그 객체를 사용해서 ByteSource 생성
* 생성자\(또는 다른 메서드\)를 이용해서 사용할 ByteSource를 전달받기

```java
public class ByteSourceFactory {
	public ByteSource create() {
		if (useFile())
			return new FileDataReader();
		else
			return new SockerDataReader();
	}

	private boolean useFile() {
		String useFileVal = System.getProperty("useFile");
		return useFileVal != null && Boolean.valueOf(useFileVal);
	}

	// 싱글톤 패턴 적용
	private static ByteSourceFactory instance = new ByteSourceFactory();
	public static ByteSourceFactory getInstance() {
		return instance;
	}

	...
}
```

```java
public class FlowController {
	public void process() {
		ByteSource source = new ByteSourceFactory.getInstance().create();
		byte[] data = source.read();

		...
	}
}
```

이제는 새로운 ByteSource 구현 클래스가 추가되어도 FlowController 클래스의 코드는 영향을 받지 않는다.

즉, 추상화는 공통된 개념을 도출해서 추상 타입을 정의해 주기도 하지만, 많은 책임을 가진 객체로부터 책임을 분리하는 촉매제가 되기도 한다.

사실 추상화를 잘 하려면 다양한 상황에서 코드를 작성하고 이 과정에서 유연한 설계를 만들어 보는 경험을 해봐야 한다.

경험하지 않은 분야라 하더라도 추상화할 수 있는 방법이 하나 있는데, 그것이 바로 변화되는 부분을 추상화하는 것이다. 요구 사항이 바뀔 때 변화되는 부분은 이후에도 변경될 소지가 많다. 이런 부분을 추상 타입으로 교체하면 향후 변경에 유연하게 대처할 수 있는 가능성이 높아진다.

## 인터페이스에 대고 프로그래밍하기

실제 구현을 제공하는 콘크리트 클래스를 사용해서 프로그래밍하지 말고, 기능을 정의한 인터페이스를 사용해서 프로그래밍하라는 뜻이다.

추상 타입을 사용하면 기존 코드를 건드리지 않으면서 콘크리트 클래스를 교체할 수 있는 유연함을 얻을 수 있는데 이 규칙은 바로 추상화를 통한 유연함을 얻기 위한 규칙이다.

주의할 점은 유연함을 얻는 과정에서 타입\(추상 타입\)이 증가하고 구조도 복잡해지기 때문에 모든 곳에서 인터페이스를 사용해서는 안 된다는 것이다. 이 경우, 불필요하게 프로그램의 복잡도만 증가시킬 수 있다. 인터페이스를 사용해야 할 때는 변화 가능성이 높은 경우에 한해서 사용해야 한다.

따라서 변화 가능성이 높은 콘크리스트 클래스 대신 이를 추상화한 인터페이스를 사용하면 \(다소 구조는 복잡해지지만\) 변경의 유연함이라는 효과를 얻을 수 있지만 변경 가능성이 매우 희박한 클래스에 대해 인터페이스를 만든다면 오히려 프로그램의 구조만 복잡해지고 유연함의 효과는 누릴 수 없는 그런 상황이 발생하게 된다.

