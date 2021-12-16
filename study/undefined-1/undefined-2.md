# 구성을 사용자화 하기

## 보안 구성 사용자화하기

일반적으로 스프링은 사용자가 원하는 피자토핑 부터 구성하여 주문을 한다고 하면 스프링 부트는 메뉴에 있는 피자 중에서 불고기 피자를 그대로 주문하는 차이가 있다고 보면 이해하기 쉬울 것 이다.

대체로 자동 구성된 빈은 원하는 것을 정확하게 제공하므로 오버라이드할 필요가 없다. 하지만 자동 구성으로 원하는 기능이 잘 작동하지 않을 때도 있다.

### 대표적인 예로 애플리케이션에 보안을 적용할 때 자동 구성은 적합하지 않다.

보안은 한 번에 완성할 수 없으며 애플리케이션 보안에 필요한 많은 결정을 스프링 부트가 다 하지 못하기 때문이다. 설령 스프링 부트가 일부 기본적인 자동 보안 구성을 하더라도 원하는 상세한 보안 요구 사항을 만족하려면 오버라이드할 수 밖에 없을 것이다. 스프링 보안을 구성하는 방법을 약간 바꾸고 싶다. 로그인 페이지를 수정하고 데이터베이스나 LDAP 기반 사용자 저장소를 이용하여 작동하는 인증 서비스를 제공하고 싶다.

### 다음에 살펴 볼 SecurityConfig는 아주 기본적인 스프링 시큐리티 구성이다.

WebSecurityConfigurerAdapter를 확장해서 구성 클래스를 작성하였다. 이렇게 사용자 정의 보안 구성 클래스를 선언하면 스프링부트는 보안 자동 구성을 건너뛴 채 사용자 정의 보안 구성을 사용한다.

```
@Configuration
@EnableWebSecurity
Public class SecurityConfig extends WebSecrityConfigurerAdapter {
	@Autowired
	private ReaderRepository readerRepository;

	@Override
	protected void configure(HttpSecurity http) whroes Exception {
		http
			.authorizeRequests()
				.antMatchers(“/”).access(“hasRole(‘READER’)”) // READER 권한 필요
				.antmatchers(“/**”).permitAll()
			.and()
			.formLogin(“Login”)
			.failureUrl(“/login?error=true”); 
	}

	@Override
	protected void configure(AuthenticationManagerBuilder auth) throws Exception {
		auth.userDetailService(new UserDetailService( ){
			@Override
			public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
				return readerRepository.findOne(username);
			}
		}
	}
}
```

* / 경로에는 READER 롤이 있는 인증된 사용자만 요청할 수 있게 한다.
* 이외의 모든 요청 경로에는 별도의 인증 없이 어떤 사용자든 요청할 수 있게 했다.
* /login 경로를 로그인 페이지와 로그인 실패 페이지(error 속성 포함)로 설정하였다.
* 사용자를 인증하려고 사용자 상세 정보 서비스를 설정한다. 이 서비스는 UserDetailsService를 구현하는 클래스이며, 제공된 사용자 이름으로 사용자의 상세 정보를 조회할 때 사용한다. 앞의 코드는 주입된 ReaderRepository(스프링 데이터 JJPA 리포지토리 인터페이스)의 findOne() 메서드를 호출하는 익명 내부 클래스 구현을 보여 준다.

#### 결론은 스프링 부트 자동 구성을 오버라이드 하려면 명시적인 구성만 작성하면 된다.

스프링 부트에서 명시적인 구성을 발견하면 자동 구성보다는 명시적인 구성을 우선적으로 반영한다. 자동 구성이 요구 사항에 적합하지 않을 때를 대비하여 스프링 부트는 구성을 오버라이드 하거나 상세한 부분을 변경할 방법을 제공한다.

## 프로퍼티를 이용하여 외부적으로 구성하기

스프링 부트 애플리케이션에 프로퍼티를 설정하는 방법은 여러 가지이다.

1. 명령줄 인자.
2. java:comp/env에서 얻을 수 있는 JNDI 속성
3. JVM 시스템 프로퍼티
4. 운영체제의 환경 변수
5. random.\*로 시작하는 프로퍼티 때문에 무작위로 생성된 값(${random.long}처럼 다른 프로퍼티를 설정할 때 참조)
6. 애플리케이션 외부에 있는 application.properties 나 application.yml 파일
7. 애플리케이션 내부에 패키징된 application.properties 나 application.yml 파일
8. @PropertySource로 지정된 프로퍼티 소스
9. 기본 프로퍼티 이 목록은 우선순위 순으로 작성되었다.

### application.properties와 application.yml 파일은 다음 네 곳 어디에나 배치할 수 있다.

1. 외부적으로 애플리케이션이 작동하는 디렉터리의 /config 하위 디렉터리
2. 외부적으로 애플리케이션이 작동하는 디렉터리
3. 내부적으로 config 패키지
4. 내부적으로 클래스패스의 루트

이 목록도 우선순위가 있고 우선순위가 동일한 레벨 안에 properties와 yml중에는 yml 내용이 프로퍼티를 오버라이드 한다.

### 유용한 프로퍼티

* spring.thymeleaf.cache : 개발하는 동안 실시간 반영되도록 캐싱 하지 않음 (프리마커 그루비 벨로시키도 있음 - 모두 기본 설정은 true)
* server.port : 어플리케이션 서버 포트
* https setup : ssl setup
* logging.level.root : 로그 레벨을 설정 \*\* log4j나 log4j2를 사용한다면 해당 구현체에 대응하는 적당한 스타터를 추가하고, 의존성을 변경하여 로그백을 제외시켜야 한다.

## 프로파일 및 에러 페이지

@Profile 애너테이션은 production 프로파일을 런타임에서 활성화했을 때만 해당 구성을 적용함(보안같은 경우 로컬에서는 해당 안될 경우에는 이런 옵션이 필요) 또는 spring.profiles.active : production도 가능 또는 application-{profile}.properties 형태의 추가적인 프로퍼티 파일을 생성하여 프로파일에 특화된 프로퍼티를 제공할 수 있다. yml 경우에는 하이픈 세개(---)를 사용하여 부분을 나눌 수 있다.

```
@Profile(“production”)
@Configuration
@EnableWebSecurity
Public class SecurityConfig extends WebSecrityConfigurerAdapter {
	…
}
```

![](<../../.gitbook/assets/111 (3).png>)

스프링 부트는 자동 구성을 이용하여 '화이트라벨' 오류 페이지를 기본으로 제공한다. 스프링 부트가 자동으로 구성한 기본 오류 핸들러는 'error'뷰를 찾는다. 결국 사용자 정의할 뷰는 다음과 같이 오류 뷰를 해석할 때 사용될 뷰 리졸버에 따라 달라진다.

* 스프링의 View 인터페이스를 구현하여 ID가 'error'인 빈
* Thymeleaf를 사용한다면 Thymeleaf 템플릿 error.html
* FreeMarker를 사용한다면 FreeMarker 템플릿 error.fasterxml
* Velocity를 사용한다면 Velocity 템플릿 error.JVM
* JSP를 사용한다면 JSP 템플릿 error.JSP

![](<../../.gitbook/assets/222 (4).png>)
