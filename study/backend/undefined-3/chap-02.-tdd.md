# CHAP 02. TDD 시작

## TDD 이전의 개발

### 저자의 TDD 적용 이전의 개발 방식

* 만들 기능에 대해 설계를 고민한다. 어떤 클래스와 인터페이스를 도출할지 고민하고 각 타입에 어떤 메서드를 넣을지 시간을 들여 생각한다.
* 과정1을 수행하면서 구현에 대해서도 고민한다. 대략 어떻게 구현하면 될지 머릿속에 그려지면 코드를 쓰기 시작한다.
* 기능에 대한 구현을 완료한 것 같으면 기능을 테스트한다. 이 과정에서 원하는 대로 동작하지 않거나 문제가 발생하면 과정2에서 작성한 코드를 디버깅하면서 원인을 찾는다.

### 개발 검증 이슈

* 과정2에서 한 번에 작성한 코드가 많은 경우에는 디버깅하는 시간도 길어졌다.
* 원인을 찾기 위해 많은 코드를 탐색해야 했다.
* 최초에 코드를 작성한 시간보다 버그를 찾는 시간이 더 오래 걸리는 경우도 있었다.
* 기능을 테스트하기 위해 톰캣 서버를 구동해야 했다.
* 데이터가 올바른지 확인하려고 DB에 접속해 SELECT 쿼리를 실행했고, 아이디 중복 기능을 테스트 하기 위해 INSERT 쿼리로 데이터를 미리 넣어야 했다.
* 경력을 쌓은 이후 뻔한 버그를 찾는 시간은 줄었으나 여전히 코드 오류에 대한 원인을 찾느라 많은 코드를 탐색해야 했다.

## TDD란?

* TDD는 테스트부터 시작한다.
* 기능을 검증하는 테스트 코드를 먼저 작성하고 테스트를 통과시키기 위해 개발을 진행한다.

### 간단한 덧셈 기능을 TDD로 구현해보자

```text
public class CalculatorTest {

    @Test
    void plus() {
        int result = Calculator.plus(1, 2);
        assertEquals(3, result);
    }
}
```

* Calculator 클래스를 작성하지 않았으니 당연히 컴파일 에러가 발생해야 한다.
* 덧셈 메서드 이름을 plug가 좋을까? 아니면 sum이 좋을까?
* 덧셈 기능을 제공하는 메서드는 파라미터가 몇 개여야 할까? 파라미터의 타입은? 반환할 값은?
* 메서드를 정적 메서드로 구현할까 인스턴스 메서드로 구현할까?
* 메서드를 제공할 클래스 이름은 뭐가 좋을까?

#### Calculator를 구현해보자

```text
public class Calculator {
    public static int plus(int a1, int a2) {
        return 0;
    }
}
```

* 우선은 테스트 코드에서 사용하는 스펙을 만들어주고 내부 구현은 구현하지 않고 0으로 리턴하도록 생성한다.
* 그리고 테스트 코드를 실행하면 실패가 발생한다.

  ```text
  public class Calculator {
      public static int plus(int a1, int a2) {
          return 3;
      }
  }
  ```

* 실패된 테스트 케이스를 해결하기 위해 결과값을 3으로 변경하였다.
* 테스트 케이스는 성공하였다. 그리고 덧셈 검증 코드를 하나 더 추가하였다.

  ```text
  @Test
  void plus() {
      int result = Calculator.plus(1, 2);
      assertEquals(3, result);
      assertEquals(5, Calculator.plus(4, 1));
  }
  ```

* 해당 테스트 실행하면 실패 결과를 확인할 수 있다.

  ```text
  public class Calculator {
      public static int plus(int a1, int a2) {
          if(a1 == 4 && a2 == 1) return 5;
  				else return 3;
      }
  }
  ```

* 두 테스트 케이스를 만족하는 덧셈 로직으로 구현하였다.
* 그러나 이렇게 테스트 케이스를 추가하다 보면 결국에 아래와 같은 구현 코드가 작성될 것이다.

  ```text
  public class Calculator {
      public static int plus(int a1, int a2) {
          return a1 + a2;
      }
  }
  ```

### 덧셈 기능에 대한 TDD로 구현해 봤다.

