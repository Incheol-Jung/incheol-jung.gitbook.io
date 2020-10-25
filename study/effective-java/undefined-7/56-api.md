---
description: Effective Java 3e 아이템 56를 요약한 내용 입니다.
---

# 아이템56 공개된 API 요소에는 항상 문서화 주석을 작성하라

자바독은 소스코드 파일에서 문서화 주석이라는 특수한 형태로 기술된 설명을 추려 API 문서로 변환해준다.

자바 버전에 따라 자바독 태그도 발전해왔다.

* **자바 5 → @literal, @code**
* **자바 6 → @implSpec**
* **자바 9 → @index**

API를 올바로 문서화하려면 공개된 모든 `클래스`, `인터페이스`, `메서드`, `필드` 선언에 문서화 주석을 달아야 한다. 직렬화할 수 있는 클래스라면 직렬화 형태에 관해서도 적어야 한다.

```java
...
 * {@code AbstractQueuedLongSynchronizer}.
 *
 * <p>This class is Serializable, but all fields are transient,
 * so deserialized conditions have no waiters.
 *
 * @since 1.6
 */
public class ConditionObject implements Condition, java.io.Serializable {
```

기본 생성자에는 문서화 주석을 달 방법이 없으니 공개 클래스는 절대 기본 생성자를 사용하면 안된다.

```java
public class Person(){
	...

	public Person(String name, int age){
		this.name = name;
		this.age = age;
	}
}
```

메서드용 문서화 주석에는 해당 메서드와 클라이언트 사이의 규약을 명료하게 기술해야 한다.

* `how`가 아닌 `what`을 기술해야 한다.
* 전제조건\(`precondition`\)을 모두 나열해야 한다.
* 메서드가 성공적으로 수행된 후에 만족해야 하는 사후조건도 모두 나열해야 한다.
* 전제조건은 `@throws` 태그로 비검사 예외를 선언하여 암시적으로 기술한다.
* `@param` 태그를 이용해 그 조건에 영향 받는 매개변수에 기술해야 한다.

관례상 `@param` 태그와 `@return` 태그의 설명은 해당 매개변수가 뜻하는 값이나 반환값을 설명하는 명사구를 쓴다. 드물게는 명사구 대신 산술 표현식을 쓰기도 한다. `BigInteger`의 `API` 문서를 참고해보면 된다.

```java
/**
 * Returns a BigInteger whose value is {@code (this * val)}.
 *
 * @implNote An implementation may offer better algorithmic
 * performance when {@code val == this}.
 *
 * @param  val value to be multiplied by this BigInteger.
 * @return {@code this * val}
 */
public BigInteger multiply(BigInteger val) {
    return multiply(val, false);
}
```

`@throws` 절에 사용한 `{@code}` 태그는 두 가지 효과를 가진다.

1. 태그로 감싼 내용을 `코드용 폰트`로 렌더링한다.
2. 태그로 감싼 내용에 포함된 HTML 요소나 다른 자바독 `태그`를 `무시`한다.

클래스를 상속용으로 설계할 때는 자기사용 패턴\(`self-use patten`\)에 대해서도 문서에 남겨 다른 프로그래머에게 그 메서드를 올바로 재정의하는 방법을 알려줘야 한다. 자기사용 패턴은 자바 8에 추가된 @implSpec 태그로 문서화한다.

```text

```

`@implSpec` 주석은 해당 메서드와 하위 클래스 사이의 계약을 설명하여, 하위 클래스들이 그 메서드를 상속하거나 `super` 키워드를 이용해 호출할 때 그 메서드가 어떻게 동작 하는지를 명확히 인지하고 사용하도록 해줘야 한다.

```java
/**
 * Returns a sequential {@code Stream} with this collection as its source.
 *
 * <p>This method should be overridden when the {@link #spliterator()}
 * method cannot return a spliterator that is {@code IMMUTABLE},
 * {@code CONCURRENT}, or <em>late-binding</em>. (See {@link #spliterator()}
 * for details.)
 *
 * @implSpec
 * The default implementation creates a sequential {@code Stream} from the
 * collection's {@code Spliterator}.
 *
 * @return a sequential {@code Stream} over the elements in this collection
 * @since 1.8
 */
default Stream<E> stream() {
    return StreamSupport.stream(spliterator(), false);
}
```

