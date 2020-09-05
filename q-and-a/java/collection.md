---
description: Collection의 하위 타입의 각각의 특성에 대해 살펴보자
---

# Collection

![https://medium.com/@logishudson0218/java-collection-framework-896a6496b14a](../../.gitbook/assets/1_yxafphpixmgrsm42d0ax6q.png)

## 배열과 컬렉션

```java
// 정적 배열
int[] intArr = new int[10];

// 컬렉션
List<Integer> list = new ArrayList<>();
```

### 정적 배열의 단점

* 배열의 크기가 생성할 때 결정되어야 한다.
* 초기에 지정한 배열의 크기는 사용하지 않더라도 할당되어 있고 그 크기가 넘어가면 저장이 불가능하다
* 데이터를 삭제하면 해당 인덱스의 데이터는 비어 있지만 메모리는 할당되어 있다.

### 컬렉션의 장점

* 컬렉션의 사이즈는 데이터가 저장된 만큼 동적으로 할당된다.
* 중간에 데이터가 삭제되면 할당된 메모리를 제거할 수 있다.

## List 인터페이스

**List를 구현하는 클래스들은 인덱스 순서에 따라 데이터가 저장되고 데이터의 중복 저장이 가능**하다.

* **LinkedList**- 양방향 포인터 구조로 데이터의 삽입, 삭제가 빈번할 경우 데이터의 위치정보만 수정하면 되기에 유용- 스택, 큐, 양방향 큐 등을 만들기 위한 용도로 쓰임
* **Vector**- 과거에 대용량 처리를 위해 사용했으며, 내부에서 자동으로 동기화처리가 일어나 비교적 성능이 좋지 않고 무거워 잘 쓰이지 않음
* **ArrayList**- 단방향 포인터 구조로 각 데이터에 대한 인덱스를 가지고 있어 조회 기능에 성능이 뛰어남

## Set 인터페이스

**Set을 구현하는 클래스들은 순서를 유지하지 않고 데이터를 저장하며 중복된 데이터의 저장이 불가능하다**.

* **HashSet**- 가장빠른 임의 접근 속도- 순서를 예측할 수 없음
* **TreeSet**- 정렬방법을 지정할 수 있음

## Map 인터페이스

**Map을 구현하는 클래스들은 키\(key\)와 값\(value\)을 동시에 저장**한다.\(즉, 키\(key\)를 통해 값을 불러온다.\) 이때 **키는 중복 저장이 불가능**하다.

* **Hashtable**- HashMap보다는 느리지만 동기화 지원- null불가
* **HashMap**- 중복과 순서가 허용되지 않으며 null값이 올 수 있다.
* **TreeMap**- 정렬된 순서대로 키\(Key\)와 값\(Value\)을 저장하여 검색이 빠르다

## 참고

* [https://medium.com/@logishudson0218/java-collection-framework-896a6496b14a](https://medium.com/@logishudson0218/java-collection-framework-896a6496b14a)
* [https://12bme.tistory.com/91](https://12bme.tistory.com/91)
* [https://jinbroing.tistory.com/230](https://jinbroing.tistory.com/230)
* [https://developsd.tistory.com/31](https://developsd.tistory.com/31)

