# 서비스 디스커버리는 어떻게 서비스 등록/해제 하는걸까?

<figure><img src="../../.gitbook/assets/1 (20).png" alt=""><figcaption><p>https://miro.medium.com/v2/resize:fit:960/1*6XpOlHyp51gAyYxLtk51JQ.png</p></figcaption></figure>

* 서비스 디스커버리 기능을 제공하는 라이브러리는 다양하다
* 오늘은 Netflix Eureka를 사례로 레지스트리 서버에 등록되는 과정을 살펴보자



## 레지스트리 서버에 서비스 등록

*   레지스트리 서버에 등록할 클라이언트에 eureka 라이브러리를 추가한다

    ```java
    // build.gradle

    implementation 'org.springframework.cloud:spring-cloud-starter-netflix-eureka-client'
    ```
*   레지스트리 정보를 클라이언트에 설정하면 클라이언트는 레지스트리 서버에 주기적으로 **Heartbeat API**를 호출하며 상태를 주기적으로 전달하게 업데이트되게 된다. `(spring.application.name이 레지스트리에 등록될 서비스 이름이 된다)`

    ```java
    // application.yml

    spring:
      application:
        name: api-external-service // 레지스트리에 등록할 서비스 이름을 의미한다
      cloud:
        config:
          uri: <http://13.124.31.0:8888> // 레지스트리 서버 정보를 입력한다
    ```



### 레지스트리 서버는 어떻게 클라이언트가 등록되었다고 인지 하는가?

* 클라이언트는 실행되면서 레지스트리 서버에 **Registration API**를 호출하게 되고, 이때 클라이언트의 메타 데이터와 상태 정보를 Eureka 서버에 제공하게 된다
* 그 이후에는 클라이언트 상태를 주기적으로 확인하기 위해 **Heartbeat API** 를 호출하게 된다
* **Heartbeat API** 호출 주기는 클라이언트에서 직접 설정할 수 있다.
*   **leaseRenewalIntervalInSeconds**를 통해서 주기를 설정할 수 있고, 기본 값은 30초이다

    ```java
    eureka:
      instance:
        lease-renewal-interval-in-seconds: 1 // 1초 주기로 Heartbaet API 호출
    ```



### 그럼 레지스트리에 서비스가 해제되는 과정은 어떻게 되는가?

* 해제되는 설정은 클라이언트에 정의할 수 있다
*   **leaseExpirationDurationInSeconds** 값을 통해서 헬스체크를 설정한 시간을 초과하게되면 레지스트리 서버에 서비스를 제거하게 된다. 기본 값은 90초이다

    ```java
    eureka:
      instance:
        lease-expiration-duration-in-seconds: 3 // 3초 내로 Heartbeat API를 호출하지 않으면 클라이언트를 제거한다
    ```



### 그럼 레지스트리 서버는 클라이언트 등록 해지되면 바로 반영이 되는가?

* 아니다. 레지스트리 서버는 클라이언트가 해제 되더라도 마지막 요청을 캐싱하여 상태 정보를 기억하게 된다
* 그러므로 타 서비스에서 정보를 요청하게 되면 실제로는 클라이언트 등록이 해제되더라도, 캐싱되는 시간동안은 이전에 등록한 서비스의 메타 데이터를 전달하게 된다
* 레지스트리가 캐싱하는 시간은 **evictionIntervalTimerInMs** 으로 정해진다. 기본값은 1분(60초)이다
*   단 여기서 중요한 점은 서비스 디스커버리 대시보드에는 **leaseExpirationDurationInSeconds** 시점에 서비스가 제외되는것을 확인할 수 있다. `그러나 실제로 레지스트리 서버에는 아직 제외되지 않는다`

    ```java
    eureka:
      client:
        register-with-eureka: false
        fetch-registry: false
      server:
        eviction-interval-timer-in-ms: 10000
    ```



### 레지스트리 서버는 **leaseExpirationDurationInSeconds만 주의하면 될까?**

