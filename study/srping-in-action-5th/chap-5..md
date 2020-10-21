---
description: 스프링 인 액션(5판) 챕터 5장을 요약한 내용 입니다.
---

# Chap 5. 구성 속성 사용하기

자동-구성은 스프링 애플리케이션 개발을 굉장히 단순화해 준다. 그러나 스프링 XML 구성으로 속성 값을 설정하던 지난 10년간은 명시적으로 빈을 구성하지 않고는 속성을 설정하는 마땅한 방법이 없었다. 스프링 애플리케이션 컨텍스트에서 구성 속성은 빈의 속성이다. 그리고 JVM 시스템 속성, 명령행 인자, 환경 변수 등의 여러 가지 원천 속성 중에서 설정할 수 있다.

## 자동-구성 세부 조정하기

스프링 관련 구성은 두 가지로 이해할 수 있다.

* 빈 연결\(Bean wiring\) : 스프링 애플리케이션 컨텍스트에서 빈으로 생성되는 애플리케이션 컴포넌트 및 상호 간에 주입되는 방법을 선언하는 구성
* 속성 주입\(Property injection\) : 스프링 애플리케이션 컨텍스트에서 빈의 속성 값을 설정하는 구성

### 스프링 환경 추상화 이해하기

스프링 환경 추상화는 구성 가능한 모든 속성을 한 곳에서 관리하는 개념이다. 스프링 환경에서는 다음과 같은 속성의 근원으로부터 원천 속성을 가져온다.

* JVM 시스템 속성
* 운영체제의 환경 변수
* 명령행 인자
* 애플리케이션의 속성 구성 파일

