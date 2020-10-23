# Chap 4. 스프링 시큐리티

## 스프링 시큐리티 구성하기

### 의존성 추가하기

스프링 애플리케이션의 보안에서 가장 먼저 할 일은 스프링 부트 보안 스타터 의존성을 빌드 명세에 추가하는 것이다.

```text
<dependency>
		<groupId>org.springframework.boot</groupId>
		<artifactId>spring-boot-starter-security</artifactId>
	</dependency>
```

### 스프링 시큐리티 기본 구성 클래스

SecurityConfig 클래스를 생성해보자

```java
@Configuration
@EnableWebSecurity
public class SecurityConfig extends WebSecurityConfigurerAdapter {
   
  @Autowired
  private UserDetailsService userDetailsService;
  
 
  @Override
  protected void configure(HttpSecurity http) throws Exception {
    http
      .authorizeRequests()
        .antMatchers("/design", "/orders")
          .access("hasRole('ROLE_USER')")
        .antMatchers("/", "/**").access("permitAll")
      .and()
        .formLogin()
          .loginPage("/login")
      .and()
        .logout()
          .logoutSuccessUrl("/")
      .and()
        .csrf()
          .ignoringAntMatchers("/h2-console/**")
      .and()  
        .headers()
          .frameOptions()
            .sameOrigin();
  }

	@Override
  protected void configure(AuthenticationManagerBuilder auth)
      throws Exception {

    auth
      .userDetailsService(userDetailsService)
      .passwordEncoder(encoder());
    
  }
}
```

사용자의 HTTP 요청 경로에 대해 접근 제한과 같은 보안 관련 처리를 우리가 원하는 대로 할 수 있게 되었다.

스프링 시큐리티에서는 여러 가지의 사용자 스토어 구성 방법을 제공한다.

* 인메모리 사용자 스토어
* JDBC 기반 사용자 스토어
* LDAP 기반 사용자 스토어
* 커스텀 사용자 명세 서비스

configure\(HttpSecurity\) 메소드는 HTTP 보안을 구성하는 메서드다. configure\(AuthenticationManagerBuilder\)는 사용자 인증 정보를 구성하는 메서드이며 위의 사용자 스토어 중 어떤 것을 선택하든 이 메서드에서 구성한다.

### 인메모리 사용자 스토어

만일 변경이 필요 없는 사용자만 미리 정해 놓고 애플리케이션을 사용한다면 아예 보안 구성 코드 내브ㅜ에 정의할 수 있을것이다.

```java
@Override
protected void configure(AuthenticationManagerBuilder auth)
    throws Exception {

  auth.inmemoryAuthentication()
		.withUser("user1")
		.password("{noop}password1")
		.authorities("ROLE_USER")
		.and()
		.withUser("user2")
		.password("{noop}password2")
		.authorities("ROLE_USER");
  
}
```

스프링 5부터는 반드시 비밀번호를 암호화해야 하므로 만일 password\(\) 메서드를 호출하여 암호화하지 않으면 접근 거부\(HTTP 403\) 또는 Internal Server Error\(HTTP 500\)가 발생된다.

### JDBC 기반의 사용자 스토어

사용자 정보는 관계형 데이터베이스로 유지,관리되는 경우가 많으므로 JDBC 기반의 사용자 스토어가 적합해 보인다.

```java
@Override
protected void configure(AuthenticationManagerBuilder auth)
    throws Exception {
  
  auth
    .jdbcAuthentication()
      .dataSource(dataSource)
      .usersByUsernameQuery(
          "select username, password, enabled from Users " +
          "where username=?")
      .authoritiesByUsernameQuery(
          "select username, authority from UserAuthorities " +
          "where username=?")
      .passwordEncoder(new StandardPasswordEncoder("53cr3t");
  
}
```

usersByUsernameQuery\(\)와 authoriesByUsernameQuery\(\) 메서드를 사용하여 사용자 정보와 권한 쿼리를 대체하였다. passwordEncoder\(\) 메서드는 스프링 시큐리티의 PasswordEncoder 인터페이스를 구현하는 어떤 객체도 인자로 받을 수 있다. 암호화 알고리즘을 구현한 스프링 시큐리티의 모듈에는 다음과 같은 구현 클래스가 포함되어 있다.

