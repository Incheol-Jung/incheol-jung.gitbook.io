---
description: hashCode와 equals를 알아보고 override 해야 하는 이유에 대해 알아보자
---

# hashCode()와 equals()

![https://www.jitendrazaa.com/blog/java/what-is-the-need-to-override-hashcode-and-equals-method/](<../../.gitbook/assets/how-hashcode-works-in-java (1).jpg>)

## Object 제공 method

### Object 클래스란?

java.lang 패키지는 구현시에 import 를 하지 않아도 자동으로 참조되는 패키지로서 자바에서 사용되는 주요 클래스와 API가 정의 되어있다. 이 중 Object 클래스는 모든 클래스의 최상위 클래스로서 Java Document에는 Object 클래스를 아래와 같이 정의하고 있다.

```java
/**
 * Object is the root of the java class hierarchy. All non-base types
 * respond to the messages defined in this class.
 *
 * @author		OTI
 * @version		initial
 */
 
public class Object { ... }
```

### Object 주요 method

Object에는 객체가 가져야 할 기본적인 메서드를 제공한다.

|  메소드                                | 설 명                                               |
| ----------------------------------- | ------------------------------------------------- |
| boolean equals(Object obj)          |  두 개의 객체가 같은지 비교하여 같으면 true를, 같지 않으면 false를 반환한다. |
| String toString()                   | 현재 객체의 문자열을 반환한다.                                 |
| protected Object clone()            | 객체를 복사한다.                                         |
| protected void finalize()           | 가비지 컬렉션 직전에 객체의 리소스를 정리할 때 호출한다.                  |
| Class getClass()                    | 객체의 클래스형을 반환한다.                                   |
| int hashCode()                      | 객체의 코드값을 반환한다.                                    |
| void notify()                       | wait된 스레드 실행을 재개할 때 호출한다.                         |
| void notifyAll()                    | wait된 모든 스레드 실행을 재개할 때 호출한다.                      |
| void wait()                         | 스레드를 일시적으로 중지할 때 호출한다.                            |
| void wait(long timeout)             | 주어진 시간만큼 스레드를 일시적으로 중지할 때 호출한다.                   |
| void wait(long timeout, int nanos)  | 주어진 시간만큼 스레드를 일시적으로 중지할 때 호출한다.                   |

## hashCode()

hashCode는 기본적으로 객체의 고유의 값을 표기할 때 사용한다. hashCode를 override 하지 않고 그대로 사용한다면 jdk 버전에 따라 기본 전략을 사용하게 된다.

### hashCode가 제공하는 전략은 어떤게 있을까?

hashcode는 native method로 구현되어 있어 실제로는 cpp 파일을 확인해야 한다. jvm.cpp를 살펴보면 제공하는 전략을 확인할 수 있다.

```java
// hashCode() generation :
//
// Possibilities:
// * MD5Digest of {obj,stwRandom}
// * CRC32 of {obj,stwRandom} or any linear-feedback shift register function.
// * A DES- or AES-style SBox[] mechanism
// * One of the Phi-based schemes, such as:
//   2654435761 = 2^32 * Phi (golden ratio)
//   HashCodeValue = ((uintptr_t(obj) >> 3) * 2654435761) ^ GVars.stwRandom ;
// * A variation of Marsaglia's shift-xor RNG scheme.
// * (obj ^ stwRandom) is appealing, but can result
//   in undesirable regularity in the hashCode values of adjacent objects
//   (objects allocated back-to-back, in particular).  This could potentially
//   result in hashtable collisions and reduced hashtable efficiency.
//   There are simple ways to "diffuse" the middle address bits over the
//   generated hashCode values:

static inline intptr_t get_next_hash(Thread * Self, oop obj) {
  intptr_t value = 0;
  if (hashCode == 0) {
    // This form uses global Park-Miller RNG.
    // On MP system we'll have lots of RW access to a global, so the
    // mechanism induces lots of coherency traffic.
    value = os::random();
  } else if (hashCode == 1) {
    // This variation has the property of being stable (idempotent)
    // between STW operations.  This can be useful in some of the 1-0
    // synchronization schemes.
    intptr_t addrBits = cast_from_oop<intptr_t>(obj) >> 3;
    value = addrBits ^ (addrBits >> 5) ^ GVars.stwRandom;
  } else if (hashCode == 2) {
    value = 1;            // for sensitivity testing
  } else if (hashCode == 3) {
    value = ++GVars.hcSequence;
  } else if (hashCode == 4) {
    value = cast_from_oop<intptr_t>(obj);
  } else {
    // Marsaglia's xor-shift scheme with thread-specific state
    // This is probably the best overall implementation -- we'll
    // likely make this the default in future releases.
    unsigned t = Self->_hashStateX;
    t ^= (t << 11);
    Self->_hashStateX = Self->_hashStateY;
    Self->_hashStateY = Self->_hashStateZ;
    Self->_hashStateZ = Self->_hashStateW;
    unsigned v = Self->_hashStateW;
    v = (v ^ (v >> 19)) ^ (t ^ (t >> 8));
    Self->_hashStateW = v;
    value = v;
  }

  value &= markOopDesc::hash_mask;
  if (value == 0) value = 0xBAD;
  TEVENT(hashCode: GENERATE);
  return value;
}
```

#### hashCode 전략

1. 운영체제에 구현된 random([Park-Miller RNG](https://en.wikipedia.org/wiki/Lehmer\_random\_number\_generator))을 사용
2. 객체의 메모리 주소 int로 캐스팅 한 값을 우로 3 쉬프트 한 값을 사용
3. 고정된 값 1을 반환 (테스팅 목적)
4. 연속된 시퀀스를 반환
5. 객체의 메모리 주소를 그냥 int로 캐스팅함
6. XOR 쉬프트를 통한 스레드 상태를 기반으로 생성

### hashCode 기본 전략은 어떻게 될까?

hashCode 기본전략은 global.hpp를 확인하면 알 수 있다.

OpenJDK 8의 경우 5번을 사용한다.

```java
#define RUNTIME_FLAGS(develop, develop_pd, product, product_pd, diagnostic, experimental, notproduct, manageable, product_rw, lp64_product) \\
// ..
develop(bool, InlineObjectHash, true,                                     \\
        "Inline Object::hashCode() native that is known to be part "      \\
        "of base library DLL")                                            \\
product(intx, hashCode, 5,                                                \\
        "(Unstable) select hashCode generation algorithm")                \\
```

JDK 6,7은 0번 전략을 사용한다.

```java
develop(bool, InlineObjectHash, true,                                     \\
        "inline Object::hashCode() native that is known to be part "      \\
        "of base library DLL")                                            \\
product(intx, hashCode, 0,                                                \\
        "(Unstable) select hashCode generation algorithm" )               \\
```

## equals()

equals()는 두 객체가 같은지 비교하여 결과값을 리턴한다. 비교는 두 가지의 기준으로 구분할 수 있다.

* 동일성 : 두 객체의 주소가 같은지 비교
* 동등성 : 두 객체의 값이 같은지 비교

equals()는 이 중에서 동등성 비교를 하기 위함이다. 동일성을 비교하려면 '=='을 사용해야 한다.

### equals()의 기본 전략은 어떻게 될까?

equals()를 오버라이드 하지 않는다면 인스턴스의 주소 값을 리턴하게 된다.

```java
/**
 * Compares the argument to the receiver, and answers true
 * if they represent the <em>same</em> object using a class
 * specific comparison. The implementation in Object answers
 * true only if the argument is the exact same object as the
 * receiver (==).
 *
 * @param		o Object
 *					the object to compare with this object.
 * @return		boolean
 *					<code>true</code>
 *						if the object is the same as this object
 *					<code>false</code>
 *						if it is different from this object.
 * @see			#hashCode
 */
public boolean equals (Object o) {
	return this == o;
}
```

그러므로 동등성을 비교하기 위해서는 객체의 필드를 비교할 수 있는 로직이 필요하다.

### 동등성 비교 로직은 어떻게 작성할까?

동등성 비교는 각 필드들을 각각 비교해주어야 한다. 이펙티브 자바 아이템 10 이나 인텔리제이를 사용한다면 equals()를 작성하는 공식이 있다.

#### equals 구현 전략

* \== 연산자를 사용해 입력이 자기 자신의 참조 인지 확인한다.
* instanceof 연산자로 입력이 올바른 타입 인지 확인한다. 이때의 올바른 타입은 equals가 정의된 클래스인 것이 보통이지만, 가끔은 그 클래스가 구현한 특정 인터페이스가 될 수도 있다.
* 입력을 올바른 타입으로 형변환한다. 앞서 2번에서 instanceof를 했기 때문에 이 단계는 100% 성공한다.
* 입력 객체와 자기 자신의 대응되는 '핵심' 필드들이 모두 일치하는지 하나씩 검사한다.
* 어떤 필드를 먼저 비교하느냐가 equals의 성능을 좌우하기도 한다. 최상의 성능을 바란다면 다를 가능성이 더 크거나 비교하는 비용이 싼 필드를 먼저 비교하자
* equals를 재정의할 땐 hashCode도 반드시 재정의하자(아이템11 참고)
* Object 외의 타입을 매개변수로 받는 equals 메서드는 선언하지 말자. 이 메서드는 Object.equals를 재정의한 게 아니다. 입력 타입이 Object가 아니므로 재정의가 아니라 다중정의 한것이다.

다음 예제는 위의 구현 전략을 토대로 작성된 코드이다.

```java
public class Person {
    private int id;
    private String name;
    private Integer age;
    private Address address;

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof Person)) {
            return false;
        }
        Person person = (Person)o;
        return id == person.id && Objects.equals(name, person.name) && Objects.equals(age, person.age)
               && Objects.equals(address, person.address);
    }

    @Override
    public int hashCode() {
        return Objects.hash(id, name, age, address);
    }
}
```

## hashCode() 왜 필요한가?

equals는 필드 전체를 비교해야 하므로 느리다. 그에 비해 해시값을 사용하면 일정 계산과 계산 결과의 비교만으로 끝나기 때문에 빠르게 객체 비교를 판별할 수 있다. 그렇기 때문에 HashMap이나 HashSet에서는 아래와 같은 로직을 사용한다.

* 해시값으로 객체를 비교한다.
* 해시값이 동일한 경우에 한해 euqals 메서드로 비교한다.

![https://i.imgur.com/dShPCEh.png](https://i.imgur.com/dShPCEh.png)

## hashCode()가 같을 경우?

hashmap 내부에는 hashCode를 기반으로 배열의 인덱스를 바로 접근하여 값을 찾기 때문에 O(1)의 값을 가진다. 그러나 hashCode값이 모두 동일하다면 배열의 특정 인덱스에 값이 충돌하게 되는데 이때 seperate chaning 전략을 사용하여 여러개의 값을 담을 수 있는 LinkedList로 구성되어 있기 때문에 중복된 hashCode에도 값을 넣을 수 있다. 단, hashCode로 인덱스를 조회한 후 LinkedList를 순회하기 때문에 O(n)의 효율을 가지게 된다.

```java
/**
     * Returns the value to which the specified key is mapped,
     * or {@code null} if this map contains no mapping for the key.
     *
     * <p>More formally, if this map contains a mapping from a key
     * {@code k} to a value {@code v} such that {@code (key==null ? k==null :
     * key.equals(k))}, then this method returns {@code v}; otherwise
     * it returns {@code null}.  (There can be at most one such mapping.)
     *
     * <p>A return value of {@code null} does not <i>necessarily</i>
     * indicate that the map contains no mapping for the key; it's also
     * possible that the map explicitly maps the key to {@code null}.
     * The {@link #containsKey containsKey} operation may be used to
     * distinguish these two cases.
     *
     * @see #put(Object, Object)
     */
    public V get(Object key) {
        Node<K,V> e;
        return (e = getNode(hash(key), key)) == null ? null : e.value;
    }

    /**
     * Implements Map.get and related methods.
     *
     * @param hash hash for key
     * @param key the key
     * @return the node, or null if none
     */
    final Node<K,V> getNode(int hash, Object key) {
        Node<K,V>[] tab; Node<K,V> first, e; int n; K k;
        if ((tab = table) != null && (n = tab.length) > 0 &&
            (first = tab[(n - 1) & hash]) != null) {
            if (first.hash == hash && // always check first node
                ((k = first.key) == key || (key != null && key.equals(k))))
                return first;
            if ((e = first.next) != null) {
                if (first instanceof TreeNode)
                    return ((TreeNode<K,V>)first).getTreeNode(hash, key);
                do {
                    if (e.hash == hash &&
                        ((k = e.key) == key || (key != null && key.equals(k))))
                        return e;
                } while ((e = e.next) != null);
            }
        }
        return null;
    }
```

### hashCode가 동일할 경우, 조회는 항상 O(n)의 효율을 가지는가?

java 2 부터 java 7 까지는 내부 구현은 다르지만 평균적으로 O(n)의 효율을 가지고 있었다. 그러나 java 8 부터는 데이터 갯수가 특정 사이즈를 넘어가게 되면 Tree구조로 변경되어 O(logN)의 효율을 가질 수 있게 되었다.

그러기 위해서 java 7 까지는 Entry 클래스를 사용하였지만 java 8 부터는 Node 클래스를 사용하게 되었다.

#### 내부 자료구조를 변경하는 기준은 어떻게 되나?

hashcode의 값의 충돌 사이즈가 8이상이 되면 treeNode로 변경하고 6 미만이면 Linkedlist로 변경한다. 차이가 2가 나는 이유는 자료구조를 변경하는 오버헤드가 크기 때문이다.

## 참고

* [https://hyeonstorage.tistory.com/178](https://hyeonstorage.tistory.com/178)
* [https://www.holaxprogramming.com/2012/06/30/java-basic-object-class/](https://www.holaxprogramming.com/2012/06/30/java-basic-object-class/)
* [https://namocom.tistory.com/803](https://namocom.tistory.com/803)
* [https://gompangs.tistory.com/entry/HashMap-에-대하여](https://gompangs.tistory.com/entry/HashMap-%EC%97%90-%EB%8C%80%ED%95%98%EC%97%AC)
* [https://d2.naver.com/helloworld/831311](https://d2.naver.com/helloworld/831311)
