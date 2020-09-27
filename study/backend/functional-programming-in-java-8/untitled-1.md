---
description: Functional Programming in Java 8의 Chapter 3을 요약한 내용 입니다.
---

# Chap 03. String, Comparator, 그리고 filter

JDK는 함수형 스타일을 더 잘 활용할 수 있도록 하는 컨비니언스 메서드\(Convenience Method\)를 포함시키는 방향으로 발전되어 왔다. 그러므로 이전 기능을 대신할 수 있는 새로운 함수들을 찾아봐야 할 필요가 있다. 또한 메서드만을 갖는 anonymous inner class를 사용하는 경우에는 람다 표현식을 사용하여 기존의 장환한 코드를 간결하게 줄일 수 있다.

## 스트링 이터레이션

chars\(\) 메서드는 CharSequence 인터페이스로부터 파생한 String 클래스에 있는 새로운 메서드다. 이를 이용해 다양한 예제를 살펴보자

```java
final String str = "w00t"

str.chars()
		.forEach(ch -> System.out.println(ch));

// result
// 119
// 48
// 48
// 116
```

이 결과는 우리가 의도한 결과는 아니다. 우리는 문자열을 통해서 문자를 루프문 돌면서 출력하고 싶었다. 그러면 다시 수정해보자.

```java
class IterateString {
	private static void printChar(int aChar) {
		System.out.println((char)(aChar));
	}
}

// case 1. Custom static 함수 이용
str.chars()
		.forEach(IterateString::printChar);

// case 2. Character 클래스 static 함수 이용
str.chars()
	.mapToObj(ch -> Character.valueOf((char)ch))
	.forEach(System.out::println);

// result
// w
// 0
// 0
// t
```

이번엔 스트링에서 숫자\(digit\)로 필터링할 수 있다.

```java
// case 1. 람다만 이용하여 표현
str.chars()
	.filter(ch -> Character.isDigit(ch))
	.forEach(ch -> printChar(ch));

// case 2. 메소드 레퍼런스를 이용한 표현
str.chars()
	.filter(ch -> Character.isDigit(ch))
	.forEach(ch -> printChar(ch));

// result
// 0
// 0
```

인스턴스 메서드와 정적 메서드는 구조적으로 같은 것처럼 보인다. 예를 들어, String::toUppercase와 Character::isDigit을 보면 비슷한 구조처럼 보인다. 파라미터를 어떻게 라우팅할지 결정하기 위해, 자바 컴파일러는 메서드가 인스턴스 메서드인지 아니면 정적 메서드인지를 체크한다.

체크해서 인스턴스 메서드이면 합성된 메서드의 파라미터는 호출하는 타깃이 된다. parameter.toUppercase\(\);와 같은 경우이다. 반대로 메서드가 정적이면, 합성된 메서드에 대한 파라미터는 이 메서드의 인수로 라우팅된다. Character.isDigit\(parameter\);와 같은 경우이다.

### 파라미터 라우팅은 한 가지 문제가 있다.

메서드의 충돌과 결과의 모호함이다. 인스턴스 메서드와 정적 메서드 모두 제공한다고 하면 컴파일러는 어떤 메서드를 사용해야 할지 결정할 수 없기 때문에 컴파일 오류가 발생한다. 예를 들어, Double의 인스턴스를 String으로 변환하기 위해 Double::toString라고 작성했다면, 컴파일러는 public String의 toString\(\) 인스턴스 메서드를 사용해야 하는지, 정적 메서드인 public static String toString\(double value\)를 사용해야 하는지 혼동을 일으킬 수 밖에 없다.

![](../../../.gitbook/assets/111%20%288%29.png)

함수형 스타일에 익숙해지면, 람다 표현식과 더 간결한 메서드 레퍼런스 중 본인이 사용하기 편한 것을 선택해서 사용할 수 있다.

## Comparator 인터페이스의 구현

Comparator 인터페이스는 JDK 라이브러리의 코드에서 수도 없이 사용된다. 검색 오퍼레이션부터 정렬, 리버싱\(Revering\) 등에서 많이 사용된다. 자바8에서 이 인터페이스는 함수형 인터페이스로 변경되면서 comparator를 구현하기 위한 다양한 기법들을 사용하면 맣은 이점을 얻을 수 있었다.

### Comparator를 사용한 정렬

```java
@Getter
@Setter
public class Person {

    private final String name;
    private final int age;

    public Person(String name, int age) {
        this.name = name;
        this.age = age;
    }

    public int ageDifference(final Person other) {
        return age - other.age;
    }
}

public static void main(String[] args) {
    List<Person> people = new ArrayList<>();
    people.stream()
					.sorted((person1, person2) -> person1.ageDifference(person2))
					.collect(toList());
}
```