* 아니다. 레지스트리 서버는 클라이언트 등록 과정에 네트워크 이슈가 있지만, 실제 API 호출하는데에는 이슈가 없을 경우를 고려하여 자체적으로 이전에 기록한 클라이언트 접속 정보를 유지하는 경우가 있다
* 이는 `enableselfpreservation` 값을 true로 하였을때, 일정 클라이언트 손실에 대해서 자가 보존 모드로 들어가게 된다
* 그리고 자가 보존 모드가 되는 기준은 `renewalPercentThreshold` \*\*\*\*\*\*수치 이하일 경우에 전환하게 된다(모든 클라이언트에 대해서 heartbeat의 손실률에 대한 기준이다)
* 그리고 자가 보존 모드로 전환을 검토하는 계산 주기는 `renewalThresholdUpdateIntervalMs` 값에 의해 주기가 정해진다. 기본값은 15분으로 설정되어 있다
* 운영 환경에서는 대부분 자가 보존 모드를 켜둔 상태로 운영하는것을 권장한다
* 자가 보존 모드에 대해서는 추후에 알아보기로 하고 우선은 클라이언트 상태 체크 주기에 대해서만 살펴보겠다



## 그럼 실제로 확인해보자

### 테스트 케이스

1.  클라이언트를 레지스트리 서버에 등록한다

    1. Heartbeat API 주기는 1초로 설정한다
    2. Heartbeat API를 3초 동안 호출하지 않으면 서비스는 등록 해제하게 된다

    ```java
    eureka:
      instance:
        lease-renewal-interval-in-seconds: 1
        lease-expiration-duration-in-seconds: 3
    ```
2. 서비스를 shutdown 시킨다
3. 3초 이후에 다른 서비스에서 서비스 디스커버리를 통해서 shutdown한 서비스를 호출 했을때, 등록된 서비스가 없다고 나오는지, 실제로 호출하게 되는지 확인해보자
   1.  만약 등록된 서비스가 없다면 `‘No servers available’`이라는 내용의 문구를 확인할 수 있다



       <figure><img src="../../.gitbook/assets/2 (14).png" alt=""><figcaption></figcaption></figure>
   2.  만약 등록된 서비스가 있는데, 호출이 정상적으로 되지 않는다면 `‘Connection refused’` 라는 내용의 문구를 확인할 수 있다



       <figure><img src="../../.gitbook/assets/3 (12).png" alt=""><figcaption></figcaption></figure>
4.  결과를 보면 대시보드에는 서비스가 해제되었지만 등록된 IP로 호출하려는 시도를 하는것을 확인할 수 있다.



    <figure><img src="../../.gitbook/assets/Aug-20-2023 19-42-18.gif" alt=""><figcaption></figcaption></figure>

## 결론

* 레지스트리 서버에 서비스를 등록하고 주기적으로 상태를 확인하는 설정은 클라이언트에 독립적으로 설정할 수 있다 (**evictionIntervalTimerInMs, leaseExpirationDurationInSeconds)**
* 그러나 레지스트리 서버에 클라이언트가 해지되었다고 하더라도 등록정보가 캐시될 수 있으니 캐시 주기를 잘 살펴 봐야 한다
* 그리고 레지스트리 서버에는 자가 보존 모드가 존재하니, 일정시간동안 다양한 이슈로 인해 레지스트리 서버에 heartbeat를 호출하지 않아도 클라이언트가 유지될 수 있으니 이 부분도 주의깊게 사용이 필요하다

## 참고

* [https://authentication.tistory.com/24](https://authentication.tistory.com/24)
* [https://ingnoh.tistory.com/32](https://ingnoh.tistory.com/32)
* [https://devwari.tistory.com/5](https://devwari.tistory.com/5)
* [https://docs.steeltoe.io/api/v3/discovery/netflix-eureka.html](https://docs.steeltoe.io/api/v3/discovery/netflix-eureka.html)
* [https://subji.github.io/posts/2020/08/11/springcloudeurekaregistry](https://subji.github.io/posts/2020/08/11/springcloudeurekaregistry)
