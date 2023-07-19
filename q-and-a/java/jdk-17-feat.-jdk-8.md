# JDK 17일 사용한 이유(feat. JDK 8 이후 훑어보기)

<figure><img src="../../.gitbook/assets/1 (1).png" alt=""><figcaption><p><a href="https://www.geeksforgeeks.org/jdk-17-new-features-in-java-17/">https://www.geeksforgeeks.org/jdk-17-new-features-in-java-17/</a></p></figcaption></figure>

## 새로운 프로젝트를 들어가면서 JDK 버전을 고려하게 됐다

* JDK 버전을 선택하면서 경험했던 내용들을 공유하고자 한다

### 가장 중요했던건 유지보수 기간을 살펴보는것이었다

<figure><img src="../../.gitbook/assets/2 (8).png" alt=""><figcaption><p>https://access.redhat.com/articles/1299013</p></figcaption></figure>

* JDK 11 버전은 23년에 개발을 시작한다면 당장 1년뒤에 서포트기간이 종료되었다
* 그래서 그나마 서포트 기간이 4년이나 길게 남아 있는 JDK 17이 안정적이라 판단했다

### 제공하는 기능적으로는 차이가 없을까?

* 서포트 기간이 가장 중요한 이유였고 기능적으로는 사실 JDK 버전에서 신규 기능을 꼭 써야 한다는 기준은 없었다
* 최소 JDK 8에서 제공해주던 기능들만 있다면 별다른 어려움은 없다고 생각했다
* 다만 이번에 JDK 버전을 확인하면서 이전에 당연하게 써왔던 기능이나 모르고 있어서 사용하지 못했던 기능들이 있어서 적어보게 되었다

#### interface default method

* JAVA를 사용하는 개발자라면 보통 JDK 8 이전/이후 버전을 사용하는지를 일반적으로 이야기할 것이다
* 이렇게 JDK 8의 변화에서 가장 많은 영향을 주었던 것은 default method라고 생각한다
* 자세한 내용은 `자바 8 인 액션` 책에서 잘 설명해주고 있다

#### stream

* stream을 사용하여 목록형 데이터를 선언형으로 작성하여 더 간결하고 유연하게 처리할 수 있을 뿐만 아니라 병렬처리도 간편하게 구현할 수 있게 되었다

#### Optional

* 자바에서 가장 많이 발생하는 NPE를 예방할수 있도록 NULL에 대한 예외처리를 가능하게 해주었다

#### Lambda, method reference

* 람다와 메서드 레퍼런스 또한 stream을 사용하면서 가장 많이 사용했던 기능이라 생각한다

#### List.of()

* JDK 9에서는 내가 가장 많이 사용하는건 List.of() 메서드이다
* 로직을 구현하다보면 데이터를 리스트로 치환하여 가공하는 경우가 있다
* 이때 나는 List.of를 사용하여 불변의 목록형 데이터를 만드는 편이다
* 물론 Arrays.asList()를 사용할 순 있지만 element을 mutable하게 사용할 수 있어서 지양하는 편이다

#### ifPresentOrElse

* 그 다음으로 많이 사용하는게 `ifPresentOrElse` 일것 같다
* 간혹 스트림에서 추출한 값이 필터링되어 존재하지 않을 경우 `ifPresentOrElse` 를 사용하여 예외처리가 가능한 데이터로 리턴하다보니 예측가능한 예외처리가 가능했다

#### JDK 10 (Full GC 개선 및 var)

* JDK 10에서도 내가 특별하게 사용하는 기능은 없는것 같다
* var 키워드를 사용해서 유형을 좀 더 확장성 있게 사용할 수 있다거나
* 그리고 성능적으로 Full GC가 병렬로 처리되어 성능적으로 개선이 되었다고 한다

#### swtich 개선

* jdk 12에서는 switch 문에서 다중 값들을 선언할 수 있게 지원되었다고 한다

```jsx
switch (temp) {
    case "test", "incheol" :
        break;
    case "steve" :
        break;
    default:
        break;
}
```

#### Instanceof 개선

* JDK 14에서는 instanceof를 하면 자동으로 타입 캐스팅되어 사용할 수 있게 되었다

#### 문자열 블럭

* JDK 15에는 다중 문자열을 “””로 표현할 수 있도록 기능을 제공하였다

#### NPE 개선

* JDK14에서는 NPE가 발생할 경우 좀 더 사용자가 바로 확인할 수 있도록 개선되었다고 한다

#### GC 개선

* JDK 15에서는 G1 GC의 힙 사이즈 계산을 기본보다 증가시켜 런타임 성능을 향상시켰다고 한다
* 또한, ZGC를 프로덕션에서도 사용할수 있다고 한다

#### instanceof 개선

* JDK 16에서는 instaceof를 사용하면서 바로 해당 유형으로 타입캐스팅되어 사용할 수 있게 되었다

### JDK 17에는 다른건 없을까?

* 가장 큰 이유는 서포트 기간이다.
* 하지만 그외 다른 특징들도 있을것인데 조금이라도 사용할만한 기능은 없을지 살펴보자

#### JDK 17

* seald class로 무분별한 상속을 제한할 수 있다
* switch에서 유형으로 매칭시킬 수 있는 기능이 있다
* record 유형을 사용해서 VO 객체를 만들 수 있다 (JDK 16에 소개되었지만 17 버전에서 공식적으로 추가되었다고 한다)
* 잘 사용하지는 않지만 그래도 어떤 기능들을 제공하는지 알고 사용하는건 필요하다고 생각한다

## 참고

* [https://access.redhat.com/articles/1299013](https://access.redhat.com/articles/1299013)
* [https://www.geeksforgeeks.org/jdk-17-new-features-in-java-17/](https://www.geeksforgeeks.org/jdk-17-new-features-in-java-17/)
* [https://kim-jong-hyun.tistory.com/31](https://kim-jong-hyun.tistory.com/31)
* [https://aday7.tistory.com/entry/금융권-자바-버전-업그레이드-필요성과-추천-Java-17-도입-전략](https://aday7.tistory.com/entry/%EA%B8%88%EC%9C%B5%EA%B6%8C-%EC%9E%90%EB%B0%94-%EB%B2%84%EC%A0%84-%EC%97%85%EA%B7%B8%EB%A0%88%EC%9D%B4%EB%93%9C-%ED%95%84%EC%9A%94%EC%84%B1%EA%B3%BC-%EC%B6%94%EC%B2%9C-Java-17-%EB%8F%84%EC%9E%85-%EC%A0%84%EB%9E%B5)
* [https://techblog.gccompany.co.kr/우리팀이-jdk-17을-도입한-이유-ced2b754cd7](https://techblog.gccompany.co.kr/%EC%9A%B0%EB%A6%AC%ED%8C%80%EC%9D%B4-jdk-17%EC%9D%84-%EB%8F%84%EC%9E%85%ED%95%9C-%EC%9D%B4%EC%9C%A0-ced2b754cd7)