* 덧셈 기능을 검증하는 테스트 코드를 먼저 작성했다.
* 테스트 대상이 될 클래스 이름, 메서드 이름, 파라미터 개수, 리턴 타입을 고민했다.
* 새로운 객체를 생성할지 아니면 정적 메서드로 구현할지 고민했다.
* 테스트 코드를 작성한 뒤에는 컴파일 오류를 없애는 데 필요한 클래스와 메서드를 작성했다.
* 테스트를 실행했고 테스트에 실패했다.
* 실패한 테스트를 통과시킨 뒤에 새로운 테스트를 추가했고 다시 그 테스트를 통과시키기 위한 코드를 작성했다.
* 테스트를 먼저 작성하고 테스트에 실패하면 테스트를 통과시킬 만큼 코드를 추가하는 과정을 반복하면서 점진적으로 기능을 완성해 나간다.

## TDD 예: 암호 검사기

암호 검사기는 문자열을 검사해서 규칙을 준수하는지에 따라 암호를 '약함', '보통', '강함'으로 구분한다.

* 검사할 규칙은 다음 세 가지이다.
  * 길이가 8글자 이상
  * 0부터 9 사이의 숫자를 포함
  * 대문자 포함
* 세 규칙을 모두 충족하면 암호는 강함이다.
* 2개의 규칙을 충족하면 암호는 보통이다.
* 1개 이하의 규칙을 충족하면 암호는 약함이다.

#### 테스트 코드를 작성해 보자

```text
public class PasswordStrengthMeterTest {
	@Test
	void name() { }
}
```

* 아무 검증도 하지 않는 의미 없는 테스트 메서드를 하나 만들었다.

### 첫 번째 테스트: 모든 규칙을 충족하는 경우

* 첫 번째 테스트를 잘 선택하지 않으면 이후 진행 과정이 순탄하게 흘러가지 않는다.
* 첫 번째 테스트를 선택할 때에는 가장 쉽거나 가장 예외적인 상황을 선택해야 한다.

#### 그렇다면 가장 예외적 이거나 가장 쉬운 경우는 어떤 케이스일까?

* 모든 규칙을 충족하는 경우
  * 테스트를 쉽게 통과시킬 수 있다.
  * 각 조건을 검사하는 코드를 만들지 않고 '강함'에 해당하는 값을 리턴하면 테스트에 통과할 수 있다.
* 모든 조건을 충족하지 않는 경우
  * 모든 조건을 충족하지 않는 테스트를 통과시키려면 각 조건을 검사하는 코드를 모두 구현해야 한다.
  * 작성해야 할 코드가 많아지므로 첫 번째 테스트 코드를 통과하는 시간도 길어진다.
  * 사실상 구현을 다 하고 테스트를 하는 방식과 다르지 않다.

#### 모든 조건을 충족하는 테스트 케이스를 작성해보자

```text
@Test
void meetsAllCriteria_Then_Strong() {
		private PasswordStrengthMeter meter = new PasswordStrengthMeter();
    PasswordStrength result = meter.meter("ab12!@AB");
    assertEquals(expSPasswordStrength.STRONG, result);
}
```

* PasswordStrengthMeter 타입과 PasswordStrength 타입이 존재하지 않으므로 컴파일 에러가 발생한다.
* 컴파일 에러를 없애기 위해 타입을 생성해 보자

  ```text
  public enum PasswordStrength {
      STRONG
  }

  public class PasswordStrengthMeter {
      public PasswordStrength meter(String s) { return null; }
  }
  ```

* 컴파일 에러를 없앴으니 테스트를 실행할 수 있다. 당연히 테스트는 실패할 것이다.
* 테스트를 통과시키는 방법은 간단하다. PasswordStrengthMeter.meter\(\) 메서드가 STRONG을 리턴하도록 수정하면 된다.

  ```text
  public class PasswordStrengthMeter {
      public PasswordStrength meter(String s) { return PasswordStrength.STRONG; }
  }
  ```

