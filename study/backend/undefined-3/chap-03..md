---
description: 테스트 주도 개발 시작하기 3장을 요약한 내용입니다.
---

# CHAP 03. 테스트 코드 작성 순서

## 테스트 코드 작성 순서

2장에서 작성한 암호 측정 기능을 TDD로 구현하였다. 이를 토대로 테스트 코드를 작성한 순서는 다음과 같았다.

1. 모든 규칙을 충족하는 암호 강도는 '강함'
2. 길이만 8글자 미만이고 나머지 규칙은 충족하는 암호의 강도는 '보통'
3. 숫자를 포함하지 않고 나머지 규칙은 충족하는 암호의 강도는 '보통'
4. 값이 없는 암호의 강도는 '유효하지 않음'
5. 대문자를 포함하지 않고 나머지 규칙은 충족하는 경우
6. 길이가 8글자 이상인 규칙만 충족하는 경우
7. 숫자 포함 규칙만 충족하는 경우
8. 대문자 포함 규칙만 충족하는 경우
9. 아무 규칙도 충족하지 않은 경우

#### 이 순서가 그냥 나온 것은 아니다. 실제로 이 순서는 다음 규칙에 따라 나왔다.

* 쉬운 경우에서 어려운 경우로 진행
* 예외적인 경우에서 정상인 경우로 진행

### 초반에 복잡한 테스트부터 시작하면 안 되는 이유

* 만약 초반부터 다양한 조합을 검사하는 복잡한 상황을 테스트로 추가한다고 가정해보자
  * 대문자 포함 규칙만 충족하는 경우
  * 모든 규칙을 충족하는 경우
  * 숫자를 포함하지 않고 나머지 규칙은 충족하는 경우
* 이 순서대로 TDD를 진행해 보자
* 대문자 포함 규칙만 충족하는 경우를 테스트하기 위한 코드를 작성해보자

  ```text
  @Test
  void meetsOnlyUpperCriteria_Then_Weak() {
    PasswordStrengthMeter meter = new PasswordStrengthMeter();
  	PasswordStrength result = meter.meter("abcDef");
    assertStrength(result, PasswordStrength.WEAK);
  }
  ```

* 이 테스트에 대한 구현은 간단하다. 단순히 WEAK를 리턴하면 된다.

  ```text
  public PasswordStrength meter(String s) {
      return PasswordStrength.WEAK;
  }
  ```

* 이제 모든 규칙을 충족하는 경우를 테스트하기 위한 코드를 추가할 차례다.

  ```text
  @Test
  void meetsAllCriteria_Then_Weak() {
    PasswordStrengthMeter meter = new PasswordStrengthMeter();
  	PasswordStrength result = meter.meter("abcDef12");
    assertStrength(result, PasswordStrength.STRONG);
  }
  ```

* 이 테스트를 가장 빨리 통과시킬 수 있는 방법은 입력값이 "abcDef12"이면 STRONG을 리턴하는 코드를 추가하는 것이다.

  ```text
  public PasswordStrength meter(String s) {
  		if("abcDef12".equals(s)) return PasswordStrength.STRONG;
      return PasswordStrength.WEAK;
  }
  ```

* 테스트 예를 하나 더 추가해보자

  ```text
  @Test
  void meetsAllCriteria_Then_Weak() {
    PasswordStrengthMeter meter = new PasswordStrengthMeter();
  	PasswordStrength result = meter.meter("abcDef12");
    assertStrength(result, PasswordStrength.STRONG);

  	PasswordStrength result = meter.meter("aZcDef12");
    assertStrength(result, PasswordStrength.STRONG);
  }
  ```

* 검증 예를 추가할때마다 if 절을 늘릴 수는 없다. 좀 더 범용적인 구현이 필요하다.

범용적인 구현은 어떤 모습일까?

* 모든 조건을 충족하는지 검사하는 코드일까?
* 일단 대문자만 포함하면 STRONG을 리턴하는 코드여야 할까?
* 아니면 8글자 이상이면 STRONG을 리턴하는 코드여야 할까?
* 두 번째 테스트를 추가한 것뿐인데 벌써부터 막히기 시작한다.
* 두 번째 테스트를 통과시키려면 모든 규칙을 확인하는 코드를 구현해야 할것만 같다.

보통의 개발자는 한 번에 많은 코드를 만들다 보면 나도 모르게 버그를 만들고 나중에 버그를 잡기 위해 많은 시간을 허비하게 된다. 당연히 테스트 통과 시간도 길어진다. 그뿐만 아니라 코드 작성 시간이 길어지면 집중력도 떨어져서 흐름이 자주 끊기게 된다.