Comparator의 compareTo\(\) 추상 메서드는 두 개의 파라미터를 가지며, 하나는 비교할 객체이고, 다른 하나는 int 타입의 리턴값이다. 이 파라미터를 사용하여 람다 표현식은 두 개의 파라미터를 갖게 되며 Person에 대한 두 개의 인스턴스와 자바 컴파일러가 추론하게 될 인스턴스의 타입이다.

aggDifference의 값이 0이면 두 개의 값이 같다고 알려준다. 그렇지 않고, 음수 값을 리턴하면, 첫 번째 사람이 더 어리다는 의미이며 양수 값을 리턴하면 첫 번째 사람이 더 나이가 많다는 것을 알려준다.

sorted\(\)에 대한 호출 부분을 더 향상시킬 수 있다.

```java
people.stream().sorted(Person::ageDifference).collect(toList());
```

코드가 상당히 간결해졌다. 코드가 간결해질 수 있는 이유는 자바 컴파일러가 제공한 메서드-레퍼런스 편리성 때문이다. 컴파일러는 비교할 대상인 두 개의 person 인스턴스를 가지며 첫 번째 파라미터는 aggDifference\(\) 메서드의 타깃을 만들고 두 번째는 그 메서드에 대한 파라미터를 만든다.

### Comparator의 재사용

나이를 오름차순으로 쉽게 정렬했다. 마찬가지로 내림차순으로 정렬하는 것도 쉽다.

```java
public static void main(String[] args) {
    List<Person> people = new ArrayList<>();
    people.stream()
					.sorted((person1, person2) -> person2.ageDifference(person1))
					.collect(toList());
}
```

