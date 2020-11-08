---
description: KOTLIN 공식 레퍼런스 BASIC 챕터를 번역한 내용입니다.
---

# BASIC

## BASIC Types

> 참고 URL : [https://kotlinlang.org/docs/reference/basic-types.html](https://kotlinlang.org/docs/reference/basic-types.html)

코틀린에서는, 어떤 변수라도 멤버 함수와 속성을 호출 할 수 있다는 점에서 모든 것은 객체로 볼 수 있다. 일부 타입은 특수 표현 내부 표현을 가질 수 있다. 예를 들어 number, character, boolean 타입은 런타임에 원시 타입 값으로 표현될 수 있지만, 사용자에게는 일반 클래스처럼 보일 수 있다.

### Numbers

코틀린은 숫자를 표현하는 기본 제공 유형 집합을 제공한다.

[숫자를 표현하는 기본 제공 유형 종류](https://www.notion.so/b95f6c5c579f433d919e347c91bc2334)

Int의 최대 값을 초과하지 않는 정수 값으로 초기화 된 모든 변수는 Int 유형이 유추된다. 초기 값이 Int 범위를 초과하면 유형은 Long으로 선언된다. Long 값을 명시 적으로 지정하려면 값에 접미사 L을 추가하면 된다.

```text
val one = 1 // Int
val threeBillion = 3000000000 // Long
val oneLong = 1L // Long
val oneByte: Byte = 1
```

부동 소수점 숫자의 경우 Kotlin은 Float 및 Double 유형을 제공한다. IEEE 754 표준에 따르면 부동 소수점 유형은 저장할 수 있는 소수점 자릿수에 따라 다르다. Float은 IEEE 754 단일 정밀도를 반영하고, Double은 두배의 정밀도를 반영한다.

[부동 소수점 종류](https://www.notion.so/43bd5b12d1174e2292a4b7015630b27a)

분수로 초기화 된 변수의 경우 컴파일러는 Double 유형으로 유추하게 된다. 값에 대해 부동 소수점 유형을 명시적으로 지정하려면 접미사 f 또는 F를 추가하면 된다. 부동 소수점이 7자리 이상일 경우 자동으로 반올림처리 된다.

```text
val pi = 3.14 // Double
val e = 2.7182818284 // Double
val eFloat = 2.7182818284f // Float, actual value is 2.7182817
```

#### Underscores in numeric literals

밑줄을 사용하여 숫자 상수를 더 읽기 쉽게 사용할 수 있다.

```text
val oneMillion = 1_000_000
val creditCardNumber = 1234_5678_9012_3456L
val socialSecurityNumber = 999_99_9999L
val hexBytes = 0xFF_EC_DE_5E
val bytes = 0b11010010_01101001_10010100_10010010
```

#### Representation

Java 플랫폼에서 숫자는 nullable 숫자가 필요하지 않거나 제네릭이 관련되지 않는 한 JVM 원시 타입으로 저장된다.

```text
val a: Int = 100
val boxedA: Int? = a
val anotherBoxedA: Int? = a

val b: Int = 10000
val boxedB: Int? = b
val anotherBoxedB: Int? = b

println(boxedA === anotherBoxedA) // true
println(boxedB === anotherBoxedB) // false
```

#### Operations

Kotlin은 산술연산을 지원하지만 컴파일러는 해당 명령어에 따라 호출을 최적화하기 때문에 주의해야 한다.

Division of integers

```text
// case 1. 정수 간 나누기는 항상 정수를 반환한다. 
val x1 = 5 / 2
//println(x == 2.5) // ERROR: Operator '==' cannot be applied to 'Int' and 'Double'
println(x1 == 2) // true

// case 2. 이는 두 정수 유형 사이의 분할에 해당된다.  
val x2 = 5L / 2
println(x2 == 2L) // true

// case 3. 부동 소수점 유형을 반환하려면 인수 중 하나를 부동 소수점 유형으로 명시적으로 변환한다. 
val x3 = 5 / 2.toDouble()
println(x3 == 2.5) // true
```

### Strings

문자열은 변경할 수 없으며 문자열의 요소는 인덱싱 작업으로 엑세스 할 수 있다.

```text
for (c in str) {
    println(c)
}
```

#### String literals

코틀린에는 두 가지 타입의 문자열 리터럴을 가질 수 있다.

* 이스케이프된 문자열 : 이스케이프된 문자열을 포함한 문자열
* 단순 문자열 : 줄 바꿈이나 임의의 텍스트를 포함한 문자열

```text
val s = "Hello, world!\\n"
```

단순 문자열은 삼중 따옴표로 구분되며 이스케이프를 삼중 따옴표로 구분되며 이스케이프를 포함하지 않으며 줄 바꿈 및 기타 문자를 포함할 수 있다.

```text
val text = """
    for (c in "foo")
        print(c)
"""
```

trimMargin \(\) 함수로 선행 공백을 제거 할 수 있다.

```text
val text = """
    |Tell me and I forget.
    |Teach me and I remember.
    |Involve me and I learn.
    |(Benjamin Franklin)
    """.trimMargin()

// result
length is 3
Tell me and I forget.
Teach me and I remember.
Involve me and I learn.
(Benjamin Franklin)
```

기본적으로 '\|' 문자는 여백 접두사로 사용되지만 trimMargin\("&gt;"\)과 같은 매개 변수로 사용할 수도 있다.

## Control Flow: if, when, for, while

> 참고 URL : [https://kotlinlang.org/docs/reference/control-flow.html](https://kotlinlang.org/docs/reference/control-flow.html)

### If Expression

if 브랜치가 블록이 될 수 있고, 블록의 마지막 표현식이 블록의 결과 값이 된다.

```text
val max = if (a > b) {
    print("Choose a")
    a
} else {
    print("Choose b")
    b
}
```

만약 if 문을 표현식 대신에 값을 할당하는 블록으로 대신할 경우 eles 브랜치는 필수로 정의해야 한다.

### When Expression

when 표현식은 C 언어와 유사하다.

```text
when (x) {
    1 -> print("x == 1")
    2 -> print("x == 2")
    else -> { // Note the block
        print("x is neither 1 nor 2")
    }
}
```

만약 다양한 케이스가 동일한 방식으로 처리된다면 콤마로 구분하여 중복 사용할 수 있다.

```text
when (x) {
    0, 1 -> print("x == 0 or x == 1")
    else -> print("otherwise")
}
```

조건문에 범위를 사용할 수 있다.

```text
when (x) {
    in 1..10 -> print("x is in the range")
    in validNumbers -> print("x is valid")
    !in 10..20 -> print("x is outside the range")
    else -> print("none of the above")
}
```

또 다른 사용법으로는 특정 타입을 is 또는 !is 를 사용하여 구분할 수 있다.

```text
fun hasPrefix(x: Any) = when(x) {
    is String -> x.startsWith("prefix")
    else -> false
}
```

### For Loops

for 루프는 반복자를 제공하는 모든 항목을 반복할 수 있다. 이는 C\#과 같은 언어의 foreach 루프와 동일하다.

```text
// case 1. 단순 for loop
for (item in collection) print(item)

// case 2. loop 내에 블록문이 필요할 경우
for (item: Int in ints) {
    // ...
}
```

만약 Array를 루프돌 경우에는 인덱스가 필요할 수 있다.

```text
// case 1. indices를 사용하여 인덱스를 추출한다. 
for (i in array.indices) {
    println(array[i])
}

// case 2. withIndex 메소드를 사용하여 인덱스와 값을 추출할 수 있다. 
for ((index, value) in array.withIndex()) {
    println("the element at $index is $value")
}
```

### While Loops

이는 Java와 동일하다

```text
while (x > 0) {
    x--
}

do {
    val y = retrieveData()
} while (y != null) // y is visible here!
```

## Returns and Jumps

> 참고 URL : [https://kotlinlang.org/docs/reference/returns.html](https://kotlinlang.org/docs/reference/returns.html)

Kotlin에는 세 가지 구조적 점프 표현식이 있다.

* return : 기본적으로 가장 근접한 함수 또는 익명 함수에서 반환한다.
* break : 가장 근접한 루프문을 중단한다.
* continue : 가장 근접한 루프문의 다음 단계를 진행한다.

### Break and Continue Labels

Kotlin의 모든 표현식은 라벨로 표시 될 수 있다. break 또는 continue에 라벨을 함께 사용하면 된다.

```text
loop@ for (i in 1..100) {
    for (j in 1..100) {
        if (...) break@loop
    }
}
```

### Return at Labels

return 키워드를 사용하면 가장 근접한 메소드를 종료 한다.

```text
fun foo() {
    listOf(1, 2, 3, 4, 5).forEach {
        if (it == 3) return // non-local return directly to the caller of foo()
        print(it)
    }
    println("this point is unreachable")
}

// result 
12
```

람다식에서 반환해야 하는 경우 라벨을 지정하고 반환을 한정할 수 있다.

```text
fun foo() {
    listOf(1, 2, 3, 4, 5).forEach lit@{
        if (it == 3) return@lit // local return to the caller of the lambda, i.e. the forEach loop
        print(it)
    }
    print(" done with explicit label")
}

// result
// 1245 done with explicit label
```

라벨을 사용하지 않아도 인접한 루프문으로 암시적으로 사용할 수 있다.

```text
fun foo() {
    listOf(1, 2, 3, 4, 5).forEach {
        if (it == 3) return@forEach // local return to the caller of the lambda, i.e. the forEach loop
        print(it)
    }
    print(" done with implicit label")
}

// result
// 1245 done with implicit label
```

익명 함수의 return 문은 익명 함수 자체에서 반환한다.

```text
fun foo() {
    listOf(1, 2, 3, 4, 5).forEach(fun(value: Int) {
        if (value == 3) return  // local return to the caller of the anonymous fun, i.e. the forEach loop
        print(value)
    })
    print(" done with anonymous function")
}

// result
// 1245 done with implicit label
```

앞의 세 가지 예에서 로컬 리턴을 사용하는 것은 일반 루프에서 continue를 사용하는 것과 유사하다. break에 직접 해당하는 것은 없지만 라벨을 사용하여 유사하게 사용할 수 있다.

```text
fun foo() {
    run loop@{
        listOf(1, 2, 3, 4, 5).forEach {
            if (it == 3) return@loop // non-local return from the lambda passed to run
            print(it)
        }
    }
    print(" done with nested loop")
}

// result
// 12 done with nested loop
```

