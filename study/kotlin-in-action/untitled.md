---
description: KOTLIN IN ACTION 2장을 요약한 내용입니다.
---

# 2장 코틀린 기초

## 기본 요소: 함수와 변수

### Hello, World!

'Hello, World!'를 찍는 프로그램으로 시작해보자.

```kotlin
fun main(args: Array<String>) {
		println("Hello, world!")
}
```

단순한 코드지만 코틀린의 여러가지 특성을 보여준다.

* 함수를 선언할 때 fun 키워드를 사용한다.
* 파라미터 이름 뒤에 그 파라미터의 타입을 쓴다.
* 함수를 최상위수준에 정의할 수 있다. (자바와 달리) 꼭 클래스 안에 함수를 넣어야 할 필요가 없다.
* 배열도 일반적인 클래스와 마찬가지다. 코틀린에는 자바와 달리 배열처리를 위한 문법이 따로 존재하지 않는다.
* System.out.println 대신에 println이라고 쓴다. 코틀린 표준 라이브러리는 여러 가지 표준 자바 라이브러리 함수를 간결하게 사용할 수 있게 감싼 래퍼를 제공한다.
* 최신 프로그래밍 언어 경향과 마찬가지로 줄 끝에 세미콜론(;)을 붙이지 않아도 좋다.

### 함수

이번엔 결과를 반환하는 함수를 만들어 보자

```kotlin
fun max(a: Int, b: Int): Int {
		return if (a > b) a else b
}
```

이는 더 간결하게 표현할 수도 있다.

```kotlin
fun max(a: Int, b: Int): Int = if (a > b) a else b
```

본문이 중괄호로 둘러싸인 함수를 블록이 본문인 함수라 부르고, 등호와 식으로 이뤄진 함수를 식이 본문인 함수라고 부른다.

> **인텔리J 아이디어 팁**

인텔리J 아이디어는 이 두 방식의 함수를 서로 변환하는 메뉴가 있다. 각각은 '식 본문으로 변환(Convert to expression body)'과 '블록 본문으로 변환(Convert to block body)'이다.

반환 타입을 생략하면 max 함수를 더 간략하게 만들 수 있다.

```kotlin
fun max(a: Int, b: Int) = if (a > b) a else b
```

코틀린은 정적 타입 지정 언어이므로 컴파일 시점에모든 식의 타입을 지정하는게 맞지만 식이 본문인 함수의 경우 굳이 사용자가 반환 타입을 적지 않아도 컴파일러가 함수 본문 식을 분석해서 식의 결과 타입을 함수 반환 타입으로 정해준다.

### 변수

자바에서는 변수를 선언할 때 타입이 맨 앞에 온다. 코틀린에서는 타입 지정을 생략하는 경우가 흔하다.

```kotlin
val answer = 42 // 타입 생략
val answer: Int = 42 // 타입 지정
```

단, 초기화 식을 사용하지 않고 변수를 선언하려면 변수 타입을 반드시 명시해야한다.

```kotlin
val answer: Int
answer = 42
```

#### 변경 가능한 변수와 변경 불가능한 변수

* val(값을 뜻하는 value에서 유래) - 변경 불가능한(immutable) 참조를 저장하는 변수다. 자바로 말하자면 final 변수에 해당한다.
* var(변수를 뜻하는 variable에서 유래) - 변경 가능한(mutable) 참조다. 자바의 일반 변수에 해당한다.

기본적으로는 모든 변수를 val 키워드를 사용해 불변 변수로 선언하고, 나중에 꼭 필요할 때에만 var로 변경하라. val 변수는 블록을 실행할 때 정확히 한 번만 초기화돼야 한다. 하지만 조건에 따라 val 값을 다른 여러 값으로 초기화할 수도 있다.

```kotlin
val message: String
if (canPerformOperation()) {
		message = "Success"
		// ... 연산을 수행한다. 
} else {
		message = "Failed"
}
```

val 참조 자체는 불변일지라도 그 참조가 가리키는 객체의 내부 값은 변경될 수 있다.

```kotlin
val languages = arrayListOf("Java")
languages.add("Kotlin")
```

