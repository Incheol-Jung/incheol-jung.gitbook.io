---
description: Effective Java 3e 아이템 78를 요약한 내용 입니다.
---

# 아이템78 공유 중인 가변 데이터는 동기화해 사용하라

`synchronized` 키워드는 해당 메서드나 블록을 한번에 한 `스레드`씩 수행하도록 보장한다. 즉 한 스레드가 변경하는 중이라서 상태가 일관되지 않은 순간의 객체를 다른 스레드가 보지 못하게 막는 용도로만 생각한다.

`동기화`를 제대로 사용하면 어떤 메서드도 이 객체의 상태가 일관되지 않은 순간을 볼 수 없고 스레드가 만든 변화를 다른 스레드에서 확인하지 못할 수 있다.

`long`과 `double` 외의 변수를 읽고 쓰는 동작은 `원자적(atomic)`이다. 이 말을 듣고 \*\*"성능을 높이려면 원자적 데이터를 읽고 쓸 때는 동기화하지 말아야겠다"\*\*고 생각하기 쉬운데, 아주 위험한 발상이다.

#### `동기화`는 배타적 실행뿐 아니라 스레드 사이의 안정적인 통신에 꼭 필요하다.

공유 중인 가변 데이터를 비록 `원자적`으로 읽고 쓸 수 있을지라도 `동기화`에 실패하면 처참한 결과로 이어질 수 있다. 다음 스레드를 중지하는 코드를 살펴보자

```java
public class StopThread {
	private static boolean stopRequested;

	public static void main(String[] args) throws InterruptedException {
		Thread backgroundThread = new Thread(() -> {
			int i = 0;
			while (!stopRequested) 
				i ++;
		});
		backgroundThread.start();

		TimeUnit.SECONDS.sleep(1);
		stopRequested = true;
	}
}
```

위의 코드를 보면 1초 후 `stopRequested`를 `true`로 설정하면 `backgroundTread`는 반복문을 빠져나올 것처럼 보일 것이다. 하지만 내 컴퓨터에서는 도통 끝날 줄 모르고 영원히 수행되었다. 원인은 동기화하지 않으면 메인 스레드가 수정한 값을 백그라운드 스레드가 언제쯤에나 보게 될지 보증할 수 없다. 동기화가 빠지면 가상 머신이 다음과 같은 최적화를 수행할 수도 있는 것이다.

```java
if (!stopRequested)
	while (true)
		i++;
```

이는 `stopRequested` 필드를 동기화해 접근하면 이 문제를 해결할 수 있다.

```java
public class StopThread {
	private static boolean stopRequested;

	private static synchronized void requestStop() {
		stopRequested = true;
	}
	
	private static synchronized boolean stopRequested() {
		return stopRequested;
	}

	public static void main(String[] args) throws InterruptedException {
		Thread backgroundThread = new Thread(() -> {
			int i = 0;
			while (!stopRequested()) 
				i ++;
		});
		backgroundThread.start();

		TimeUnit.SECONDS.sleep(1);
		requestStop();
	}
}
```

반복문에서 매번 동기화하는 비용이 크진 않지만 속도가 더 빠른 대안이 있다. `stopRequested` 필드를 `volatile`으로 선언하면 동기화를 생각해도 된다. `volatile` 한정자는 `배타적` 수행과는 상관없지만 항상 가장 최근에 기록된 값을 읽게 됨을 보장한다.

```java
public class StopThread {
	private static volatile boolean stopRequested;

	public static void main(String[] args) throws InterruptedException {
		Thread backgroudThread = new Tread(() -> {
			int i = 0;
			while (!stopRequested) 
				i ++;
		});
		backgroundThread.start();

		TimeUnit.SECONDS.sleep(1);
		stopRequested = true;
	}
}
```

하지만 `volatile`은 주의해서 사용해야 한다.

```java
private static volatile int nextSerialNumber = 0;

public static int generateSerialNumber() {
	return nextSerialNumber++;
}
```

이 메서드는 매번 고유한 값을 반환할 의도로 만들어졌다. **문제는 증가 연산자\(++\)다.** 이 연산자는 코드상으로는 하나지만 실제로는 `nextSerialNumber` 필드에 `두 번` 접근한다. 만약 두 번째 `스레드`가 이 두 접근 사이를 비집고 들어와 값을 읽어 가면 첫 번째 `스레드`와 똑같은 값을 돌려받게 된다. 프로그램이 잘못된 결과를 계산해내는 이런 오류를 안전 실패하고 한다. 이는 `synchronized` 한정자를 붙이면 해결된다. 이 메서드를 더 견고하게 하려면 `int` 대신에 `long`을 사용하거나 `nextSerialNumber`가 최댓값에 도달하면 예외를 던지게 하자.

또는 `AtomicLong`을 사용하면 락 없이도 스레드 안전한 프로그래밍을 지원한다. `volatile`은 동기화의 두 효과 중 통신 쪽만 지원하지만 이 패키지는 `원자성`까지 지원한다. 그리고 성능도 동기화 버전보다 우수하다.

```java
private static final AtomicLong nextSerialNumber = 0;

public static int generateSerialNumber() {
	return nextSerialNumber++;
}
```

#### 다시 말해 `가변 데이터`는 단일 스레드에서만 쓰도록 하자.

그리고 이 사실을 문서에 남겨 유지보수 과정에서도 정책이 계속 지켜지도록 하는 게 중요하다. 또한, 사용하려는 `프레임워크`와 `라이브러리`를 깊이 이해하는 것도 중요하다.

한 `스레드`가 데이터를 다 수정한 후 다른 스레드에 공유할 때는 해당 객체에서 공유하는 부분만 `동기화`해도 된다. 그러면 그 객체를 다시 수정할 일이 생기기 전까지 다른 스레드들은 동기화 없이 자유롭게 값을 읽어갈 수 있다.

클래스 초기화 과정에서 객체를 `정적 필드`, `volatile` 필드, `final` 필드, 혹은 보통의 락을 통해 접근하는 필드에 저장해도 된다.

### 정리

여러 스레드가 `가변 데이터`를 공유한다면 그 데이터를 읽고 쓰는 동작은 반드시 `동기화`해야 한다. **동기화하지 않으면 한 스레드가 수행한 변경을 다른 스레드가 보지 못할 수도 있다.** 공유되는 `가변 데이터`를 동기화하는 데 실패하면 응답 불가 상태에 빠지거나 안전 실패로 이어질 수 있다. 이는 `디버깅 난이도`가 가장 높은 문제에 속한다. `간헐적`이거나 특정 타이밍에만 발생할 수도 있고, `VM`에 따라 현상이 달라지기도 한다. `배타적 실행`은 필요 없고 스레드 끼리의 통신만 필요하다면 `volatile` 한정자만으로 동기화할 수 있다. 다만 올바로 사용하기가 까다롭다.

### 참조

[Long and Double Values Are Not Atomic in Java - DZone Java](https://dzone.com/articles/longdouble-are-not-atomic-in-java)