* meetsAllCriteria\_Then\_Strong\(\) 테스트 메서드에 모든 규칙을 충족하는 예를 하나 더 추가하자

  ```text
  @Test
  void meetsAllCriteria_Then_Strong() {
  		private PasswordStrengthMeter meter = new PasswordStrengthMeter();
      PasswordStrength result = meter.meter("ab12!@AB");
      assertEquals(expSPasswordStrength.STRONG, result);
  		PasswordStrength result = meter.meter("abc1!Add");
      assertEquals(expSPasswordStrength.STRONG, result);
  }
  ```

* 코드를 추가한 뒤 테스트를 실행해도 테스트는 통과할 것이다.

### 두 번째 테스트: 길이만 8글자 미만이고 나머지 조건은 충족하는 경우

* 두 번째 테스트 메서드를 추가하자.
* 패스워드 문자열의 길이가 8글자 미만이고 나머지 조건은 충족하는 암호이다.

  ```text
  public enum PasswordStrength {
      NORMAL, STRONG
  }
  ```

* PasswordStrength enum 타입에 NORNAL value를 추가하였다.

  ```text
  public class PasswordStrengthMeter {
      public PasswordStrength meter(String s) { return PasswordStrength.NORMAL; }
  }
  ```

* 새로 추가한 테스트를 통과시키는 가장 쉬운 방법은 위와 같이 meter\(\) 메서드가 NORMAL을 리턴하도록 수정하는 것이다.
* 그런데 이렇게 수정하면 앞서 만든 테스트를 통과하지 못한다. 두 테스트를 모두 통과시킬 수 있는 정도의 코드를 작성해 보자

  ```text
  public class PasswordStrengthMeter {
      public PasswordStrength meter(String s) { 
  				if (s.length() < 8) {
  						return PasswordStrength.NORMAL;
  				}
  				return PasswordStrength.STRONG; 
  		}
  }
  ```

* 코드를 수정했으니 테스트를 실행하자. 통과할 것이다.

### 세 번째 테스트: 숫자를 포함하지 않고 나머지 조건은 충족하는 경우

* 숫자를 포함하지 않고 나머지 조건은 충족하는 암호이다.

  ```text
  @Test
  void meetsOtherCriteria_except_for_number_Then_Normal() {
  		private PasswordStrengthMeter meter = new PasswordStrengthMeter();
  		PasswordStrength result = meter.meter("ab!@ABqwer");
      assertStrength(result, PasswordStrength.NORMAL);
  }
  ```

* 테스트를 실행하면 실패할 것이다.
* 이 테스트를 통과하는 방법은 어렵지 않다. 암호가 숫자를 포함했는지를 판단해서 포함하지 않은 경우 NORMAL을 리턴하게 구현하면 된다.

  ```text
  public PasswordStrength meter(String s) {
      if (s.length() < 8) {
          return PasswordStrength.NORMAL;
      }
      boolean containsNum = false;
  		for (char ch : s.toCharArray()) {
          if (ch >= '0' && ch <= '9') {
              containsNum = true;
  						break;
          }
      }    
      if (!containsNum) return PasswordStrength.NORMAL;
      return PasswordStrength.STRONG;
  }
  ```

* 각 문자를 비교해서 0~9 사이의 값을 갖는 문자가 없으면 NORMAL을 리턴하도록 했다.
* 모든 테스트가 통과할 것이다.

### 코드를 리팩토링하자

* 숫자 포함 여부를 확인하는 코드를 메소드로 추출하여 가독성을 개선하고 메서드 길이도 줄여보자

  ```text
  public PasswordStrength meter(String s) {
      if (s.length() < 8) {
          return PasswordStrength.NORMAL;
      }
      boolean containsNum = meetsContainingNumberCriteria(s);  
      if (!containsNum) return PasswordStrength.NORMAL;
      return PasswordStrength.STRONG;
  }

  private boolean meetsContainingNumberCriteria(String s) {
      for (char ch : s.toCharArray()) {
          if (ch >= '0' && ch <= '9') {
              return true;
          }
      }
      return false;
  }
  ```

### 코드 정리: 테스트 코드 정리

* 세 개의 테스트 메서드를 추가했다.
* 각 테스트 메서드를 보면 다음과 같은 형태를 갖는다.

  ```text
  @Test
  void 메서드이름() {
  		private PasswordStrengthMeter meter = new PasswordStrengthMeter();
  		PasswordStrength result = meter.meter(암호);
      assertStrength(result, PasswordStrength.값);
  }
  ```

