# 람다를 활용한 클라우드 와치 알림 받기

## 애플리케이션 로그 모니터링 하기

* 애플리케이션의 로그는 클라우드 와치를 통해서 수집되고 있었다
* 클라우드와치를 사용하니 여러 애플리케이션이나 환경들에 대한 로그를 그룹핑하여 한곳에서 볼수 있다는 점이 편했는데 한가지 단점이 있었다
* 클라우드와치를 사용해서 에러에 대한 로그도 모니터링 하고 있었는데 에러 내용을 확인하기 부실하다는 것이었다..ㅜ

<figure><img src="../../.gitbook/assets/1 (3).png" alt=""><figcaption></figcaption></figure>





* 그래서 매번 에러가 발생했다는 알림을 확인하면 클라우드 와치에 접속해서 오류가 발생했던 애플리케이션 로그를 확인하여 트러블슈팅을 진행하였다
* 모니터링을 하고 있지만 매번 AWS에 접속해서 애플리케이션 로그를 다시 확인해야 하니 여간 번거로운 작업이 아닐수 없다…

## 왜 로그를 자세히 확인할 수 없을까??

* 여기서 우선 클라우드와치 알림 설정을 간단히 설명하자면 아래와 같다
* 로그에 특정 패턴을 통해서 사용자가 지정한 주기에 특정 패턴의 로그가 몇번 왔는지에 따라서 메일로 알림을 수신할 수 있다(현재 설정은 1초당 통합 1개라도 오면 받을수 있게 설정해두었다)

<figure><img src="../../.gitbook/assets/2 (7) (3).png" alt=""><figcaption></figcaption></figure>

* 지표는 로그 그룹에서 추가할 수 있다

<figure><img src="../../.gitbook/assets/3 (1) (3).png" alt=""><figcaption></figcaption></figure>



* 그래서 클라우드 와치를 통해서 전달받은 알림에 대한 내용은 사용자가 설정한 threshold에 대한 임계치가 넘었다는 내용만 알려주고 있던것이었다

## 그럼 우리는 알림에 어떤 내용을 확인하고 싶은가?

* 우리가 확인하고 싶은 내용은 단순하다
* 트러블슈팅에 필요한 내용들이다

#### 우리가 알고 싶은 내용

* 어느 클래스에 에러가 발생했는지?
* 클래스에 어느 코드 라인에서 발생했는지?
* exception은 어떤 종류가 발생했는지?
* 에러가 발생한 시점에 request/response 내용들은 어떤게 있는지?
* 사용자는 누구였는지?
* 환경은 어떤 환경이었는지?
* 클라이언트의 유입 경로는 어디었는지?

### 그럼 트러블슈팅에 필요한 내용은 어떻게 제공하면 좋을까?

* 이미 우리는 RestControllAdvice를 사용하여 exception을 커스텀 exception으로 전환해서 리턴하고 있다
* RestControllAdvice에서 수행하는 로직은 두가지다
  1. 사용자가 이해하기 쉬운 내용으로 오류 내용을 전달한다
  2. 에러 로그를 append 하여 트러블 슈팅하는 용도로 사용하고 있었다
* 클라우드와치도 RestControllAdvice에서 에러 로그가 쌓인 것을 확인하고 threshold 알림을 주고 있었다
* 그럼 우선 트러블 슈팅에 필요한 내용을 추가해보자

```jsx
private void logError(Exception exception) {
    ServletRequestAttributes servletRequestAttributes = (ServletRequestAttributes) RequestContextHolder.currentRequestAttributes();
    HttpServletRequest request = servletRequestAttributes.getRequest();
    String referer = request.getHeader("referer");
    String userInfo = request.getHeader("userInfo");
    String profile = EnvUtil.getProfile();
    String requestURI = request.getRequestURI();
    log.error("\\nrequestURI => {}, \\nprofile => {}, \\nuserInfo => {}, \\nreferer => {}, \\nexception ClassName : {}, \\nThrowables.getStackTraceAsString : {}", requestURI, profile, userInfo, referer, exception.getClass()
            .getSimpleName(), Throwables.getStackTraceAsString(exception));
}
```

