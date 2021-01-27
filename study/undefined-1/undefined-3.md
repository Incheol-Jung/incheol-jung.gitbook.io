# 액추에이터로 내부 들여다보기

## 앤드포인트

스프링 부트 액추에이터의 핵심 기능은 실행중인 애플리케이션 내부를 볼 수 있게 하는 여러 웹 엔드포인트를 애플리케이션에서 제공하는 것이다. 액추에이터를 이용하면 스프링 애플리케이션 컨텍스트의 빈들을 어떻게 연결했고, 애플리케이션에서 어떤 환경 프로퍼티를 사용할 수 있는지 확인할 수 있으며, 런타임 메트릭의 스냅샷도 확보할 수 있다.

| HTTP | 메서드 | 경로 설명 |
| :--- | :--- | :--- |
| GET | /autoconfig | 어떤 자동 구성 조건이 통과하고 실패하는지 나타내는 자동 구성 보고서를 제공한다. |
| GET | /configprops | 기본값을 비롯하여 구성 ㅍ로퍼티에 빈이 어떻게 주입되었는지 보여준다. |
| GET | /beans | 애플리케이션 커넧ㅌ트에 있는 모든 빈과 빈 사이의 관계를 보여 준다. |
| GET | /dump | 스레드 활동의 스냅샷 덤프를 조회한다. |
| GET | /env | 모든 환경 프로퍼티를 조회한다. |
| GET | /env/{name} | 환경 변수 이름으로 특정 환경 값을 조회한다. |
| GET | /health | HeadlthIndiator 구현체가 제공하는 애플리케이션 헬스 메트릭을 보여 준다. |
| GET | /info | Info로 시작하는 프로퍼티로 사용자 정의된 애플리케이션 정보를 조회한다. |
| GET | /mappings | 모든 URI 경로와 해당 경로를 포함한 컨트롤러에 어떻게 매핑했는지 보여 준다. \(액추에이터 엔드포인트 포함\) |
| GET | /metrics | 메모리 사용량과 HTTP 요청 카운터 등 여러 애플리케이션 메트릭을 보고한다. |
| GET | /metrics/{name} | 메트릭 이름으로 개별 애플리케이션 메트릭을 보고한다. |
| POST | /shutdown | 애플리케이션을 종료한다. 종료 기능을 사용하려면 endpoints/shutdown.enabled 프로퍼티를 true로 설정해야 한다. |
| GET | /trace | HTTP 요청의 timestamp, headers 등 기본 트레이스 정보를 제공한다. |

### 액추에이터 추가\(메이븐\)

스프링 부트 자동 구성은 스프링 구성이 더 적은데도 이 문제를 더욱 악화시킨다. 적어도 명시적 구성으로는 XML 파일이나 구성 클래스를 들여다보고, 스프링 애플리케이션 컨텍스트에 있는 빈 사이의 관계를 파악할 수 있었다. 애플리케이션의 스프링 컨텍스트를 살펴볼 수 있는 가장 핵심적인 엔드포인트는 /beans이다.

![](../../.gitbook/assets/333%20%284%29.png)

/metrics 엔드포인트는 실행 중인 애플리케이션에 다양한 카운터의 스냅샷과 게이지를 제공한다. 단일 메트릭만을 보고 싶다면 “/metrics/{name}” 으로 요청하게 되면 단일 속성 값만 확인할 수 있다.

| 카테고리 | 접두어 | 설명 |
| :--- | :--- | :--- |
| 가비지 컬렉터 | Gc.\* | 가비지 컬렉션의 발생 획수, mark-sweep과 scavenge 가비지 컬렉터의 가비지 컬렉션 수행 시간을 보여 준다. |
| 메모리 | Mem.\* | 애플리케이션에 할당된 메모리 용량과 여유 메모리 용량을 보여준다. |
| 힙 | Heap.\* | 현재 메모리 사용량을 보여준다. |
| 클래스 로더 | Classes.\* | JVM 클래스 로더로 로드, 언로드된 클래스 개수를 보여준다. |
| 시스템 | Processors | 프로세스 개수 같은 시스템 정보와 가동 시간, 평균 시스템 로그를 보여준다. |
| 스레드 풀 | Threads.\* | 스레드, 데몬 스레드 개수와 JVM이 시작된 이후 최대 스레드 개수를 보여준다. |
| 데이터 소스 | Datasource.\* | 데이터 소스 커넥션 개수를 보여준다.\(스프링 애플리케이션 컨텍스트에 DataSource 빈이 하나 이상 있을 때만 데이터 소스 메타데이터에서 얻어 온 정보를 보여 준다. \) |
| 톰캣 세션 | Httpsessions.\* | 톰캣의 활성화된 세션과 최대 세션 개수를 보여 준다.\(애플리케이션이 내장 톰캣 서버로 서비스할 때 내장 톰캣 빈에서 얻어 온 정보를 보여 준다. \) |

