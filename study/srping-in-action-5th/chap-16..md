---
description: 스프링 인 액션(5판) 챕터 16장을 요약한 내용 입니다.
---

# CHAP 16. 스프링 부트 액추에이터 사용하기

액추에이터는 스프링 부트 애플리케이션의 모니터링이나 매트릭\(metric\)과 같은 기능을 HTTP와 JMX 엔드포인트를 통해 제공한다.

## 액추에이터 개요

액추에이터는 실행 중인 애플리케이션의 내부를 볼 수 있게 하고, 어느 정도까지는 애플리케이션의 작동 방법을 제어할 수 있게 한다. 예를 들면, 다음과 같다.

* 애플리케이션 환경에서 사용할 수 있는 구성 속성들
* 애플리케이션에 포함된 다양한 패키지의 로깅 레벨\(logging level\)
* 애플리케이션이 사용 중인 메모리
* 지정된 엔드포인트가 받은 요청 횟수
* 애플리케이션의 건강 상태 정보

스프링 부트 애플리케이션에 액추에이터를 활성화하려면 의존성을 빌드에 추가해야 한다.

```java
<dependency>
	<groupId>org.springframework.boot</groupId>
	<artifactId>spring-boot-starter-actuator</artifactId>
</dependency>
```

액추에이터 스타터가 프로젝트 빌드의 일부가 되면 애플리케이션에서 여러 가지 액추에이터 엔드포인트를 사용할 수 있다.

#### 액추에이터 엔드 포인

| HTTP 메서드 | 경로 | 설명 | 디폴트 활성화 |
| :--- | :--- | :--- | :--- |
| GET | /auditevents | 호출된 감사\(audit\) 이벤트 리포트를 생성한다. | No |
| GET | /beans | 스프링 애플리케이션 컨텍스트의 모든 빈을 알려준다. | No |
| GET | /conditions | 성공 또는 실패했던 자동-구성 조건의 내역을 생성한다. | No |
| GET | /configprop | 모든 구성 속성들을 현재 값과 같이 알려준다. | No |
| GET,POST,DELETE | /env | 스프링 애플리케이션에 사용할 수 있는 모든 속성 근원과 이 근원들의 속성을 알려준다. | No |
| GET | /env/{toMatch} | 특정 환경 속성의 값을 알려준다. | No |
| GET | /health | 애플리케이션의 건강 상태 정보를 반환한다. | Yes |
| GET | /heapdump | 힙\(heap\) 덤프를 다운로드한다. | No |
| GET | /httptrace | 가장 퇴근의 100개 요청에 대한 추적 기록을 생성한다. | No |
| GET | /info | 개발자가 정의한 애플리케이션에 관란 정보를 반환한다. | Yes |
| GET | /loggers | 애플리케이션의 패키지 리스트\(각 패키지의 로깅 레벨이 포함된\)를 생성한다. | No |
| GET,POST | /loggers/{name} | 지정된 로거의 로깅 레벨\(구성된 로깅 레벨과 유효 로깅 레벨 모두\)을 반환한다. 유효 로깅 레벨은 HTTP POST 요청으로 설정될 수 있다. | No |
| GET | /mappings | 모든 HTTP 매핑과 이 매핑들을 처리하는 핸들러 메서드들의 내역을 제공한다. | No |
| GET | /metrics | 모든 메트릭 리스트를 반환한다. | No |
| GET | /metrics/{name} | 지정된 메트릭의 값을 반환한다. | No |
| GET | /scheduledtasks | 스케줄링된 모든 태스크의 내역을 제공한다. | No |
| GET | /threaddump | 모든 애플리케이션 스레드의 내역을 반환한다. | No |

### 액추에이터의 기본 경로 구성하기

엑추에이터의 모든 엔드포인트의 경로에는 /actuator가 앞에 붙는다. 액추에이터의 기본 경로는 management.endpoint.web.base-path 속성을 설정하여 변경할 수 있다.

```text
management:
  endpoints:
    web:
      base-path: /management
```

### 액추에이터 엔드포인트의 활성화와 비활성화

액추에이터를 추가하면 /health와 /info 엔드포인트만 기본적으로 활성화되는 것을 알 수 있다. 대부분의 액추에이터 엔드포인트는 민감한 정보를 제공하므로 보안 처리가 되어야 하기 때문이다. 물론 스프링 시큐리티를 사용해서 액추에이터를 보안 처리할 수 있다. 그러나 액추에이터 자체로는 보안 처리가 되어 있지 않으므로 대부분의 엔드포인트가 기본적으로 비활성화되어 있다.

엔드포인트의 노출 여부를 제어할 때는 management.endpoints.web.exposure.include와 management.endpoints.web.exposure.exclude 구성 속성을 사용할 수 있다.

