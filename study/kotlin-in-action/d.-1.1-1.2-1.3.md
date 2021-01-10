---
description: KOTLIN IN ACTION 부록 D를 요약한 내용입니다.
---

# 부록 D. 코틀린 1.1과 1.2, 1.3 소개

## 코틀린 1.1

### 타입 별명

기존 타입에 대한 별명\(alias\)을 만드는 기능으로 typealias라는 키워드가 생겼다. 타입 별명\(type alias\)은 새로운 타입을 정의하지는 않지만 기존 타입을 다른 이름으로 부르거나 더 짧은 이름으로 부를 수 있다.

```kotlin
// 콜백 함수 타입에 대한 타입 별명
typealias MyHandler = (Int, String, Any) -> Unit

// MyHandler를 받는 고차 함수
fun addHandler(h:MyHandler) { ... }

// 컬렉션의 인스턴스에 대한 타입 별명
typealias Args = Array<String>
fun main(args:Args) { ... }

// 제네릭 타입 별명
typealias StringKeyMap<V> = Map<String, V>
val myMap: StringKeyMap<Int> = mapOf("One" to 1, "Two" to 2)

// 중첩 클래스
class Foo {
		class Bar {
				inner class Baz
		}
}
typealias FooBarBax = Foo.Bar.Baz
```

### 봉인 클래스와 데이터 클래스

코틀린 1.1부터는 봉인 클래스의 하위 클래스를 봉인 클래스 내부에 정의할 필요가 없고 같은 소스 파일 안에만 정의하면 된다. 또한 데이터 클래스로 봉인 클래스를 확장하는 것도 가능해졌다.

```kotlin
sealed class Expr
data class Num(val value: Int) : Expr()
data class Sum(val left: Expr, val right: Expr) : Expr()

fun eval(e: Expr): Int =
		when (e) {
				is Num -> e.value
				is Sum -> eval(e.right) + eval(e.left)
		}

fun main(args: Array<String>) {
		val v = Sum(Num(1), Sum(Num(10), Num(20)))
		println(v)
		println(eval(v))
}

// 결과
Sum(left=Num(value=1), right=Sum(left=Num(value=10), right=Num(value=20)))
31
```

데이터 클래스로 봉인 클래스를 상속하는 경우 재귀적인 계층 구조의 값을 자연스럽게 표시해주는 toString 함수를 쉽게 얻을 수 있다는 장점이 있다.

### 람다 파라미터에서 구조 분해 사용

구조 분해 선언을 람다의 파라미터 목록에서도 사용할 수 있다.

```kotlin
val nums = listOf(1,2,3)
val names = listOf("One", "Two", "Three")

(nums zip names).forEach { (num, name) -> println("${num} = ${name}") }

// 결과
1 = One
2 = Two
3 = Three
```

### 프로퍼티 접근자 인라이닝

프로퍼티 접근자도 함수이므로 inline을 사용할 수 있다는 생각을 누구나 할 수 있다. 게터뿐 아니라 세터도 인라이닝이 가능하며, 일반 멤버 프로퍼티뿐 아니라 확장 멤버 프로퍼티나 최상위 프로퍼티도 인라이닝이 가능하다. 그러나 한 가지 제약이 있다. 프로퍼티에 뒷받침하는 필드가 있으면 그 프로퍼티의 게터나 세터를 인라이닝할 수는 없다.

```kotlin
val toplevel: Double
		inline get() = Math.PI // 게터 인라이닝
class InlinePropExample(var value:Int) {
		var setOnly: Int
		get() = value
		inline set(v) { value = v } // 세터 인라이닝

		// 컴파일 오류: Inline property cannot have baking field
		val backing: Int = 10
		inline get() = field*1000
}
inline var InlinePropExample.square: Int // 게터 세터 인라이닝
		get() = value*value
		set(v) { value = Math.sqrt(v.toDouble()).toInt() }
```

## 코틀린 1.2

### 애노테이션의 배열 리터럴

1.1 까지는 애노테이션에서 여러 값을 배열로 넘길 때 arrayOf를 써야 했다. 하지만 1.2에서는 \[ \] 사이에 원소를 넣어서 표시할 수 있다.

```kotlin
@RequestMapping(value = ["v1", "v2"], path = ["path", "to", "resource"])
```

### 지연 초기화\(lateinit\) 개선

지연 초기화 프로퍼티가 초기화됐는지 검사할 수 있게 됐다. 그리고 지연 초기화를 최상위 프로퍼티와 지역 변수에도 사용할 수 있다.

```kotlin
lateinit var url: String
... // url을 외부에서 받아 초기화하는 코드
if(::url.isInitaialized) {
		...
}
```

### 경고를 오류로 처리

커맨드라인 옵션에 -Werror를 지정하면 모든 경고를 오류로 처리한다.

```text
compileKotlin {
		kotlinOptions.warningsAsErrors = true
}
```

### 이넘 원소 안의 클래스는 내부 클래스로

이넘 원소 안에 클래스, 인터페이스 등 다양한 중첩 타입을 정의할 수 있었고 inner 클래스는 정의할 수 없었지만, 1.2부터는 inner로 표시된 내부 클래스 정의만 가능하다.

