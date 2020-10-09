---
description: 객체지향과 디자인 패턴(최범균 저) 설계 원칙 파트 정리한 내용입니다.
---

# 설계 원칙: SOLID

SOLID 설계 원칙 : 객체 지향을 설계하는데 기본이 되는 원칙

* 단일 책임 원칙 \(Single responsibility principle; SRP\)
* 개방-폐쇄 원칙 \(Open-closed principle; OCP\)
* 리스코프 치환 원칙 \(Liskov substitution principle; LSP\)
* 인터페이스 분리 원칙 \(Interface segregation principle; ISP\)
* 의존 역전 원칙 \(Dependency inversion principle; DIP\)

## 단일 책임 원칙

> 클래스는 단 한 개의 책임을 가져야 한다.

클래스가 여러 책임을 갖게 되면 그 클래스는 각 책임마다 변경되는 이유가 발생하기 때문에, 클래스가 한 개의 이유로만 변경되려면 클래스는 한 개의 책임만을 가져야 한다. 단일 책임 원칙이 잘 지켜지지 않으면 다른 원칙들도 그 효과가 반감되기 때문에 최대한 지켜야 하는 원칙이 바로 단일 책임 원칙이다.

그런데 단일 책임 원칙은 가장 어려운 원칙이기도 하다. 한 개의 책임에 대한 정의가 명확하지 않고, 책임을 도출하기 위해서는 다양한 경험이 필요하기 때문이다.

### 단일 책임 원칙 위반이 불러오는 문제점

```java
public class DataViewer {
	public void display() {
		String data = loadHtml();
		updateGui(data);
	}

	public String loadHtml() {
		HttpClient client = new HttpClient();
		client.connect(url);
		return client.getResponse();
	}

	private void updateGui(String data) { ... }

	private GuiData parseDataToGuiData(String data) { ... }
}
```

DataViewer를 잘 사용하고 있는 도중에 데이터를 제공하는 서버가 HTTP 프로토콜에서 소켓 기반의 프로토콜로 변경되었다. 이 프로토콜은 응답 데이터로 byte 배열을 제공한다.

```java
public class DataViewer {
	public void display() {
		byte[] data = loadHtml(); // update!!
		updateGui(data);
	}

	public byte[] loadHtml() { // update!!
		HttpClient client = new HttpClient();
		client.connect(url);
		return client.getResponse();
	}

	private void updateGui(byte[] data) { ... } // update!!

	private GuiData parseDataToGuiData(String data) { ... }
}
```

이러한 연쇄적인 코드 수정은 두 개의 책임-데이터 읽는 책임과 화면에 보여주는 책임이 한 클래스에 아주 밀접하게 결합되어 있어서 발생한 증상이다.

![](../../.gitbook/assets/444%20%286%29.png)

위와 같이 데이터 읽기와 데이터를 화면에 보여주는 책임을 두 개의 클래스로 분리하고 둘 간에 주고받을 데이터를 저수준의 String이 아닌 알맞게 추상화된 타입을 사용하면 데이터를 읽어 오는 부분의 변경 때문에 화면을 보여주는 부분의 코드가 변경되는 상황을 막을 수 있을 것이다.

DataLoader 클래스가 내부적으로 구현을 변경하더라도, DataDisplayer는 영향을 받지 않는다. 즉, 한 클래스에 섞여 있던 책임을 두 클래스로 분리함으로써 변경의 여파를 줄일 수 있게 되는 것이다.

단일 책임 원칙을 어길 때 발생하는 또 다른 문제점은 재사용을 어렵게 한다는 것이다.

![](../../.gitbook/assets/333%20%2810%29.png)

데이터를 읽어 와서 필수값을 체크하는 DataRequiredClient 클래스를 구현하기 위해 Dataviewer 클래스와 HttpClient jar 파일이다. 하지만, 실제로는 DataViewer가 GuiComp를 필요로 하므로 GuiClinet jar 파일이다. 하지만, 실제로는 DataViewer가 GuiComp를 필요로 하므로 GuiComp jar 파일까지 필요하다. 즉, 실제 사용하지 않는 기능이 의존하는 jar 파일까지 필요한 것이다.

#### 책임의 단위는 변화되는 부분과 관련이 깊다.