API 설명에 `HTML` 메타문자를 포함시키려면 `@literal` 태그로 감싸면 된다. `**@code` 태그와 비슷하지만 코드 폰트로 렌더링하지는 않는다.\*\*

```java
/**
 * A suspect, such as Colonel Mustard or {@literal Mrs. Peacock}.
 */
public class Suspect { ... }
```

자바 10부터는 {@summary}라는 요약 설명 전용 태그가 추가되어, 한결 깔끔하게 처리할 수 있다.

```java
/**
 *{@summary A suspect, such as Colonel Mustard or @literal Mrs. Peacock.}
 */
public class Suspect { ... }
```

메서드와 생성자의 요약 설명은 해당 메서드와 생성자의 동작을 설명하는 \(주어가 없는\) `동사구`여야 한다.

```java
/**
 * Constructs an empty list with the specified initial capacity.
 *
 * @param  initialCapacity  the initial capacity of the list
 * @throws IllegalArgumentException if the specified initial capacity
 *         is negative
 */
public ArrayList(int initialCapacity) {
    if (initialCapacity > 0) {
        this.elementData = new Object[initialCapacity];
    } else if (initialCapacity == 0) {
        this.elementData = EMPTY_ELEMENTDATA;
    } else {
        throw new IllegalArgumentException("Illegal Capacity: "+
                                           initialCapacity);
    }
}
```

클래스, 인터페이스, 필드의 요약 설명은 대상을 설명하는 `명사절`이어야 한다.

```java
/**
 * The {@code double} value that is closer than any other to
 * <i>pi</i>, the ratio of the circumference of a circle to its
 * diameter.
 */
public static final double PI = 3.14159265358979323846;
```

자바 9부터는 자바독이 생성한 HTML 문서에 검색\(`색인`\) 기능이 추가되어 광대한 API 문서들을 한결 수월해졌다.

```text
* This method complies with the {@index IEEE 754} standard.
```

제네릭 타입이나 제네릭 메서드를 문서화할 때는 모든 타입 `매개변수`에 주석을 달아야 한다.

```java
* @param <K> the type of keys maintained by this map
 * @param <V> the type of mapped values
 *
 * @author  Josh Bloch
 * @see HashMap
 * @see TreeMap
 * @see Hashtable
 * @see SortedMap
 * @see Collection
 * @see Set
 * @since 1.2
 */
public interface Map<K, V> { ... }
```

`열거 타입`을 문서화할 때는 `상수`들에도 주석을 달아야 한다.

애너테이션 타입을 문서화할 때는 멤버들에도 모두 주석을 달아야 한다.

```java
/**
 * An instrument section of a symphony orchestra.
 */
public enum OrchestraSection {
	/** Woodwinds, such as flute, clarinet, and oboe. */
	WOODWIND,

	/** Brass instruments, such as french horn and trumpet */
	BRASS,

	/** Percussion instruments, such as timpani and cymbals. */
	PERCUSSION
}
```

API 문서화에서 자주 누락되는 설명이 두 가지 있으니, 바로 `스레드 안전성`과 `직렬화 가능성`이다. 클래스 혹은 정적 메서드가 스레드 안전하든 그렇지 않든, 스레드 안전 수준을 반드시 API 설명에 포함해야 한다.

자바독은 메서드 주석을 '상속'시킬 수 있다. 또한 {`@InhertitDocs`} 태그를 사용해 상위 타입의 문서화 주석을 재사용할 수 있다는 뜻이다.

```java
public abstract class AbstractMemberBuilder extends AbstractBuilder {
	/**
	 * Returns true if this subbuilder has anything to document.
	 *
	 * @return true if this subbuilder has anything to document
	 */
	public abstract boolean hasMembersToDocument();
	...
}
```

```java
public class MethodBuilder extends AbstractMemberBuilder {

	/**
	 * {@inheritDoc}
	 */
	@Override
	public boolean hasMembersToDocument() {
	    return !methods.isEmpty();
	}
}
```

