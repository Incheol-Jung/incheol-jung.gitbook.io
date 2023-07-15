# 테스트 코드 성능 개선기

<div data-full-width="true">

<figure><img src="../../.gitbook/assets/1.gif" alt=""><figcaption><p><a href="https://extmovie.com/movietalk/69993503">https://extmovie.com/movietalk/69993503</a></p></figcaption></figure>

</div>

그날은 유난히도 추웠다….

그 녀석을 만난건 유난히도 추웠던 어느날이었다…

테스트 코드를 도입한지 한달이 넘어가던 시점이었다..

<div>

<img src="https://s3-us-west-2.amazonaws.com/secure.notion-static.com/adc88591-8a17-4b6b-9a5f-49cb375907b8/Untitled.png" alt="">

 

<figure><img src="../../.gitbook/assets/2 (1) (2).png" alt=""><figcaption><p>github.com</p></figcaption></figure>

</div>

여느때 처럼 PR이 올라오고 있었는데…

PR 생성하면서 빌드를 수행하는데 끝날 기미가 보이지 않았다..

그렇게 기다려보니 빌드는 성공하였고 빌드 수행시간이 13분을 육박하였다…



<figure><img src="../../.gitbook/assets/3 (4).png" alt=""><figcaption><p>github.com</p></figcaption></figure>

#### 그렇다..

이제 PR 하나를 생성하면 최소 13분은 기다려야 리뷰를 할수 있는 상태가 되고 만약 리뷰의 내용을 수정하려면 또 다시 13분을 기다려야 한다…

→ 기능 하나 추가하는 시간이 너무 오래 걸린다..

→ 이렇다보니 테스트 코드를 작성하는것도 부담이 되고 PR을 올리는것조차 부담이 된다..

→ 시간이 오래 걸리니 한번에 많은 기능을 하나의 PR에 묻어가고 싶은 마음이 든다…

→ 하나의 PR에 많은 기능을 넣다보니 리뷰도 원활히 되지 않는다…

→ 리뷰가 원활히 되지 않으니 동적으로 발생하는 오류 사항을 놓치고 만다…

→ 그렇게 우리 서비스는 점차 지뢰 밭이 되고 만다…?



<figure><img src="../../.gitbook/assets/4 (1) (2).png" alt=""><figcaption><p><a href="https://brunch.co.kr/@roysday/568">https://brunch.co.kr/@roysday/568</a></p></figcaption></figure>



## 개선이 시급하다



<div data-full-width="true">

<figure><img src="../../.gitbook/assets/5 (3) (1).png" alt=""><figcaption><p><a href="https://m.blog.naver.com/PostView.naver?isHttpsRedirect=true&#x26;blogId=yean5rang&#x26;logNo=50090277323">https://m.blog.naver.com/PostView.naver?isHttpsRedirect=true&#x26;blogId=yean5rang&#x26;logNo=50090277323</a></p></figcaption></figure>

</div>



### 우선 느려지는 원인에 대해서 파악해보자

* 우리는 현재 단위 테스트만 작성하고 있다
* 그러므로 참조하는 객체는 모킹처리 하고 타겟 클래스에 대해서만 로직을 검증하고 있다
* 그런데 테스트 클래스 상단에 @SpringBootTest 어노테이션을 사용하다 보니 애플리케이션 컨텍스트에 있는 모든 bean이 로드되는게 속도 저하가 발생하는 가장 큰 원인이었다
* 그래서 불필요한 bean은 로드하지 않고 필요한 bean만 사용하도록 개선이 필요하다

#### 데이터 커넥션 회피하기

* 불필요한 bean중에 하나가 데이터 커넥션 풀이다
* 테스트 코드에 필요한 데이터 커넥션은 DAO 테스트코드에서만 필요하다
* 그러므로 그 외에 작성된 테스트 코드에서는 DAO가 모킹처리되기 때문에 데이터 커넥션이 필요없다
* 데이터 커넥션이 필요하지 않는 테스트 클래스에는 데이터 커넥션에 사용하는 bean을 제외시킨다

