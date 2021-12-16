---
description: 객체지향과 디자인 패턴(최범균 저) 옵저버 패턴 정리한 내용입니다.
---

# 옵저버 패턴

## 상황

웹 사이트의 상태를 확인해서 응답 속도가 느리거나 연결이 안 되면 모니터링 담당자에게 이메일로 통지해 주는 시스템을 만들려고 한다.

## 문제

StatusChecker는 시스템의 상태가 불안정해지면 이 사실을 EmailSender, SmsSender, Messenger 객체에게 변경 사실을 알려준다는 점이다. 이렇게 한 객체의 상태 변화를 정해지지 않은 여러 다른 객체에 통지하고 싶다.

## 해결방법

옵저버 패턴에는 크게 주제(subject) 객체와 옵저버(observer) 객체가 등장하는데, 주제 객체는 다음의 두 가지 책임을 갖는다.

* 옵저버 목록을 관리하고, 옵저버를 등록하고 제거할 수 있는 메서드를 제공한다. add() 메서드와 remove() 메서드가 각각 옵저를 목록에 등록하고 삭제하는 기능을 제공한다.
* 상태의 변경이 발생하면 등록된 옵저버에 변경 내역을 알린다. notifyStatus() 메서드가 등록된 옵저버 객체의 onAbnormalStatus() 메서드를 호출한다.

```java
public class StatusChecker extends StatusSubject {
    
    public void check() {
        Status status = loadStatus();
        if(status.isNotNormal()){
            super.notifyStatus(status);
        }
    }
    
    private Status loadStatus(){
        // ...
    }
} 

public abstract class StatusSubject {
    private List<StatusObserver> observers = new Arraylist<StatusObserver>();

    public void add(StatusObserver observer){
        observers.add(observer);
    }

    public void remove(StatusObserver observer){
        observers.remove(observer);
    }

    public void notifyStatus(Status status){
        for(StatusObserver observer : observers){
            observer.onAbnormalStatus(status);
        }
    }
}

public interface StatusObserver {
    void onAbnormalStatus(Status status);
}

public class StatusEmailSender implements StatusObserver {

    @Override
    public void onAbnormalStatus(Status status) {
        sendEmail(status);
    }
    
    private void sendEmail(Status status){
        // 이메일 전송 코드
    }
}
```

## 옵저버 패턴 구현의 고려 사항

### 주제 객체의 통지 기능 실행 주체

앞서 StatusChecker 예에서는 등록된 옵저버에 통지하는 주체가 StatusChecker 클래스였다. 그런데 필요에 따라 StatusChecker를 사용하는 코드에서 통지 기능을 수행할 수도 있을 것이다. 예를 들어, 여러 StatusChecker 객체로부터 상태 정보를 읽어 와 이들이 모두 비정상인 경우에만 통지를 하고 싶다고 해보자. 이 경우 아래 코드에서 보는 것처럼 StatusChecker 객체를 사용하는 코드에서 통지 기능을 실행할 수 있을 것이다.

```java
StatusChecker checker1 = ...;
StatusChecker checker2 = ...;

checker1.check();
checker2.check();

if (checker1.isLastStatusFault() && checker2.isLastStatusFault()) {
		checker1.notifyStatus();
		checker2.notifyStatus();
}
```

Button처럼 주체 객체의 상태가 바뀔 때마다 옵저버에게 통지를 해 주어야 한다면, 주제 객체에서 직접 통지 기능을 실행하는 것이 구현에 유리하다. 왜냐면, 주제 객체를 사용하는 코드에서 통지 기능을 실행한다면 상태를 변경하는 모든 코드에서 통지 기능을 함께 호출해 주어야 하는데, 이런 방식은 통지 기능을 호출하지 않는 등 개발자의 실수를 유발할 수 있기 때문이다.

### 옵저버 인터페이스의 분리

주체 객체 입장에서도 각 상태마다 변경의 이유가 다르기 때문에, 이들을 한 개의 옵저버 인터페이스로 관리하는 것은 향후에 변경을 어렵게 만드는 요인이 될 수 있다. 옵저버 타입이 한 개일 경우, 클릭, 스크롤, 터치 이벤트를 통지하는 코드가 서로 강하게 연결될 가능성이 높아지는데, 이 경우 옵저버 목록을 관리하고 옵저버에 이벤트를 통지하는 코드의 복잡도가 증가하게 되며, 이는 곧 기존 이벤트를 제거하거나 새로운 종류의 이벤트 추가를 어렵게 만드는 원인이 될 수 있다.

### 통지 시점에서의 주제 객체 상태

통지 시점에서 주제 객체의 상태에 결함이 없어야 한다.

```java
public class AnySubject extends SomeSubject {
    @Override
    public void changeState(int newValue) {
        super.changeState(newValue); // 상위 changeState()에서 옵저버에 통지
        // 아래 코드가 실행되기 전에 옵저가 상태를 조회하게 됨
        if (isStateSome()) {
            state += newValue;
        }
    }
}
```

AnySubject 클래스는 super.changeState() 코드를 실행한 이후에 상태를 변경하게 되므로, 결과적으로 옵저어 객체는 완전하지 못한 상태 값을 조회하게 된다.

옵저버 객체가 올바르지 않은 상태 값을 사용하게 되는 문제가 발생하지 않도록 만드는 방법중의 하나는 상태 변경과 통지 기능에 템플릿 메서드 패턴을 적용하는 것이다.

```java
// 상위 클래스 
public class SomeSubject {
    // 템플릿 메서드로 구현
    public void changeState(int newState){
        internalChangeState(newState);
        notifyObserver();
    }
    protected void internalChangeState(int newState){
        ...
    }
}

// 하위 클래스
public class AnySubject extends SomeSubject {
    // internalChangeState() 메서드 실행 이후에, 옵저버에 통지
    @Override
    public void internalChangeState(int newValue) {
        super.internalChangeState(newValue);
        if (isStateSome()) {
            state += newValue;
        }
    }
}
```

AnySubject 클래스의 internalChangeState() 메서드에서 상태 변화를 마무리한 다음에 옵저버 객체가 상태 값을 접근하게 되므로, 옵저버는 완전한 상태 값을 사용할 수 있게 된다.

### 옵저버 객체의 실행 제약 조건

만약 10개의 옵저버 객체가 있고, 각 옵저버 객체의 알림 메서드는 수행 시간이 십 분 이상 걸린다면 어떻게 될까? 이 경우 모든 옵저버 객체의 알림 메서드 실행이 종료될 때까지 100분 이상 기다려야 한다. 또는 한 개의 옵저버로 인해 다른 옵저버의 실행이 지연되는 상황이 발생할 수도 있다. 따라서 옵저버 인터페이스를 정의할 때에는 옵저버 메서드의 실행 제한에 대한 명확한 기준이 필요하다. 10초 이내에 응답만 처리한다던가. 옵저버의 메서드는 5초를 넘기지 말아야 한다는 제약조건이 동반해야 안정된 옵저버 패턴을 운영할 수 있다.