```kotlin
enum class Foo {
		BAR {
						inner class Baz // 1.1에서는 불가능 1.2에서는 가능
						class Baz2 // 1.1에서는 가능 1.2에서는 경고('deprecated' 경고)
		}
}
```

### 표준 라이브러리

#### 컬렉션

컬렉션 원소를 n개씩 짝을 지어 처리할 수 있는 슬라이딩 윈도우\(sliding window\)처리 메소드들이 추가됐다.

* chuncked/chunckedSequence : 컬렉션을 정해진 크기의 덩어리로 나눠준다.
* windowed/windowedSequence : 정해진 크기의 슬라이딩 윈도우를 만들어서 컬렉션을 처리할 수 있게 해준다.
* zipWithNext : 컬렉션에서 연속한 두 원소에 대해 람다를 적용한 결과를 얻는다.
* fill : 변경 가능 리스트의 모든 원소를 지정한 값으로 바꾼다.
* replaceAll : 변경 가능 리스트의 모든 원소를 람다를 적용한 결과 값으로 갱신한다. map을 제자리에서 수행한다고 생각하면 이해하기 쉽다.
* shuffle : 변경 가능한 리스트의 원소를 임의로 뒤섞는다.
* shuffled : 변경 불가능한 리스트의 원소를 임의로 뒤섞은 새 리스트를 반환한다.

### JVM 백엔드 변경

#### 생성자 호출 정규화

코틀린 생성자에 복잡한 제어 구조를 인자로 호출하는 코드를 컴파일한 바이트코드는 JVM 명세상으로는 적법하지만 일부 바이트코드 처리 도구가 그런 바이트코드를 제대로 처리하지 못하는 경우가 있다. 이를 해결하기 위해 컴파일러에게 -Xnormalize-constructpr-calls 모드 옵션을 제공하면 모드에 따라 자바와 비슷한 바이트코드를 생성할 수 있다.

* disable : 디폴트로서 코틀린 1.0이나 1.1과 같은 바이트코드를 만들어낸다.
* enable : 자바와 비슷한 생성자 호출을 만들어낸다. 그에 따라 클래스 로딩과 초기화 순서가 코틀린 바이트코드와 약간 달라질 수 있다.
* preserve-class-initialization : 자바와 비슷한 생성자 호출 코드를 만들어내되 클래스의 초기화 순서를 보존한다.

### 자바 디폴트 메소드 호출

자바의 디폴트 메소드를 코틀린 인터페이스 멤버가 오버라이딩하는 경우 코틀린 1.2부터는 무조건 자바 1.8로 컴파일하도록 -jvm-target 1.8을 명시해야 한다.

## 코틀린 1.3

### 컨트랜트\(Contract, 계약\)

스마트캐스트 기능은 타입 검사를 통해 널 가능한 변수에 저장된 값이 널일 가능성이 없으면 자동으로 널이 될 수 없는 타입으로 캐스팅해준다.

```kotlin
fun foo(s: String?) {
		if (s != null) s.length // 컴파일러가 s를 String 타입으로 자동 캐스팅
}
```

하지만 이 검사를 별도 함수로 분리하면 스마트캐스트가 더 이상 지원되지 않았다.

```kotlin
fun String?.isNotNull() : Boolean = this != null

fun foo(s: String?) {
		if (s.isNotNull()) s.length // 자동변환 안됨
}
```

하지만 코틀린 1.3 이상에서는 해당 컨트랙트를 사용할 수 있다.

```kotlin
fun bar(x: String?) {
		if (!x.isNullOrEmpty()) {
				println("length of '$x' is ${x.length}") // 스마트캐스트가 잘 됨!
		}
}
```

### When의 대상을 변수에 포획

코틀린 1.3부터 when의 대상을 변수에 대입할 수 있다.

```kotlin
fun Request.getBody() =
		when (val response = executeRequest()) {
				is Success -> response.body
				is HttpError -> throw HttpException(response.status)
		}
```

### 인터페이스의 동반 객체 있는 멤버를 @JvmStatic이나 @JvmField로 애노테이션

코틀린 1.3부터는 인터페이스의 동반 객체에 들어있는 메버에게 @JvmStatic이나 @JvmField를 붙일 수 있다. 이런 애노테이션이 붙은 멤버들은 클래스 파일에서는 인터페이스의 static 변수가 된다.

```kotlin
// kotlin
interface Foo {
		companion object {
				@JvmField
				val answer: Int = 42

				@JvmStatic
				fun sayHello() {
						println("Hello, world!")
				}
		}
}
```

이 코드는 다음 자바 코드와 같다.

```kotlin
interface Foo {
		public static int answer = 42;
		public static void sayHello() {
				// ..
		}
}
```

### isNullOrEmpty와 orEmpty 확장을 여러 클래스에 추가

isNullOrEmpty와 orEmpty 확장 함수를 컬렉션, 맵, 배열 등의 객체에도 추가했다.

### 배열 원소 복사 확장 함수 copyInfo\(\) 추가

array.copyInto\(targetArray, targetOffset, startIndex, endIndex\) 함수를 사용해 어떤 배열의 내용을 다른 배열에 복사할 수 있다.

