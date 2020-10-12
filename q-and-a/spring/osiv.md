---
description: OSIV에 대해서 알아보자
---

# OSIV

![](../../.gitbook/assets/img%20%282%29.png)

## OSIV란?

Open Session In View의 약자로 직역 하자면 View 영역까지 Session 영역이 열어 둔다는 의미이다.

### Open Session은 무엇이고 View 영역은 무엇일까?

Open Session은 세션 영역을 연다는 의미인데, 정확히는 영속성 컨텍스트의 영역을 의미한다. View 영역은 우리가 일반적으로 생각하는 Controller 영역이나 뷰 영역\(jsp, Thymeleaf\)영역을 의미한다. 다시 풀어보자면 Controller나 뷰 영역에도 영속성 컨텍스트를 유지한다는 것으로 이해할 수 있다.

### 영속성 컨텍스트의 범위는 어떻게 되나?

영속성 컨텍스트는 엔티티 매니저와 연관이 깊다. 엔티티 매니저가 생성되는 시점에 생성되고 엔티티 매니저가 종료되는 시점에 소멸한다. 트랜잭션 매니저를 별도로 구현하지 않고 @Transactional 애노테이션을 사용한다면 애노테이션이 붙어있는 메소드 영역 내에서 영속성 컨텍스트가 생성되고 소멸되는 것으로 이해할 수 있다.

```java
@Transactional
public Person get(int id) {
		return personRepository.findById(id);
}
```

### 영속성 컨텍스트의 범위를 확장해야 하는 이유는?

@Transactional 애노테이션은 보통 Service 레이어에서 많이 사용하는데 Service 레이어가 아닌 컨트롤러나 뷰 영역에서도 영속성 컨텍스트가 필요한 경우가 있을 수 있지만 많이 경험하지 못하였을 수도 있다.

> 왜냐하면 최근에는 대부분 DTO를 사용하기 때문이다.

컨트롤러 영역에서는 필요한 DTO 모델을 생성하여 Dao에서 내려받은 결과값을 DTO에 바인딩 해주기 때문에 OSIV를 고려해야 하는 경우가 그리 많지 않았을 것이다. 하지만 몇년 전까지만 하더라도 JPA를 사용하면 Dao에서 내려주는 엔티티를 그대로 결과 모델로 사용하는 경우가 많았다. 그러면서 컨트롤러나 뷰 영역에서도 엔티티를 조작하는 경우가 발생하였다.

### OSIV가 적용되지 않았다면 어떻게 될까?

스프링 부트는 default 설정으로 OSIV를 활성화 하였다. 그래서 엔티티를 컨트롤러나 뷰 영역에서 수정하여도 익셉션을 확인하지 못했을 것이다. 그렇다면 OSIV 설정을 비활성화 해보면 어떤 익셉션이 발생하는지 알수 있다. 우선 디폴트 설정을 비활성화 하기 위해 application.yml 파일을 수정해보자

```text
spring:
  jpa:
    open-in-view: false
```

#### 이제 영속성 컨텍스트 영역을 사용해야 하는 케이스를 만들어 보자

코드는 단순하다. 우선 엔티티 2개가 필요하다. 하나는 조회할 엔티티와 연관관계의 엔티티이다. 연관관계 속성은 익셉션을 확인하기 위해 `FetchType.LAZY`로 설정하였다.

```java
@Entity
@Getter
@Setter
@NoArgsConstructor
public class Person {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id;
    private String name;
    @ManyToOne(fetch = FetchType.LAZY)
    private Team team;

    public Person(String name, Team team) {
        this.name = name;
        this.team = team;
    }
}

@Entity
@Getter
@Setter
@NoArgsConstructor
public class Team {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id;
    private String name;
}
```

컨트롤러 영역과 서비스 영역을 추가해보자. 컨트롤러 영역에서는 예외를 보여주기 위해 일부러 Team을 조회하여 team의 name을 조회하였다.

