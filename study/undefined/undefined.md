---
description: 객체지향과 디자인 패턴(최범균 저) 객체지향 파트 정리한 내용입니다.
---

# 객체 지향

## 1. 절차 지향과 객체 지향

### 절차 지향

프로시져로 프로그램을 구성하는 기법을 절차 지향 프로그래밍이라고 부른다.

전자 장비의 꺼짐/켜짐 상태를 저장하기 위해 boolean 타입이고 이름이 isOn이라는 데이터를 사용한다고 가정하다. 이 데이터를 사용하는 프로시저는 모두 isOn을 boolean 타입으로 처리할 것이다. 그런데, 요구 사항이 변경되어서 꺼짐/켜짐 상태뿐만 아니라 대기 상태를 추가해야 한다고 해보자. 이 요구 사항을 반영하기 위해 isOn 데이터의 타입을 boolean 타입에서 열거 타입으로 변경하게 되면, 이 데이터를 사용하는 모든 프로시저도 함께 수정해 주어야 한다.

절차 지향적으로 프로그램을 구성할 때 매우 흔하게 발생하는 문제들이다. 이로 인해 새로운 요구 사항이 생겨서 프로그램의 한 곳을 수정하게 되면, 다른 곳에서 문제가 발생하고, 다시 그 곳을 수정하면 또 다른 곳에서 문제가 발생하는 악순환이 발생하기도 한다.

이는 결국 코드의 수정을 어렵게 만들며, 새로운 기능을 추가하는데 많은 구현 시간(즉, 개발 비용)을 투입하게 만든다.

### 객체 지향

데이터 및 데이터와 관련된 프로시저를 객체(Object)라고 불리는 단위로 묶는다.

객체는 다른 객체에 기능을 제공하기 위해 프로시저를 사용하는데, 이때 프로시저는 자신이 속한 객체의 데이터에만 접근할 수 있으며, 다른 객체에 속한 데이터에는 접근할 수 없다.

객체 지향적으로 만든 코드에서는 객체의 데이터를 변경하더라도 해당 객체로만 변화가 집중되고 다른 객체에는 영향을 주지 않기 때문에, 요구 사항의 변화가 발생했을 때 절차 지향 방식보다 프로그램을 더 쉽게 변경할 수 있는 장점을 갖는다.

## 2. 객체

객체 지향의 가장 기본은 객체(Object)다. 앞서 객체는 데이터와 그 데이터를 조작하는 프로시저(오퍼레이션 메서드, 함수)로 구성된다고 했는데, 이는 객체의 물리적인 특징일 뿐이다. 실제로 객체를 정의할 때 사용되는 것은 객체가 제공해야 할 기능이며, 객체가 내부적으로 어떤 데이터를 갖고 있는지는 정의되지 않는다. 보통 객체가 제공하는 기능을 오퍼레이션이라고 부른다. 인터페이스는 객체를 사용하기 위한 일종의 명세나 규칙이라고 생각하면 된다.

객체는 객체가 제공하는 기능으로 정의된다고 했는데, 이는 다시 말하면 객체마다 자신만의 책임(responsibility)이 있다는 의미를 갖는다.

객체 지향적으로 프로그래밍을 할 때, 가장 어려우면서 가장 중요한 것이 바로 객체 마다 기능을 할당하는 과정이다. 객체가 얼마나 많은 기능을 제공할 것인가에 대한 확실한 규칙이 하나 존재하는데, 그 규칙은 바로 객체가 갖는 책임의 크기는 작을수록 좋다는 것이다. 객체가 갖는 책임이 작아야 한다는 것은 객체가 제공하는 기능의 개수가 적다는 걸 의미한다.

객체가 갖는 책임이 커질수록 절차 지향적으로 구조가 변질되며, 절차 지향의 가장 큰 단점인 기능 변경의 어려움 문제(즉, 경직성 문제)가 발생하게 된다.