### 그럼 이제 어떻게 알림을 받을 수 있을까?

* 트러블슈팅에 필요한 로그 내용은 준비가 되었다
* 클라우드와치에서 제공하는 알림으로는 한계가 있다
* 결국 클라우드와치에 쌓인 로그를 가시화 해줄수 있는 기능이 필요하다

#### 가시화 해주기 위한 방법은 두 가지이다

1. 애플리케이션에서 에러 로그를 가시화 해줄 수 있는 곳으로 호출하는것이다(ex. datadog, ELK)
2. 클라우드와치에 전송된 로그를 트리거하여 AWS 서비스와 연계하여 알림을 보낼수도 있을것 같다

> 우리는 별도 로그 가시화 서비스를 구축하기보단 기존에 전송된 로그를 활용하는 방향을 선택하게 되었다

### 클라우드와치에 전송된 로그를 활용해보자

* 우선 메일 알림을 보낼수 있는 기능을 찾아보자
* 우리는 이미 SNS(Simple Notification Service)를 사용하여 구독할수 있는 이메일을 설정하였다
* 그럼 SNS를 연동하면서 클라우드와치에 쌓인 로그를 특정 시점에 트리거하여 발생할 수 있는 방법은 람다(Lambda)를 활용한 방법이라고 생각했다
* 람다로 우선 간단하게 SNS 전송 기능을 구현할 수 있다
*   구현 기능은 워낙 간단한 기능이고 구현 로직도 검색하면 많이 찾을 수 있다

    ```jsx
    참고 : <https://dr-coton.github.io/aws-lambda-sns-sendsms/>
    ```



<figure><img src="../../.gitbook/assets/4 (4) (3).png" alt=""><figcaption></figcaption></figure>



#### 그러면 SNS 발송기능은 구현되었는데 에러로그가 발생했을때 어떻게 람다를 실행 시킬수 있을까?

* 람다에는 실행 시점을 설정할수 있는 trigger 옵션을 제공한다
* trigger에는 AWS 서비스 상품들과 호환하여 다양한 시점에 트리거를 설정할 수 있다

<figure><img src="../../.gitbook/assets/5 (3) (3).png" alt=""><figcaption></figcaption></figure>

* AWS 서비스 : CloudWatch
* 로그 그룹 : 트리거를 받을 로그 그룹
* Filter name : 트리거 발동 시점(만약 필터를 걸지 않는다면 모든 로그에서 트리거가 발동하여 SNS 폭탄을 받을수도 있음)

#### 그럼 Filter는 어디서 설정하는걸까?

* 필터는 선택한 로그 그룹에서 선택할 수 있다

<figure><img src="../../.gitbook/assets/6 (3).png" alt=""><figcaption></figcaption></figure>

#### 이제 준비는 끝났다

* 실제로 이메일 오는지 확인해보자



<figure><img src="../../.gitbook/assets/7 (4).png" alt=""><figcaption></figcaption></figure>



<figure><img src="../../.gitbook/assets/8.gif" alt=""><figcaption><p><a href="https://jjalbot.com/tags/%EC%86%8C%EB%A6%AC%EC%A7%88%EB%9F%AC">https://jjalbot.com/tags/소리질러</a></p></figcaption></figure>





## 이렇게 해피엔딩으로 마무리되는것으로 생각했다

