---
description: Effective Java 3e 아이템 35를 요약한 내용 입니다.
---

# 아이템35 ordinal 메서드 대신 인스턴스 필드를 사용하라

다음 코드는 합주단의 종류를 연주자가 1명인 솔로\(solo\)부터 10명인 디텍트\(detect\)까지 정의한 열거 타입이다.

```text
public enum Ensemble {
	SOLO, DUET, TRIO, QUARTET, QUINTET,
	SEXTET, SEPTET, OCTET, NONET, DECTET;

	public int numberOfMusicians() { return ordinal() + 1; }
}
```

동작은 하지만 유지보수하기가 끔찍한 코드다. 상수 선언 순서를 바꾸는 순간 numberOfMusicians가 오동작하며, 이미 사용 중인 정수와 값이 같은 상수는 추가할 방법이 없다.

#### 해결책은 간단하다.

열거 타입 상수에 연결된 값은 ordinal 메서드로 얻지 말고, 인스턴스 필드에 저장하자.

```text
public enum Ensemble {
	SOLO(1), DUET(2), TRIO(3), QUARTET(4), QUINTET(5),
	SEXTET(6), SEPTET(7), OCTET(8), NONET(9), DECTET(10);

	private final int numberOfMusicians;
	Ensemble(int size) { this.numberOfMusicians = size; }
	public int numberOfMusicians() { return numberOfMusicians; }
}
```

Enum의 API 문서를 보면 ordinal에 대해 이렇게 쓰여 있다.

> 이 메서드는 EnumSet과 EnumMap 같이 열거 타입 기반의 범용 자료 구조에 쓸 목적으로 설계되었다.

