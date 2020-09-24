---
description: Stack Overflow가 발생하는 상황을 살펴보고 해결방법을 알아보자
---

# 스택 오버 플로우\(SOF\)

![https://www.redbubble.com/i/poster/Java-Stack-Overflow-Error-by-StudioNara/35415168.LVTDI](../../.gitbook/assets/poster-840x830-f8f8f8-pad-1000x1000-f8f8f8.u3.jpg)

## Stack Overflow란 무엇인가?

스택 오버 플로우를 들으면 우리가 먼저 드는 생각은 개발 커뮤니티인 스택오버플로우 이다. 하지만 여기서 이야기하는 스택 오버 플로우는 지정한 스택 메모리 사이즈보다 더 많은 스택 메모리를 사용하게 되어 에러가 발생하는 상황을 일컫는다.

### 버퍼 오버 플로우와 스택 오버 플로우는 비슷한 개념인가?

아니다. 버퍼 오버 플로우는 보통 데이터를 저장하는 과정에서 그 데이터를 저장할 메모리 위치가 유효한지를 검사하지 않아 발생한다. 단어를 더 풀이해보자면 버퍼는 데이터가 저장될 수 있는 가용 메모리 공간이고, 오버플로우는 데이터가 지정된 크기의 공간보다 커서 해당 메모리 공간을 벗어 나는 경우를 말한다.

### 그렇다면 스택 메모리에는 어떤 데이터들이 저장될까?

스택 메모리는 보통 원시 타입이나 힙 메모리에 저장되는 데이터의 메모리 주소를 저장한다. 메소드 영역 내에서 생성된 스택 메모리 데이터는 메소드 종료시 메모리가 해제된다. 스택 영역은 LIFO의 구조를 갖고 변수에 새로운 데이터가 할당되면 이전 데이터는 지워진다. 쓰레드 생성시 고유의 스택 메모리가 생성된다. 그러므로 쓰레드 간의 스택 메모리 데이터를 공유할 수는 없고 공유하기 위해서는 static 영역이나 heap 영역을 사용해야 한다.

## Stack Overflow가 발생하는 상황들

### 재귀함수

스택오버플로우의 대표적인 사례로 재귀함수를 예로 들수 있다. 재귀함수는 코드의 가독성을 높여주는 프로그래머들이 선호하는\(?\) 아니다, 개인적으로 선호하는 코드이다. 하지만 이는 자칫 프로그램 에러를 발생하는 경우가 발생한다. 어떤 경우에 발생하는지 코드로 알아보자.

예제는 간단하다. 전달 받은 임의 수 범위까지 1부터 곱해 나가면 된다.

```java
public long calculateFactorial(long number) {
    return number == 1 ? 1 : number * calculateFactorial(number - 1);
}
```

#### 그러면 이제 실행을 해보자.

![](../../.gitbook/assets/111%20%286%29.png)

함수를 호출할 때 함수의 파라미터, 리턴 값, 복귀 주소 등을 스택에 저장한다. 재귀 함수를 사용하면 호출한 함수가 종료되지 않은 채 새로운 함수를 호출하므로 스택에 메모리가 계속적으로 저장되게 되므로 스택 메모리에 더 이상 가용 메모리가 없을 경우에 스택 오버 플로우가 발생하게 된다.

#### 어떻게 해결할 수 있을까?

함수 호출 시 이전의 호출한 스택 메모리는 종료하면 된다. 이를 꼬리 재귀 라고도 한다. 방법은 간단하다. 다음 함수 호출시 현재 함수의 연산된 결과를 전달하면 된다. 그러면 함수 종료 시 이전 함수의 데이터와 연산할 필요가 없으니 스택 메모리의 이전 함수의 데이터를 따로 저장할 필요가 없다.

```java
public long calculateTailFactorial(long number, long sum) {
    return number == 1 ? sum : calculateTailFactorial(number - 1, number * sum);
}
```

이 처럼 현재 연산을 다음 함수에 결과값으로 도출하기위해 파라미터를 추가하였다. 그리고 수행을 해보면 정상적으로 결과값을 도출하는 것을 확인할 수 있다.

### 상호 참조

상호 참조란 두 클래스간에 생성을 위임하면서 체이닝을 이루게 되면 발생하게 된다. 코드로 확인해보자.

```java
public class ClassOne {
    private int oneValue;
    private ClassTwo clsTwoInstance = null;

    public ClassOne() {
        oneValue = 0;
        clsTwoInstance = new ClassTwo();
    }
}

public class ClassTwo {
    private int twoValue;
    private ClassOne clsOneInstance = null;

    public ClassTwo() {
        twoValue = 10;
        clsOneInstance = new ClassOne();
    }
}
```

ClassOne의 생성자에서 ClassTwo를 생성하고 ClassTwo 생성자에서 ClassOne을 생성하게 되어있다. 이런 관계에서 ClassOne을 생성하게 되면 ClassTwo를 생성하게 되고 ClassTwo는 ClassOne을 생성하게 된다. 그러면 실행을 해보자.

![](../../.gitbook/assets/222%20%286%29.png)

이와 같이 StackOverflow가 발생하는 것을 볼 수 있다.

#### 해결방법은 간단하다.

상호간의 생성 관계를 만들지 않으면 된다. 또는 클래스내에서 인스턴스를 직접 생성하기보다는 주입을 통해서 인스턴스를 생성하라.

```java
public void getClassTwo(ClassTwo classTwo){
    this.clsTwoInstance = classTwo;
}
```

### 본인 참조

본인 참조는 상호 참조와 원인은 비슷하다. 단순히 본인 클래스 내에서 본인을 생성하면서 무한으로 생성되는 이슈이다. 코드로 살펴보자.

```java
public class AccountHolder {

    private String firstName;
    private String lastName;

    AccountHolder jointAccountHolder = new AccountHolder();
}
```

이렇게 클래스 내에서 본인 클래스를 다시 생성하게 되면 무한으로 생성하는 로직이 수행되면서 스택 오버 플로우가 발생하게 된다.

![](../../.gitbook/assets/333%20%286%29.png)

#### 해결 방법은 동일하다.

클래스내에서 본인 클래스를 직접 생성하지 않으면 된다. 본인 참조 또한 주입을 받으면 문제를 해결할 수 있다.

## 참고

* [https://ko.wikipedia.org/wiki/버퍼\_오버플로](https://ko.wikipedia.org/wiki/%EB%B2%84%ED%8D%BC_%EC%98%A4%EB%B2%84%ED%94%8C%EB%A1%9C)
* [https://www.baeldung.com/java-stack-overflow-error](https://www.baeldung.com/java-stack-overflow-error)
* [https://big-blog.tistory.com/724](https://big-blog.tistory.com/724)
* [https://gammabeta.tistory.com/736](https://gammabeta.tistory.com/736)