* 테스트 코드도 코드이기 때문에 유지보수 대상이다. 즉 테스트 메서드에서 발생하는 중복을 알맞게 제거하거나 의미가 잘 드러나게 코드를 수정할 필요가 있다.
* PasswordStrengthMeter 객체를 생성하는 코드의 중복을 없애 보자

  ```text
  public class PasswordStrengthMeterTest {
      private PasswordStrengthMeter meter = new PasswordStrengthMeter();
  		...
  }
  ```

* 없앨 수 있는 코드 중복이 하나 더 있다. 바로 암호 강도 특정 기능을 실행하고 이를 확인하는 코드이다. 이 코드의 형식은 다음과 같다.

  ```text
  PasswordStrength result = meter.meter(암호);
  assertStrength(result, PasswordStrength.값);
  ```

* 이런 부류의 중복은 메서드를 이용해서 제거할 수 있다.

  ```text
  private void assertStrength(String password, PasswordStrength expStr) {
      PasswordStrength result = meter.meter(password);
      assertEquals(expStr, result);
  }
  ```

* 리팩토링 결과 테스트 코드는 더욱 간단해졌다.

  ```text
  @Test
  void meetsAllCriteria_Then_Strong() {
      assertStrength("ab12!@AB", PasswordStrength.STRONG);
      assertStrength("abc1!Add", PasswordStrength.STRONG);
  }
  ```

테스트 코드의 중복을 무턱대고 제거하면 안 된다. 중복을 제거한 뒤에도 테스트 코드의 가독성이 떨어지지 않고 수정이 용이한 경우메나 중복을 제거해야 한다. 중복을 제거한 뒤에 오히려 테스트 코드 관리가 어려워진다면 제거했던 중복을 되돌려야 한다.

### 네 번째 테스트: 값이 없는 경우

* 아주 중요한 테스트를 놓친 것을 발견했다. 값이 없는 경우를 테스트하지 않은 것이다. 이런 예외 상황을 고려하지 않으면 우리가 만드는 소프트웨어는 비정상적으로 동작하게 된다. 예를 들어 meter\(\) 메서드에 null을 전달하면 NPE이 발생하게 된다.
* null을 입력할 경우 암호 강도 측정기는 어떻게 반응해야 할까?
  * IllegalArgumentException을 발생한다.
  * 유효하지 않은 암호를 의미하는 PasswordStrength.INVALID를 리턴한다.
* 테스트 코드를 먼저 추가하자

  ```text
  @Test
  void nullInput_Then_Invalid() {
      assertStrength(null, PasswordStrength.INVALID);
  }
  ```

* enum 코드도 추가하자

  ```text
  public enum PasswordStrength {
      INVALID, WEAK, NORMAL, STRONG
  }
  ```

* 테스트는 실패할 것이다. 테스트 케이스를 보완하기 위해 구현 로직을 수정하자

  ```text
  public PasswordStrength meter(String s) {
      if (s == null) return PasswordStrength.INVALID;
      if (s.length() < 8) {
          return PasswordStrength.NORMAL;
      }
      boolean containsNum = meetsContainingNumberCriteria(s);
      if (!containsNum) return PasswordStrength.NORMAL;
      return PasswordStrength.STRONG;
  }
  ```

* 예외 상황이 null만 있는 것은 아니다. 빈 문자열도 예외 상황이다. 빈 문자열에 대한 테스트도 추가한다.

  ```text
  @Test
  void emptyInput_Then_Invalid() {
      assertStrength("", PasswordStrength.INVALID);
  }
  ```

* PasswordStrengthMeter 클래스의 코드를 수정해 보자

  ```text
  public PasswordStrength meter(String s) {
          if (s == null || s.isEmpty()) return PasswordStrength.INVALID;
          if (s.length() < 8) {
              return PasswordStrength.NORMAL;
          }
          boolean containsNum = meetsContainingNumberCriteria(s);
          if (!containsNum) return PasswordStrength.NORMAL;
          return PasswordStrength.STRONG;
      }
  ```

* 지금까지 작성한 테스트가 모두 통과할 것이다.