var 키워드를 사용하면 변수의 값을 변경할 수 있지만 변수의 타입은 고정돼 바뀌지 않는다.

```kotlin
var answer = 42
answer = "no answer" // 컴파일 오류 발생
```

### 더 쉽게 문자열 형식 지정: 문자열 템플릿

문자열 리터럴의 필요한 곳에 변수를 넣되 변수 앞에 $를 추가해야 한다.

```kotlin
fun main(args: Array<String>) {
		val name = if (args.size > 0) args[0] else "Kotlin"
		println("Hello, $name")
}
```

$ 문자를 문자열에 넣고 싶으면 println("\\$x")와 같이 \를 사용해 $를 이스케이프시켜야 한다.

## 클래스와 프로퍼티

이전에 만든 자바 Person 클래스를 다시 살펴보자.

```kotlin
public class Person {
		private final String name;

		public Person(String name) {
				this.name = name;
		}

		public String getName() {
				return name;
		}
}
```

자바-코틀린 변환기를 써서 방금 본 Person 클래스를 코틀린으로 변환해보자.

```kotlin
class Person(val name: String)
```

자바로 코틀린으로 변환한 결과, public 가시성 변경자가 사라졌음을 확인하였다. 코틀린의 기본 가시성은 public이므로 이런 경우 변경자를 생략해도 된다.

### 프로퍼티

자바에서는 필드와 접근자(getter, setter)를 한데 묶어 프로퍼티라고 부르며, 프로퍼티라는 개념을 활용하는 프레임워크가 많다. 코틀린은 프로퍼티를 언어 기본 기능으로 제공하며, 코틀린 프로퍼티는 자바의 필드와 접근자 메소드를 완전히 대신한다.

```kotlin
class Person(
		val name: String, // 읽기 전용 프로퍼티로, 코틀린은 (비공개) 필드와 필드를 읽는 단순한 (공개) 게터를 만들어 낸다. 
		var isMarried: Boolean // 쓸 수 있는 프로퍼티로, 코틀린은 (비공개)필드, (공개) 게터/세터를 만들어 낸다. 
)
```

{% hint style="info" %}
**프로퍼티 팁** \
\
자바에서는 getName과 setName이라는 접근자를 제공하는 자바 클래스를 코틀린에서 사용할 때는 name이라는 프로퍼티를 사용할 수 있다.
{% endhint %}

### 코틀린 소스코드 구조: 디렉터리와 패키지

코틀린에서는 클래스 임포트와 함수 임포트에 차이가 없으며, 모든 선언을 import 키워드로 가져올 수 있다. 최상위 함수는 그 이름을 써서 임포트할 수 있다.

```kotlin
package geometry.example

import geometry.shapes.createRandomRectangle // 이름으로 함수 임포트하기

fun main(args: Array<String>) {
    println(createRandomRectangle().isSquare) // "true"가 아주 드물게 출력된다. 
}
```

## 선택 표현과 처리: enum과 when

when은 자바의 switch를대치하되 훨씬 더 강력하며, 앞으로 더 자주 사용할 프로그래밍 요소라고 생각할 수 있다.

### enum 클래스 정의

자바와 마찬가지로 enum은 단순히 값만 열거하는 존재가 아니다. enum 클래스 안에도 프러퍼티나 메소드를 정의할 수 있다.

```kotlin
enum class Color(
        val r: Int, val g: Int, val b: Int
) {
    RED(255, 0, 0), ORANGE(255, 165, 0),
    YELLOW(255, 255, 0), GREEN(0, 255, 0), BLUE(0, 0, 255),
    INDIGO(75, 0, 130), VIOLET(238, 130, 238);

    fun rgb() = (r * 256 + g) * 256 + b
}
```

enum 클래스 안에 메소드를 정의하는 경우 반드시 enum 상수 목록과 메소드 정의 사이에 세미콜론을 넣어야 한다.

### when으로 enum 클래스 다루기

자바의 switch와 달리 when 절에서는 각 분기의 끝에 break를 넣지 않아도 된다.