#### Team을 조회하면 되지 않을까? id를 조회해도 되지 않을까?

아니다. 단순히 getTeam\(\) 만 호출하게 되면 프록시 객체를 전달할 것이다. 단순히 프록시 객체만 조회하였을 경우엔 영속성 컨텍스트 영역이 필요없다. 프록시 객체의 특정 필드를 조회할 경우 영속성 컨텍스트에서 데이터가 있는지 확인을 할것이고, 없으면 데이터베이스를 조회할 것이다.

그렇기 때문에 id를 사용하면 안된다. id는 이미 프록시 객체가 들고 있는 정보 이므로 getId\(\)를 호출한다고 해서 영속성 컨텍스트를 조회하지 않는다. 확인을 위해서는 id가 아닌 다른 필드를 조회할 필요가 있다.

```java
@RestController
@RequestMapping("person")
public class PersonController {
    @Autowired
    PersonService personService;

    @GetMapping
    public Person get(){
        Person person = personService.get(1);
        Team team = person.getTeam();
        System.out.println(team.getName());
        return person;
    }
}

@Service
public class PersonService {
    @Autowired
    PersonRepository personRepository;

    @Transactional
    public Person get(int id){
        return personRepository.findById(id).get();
    }
}
```

목 데이터는 이미 생성되었고, 이제 호출을 해보자\(실행은 인텔리제이에 내장되어 있는 http 플러그인을 사용하였다.\)