각각의 책임은 서로 다른 이유로 변경되고 서로 다른 비율로 변경되는 특징이 있다.

따라서 서로 다른 이유로 바뀌는 책임들이 한 클래스에 함께 포함되어 있다면 이 클래스는 단일 책임 원칙을 어기고 있다고 볼 수 있다.

그러면 어떻게 하면 단일 책임 원칙을 지킬 수 있을까? 그 방법은 바로 메서드를 실행하는 것이 누구인지 확인해 보는 것이다.

![](../../.gitbook/assets/222%20%2812%29.png)

이렇게 클래스의 사용자들이 서로 다른 메서드들을 사용한다면 그들 메서드는 각각 다른 책임에 속할 가능성이 높고 따라서 책임 분리 후보가 될 수 있다.

## 개방 폐쇄 원칙

> 확장에는 열려 있어야 하고, 변경에는 닫혀 있어야 한다.

즉, 기능을 확장 하면서도 그 기능을 사용하는 기존 코드는 변경되지 않는것이다. 이를 개방 폐쇄 원칙은 \(사용되는 기능의\)확장에는 열려 있고 \(기능을 사용하는 코드의\) 변경에는 닫혀 있다고 표현한 것이다.

### 개방 폐쇄 원칙이 깨질 때의 주요 증상

* 다운 캐스팅을 한다.

  instanceof와 같은 타입 확인 연산자가 사용된다면 해당 코드는 개발 폐쇄 원칙을 지키지 않을 가능성이 높다.

  만약 향후에 객체들 마다 다르게 동작할 가능성이 높다면 이 메서드를 알맞게 추상화해서 Character 타입에 추가해 주어야 한다.

  ```text
  public void drawCharacter(Character character) {
  	if (character instanceof Missile) { // 타입 확인
  		Missile missile = (Missile) character; // 타입 다운 캐스팅
  		missile.drawSpecific();
  	} else {
  		character.draw();
  	}
  }
  ```

* 비슷한 is-else 블록이 존재한다.

  ```text
  public class Enemy extends Chracter {
  	private int pathPattern;
  	public Enemy(int pathPattern) {
  		this.pathPattern = pathPattern;
  	}

  	public void draw() {
  		if (pathPattern == 1) {
  			x += 4;
  		} else if (pathPattern == 2) {
  			y += 10;
  		} else if (pathPattern == 4) {
  			x += 4;
  			y += 10;
  		}
  		...
  	}
  }
  ```

  Enemy 클래스에 새로운 경로 패턴을 추가해야 할 경우 Enemy 클래스의 draw\(\) 메서드에는 새로운 if 블록이 추가된다. 즉, 경로를 추가하는데 Enemy 클래스가 닫혀 있지 않은 것이다.

개방 폐쇄 원칙은 변경의 유연함과 관련된 원칙이다. 만약 기존 기능을 확장하기 위해 기존 코드를 수정해 주어야 한다면, 새로운 기능을 추가하는 것이 점점 힘들어진다.

이 말은 변화되는 부분을 추상화하지 못하면 개발 폐쇄 원칙을 지킬 수 없게 된다는 것을 뜻한다.

따라서 코드에 대한 변화 요구가 발생화면, 변화와 관련된 구현을 추상화해서 개발 폐쇄 원칙에 맞게 수정할 수 있는지 확인하는 습관을 갖도록 하자.

## 리스코프 치환 원칙

> 상위 타입의 객체를 하위 타입의 객체로 치환해도 상위 타입을 사용하는 프로그램은 정상적으로 동작해야 한다.

