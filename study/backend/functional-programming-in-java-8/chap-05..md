---
description: Functional Programming in Java 8의 Chapter 5을 요약한 내용 입니다.
---

# CHAP 05. 리소스를 사용한 작업

지금까지 JVM에서 모든 가비지 컬렉션을 자동으로 한다고 믿고 있었다. 그러나 그것은 내부 리소스에 한정된 것이다. 외부 리소스를 사용한다면 리소스에 대한 가비지 컬렉션은 프로그래머의 책임이다. 예를 들어 데이터베이스에 연결하거나, 파일이나 소켓을 오픈하거나 네이티브 리소스를 사용하는 경우이다.

자바에서는 리소스를 클린업하기 위해 몇 가지 옵션을 제공하지만, 람다 표현식을 사용하는 것이 가장 효과적인 방법이다. 람다 표현식을 사용하여 execute around method\(EAM\) 패턴을 구현해보자. 이 패턴을 사용하면 잠금을 관리하거나 예외처리 테스트를 작성하는 등 더 많은 것들을 할 수 있다.

## 리소스 클린업

예전에 애플리케이션이 급격하게 사용량이 증가하는 경우 오동작을 했다. 코드를 살펴보니 데이터베이스 연결을 해제할 때 finalize\(\) 메서드에 의존하여 해제하기 때문이라는 사실이 밝혀졌다. JVM은 가용 메모리가 충분하다고 판단하고 있었기 때문에 GC가 실행되지 않았다. 그러나, 파이널라이저가 거의 호출되지 않기 때문에 외부 리소스는 계속 사용하지 못한 상태가 됐고 결국 애플리케이션의 오동작으로 연결됐다.

이러한 경우에는 좀 더 나은 방법을 사용해서 리소스를 관리해야 하며 람다 표현식을 사용하면 도움이 된다.

### 문제 들여다보기

FileWriter를 사용하여 메시지를 출력하는 간단한 예제 클래스를 만들어보자

```java
public class FileWriterExample {
  private final FileWriter writer;
  
  public FileWriterExample(final String fileName) throws IOException {
    writer = new FileWriter(fileName);
  }
  public void writeStuff(final String message) throws IOException {
    writer.write(message);
  }
  public void finalize() throws IOException {
    writer.close();
  }
  //...

  public void close() throws IOException {
    writer.close();
  }
}
```

* FileWriterExample 클래스의 생성자에서 FileWriter의 인스턴스를 초기화한다.
* writeStuff\(\) 전달받은 메시지를 우리가 생성한 FileWriter 인스턴스를 사용하여 파일에 쓰게 된다.
* finalize\(\) 메서드에서 리소스를 클린업한다.
* 파일의 내용을 flush하고 종료하기 위해 close\(\) 메서드를 호출한다.

#### 이제 main\(\) 메서드를 살펴보자

```java
public static void main(final String[] args) throws IOException {
    final FileWriterExample writerExample = 
      new FileWriterExample("peekaboo.txt");

    writerExample.writeStuff("peek-a-boo");            
    
  }
```

* FileWriterExample 클래스의 인스턴스를 생성했고 writeStuff\(\) 메서드를 호출했다.
* 그러나 peekaboo.txt 파일이 생성되긴 했어도 내용은 여전히 비어있다.
* 파이널라이저가 실행되지 않았다.\(JVM은 충분한 메모리가 있기 때문에 파이널라이저가 필요 없다고 생각한 것이다.\)
* 긴 시간 동안 여러 개의 FileWriterExample의 인스턴스를 생성했다면 작업한 파일을 모두를 종요해야 한다. 그러나, 이 파일들은 JVM이 이미 많은 메모리를 갖고 있고 GC를 실행할 이유가 없기 때문에 원하는 시간에 종료하지 않게 된다.

위와 같은 문제점을 해결하기 위해 리소스를 종료하면서 close에 대한 호출을 보장하기 위해 코드를 개선하였다.

```java
public static void main(final String[] args) throws IOException {
  final FileWriterExample writerExample = 
    new FileWriterExample("peekaboo.txt");
  try {
    writerExample.writeStuff("peek-a-boo");            
  } finally {
    writerExample.close();      
  }
}
```

