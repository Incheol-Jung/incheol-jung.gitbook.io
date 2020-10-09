---
description: 테스트 주도 개발 시작하기 6장을 요약한 내용입니다.
---

# CHAP 06. 테스트 코드의 구성

## 기능에서의 상황

기능은 주어진 상황에 따라 다르게 동작한다. 예를 들어 다음 기능을 보자

* 파일에서 숫자를 읽어와 숫자의 합을 구한다.
* 한 줄마다 한 개의 숫자를 포함한다.

#### 이 기능을 구현하려면 고려할 것이 있다.

* 파일이 없는 상황을 처리해야 한다.
* 데이터를 읽을 파일이 없다면 인자가 잘못되었다는 익셉션을 발생한다.
* 문제 상황을 알려줄 수 있는 값을 리턴해야 한다.
* 숫자가 아닌 잘못된 데이터가 존재하는 경우에도 알맞은 결과를 생성해야 한다.

## 테스트 코드의 구성 요소 : 상황, 실행, 결과 확인

테스트 코드는 기능을 실행하고 그 결과를 확인하므로 상황, 실행, 결과 확인의 세 가지 요소로 테스트를 구성할 수 있다. 어떤 상황이 주어지고, 그 상황에서 기능을 실행하고, 실행한 결과를 확인하는 세 가지가 테스트 코드의 기본 골격을 이루게 된다.

> 상황, 실행, 결과 확인은 영어 표현 given, when, then에 대응한다.

하지만 이 기본 골격은 메 테스트 경우마다 매번 존재하는것은 아니다.

#### 상황이 없는 경우도 존재한다.

```text
@Test
void meetsAllCriteria_Then_Strong() {
    assertStrength("ab12!@AB", PasswordStrength.STRONG);
    assertStrength("abc1!Add", PasswordStrength.STRONG);
}
```

암호 강도측정의 경우 결과에 영향을 주는 상황이 존재하지 않으므로 테스트는 다음처럼 기능을 실행하고 결과를 확인하는 코드만 포함하고 있다.

#### 결과값이 항상 존재하는 것은 아니다.

```text
@Test
void getnGame_With_DupNumber_Then_File() {
		assertThrows(IllegalArgumentException.class, () -> new BaseballGame("100"));
}
```

실행 결과로 익셉션을 발생하는 것이 정상인 경우도 있다.

{% hint style="info" %}
상황-실행-결과 확인 구조에 너무 집착하지는 말자. 이 구조가 테스트 코드를 작성하는데 도움이 되는 것은 맞지만 꼭 모든 테스트 메서드를 이 구조로 만들어야 하는 것은 아니다. 테스트 코드를 보고 테스트 내용을 이해할 수 있으면 된다.
{% endhint %}

## 외부 상황과 외부 결과

상황 설정이 테스트 대상으로 국한된 것은 아니다. 상황에는 외부 요인도 있다. 이전의 MathUtils.sum\(\) 메서드의 코드를 다시 보자. MathUtils.sum\(\) 메서드를 테스트하려면 파일이 존재하지 않는 상황에서의 결과도 확인해야 한다. 테스트 코드 작성 시점에 특정 임의의 경로를 설정해서 테스트를 실행하면 현재는 테스트가 완료되겠지만 이 방법은 매번 성공할 것이라는 보장은 없다. 우연이라도 해당 파일이 존재할 수 있기 때문이다. 더욱 확실한 방법은 명시적으로 파일이 없는 상황을 만드는 것이다.

```text
@Test
void noDataFile_Then_Exception() {
    givenNoFile("badpath.txt");

    File dataFile = new File("badpath.txt");
    assertThrows(IllegalArgumentException.class,
            () -> MathUtils.sum(dataFile)
    );
}

private void givenNoFile(String path) {
    File file = new File(path);
    if (file.exists()) {
        boolean deleted = file.delete();
        if (!deleted)
            throw new RuntimeException("fail givenNoFile: " + path);
    }
}
```

givenNoFile\(\) 메서드는 해당 경로에 파일이 존재하는지 검사해서 존재할 경우 해당 파일을 삭제한다. 또는 파일을 항상 읽어야 한다고 한다면 테스트 코드에서 상황에 맞는 파일을 생성하는 방법도 있다.

```text
@Test
void dataFileSumTest2() {
    givenDataFile("target/datafile.txt", "1", "2", "3", "4");
    File dataFile = new File("src/test/resources/datafile.txt");
    long sum = MathUtils.sum(dataFile);
    assertEquals(10L, sum);
}

private void givenDataFile(String path, String... lines) {
    try {
        Path dataPath = Paths.get(path);
        if (Files.exists(dataPath)) {
            Files.delete(dataPath);
        }
        Files.write(dataPath, Arrays.asList(lines));
    } catch (IOException e) {
        throw new RuntimeException(e);
    }
}
```

## 외부 상태가 테스트 결과에 영향을 주지 않게 하기

테스트 코드는 한 번만 실행하고 끝나지 않는다. TDD를 진행하는 동안에도 계속 실행하고 개발이 끝난 이후에도 반복적으로 테스트를 실행해서 문제가 없는지 검증한다. 그렇기 때문에 테스트는 언제 실행해도 항상 정상적으로 동작하는 것이 중요하다. 외부 상태에 따라 테스트의 성공 여부가 바뀌지 않으려면 테스트 실행 전에 외부를 원하는 상태로 만들거나 테스트 실행 후에 외부 상태를 원래대로 되돌려 놓아야 한다.

## 외부 상태와 테스트 어려움

상황과 결과에 영향을 주는 외부 요인은 파일, DBMS, 외부 서버 등 다양하다. 이들 외부 환경을 테스트에 맞게 구성하는 것이 항상 가능한 것은 아니다.

### 자동이체 등록 기능을 생각해보자

이 기능은 입력 받은 계좌 번호가 올바른지 확인해야 한다. 이를 위해 금융 회사에서 제공하는 REST API를 사용한다면 다음상황에서의 결과를 확인할 수 있어야 한다.

* REST API 응답 결과가 유효한 계좌 번호인 상황
* REST API 응답 결과가 유효하지 않은 계좌 번호인 상황
* REST API 서버에 연결할 수 없는 상황
* REST API 서버에서 응답을 5초 이내에 받지 못하는 상황

#### 실행 결과가 외부 시스템에 기록되는 경우도 있다

외부 택배사에 배송 정보를 전달하기 위해 택배사가 제공한 DB 테이블을 사용한 사례가 있다. 주문이 들어오면 택배사가 제공한 DB 테이블에 필요한 데이터를 추가하는 방식으로 배송 정보를 전달했다. 동일한 테스트를 여러 번 수행할 수 있으려면 택배사가 제공한 DB 테이블에서 데이터를 삭제할 수 있어야 했는데 택배사는 해당 테이블에 대해 INSERT와 SELECT 권한만 주고 DELETE 권한은 주지 않았다.

#### 이처럼 테스트 대상이 아닌 외부 요인은 테스트 코드에서 다루기 힘든 존재이다

테스트 대상의 상황과 결과에 외부 요인이 관여할 경우 대역을 사용하면 테스트 작성이 쉬워진다. 대역은 테스트 대상이 의존하는 대상의 실제 구현을 대신하는 구현인데 이 대역을 통해서 외부 상황이나 결과를 대체할 수 있다. 대역에는 다양한 종류가 존재하는데 이에 관한 내용은 이어지는 7장에서 살펴본다.