단일 책임 원칙은 이름에서 알 수 있듯이 객체는 단 한개의 책임만을 가져야 한다는 원칙이다. 단일 책임 원칙을 따르다 보면 자연스럽게 기능의 세부 내용이 변경될 때, 변경해야 할 부분이 한 곳으로 집중된다.

```java
/**
 * @author Incheol Jung
 */
public class FlowController {
    private String fileName;
    
    public void process(){
        FileDataReader reader = new FileDataReader(fileName); // 객체 생성
        byte[] plainBytes = reader.read(); // 메서드 호출
        
        ByteEncryptor encryptor = new ByteEncryptor(); // 객체 생성
        byte[] encryptedBytes = encryptor.encrypt(plainBytes); // 메서드 호출
        
        FileDataWriter writer = new FileDataWriter(); // 객체 생성
        writer.write(encryptedBytes); // 메서드 호출
    }
}
```

이렇게 한 객체가 다른 객체를 생성하거나 다른 객체의 메서드를 호출할 때, 이를 그 객체에 의존(dependency)한다고 표현한다.

#### 다음 코드를 살펴보자.

```java
public class AuthenticationHandler {
    public void handleRequest(String inputId, String inputPassword) {
        Authenticator auth = new Authenticator();
        try{
            auth.authenticate(inputId, inputPassword);
            // 아이디/암호가 일치하는 경우의 처리
        } catch (MemberNotFoundException ex){
            // 아이디가 잘못된 경우의 처리
        } catch (InvalidPasswordException ex){
            // 암호가 잘못된 경우의 처리
        }
    }
}

public class Authenticator {
    public void authenticate(String id, String password){
        Member m = findMemberById(id);
        if (m == null) throw new MemberNotFoundException();
        
        if (!m.equalPassword(password)) throw new InvalidaPasswordException();
    }
}
```

AuthenticationHandler 클래스는 Authenticator 클래스를 사용하고 있다. 즉, AuthenticationHandler 클래스가 Authenticator 클래스에 의존하고 있고, Authenticator 클래스에 변화가 생기면 AuthenticationHandler 클래스에도 영향을 받게 된다.

* 내가 변경되면 나에게 의존하고 있는 코드에 영향을 준다.
* 나의 요구가 변경되면 내가 의존하고 있는 타입에 영향을 준다.

## 3. 캡슐화

캡슐화는 객체가 내부적으로 기능을 어떻게 구현 하는지를 감추는 것이다.

```java
public class Member {
    private Date expiryDate;
    private boolean male;

    public Date getExpiryDate() {
        return expiryDate;
    }

    public boolean isMale() {
        return male;
    }
}
```

Member 객체를 이용해서 만료 여부를 확인하는 코드는 Member가 제공하는 expiryDate 데이터의 값과 현재 시간을 비교하게 된다. 아래와 같은 형태의 코드는 시간이 흐를수록 이곳 저곳에서 사용될 것이다.

```java
if (member.getExpiryDate().getDate() < System.currentTimeMillis()) {
    // 만료 되었을 때의 처리
}
```

우여곡절 끝에 만료 여부 확인 코드를 모두 찾아서 수정해 주었다고 하다. 그런데, 시간을 흘러 다시 만료 여부 확인 정책에 변화가 생겼다. 슬프게도 그 사이에 만료 여부를 확인하는 코드를 사용하는 곳이 증가했다.

```java
long day30 = 1000 * 60 * 60 * 24 * 30; // 30일
if ((member.isMale() && member.getExpiryDate() != null
     && member.getExpiryDate().getTime() < System.currentTimeMillis()) 
			|| (!member.isMale() && member.getExpiryDate() != null
            && member.getExpiryDate().getTime() < System.currentTimeMillis())) {
    // 만료 되었을 때의 처리
}
```

요구 사항의 변화로 인해 데이터의 구조나 쓰임새가 변경되면 이로 인해 데이터를 사용하는 코드들도 연쇄적으로 수정해 주어야 한다.