* BCryptPasswordEncoder : bcrypt를 해싱 암호화한다.
* NoOpPasswordEncoder : 암호화하지 않는다.
* Pbkd2PasswordEncoder : PBKDF2를 암호화한다.
* SCryptPasswordEncoder : scrypt를 해싱 암호화한다.
* StandardPasswordEncoder : SHA-256을 해싱 암호화한다.

만약에 암호화 알고리즘을 커스터마이징 하고 싶다면 PasswordEncoder 인터페이스를 직접 구현 하면 된다.

```java
public final class NoOpPasswordEncoder implements PasswordEncoder {
    private static final PasswordEncoder INSTANCE = new NoOpPasswordEncoder();

    public String encode(CharSequence rawPassword) {
        return rawPassword.toString();
    }

    public boolean matches(CharSequence rawPassword, String encodedPassword) {
        return rawPassword.toString().equals(encodedPassword);
    }

    public static PasswordEncoder getInstance() {
        return INSTANCE;
    }

    private NoOpPasswordEncoder() {
    }
}
```

### LDAP 기반 사용자 스토어

userSearchFilter\(\)와 groupSearchFilter\(\) 메서드는 LDAP 기본 쿼리의 필터를 제공하기 위해 사용되며, 여기서는 사용자와 그룹을 검색하기 위해 사용하였다.

```java
@Override
protected void configure(AuthenticationManagerBuilder auth)
    throws Exception {
	auth.ldapAuthentication()
		.userSearchBase("ou=people")
		.userSearchFilter("(uid={0})")
		.groupSearchBase("ou=groups")
		.groupSearchFilter("(member={0})")
		.contextSource()
		.root("dc=tacocloud,dc=com")
		.ldif("classpath:users.ldif")
		.and()
		.passwordCompare()
		.passwordEncoder(new BCryptPasswordEncoder())
		.passwordAttribute("userPasscode");
}
```

#### 비밀번호 비교 구성하기

LDAP의 기본 인증 전략은 사용자가 직접 LDAP 서버에서 인증받도록 하는 것이다. 그러나 비밀번호를 비교하는 방법도 있다. 이 방법에서는 입력된 비밀번호를 LDAP 디렉터리에 전송한 후, 이 비밀번호를 사용자의 비밀번호 속성 값과 비교하도록 LDAP 서버에 요청한다.

여기서는 전달된 비밀번호롸 userPasscode 속성 값이 비교되어야 한다는 것을 지정하였으며 비밀번호를 암호화하는 인코더도 지정하였다.

이처럼 서버 측에서 비밀번호가 비교될 때는 실제 비밀번호가 서버에 유지된다는 것이 장점이다. 그러나 비교되는 비밀번호는 여전히 LDAP 서버에 전달되어야하므로 해커가 가로챌 수 있다. 따라서 이것을 방지하기 위해 passwordEncoder\(\) 메서드를 호출하여 암호화에 사용할 인코더를 지정할 수 있다.

### LDAP 기반 사용자 스토어

LDAP 기반 인증으로 스프링 시큐리티를 고성하기 위해서 ldapAuthentication\(\) 메서드를 사용할 수 있다.

```java
@Override
protected void configure(AuthenticationManagerBuilder auth) throws Exception {
		auth.ldapAuthentication()
		.userSearchBase("ou=people")
		.userSearchFilter("(uid={0})")
		.groupSearchBase("ou=groups")
		.groupSearchFilter("(member={0})")
		.contextSource()
		.root("dc=tacocloud,dc=com")
		.ldif("classpath:users.ldif")
		.and()
		.passwordCompare()
		.passwordEncoder(new BCryptPasswordEncoder())
		.passwordAttribute("userPasscode");
}
```

### 사용자 인증의 커스터마이징

사용자 정보를 저장하는 도메인 객체와 리퍼지터리 인터페이스를 생성하자. 애플리케이션을 사용해서 타코 클라우드 고객이 등록할 때는 사용자 이름과 비밀번호 외에 전체 이름, 주소, 전화번호도 제공해야 한다.