```text
management:
  endpoints:
    web:
      exposure:
        include: health,info,beans,conditions
        exclude: threaddump, heapdump
```

## 액추에이터 엔드포인트 소비하기

### 애플리케이션 기본 정보 가져오기

실행 중인 스프링 부트 애플리케이션에 관한 정보를 알려면 /info 앤드포인트에 요구하면 된다. /info 엔드포인트가 반환하는 정보를 제공하는 방법은 몇 가지가 있다. 이중 이름이 info.으로 시장하는 하나 이상의 구성 속성을 생성하는 것이 가장 쉬운 방법이다.

```text
info:
  contact:
    email: support@tacocloud.com
    phone: 822-625-6831
```

속성 이름이 info. 으로 시작하므로 이제는 /info 엔드포인트가 다음과 같이 응답한다.

```text
{
  "contact": {
    "email": "support@tacocloud.com"
    "phone": "822-625-6831"
	}
}
```

### 애플리케이션의 건강 상태 살펴보기

/health 엔드포인트에 HTTP GET 요청을 하면 애플리케이션의 건강 상태 정보를 갖는 간단한 JSON 응답을 받는다.

```text
$ curl localhost:8080/actuator/health
{"status":"up"}
```

각 지표의 건강 상태는 다음중 하나가 될 수 있다.

* UP : 외부 시스템이 작동 중이고 접근 가능하다.
* DOWN : 외부 시스템이 작동하지 않거나 접근할 수 없다.
* UNKNOWN : 외부 시스템의 상태가 분명하지 않다.
* OUT\_OF\_SERVICE : 외부 시스템에 접근할 수 있지만, 현재는 사용할 수 없다.

만약 건강 지표의 상세 내역을 보려면 속성 정보를 변경해 주어야 한다. management.endpoint.health.show-details 속성의 기본값은 never 이므로 항상 상세 내역을 보고싶으면 always로 설정하면 된다.

```text
management:
  endpoint:
    health:
      show-details: always
```

그러면 다음과 같은 결과값을 반환될 수 있다.

```text
{
  "status": "UP",
  "details": {
    "diskSpace": {
      "status": "UP",
      "details": {
        "total": 499963174912,
        "free": 394359185408,
        "threshold": 10485760
      }
    },
    "mongo": {
      "status": "UP",
      "details": {
        "version": "3.2.2"
      }
    },
    "refreshScope": {
      "status": "UP"
    },
    "discoveryComposite": {
      "status": "UP",
      "details": {
        "discoveryClient": {
          "status": "UP",
          "details": {
            "services": [
              
            ]
          }
        },
        "eureka": {
          "description": "Eureka discovery client has not yet successfully connected to a Eureka server",
          "status": "UP",
          "details": {
            "applications": {
              
            }
          }
        }
      }
    },
    "configServer": {
      "status": "UNKNOWN",
      "details": {
        "error": "no property sources located"
      }
    },
    "hystrix": {
      "status": "UP"
    }
  }
}
```

스프링 부트는 다른 외부 데이터베이스와 시스템의 건강 지표들도 제공한다.

* 카산드라
* 구성 서버
* Couchbase
* 유레카
* Hystrix
* JDBC 데이터 소스
* Elasticsearch
* InfluxDB
* JMS 메시지 브로커
* LDAP
* 이메일 서버
* Neo4j
* Rabbit 메시지 브로커
* Redis
* Slor

## 구성 상세 정보 보기

### 빈\(beans\) 연결 정보 얻기

스프링 애플리케이션 컨텍스트를 살펴보는 데 가장 중요한 엔드포인트가 /beans 엔드포인트다. 이 엔드포인트는 애플리케이션 컨텍스트의 모든 빈을 나타내는 JSON 문서\(빈의 이름, 자바 타입, 주입되는 다른 빈 등\)를 반환한다.

```text
{
  "contexts": {
    "application-1": {
      "beans": {
        "discoveryClientHealthIndicator": {
          "aliases": [
            
          ],
          "scope": "singleton",
          "type": "org.springframework.cloud.client.discovery.health.DiscoveryClientHealthIndicator",
          "resource": "class path resource [org/springframework/cloud/client/CommonsClientAutoConfiguration$DiscoveryLoadBalancerConfiguration.class]",
          "dependencies": [
            "compositeDiscoveryClient",
            "spring.cloud.discovery.client.health-indicator-org.springframework.cloud.client.discovery.health.DiscoveryClientHealthIndicatorProperties"
          ]
        },
        "org.springframework.cloud.netflix.eureka.EurekaClientAutoConfiguration$RefreshableEurekaClientConfiguration": {
          "aliases": [
            
          ],
          "scope": "singleton",
          "type": "org.springframework.cloud.netflix.eureka.EurekaClientAutoConfiguration$RefreshableEurekaClientConfiguration$$EnhancerBySpringCGLIB$$4e7eb7f4",
          "resource": null,
          "dependencies": [
            "discoveryClientOptionalArgs"
          ]
        },
        "inetUtils": {
          "aliases": [
            
          ],
          "scope": "singleton",
          "type": "org.springframework.cloud.commons.util.InetUtils",
          "resource": "class path resource [org/springframework/cloud/commons/util/UtilAutoConfiguration.class]",
          "dependencies": [
            "inetUtilsProperties"
          ]
        },
....
```

