---
description: Effective Java 3e 아이템 37를 요약한 내용 입니다.
---

# 아이템37 ordinal 인덱싱 대신 EnumMap을 사용하라

식물을 간단히 나타낸 다음 클래스를 예로 살펴보자.

```text
class Plant {
    enum LifeCycle { ANNUAL, PERENNIAL, BIENNIAL }
    final String name;
    final LifeCycle lifeCycle;
    Plant(String name, LifeCycle lifeCycle) {
        this.name = name;
        this.lifeCycle = lifeCycle;
    }
    @Override public String toString() {
        return name;
    }
}
```

이때 어떤 프로그래머는 집합들을 배열 하나에 넣고 생애주기의 ordinal 값을 그 배열의 인덱스로 사용하려 할 것이다.

```text
// 잘못된 예시!!
Set<Plant>[] plantsByLifeCycle = (Set<Plant>[])new Set[Plant.LifeCycle.values().length];
for (int i = 0; i < plantsByLifeCycle.length; i++) {
    plantsByLifeCycle[i] = new HashSet<>();
}
for (Plant p : garden) {
    plantsByLifeCycle[p.lifeCycle.ordinal()].add(p);
}
// 결과 출력
for (int i = 0; i < plantsByLifeCycle.length; i++) {
    System.out.printf("%s: %s%n", Plant.LifeCycle.values()[i], plantsByLifeCycle[i]);
}
```