### 다섯 번째 테스트: 대문자를 포함하지 않고 나머지 조건을 충족하는 경우

* 추가할 테스트는 대문자를 포함하지 않고 나머지 조건은 충족하는 경우이다. 먼저 테스트 코드를 추가하자

  ```text
  @Test
  void meetsOtherCriteria_except_for_Uppercase_Then_Normal() {
      assertStrength("ab12!@df", PasswordStrength.NORMAL);
  }
  ```

* 테스트를 실행하면 실패할 것이다. 구현 코드를 수정해 보자

  ```text
  public PasswordStrength meter(String s) {
      if (s == null || s.isEmpty()) return PasswordStrength.INVALID;
      boolean containsNum = meetsContainingNumberCriteria(s);
      if (!containsNum) return PasswordStrength.NORMAL;
      boolean containsUpp = meetsContainingUppercaseCriteria(s);
      if (!containsUpp) return PasswordStrength.NORMAL;
      return PasswordStrength.STRONG;
  }

  private boolean meetsContainingUppercaseCriteria(String s) {
      for (char ch : s.toCharArray()) {
          if (Character.isUpperCase(ch)) {
              return true;
          }
      }
      return false;
  }
  ```

### 여섯 번째 테스트: 길이가 8글자 이상인 조건만 충족하는 경우

* 이제 남은 것은 한 가지 조건만 충족하거나 모든 조건을 충족하지 않는 경우이다. 이 경우 암호 강도는 약함이다.

  ```text
  @Test
  void meetsOnlyLengthCriteria_Then_Weak() {
      assertStrength("abdefghi", PasswordStrength.WEAK);
  }
  ```

* PasswordStrength 타입에 WEAK 코드를 추가하자
* 테스트 결과를 보면 WEAK가 아니라 NORMAL이어서 테스트에 실패했음을 알 수 있다. 구현 코드를 수정해 보자

  ```text
  public PasswordStrength meter(String s) {
      if (s == null || s.isEmpty()) return PasswordStrength.INVALID;
      boolean lengthEnough = s.length() >= 8
      boolean containsNum = meetsContainingNumberCriteria(s);
      boolean containsUpp = meetsContainingUppercaseCriteria(s);

  		if (!lengthEnough) {
          return PasswordStrength.NORMAL;
      }
  		if (!containsNum) return PasswordStrength.NORMAL;
      if (!containsUpp) return PasswordStrength.NORMAL;
      return PasswordStrength.STRONG;
  }
  ```

* 다시 테스트를 실행해보자. 새로 추가한 테스트는 여전히 실패하나 기존에 작성한 테스트는 깨치지 않고 통과한다. 이제 새로 추가한 테스트도 통과시킬 차례이다.

  ```text
  public PasswordStrength meter(String s) {
      if (s == null || s.isEmpty()) return PasswordStrength.INVALID;
      boolean lengthEnough = s.length() >= 8
      boolean containsNum = meetsContainingNumberCriteria(s);
      boolean containsUpp = meetsContainingUppercaseCriteria(s);

  		if (lengthEnough && !containsNum && !containsUpp)
  				return PasswordStrength>WEAK;

  		if (!lengthEnough) {
          return PasswordStrength.NORMAL;
      }
  		if (!containsNum) return PasswordStrength.NORMAL;
      if (!containsUpp) return PasswordStrength.NORMAL;
      return PasswordStrength.STRONG;
  }
  ```

### 일곱 번째 테스트: 숫자 포함 조건만 충족하는 경우

* 다음 테스트는 숫자 포함 조건만 충족하는 경우이다.

  ```text
  @Test
  void meetsOnlyNumCriteria_Then_Weak() {
      assertStrength("12345", PasswordStrength.WEAK);
  }
  ```

* 새로 추가한 테스트가 실패한다. 이 테스트를 통과시키는 작업은 간단하다.

  ```text
  public PasswordStrength meter(String s) {
      if (s == null || s.isEmpty()) return PasswordStrength.INVALID;
      boolean lengthEnough = s.length() >= 8
      boolean containsNum = meetsContainingNumberCriteria(s);
      boolean containsUpp = meetsContainingUppercaseCriteria(s);

  		if (lengthEnough && !containsNum && !containsUpp)return PasswordStrength.WEAK;
  		if (!lengthEnough && containsNum && !containsUpp)return PasswordStrength.WEAK; // 추가된 코드

  		if (!lengthEnough) return PasswordStrength.NORMAL;
  		if (!containsNum) return PasswordStrength.NORMAL;
      if (!containsUpp) return PasswordStrength.NORMAL;
      return PasswordStrength.STRONG;
  }
  ```