```java
GET <http://localhost:8080/person>

HTTP/1.1 500 
Content-Type: application/json
Transfer-Encoding: chunked
Date: Mon, 12 Oct 2020 16:01:55 GMT
Connection: close

{
  "timestamp": 1602518515356,
  "status": 500,
  "error": "Internal Server Error",
  "trace": "org.hibernate.LazyInitializationException: could not initialize proxy [com.example.practice.osiv.Team#1] - no Session\\n\\tat org.hibernate.proxy.AbstractLazyInitializer.initialize(AbstractLazyInitializer.java:170)\\n\\tat org.hibernate.proxy.AbstractLazyInitializer.getImplementation(AbstractLazyInitializer.java:310)\\n\\tat org.hibernate.proxy.pojo.bytebuddy.ByteBuddyInterceptor.intercept(ByteBuddyInterceptor.java:45)\\n\\tat org.hibernate.proxy.ProxyConfiguration$InterceptorDispatcher.intercept(ProxyConfiguration.java:95)\\n\\tat com.example.practice.osiv.Team$HibernateProxy$XDWbbFAf.getName(Unknown Source)\\n\\tat com.example.practice.osiv.PersonController.get(PersonController.java:22)\\n\\tat java.base/jdk.internal.reflect.NativeMethodAccessorImpl.invoke0(Native Method)\\n\\tat java.base/jdk.internal.reflect.NativeMethodAccessorImpl.invoke(NativeMethodAccessorImpl.java:62)\\n\\tat java.base/jdk.internal.reflect.DelegatingMethodAccessorImpl.invoke(DelegatingMethodAccessorImpl.java:43)\\n\\tat java.base/java.lang.reflect.Method.invoke(Method.java:567)\\n\\tat org.springframework.web.method.support.InvocableHandlerMethod.doInvoke(InvocableHandlerMethod.java:190)\\n\\tat org.springframework.web.method.support.InvocableHandlerMethod.invokeForRequest(InvocableHandlerMethod.java:138)\\n\\tat org.springframework.web.servlet.mvc.method.annotation.ServletInvocableHandlerMethod.invokeAndHandle(ServletInvocableHandlerMethod.java:105)\\n\\tat org.springframework.web.servlet.mvc.method.annotation.RequestMappingHandlerAdapter.invokeHandlerMethod(RequestMappingHandlerAdapter.java:878)\\n\\tat org.springframework.web.servlet.mvc.method.annotation.RequestMappingHandlerAdapter.handleInternal(RequestMappingHandlerAdapter.java:792)\\n\\tat org.springframework.web.servlet.mvc.method.AbstractHandlerMethodAdapter.handle(AbstractHandlerMethodAdapter.java:87)\\n\\tat org.springframework.web.servlet.DispatcherServlet.doDispatch(DispatcherServlet.java:1040)\\n\\tat org.springframework.web.servlet.DispatcherServlet.doService(DispatcherServlet.java:943)\\n\\tat org.springframework.web.servlet.FrameworkServlet.processRequest(FrameworkServlet.java:1006)\\n\\tat org.springframework.web.servlet.FrameworkServlet.doGet(FrameworkServlet.java:898)\\n\\tat javax.servlet.http.HttpServlet.service(HttpServlet.java:626)\\n\\tat org.springframework.web.servlet.FrameworkServlet.service(FrameworkServlet.java:883)\\n\\tat javax.servlet.http.HttpServlet.service(HttpServlet.java:733)\\n\\tat org.apache.catalina.core.ApplicationFilterChain.internalDoFilter(ApplicationFilterChain.java:231)\\n\\tat org.apache.catalina.core.ApplicationFilterChain.doFilter(ApplicationFilterChain.java:166)\\n\\tat org.apache.tomcat.websocket.server.WsFilter.doFilter(WsFilter.java:53)\\n\\tat org.apache.catalina.core.ApplicationFilterChain.internalDoFilter(ApplicationFilterChain.java:193)\\n\\tat org.apache.catalina.core.ApplicationFilterChain.doFilter(ApplicationFilterChain.java:166)\\n\\tat org.springframework.web.filter.CharacterEncodingFilter.doFilterInternal(CharacterEncodingFilter.java:201)\\n\\tat org.springframework.web.filter.OncePerRequestFilter.doFilter(OncePerRequestFilter.java:119)\\n\\tat org.apache.catalina.core.ApplicationFilterChain.internalDoFilter(ApplicationFilterChain.java:193)\\n\\tat org.apache.catalina.core.ApplicationFilterChain.doFilter(ApplicationFilterChain.java:166)\\n\\tat org.apache.catalina.core.StandardWrapperValve.invoke(StandardWrapperValve.java:202)\\n\\tat org.apache.catalina.core.StandardContextValve.invoke(StandardContextValve.java:96)\\n\\tat org.apache.catalina.authenticator.AuthenticatorBase.invoke(AuthenticatorBase.java:541)\\n\\tat org.apache.catalina.core.StandardHostValve.invoke(StandardHostValve.java:139)\\n\\tat org.apache.catalina.valves.ErrorReportValve.invoke(ErrorReportValve.java:92)\\n\\tat org.apache.catalina.core.StandardEngineValve.invoke(StandardEngineValve.java:74)\\n\\tat org.apache.catalina.connector.CoyoteAdapter.service(CoyoteAdapter.java:343)\\n\\tat org.apache.coyote.http11.Http11Processor.service(Http11Processor.java:373)\\n\\tat org.apache.coyote.AbstractProcessorLight.process(AbstractProcessorLight.java:65)\\n\\tat org.apache.coyote.AbstractProtocol$ConnectionHandler.process(AbstractProtocol.java:868)\\n\\tat org.apache.tomcat.util.net.NioEndpoint$SocketProcessor.doRun(NioEndpoint.java:1589)\\n\\tat org.apache.tomcat.util.net.SocketProcessorBase.run(SocketProcessorBase.java:49)\\n\\tat java.base/java.util.concurrent.ThreadPoolExecutor.runWorker(ThreadPoolExecutor.java:1128)\\n\\tat java.base/java.util.concurrent.ThreadPoolExecutor$Worker.run(ThreadPoolExecutor.java:628)\\n\\tat org.apache.tomcat.util.threads.TaskThread$WrappingRunnable.run(TaskThread.java:61)\\n\\tat java.base/java.lang.Thread.run(Thread.java:830)\\n",
  "message": "could not initialize proxy [com.example.practice.osiv.Team#1] - no Session",
  "path": "/person"
}

Response code: 500; Time: 53ms; Content length: 4894 bytes
```