```java
@Entity
@Data
@NoArgsConstructor(access=AccessLevel.PRIVATE, force=true)
@RequiredArgsConstructor
public class User implements UserDetails {
	private static final long serialVersionUID = 1L;

	  @Id
	  @GeneratedValue(strategy=GenerationType.AUTO)
	  private Long id;

	  private final String username;
	  private final String password;
	  private final String fullname;
	  private final String street;
	  private final String city;
	  private final String state;
	  private final String zip;
	  private final String phoneNumber;

		...
}
```

UserDetails를 구현한 User 클래스는 기본 사용자 정보를 프레임워크에 제공한다. 예를 들어, 해당 사용자에게 부여된 권한과 해당 사용자 계정을 사용할 수 있는 지의 여부 등이다.

```java
public interface UserDetailsService {
		UserDetails loadUserByname(String username) throws UsernameNotFoundException;
}

@Service
public class UserRepositoryUserDetailsService implements UserDetailsService {
	
	private UserRepository userRepo;

	  @Autowired
	  public UserRepositoryUserDetailsService(UserRepository userRepo) {
	    this.userRepo = userRepo;
	  }

	  @Override
	  public UserDetails loadUserByUsername(String username)
	      throws UsernameNotFoundException {
	    User user = userRepo.findByUsername(username);
	    if (user != null) {
	      return user;
	    }
	    throw new UsernameNotFoundException(
	                    "User '" + username + "' not found");
	  }

}
```

## 웹 요청 보안 처리하기

앞에서 보았던 것처럼 SecurityConfig 클래스에 다음의 configure\(HttpSecurity\) 메서드를 오버라이딩해야 한다.

```java
@Override
protected void configure(HttpSecurity http) throws Exception { ... }
```

이 configure\(\) aptjemsms HttpSecurity 객체를 인자로 받는다. 이 객체는 웹 수준에서 보안을 처리하는 방법을 구성하는 데 사용된다.

* HTTP 요청 처리를 허용하기 전에 충족되어야 할 특정 보안 조건을 구성한다.
* 커스텀 로그인 페이지를 구성한다.
* 사용자가 애플리케이션의 로그아웃을 할 수 있도록 한다.
* CSRF 공격으로부터 보호하도록 구성한다.

### 웹 요청 보안 처리하기

```java
@Override
protected void configure(HttpSecurity http) throws Exception {
    http
    .authorizeRequests()
    .antMatchers("/design", "/orders")
      .access("hasRole('ROLE_USER')")
    .antMatchers("/", "/**").access("permitAll")
    .and()
      .formLogin()
        .loginPage("/login");

}
```

authorizeRequests\(\)는 ExpressionInterceptUrlRegistry 객체를 반환한다. 이 객체를 사용하면 URL 경로와 패턴 및 해당 경로의 보안 요구사항을 구성할 수 있다. 여기서는 두 가지 보안 규칙을 지정하였다.

* /design과 /orders의 요청은 ROLE\_USER의 권한을 갖는 사용자에게만 허용된다.
* 이외의 모든 요청은 모든 사용자에게 허용된다.

hasRole\(\)과 permitAll\(\)은 요청 경로의 보안 요구를 선언하는 메서드다. 이때 사용 가능한 메서드는 다음과 같다.

**요청 경로가 보안 처리되는 방법을 정의하는 구성 메서드** 