* if 구문이 전반적으로 복잡해 보인다. 코드를 정리하고 싶지만, 아직 아이디어가 떠오르지 않는다. 일단 다음 테스트로 넘어가자.

### 여덞 번째 테스트: 대문자 포함 조건만 충족하는 경우

* 대문자 포함 조건만 충족하는 경우를 검증하는 테스트를 추가할 차례다.

  ```text
  @Test
  void meetsOnlyUpperCriteria_Then_Weak() {
      assertStrength("ABZEF", PasswordStrength.WEAK);
  }
  ```

* 테스트를 통과하기 위해 코드를 작성하자

  ```text
  public PasswordStrength meter(String s) {
      if (s == null || s.isEmpty()) return PasswordStrength.INVALID;
      boolean lengthEnough = s.length() >= 8
      boolean containsNum = meetsContainingNumberCriteria(s);
      boolean containsUpp = meetsContainingUppercaseCriteria(s);

  		if (lengthEnough && !containsNum && !containsUpp)return PasswordStrength.WEAK;
  		if (!lengthEnough && containsNum && !containsUpp)return PasswordStrength.WEAK;
  		if (!lengthEnough && !containsNum && containsUpp)return PasswordStrength.WEAK; // 추가된 코드

  		if (!lengthEnough) return PasswordStrength.NORMAL;
  		if (!containsNum) return PasswordStrength.NORMAL;
      if (!containsUpp) return PasswordStrength.NORMAL;
      return PasswordStrength.STRONG;
  }
  ```

* 모든 테스트가 통과하였다.

### 코드 정리: meter\(\) 메서드 리팩토링

* 이제 코드를 정리해보자. meter\(\) 메서드의 if 구문이 가독성이 그리 좋아 보이진 않는다.

  ```text
  if (lengthEnough && !containsNum && !containsUpp)return PasswordStrength.WEAK;
  if (!lengthEnough && containsNum && !containsUpp)return PasswordStrength.WEAK;
  if (!lengthEnough && !containsNum && containsUpp)return PasswordStrength.WEAK;
  ```

* 이 코드는 세 조건 중에서 한 조건만 충족하는 경우 암호 강도가 약하다는 것을 구현한 것이다. if 절은 세 조건 중에서 한 조건만 충족한다는 것을 확인하는 것이다. 그렇다면 다음과 같이 충족하는 조건 개수를 사용하면 어떨까?

  ```text
  public PasswordStrength meter(String s) {
      if (s == null || s.isEmpty()) return PasswordStrength.INVALID;
  		int metCounts = 0;
      boolean lengthEnough = s.length() >= 8
  		if(lengthEnough) metCounts++;
      boolean containsNum = meetsContainingNumberCriteria(s);
  		if(containsNum) metCounts++;
      boolean containsUpp = meetsContainingUppercaseCriteria(s);
  		if(containsUpp) metCounts++;

  		if (metCounts == 1)return PasswordStrength.WEAK; // 이전의 if 구문을 하나로 제거하였다. 

  		if (!lengthEnough) return PasswordStrength.NORMAL;
  		if (!containsNum) return PasswordStrength.NORMAL;
      if (!containsUpp) return PasswordStrength.NORMAL;
      return PasswordStrength.STRONG;
  }
  ```

* 다음 코드는 어떻게 리팩토링할 수 있을까?

  ```text
  if (!lengthEnough) return PasswordStrength.NORMAL;
  if (!containsNum) return PasswordStrength.NORMAL;
  if (!containsUpp) return PasswordStrength.NORMAL;
  ```