### 구현하기 쉬운 테스트부터 시작하기

* 가장 구현하기 쉬운 경우부터 시작하면 빠르게 테스트를 통과시킬 수 있다.
* 암호 강도 측정 예에서는 어떤 것이 가장 쉬울까?
  * 모든 조건을 충족하는 경우
  * 모든 조건을 충족하지 않는 경우
* 모든 조건을 충족하는 경우를 첫 번째 테스트로 시작했다.
  * 구현 코드를 단순히 STRONG으로 리턴하여 해당 테스트 케이스를 통과하였다.
* 다음으로 어떤 테스트를 추가할까? 역시 구현하기 쉬운 것이 선택 기준이 된다.
  * 모든 규칙을 충족하지 않는 경우
    * 정반대 조건을 테스트하려면 결국 모든 규칙을 검사하는 코드를 구현해야 할 것 같다.
  * 한 규칙만 충족하는 경우
    * 한 규칙을 충족하는지 여부를 검사해서 WEAK를 리턴하면 된다.
  * 두 규칙을 충족하는 경우
    * 이 경우에도 한 규칙을 충족하는지 여부를 검사하면 될 것 같다.
    * 두 규칙을 충족한다는 것은 충족하지 않는 규칙이 하나 존재한다는 것이므로 한 규칙을 충족하는지 검사해서 충족하지 않으면 NORMAL을 리턴하면 된다.
* 이렇게 하나의 테스트를 통과했으면 그다음으로 구현하기 쉬운 테스트를 선택해야 한다. 구현이 어렵지 않기 때문에 짧은 시간에 구현을 완료하고 테스트를 통과시킬 수 있다. 이를 통해 점진적으로 구현을 완성해 나갈 수 있다.
* 한 번에 구현하는 시간이 짧아지면 디버깅할 때에 유리하다.

### 예외 상황을 먼저 테스트해야 하는 이유

* 다양한 예외 상황은 복잡한 if-else 블록을 동반할 때가 많다.
* 예외 상황을 전혀 고려하지 않은 코드에 예외 상황을 반영하려면 코드의 구조를 뒤집거나 코드 중간에 예외 상황을 처리하기 위해 조건문을 중복해서 추가하는 일이 벌어진다. \(버그 발생 가능성을 높인다\)
* TDD를 하는 동안 예외 상황을 찾고 테스트에 반영하면 예외 상황을 처리하지 않아 발생하는 버그도 줄여준다.
* 사소한 버그가 서비스 중단을 일으킬 수 있다.

### 완급 조절

* TDD로 구현할 때 어려운 것 줄 하나는 한 번에 얼마만큼의 코드를 작성할 것인가이다.
* TDD를 처음 접할 때는 다음 단계에 따라 TDD를 익혀보자
  1. 정해진 값을 리턴
  2. 값 비교를 이용해서 정해진 값을 리턴
  3. 다양한 테스트를 추가하면서 구현을 일반화
* 위 단계를 이용해서 TDD를 연습한 개발자는 조금씩 기능을 구현해 나갈 수 있다.
* TDD가 익숙해지면 상황에 따라 속도를 조절할 수 있게 된다.

### 지속적인 리팩토링

* 테스트를 통과한 뒤에는 리팩토링을 진행한다.
* 코드 중복은 대표적인 리팩토링 대상이다.
* TDD를 진행하는 과정에서 지속적으로 리팩토링을 진행하면 코드 가독성이 높아진다.

일단 동작하는 코드를 만드는 능력은 중요하다. 하지만 소프트웨어의 생존 시간이 길어질수록 소프트웨어를 지속적으로 개선해야 한다.

리팩토링을 통해 이해하고 변경하기 쉽게 코드를 개선함으로써 변화하는 요구 사항을 적은 비용으로 반영할 수 있다. 이는 소프트웨어의 생존 시간을 늘려준다.

**테스트 대상 코드의 리팩토링 시점**

테스트 대상 코드에서 상수를 변수로 바꾸거나 변수 이름을 변경하는 것과 같은 작은 리팩토링은 발견하면 바로 실행한다. 반면에 메서드 추출과 같이 메서드의 구조에 영향을 주는 리팩토링은 큰 틀에서 구현 흐름이 눈에 들어오기 시작한 뒤에 진행한다.

