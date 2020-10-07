---
description: 객체지향과 디자인 패턴(최범균 저) DI와 서비스 로케이터 파트 정리한 내용입니다.
---

# DI와 서비스 로케이터

콘크리트 클래스를 직접 사용해서 객체를 생성하게 되면 의존 역전 원칙을 위반하게 되며, 결과적으로 확장 폐쇄 원칙을 위반하게 된다. 이런 단점을 보완하기 위한 방법이 DI이다. DI는 필요한 객체를 직접 생성하거나 찾지 않고 외부에서 넣어 주는 방식이다.

## 생성자 방식과 설정 메서드 방식

### 생성자 방식

```java
public class JobCLI {
	private JobQueue jobQueue;
	public  JobCLI(JobQueue jobQueue) {
		this.jobQueue = jobQueue;
	}
	public void interact() {
		...
	}
}
```

### 설정 메서드 방식

```java
public class Worker {
	private JobQueue jobQueue;
	private Transcoder transcoder;

	public void setJobQueue(JobQueue jobQueue) {
		this.jobQueue = jobQueue;
	}

	public void setTranscoder(Transcoder transcoder) { 
		this.transcoder = transdocer;
	}
	...
}
```

### 각 방식의 장단점

DI 프레임워크가 의존 객체 주입을 어떤 방식까지 지원하느냐에 따라 달라지겠지만, 필자는 생성자 방식과 설정 메서드 방식 중에서 생성자 방식을 더 선호한다. 그 이유는 생성자 방식은 객체를 생성하는 시점에 필요한 모든 의존 객체를 준비할 수 있기 때문이다. 생성자 방식은 생성자를 통해서 필요한 의존 객체를 전달받기 때문에, 객체를 생성하는 시점에서 의존객체가 정상인지 확인할 수 있다. 생성 시점에 의존 객체를 모두 받기 때문에, 한 번 객체가 생성되면 객체가 정상적으로 동작함을 보장할 수 있게 된다.

생성자 방식과 달리 설정 메서드 방식은 객체를 생성한 이후에 의존 객체를 설정할 수 있기 때문에, 어떤 이유로 인해 의존할 객체가 나중에 생성된다면 설정 메서드 방식을 사용해야 한다.

### 그외 방식

외부 설정 파일을 사용할 경우의 장점은 의존할 객체가 변경될 때 자바코드를 수정하고 컴파일할 필요 없이 XML 파일만 수정해 주면 된다는 점이다.

XML 설정 파일을 사용하는 방식은 개발자가 입력한 오타에 다소 취약하다.

XML을 사용할 때의 문제점을 해소하기 위한 방안으로 스프링 3 버전부터는 자바 코드 기반의 설정 방식이 추가되었다.

자바 기반의 설정의 장점은 오타로 인한 문제가 거의 발생하지 않는다는 점이다. 잘못이 있을 경우 컴파일 과정에서 다 드러나기 때문에 이클립스와 같은 IDE를 사용하면 설정 코드를 작성하는 시점에서 바로 확인할 수 있다. 반면에 의존 객체를 변경해야 할 경우, 앞서 XML 파일을 이용할 때는 파일만 변경해 주면 됐지만 자바 기반 설정에서는 자바 코드를 수정해서 다시 컴파일하고 배포해 주어야 하는 단점이 있다.

## 서비스 로케이터를 이요한 의존 객체 사용

서비스 로케이터는 어플리케이션에서 필요로 하는 객체를 제공하는 책임을 갖는다.

메인 영역에서는 서비스 로케이터가 제공할 객체를 생성하고, 이 객체를 이용해서 서비스 로케이터를 초기화 해준다.

![](../../../.gitbook/assets/111%20%2818%29.png)

```java
public class ServiceLocator {
	private JobQueue jobQueue;
	private Transcoder transcoder;

	public void setJobQueue(JobQueue jobQueue) {
		this.jobQueue = jobQueue;
	}

	public void setTranscoder(Transcoder transcoder) { 
		this.transcoder = transdocer;
	}
	
	private static ServiceLocator instance;
	public static void load(ServiceLocator locator) {
		ServiceLocator.instance = locator;
	}
	public static ServiceLocator getInstance() {
		return instance;
	}
}
```

```java
public class Worker {
	public void run() {
		ServiceLocator lodLocator = ServiceLocator.getInstance();
		ServiceLocator newLocator = new ServiceLocator( new DbJobQueue(), oldLocator.getTranscoder());
		ServiceLocator.load(newLocator);

		ServiceLocator locator = ServiceLocator.getInstance();
		JobQueue jobQueue = locator.getJobQueue();
		Transcoder transcoder = locator.getTranscoder();
		...
	}
}
```

서비스 로케이터의 단점은 인터페이스 분리 원칙을 위반한다는 점이다. 예를 들어, JobCLI 클래스가 사용하는 타입은 JobQueue 뿐인데, ServiceLocator를 사용함으로써 Transcoder 타입에 대한 의존이 함께 발생하게 된다.

이 문제를 해결하려면 의존 객체마다 서비스 로케이터를 작성해 주어야 한다.

그렇다고 매번 로케이터를 만들어주는건 중복된 코드를 작성하므로 되도록이면 피해야 한다.

그럴때 사용할 수 있는게 제네릭이다.

```java
public class ServiceLocator {
	private static Map<Class<?>, Object> objectMap = new HashMap<Class<?>, Object>();
	public static <T> T get(Class<T> class) {
		return (T) objectMap.get(class);
	}
	public static void regist(Class<?> class, Object obj) {
		objectMap.put(class, obj);
	}
}
```

```java
public static void main(String[] args) {
	ServiceLocator.regist(JobQueue.class, new FileJobQueue());
	ServiceLocator.regist(Transcoder.class, new FfmpegTranscoder());

	JobCLI jobCli = new JobCLI();
	jobCli.interact();
	...
}
```

```java
public class JobCLI {
	public void interact() {
		...
		JobQueue jobQueue = ServiceLocator.get(JobQueue.class);
	}
}
```

이 코드에서 JobCLI는 ServiceLocator 클래스를 사용하는 과정에서 JobQueue 타입만 의존하게 된다.

ServiceLocator 자체에는 의존 대상이 되는 객체들의 타입이 명시되지 않기 때문에 Transcoder 타입 이름이 StrancodingService로 변경된다 하더라도 ServiceLocator를 이용해서 JobQueue 타입의 객체를 구하는 코드는 영향을 받지 않게 된다.

### 서비스 로케이터의 단점

서비스 로케이터의 가장 큰 단점은 동일 타입의 객체가 다수 필요할 경우, 각 객체 별로 제공 메서드를 만들어 주어야 한다는 점이다.

```java
public class ServiceLocator {
	public JobQueue getJobQueue1() { ... }
	public JobQueue getJobQueue2() { ... }
	...
}
```

서비스 로케이터를 사용하는 코드 입장에서, 자신이 필요한 타입뿐만 아니라 서비스 로케이터가 제공하는 다른 타입에 대한 의존이 함께 발생하기 때문에 다른 의존 객체에 의해서 발생하는 서비스 로케이터의 수정 때문에 영향을 받을 수 있게 된다.