* 코드의 의도는 충족하는 조건이 두 개인 경우 암호 강도가 보통이라는 규칙을 표현한 것이다. 즉, 위 코드를 다음과 같이 변경할 수 있다.

  ```text
  public PasswordStrength meter(String s) {
      if (s == null || s.isEmpty()) return PasswordStrength.INVALID;
  		int metCounts = 0;
      boolean lengthEnough = s.length() >= 8
  		if(lengthEnough) metCounts++;
      boolean containsNum = meetsContainingNumberCriteria(s);
  		if(containsNum) metCounts++;
      boolean containsUpp = meetsContainingUppercaseCriteria(s);
  		if(containsUpp) metCounts++;

  		if (metCounts == 1)return PasswordStrength.WEAK;
  		if (metCounts == 2)return PasswordStrength.NORMAL; // 이전의 if 구문을 하나로 제거하였다. 

      return PasswordStrength.STRONG;
  }
  ```

* 이는 조금 더 리팩토링 할 수 있을것 같다.

  ```text
  public PasswordStrength meter(String s) {
      if (s == null || s.isEmpty()) return PasswordStrength.INVALID;
  		int metCounts = 0;
  		if(s.length() >= 8) metCounts++;
  		if(meetsContainingNumberCriteria(s)) metCounts++;
  		if(meetsContainingUppercaseCriteria(s)) metCounts++;

  		if (metCounts == 1)return PasswordStrength.WEAK;
  		if (metCounts == 2)return PasswordStrength.NORMAL; // 이전의 if 구문을 하나로 제거하였다. 

      return PasswordStrength.STRONG;
  }
  ```

* 코드를 수정했으니 다시 테스트를 실행한다. 모든 테스트가 통과한다.

### 아홉 번째 테스트: 아무 조건도 충족하지 않은 경우

* 아직 테스트하지 않은 상황이 있다. 바로 아무 조건도 충족하지 않는 암호이다.

  ```text
  @Test
  void meetsNoCriteria_Then_Weak() {
      assertStrength("abc", PasswordStrength.WEAK);
  }
  ```

* 테스트를 실행해보면 테스트에 실패할 것이다. 이 테스트를 통과시키려면 다음 중 한 가지 방법을 사용하면 된다.

  * 충족 개수가 1개 이하인 경우 WEAK를 리턴하도록 수정
  * 충족 개수가 0개인 경우 WEAK를 리턴하는 코드 수정
  * 충족 개수가 3개인 경우 STRONG을 리턴하는 코드를 추가하고 마지막에 WEAK를 리턴하도록 코드 수정

  ```text
  public PasswordStrength meter(String s) {
      if (s == null || s.isEmpty()) return PasswordStrength.INVALID;
  		int metCounts = 0;
  		if(s.length() >= 8) metCounts++;
  		if(meetsContainingNumberCriteria(s)) metCounts++;
  		if(meetsContainingUppercaseCriteria(s)) metCounts++;

  		if (metCounts <= 1)return PasswordStrength.WEAK;
  		if (metCounts == 2)return PasswordStrength.NORMAL; // 이전의 if 구문을 하나로 제거하였다. 

      return PasswordStrength.STRONG;
  }
  ```

* 지금까지 새로운 테스트를 추가하거나 기존 코드를 수정하면 습관처럼 테스트를 실행했다. 그리고 실패한 테스트가 있다면 그 테스트를 통과시키기 위한 코드를 추가했다. 테스트를 실행하는 것이 어색하지 않을 때까지 반복하자

### 코드 정리: 코드 가독성 개선

* metCounts 변수를 계산하는 부분을 수정해보자

  ```text
  public PasswordStrength meter(String s) {
      if (s == null || s.isEmpty()) return PasswordStrength.INVALID;
  		int metCounts = getMetCriteriaCounts(s);
  		if (metCounts <= 1)return PasswordStrength.WEAK;
  		if (metCounts == 2)return PasswordStrength.NORMAL; // 이전의 if 구문을 하나로 제거하였다. 

      return PasswordStrength.STRONG;
  }

  private int getMetCriteriaCounts(String s) {
      int metCounts = 0;
      if (s.length() >= 8) metCounts++;
      if (meetsContainingNumberCriteria(s)) metCounts++;
      if (meetsContainingUppercaseCriteria(s)) metCounts++;
      return metCounts;
  }
  ```