```jsx
@EnableAutoConfiguration(exclude= DataSourceAutoConfiguration.class)
```

#### 카프카 커넥션 회피하기

* 카프카 컨슈머, 프로듀서에서 사용되는 bean을 제외시킨다

```jsx
@EnableAutoConfiguration(exclude= KafkaAutoConfiguration.class)
```

#### **@EnableAutoConfiguration 사용시 주의사항**

\<aside> 💡 **@EnableAutoConfiguration 사용시 주의사항 !!!** 특정 bean을 제외시키면 모든 bean을 로드시키지 못하게 된다. 그래서 로드할 bean을 지정해주어야 한다

`@SpringBootTest(classes = ExternalLoginService.class)`

위와 같이 classes에 로드할 bean 클래스를 지정해주자

\</aside>

#### 서비스 디스커버리 회피하기

* 서비스 디스커버리 연결도 테스트 코드에선 무의미 하다
* 로컬에선 디스커버리 연결할 필요가 없으니 비활성화 시키자

```jsx
// application-local.yml

eureka:
  client:
    enabled: false
```

#### 스프링 클라우드 버스 카프카 회피하기

* 스프링 클라우드 버스를 통해서 프로퍼티를 자동 갱신할 수 있다
* 하지만 이도 로컬 또는 테스트 코드에선 의미가 없으니 비활성화 시킨다
* 그러면 카프카 컨슈머 생성도 완전히 회피할 수 있다

```jsx
// application-local.yml

spring:
  cloud:
    bus:
      enabled: false
```

#### 콘트롤러 테스트 코드 작성시 @SpringbootTest 사용 지양하기

* 우리는 불필요한 bean을 로드하는 것을 최대한 줄여야 한다
* exclude를 사용해서 제한할수도 있지만, 근본적인 @SpringbootTest 사용을 지양할 수 있다면 별도 제한 설정을 하지 않아도 될것이다

#### 그럼 @SpringbootTest를 사용하지 않고 어느걸 사용할 수 있을까?

* API 통신에 MockMvc를 사용한다면 @WebMvcTest를 사용할 수 있다
* @WebMvcTest를 사용하면 애플리케이션에서 있는 모든 bean을 로드하지 않고 web layer에서 필요한 bean들만 로드한다는 것을 알 수 있다
* 그리고 MockMvc를 사용할 때 주의할 게 있는데, 테스트 코드를 수행해보면 4xx에러가 발생하는것을 알수 있다. 이는 security 제한이 있을 수 있으니 security 설정도 disable 해야 한다

```jsx
@WebMvcTest(excludeAutoConfiguration = {SecurityAutoConfiguration.class})
```

#### @SpringBootTest vs @WebMvcTest

\<aside> 💡 **Difference Between @SpringBootTest and @WebMvcTest**