### 자동-구성 내역 알아보기

자동-구성은 스프링 부트가 제공하는 가장 강력한 기능 중 하나다. 그러나 때로는 왜 자동-구성이 되었는지 궁금할 것이다. 이런 경우에 /conditions 엔드포인트의 GET요청을 하여 확인할 수 있다.

```text
{
  "contexts": {
    "application-1": {
      "positiveMatches": {
        "AuditAutoConfiguration#auditListener": [
          {
            "condition": "OnBeanCondition",
            "message": "@ConditionalOnMissingBean (types: org.springframework.boot.actuate.audit.listener.AbstractAuditListener; SearchStrategy: all) did not find any beans"
          }
        ],
        "AuditAutoConfiguration#authenticationAuditListener": [
          {
            "condition": "OnClassCondition",
            "message": "@ConditionalOnClass found required class 'org.springframework.security.authentication.event.AbstractAuthenticationEvent'; @ConditionalOnMissingClass did not find unwanted class"
          },
          {
            "condition": "OnBeanCondition",
            "message": "@ConditionalOnMissingBean (types: org.springframework.boot.actuate.security.AbstractAuthenticationAuditListener; SearchStrategy: all) did not find any beans"
          }
        ],
        "AuditAutoConfiguration#authorizationAuditListener": [
          {
            "condition": "OnClassCondition",
            "message": "@ConditionalOnClass found required class 'org.springframework.security.access.event.AbstractAuthorizationEvent'; @ConditionalOnMissingClass did not find unwanted class"
          },
          {
            "condition": "OnBeanCondition",
            "message": "@ConditionalOnMissingBean (types: org.springframework.boot.actuate.security.AbstractAuthorizationAuditListener; SearchStrategy: all) did not find any beans"
          }
        ],
...
```

### 환경 속성과 구성 속성 살펴보기

어떤 환경 속성들이 사용 가능하고 어떤 구성 속성들이 각 빈에 주입되었는지 파악하는 것도 중요하다. /env 엔드포인트에 GET 요청을 하면, 스프링 애플리케이션에 적용 중인 모든 속성 근원의 속성들을 포함하는 다소 긴 응답을 받는다. 여기에는 환경 변수, JVM 시스템 속성, application.properties, application.yml 파일, 그리고 스프링 클라우드 구성 서버의 속성까지도 포함된다.

```text
{
  "activeProfiles": [
    
  ],
  "propertySources": [
    {
      "name": "server.ports",
      "properties": {
        "local.server.port": {
          "value": 8080
        }
      }
    },
    {
      "name": "mongo.ports",
      "properties": {
        "local.mongo.port": {
          "value": 56240
        }
      }
    },
    {
      "name": "servletContextInitParams",
      "properties": {
        
      }
    },
    {
      "name": "systemProperties",
      "properties": {
        "java.specification.version": {
          "value": "13"
        },
        "sun.jnu.encoding": {
          "value": "UTF-8"
        },
        "java.class.path": {
          "value": "/Users/macpro/IncheolJung/Repositories/SpringInAction5/Ch16/taco-service/target/classes:/Users/macpro/.m2/repository/org/springframework/boot/spring-boot-starter-web/2.0.4.RELEASE/spring-boot-starter-web-2.0.4.RELEASE.jar:/Users/macpro/.m2/repository/org/springframework/boot/spring-boot-starter/2.0.4.RELEASE/spring-boot-starter-2.0.4.RELEASE.jar:/Users/macpro/.m2/repository/org/springframework/boot/spring-boot-starter-logging/2.0.4.RELEASE/spring-boot-starter-logging-2.0.4.RELEASE.jar:/Users/macpro/.m2/repository/ch/qos/logback/logback-classic/1.2.3/logback-classic-1.2.3.jar:/Users/macpro/.m2/repository/ch/qos/logback/logback-core/1.2.3/logback-core-1.2.3.jar:/Users/macpro/.m2/repository/org/apache/logging/log4j/log4j-to-slf4j/2.10.0/log4j-to-slf4j-2.10.0.jar:/Users/macpro/.m2/repository/org/apache/logging/log4j/log4j-api/2.10.0/log4j-api-2.10.0.jar:/Users/macpro/.m2/repository/org/slf4j/jul-to-slf4j/1.7.25/jul-to-slf4j-1.7.25.jar:/Users/macpro/.m2/repository/javax/annotation/javax.annotation-api/1.3.2/javax.annotation-api-1.3.2.jar:/Users/macpr
	....
```