하지만 이는 DRY\(Don't Repeat Yourself\) 원칙을 깨는 것이다. JDK는 Comparator에 있는 reveresed\(\) 메서드를 통해 가능하다. 중복 작업 대신 비교 결과를 역순으로 만들기 위해서 간단하게 첫 번째 Comparator에서 revered\(\)를 호출하면 비교 결과가 역순으로 된 다른 Comparator를 얻을 수 있다.

```java
Comparator<Person> compareAscending = (person1, person2) -> person1.ageDifference(person2);
Comparator<Person> compareDescending = compareAscending.reversed();

people.stream().sorted(compareDescending).collect(toList());
```

또는 나이 순으로 정렬했지만 이름 순으로 정렬하는 것 역시 간단하다. 이름을 알파벳의 오름차순으로 정렬해보자.

```java
// 이름 순으로 정렬
people.stream()
			.sorted((person1, person2) -> person1.getName().compareTo(person2.getName()))
			.collect(toList());

// 이름 순으로 정렬 메소드 레퍼런스
people.stream()
			.sorted(Comparator.comparing(Person::getName))
			.collect(toList());
```

그럼 다음은 리스트에서 가장 젊은 사람을 선택해보자.

```java
people.stream()
			.min(Person::ageDifference)
			.ifPresent(youngest -> System.out.println("youngest: " + youngest));
```

min\(\) 메서드는 Optional을 리턴하는데 그 이유는 리스트가 비어 있을 수 있고 따라서 가장 어린 사람이 없을 수 있기 때문이다.

## 여러 가지 비교 연산

Comparator 인터페이스에 추가된 새로운 편리한 메서드에 대해 알아보자. 그리고 이 새로운 메서드를 사용하여 다중 속성을 좀 더 쉽게 비교해보자.

```java
final Function<Person, String> byName = person -> person.getName();
people.stream().sorted(comparing(byName));
```

comparing 메서드는 Comparator를 생성하기 위해 제공된 람다 표현식의 로직을 사용한다. 다시 말하면, 이 메서드는 고차 함수라는 의미이며 하나의 함수\(Function\)를 갖고 다른 것\(Comparator\)를 리턴한다는 의미다. 이 기능을 사용하여 다중 비교를 더욱 다양하게 사용할 수 있다.

```java
final Function<Person, Integer> byAge = person -> person.getAge();
people.stream().sorted(comparing(byAge).thenComparing(byName));
```

comparing 메소드에서 리턴된 Comparator에서는 thenComparing\(\) 메서드를 호출해서 나이와 이름 두 값에 따라 비교하는 복합\(composite\) comparator를 생성하게 된다.

### collect 메서드와 Collectors 클래스 사용하기

ArrayList에서 스트림 엘리먼트를 얻기 위해 예제에서 이미 여러 번 collect\(\)메서드를 사용했다. collect\(\) 함수에서는 Collects 클래스의 utility 메서드들과 조합하여 사용할 때, 더욱 편리하다.

원본 리스트에서 20살 이상의 사람들만을 추려내고 싶다고 가정해보자

```java
List<Person> olderThan20 = new ArrayList<>();
people.stream()
        .filter(person -> person.getAge() > 20)
        .forEach(person -> olderThan20.add(person));
```

Person 리스트에서 filter 메서드를 사용해서 20상 이상의 사람들을 리스트에 추가하였다.

#### 이는 몇 가지 문제가 있다.

타깃 컬렉션에 엘리먼트를 추가하는 오퍼레이션이 너무 로우 레벨이다. 이 말은 이 오퍼레이션이 서술적\(declartive\)이지 않고 명력적\(imperative\)이라는 의미다. 이터레이션을 동시에 실행하려면, 즉시 스레드 세이프티 문제에 대해 고려해야 한다.

가변성은 병렬화를 어렵게 만든다. 다행히도 collect\(\) 메서드를 사용하면 이 문제를 쉽게 해결할 수 있다. collect\(\) 메서드는 엘리먼트들에 대한 스트림을 가지며 결과 컨테이너로 그 스트림을 모은다. 이렇게 하려면 메서드는 다음의 세 가지에 대해 알아야 한다.

* 결과 컨테이너를 만드는 방법\(예를 들어, Arraylist::new 메서드를 사용\)
* 하나의 엘리먼트를 결과 컨테이너에 추가하는 방법\(예를 들어, ArrayList::add 메서드를 사용\)
* 하나의 결과 컨테이너를 다른 것과 합치는 방법\(예를 들어, ArrayList::addAll 메서드를 사용\)

필터 오퍼레이션 후에 스트림의 결과를 얻어 올 수 있도록 collect\(\) 메서드에 대한 오퍼레이션들을 만들어보자

```java
people.stream()
      .filter(person -> person.getAge() > 20)
      .collect(ArrayList::new, ArrayList::add, ArrayList::addAll);
```

이 버전은 코드의 결과는 이전 버전과 같다. 그러나 이 버전은 이전 버전에 비해 많은 장점을 갖고 있다.

첫 번째로 개발자의 의도대로 그리고 더 서술적으로 프로그래밍이 가능하며, 결과를 모아서\(collect\) ArrayList에 넣는다는 우리의 목적을 잘 나타내고 있다.

개발자의 의도대로 그리고 더 서술적으로 프로그래밍이 가능하다. 결과를 모아서\(collect\) ArrayList에 넣는다는 우리의 목적을 잘 나타내고 있다.

두 번째는 코드에서 명시적 변경이 발생하지 않기 때문에 이터레이션의 실행을 병렬화하기가 쉽다. 변경에 대한 부분은 라이브러리에서 제어하기 때문에 라이브러리를 사용한 조율이 간단하고 그레드 세이프티를 보장해준다.

collect\(\) 메서드는 다른 서브 리스트 간의 병렬 덧셈을 수행하여 그 병렬 덧셈의 결과를 스레드 세이프하게 좀 더 큰 규모의 리스트로 합칠 수 있다.

Collector는 supplier, accumulator, 그리고 combiner의 오퍼레이션에 대한 인터페이스 역할을 한다. 이전 예제에서 세 개의 서로 다른 파라미터로 설정한 오퍼레이션들이다.

이전 버전을 collect를 사용한 버전으로 수정해보자

```java
people.stream()
      .filter(person -> person.getAge() > 20)
      .collect(Collectors.toList());
```

Collectos 유틸리티를 사용한 collect\(\)의 간결한 버전의 편리함은 여기에 그치지않는다. Collectors에는 다양한 collect나 accumulator 오퍼레이션을 수행하는 몇 가지 다른 메서드가 있다. 예를 들어, toList\(\)에는 추가적으로 셋트에 모으는 toSet\(\)이 있으며 키-벨류\(key-value\) 컬렉션에 모으는 toMap\(\)도 있다. 그리고 엘리먼트를 스트링으로 합치는 joining\(\)도 있다. mapping\(\), collectingAndThen\(\), minBy\(\), maxBy\(\), groupingBy\(\)과 같은 메서드를 사용하여 여러 오퍼레이션을 합쳐서 사용할 수 있다.

```java
// 나이를 값으로 사용해서 그룹으로 묶는 사람들 목록
people.stream().collect(Collectors.groupingBy(Person::getAge));

// 나이를 값으로 사용해서 그룹으로 묶는 사람들 이름 목록
people.stream()
			.collect(
				Collectors.groupingBy(
					Person::getAge, 
					mapping(Person::getName, toList())));

// 첫 번째 문자로 이름을 그룹핑하고 나서 각 그룹에서 가장 나이가 많은 사람
Comparator<Person> byAgeGroup = Comparator.comparing(Person::getAge);
people.stream()
      .collect(
				groupingBy(person -> person.getName().charAt(0), 
									reducing(BinaryOperator.maxBy(byAgeGroup))));
```

세번째 예제에 대한 프로세스를 살펴보자

* 첫 번째 문자를 기반으로 이름을 그룹핑한다.
* 두 번째 파라미터는 매핑 대신에 리듀스 오퍼레이션을 수행한다.
* 각 그룹에서 가장 나이가 많은 사람으로 엘리먼트들을 reduce한다.

## 디렉터리에서 선택한 파일 리스트하기

list\(\)는 파라미터로 FilenameFilter를 갖는다. 이 인터페이스는 accept\(\)라는 하나의 메서드만을 가지며, accept\(\) 메서드는 두 개의 파라미터를 가진다. 하나는 File dir\(디렉터리\)이고 다른 하나는 String name\(파일 이름을 표현한다\)이다.

```java
// case1. 익명 함수 사용
final String[] files = new File("fpij").list(new FilenameFilter() {
            @Override
            public boolean accept(File dir, String name) {
                return name.endsWith(".java");
            }
        });

// case2. 람다 표현식 사용
final String[] files = new File("fpij").list((dir, name) -> name.endsWith(".java"));
```

대규모의 디렉터리에서 작업한다면 File에 있는 메서드를 직접 사용하는 대신 DirectoryStream를 사용하면 된다. 항상 람다 표현식 버전을 만들고 그것을 리팩토링해서 더 간결한 메서드 레퍼런스 버전으로 만들어보자

### flatMap을 사용하여 서브 디렉터리 리스트하기

약간의 노력을 들여서 주어진 디렉터리의 서브 디렉터리를 탐색하는 것에 대해 알아보자 우선은 이터레이션하면서 for 루프를 도는 전형적인 방법을 사용하자

```java
List<File> finalFiles = new ArrayList<>();
File[] filesInCurrectDir = new File(".").listFiles();
for(File file : filesInCurrectDir){
    File[] filesInSubDir = file.listFiles();
    if(filesInSubDir != null){
        finalFiles.addAll(Arrays.asList(filesInSubDir));
    } else {
        finalFiles.add(file);
    }
} 
```

* 현재 디렉터리에서 파일들의 리스트를 가져와서 각 파일들을 통해 루프를 진행한다.
* 각 파일에 대해 자식 파일이 있는지 물어보고 있다면 파일들의 리스트에 추가한다.

이 코드는 동작하지만 문제의 소지가 있다. 가변성을 갖고 있을 뿐만 아니라 코딩 스타일이 명령적이다. 이러한 문제점을 flatMap\(\)이라고 하는 메서드를 사용해서 제거해보자.

어떤 디렉터리\(혹은 파일\)는 비어있거나 자식을 갖고 있지 않을 수 있다. 이 경우에는 간단하게 스트림을 자식 없는 디렉터리로 래핑하거나 파일 엘리먼트로 래핑한다. 파일을 무시하는 경우에 JDK에 있는 flatMap\(\) 메서드는 비어있는 것으로 처리한다.

```java
Stream.of(new File(".").listFiles())
      .flatMap(file -> file.listFiles() == null ? Stream.of(file) : Stream.of(file.listFiles()))
      .collect(toList());
```

flatMap\(\)은 현재 디렉터리의 서브 디렉터리의 모든 자식에 대한 컬렉션의 플랫된 맵을 리턴한다. 이것들을 collect\(\)의 toList\(\) 메서드와 Collectors를 사용해서 하나의 리스트로 모은다.

## 정리

* 람다 표현식과 메서드 레퍼런스를 사용하면 스트링과 파일 기반의 태스크와 커스텀 comparator를 생성하는 작업을 상당히 쉽고 간결하게 할 수 있다.
* 익명 클래스를 더 효율적인 스타일로 바꿔서 모호한 가변성을 제거할 수도 있다.
* 대규모 디렉터리를 탐색하기 위한 새로운 JDK 기능을 사용할 수 있다.