코드 구조가 잘못되면 다음 테스트를 통과시키는 과정에서 코드가 복잡해지거나 구현을 더는 진행하지 못하고 막힐 수 있다. 이런 상황이 오면 구현을 멈추고 메서드 추출 리팩토링을 되돌려야 한다. 리팩토링을 취소해서 코드를 원상 복구한 뒤에 다음 테스트를 진행한다. 그런뒤 코드의 의미나 구조가 더 명확해지면 그때 다시 리팩토링을 시도한다.

## 테스트 작성 순서 연습

매달 비용을 지불해야 사용할 수 있는 유료 서비스가 있다고 해보자

* 서비스를 사용하려면 매달 1만원을 선불로 납부한다. 납부일 기준으로 한 달 뒤가 서비스 만료일이 된다.
* 2개월 이상 요금을 납부할 수 있다.
* 10만원을 납부하면 서비스를 1년 제공한다.

### 쉬운 것부터 테스트

이제 테스트 메서드를 추가하자.

* 우선 가장 쉬어 보이는 만료일을 계산하는 테스트 코드를 작성해 보자
* 계산에 필요한 값은 납부일과 납부액이고 결과는 계산된 만료일이다.

  ```text
  @Test
  void 만원_납부하면_한달_뒤가_만료일이_됨() {
      LocalDate billingDate = LocalDate.of(2019,3,1);
  		int payAmount = 10,000;

  		ExpiryDateCalculator cal = new ExpiryDateCalculator();
  		LocalDate expiryDate = cal.calculateExpiryDate(billingDate, payAmount);
    
  		assertEquals(LocalDate.of(2019,4,1),expiryDate);
  }
  ```

* 테스트 코드를 성공하기 위해 구현 코드를 작성하자

  ```text
  public LocalDate calculateExpiryDate(PayData payData) {
      return LocalDate.of(2019,4,1);
  }
  ```

* 테스트 케이스를 추가한 후, 구현 코드를 일반화 하자

  ```text
  public LocalDate calculateExpiryDate(PayData payData) {
      return payData.plugMonth(1);
  }
  ```

### 코드 정리:중복 제거

* 테스트 코드의 상수를 변수화한다.
* 테스트 코드의 중복된 영역을 메소드로 분리 한다.

  ```text
  @Test
  void 만원_납부하면_한달_뒤가_만료일이_됨() {
      assertExpiryDate(
              PayData.builder()
                      .billingDate(LocalDate.of(2019, 3, 1))
                      .payAmount(10_000)
                      .build(),
              LocalDate.of(2019, 4, 1));
      assertExpiryDate(
              PayData.builder()
                      .billingDate(LocalDate.of(2019, 5, 5))
                      .payAmount(10_000)
                      .build(),
              LocalDate.of(2019, 6, 5));
  }

  private void assertExpiryDate(PayData payData, LocalDate expectedExpiryDate) {
      ExpiryDateCalculator cal = new ExpiryDateCalculator();
      LocalDate realExpiryDate = cal.calculateExpiryDate(payData);
      assertEquals(expectedExpiryDate, realExpiryDate);
  }
  ```

### 예외 상황 처리

* 쉬운 구현을 하나 했으니 이제 예외 상황을 찾아보자
* 단순히 한 달 추가로 끝나지 않는 상황이 존재한다.
  * 납부일이 2019-01-31이고 납부액이 1만 원이면 만료일은 2019-02-28이다.
  * 납부일이 2019-05-31이고 납부액이 1만 원이면 만료일은 2019-06-30이다.
  * 납부일이 2020-01-31이고 납부액이 1만 원이면 만료일은 2020-02-29이다.
* 테스트 코드를 작성해보자

  ```text
  @Test
  void 납부일과_한달_뒤_일자가_같지_않음() {
      assertExpiryDate(
              PayData.builder()
                      .billingDate(LocalDate.of(2019, 1, 31))
                      .payAmount(10_000)
                      .build(),
              LocalDate.of(2019, 2, 28));
      assertExpiryDate(
              PayData.builder()
                      .billingDate(LocalDate.of(2019, 5, 31))
                      .payAmount(10_000)
                      .build(),
              LocalDate.of(2019, 6, 30));
      assertExpiryDate(
              PayData.builder()
                      .billingDate(LocalDate.of(2020, 1, 31))
                      .payAmount(10_000)
                      .build(),
              LocalDate.of(2020, 2, 29));
  }
  ```

* 테스트 코드는 바로 통과한다. 왜냐하면 LocalDate.plugMonths\(\) 메서드가 알아서 한 달 추가 처리를 해주기 때문이다.

### 다음 테스트 선택: 다시 예외 상황