/env 엔드포인트는 속성 값을 읽는 것은 물론 설정하는 데도 사용될 수 있다. 즉, name과 value 필드를 갖는 JSON 문서를 지정한 POST 요청을 /env 엔드포인트에 제출하면 실행 중인 애플리케이션의 속성을 설정할 수 있다.

```text
$ curl localhost:8080/actuator/env \\
	-d'{"name":"support@tacocloud.com","value":"incheol"}' \\
	-H "Content-type:application/json"
```

### HTTP 요청-매핑 내역 보기

애플리케이션이 처리할 수 있는 모든 종류의 HTTP 요청, 그리고 이런 요청들을 어떤 종류의 컴포넌트가 처리하는지를 전체적으로 파악할 수 있다. /mappings 엔드포인트에 GET 요청을 하면 다음과 같은 응답을 받을 수 있다.

```text
"contexts": {
    "application-1": {
      "mappings": {
        "dispatcherServlets": {
          "dispatcherServlet": [
            {
              "handler": "ResourceHttpRequestHandler [locations=[class path resource [META-INF/resources/], class path resource [resources/], class path resource [static/], class path resource [public/], ServletContext resource [/], class path resource []], resolvers=[org.springframework.web.servlet.resource.PathResourceResolver@aec5b52]]",
              "predicate": "/**/favicon.ico",
              "details": null
            },
            {
              "handler": "public java.lang.Object org.springframework.boot.actuate.endpoint.web.servlet.AbstractWebMvcEndpointHandlerMapping$OperationHandler.handle(javax.servlet.http.HttpServletRequest,java.util.Map<java.lang.String, java.lang.String>)",
              "predicate": "{[/actuator/beans],methods=[GET],produces=[application/vnd.spring-boot.actuator.v2+json || application/json]}",
              "details": {
                "handlerMethod": {
                  "className": "org.springframework.boot.actuate.endpoint.web.servlet.AbstractWebMvcEndpointHandlerMapping.OperationHandler",
                  "name": "handle",
                  "descriptor": "(Ljavax/servlet/http/HttpServletRequest;Ljava/util/Map;)Ljava/lang/Object;"
                },
                "requestMappingConditions": {
                  "consumes": [
                    
                  ],
                  "headers": [
                    
                  ],
                  "methods": [
                    "GET"
                  ],
                  "params": [
                    
                  ],
                  "patterns": [
                    "/actuator/beans"
                  ],
	...
```

### 로깅 레벨 관리하기

로깅은 모니터링 또는 디버깅의 수단을 제공할 수 있다. 로깅 레벨의 설정은 균형을 잡는 작업이 될 수 있다. 만일 로깅 레벨을 너무 장황한 것으로 설정하면 로그에 너무 많은 메시지가 나타나서 유용한 정보를 찾기 어려울 수 있다. 반면에 로깅 레벨을 너무 느슨한 것으로 설정하면 애플리케이션이 처리하는 것을 이해하는 데 로그가 도움이 되지 않을 수 있다. 실행 중인 애플리케이션에 어떤 로깅 레벨이 설정되었는지 궁금하다면 /loggers 앤드포인트에 GET 요청을 할 수 있다.

```text
{
  "levels": [
    "OFF",
    "ERROR",
    "WARN",
    "INFO",
    "DEBUG",
    "TRACE"
  ],
  "loggers": {
    "ROOT": {
      "configuredLevel": "INFO",
      "effectiveLevel": "INFO"
    },
    "com": {
      "configuredLevel": null,
      "effectiveLevel": "INFO"
    },
    "com.netflix": {
      "configuredLevel": null,
      "effectiveLevel": "INFO"
    },
    "com.netflix.appinfo": {
      "configuredLevel": null,
      "effectiveLevel": "INFO"
    },
    "com.netflix.appinfo.ApplicationInfoManager": {
      "configuredLevel": null,
      "effectiveLevel": "INFO"
    },
    "com.netflix.appinfo.InstanceInfo": {
      "configuredLevel": null,
      "effectiveLevel": "INFO"
    },
    "com.netflix.appinfo.providers": {
      "configuredLevel": null,
      "effectiveLevel": "INFO"
    },
    "com.netflix.appinfo.providers.Archaius1VipAddressResolver": {
      "configuredLevel": null,
      "effectiveLevel": "INFO"
    },
    "com.netflix.config": {
      "configuredLevel": null,
      "effectiveLevel": "INFO"
	...
```

## 애플리케이션 활동 지켜보기