### ARM 사용하기

ARM은 이전 예제의 장황한 코드를 감소시켜준다.

```java
public static void main(final String[] args) throws IOException {
  try(final FileWriterARM writerARM = new FileWriterARM("peekaboo.txt")) {
    writerARM.writeStuff("peek-a-boo");
  
    System.out.println("done with the resource...");
  }
}
```

try-with-resources 형태로 생성하고 그 블록 안에서 writeStuff\(\)를 호출한다. 이 작업을 하기 위해서 컴파일러는 AutoCloseable 인터페이스의 구현에 대한 관리 리소스 클래스가 필요하고, 그 인터페이스는 close\(\)라는 하나의 메서드 만을 갖는다.

#### AutoCloseable에 대한 규칙은 자바8에서 몇 가지 변화가 있다.

스트림은 AutoCloseable을 구현하고 그 결과로 모든 입력/출력 \(I/O\) - backed 스트림은 trye-wirth-resoucres과 함께 사용된다. try 블록에 들어갈 때 생성한 인스턴스는 블록을 빠져 나오는 시점 이후에는 엑세스가 불가능하다. 인스턴스가 사용하는 메모리는 JVM의 GC 정책에 따라 결국 카비지 컬렉션이 이루어진다.

## 리소스를 클린업하기 위해 람다 표현식 사용하기

ARM은 올바른 방법이지만 아주 효과적이라고 말하기는 어렵다. 우리가 만든 클래스를 사용하는 어떤 사람도 그것이 AutoCloseable을 구현한다는 것을 알아야 하고 try-with-resource 구조를 사용한다는 점을 기억해야 한다.

### 리소스 클린업을 위한 클래스 준비

FileWriterEAM 클래스를 설계해보자. 생성자와 close\(\) 메서드를 프라이빗으로 만든다. 이렇게 하게 되면 프로그래머가 클래스를 사용할 때 주의하게 된다. 인스턴스를 직접 만들 수 없고 close를 직접 호출할 수도 없다.

```java
public class FileWriterEAM  {
  private final FileWriter writer;
  
  private FileWriterEAM(final String fileName) throws IOException {
    writer = new FileWriter(fileName);
  }
  private void close() throws IOException {
    System.out.println("close called automatically...");
    writer.close();
  }
  public void writeStuff(final String message) throws IOException {
    writer.write(message);
  }
  //...
}
```

### 고차 함수 사용하기

프로그래머가 직접 FileWriterEAM의 인스턴스를 생성할 수 없기 때문에 이들을 사용하는 팩토리 메서드가 필요하다. 인스턴스를 생성하고 파라미터로 해당 인스턴스를 전달하는 일반적인 팩토리 메서드와 달리, 우리가 만드는 메서드는 인스턴스를 사용자에게 전달하고 작업이 끝날 때까지 기다린다. 람다 표현식을 이용하면 이러한 작업이 가능하다.

```java
public static void use(final String fileName, 
  final UseInstance<FileWriterEAM, IOException> block) throws IOException {
  
  final FileWriterEAM writerEAM = new FileWriterEAM(fileName);    
  try {
    block.accept(writerEAM);
  } finally {
    writerEAM.close();
  }
}
```

1. use\(\) 메서드에서 두 개의 파라미터 fileName와 UseInstance 인터페이스에 대한 레퍼런스를 인수로 받는다.
2. FileWriterEAM을 객체화하고 try와 finally 블록을 생성한다.
3. 인터페이스 구현체에게 FileWriterEAM 인스턴스를 파라미터로 넘긴다.
4. 호출이 리턴되면, finally 블록에 있는 인스턴스의 close\(\) 메서드를 호출한다.

#### execute around method 패턴

user\(\) 메서드는 execute around method 패턴의 구조를 표현한다. 중요한 액션은 accept\(\) 메서드에 있는 인스턴스를 사용한다는 점이다. 그러나 생성과 클린업 오퍼레이션이 이 accep\(\) 메서드의 호출을 둘어싸고 있다.

#### UseInstance 인터페이스

```java
@FunctionalInterface
public interface UseInstance<T, X extends Throwable> {
  void accept(T instance) throws X;
}
```