* 다음 테스트를 선택하자. 그다음으로 쉽거나 예외적인 것을 선택하면 된다. 다음은 생각할 수 있는 쉬운 예이다.
  * 2만 원을 지불하면 만료일이 두 달 뒤가 된다.
  * 3만 원을 지불하면 만료일이 세 갈 뒤가 된다.
* 쉬운 것을 테스트할까? 예외 상황을 먼저 테스트할까?
* 예외 상황을 테스트하려면 첫 납부일이 필요하다. 앞서 작성한 테스트는 납부일과 납부액만 사용했기 때문에 기존 ㅗ드에 첫 납부일을 추가하는 작업이 필요하다.

### 다음 테스트를 추가하기 전에 리팩토링

* 만료일을 계산하는데 필요한 값이 세 개로 늘렀다.
  * calculateExpiryDate 메서드의 파라미터로 첫 납부일 추가
  * 첫 납부일, 납부일, 납부액을 담은 객체를 calculateExpiryDate 메서드에 전달
* 리팩토링을 진행하고 나면 ExpiryDateCalculator 코드는 다음과 같이 변경된다.

  ```text
  public class ExpiryDateCalculator {
      public LocalDate calculateExpiryDate(PayData payData) {
          ...
      }
  }
  ```

### 예외 상황 테스트 진행 계속

* 리팩토링을 했으니 다시 테스트를 추가하자

  * 첫 납부일이 2019-01-31이고 만료되는 2019-02-28에 1만 원을 납부하면 다음 만료일은 2019-03-31이다.

  ```text
  @Test
  void 첫_납부일과_만료일_일자가_다를때_만원_납부() {
      PayData payData = PayData.builder()
              .firstBillingDate(LocalDate.of(2019, 1, 31)) // 납부일 추가
              .billingDate(LocalDate.of(2019, 2, 28))
              .payAmount(10_000)
              .build();

      assertExpiryDate(payData, LocalDate.of(2019, 3, 31));
  }
  ```

* 테스트는 실패하였다. 구현 코드를 수정해보자.

  ```text
  public class ExpiryDateCalculator {
      public LocalDate calculateExpiryDate(PayData payData) {
          if(payDate.getFirstBillingDate().equals(LocalDate.of(2019,1,31))) {
  						return LocalDate.of(2019,3,31);
  				}
  				return payData.getBillingDate().plugMonths(1);
      }
  }
  ```

* 첫 번째 테스트는 통과했지만 두 테스트가 실패했다.
  * getFirstbillingDate가 null 체크를 구현 코드에 추가하였다.
* 상수를 이용해서 테스트를 통과시켰으니 구현을 일반화할 차례다.

  ```text
  public class ExpiryDateCalculator {
      public LocalDate calculateExpiryDate(PayData payData) {
          if(payDate.getFirstBillingDate() != null) {
  						LocalDate candidateExp = payDate.getBillingDate().plusMonths(1);
  						if(payData.getFirstBillingDate().getDayOfMonth() != 
  								candidateExp.getDatOhMonth()) {
  								return candidateExp.withDayOfMonth(
  										payData.getFirstBillingDate().getDayOfMonth());
  						}
  				}
  				return payData.getBillingDate().plugMonths(1);
      }
  }
  ```

* 테스트는 통과하였다.

### 코드 정리: 상수를 변수로

* plugMonths\(1\) 를 사용하였다. 1은 만료일을 계산할 때 추가할 개월 수를 의미한다.
* 상수 1을 변수로 변경하자

### 다음 테스트 선택: 쉬운 테스트

* 다음 테스트를 선택하자.
  * 2만 원을 지불하면 만료일이 두 달 뒤가 된다.
  * 3만 원을 지불하면 만료일이 석 달 뒤가 된다.
* 테스트 코드를 추가해 보자

  ```text
  @Test
  void 이만원_이상_납부하면_비례해서_만료일_계산() {
      assertExpiryDate(
              PayData.builder()
                      .billingDate(LocalDate.of(2019, 3, 1))
                      .payAmount(20_000)
                      .build(),
              LocalDate.of(2019, 5, 1));
  }
  ```

* 구현 코드를 수정해보자

  ```text
  public LocalDate calculateExpiryDate(PayData payData) {
  		// addedMonths를 금액에 따라 수정
  		int addedMonths = payData.getPayAmount() / 10_000;

      if(payDate.getFirstBillingDate() != null) {
  				LocalDate candidateExp = payDate.getBillingDate().plusMonths(1);
  				if(payData.getFirstBillingDate().getDayOfMonth() != 
  						candidateExp.getDatOhMonth()) {
  						return candidateExp.withDayOfMonth(
  								payData.getFirstBillingDate().getDayOfMonth());
  				}
  		}
  		return payData.getBillingDate().plugMonths(1);
  }
  ```

