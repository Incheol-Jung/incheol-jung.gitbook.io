# mybatis @Builder 주의사항

## mybatis 사용시 아래와 같은 문구가 발생하였다면…?

```jsx
// case 1
Caused by: java.lang.IndexOutOfBoundsException: Index 1 out of bounds for length 1
at java.base/jdk.internal.util.Preconditions.outOfBounds(Preconditions.java:64)
at java.base/jdk.internal.util.Preconditions.outOfBoundsCheckIndex(Preconditions.java:70)
at java.base/jdk.internal.util.Preconditions.checkIndex(Preconditions.java:266)
at java.base/java.util.Objects.checkIndex(Objects.java:359)
at java.base/java.util.ArrayList.get(ArrayList.java:427)
...

// case 2
Cause: java.lang.IndexOutOfBoundsException: Index 2 out of bounds for length 2
...
```

## 원인 분석

* mybatis를 사용하다가 위와 같은 에러문구를 경험했다면 resultType에 사용하는 class 모델에 @Builder어노테이션을 사용했을 가능성이 높다
* 빌더패턴은 이펙티브자바에서 지양하는 패턴으로 immutable하게 인스턴스를 생성하기 위해 종종사용한다

### 롬복 @Builder를 사용할 땐 주의해야 할 점이 있다

```jsx
/**
 * The builder annotation creates a so-called 'builder' aspect to the class that is annotated or the class
 * that contains a member which is annotated with {@code @Builder}.
 * <p>
 * If a member is annotated, it must be either a constructor or a method. If a class is annotated,
 * then a package-private constructor is generated with all fields as arguments
 * (as if {@code @AllArgsConstructor(access = AccessLevel.PACKAGE)} is present
 * on the class), and it is as if this constructor has been annotated with {@code @Builder} instead.
 * Note that this constructor is only generated if you haven't written any constructors and also haven't
 * added any explicit {@code @XArgsConstructor} annotations. In those cases, lombok will assume an all-args
 * constructor is present and generate code that uses it; this means you'd get a compiler error if this
 * constructor is not present.
```

* 작성된 document를 살펴보면 컴파일러는 생성자가 없으면 에러를 발생한다고 되어 있다.
* 모든 클래스는 디폴트로 빈 생성자를 기본으로 가지고 있다
* 그런데 롬복의 @Builder 어노테이션을 정의하면서 모든 인수가 있는 생성자를 기본으로 정의한다
* 그렇기 때문에 mybatis에서 리턴하는 모델은 빈 인스턴스를 생성한후 에트리뷰트를 바인딩해주는 과정에서 오류가 발생한 것이다

### 빈 생성자를 정의해주자

```jsx
@Builder
@NoArgsConstructor
public class ReplyMessage {
	...
}
```