UseInstance는 함수형 인터페이스이며 자바 컴파일러가 자동으로 람다 표현식이나 메서드 레퍼런스를 합성할 수 있도록 해주는 기능을 제공한다.

우리 자신의 UseInstance를 정의하는 대신 java.function.Consumer 인터페이스를 사용해왔다. 그러나 메서드가 예외를 발생할 수 있기 때문에 인터페이스에 이에 대한 것을 알려줄 필요가 있다. 람다 표현식은 합성하는 추상 메서드의 시그니쳐의 한 부분에 정의되어 있는 체크된 예외만을 발생할 수 있다. UseInstance 인터페이스를 생성하면 accep\(\) 메서드는 제네릭 타입의 인스턴스를 받을 수 있다. 이 예제에서 우리는 이것을 완전한 FileWriterEAM의 인스턴스에 묶었다. 또한 이것을 설계해서 이 메서드의 구현은 제네릭 예외 X를 발생할 수 있다.

### 인스턴스 클린업을 위한 설계의 사용

클래스 설계자들처럼 AutoCloseable 인터페이스를 간단하게 구현하는 대신 더 노력해야 한다. 다음을 보자

```java
FileWriterEAM.use("eam.txt", writerEAM -> writerEAM.writeStuff("sweet"));
```

클래스의 사용자들은 인스턴스를 직접 생성하지 못한다. 이런 특징은 인스턴스가 만료되는 시점 이후로 리소스의 클린업을 지연시키는 코드의 생성을 막는다.

```java
FileWriterEAM.use("eam2.txt", writerEAM -> {
  writerEAM.writeStuff("how");
  writerEAM.writeStuff("sweet");      
});
```

{ } 블록 안에 람다 표현식을 여러 라인에 걸쳐 작성했다. 람다 표현식이 어떤 결과를 리턴할 것을 기대한다면, 적절한 위치에 return을 위치시켜야 한다.

긴 메서드가 좋지 않듯이 긴 람다 표현식도 좋지 않다. 코드의 간결성, 가독성, 그리고 유지보수의 간편함이라는 장점을 잃게 된다. 이 예제에서 UseInstance의 accept\(\)는 void 메서드다. use\(\) 메서드를 호출한 쪽에 어떤 결과를 리턴하는 것이 필요하다면 제네릭 파라미터 R과 같은 적절한 리턴 타입을 갖도록 메서드의 시그니처를 변경해야 한다. 이렇게 변경했다면 UseInstance는 Consumer&lt;T&gt; 인터페이스가 아닌 Function&lt;U,R&gt; 인스턴스처럼 된다. 또한 use\(\) 메서드를 변경해서 수정된 apply\(\) 메서드로부터 받은 리턴된 결과를 다른 메서드나 코드 블록으로 전달해야 한다.

## 잠금\(lock\) 관리

잠금은 병렬로 실행되는 자바 애플리케이션에서 중요한 역할을 한다. synchronized는 상호 배제를 제공하기 위해 사용되어온 오래된 키워드다. synchronized { ... } 와 같은 동기화하는 코드 블록은 execute around method 패턴을 실현한 것이다. 람다 표현식은 이 패턴의 강력한 기능을 충분히 사용할 수 있도록 해준다.

#### synchronized는 약간의 단점도 갖고 있다.

* synchronized를 사용하더라도 메서드가 호출되는 시간을 제어하기가 어렵다. 이것은 deadlock과 livelock이 발생할 가능성을 증가시킨다.
* synchronized를 실제 적용하는 것이 어렵다.

#### 이 문제들을 해결하기 위해 ReentrantLock과 같은 몇 개의 구현이 자바5에서 소개되었다.

Lock 인터페이스는 lock, unlock, check 등에 대한 더 향상된 인터페이스를 제공하며 잠금이 가능한 특정 시간 안에 잠금을 얻지 못하면 쉽게 타임 아웃되도록 한다.

#### Lock 인터페이스에는 한가지 문제가 있다.

쌍방향 synchronized가 아닌 개발자가 직접 록킹\(locking\)과 언록킹\(unlocking\)에 대한 설정을 해줘야 한다. 이것은 언록\(unlock\)을 기억해야 할 뿐만 아니라 finally 블록에서 그 작업을 해야 한다는 것을 의미한다.