### 예외 상황 테스트 추가

* 이번에 추가할 상황은 첫 납부일과 납부일의 일자가 다를 때 2만 원이상 납부한 경우이다.
  * 첫 납부일이 2019-01-31이고 만료되는 2019-02-28에 2만원을 납부하면 다음 만료일은 2019-04-30이다.
* 테스트 코드를 추가하자

  ```text
  @Test
  void 첫_납부일과_만료일_일자가_다를때_이만원_이상_납부() {
      assertExpiryDate(
              PayData.builder()
                      .firstBillingDate(LocalDate.of(2019, 1, 31))
                      .billingDate(LocalDate.of(2019, 2, 28))
                      .payAmount(20_000)
                      .build(),
              LocalDate.of(2019, 4, 30));
  }
  ```

* 이는 익셉션이 발생한다. 왜냐하면 4월에는 31일이 없는데 31일로 설정해서 발생한 것임을 알 수 있다.

  ```text
  public LocalDate calculateExpiryDate(PayData payData) {
  		int addedMonths = payData.getPayAmount() / 10_000;

      if(payDate.getFirstBillingDate() != null) {
  				LocalDate candidateExp = payDate.getBillingDate().plusMonths(1);
  				if(payData.getFirstBillingDate().getDayOfMonth() != 
  						candidateExp.getDatOhMonth()) {
  						// 날짜가 잘못 계산되어 익셉션이 발생한다. 
  						return candidateExp.withDayOfMonth(
  								payData.getFirstBillingDate().getDayOfMonth());
  				}
  		}
  		return payData.getBillingDate().plugMonths(1);
  }
  ```

* 이 테스트를 통과시키려면 다음 조건을 확인해야 한다.

  * 후보 만료일이 포함된 달의 마지막 날 &lt; 첫 납부일의 일자

  ```text
  public LocalDate calculateExpiryDate(PayData payData) {
  		int addedMonths = payData.getPayAmount() / 10_000;

      if(payDate.getFirstBillingDate() != null) {
  				LocalDate candidateExp = payDate.getBillingDate().plusMonths(1);
  				if(payData.getFirstBillingDate().getDayOfMonth() != 
  						candidateExp.getDatOhMonth()) {
  						// 후보 만료일이 포함된 달의 마지막 날 < 첫 납부일의 일자 조건 추가
  						if(YearMonth.from(candidateExp).lengthOfMonth() <
  							payData.getFirstBillingDate().getDayOfMonth()) { 
  								return candidateExp.withDayOfMonth(
  										payData.getFirstBillingDate().getDayOfMonth());
  							}
  				}
  		}
  		return payData.getBillingDate().plugMonths(1);
  }
  ```

## 시작이 안 될 때는 단언부터 고민

테스트 코드를 작성하다 보면 시작이 잘 안 될 때가 있다. 이럴 땐 검증하는 코드부터 작성하기 시작하면 도움이 된다. 예를 들어 만료일 계산 기능의 경우 만료일을 검증하는 코드부터 작성해 보는 것이다.

* 먼저 만료일을 어떻게 표현할지 결정해야 한다.
* 만료일이므로 날짜를 표현하는 타입을 선택하면 좋을 것 같다.
* 다음은 실제 만료일을 바꿀 차례다. 이 값은 만료일을 실제로 계산한 결과값을 갖는 변수로 바꿀 수 있다.
* 어떤 객체의 메서드를 실행해서 계산 기능을 실행하도록 하자
* 이제 두 가지를 정해야 한다.
  * cal의 타입 : 간단한 만료일 계산을 뜻하는 ExpiryDateCalculator로 정했다.
  * 파라미터 타입 : 만원을 납부했을 때 한 달 뒤가 만료일이 되는지를 테스트할 것이므로 납무일과 납부액을 전달한다.
* 이렇게 테스트 코드를 어떻게 작성할지 감을 못 잡겠다면 검증 코드부터 시작해보자.

## 구현이 막히면

TDD를 작성하다 보면 어떻게 해야 할지 생각이 잘 나지 않거나 무언가 잘못한 것 같은 느낌이 들것이다. 이럴 땐 과감하게 코드를 지우고 미련 없이 다시 시작한다. 어떤 순서로 테스트 코드를 작성했는지 돌이켜보고 순서를 바꿔서 다시 진행한다. 다시 진행할때에는 다음을 상기한다.

* 쉬운 테스트, 예외적인 테스트
* 완급 조절

