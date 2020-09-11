---
description: Java 에서 발생하는 예외에 대해서 알아보고 해결 방법에 대해 알아보자
---

# 예외

## 예외 클래스 구조

![](../../.gitbook/assets/untitled%20%281%29.png)

### Throwable 클래스

* 모든 예외 클래스는 Throwable을 상속 받아 구현되어 있다.
* Throwable 클래스는 직접 사용하는 경우는 거의 없다.
* Throwable 타입과 이 클래스를 상속받은 서브 타입만이 자바 가상 머신이나 throw 키워드에 의해 예외가 발생할 수 있다.

### Error vs Exception

* Error는 JVM에서 발생하는 에러로 개발자가 대응할 수 없으며 시스템 레벨에서 처리가 가능하다.
* Exception은 개발자가 구현한 로직에서 발생하며 예외 처리에 대한 다양한 전략이 존재한다.

## Checked vs unChecked

Exception의 자식 클래스 중 **RuntimeException을 제외한 모든 클래스는 CheckedException**이며, RuntimeException과 그의 자식 클래스들을 Unchecked Exception이라 부른다.

### Checked Exception

* 예외처리 필수
* 컴파일 타임에서 예외처리 되지 않을 경우 컴파일 오류 발생
* JVM 외부와 통신\(네트워크, 파일시스템 등\) 관련 기능에서 예외 발생

### UnChecked Exception

* 예외처리를 컴파일 단계에서 확인하지 않는다.
* 실행 중에 발생하는 에러로 Runtime Exception이라 명명한다.

#### Exception 비교 

<table>
  <thead>
    <tr>
      <th style="text-align:left">&#xAD6C;&#xBD84;</th>
      <th style="text-align:left">Checked Exception</th>
      <th style="text-align:left">UnChecked Exception</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td style="text-align:left">&#xD655;&#xC778; &#xC2DC;&#xC810;</td>
      <td style="text-align:left">&#xCEF4;&#xD30C;&#xC77C;(Compile) &#xC2DC;&#xC810;</td>
      <td style="text-align:left">&#xB7F0;&#xD0C0;&#xC784;(Runtime) &#xC2DC;&#xC810;</td>
    </tr>
    <tr>
      <td style="text-align:left">&#xCC98;&#xB9AC; &#xC5EC;&#xBD80;</td>
      <td style="text-align:left">&#xBC18;&#xB4DC;&#xC2DC; &#xC608;&#xC678; &#xCC98;&#xB9AC;&#xD574;&#xC57C;
        &#xD55C;&#xB2E4;</td>
      <td style="text-align:left">&#xBA85;&#xC2DC;&#xC801;&#xC73C;&#xB85C; &#xD558;&#xC9C0; &#xC54A;&#xC544;&#xB3C4;
        &#xB41C;&#xB2E4;</td>
    </tr>
    <tr>
      <td style="text-align:left">&#xD2B8;&#xB79C;&#xC7AD;&#xC158; &#xCC98;&#xB9AC;</td>
      <td style="text-align:left">&#xC608;&#xC678; &#xBC1C;&#xC0DD;&#xC2DC; &#xB864;&#xBC31;(rollback)&#xB418;&#xC9C0;
        &#xC54A;&#xB294;&#xB2E4;</td>
      <td style="text-align:left">&#xC608;&#xC678; &#xBC1C;&#xC0DD;&#xC2DC; &#xB864;&#xBC31;(rollback)&#xD574;&#xC57C;
        &#xD55C;&#xB2E4;</td>
    </tr>
    <tr>
      <td style="text-align:left">&#xC885;&#xB958;</td>
      <td style="text-align:left">
        <ul>
          <li>IOException</li>
          <li>ClassNotFoundException</li>
        </ul>
      </td>
      <td style="text-align:left">
        <ul>
          <li>NullPointerException</li>
          <li>ClassCastException</li>
        </ul>
      </td>
    </tr>
  </tbody>
</table>

## 예외처리 방법

### 예외 복구

try, catch, finally 블록을 통해 예외가 발생할 경우 대처한다.

```java
int maxretry = MAX_RETRY;
while(maxretry -- > 0) {
    try {
        // 예외가 발생할 가능성이 있는 시도
        return; // 작업성공시 리턴
    }
    catch (SomeException e) {
        // 로그 출력. 정해진 시간만큼 대기
    }
    finally {
        // 리소스 반납 및 정리 작업
    }
}
throw new RetryFailedException(); // 최대 재시도 횟수를 넘기면 직접 예외 발생
```

### 예외 처리 회피

throws 하여 예외 처리를 상위에 위임한다.

```java
public void add() throws SQLException {
    ... // 구현 로직
}
```

### 예외 전환

예외가 발생하면 catch 블록 안에서 내부 규정에 통용되는 예외로 전환한다.

```java
catch(SQLException e) {
   ...
   throw DuplicateUserIdException();
}
```

## 참고

* [https://sjh836.tistory.com/122](https://sjh836.tistory.com/122)
* [https://codedragon.tistory.com/4447](https://codedragon.tistory.com/4447)
* [https://mobssiie.tistory.com/entry/java-예외-Exception-처리](https://mobssiie.tistory.com/entry/java-%EC%98%88%EC%99%B8-Exception-%EC%B2%98%EB%A6%AC)
* [https://nesoy.github.io/articles/2018-05/Java-Exception](https://nesoy.github.io/articles/2018-05/Java-Exception)

