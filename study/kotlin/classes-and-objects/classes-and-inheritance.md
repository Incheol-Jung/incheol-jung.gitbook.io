---
description: KOTLIN 공식 레퍼런스 Classes and Inheritance 챕터를 번역한 내용입니다.
---

# Classes and Inheritance

> 참고 URL : [https://kotlinlang.org/docs/reference/classes.html](https://kotlinlang.org/docs/reference/classes.html)

## Constructors

코틀린에서 클래스는 주 생성자와 이차 생성자를 가지고 있다. 주 생성자는 클래스 헤더의 부분이다.

```text
class Person constructor(firstName: String) { /*...*/ }
class Person(firstName: String) { /*...*/ } // constructor는 생략 가능하다
```

주 생성자에는 어떤 구현 코드도 들어갈 수 없으므로 초기화를 희망하는 코드는 init 키워드를 사용하여 초기화 가능하다.

```text
class InitOrderDemo(name: String) {
    val firstProperty = "First property: $name".also(::println)
    
    init {
        println("First initializer block that prints ${name}")
    }
    
    val secondProperty = "Second property: ${name.length}".also(::println)
    
    init {
        println("Second initializer block that prints ${name.length}")
    }
}

// result
First property: hello
First initializer block that prints hello
Second property: 5
Second initializer block that prints 5
```

기본 생성자의 매개 변수는 초기화 블록에서 사용할 수 있다.

```text
class Customer(name: String) {
    val customerKey = name.toUpperCase()
}
```

### Secondary constructors

클래스에서 이차 생성자를 사용할 수 있으며, constructor 키워드를 접두사로 사용하면 된다.

```text
class Person {
    var children: MutableList<Person> = mutableListOf<>()
    constructor(parent: Person) {
        parent.children.add(this)
    }
}
```

클래스에 주 생성자가 있는 경우 이차 생성자는 주 생성자를 직접 또는 간접적으로 기본 생성자에 위임해야 한다. 동일한 클래스의 다른 생성자에 대한 위임은 this 키워드를 사용하여 수행된다.

```text
class Person(val name: String) {
    var children: MutableList<Person> = mutableListOf<>()
    constructor(name: String, parent: Person) : this(name) {
        parent.children.add(this)
    }
}
```

초기화 블록과 이차 생성자를 함께 정의할 경우, 실행 순서는 초기화 블록이 먼저 수행되고 이차 생성자가 수행된다.

```text
class Constructors {
    init {
        println("Init block")
    }

    constructor(i: Int) {
        println("Constructor")
    }
}

// result
// Init block
// Constructor
```

## Class members

* 생성자 및 초기화 블록
* 함수
* 속성
* 중첩 클래스와 내장 클래스
* 객체 선언

## Inheritance

코틀린 내의 모든 클래스들은 Any 라는 슈퍼 클래스를 가지고 있다. Any 클래스는 다양한 메소드를 가지고 있다. \(ex. equals\(\), hashCode\(\), toString\(\)\)

```text
class Example
```

기본적으로 코틀린 클래스들은 final로 되어 있어 상속 받을 수 없다. 만약 상속 가능한 클래스를 생성하려면 open 키워드를 추가해야 한다.

```text
open class Base(p: Int) // Class is open for inheritance

class Derived(p: Int) : Base(p)
```

만약 주 생성자를 가지지 않은 파생클래스가 있다면, 각각의 이차 생성자는 super 키워드를 사용하여 초기화해야 한다.

```text
class MyView : View {
    constructor(ctx: Context) : super(ctx)

    constructor(ctx: Context, attrs: AttributeSet) : super(ctx, attrs)
}
```

## Overriding methods

이전에 설명한 클래스와 동일하게 코틀린에서는 재정의 가능한 멤버는 open 키워드를 붙여주어야 한다.

```text
open class Shape {
    open fun draw() { /*...*/ }
    fun fill() { /*...*/ }
}

class Circle() : Shape() {
    override fun draw() { /*...*/ }
}
```

Circle 클래스에서는 override 키워드를 꼭 붙어야 한다. 그렇지 않으면 ide에서 컴파일 오류가 발생할 것이다. 재정의로 표시된 멤버는 자체적으로 열려 있기 때문에 하위 클래스를 상속 받은 다른 하위 클래스도 재정의 할 수 있다. 그러므로 멤버를 재정의하는 것을 파생되지 않기 위해서는 final 키워드를 붙여야 한다.

```text
open class Rectangle() : Shape() {
    final override fun draw() { /*...*/ }
}
```

## Overriding properties

속성 또한 메소드와 동일하게 open 키워드를 사용하여 재정의 할 수 있다. 선언된 각 속성은 초기화가 있는 속성 또는 get 메서드가 있는 속성으로 재정의 될 수 있다.

```text
open class Shape {
    open val vertexCount: Int = 0
}

class Rectangle : Shape() {
    override val vertexCount = 4
}
```

속성은 val 속성을 var 키워드의 속성으로 재정의 할 수도 있다. 하지만 그 반대는 허용하지 않는다. 왜냐하면 val 속성은 get 메소드만 정의되어 있고, var 키워드는 set 메소드가 추가정으로 정의되어 있기 때문이다.

```text
interface Shape {
    val vertexCount: Int
}

class Rectangle(override val vertexCount: Int = 4) : Shape // Always has 4 vertices

class Polygon : Shape {
    override var vertexCount: Int = 0  // Can be set to any number later
}
```

## 파생 클래스 초기화 우선 순위

```text
open class Base(val name: String) {

    init { println("Initializing Base") }

    open val size: Int = 
        name.length.also { println("Initializing size in Base: $it") }
}

class Derived(
    name: String,
    val lastName: String,
) : Base(name.capitalize().also { println("Argument for Base: $it") }) {

    init { println("Initializing Derived") }

    override val size: Int =
        (super.size + lastName.length).also { println("Initializing size in Derived: $it") }
}

// Constructing Derived("hello", "world")

// results
// Argument for Base: Hello
// Initializing Base
// Initializing size in Base: 5
// Initializing Derived
// Initializing size in Derived: 10
```

순서를 보면 부모 클래스의 주 생성자와 초기화 블록이 먼저 실행되고 파생 클래스의 생성자와 초기화 블록이 실행되는 것을 확인할 수 있다.

## 부모 클래스 구현 호출하기

부모 클래스의 메소드를 호출하려면 super 키워드를 사용하면 된다.

```text
open class Rectangle {
    open fun draw() { println("Drawing a rectangle") }
    val borderColor: String get() = "black"
}

class FilledRectangle : Rectangle() {
    override fun draw() {
        super.draw()
        println("Filling the rectangle")
    }

    val fillColor: String get() = super.borderColor
}
```

또는 파생 클래스일 경우, 외부 클래스명을 함께 표시하면 된다.

```text
class FilledRectangle: Rectangle() {
    fun draw() { /* ... */ }
    val borderColor: String get() = "black"
    
    inner class Filler {
        fun fill() { /* ... */ }
        fun drawAndFill() {
            super@FilledRectangle.draw() // Calls Rectangle's implementation of draw()
            fill()
            println("Drawn a filled rectangle with color ${super@FilledRectangle.borderColor}") // Uses Rectangle's implementation of borderColor's get()
        }
    }
}
```

## 재정의 규칙

코틀린에서, 구현 상속은 다음 규칙에 의해 정해진다. : 만약 여러개의 구현을 상속받은 클래스가 있다면, super 키워드와 동시에 supertype을 명시해 주어야 한다.

```text
open class Rectangle {
    open fun draw() { /* ... */ }
}

interface Polygon {
    fun draw() { /* ... */ } // interface members are 'open' by default
}

class Square() : Rectangle(), Polygon {
    // The compiler requires draw() to be overridden:
    override fun draw() {
        super<Rectangle>.draw() // call to Rectangle.draw()
        super<Polygon>.draw() // call to Polygon.draw()
    }
}
```

## 추상 클래스

클래스와 그 멤버 중 일부는 추상으로 선언될 수 있다. 추상 멤버는 해당 클래스에 구현이 없기 때문에 open으로 재정의 해야 한다는 표현을 할 필요가 없다.

```text
open class Polygon {
    open fun draw() {}
}

abstract class Rectangle : Polygon() {
    abstract override fun draw()
}
```

## 상수형 오브젝트

만약 인스턴스 생성 없이 메소드나 멤버 변수를 제공하고 싶을 경우엔 companion을 사용하여 static으로 제공할 수 있다.

```text
class MyClass {
    companion object Factory {
        fun create(): MyClass = MyClass()
    }
}

val instance = MyClass.create()
```