![https://s3-us-west-2.amazonaws.com/secure.notion-static.com/57fee965-943a-4cd5-ac47-8a4ca8d90808/68747470733a2f2f74312e6461756d63646e2e6e65742f6366696c652f746973746f72792f393941333945343535463232463742373330.jpg](https://s3-us-west-2.amazonaws.com/secure.notion-static.com/57fee965-943a-4cd5-ac47-8a4ca8d90808/68747470733a2f2f74312e6461756d63646e2e6e65742f6366696c652f746973746f72792f393941333945343535463232463742373330.jpg)

간단한 예로, 애플리케이션을 실행해 주는 서블릿 컨테이너의 포트를 설정한다고 해보자.

* src/main/resources/application.properties 파일에 작성할 수 있다.

  ```text
  server.port=9090
  ```

* src/main/resources/application.yml 파일에 값을 설정할 수 있다.

  ```text
  server:
  	port: 9090
  ```

* 애플리케이션을 시작할 때 명령행 인자로 server.port 속성을 지정할 수도 있다.

  ```text
  $ java -jar tacocloud-0.0.5-SNAPSHOT.jar --server.port=9090
  ```

* 운영체제 환경변수에 설정할 수 있다.

  ```text
  $ export SERVER_PORT=9090
  ```

이처럼 구성 속성을 설정하는 방법에는 여러 가지가 있다.

### 데이터 소스 구성하기

Datasource 빈을 자동-구성할 때 스프링 부트가 이런 속성 설정을 연결 데이터로 사용한다. 또한, 톰캣의 JDBC 커넥션 풀을 classpath에서 자동으로 찾을 수 있다면 Datasource 빈이 그것을 사용한다. 그러나 그렇지 않다면 스프링 부트는 다음 중 하나의 다른 커넥션 풀을 classpath에서 찾아 사용한다.

* HikariCP
* Commons DBCP 2

이것이 스프링 부트의 자동-구성을 통해서 사용 가능한 커넥션 풀이다.

### 내장 서버 구성하기

server.port 속성을 사용하여 포트를 설정하는 방법은 이미 알아보았다. 그런데 만일 server.port가 0으로 설정되면 어떻게 될까?

```text
server:
	port: 0
```

server.port를 0으로 설정하더라도 서버는 0번 포트로 시작하지 않고 사용 가능한 포트를 무작위로 선택하여 시작한다. 이것은 자동화된 통합 테스트를 실행할 때 유용하다. 즉, 동시적으로 실행되는 어떤 테스트도 같은 포트 번호로 인한 충돌이 생기지 않기 때문이다.

### 로깅 구성하기

기본적으로 스프링 부트는 INFO 수준\(level\)으로 콘솔에 로그 메시지를 쓰기 위해 Logback을 통해 로깅을 구성한다.

```text
<configuration>
    <appender name="STDOUT" class="ch.qos. logback.core.ConsoleAppender">
        <encoder>
            <pattern>
                %d{HH:mm:ss.SSS} [%thread] %-5level %logger{36} – "ómsg%n
            </pattern>
        </encoder>
    </appender>
    <logger name="root" level="INFO"/>
    <root level="INFO">
        <appender-ref ref="STDOUT"/>
    </root>
</configuration>
```

로깅 수준을 설정할 때는 logging.level을 접두어로 갖는 속성들을 생성한다. 그리고 그 다음에 로깅 수준을 설정하기 원하는 로거의 이름을 붙인다.

```text
logging:
  level:
    root: WARN
    org:
      springframework:
        security: DEBUG
```

### 다른 속성의 값 가져오기

스프링 부트 애플리케이션에서는 하드 코딩된 속성 값을 설정하지 않고 다른 구성 속성으로붙어 값을 가져올 수도 있다.

```text
greeting:
  welcome: ${spring.application.name}
```

## 우리의 구성 속성 생성하기

구성 속성의 올바른 주입을 지원하기 위해 스프링 부트는 @ConfigurationProperties 애노테이션을 제공한다. 그리고 어떤 스프링 빈이건 이 애노테이션이 지정되면, 해당 빈의 속성들이 스프링 환경의 속성으로부터 주입될 수 있다.

```java
@Slf4j
@Controller
@RequestMapping("/orders")
@SessionAttributes("order")
@ConfigurationProperties(prefix="taco.orders")
public class OrderController {
	
	private int pageSize = 20;

	public void setPageSize(int pageSize) {
	  this.pageSize = pageSize;
	}
	
	...
}
```

@ConfigurationProperties 애노테이션에 지정된 접두어 taco.orders다. 따라서 pageSize 구성 속성 값을 설정할 때는 taco.orders.pageSize라는 이름을 사용해야 한다.

### 구석 속성 홀더 정의하기

@ConfigurationProperties가 반드시 컨트롤러나 특정 빈에만 사용될 수 있는 것은 아니다. 실제로 @ConfigurationProperties는 구성 데이터의 홀더로 사용되는 빈에 지정되는 경우가 많다.

```java
@Component
@ConfigurationProperties(prefix="taco.orders")
@Data
@Validated
public class OrderProps {

	@Min(value=5, message="must be between 5 and 25")
	@Max(value=25, message="must be between 5 and 25")
	private int pageSize = 20;
	
}
```

@Component가 지정되었으므로, 스프링 컴포넌트 검색에서 OrderProps를 자동으로 찾은 후 스프링 애플리케이션 컨텍스트의 빈으로 생성해 준다. OrderProps와 같은 구성 속성 홀더 클래스에 특별한 것은 없다. 구성 속성 홀더는 스프링 환경으로부터 주입되는 속성들을 갖는 빈이므로 해당 속성들이 필요한 다른 빈에 주입될 수 있다. 따라서 OrderController에서는 기존의 pageSize 속성을 제거하고 OrderProps 빈을 주입해서 사용하면 된다.

```java
@Slf4j
@Controller
@RequestMapping("/orders")
@SessionAttributes("order")
public class OrderController {
	
	@Autowired
	private OrderProps props;
	
	...
}
```

게다가 주문에 관련된 구성 속성들을 한군데\(OrderProps 클래스\)에 모아 둘 수 있다. 따라서 해당 속성들의 추가, 삭제, 이름 변경 등을 해야 할 때는 OrderProps만 변경하면 된다.

### 구성 속성 메타데이터 선언하기

application.yml을 편집기에서 열어보자. 각자 사용하는 IDE에 따라 다를 수 있지만, taco.orders.pageSize 항목에서 Unknown Property 'taco'와 같은 경고 메시지가 나타날 수 있다.

구성 속성 메타데이터는 선택적이므로 설사 없더라도 구성 속성이 동작하는 데 문제가 생기지는 않는다. 그러나 메타데이터가 있으면 해당 구성 속성에 관해 최소한의 정보를 제공해주므로 유용하다.

우선, 다음과 같이 spring-boot-configuration-processor\(스프링 부트 구성 처리기\) 의존성을 pom.xml 파일에 추가하자

```text
<dependency>
	<groupId>org.springframework.boot</groupId>
	<artifactId>spring-boot-configuration-processor</artifactId>
	<optional>true</optional>
</dependency>
```

spring-boot-configuration-processor는 @ConfigurationProperties 애노테이션이 지정된 애플리케이션 클래스에 관한 메타데이터를 생성하는 애노테이션 처리기다. 그리고 생성된 메타데이터는 application.yml이나 application.properties를 작성할 때 자동-완성 기능 제공 및 속성의 문서를 보여주기 위해 STS와 같은 IDE에서 사용된다.

우리의 커스텀 구성 속성에 관한 메타데이터를 생성하려면 프로젝트의 src/main/resources/META-INF 아래에 additional-spring-configuration-metadata.json이라는 이름의 파일을 생성해야 한다.

그다음에 메타데이터를 입력하고 저장하자. 이것은 JSON 형식으로 된 taco.orders.pageSize 속성의 메타데이터다.

```text
{
	"properties": [
	  {
	    "name": "taco.orders.page-size",
	    "type": "java.lang.String",
	    "description": "Sets the maximum number of orders to display in a list."
	  },
	  {
	    "name": "taco.discount.codes",
	    "type": "java.util.Map<String, Integer>",
	    "description": "A map of discount codes to a discount percentage."
	  }
	]
}
```

## 프로파일 사용해서 구성하기

애플리케이션이 서로 다른 런타임 환경에 배포, 설치될 때는 대게 구성 명세가 달라진다. 하지만 하나 이상의 구성 속성을 환경 변수로 지정하는 것은 번거롭다. 게다가 환경 변수의 변경을 추적 관리하거나 오류가 있을 경우에 변경 전으로 바로 되돌릴 수 있는 방법이 마땅치 않다. 따라서 저자는 이 방법 대신 스프링 프로파일의 사용을 선호한다.

### 프로파일 특성 속성 정의하기

프로퍼티 파일은 프로파일 별로 관리할 수 있다. 즉, application-{프로파일 이름}.yml 또는 application-{프로파일 이름}.properties이다.

또는 YAML 구성에서만 가능한 또 다른 방법으로 프로파일 특정 속성을 정의할 수도 있다. 이때는 프로파일에 특정되지 않고 공통으로 적용되는 기본 속성과 함께 프로파일 특정 속성을 application.yml에 지정할 수 있다. 즉 프로파일에 특정되지 않는 기본 속성 다음에 3개의 하이픈\(—-\)을 추가하고 그다음에 해당 프로파일의 이름을 나타내는 spring.profiles 속성을 지정하면 된다.

```text
spring:
  data:
    rest:
      base-path: /api

---
spring:
  profiles: prod
  
  datasource:
    url: jdbc:mysql://localhost/tacocloud
    username: tacouser
    password: tacopassword
    
logging:
  level:
    tacos: WARN
```

### 프로파일 활성화하기

[spring.profiles.active](http://spring.profiles.active) 속성에 지정하면 특정 프로파일을 활성화 할 수 있다.

```text
spring:
  profiles:
    active:
      - prod
```

그러나 이것은 가장 좋지 않은 프로파일 활성화 방법일 것이다. 만일 application.yml에서 활성화 프로파일을 설정하면 해당 프로파일이 기본 프로파일이 된다. 이때는 다음과 같이 프로덕션 환경의 SPRING\_PROFILES\_ACTIVE를 설정할 수 있다.

```text
% export SPRING_PROFILES_ACTIVE=prod
```

만일 실행 가능한 JAR 파일로 애플리케이션을 실행한다면, 다음과 같이 명령행 인자로 활성화 프로파일을 설정할 수도 있다.

```text
% java -jar taco-cloud.jar --spring.profiles.active=prod
```

### 프로파일을 사용해서 조건별로 빈 생성하기

서로 다른 프로파일 각각에 적합한 빈들을 제공하는 것이 유용할 때가 있다. 그러나 특정 프로파일이 활성화될 때만 생성되어야 하는 빈들이 있다고 해보자. 이 경우 @Profile 애노테이션을 사용하면 지정된 프로파일에만 적합한 빈들을 나타낼 수 있다.

```text
@Profile({"jms-template", "rabbitmq-template"})
@Configuration
public class WebConfig implements WebMvcConfigurer { ... }

@Profile("!prod")
@Configuration
public class DevelopmentConfig { ... }
```

여기서 느낌표\(!\)는 부정의 의미이므로 prod 프로파일이 활성화디지 않을 경우 Command LineRunner 빈이 생성됨을 나타낸다.

## 요약

* 스프링 빈에 @ConfigurationProperties를 지정하면 여러 가지 원천 속성으로부터 구성 속성 값의 주입을 활성화할 수 있다.
* 구성 속성은 명령행 인자, 환경 변수, JVM 시스템 속성, 속성 파일, YAML 파일, 커스텀 속성 등에서 설정할 수 있다.
* 데이터 소스 URL과 로깅 수준의 지정을 포함해서 구성 속성은 스프링의 자동-구성 설정을 변경하는 데 사용할 수 있다.
* 스프링 프로파일은 활성화된 프로파일을 기반으로 구성 속성을 설정하기 위해 사용할 수 있다.