애플리케이션이 처리하는 HTTP 요청이나 애플리케이션에 있는 모든 스레드의 작동을 포함해서 실행 중인 애플리케이션의 활동\(activity\)를 지켜보는 것은 유용한다. 이것을 위해 액추에이터는 /httptrace, /threaddump, /heapdump 엔드포인트를 제공한다.

/heapdump 엔드포인트는 상세하게 나타내기 가장 어려운 액추에이터 엔드포인트일 것이다. 간략히 말해서, 이 엔드포인트는 메모리나 스레드 문제를 찾는 데 사용할 수 있는 gzip 압축 형태의 HPROF 힙 덤프 파일을 다운로드한다.

### HTTP 요청 추적하기

/httptrace 엔드포인트는 애플리케이션이 처리한 가장 최근의 100개 요청을 알려주며, 다음 내용이 포함된다.

```text
{
  "traces": [
    {
      "timestamp": "2020-10-17T12:59:17.249Z",
      "principal": null,
      "session": null,
      "request": {
        "method": "GET",
        "uri": "<http://localhost:8080/httptrace>",
        "headers": {
          "sec-fetch-mode": [
            "navigate"
          ],
          "sec-fetch-site": [
            "none"
          ],
          "cookie": [
            "JSESSIONID=D7557C0876045E527703912102F70453"
          ],
          "accept-language": [
            "ko,en;q=0.9"
          ],
          "upgrade-insecure-requests": [
            "1"
          ],
          "host": [
            "localhost:8080"
          ],
          "connection": [
            "keep-alive"
          ],
          "dnt": [
            "1"
          ],
          "sec-fetch-user": [
            "?1"
          ],
          "accept-encoding": [
            "gzip, deflate, br"
          ],
          "sec-fetch-dest": [
            "document"
          ],
          "accept": [
            "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9"
          ],
          "user-agent": [
            "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_5) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/86.0.4240.80 Safari/537.36"
          ]
        },
        "remoteAddress": null
      },
      "response": {
        "status": 404,
        "headers": {
          
        }
      },
      "timeTaken": 4
    },
...
```

이런 데이터는 지속적으로 추적될 때 훨씬 더 유용하다. 17장에서 스프링 부트 Admin에서 이런 HTTP 추적 정보를 실시간으로 캡처하여 그래프로 보여주는 방법을 알아볼 것이다.

### 스레드 모니터링

HTTP 요청 추적에 추가하여 실행 중인 애플리케이션에서 무슨 일이 생기는지 결정하는 데 스레드의 활동이 유용할 수 있다. /threaddump 엔드포인트는 현재 실행 중인 스레드에 관한 스냅샷을 제공한다.

```text
"threads": [
    {
      "blockedCount": 0,
      "blockedTime": -1,
      "lockName": null,
      "lockOwnerId": -1,
      "lockOwnerName": null,
      "lockInfo": null,
      "stackTrace": [
        
      ],
      "threadId": 4,
      "threadName": "JIT Compilation Thread-000 Suspended",
      "threadState": "RUNNABLE",
      "waitedCount": 0,
      "waitedTime": -1,
      "inNative": false,
      "suspended": false,
      "lockedMonitors": [
        
      ],
      "lockedSynchronizers": [
        
      ]
    },
    {
      "blockedCount": 0,
      "blockedTime": -1,
      "lockName": null,
      "lockOwnerId": -1,
      "lockOwnerName": null,
      "lockInfo": null,
      "stackTrace": [
        
      ],
      "threadId": 5,
      "threadName": "JIT Compilation Thread-001 Suspended",
      "threadState": "RUNNABLE",
      "waitedCount": 0,
      "waitedTime": -1,
      "inNative": false,
      "suspended": false,
      "lockedMonitors": [
        
      ],
      "lockedSynchronizers": [
        
      ]
    },
	...
```

위의 정보를 보면 알수 있듯이 스레드 덤프에는 스레드의 블로킹과 록킹 상태의 관련 상세 정보와 스택 기록 등이 포함된다. 이 또한 스프링 부트 Admin에서 실시간 뷰로 모니터링 할 수 있다.

## 런타임 메트릭 활용하기

/metrics 엔드포인트는 실행 중인 애플리케이션에서 생성되는 온갖 종류의 메트릭을 제공할 수 있으며, 여기에는 메모리, 프로세스, 가비지 컬렉션, HTTP 요청 관련 메트릭 등이 포함된다.

