---
layout:     post
title:      "아이템13 clone 재정의는 주의해서 진행해라"
date:       2020-03-10 00:00:00
categories: effective
summary:    Effective Java 3e 아이템 13을 요약한 내용 입니다.
---

> Effective Java 3e 아이템 13을 요약한 내용 입니다.

### 메서드 하나 없는 cloneable 인터페이스는 대체 무슨 일을 할까?

이 인터페이스는 **Object**의 protected 메서드인 clone의 동작 방식을 결정한다. **Cloneable**을 구현한 클래스의 인스턴스에서 **clone**을 호출하면 그 객체의 필드들을 하나하나 복사한 객체를 반환하며, 그렇지 않은 클래스의 인스턴스에서 호출하면 **CloneNotSupportedException**을 던진다. 
```java
    public class Stack {
    	private Object[] elements;
    	private int size = 0;
    	...
    }
```

### Stack 클래스를 clone 하면 어떻게 될까?

반환된 Stack 인스턴스의 size 필드는 올바른 값을 갖겠지만, **elements** 필드는 원본 Stack 인스턴스와 똑같은 배열을 참조할 것이다. 원본이나 복제본 중 하나를 수정하면 다른 하나도 수정되어 **불변식을** 해친다는 이야기다. 

### clone 메서드는 사실상 생성자와 같은 효과를 낸다.

clone은 원복 객체에 아무런 해를 끼치지 않는 동시에 복제된 객체의 불변식을 보장해야 한다. 이를 해결하기 가장 쉬운 방법은 **elements** 배열의 clone을 **재귀적으로** 호출해주는 것이다. 
```java
    @Override
    public Stack clone() {
    	try {
    		Stack result = (Stack) super.clone();
    		result.elements = elements.clone();
    		return result;
    	} catch (CloneNotSupportedException e) {
    		throw new AssertionError();
    	}
    }
```
**따라서 배열을 복제할 때는 배열의 clone 메서드를 사용하라고 권장한다.** 

그런데 clone을 재귀적으로 호출하는 것만으로는 충분하지 않을 때도 있다. 이번에는 해시테이블용 clone 메서드를 생각해보자. 해시테이블 내부는 **버킷들의 배열**이고, 각 버킷은 **키-값 쌍을 담는 연결 리스트**의 첫 번째 엔트리를 참조한다. 
```java
    public class HashTable implements Cloneable {
    	private Entry[] buckets = ...;
    
    	private static class Entry {
    		final Object key;
    		Object value;
    		Entry next;
    		
    		Entry(Object key, Object value, Entry next) {
    			this.key = key;
    			this.value = value;
    			this.next = next;
    		}
    	}
    	... // 나머지 코드는 생략
    }
    
    @Override
    public HashTable clone() {
    	try {
    		HashTable result = (HashTable) super.clone();
    		result.buckets = buckets.clone();
    		return result;
    	} catch (CloneNotSupportedException e) {
    		throw new AssertionError();
    	}
    }
```
**복제본은 자신만의 버킷 배열을 갖지만, 이 배열은 원본과 같은 연결 리스트를 참조하여 원본과 복제본 모두 예기치 않게 동작할 가능성이 생긴다.** 이를 해결하려면 각 버킷을 구성하는 연결 리스트를 복사해야 한다. 
```java
    public class HashTable implements Cloneable {
    	...
    
    	Entry deepCopy() {
    		return new Entry(key, value, next == null ? null : next.deepCopy());
    	}
    
    	@Override
    	public HashTable clone() {
    		try {
    			HashTable result = (HashTable) super.clone();
    			result.buckets = new Entry[buckets.length];
    			for (int i = 0; i < buckets.length; i++)
    				if (buckets[i] != null)
    					result.buckets[i] = buckets[i].deepCopy();
    				return result;
    		} catch (CloneNotSupportedException e) {
    			throw new AssertionError();
    		}
    }
```
**이때 Entry의 deepCopy 메서드는 자신이 가리키는 연결 리스트 전체를 복사하기 위해 자신을 재귀적으로 호출한다.** 

Cloneable을 구현하는 모든 클래스는 clone을 재정의해야 한다. 이때 접근 제한자는 public으로 반환 타입은 클래스 자신으로 변경한다. 이 메서드는 가장 먼저 **super.clone**을 호출한 후 필요한 필드를 전부 적절히 수정한다. 

기본 타입 필드와 불변 객체 참조만 갖는 클래스라면 아무 필드도 수정할 필요가 없다. 단, 일련번호나 고유 ID는 비록 기본 타입이나 불변일지라도 수정해줘야 한다. 

### 그런데 이 모든 작업이 꼭 필요한 걸까?

다행히도 이처럼 복잡한 경우는 드물다. Cloneable을 이미 구현한 클래스를 확장한다면 어쩔 수 없이 clone을 잘 작동하도록 구현해야 한다. 그렇지 않은 상황에서는 **복사 생성자**와 **복사 팩터리**라는 더 나은 객체 복사 방식을 제공할 수 있다. **복사 생성자**란 단순히 자신과 같은 클래스의 인스턴스를 인수로 받는 생성자를 말한다. 

복사 생성자와 복사 팩터리는 해당 클래스가 구현한 **'인터페이스'**타입의 인스턴스를 인수로 받을 수 있다. 

## 핵심 정리

**Cloneable**이 몰고 온 모든 문제를 되짚어봤을 때, 새로운 인터페이스를 만들 때는 절대 Cloneable을 확장해서는 안 되며, 새로운 클래스도 이를 구현해서는 안 된다. final 클래스라면 Cloneable을 구현해도 위험이 크지 않지만, **성능 최적화 관점에서 검토한 후 별다른 문제가 없을 때만 드물게 허용해야 한다.** 기본 원칙은 '**복제 기능은 생성자와 팩터리를 이용하는 게 최고**'라는 것이다. **단, 배열만은 clone 메서드 방식이 가장 깔끔한 이 규칙의 합당한 예외라 할 수 있다.**