* 하위 타입이 상위 타입을 대체 하지 못할 경우

  리스코프 치환 원칙이 제대로 지켜지지 않으면 다형성에 기반한 개발 폐쇄 원칙 역시 지켜지지 않기 때문에, 리스코프 치환 원칙을 지키는 것은 매우 중요 하다.

  ```text
  public class Rectangle {
  	private int width;
  	private int height;
	
  	public void setWidth(int width) {
  		this.width = width;
  	}
  	public void setHeight(int height) {
  		this.height = height;
  	}
  	public int getWidth() {
  		return width;
  	}
  	public int getHeight() {
  		return height;
  	}
  }
  ```

  정사각형을 직사각형의 특수한 경우로 보고 정사각형을 표현하기 위한 Square 클래스가 Rectangle 클래스를 상속받도록 구현을 했다고 하자.

  ```text
  public class Square extends Rectangle {
  	@Override
  	public void setWidth(int width) {
  		super.setWidth(width);
  		super.setHeight(width);
  	}

  	@Override
  	public setHeight(int height) {
  		super.setWidth(height);
  		super.setHeight(height);
  	}
  }
  ```

  이제 Rectangle 클래스를 사용하는 코드를 살펴보자. 이 코드는 높이와 폭을 비교해서 높이를 더 길게 만들어 주는 기능을 제공한다고 해보자.

  ```text
  public void increaseHeight(Rectangle rec) {
  	if (rec.getHeight() <= rec.getWidth()) {
  		rec.setHeight(rec.getWidth() + 10);
  	}
  }
  ```

  increaseHeight\(\) 메서드를 사용하는 코드는 increaseHeight\(\) 메서드 실행 후에 width보다 height의 값이 더 크다고 가정할 것이다. 그런데, increaseHeight\(\) 메서드의 rec 파라미터로 Square 객체가 전달되면, 이 가정은 깨진다. Square의 setHeight\(\) 메서드는 높이와 폭을 모두 같은 값으로 만들기 때문에 increaseHeight\(\) 메서드를 실행하더라도 높이가 폭 보다 길어지지 않게 된다.

  ```text
  public void increaseHeight(Rectandle rec) {
  	if (rec instanceof Square)
  		throw new CantSupportSquareException();
  	if (rec.getHeight() <= rec.getWidth()) {
  		rec.setHeight(rec.getWidth() + 10);
  	}
  }
  ```

  앞서 봤듯이 instanceof 연산자를 사용한다는 것 자체가 리스코프 치환 원칙 위반이 되고, 이는 increaseHeight\(\) 메서드가 Rectangle의 확장에 열려 있지 않다는 것을 뜻한다.

* 상위 타입에서 지정한 리턴 값의 범위에 해당되지 않는 값을 리턴할 경우

  InputStream의 read\(\) 메서드는 스트림의 끝에 도달해서 더 이상 데이터를 읽어올 수 없는 경우 -1을 리턴한다고 정의되어 있고, CopyUtil.copy\(\) 메서드는 이 규칙에 따라 is.read\(\)의 리턴 값이 -1이 아닐 때까지 반복해서 데이터를 읽어 와 out에 쓴다.

  ```text
  public class CopyUtil {
  	public static void copy(InputStream is, OutputStream out) {
  		byte[] data = new byte[512];
  		int len = -1;

  		// InputStream.read() 메서드는 스트림의 끝에 도달하면 -1을 리턴
  		while ((len = is.read(data)) != -1 ) {
  			out.write(data, 0 , len);
  		}
  	}
  }
  ```

  그런데 만약 InputStream을 상속한 하위 타입에서 read\(\) 메서드를 아래와 같이 구현하면 어떻게 될까?

  ```text
  public class SataninputStream implements InputStream {
  	public int read(byte[] data) {
  		...
  		return 0; // 데이터가 없을 때 0을 리턴하도록 구현
  	}
  }
  ```

  데이터가 없더라도 -1을 리턴하지 않기 때문에 CopyUtil.copy\(\) 메서드는 무한루프를 돌면서 실행이 끝나지 않게 된다. 위와 같은 문제가 발생하는 이유는 SatanInputStream 타입의 객체가 상위 타입인 InputStream을 올바르게 대체하지 않기 때문이다.

#### 기능 실행의 계약과 관련해서 흔히 발생하는 위반 사례로는 다음과 같은 것들이 있다.

* 명시된 명세에서 벗어난 값을 리턴한다.
* 명시된 명세에서 벗어난 익셉션을 발생한다.
* 명시된 명세에서 벗어난 기능을 수행한다.

하위 타입이 이렇게 명세에서 벗어난 동작을 하게 되면, 이 명세에 기반해서 구현한 코드는 비정상적으로 동작할 수 있기 때문에, 하위 타입은 상위 타입에서 정의한 명세를 벗어나지 않는 범위에서 구현해야 한다.

