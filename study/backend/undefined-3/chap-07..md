---
description: 테스트 주도 개발 시작하기 7장을 요약한 내용입니다.
---

# CHAP 07. 대역

## 대역의 필요성

테스트를 작성하다 보면 외부 요인이 필요한 시점이 있다. 다음은 외부 요인이 테스트에 관여하는 주요 예이다.

* 테스트 대상에서 파일 시스템을 사용
* 테스트 대상에서 DB로부터 데이터를 조회하거나 데이터를 추가
* 테스트 대상에서 외부의 HTTP 서버와 통신

테스트 대상이 이런 외부 요인에 의존하면 테스트를 작성하고 실행하기 어려워진다. TDD는 "테스트 작성 → 통과시킬 만큼 구현 → 리팩토링"의 과정을 짧은 흐름으로 반복해야하는데 외부 업체에서 상황별 카드번호를 제공하지 않으면 테스트를 진행할 수 없게 된다.

외부 요인은 테스트 작성을 어렵게 만들 뿐만 아니라 테스트 결과도 예측할 수 없게 만든다. 예를 들어 카드 정보 검사 대행업체에서 테스트할 때 사용하라고 제공한 카드번호의 유효기간이 한 달 뒤일 수 있다. 이 카드번호를 사용해서 성공한 자동이체 정보 등록 기능 테스트는 한 달 뒤에 유효 기간 만료로 실패하게 된다.

## 대역을 이용한 테스트

대역을 이용해서 AutoDebitRegister를 테스트하는 코드를 다시 작성해보자. 먼저 CardNumberValidator를 대신할 대역 클래스를 작성하자

```text
public class StubCardNumberValidator extends CardNumberValidator {
    private String invalidNo;
    private String theftNo;

    public void setInvalidNo(String invalidNo) {
        this.invalidNo = invalidNo;
    }

    public void setTheftNo(String theftNo) {
        this.theftNo = theftNo;
    }

    @Override
    public CardValidity validate(String cardNumber) {
        if (invalidNo != null && invalidNo.equals(cardNumber)) {
            return CardValidity.INVALID;
        }
        if (theftNo != null && theftNo.equals(cardNumber)) {
            return CardValidity.THEFT;
        }
        return CardValidity.VALID;
    }
}
```

StubCardNumberValidator는 실제 카드번호 검증 기능을 구현하지 않는다. 대신 단순한 구현으로 실제 구현을 대체한다. 이 StubCardNumberValidator를 이용해서 AutoDebitRegister를 테스트하는 코드를 작성해보자

```text
@BeforeEach
void setUp() {
    stubValidator = new StubCardNumberValidator();
    stubRepository = new StubAutoDebitInfoRepository();
    register = new AutoDebitRegister(stubValidator, stubRepository);
}

@Test
void invalidCard() {
    stubValidator.setInvalidNo("111122223333");

    AutoDebitReq req = new AutoDebitReq("user1", "111122223333");
    RegisterResult result = this.register.register(req);

    assertEquals(INVALID, result.getValidity());
}
```

## 대역의 종류