You will use _@SpringBootTest_  annotation to create integration tests that involve all three layers of your application (i.e. _Web, Service, and Data layer_ ). And you will use _@WebMvcTest_  annotation when you need to create integration tests or unit tests of the [Web MVC](https://www.appsdeveloperblog.com/spring-web-mvc-video-tutorials/)  Layer only (i.e. controllers). Because when using _@WebMvcTest_  annotation dependencies on the Service or Data layer will need to be mocked.

출처 : [https://www.appsdeveloperblog.com/difference-between-springboottest-and-webmvctest/](https://www.appsdeveloperblog.com/difference-between-springboottest-and-webmvctest/)

\</aside>

### 그럼 이제 결과를 한번 볼까나..?



<figure><img src="../../.gitbook/assets/6 (1) (2).png" alt=""><figcaption><p>github.com</p></figcaption></figure>



9분 50초…?

6분 50초도 아니고.. 5분 50초도 아니고… 9분..?

이러려고 수십개의 테스트 파일을 수정하였나….



<div data-full-width="true">

<figure><img src="../../.gitbook/assets/7 (3).png" alt=""><figcaption><p><a href="https://m.blog.naver.com/PostView.naver?isHttpsRedirect=true&#x26;blogId=ja2_01&#x26;logNo=221842728124">https://m.blog.naver.com/PostView.naver?isHttpsRedirect=true&#x26;blogId=ja2_01&#x26;logNo=221842728124</a></p></figcaption></figure>

</div>



### 그럼 시선을 돌려 외부 환경을 개선해보자!!!

PR 생성시 빌드할때는 github action을 사용한다

그런데 github 에서는 github action을 수행할때 `runner`의 스펙 사양을 유료로 제공하고 있다

#### 그럼 현재 기본으로 사용하고 있는 runner 사양은 어떻게 되나?



<figure><img src="../../.gitbook/assets/8 (1).png" alt=""><figcaption><p>github.com</p></figcaption></figure>



* github에서 기본으로 제공하고 있는 기본 runner의 사양은 Standard\_DS2\_v2로 제공한다고 되어있다



<figure><img src="../../.gitbook/assets/9 (1) (2) (1).png" alt=""><figcaption><p>github.com</p></figcaption></figure>

* microsoft에서 보면 해당 사양은 `CPU 2`, `7GB` 메모리라고 되어있다

<figure><img src="../../.gitbook/assets/10 (1).png" alt=""><figcaption><p>github.com</p></figcaption></figure>



#### 그럼 메모리와 core를 올려서 다시 빌드해보자



<figure><img src="../../.gitbook/assets/11 (2).png" alt=""><figcaption><p>github.com</p></figcaption></figure>



* core는 16, 메모리는 64GB의 클라우드 환경 runner를 생성하였다
* runner를 지정하자

```jsx
jobs:
  build:
    name: BUILD
    runs-on: ubuntu-latest-16-cores // runner의 라벨명을 사용
```

## 그럼 결과는 어떻게 되었을까?

#### `13분 → 6분대로 속도가 개선된 것을 확인할 수 있다`



<figure><img src="../../.gitbook/assets/12 (1) (2).png" alt=""><figcaption><p>github.com</p></figcaption></figure>



#### 여기서 조금만 더 욕심을 내보자면…

* 테스트 코드는 독립적이라 병렬로 처리되면 더 속도를 줄일 수 있을것 같다..
* junit 5에서는 property를 사용하여 간단하게 병렬 처리를 수행할수 있다
* 참고 : [https://junit.org/junit5/docs/snapshot/user-guide/](https://junit.org/junit5/docs/snapshot/user-guide/)

```jsx
// 병렬처리 활성화 여부
junit.jupiter.execution.parallel.enabled=true

// 병렬처리시 클래스내 메소드를 같은 쓰레드로 돌릴지 여부(same_thread는 같은 쓰레드, concurrent는 다른 쓰레드)
junit.jupiter.execution.parallel.mode.default=same_thread

// 클래스별 병렬처리는 같은 쓰레드로 수행할지
junit.jupiter.execution.parallel.mode.classes.default=concurrent

// 병렬처리시 쓰레드 할당 방법(dynimic은 코어당 최대 8개 사용, fixed는 쓰레드 갯수를 지정)
junit.jupiter.execution.parallel.config.strategy=fixed

// 쓰레드 갯수 지정(dynamic일 경우 최댓값이 1, fixed
junit.jupiter.execution.parallel.config.fixed.parallelism=3
```

### 과연 결과는…?

* 시간은 개선되지 않았다..
* 오히려 core쪽에는 db connection 오류가 발생하여 실패가 나서 병렬로 처리하지 못하였다..
* 우선은 core 쪽은 병렬 처리 설정을 제거한다
* external 모듈 쪽은 db connection이 없기 때문에 최대한 병렬처리를 활용해본다
* core쪽도 병렬 처리를 하면 테스트 코드 수행 시간은 크게 개선될 수 있을것 같다
* 이부분은 시간을 두고 검토해보자
* 우선은 지금 시급한 고민부터 해결해보자…



<figure><img src="../../.gitbook/assets/13.png" alt=""><figcaption><p><a href="https://www.facebook.com/zzalgun.official/photos/a.326482304762666/1133401060737449/?type=3">https://www.facebook.com/zzalgun.official/photos/a.326482304762666/1133401060737449/?type=3</a></p></figcaption></figure>
