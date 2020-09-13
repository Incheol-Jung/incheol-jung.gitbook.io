---
description: 'String, StringBuffer, StringBuilder 차이를 알아보자'
---

# String, StringBuffer, StringBuilder

![](../../.gitbook/assets/1%20%2816%29.png)

## String

* String은 Heap 메모리가 아닌 String 상수풀에 저장된다.
* String 상수풀은 Java 8 이전에는 Permgen 영역에 할당되어 Method area에 위치하였다.
* Method area에는 영구적으로 보관되는 상수형 데이터\(Static variable\)들이 저장되었다.
* Java 8 이후에는 Permgen 영역이 제거되고 Metaspace 영역으로 변경되면서 Perm 영역에 있던 정보들 중 static 변수나 String 상수풀은 Heap 영역으로 이동하여 GC가 관리될 수 있도록 개선되었다.

### String 클래스의 구현 코드를 살펴보자

String은 final 클래스로 선언되어 있으며 클래스내의 문자열도 final로 선언된것을 확인할 수 있다. 이는 String 인스턴스를 immutable 하다는 것을 알 수 있다.

```java
/**
 * Strings are objects which represent immutable arrays of characters.
 *
 * @author OTI
 * @version initial
 *
 * @see StringBuffer
 */
public final class String implements Serializable, Comparable<String>, CharSequence
{
	...
	private final char[] value;
	private final int count;
	private int hashCode;

	...

  /**
	 * Creates a string that is a copy of another string
	 *
	 * @param string
	 *          the String to copy
	 */
	public String(String string) {
		value = string.value;
		count = string.count;
		hashCode = string.hashCode;
	}
}
```

### 문자열을 조합할 경우엔 어떻게 될까?

value가 final이니 인스턴스의 value를 수정할 수 없으므로 두 문자열을 조합할 경우엔 새로운 인스턴스를 생성하게 된다. 아래의 코드는 두 문자열을 조합하였을 경우 호출되는 String 생성자 코드를 확인할 수 있다.

```java
/*
 * Creates a string that is s1 + s2.
 */
private String(String s1, String s2) {
	...
	value = new char[concatlen];
	count = concatlen;

	System.arraycopy(s1.value, 0, value, 0, s1len);
	System.arraycopy(s2.value, 0, value, s1len, s2len);
}
```

### String Optimization

Java 1.5 이상부터는 String 인스턴스에 문자열을 '+' 할 경우에 컴파일러가 StringBuilder로 변환해주는 것을 확인할 수 있다.

그렇다면 아래와 같이 코드를 컴파일 할 경우에 어떻게 최적화 될지 확인해 보자

```java
public static void main(String[] args) {
		// case 1. 두 인스턴스 문자열 조합
    String str1 = "test";
    String str2 = "test";
    String str3 = str1 + str2;

		// case 2. 문자열 인스턴스에 int 추가
    String str4 = "";
    str4 += 0;
    str4 += 1;
    str4 += 2;

		// case 3. 문자열 인스턴스에 for loop를 돌면서 문자열 추가
    String str5 = "123";
    for(int i = 0; i < 100; ++i) {
        str5 = str5 + "456";
    }
}
```

다음은 JAD로 컴파일한 파일을 디컴파일한 결과이다.

String 인스턴스들을 조합할 경우 StringBuilder로 변환하여 append\(\)를 호출하는 것을 확인할 수 있다. 그러나 루프문에서는 StringBuilder로 변환 되었지만 루프 수 만큼 StringBuilder가 생성되었기 때문에 루프문안에서 문자열 조합은 메모리를 고려해볼 필요가 있다.

```java
public static void main(String args[])
{
		// case 1. 두 인스턴스 문자열 조합
    String str1 = "test";
    String str2 = "test";
    String str3 = (new StringBuilder()).append(str1).append(str2).toString();
    
		// case 2. 문자열 인스턴스에 int 추가
		String str4 = "";
    str4 = (new StringBuilder()).append(str4).append(0).toString();
    str4 = (new StringBuilder()).append(str4).append(1).toString();
    str4 = (new StringBuilder()).append(str4).append(2).toString();
    
		// case 3. 문자열 인스턴스에 for loop를 돌면서 문자열 추가
		String str5 = "123";
    for(int i = 0; i < 100; i++)
        str5 = (new StringBuilder()).append(str5).append("456").toString();

}
```

### 결론을 내보자

String 클래스의 문자열 값은 final 이므로 immutable 하다는 것을 알 수 있다. 그러므로 문자열을 추가하거나 삭제할 경우엔 새로운 인스턴스가 만들어진다는 것을 유념해야 한다. 새로운 인스턴스는 힙 메모리에 할당되므로 빈번한 문자열 조합은 가비지 컬렉터의 부하가 발생할 수 있다.

Java 5 이상부터는 String 인스턴스에 새로운 문자열을 조합할 경우 컴파일러가 최적화하여 StringBuilder로 변환해주지만 StringBuilder 또한 새로 생성되는 인스턴스이기 때문에 성능을 고려하며 코드를 작성해야 한다.

## StringBuilder

* StringBuilder는 힙 메모리에 생성된다.
* 가변적이고, Thread Safe 하지 않는다.
* Thread safe를 고려하지 않으므로 성능 상 가장 우수하다.
* 싱글 쓰레드 로직이나 쓰레드간 String을 공유하지 않는다면 StringBuilder를 사용하자

```java
public final class StringBuilder extends AbstractStringBuilder implements Serializable, CharSequence, Appendable {
	...
	private transient char[] value;
	...
}
```

## StringBuffer

* StringBuffer 또한 힙 메모리에 생성된다.
* 가변적이지만 Thread Safe 하다.

### Thread safe를 어떻게 구현하였을까?

StringBuffer의 경우에는 append 메소드에 synchronized 를 붙여주어 해당 로직에 lock을 걸어 동기화를 보장하였다. synchronized 키워드는 가장 안전하게 쓰레드 동기화를 보장해주지만 lock을 거는 만큼 성능상 이슈가 없는지 고려해보아야 한다.

```java
/**
 * Adds the character array to the end of this StringBuffer.
 *
 * @param		chars	the character array
 * @return		this StringBuffer
 *
 * @exception	NullPointerException when chars is null
 */
public synchronized StringBuffer append (char[] chars) {
	int currentLength = lengthInternalUnsynchronized();
	int currentCapacity = capacityInternal();
	
	...
}
```

## 참고

* [http://www.javadecompilers.com/](http://www.javadecompilers.com/)
* [https://gist.github.com/benelog/b81b4434fb8f2220cd0e900be1634753](https://gist.github.com/benelog/b81b4434fb8f2220cd0e900be1634753)
* [https://siyoon210.tistory.com/160](https://siyoon210.tistory.com/160)
* [https://coding-factory.tistory.com/546](https://coding-factory.tistory.com/546)