```kotlin
fun getMnemonic(color: Color) =
  when (color) {
      Color.RED -> "Richard"
      Color.ORANGE -> "Of"
      Color.YELLOW -> "York"
      Color.GREEN -> "Gave"
      Color.BLUE -> "Battle"
      Color.INDIGO -> "In"
      Color.VIOLET -> "Vain"
}
```

### when과 임의의 객체를 함께 사용

코틀린에서 when은 자바의 switch보다 훨씬 더 강력하다. 분기 조건에 상수만을 사용할 수 있는 자바 switch와 달리 코틀린 when의 분기 조건은 임의의 객체를 허용한다.

```kotlin
fun mix(c1: Color, c2: Color) =
		when (setOf(c1, c2)) {
		    setOf(RED, YELLOW) -> ORANGE
		    setOf(YELLOW, BLUE) -> GREEN
		    setOf(BLUE, VIOLET) -> INDIGO
		    else -> throw Exception("Dirty color")
		}
```

### 인자 없는 when 사용

이전의 함수는 비교대상을 Set 인스턴스를 생성한다. 보통은 이런 비효율성이 크게 문제가 되지 않는다. 하지만 이 함수가 아주 자주 호출된다면 불필요한 가비지 객체가 늘어나는 것을 방지하기 위해 함수를 고쳐 쓰는 편이 낫다.

```kotlin
fun mixOptimized(c1: Color, c2: Color) =
    when {
        (c1 == RED && c2 == YELLOW) ||
        (c1 == YELLOW && c2 == RED) ->
            ORANGE

        (c1 == YELLOW && c2 == BLUE) ||
        (c1 == BLUE && c2 == YELLOW) ->
            GREEN

        (c1 == BLUE && c2 == VIOLET) ||
        (c1 == VIOLET && c2 == BLUE) ->
            INDIGO

        else -> throw Exception("Dirty color")
    }
```

추가 객체를 만들지 않는다는 장점이 있지만 가독성은 더 떨어진다.

### 스마트 캐스트: 타입 검사와 타입 캐스트를 조합

코틀린에서는 is를 사용해 변수 타입을 검사한다. is 검사는 자바의 instanceof와 비슷하다. 하지만 자바에서 어떤 변수의 타입을 instanceof로 확인한 다음에 그 타입에 속한 멤버에 접근하기 위해서는 명시적으로 변수 타입을 캐스팅해야 한다. 코틀린에서는 프로그래머 대신 컴파일러가 캐스팅을 해준다. 이를 스마트캐스트라고 부른다.

```kotlin
fun eval(e: Expr): Int {
    if (e is Num) {
        val n = e as Num
        return n.value
    }
    if (e is Sum) {
        return eval(e.right) + eval(e.left)
    }
    throw IllegalArgumentException("Unknown expression")
}
```

### 리팩토링: if를 when으로 변경

코틀린에서는 if가 값을 만들어내기 때문에 자바와 달리 3항 연산자가 따로 없다.

```kotlin
fun eval(e: Expr): Int =
    if (e is Num) {
        e.value
    } else if (e is Sum) {
        eval(e.right) + eval(e.left)
    } else {
        throw IllegalArgumentException("Unknown expression")
    }
```

when 식을 앞에서 살펴본 값 동등성 검사가 아닌 다른 기능에도 쓸 수 있다.

```kotlin
fun eval(e: Expr): Int =
    when (e) {
        is Num ->
            e.value
        is Sum ->
            eval(e.right) + eval(e.left)
        else ->
            throw IllegalArgumentException("Unknown expression")
    }
```

## 대상을 이터레이션: while과 for 루프

코틀린의 while루프는 자바와 동일하다. for는 자바의 for-each 루프에 해당하는 형태만 존재한다.

### 수에 대한 이터레이션: 범위와 수열

100부터 거꾸로 세되 짝수만으로 게임을 진행되도록 만들어보자.

```kotlin
fun main(args: Array<String>) {
    for (i in 100 downTo 1 step 2) {
        print(fizzBuzz(i))
    }
}
```

여기서는 증가 값 step을 갖는 수열에 대해 이터레이션한다. 증가 값을 사용하면 수를 건너 띌 수 있다. 증가 값을 음수로 만들면 정방향 수열이 아닌 역방향 수열을 만들 수 있다. 이 예제에서 100 downTo 1은 역방향 수열을 만든다.