```java
if (member.isExpired()) { 
	// 만료에 따른 처리
}
```

다시 살펴보니 수정할 곳이 없다. IsExpired() 메서드만 수정했을 뿐, isExpired() 메서드를 사용하는 코드는 변경할 필요가 없는 것이다.

객체 지향을 처음 접하는 사람들은 그 동안 몸에 밴 절차 지향 방식 습관 때문에 무심결에 데이터 중심적인 코드를 만들기 쉽다. 이런 습관을 고치는데 도움이 되는 두 개의 규칙이 있는데 그 규칙은 다음과 같다.

* Tell, Don’t Ask
* 데미테르의 법칙

“Tell, Don’t Ask” 규칙은 간단하다. 데이터를 물어보지 않고, 기능을 실행해 달라고 말하라는 규칙이다. 앞서 회원 만료 여부를 확인하는 코드를 다시 떠올려 보자. 절차 지향 방식은 만 료 일자 데이터를 가져와서, 직접 만료 여부를 확인했다.

```java
// member.getExpiryDate() : 만료 일자 데이터를 가져옴
if (member.getExpiryDate() != null &&
	membet.getExpiryDate().getDate() < System.currentTimeMillis()) {
    // 만료 되었을 때의 처리
}
```

데이터를 읽는 것은 데이터를 중심으로 코드를 작성하게 만드는 원인이 되며, 따라서 절차지향적인 코드를 유도하게 된다.

기능 실행을 요청하는 방식으로 코드를 작성하다 보면, 자연스럽게 해당 기능을 어떻게 구현했는지 여부가 감춰진다. 즉, 기능 구현이 캡슐화되는 것이다.

데미테르의 법칙은 ‘Tell, Don't Ask’ 규칙을 따를 수 있도록 만들어 주는 또 다른 규칙이다. 데미테르의 법칙은 다음과 같이 간단한 규칙으로 구성된다.

* 메서드에서 생성한 객체의 메서드만 호출
* 파라미터로 받은 객체의 메서드만 호출
* 필드로 참조하는 객체의 메서드만 호출

```java
public void processSome(Member member) {
	if(member.getDate().getTime() < ...) {
		// 데미테르 법칙 위반
	}
}
```

데미테르의 법칙에 따르면 파라미터로 전달 받은 객체의 메서드만 호출하도록 되어 있는데, 위 코드의 경우 파라미터로 전달받은 member의 getDate() 메서드를 호출한 뒤에, 다시 getDate()가 리턴한 date 객체의 getTime() 메서드를 호출했기 때문이다.

따라서 데미테르의 법칙을 따르려면, 위 코드를 member 객체 대한 한 번의 메서드 호출로 변경해 주어야 한다. 이는 결국 데이터 중심이 아닌 기능 중심으로 코드를 작성하도록 유도하기 때문에, 기능 구현의 캡슐화를 향상시켜 준다.

#### 객체 지향 설계란 다음의 작업을 반복하는 과정이라고 볼수 있다.

1. 제공해야 할 기능을 찾고 또는 세분화하고, 그 기능을 알맞은 객체에 할당한다.
   1. 기능을 구현하는데 필요한 데이터를 객체에 추가한다. 객체에 데이터를 먼저 추가하고 그 데이터를 이용하는 기능을 넣을 수도 있다.
   2. 기능은 최대한 캡슐화해서 구현한다.
2. 객체 간에 어떻게 메시지를 주고받을 지 결정한다.
3. 과정1과 과정2를 개발하는 동안 지속적으로 반복한다.

객체 설계는 한 번에 완성되지 않고 구현을 진행해 나가면서 점진적으로 완성된다. 이는 최초에 만든 설계가 완벽하지 않으며, 개발이 진행되면서 설계도 함께 변경된다는 것을 의미한다. 따라서 설계를 할 때에는 변경되는 부분을 고려한 유연한 구조를 갖도록 노력해야 한다.
