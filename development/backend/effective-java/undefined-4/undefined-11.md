---
description: Effective Java 3e 아이템 36를 요약한 내용 입니다.
---

# 아이템36 비트 필드 대신 EnumSet을 사용하라

```java
public class Text  {
     public static final int STYLE_BOLD            = 1 << 0;   // 1
     public static final int STYLE_ITALIC          = 1 << 1;   // 2
     public static final int STYLE_UNDERLINE       = 1 << 2;   // 4
     public static final int STYLE_STRIKETHROUGH   = 1 << 3;   // 8

    // 매개변수 styles는 0개 이상의 STYLE_ 상수를 비트별 OR한 값이다. 
    public void applyStyles(int styles)  { ... }

}
```

다음과 같은 식으로 빌트별 OR를 사용해 여러 상수를 하나의 집합으로 모을 수 있으며, 이렇게 만들어진 집합을 비트 필드\(bit field\)라 한다.

비트 필드 값이 그대로 출력되면 단순한 정수 열거 상수를 출력할 때보다 해석하기가 훨씬 어렵다. java.util 패키지의 EnumSet 클래스는 열거 타입 상수의 값으로 구성된 집합을 효과적으로 표현해준다.

앞의 예를 열거 타입과 EnumSet을 사용해 수정해보았다. 보다시피 짧고 깔끔하고 안전하다.

```java
import java.util.*;

// 코드 36-2 EnumSet - 비트 필드를 대체하는 현대적 기법 (224쪽)
public class Text {
    public enum Style {BOLD, ITALIC, UNDERLINE, STRIKETHROUGH}

    // 어떤 Set을 넘겨도 되나, EnumSet이 가장 좋다.
    public void applyStyles(Set<Style> styles) {
        System.out.printf("Applying styles %s to text%n",
                Objects.requireNonNull(styles));
    }

    // 사용 예
    public static void main(String[] args) {
        Text text = new Text();
        text.applyStyles(EnumSet.of(Style.BOLD, Style.ITALIC));
    }
}
```

#### 핵심 정리

EnumSet 클래스가 비트 필드 수준의 명료함과 성능을 제공하고 아이템 34에서 설명한 열거 타입의 장점까지 선사하기 때문이다. EnumSet의 유일한 단점이라면 \(자바 9까지는 아직\) 불변 EnumSet을 만들 수 없다는 것이다. 그 부분은 Collections.unmodifiableSet으로 EnumSet을 감싸 사용할 수 있다.