또한, 리스코프 치환 원칙은 확장에 대한 것이다. 리스코프 치환 원칙을 어기면 개발 폐쇄 원칙을 어길 가능성이 높아진다. 리스코프 치환 원칙을 어기게 된 이유는 개부분 추상화가 덜 되었기 때문이다.

그러므로 변화에 대한 코드를 추상화 하는게 무엇보다 중요하다.

## 인터페이스 분리 원칙

> 인터페이스는 그 인터페이스를 사용하는 클라이언트를 기준으로 분리해야 한다. 원본 : 클라이언트는 자신이 사용하는 메서드에만 의존해야 한다

용도에 맞게 인터페이스를 분리하는 것은 단일 책임 원칙과도 연결된다. 단일 책임 원칙에서 봤듯이 하나의 타입에 여러 기능이 섞여 있을 경우 한 기능의 변화로 인해 다른 기능이 영향을 받을 가능성이 높아진다. 따라서 클라이언트 입장에서 사용하는 기능만 제공하도록 인터페이스를 분리함으로써 한 기능에 대한 변경의 여파를 최소화할 수 있게 된다.

또한, 단일 책임 원칙이 잘 지켜질 때 인터페이스와 콘크리트 클래스의 재사용 가능성을 높일 수 있으므로 인터페이스 분리 원칙은 결국 인터페이스와 콘크리트 클래스의 재사용성을 높여 주는 효과도 갖는다.

각 클라이언트가 사용하는 기능을 중심으로 인터페이스를 분리함으로써, 클라이언트로터 발생하는 인터페이스 변경의 여파가 다른 클라이언트에 미치는 영향을 최소화할 수 있게 된다.

![](../../.gitbook/assets/111%20%2817%29.png)

## 의존 역전 원칙

> 고수준 모듈은 저수준 모듈의 구현에 의존해서는 안 된다. 저수준 모듈이 고수준 모듈에서 정의한 추상 타입에 의존해야 한다.

고수준 모듈은 상대적으로 큰 틀\(즉, 상위 수준\)에서 프로그램을 다룬다면, 저수준 모듈은 각 개별 요소\(즉, 상세\)가 어떻게 구현될지에 대해서 다룬다.

의존 역전 원칙은 런타임의 의존이 아닌 소스 코드의 의존을 역전시킴으로써 변경의 유연함을 확보할 수 있도록 만들어 주는 원칙이지, 런타임에서의 의존을 역전시키는 것은 아니다.

의존 역전 원칙은 타입의 소유도 역전시키고 각 패키지를 독립적으로 배포할 수 있도록 만들어 준다.

## SOLID 정리

단일 책임 원칙과 인터페이스 분리 원칙은 객체가 커지지 않도록 막아 준다. 객체가 많은 기능을 가지게 되면, 객체가 가진 기능의 변경 여파가 그 객체의 다른 기능에까지 번지게 되고 이는 다시 다른 기능을 사용하는 클라이언트에게까지 영향을 준다. 객체가 단일 책임을 갖게하고 클라이언트마다 다른 인터페이스를 사용하게 함으로써 한 기능의 변경이 다른 곳에까지 미치는 영향을 최소화할 수 있고, 이는 결국 기능 변경을 보다 쉽게 할 수 있도록 만들어준다.

리스코프 치환 원칙과 의존 역전 원칙은 개방 폐쇄 원칙을 지원한다. 개방 폐쇄 원칙은 변화되는 부분을 추상화하고 다형성을 이용함으로써 기능 확장을 하면서도 기존 코드를 수정하지 않도록 만들어 준다. 여기서, 변화되는 부분을 추상화할 수 있도록 도와주는 원칙이 바로 의존 역적 원칙이고, 다형성을 도와주는 원칙이 리스코프 치환 원칙인 것이다.

인터페이스 분리 원칙은 클라이언트 입장에서 인터페이스를 분리하고 있으며, 의존 역전 원칙 역시 저수준 모듈을 사용하는 고수준 모듈 입장에서 도출하도록 유도한다. 또한, 리스코프 치환 원칙은 사용자에게 기능 명세를 제공하고, 그 명세에 따라 기능을 구현할 것을 약속한다. 이처럼 SOLID 원칙은 사용자 관점에서의 설계를 지향하고 있다.