더 자세한 오류를 확인하기 위해 애플리케이션 로그를 확인 해보자

![](../../.gitbook/assets/111%20%2819%29.png)

22번째 라인에서 오류가 발생했다는 것을 확인할 수 있고 LazyInitializationException 이 발생한 것을 확인할 수 있다.

### 뷰 영역에서 엔티티를 수정할 경우 DB에 반영이 될까?

트랜잭션을 사용하는 서비스 계층이 끝날 때 트랜잭션이 커밋되면서 이미 플러시를 했기 때문에 스프링이 제공하는 OSIV 서블릿 필터나 OSIV 스프링 인터셉터는 요청이 끝나면 플러시를 호출하지 않고 em.close\(\)로 영속성 컨텍스트만 종료해 버리므로 플러시가 일어나지 않는다. 만약 뷰 영역에서 em.flush\(\)를 강제로 호출해도 트랜잭션 범위 밖이라는 예외가 발생하게 될 것이다.

## OSIV 단점

지금까지의 OSIV의 특징을 보면 편리한 기능이라고 생각할 수 있다. 하지만 OSIV는 잘못 사용하게 되면 데이터가 변조되어 예외보다 더 큰 사고를 경험하게 될 수 있다.

만약 컨트롤러 영역에서 여러 서비스 메소드를 호출한다고 가정해보자. 조회를 한 다음에 엔티티의 이름을 변경하고 다시 조회를 하려고 한다.

```java
@GetMapping
public Person get(){
    Person person = personService.get(1);
    person.setName("steve");
    Person person2 = personService.get(1);
    return person;
}
```

해당 API를 호출하고 실제 디비에 저장된 데이터를 확인해보자

![](../../.gitbook/assets/222%20%2814%29.png)

이름이 steve로 변경된 걸 확인할 수 있다.

### 왜 이름이 변경되었을까?

personService.get\(1\) 메소드는 @Transactional 애노테이션으로 감싸져 있어서 메소드가 종료하면 자동으로 엔티티 매니저는 flush\(\)를 수행한다. 이때, dirty check를 하여 변경된 내용이 있을 경우에 데이터베이스에 커밋하게 되는데 뷰 영역에서 변경된 이름 정보가 다음에 호출된 personService.get\(1\)를 종료할 시점에 캡쳐된 엔티티 정보와 flush 시점에 해당 엔티티의 데이터가 일치하지 않아서 commit이 발생하였다.

#### OSIV의 단점을 정리해보자

* `OSIV`를 적용하면 같은 영속성 컨텍스트를 `여러 트랜잭션`이 `공유`할 수 있다는 점을 주의해야 한다.
* `프리젠테이션 계층`에서 엔티티를 수정 하고나서 비즈니스 로직을 수행하면 `엔티티`가 수정될 수 있다.
* 프리젠테이션 계층에서 지연 로딩에 의한 `SQL`이 실행된다. 따라서 성능 `튜닝`시에 확인해야 할 부분이 넓다.

## 참고

* [김영한님의 JPA ORM 프로그래밍](http://www.acornpub.co.kr/book/jpa-programmig)
* [https://kingbbode.tistory.com/27](https://kingbbode.tistory.com/27)
* [https://joont92.github.io/jpa/웹-어플리케이션과-영속성-관리/](https://joont92.github.io/jpa/%EC%9B%B9-%EC%96%B4%ED%94%8C%EB%A6%AC%EC%BC%80%EC%9D%B4%EC%85%98%EA%B3%BC-%EC%98%81%EC%86%8D%EC%84%B1-%EA%B4%80%EB%A6%AC/)
* [https://stylishc.tistory.com/150](https://stylishc.tistory.com/150)
* [https://ppomelo.tistory.com/154](https://ppomelo.tistory.com/154)