| 메서드 | 하는일 |
| :--- | :--- |
| access\(String\) | 인자로 전달된 SpEL\(Spring Expression Language. 표현식이 true면 접근을 허용한다. |
| anonymous\(\) | _익명의 사용자에게 접근을 허용한다._ |
| authenticated\(\) | 익명이 아닌 사용자로 인증된 경우 접근을 허용한다. |
| denyAll\(\) | 무조건 접근을 거부한다. |
| fullyAuthenticated\(\) | 익명이 아니거나 또는 remember-me\(바로 아래 참조\)가 아닌 사용자로 인증되면 접근을 허용한다. |
| hasAnyAuthority\(String...\) | 지정된 권한 중 어떤 것이라도 사용자가 갖고 있으면 접근을 허용한다. |
| hasAnyRole\(String...\) | 지정된 역할 중 어느 하나라도 사용자가 갖고 있으면 접근을 허용한다. |
| hasAuthority\(String\) | 지정된 권한을 사용자가 갖고 있으면 접근을 허용한다. |
| hasIpAddress\(String\) | 지정된 IP주소로부터 요청이 오면 접근을 허용한다. |
| hasRole\(String\) | 지정된 역할을 사용자가 갖고 있으면 접근을 허용한다. |
| not\(\) | 다른 접근 메서드들의 효력을 무효화한다. |
| permitAll\(\) | 무조건 접근을 허용한다. |
| rememberMe\(\) | remember-me\(이전 로그인 정보나 쿠키나 데이터베이스로 저장한 후 일정 기간 내에 다시 접근 시 저장된 정보로 자동 로그인됨\)를 통해 인증된 사용자의 접근을 허용한다. |

대부분의 메서드는 요청 처리의 기본적인 보안 규칙을 제공한다. 그러나 각 메서드에 정의된 보안 규칙만 사용된다는 제약이 있다. 따라서 이의 대안으로 access\(\) 메서드를 사용하면 더 풍부한 보안 규칙을 선언하기 위해 SpEl을 사용할 수 있다.

**스프링 시큐리티에서 확장된 SpEL**

| 메서드 | 하는일 |
| :--- | :--- |
| authentication | 해당 사용자의 인증 객체 |
| denyAll | 항상 false를 산출한다. |
| hasAnyRole\(역할 내역\) | 지정된 역할 중 어느 하나라도 해당 사용자가 갖고 있으면 true |
| hasRole\(역할\) | 지정된 역할을 해당 사용자가 갖고 있으면 true |
| hasIpAddress\(IP 주소\) | 지정된 IP주소로부터 해당 요청이 온 것이면 true |
| isAnonymous\(\) | 해당 사용자가 익명 사용자이면 true |
| isAuthenticated\(\) | 해당 사용자가 익명이 아닌 사용자로 인증되었으면 true |
| isFullyAuthenticated\(\) | 해당 사용자가 익명이 아니거나 또는 remember-me가 아닌 사용자로 인증되었으면 true |
| isRememberMe\(\) | 해당 사용자가 remember-me 기능으로 인증되었으면 true |
| permitAll | 항상 true를 산출한다. |
| principal | 해당 사용자의 principal 객체 |

### CSRF 공격 방어하기

CSRF는 많이 알려진 보안 공격이다. 즉, 사용자가 웹사이트에 로그인한 상태에서 악의적인 코드가 삽입된 페이지를 열면 공격 대상이 되는 웹사이트에 자동으로 폼이 제출되고 이 사이트는 위조된 공격 명령이 믿을 수 있는 사용자로부터 제출된 것으로 판단하게 되어 공격에 노출된다.

```java
@Override
    protected void configure(HttpSecurity http) throws Exception {
        http
        .authorizeRequests()
        .antMatchers("/design", "/orders")
          .access("hasRole('ROLE_USER')")
        .antMatchers("/", "/**").access("permitAll")
        .and()
          .formLogin()
  	        .loginPage("/login")
        .and()
        .logout()
          .logoutSuccessUrl("/")
        .and()
          .csrf();

    }
```

## 요약

* 스프링 시큐리티의 자동-구성은 보안을 시작하는 데 좋은 방법이다. 그러나 대부분의 애플리케이션에서는 나름의 보안 요구사항을 충족하기 위해 별도의 보안 구성이 필요하다.
* 사용자 정보는 여러 종류의 사용자 스토어에 저장되고 관리될 수 있다. 예를 들어, 관계형 데이터베이스, LDAP 등이다.
* 스프링 시큐리티는 자동으로 CSRF 공격을 방어한다.
* 인증된 사용자에 관한 정보는 SecurityContext 객체를 통해서 얻거나, @AuthenticationPrincipal을 사용해서 컨트롤러에 주입하면 된다.