\| HTTP \| Counter.status. _guage.response._ \| 애플리케이션이 서비스한 HTTP 요청에서 다양한 게이지와 카운터를 보여 준다. \|

애플리케이션을 실행하여 현재 구동 중인지 알고 싶을 때는 /health 엔드포인트를 요청하여 간편하게 확인할 수 있다. /health 앤드포인트가 제공하는 일부 정보는 민감할 수 있으므로 인증되지 않은 요청에는 단순한 상태만 응답으로 보낸다.

/info 엔드포인트는 호출자에게 알리고 싶은 모든 애플리케이션 정보를 보여 준다. appliation.yml 에 info.ccontactEmail 프로퍼티를 다음과 같이 설정한다. /info 엔드포인트에 프로퍼티를 추가하는 것은 애구에이터 작동을 사용자 정의하는 수많은 방법 중 하나에 불과하다.

비록 액추에이터로 실행 중인 스프링 부트 애플리케이션의 내부 작동을 살펴볼 수 있더라도 모든 요건을 완벽히 충족하지는 못할 것이다.

#### 액추에이터는 다양한 방법으로 사용자 화할 수 있다.

* 엔드포인트 이름 변경
* 엔드포인트 활성화/비활성화
* 사용자 메트릭과 게이지 정의
* 트레이스 데이터를 저장할 사용자 정의 리포지토리 생성
* 사용자 정의 헬스 인디케이터 추가

## 사용자 정의 헬스 인디케이터 추가

애플리케이션이 헬스 인디케이터 기능이 없는 시스템과 상호작용해야 한다면 어떻게 해야 할까? 도서 목록 애플리케이션의 도서 목록에 등록된 책은 아마존으로 이동하는 링크를 포함하므로 아마존에 접속이 가능한지 보고하면 흥미로울 것이다. 아마존의 상태를 표시하는 HealthIndicator 구현체를 작성해보자.

```java
@Component
Public class AmazonHealth implements HealthIndicator {
	
	@Override
	public Health health() {
		try {
			RestTemplate rest = new RestTemplate(); // 아마존에 요청 전송
			rest.getForObject(<http://www.amazon.com>, String.class);
			return Health.up().build();
		} catch (Exception e) {
			return Health.down().build(); // 다운 상태 보고
		}
	}

}

// result
{
	“status”: “UP”,
	“amazonHealth” : {
		“status”: “DOWN”
	}, 
	…..
}
```

```java
@Component
Public class AmazonHealth implements HealthIndicator {
	
……
			return Health.down().build();
		} catch (Exception e) {
			return Health.down().withDetail(“reason”, e.getMessage()).build(); // 다운 상태 보고
		}
	}

}

// result
{
	“status”: “UP”,
	“amazonHealth” : {
		“status”: “DOWN”
		“reason” “I/O error on GET request ….. ”
	}, 
	…..
}
```

## 보안

권한이 있는 관리자만 접근할 수 있도록 엑추에이터에 보안을 적용할 수 있다. \(ex. /shutdown\) 시큐리티 스타터를 빌드 의존성에 추가하면 보안 자동 구성이 일어나 액추에이터 엔드포인트를 포함하여 애플리케이션에 보안을 적용한다. .antMatchers\("/shutdown","/metrics"\) 이렇게 할 수 도 있지만 application.yml에서 management.context-path: /mgmt 로 하여 모든 metris 관련된 메소드 권한을 그룹으로 제한할 수 있다.

```java
Manegement.context-path=/mgmt

...

@Configuration
@EnableWebSecurity
Public class SecurityConfig extends WebSecrityConfigurerAdapter {
	@Autowired
	private ReaderRepository readerRepository;

	@Override
	protected void configure(HttpSecurity http) whroes Exception {
		http
			.authorizeRequests()
				.antMatchers(“/”).access(“hasRole(‘READER’)”)
				.antMatchers(“/shutdown”, “/metrics”, “/configprops”).access(“hasRole(‘ADMIN’)”)		// ADMIN 권한 필요
				.antMatchers(“/mgmt./**”).access(“hasRole(‘ADMIN’)”)		// ADMIN 권한 필요
				.antmatchers(“/**”).permitAll()
			.and()
			.formLogin(“Login”)
			.failureUrl(“/login?error=true”); 
	}
}
```

## Shell

### Actuator 원격 Shell 에 접속하기

스프링 부트는 CRaSH\(The Common Reusable SHell\)를 내장하고 있는데 이 셸은 어떤 자바 애플리케이션에서도 내장할 수 있다. 이 기능을 원격 Shell에 접속하여 Actuator와 거의 동일한 기능을 수행할 수 있다.

메이븐에 의존성 추가한다.

```java
<dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-actuator</artifactId>
</dependency>
```