* 그렇게 몇일 동안 운영을 해보니.. 이슈가 하나 발생하였다..
* 혹시나 몰라서 클라우드 와치 threshold 알림도 켜두고 람다도 실행하도록 운영하고 있었다
* 그런데 threshold에서는 에러가 쌓였다는 알림이 수신되었지만 람다에서는 아무런 에러 내용 알림을 보내주지 않고 있었다..
* 그래서 람다쪽을 확인해보니 트리거는 정상동작 하고 있었다.. 그런데 간혹 이메일 발송 로직이 스킵이 되는 경우가 있었다..
* 원인을 확인해보니 람다에 cold start 문제가 있다고 한다
* cold start를 설명하기 전에 람다 서비스의 동작원리 부터 알아볼 필요가 있다
* 람다라는 서비스가 컨테이너 기반으로 서버리스 기반으로 동작하기 때문에 트리거 시점에 서비스가 부팅되며 애플리케이션 로직을 수행하게 된다
* 그렇기 때문에 트리거가 발생하지 않는 시점엔 람다의 수행함수가 실행이 되지 않고 있다
* 부팅이 되기 전에 트리거가 발동하면서 람다가 컨테이너로 생성되면서 동작하다보면 수행 로직을 스킵하게 되는 cold start 이슈가 발생하는 것이었다
* 실제로 검색해보면 다양한 문제 해결 방법을 확인할 수 있다..

<figure><img src="../../.gitbook/assets/9 (3).png" alt=""><figcaption></figcaption></figure>



### 우리가 COLD START를 극복하기 위한 방법으로 몇가지를 적용하였다

#### 람다의 메모리를 늘리자

* 결국 람다가 부팅되고 수행하는 시간이 조금이라도 개선되려면 인프라 스펙을 향상시키는 방법밖엔 없다
* 검색해보면 대부분 COLD START를 해결하기 위해 가장 먼저 시도하는 방법이 메모리 스펙을 증가시키는 것이다
* 메모리를 올리면 이전보다 수행 시간이 단축된다고 되어있어 적용하게 되었다
* `단, 주의할점은 메모리를 증가하면 비용도 추가되니 적절한 범위를 찾아야 할것이다`

<figure><img src="../../.gitbook/assets/10 (4) (1).png" alt=""><figcaption></figcaption></figure>

#### 람다 재부팅 개선

* 결국, 문제는 트리거가 발생하고 다운되어있던 서비스를 부팅하는 과정에서 누락되는 경우다
* 이를 근본적으로 해결하려면 주기적으로 깨우면 된다
* 이렇게 5분마다 람다를 수행하면 필요한 트리거시점엔 컨테이너가 운영되고 있을 가능성이 높기 때문에 주기적으로 깨우는 작업을 하면 COLD START를 줄일 수 있다

<figure><img src="../../.gitbook/assets/11 (5).png" alt=""><figcaption></figcaption></figure>

#### 코드 리팩토링

* 인스턴스 변수는 최대한 static으로 사용하여 initialize 하는 프로세스를 개선할 수 있다
* while문을 수행하여 함수가 initialize 되었을때 수행하도록 check하는 로직을 넣을 수도 있을 것이다

### 그럼 COLD START는 해결되었나?

* 100% 해결되었다고는 이야기할 수 없다..
* 하지만 이전에 비해 CLOUDWATCH 알림 횟수에 비해 LAMBDA 알림 횟수가 기하급수적으로 올라가 80%성능을 보여주는것은 확인하였다

## 그렇다면 결론은???

> LAMBDA의 COLD START를 100% 해결하지 못할수도 있다. 그 상황을 대비해서 차선책으로 받을 수 있는 알림을 함께 모니터링하는게 안정적인 서비스를 운영하기 위한 방법이 아닐까 싶다..ㅜ

<figure><img src="../../.gitbook/assets/12.jpg" alt=""><figcaption><p><a href="https://pann.nate.com/talk/342583507">https://pann.nate.com/talk/342583507</a></p></figcaption></figure>





## 참고

* [https://inpa.tistory.com/entry/AWS-📚-람다-성능-개선-Cold-Start-해결](https://inpa.tistory.com/entry/AWS-%F0%9F%93%9A-%EB%9E%8C%EB%8B%A4-%EC%84%B1%EB%8A%A5-%EA%B0%9C%EC%84%A0-Cold-Start-%ED%95%B4%EA%B2%B0)
* [https://nyyang.tistory.com/117](https://nyyang.tistory.com/117)