```text
/ <http://localhost:8080/actuator/metrics>

{
  "names": [
    "jvm.memory.used",
    "jvm.memory.max",
    "process.files.max",
    "jvm.gc.memory.promoted",
    "tomcat.cache.hit",
    "jvm.memory.committed",
    "system.load.average.1m",
    "tomcat.cache.access",
    "jvm.gc.max.data.size",
    "jdbc.connections.max",
    "jdbc.connections.min",
    "http.server.requests",
    "system.cpu.count",
    "logback.events",
    "tomcat.global.sent",
    "jvm.buffer.memory.used",
    "tomcat.sessions.created",
    "jvm.threads.daemon",
    "system.cpu.usage",
    "jvm.gc.memory.allocated",
    "tomcat.global.request.max",
    "hikaricp.connections.idle",
    "hikaricp.connections.pending",
    "tomcat.global.request",
    "jvm.gc.pause",
    "tomcat.sessions.expired",
    "hikaricp.connections",
    "jvm.threads.live",
    "jvm.threads.peak",
    "tomcat.global.received",
    "hikaricp.connections.active",
    "hikaricp.connections.creation",
    "process.uptime",
    "tomcat.sessions.rejected",
	...
```

단순히 /metrics를 요청하는 대신에 /metrics/{메트릭 종류에 GET 요청을 하면 해당 종류의 메트릭에 관한 더 상세한 정보를 받을 수 있다.

```text
// <http://localhost:8080/actuator/metrics/http.server.requests>

{
  "name": "http.server.requests",
  "description": null,
  "baseUnit": "seconds",
  "measurements": [
    {
      "statistic": "COUNT",
      "value": 4.0
    },
    {
      "statistic": "TOTAL_TIME",
      "value": 0.11061680100000001
    },
    {
      "statistic": "MAX",
      "value": 0.012637797
    }
  ],
  "availableTags": [
    {
      "tag": "exception",
      "values": [
        "None"
      ]
    },
    {
      "tag": "method",
      "values": [
        "GET"
      ]
    },
    {
      "tag": "uri",
      "values": [
        "/actuator/metrics/{requiredMetricName}",
        "/**/favicon.ico",
        "/actuator/metrics",
        "/actuator/threaddump"
      ]
    },
```

이 응답에서 가장 중요한 부분은 measurements이며, 이것은 요청된 메트릭 종류에 속하는 모든 메트릭을 포함한다. 그러나 measurements에서는 전체 요청에 대한 정보만 있지 HTTP 200이나 HTTP 404 또는 HTTP 500 응답 상태를 초래한 요청이 각각 몇 개인지는 모른다. 이때는 availableTags 아래의 status 태그를 사용해서 해당 응답 상태를 초래한 모든 요청의 메트릭을 얻을 수 있다.

```text
// <http://localhost:8080/actuator/metrics/http.server.requests?tag=status:404>

{
  "name": "http.server.requests",
  "description": null,
  "baseUnit": "seconds",
  "measurements": [
    {
      "statistic": "COUNT",
      "value": 1.0
    },
    {
      "statistic": "TOTAL_TIME",
      "value": 0.012637797
    },
    {
      "statistic": "MAX",
      "value": 0.0
    }
  ],
  "availableTags": [
    {
      "tag": "exception",
      "values": [
        "None"
      ]
    },
    {
      "tag": "method",
      "values": [
        "GET"
      ]
    },
    {
      "tag": "uri",
      "values": [
        "/actuator/metrics/{requiredMetricName}"
      ]
    }
  ]
}
```

## 액추에이터 커스터마이징

액추에이터의 가장 큰 특징 중 하나는 애플리케이션의 특정 요구를 충족하기 위해 커스터마이징할 수 있다는 것이다. 즉 커스텀 엔드포인트를 생성할 수 있다.

### /info 엔드포인트에 정보 제공하기

스프링 부트는 InfoContributor라는 인터페이스를 제공하며, 이 인터페이스는 우리가 원하는 어떤 정보도 /info 엔드포인트 응답에 추가할 수 있게 한다.

### 커스텀 정보 제공자 생성하기

infoContributor를 구현하는 클래스를 생성하여 TacoRepository를 주입한다. 그리고 TacoRepository가 제공하는 타코 개수를 /info 엔드포인트에 추가한다.

```java
@Component
public class TacoCountInfoContributor implements InfoContributor {

  private TacoRepository tacoRepo;

  public TacoCountInfoContributor(TacoRepository tacoRepo) {
    this.tacoRepo = tacoRepo;
  }

  @Override
  public void contribute(Builder builder) {
    long tacoCount = tacoRepo.count();
    Map<String, Object> tacoMap = new HashMap<String, Object>();
    tacoMap.put("count", tacoCount);
    builder.withDetail("taco-stats", tacoMap);
  }

}
```

그런 다음에 /info 엔드포인트에 GET 요청을 하면 생성된 타코 개수가 포함된 다음 응답을 반환한다.

```text
// <http://localhost:8080/actuator/info>

{
  "contact": {
    "email": "support@tacocloud.com",
    "phone": "822-625-6831"
  },
  "taco-stats": {
    "count": 0
  }
}
```

### Git 커밋 정보 노출하기

Git 소스 코드 제어 시스템에 프로젝트를 유지/관리한다고 해보자. 이 경우 Git 커밋 정보를 /info 엔드포인트에 포함하고 싶을 수 있다. 이때는 메이븐 프로젝트의 pom.xml 파일에 다음의 플러그인을 추가해야 한다.

```text
<plugin>
	<groupId>pl.project13.maven</groupId>
	<artifactId>git-commit-id-plugin</artifactId>
	<configuration>
          	<skip>true</skip>
          	<!-- more config here as you see fit -->
      	</configuration>
</plugin>
```

그리고 애플리케이션이 실행될 때 스프링 부트에 특별히 구현된 InfoContributor에서 해당 파일을 찾아서 /info 엔드포인트 응답의 일부로 파일 내용을 노출시킨다.

/info 엔드포인트 응답에 나타나는 Git 정보에는 Git 분기와 커밋 정보 등이 포함된다.

```text
{
  "contact": {
    "email": "support@tacocloud.com",
    "phone": "822-625-6831"
  },
  "git": {
    "commit": {
      "id": {
        "describe-short": "4c885c6-dirty",
        "describe": "4c885c6-dirty",
        "abbrev": "4c885c6",
        "full": "4c885c6c1e7b51d4a1decbe592e472ef6e94b477"
      },
      "time": "2020-05-13T08:59:21Z",
      "message": {
        "full": "업데이트\\n\\n도서 소개 페이지 업데이트",
        "short": "업데이트"
      },
      "user": {
        "email": "jeipubmanager@gmail.com",
        "name": "Jpub"
      }
    },
    "branch": "master",
    "build": {
      "time": "2020-10-17T14:10:32Z",
      "version": "0.0.16-SNAPSHOT",
      "user": {
        "name": "Incheol Jung",
        "email": "bluesky761@naver.com"
      },
      "host": "MacBook-Pro-5.local"
    },
    "dirty": "true",
    "tags": "",
    "closest": {
      "tag": {
        "commit": {
          "count": ""
        },
        "name": ""
      }
    },
    "remote": {
      "origin": {
        "url": "<https://github.com/Incheol-Jung/SpringInAction5.git>"
      }
    }
  },
  "taco-stats": {
    "count": 0
  }
}
```

### 커스텀 메트릭 등록하기

/metrics 엔드포인트로부터 제공되는 다양한 메트릭 중에서 HTTP 요청에 적용되는 메트릭을 확인하는 방법을 알아보았다. 그러나 /metrics 엔드포인트는 내장된 메트릭에만 국한되지 않는다.

커스텀 메트릭을 발행하는 예로 서로 다른 식자재\(양상추, 갈아 놓은 쇠고기, 밀가루 토르티아 등\)를 사용해서 생성된 타코의 개수를 세는 카운터를 유지하고 싶다고 하자.

```java
@Component
public class TacoMetrics extends AbstractRepositoryEventListener<Taco> {

  private MeterRegistry meterRegistry;

  public TacoMetrics(MeterRegistry meterRegistry) {
    this.meterRegistry = meterRegistry;
  }

  @Override
  protected void onAfterCreate(Taco taco) {
    List<Ingredient> ingredients = taco.getIngredients();
    for (Ingredient ingredient : ingredients) {
      meterRegistry.counter("tacocloud", 
          "ingredient", ingredient.getId()).increment();
    }
  }

}
```

MeterRegistry가 TacoMetrics의 생성자를 통해 주입된다. 또한, TacoMetrics는 리퍼지터리 이벤트를 가로챌 수 있는 스프링 데이터 클래스인 AbstractRepositoryEventListener의 서브 클래스이며, 새로운 Taco 객체가 저장될 때마다 호출되도록 onAfterCreate\(\) 메서드를 오버라이딩한다.

```text

```

### 커스텀 엔드포인트 생성하기

액추에이터의 엔드포인트는 스프링 컨트롤러로 구현된 것에 불과하다고 생각할 수 있다. 엔드포인트는 HTTP 요청을 처리하는 것은 물론이고 JMX MBeans로도 노출되어 사용될 수 있다. 따라서 엔드포인트는 컨트롤러 클래스 이상의 것임이 분명하다.

액추에이터 엔드포인트 오퍼레이션은 @ReadOperation, @WriteOperation, @DeleteOperation 애노테이션이 지정된 메서드로 정의된다.

```java
@Component
@Endpoint(id="notes", enableByDefault=true)
public class NotesEndpoint {

  private List<Note> notes = new ArrayList<>();
  
  @ReadOperation
  public List<Note> notes() {
    return notes;
  }
  
  @WriteOperation
  public List<Note> addNote(String text) {
    notes.add(new Note(text));
    return notes;
  }
  
  @DeleteOperation
  public List<Note> deleteNote(int index) {
    if (index < notes.size()) {
      notes.remove(index);
    }
    return notes;
  }
  
  @RequiredArgsConstructor
  private class Note {
    @Getter
    private Date time = new Date();

    @Getter
    private final String text;
  }
}
```

* notes\(\) 메서드에는 @ReadOperation이 지정되었다. 따라서 이 메서드가 호출되면 사용 가능한 메모 List가 반환된다.
* addNote\(\) 메서드에는 @WriteOperation이 지정되었다. 따라서 이 메서드가 호출되면 인자로 전달된 텍스트로 새로운 메모를 생성하고 List에 추가한다.
* deleteNote\(\) 메서드에는 @DeleteOperation이 지정되었다. 따라서 이 메서드가 호출되면 인자로 전달된 인덱스의 메모를 삭제한다.

```text
$curl localhost:8080/actuator/notes \\
				-d'{"text":"Bring home milk"}' \\
				-H"Content-type: application/json"
[{"time":"2020-10-17T15:16:23.195+0000","text":"Bring home milk"}]%

$curl localhost:8080/actuator/notes \\
				-d'{"text":"Take fry cleaning"}' \\
				-H"Content-type: application/json"
[{"time":"2020-10-17T15:16:23.195+0000","text":"Bring home milk"},{"time":"2020-10-17T15:18:22.945+0000","text":"Take fry cleaning"}]%

$curl localhost:8080/actuator/notes
[{"time":"2020-10-17T15:16:23.195+0000","text":"Bring home milk"},{"time":"2020-10-17T15:18:22.945+0000","text":"Take fry cleaning"}]%

$curl localhost:8080/actuator/notes -X DELETE
{"timestamp":"2020-10-17T15:19:16.588+0000","status":400,"error":"Bad Request","message":"Missing parameters: index","path":"/actuator/notes"}%
```

## 액추에이터 보안 처리하기

액추에이터 자체의 보안이 중요하지만, 보안은 액추에이터의 책임 범위를 벗어난다. 대신에 스프링 시큐리티를 사용해서 액추에이터의 보안을 처리해야 한다. 그리고 액추에이터 앤드 포인트는 단지 애플리케이션의 경로이므로 액추에이터 보안이라고 해서 특별한 것은 없다.

```java
@Configuration
@EnableWebSecurity
public class ActuatorSecurityConfig extends WebSecurityConfigurerAdapter {

  @Override
  protected void configure(HttpSecurity http) throws Exception {
    // @formatter:off
    http
      .requestMatcher(EndpointRequest.toAnyEndpoint().excluding("health", "info"))
      .authorizeRequests()
        .anyRequest().hasRole("ADMIN")
        
      .and()
    
      .httpBasic();
    // @formatter:on
  }
  
  @Override
  protected void configure(AuthenticationManagerBuilder auth) throws Exception {
    auth
      .inMemoryAuthentication()
        .withUser("admin")
        .password("password")
        .authorities("ROLE_ADMIN");
  }
  
  @Bean
  public PasswordEncoder passwordEncoder() {
    return NoOpPasswordEncoder.getInstance();
  }
  
}
```

## 요약

* 스프링 부트 액추에이터는 HTTP와 JMX MBeans 모두의 엔드포인트를 제공한다. 엔드포인트는 스프링 부트 애플리케이션의 내부 활동을 볼 수 있게 한다.
* 대부분의 액추에이터 엔드포인트는 기본적으로 비활성화된다. 그러나 management.endpoints.web.exposure.include 속성과 management.endpoints.web.exposure.exclude 속성을 설정하여 선택적으로 노출시킬 수 있다.
* /loggers와 /env 같은 엔드포인트는 실행 중인 애플리케이션의 구성을 실시간으로 변경하는 쓰기 오퍼레이션을 허용한다.
* 애플리케이션의 빌드와 Git 커밋에 관한 상세 정보는 /info 엔드포인트에서 노출될 수 있다.
* 애플리케이션의 건강 상태는 외부에 통합된 애플리케이션의 건강 상태를 추적하는 커스텀 건강 지표에 의해 영향받을 수 있다.
* 커스텀 애플리케이션 메트릭은 Micrometer를 통해 등록할 수 있다. Micrometer는 벤더 중립적인 메트릭이며, 애플리케이션이 원하는 어떤 메트릭도 발행하여 서드파티 모니터링 시스템\(예를 들어, Prometheus, Datadog, New Relic 등\)에서 보일 수 있게 한다.
* 스프링 웹 애플리케이션의 다른 엔드포인트와 마찬가지로 액추에이터 엔드포인트는 스프링 시큐리티를 사용해서 보안을 처리할 수 있다.