[대역의 종류](https://www.notion.so/aa31373bf618444ca010dd6683399b7e)

### 약한 암호 확인 기능에 스텁 사용

* 압호를 확인하는 스텁용 클래스인 StubWeakPasswordChecker를 생성한다.
* StubWeakPasswordChecker 클래스는 암호를 확인하는 기능을 단순히 weak 필드 값을 리턴하도록 간단하게 구현한다.
* 실제 테스트 하는 클래스에 스텁용 클래스를 주입한다.
* 테스트 클래스에서 암호화 체크 기능을 수행할때 스텁용 클래스에서 결과를 리턴해준다.

### 리포지토리를 가짜 구현으로 사용

* Repository와 동일하게 동작하는 MemoryUserRepository를 생성한다.
* MemoryUserRepository는 요청이 들어오면 DB를 접근하는게 아니고 메모리를 접근하도록 구현한다.
* MemoryUserRepository를 테스트 클래스에 주입한다.
* 테스트 클래스 수행시 동일한 로직을 수행하면서 DB 접근을 메모리 접근으로 대체한다.

### 이메일 발송 여부를 확인하기 위해 스파이를 사용

* 이메일 발송 여부를 대신 확인해주는 SpyEmailNotifier 클래스를 생성한다.
* SpyEmailNotifier의 이메일 전송 요청을 호출하게 되면 내부의 발송값을 true로 변경해준다.
* SpyEmailNotifier를 테스트 클래스에 주입한다.
* 테스트 클래스 수행시 이메일 전송 요청을 한 후 이메일 발송 여부를 확인하게 되면 전송 요청시 이메일 발송 여부는 true로 변경되어 테스트가 정상적으로 수행되는것을 확인할 수 있다.

### 모의 객체로 스텁과 스파이 대체

Mockito에서 제공하는 Mock을 사용하여 스텁과 스파이 또한 대체할 수 있다. 대역 객체가 기대하는 대로 상호작용했는지 확인하는 것이 모의 객체의 주요 기능이다. Mockto를 사용하면 모의 객체가 기대한 대로 불렸는지 검증할 수 있다.

## 상황과 결과 확인을 위한 협업 대상\(의존\) 도출과 대역 사용

제어하기 힘든 외부 상황이 존재하면 다음과 같은 방법으로 의존을 도출하고 이를 대역으로 대신할 수 있다.

* 제어하기 힘든 외부 상황을 별도 타입으로 분리
* 테스트 코드는 별도로 분리한 타입의 대역을 생성
* 생성한 대역을 테스트 대상의 생성자 등을 이용해서 전달
* 대역을 이용해서 상황 구성

## 대역과 개발 속도

TDD 과정에서 대역을 사용하지 않고 실제 구현을 사용한다면 다음과 같은 일이 벌어지게 된다.

* 카드 정보 제공 업체에서 도난 카드번호를 받을 때까지 테스트를 기다린다.
* 카드 정보 제공 API가 비정상 응답을 주는 상황을 테스트하기 위해 업체의 변경 대응을 기다린다.
* 회원 가입 테스트를 한 뒤에 편지가 도착할 때까지 메일함을 확인한다.
* 약한 암호 검사 기능을 개발할 때까지 회원 가입 테스트를 대기한다.

네 경우 모두 대기 시간이 발생한다. 대역을 사용하면 실제 구현이 없어도 다양한 상황에 대해 테스트할 수 있다. 또한, 대역을 사용하면 실제 구현이 없어도 실행 결과를 확인할 수 있다.

즉, 대역은 의존하는 대상을 구현하지 않아도 테스트 대상을 완성할 수 있게 만들어주며 이는 대기 시간을 줄여주어 개발 속도를 올리는 데 도움이 된다.

## 모의 객체를 과하게 사용하지 않기

모의 객체를 이용하면 대역 클래스를 만들지 않아도 되니깐 처음에는 편할 수 있다. 하지만 결과 값을 확인하는 수단으로 모의 객체를 사용하기 시작하면 결과 검증 코드가 길어지고 복잡해진다. 특히 하나의 테스트를 위해 여러 모의 객체를 사용하기 시작하면 결과 검증 코드의 복잡도는 배로 증가한다. 게다가 모의 객체는 기본적으로 메서드 호출 여부를 검증하는 수단이기 때문에 테스트 대상과 모의 객체 간의 상호 작용이 조금만 바뀌어도 테스트가 깨지기 쉽다.

이런 이유로 모의 객체의 메서드 호출 여부를 결과 검증 수단으로 사용하는 것은 주의해야 한다. 특히 DAO나 리포지토리와 같이 저장소에 대한 대역은 모의 객체를 사용하는 것보다 메모리를 이용한 가짜 구현을 사용하는 것이 테스트 코드 관리에 유리하다.