### in으로 컬렉션이나 범위의 원소 검사

in 연산자를 사용해 어떤 값이 범위에 속하는지 검사할 수 있다. 반대로 !in을 사용하면 어떤 값이 범위에 속하지 않는지 검사할 수 있다.

```kotlin
fun recognize(c: Char) = when (c) {
    in '0'..'9' -> "It's a digit!"
    in 'a'..'z', in 'A'..'Z' -> "It's a letter!"
    else -> "I don't know…"
}
```

## 코틀린의 예외 처리

코틀린의 예외처리는 자바나 다른 언어의 예외 처리와 비슷하다. 함수는 정상적으로 종료할 수 있지만 오류가 발생하면 예외를 던질 수 있다.

```kotlin
// 조건이 참이면 number의 값이 초기화되고 거짓이면 초기화되지 않고 throw를 호출한다. 
val number = try {
    Integer.parseInt(reader.readLine())
} catch (e: NumberFormatException) {
    return // 예외가 발생한 경우 catch 블록 다음의 코드는 실행되지 않는다. 
}
```

### try, catch, finally

자바 코드와 가장 큰 차이는 throws절이 코드에 없다는 점이다. 자바에서는 함수를 작성할 떄 함수 선언 뒤에 throws IOException을 붙여야 한다. (IOExption이 체크 예외이기 때문이다.)

자바 7의 자원을 사용하는 try-with-resoucr는 어떨까? 코틀린은 그런 경우를 위한 특별한 문법을 제공하지 않는다. 하지만 라이브러리 함수로 같은 기능을 구현한다. (해당 내용은 8장에서 살펴보기로 한다.)

### try를 식으로 사용

이전의 예제를 다시 살펴보자

```kotlin
// 조건이 참이면 number의 값이 초기화되고 거짓이면 초기화되지 않고 throw를 호출한다. 
val number = try {
    Integer.parseInt(reader.readLine())
} catch (e: NumberFormatException) {
    return // 예외가 발생한 경우 catch 블록 다음의 코드는 실행되지 않는다. 
}
```

코틀린의 try 키워드는 if나 when과 마찬가지로 식이다. 따라서 try의 값을 변수에 대입할 수 있다.

## 요약

* 함수를 정의할 때 fun 키워드를 사용한다. val과 var는 각각 읽기 전용 변수와 변경 가능한 변수를 선언할 때 쓰인다.
* 문자열 템플릿을 사용하면 문자열을 연결하지 않아도 되므로 코드가 간결해진다. 변수 이름 앞에 $를 붙이거나, 식을 ${식}처럼 ${ }로 둘러싸면 변수나 식의 값을 문자열 안에 넣을 수 있다.
* 코틀린에서는 값 객체 클래스를 아주 간결하게 표현할 수 있다.
* 다른 언어에도 있는 if는 코틀린에서 식이며, 값을 만들어낸다.
* 코틀린 when은 자바의 switch와 비슷하지만 더 강력하다.
* 어떤 변수의 타입을 검사하고 나면 굳이 그 변수를 캐스팅하지 않아도 검사한 타입의 변수처럼 사용할 수 있다. 그런 경우 컴파일러가 스마트 캐스트를 활용해 자동으로 타입을 바꿔준다.
* for, while, do-while 루프는 자바가 제공하는 같은 키워드의 기능과 비슷하다. 하지만 코틀린의 for는 자바의 for 보다 더 편리하다. 특히 맵을 이터레이션하거나 이터레이션하면서 컬렉션의 원소와 인덱스를 함꼐 사용해야 하는 경우 코틀린의 for가 더 편리하다.
* 1..5와 같은 식은 범위를 만들어낸다. 범위와 수열은 코틀린에서 같은 문법을 사용하며, for 루프에 대해 같은 추상화를 제공한다. 어떤 값이 범위 안에 들어있거나 들어있지 않은지 검사하기 위해서 in이나 !in을 사용한다.
* 코틀린 예외 처리는 자바와 비슷하다. 다만 코틀린에서는 함수가 던질 수 있는 예외를 선언하지 않아도 된다.