* meter\(\) 메서드의 가독성이 좋아졌다. meter\(\) 메서드를 처음보는 개발자도 다음과 같이 코드를 읽을 수 있다.
  * 암호가 null이거나 빈 문자열이면 암호 강도는 INVALID이다
  * 충족하는 규칙 개수를 구한다
  * 충족하는 규칙 개수가 1개 이하면 암호 강도는 WEAK이다
  * 충족하는 규칙 개수가 2개면 암호 강도는 NORMAL이다
  * 이 외 경우\(즉 충족하는 규칙 개수가 2개보다 크면\) 암호 강도는 STRONG이다.

### 테스트에서 메인으로 코드 이동

* 아직 한 가지가 남았다.
* [PasswordStrength.java](http://passwordstrength.java) 파일과 [PasswordStrength](http://passwordstrength.java)Meter.java 파일은 src/test/java 소스 폴더에 위치한다.
* 해당 폴더 경로는 배포 대상이 아니므로 이 두 소스 파일을 src/main/java로 이동해야 비로서 구현이 끝난다.

## TDD 흐름

* TDD는 기능을 검증하는 테스트를 먼저 작성한다.
* 작성한 테스트를 통과하지 못하면 테스트를 통과할 만큼만 코드를 작성한다.
* 테스트를 통과한 뒤에는 개선할 코드가 있으면 리팩토링 한다.
* 리팩토링을 수행한 뒤에는 다시 테스트를 실행해서 기존 기능이 망가지지 않았는지 확인한다.
* 이 과정을 반복하면서 점진적으로 기능을 완성해 나가는 것이 전형적인 TDD의 흐름이다.

레드 - 그린 - 리팩터

TDD 사이클은 레드\(Red\) - 그린\(Green\) - 리팩터\(Refactor\)로 부르기도 한다. 여기서 레드는 실패하는 테스트를 의미한다. 레드는 테스트 코드가 실패하면 빨간색을 이용해서 실패한 테스트를 보여주는 데서 비롯했다. 비슷하게 그린은 성공한 테스트를 의미한다. 즉 코드를 구현해서 실패하는 테스트를 통과시키는 것을 뜻한다. 마지막으로 리팩터는 이름 그대로 리팩토링 과정을 의미한다.

## 테스트가 개발을 주도

* 테스트 코드를 먼저 작성하면 테스트가 개발을 주도하게 된다.
* 테스트를 작성하는 과정에서 구현을 생각하지 않았다.
* 단지 해당 기능이 올바르게 동작하는지 검증할 수 있는 테스트 코드를 만들었을 뿐이다.
* 테스트를 추가한 뒤에는 테스트를 통과시킬 만큼 기능을 구현했다.
* 아직 추가하지 않은 테스트를 고려해서 구현하지 않았다.
* 테스트 코드를 만들면 다음 개발 범위가 정해진다.
* 테스트 코드가 추가되면서 검증하는 범위가 넓어질수록 구현도 점점 완성되어 간다.

## 지속적인 코드 정리

* 구현을 완료한 뒤에는 리팩토링을 진행했다.
* 당장 리팩토링할 대상이나 어떻게 리팩토링해야 할지 생각나지 않으면 다음 테스트를 진행했다.
* 테스트 코드 자체도 리팩토링 대상에 넣었다.
* 당장 리팩토링을 하지 않더라도 테스트 코드가 있으면 리팩토링을 보다 과감하게 진행할 수 있다.
* 잘 동작하는 코드를 수정하는 것은 심리적으로 불안감을 주기 때문에 코드 수정을 꺼리게 만든다.
* 하지만 해당 기능이 온전하게 동작한다는 것을 검증해주는 테스트가 있으면 코드 수정에 대한 심리적 불안감을 줄여준다.
* TDD는 개발 과정에서 지속적으로 코드 정리를 하므로 코드 품질이 급격히 나빠지지 않게 막아주는 효과가 있다.

## 빠른 피드백

* TDD가 주는 이점은 코드 수정에 대한 피드백이 빠르다.
* 새로운 코드를 추가하거나 기존 코드를 수정하면 테스트를 돌려서 해당 코드가 올바른지 바로 확인할 수 있다.
* 이는 잘못된 코드가 배포되는 것을 방지한다.