```java
public class Locking {
  Lock lock = new ReentrantLock(); //or mock
  
  protected void setLock(final Lock mock) {
    lock = mock;
  } 

  public void doOp1() {
    lock.lock();
    try {
      //...critical code...
    } finally {
      lock.unlock();
    }
  }
}
```

doOp1\(\) 메서드에 잠금된 태스크들이 있고 원하는 태스크들이 아직 남아 있다. 이는 장황하고 쉽게 오류를 발생시킬 수 있으며 유지 보수도 어렵다.

### 람다 표현식을 사용하여 잠금을 관리하는 클래스를 만들어보자

```java
public class Locker {
  public static void runLocked(Lock lock, Runnable block) {
    lock.lock();
	
    try {
      block.run();
    } finally {
      lock.unlock();
    }    
  }
}

// 사용자 관점에서 runLocked 메소드 사용 
public void doOp2() {
  runLocked(lock, () -> {/*...critical code ... */});
}

public void doOp3() {
  runLocked(lock, () -> {/*...critical code ... */});
}

public void doOp4() {
  runLocked(lock, () -> {/*...critical code ... */});
}
```

메서드는 상당히 간결하며 우리가 만든 Locker 헬퍼 클래스의 정적 메서드인 runLocked\(\)를 사용한다.

execute around method를 사용하여 코드를 얼마나 간결하고 오류가 적도록 만들수 있는지 알아봤다. 그러나 우아함과 간결함은 불필요한 형식을 제거하는데 도움이 되지만, 본질적인 문제를 숨기지는 못한다. 람다 표현식으로 설계할 때 코드의 의도와 순서가 확실하게 나타날 수 있어야 한다.

## 간결한 예외 테스트의 생성

다음은 try와 catch를 사용하여 maxProfit\(\) 메서드의 예외를 체크한다.

```java
@Test 
public void VerboseExceptionTest() {
  rodCutter.setPrices(prices);
  try {
    rodCutter.maxProfit(0);
    fail("Expected exception for zero length");
  } catch(RodCutterException ex) {
    assertTrue("expected", true);
  }
}
```

위 코드는 꽤 장황하며 이애하는 데 노력이 필요하다.

### 예외 테스트를 위한 람다 표현식의 사용

람다 표현식을 사용해서 예외를 테스트해보자.

```java
public class TestHelper {
  public static <X extends Throwable> Throwable assertThrows(
    final Class<X> exceptionClass, final Runnable block) {
      
    try {
      block.run();
    } catch(Throwable ex) {
      if(exceptionClass.isInstance(ex))
        return ex;
    }
    fail("Failed to throw expected exception ");
    return null;
  }
}
```

assertThrows 정적 메서드는 예외 코드가 발생하는지 조사하는 역할을 한다. 예외가 발생하지 않거나 첫 번째 파라미터로 주어진 타입과 다른 예외가 발생하면, 호출은 Junit의 fail\(\) 메서드를 사용하여 실패했음을 알린다.

```java
@Test
public void ConciseExceptionTest() {
  rodCutter.setPrices(prices);
  assertThrows(RodCutterException.class, () -> rodCutter.maxProfit(0));
}
```

람다 표현식을 사용하면 발생할 가능성이 있는 예외 상황에 대해 개발자들이 특정 메서드를 정해 놓고 코드를 작성하는 데 많은 도움이 된다는 것을 배웠다. 또한 람다 표현식을 사용하면 간결하고 이해하기 쉽고, 오류도 적은 테스트를 만드는 데 도움을 준다.

## 정리

execute around method 패턴은 실행 플로우에 대한 세밀한 제어와 외부 리소스를 해제하는 데 도움을 준다. 람다 표현식은 이러한 패턴을 구현하는 데 적합하다. 추가적으로 객체의 라이프타임을 제어하기 위해 이 패턴을 사용하여 잠금을 더 잘 관리하고 간결한 예외 테스트를 더 잘 작성할 수 있다. 이것은 코드를 더욱 확실하게 실행이 되도록 하며 헤비한 리소스에 대한 시간 내의 클린업과 오류를 줄여주는 데도 도움을 준다.

