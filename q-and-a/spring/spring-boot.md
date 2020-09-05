---
description: Spring 과 비교하여 Spring Boot의 특징을 살펴보자
---

# Spring Boot 특징

![https://www.north-47.com/knowledge-base/testing-spring-boot-application/](../../.gitbook/assets/spring-boot-interview-questions-1.jpg)

## Spring Boot Framework란?

* 스프링부트 애플리케이션은 스프링 프레임워크에서 설정하였던 정보들을 간편하게 설정할 수 있도록 경량화되어 제공한 프레임워크이다.
* 개발자가 개발에 집중할 수 있도록 스프링 프레임워크에서 작성하던 많은 설정\(보일러플레이트\)들을 패키징하여 간편하게 제공할 수 있도록 하였다.

## Spring 과 비교하여 다른 점은?

### @SpringBootApplication

```java
@Target(ElementType.TYPE)
@Retention(RetentionPolicy.RUNTIME)
@Documented
@Inherited
@SpringBootConfiguration
@EnableAutoConfiguration
@ComponentScan(excludeFilters = {
		@Filter(type = FilterType.CUSTOM, classes = TypeExcludeFilter.class),
		@Filter(type = FilterType.CUSTOM, classes = AutoConfigurationExcludeFilter.class) })
public @interface SpringBootApplication { ... }
```

@SpringBootConfiguration, @ComponentScan, @EnableAutoConfiguration 어노테이션을 축약하였다.

* @SpringBootConfiguration : 빈에 대해서 Context에 추가하거나 특정 클래스를 참조해 올 수 있다 .
* @ComponentScan : 패키지 내 application 컴포넌트가 어디에 위치해 있는지 검사한다. \(빈 검색\)
* @EnableAutoConfiguration : Spring Boot의 자동화 기능\(Spring 설정\)을 활성화시켜준다.

### AutoConfiguration

이전엔 JDBCTemplate을 사용하려면 JDBCTemplate을 스프링 빈으로 선언하고 DataSource를 설정했어야 했다.

```java
@Bean 
public JdbcTemplate jdbcTempalte(DateSource ds){ 
   return new JdbcTempalte(ds); 
} 
@Bean 
public DataSource dataSource(){ 
  return new EmbeddedDatabaseBuilder() 
     .setType(EmbeddedDatabaseType.H2) 
     .addScripts('ddl.sql', 'data.sql') 
     .build(); 
}
```

스프링부트는 자동으로 인메모리 데이터베이스와 JDBCTemplate을 구성해준다. 위와 같이 코드를 작성할 필요가 없다. 이것은 하나의 예시일 뿐 스프링 부트의 자동설정은 200개 이상의 설정을 해결하였다.

다음 이미지는 spring boot 공식문서에 제공하는 다양한 자동 설정 클래스 정보를 보여준다.

![https://docs.spring.io/spring-boot/docs/current/reference/html/appendix-auto-configuration-classes.html\#auto-configuration-classes](../../.gitbook/assets/111%20%281%29.png)

### 스프링부트 스타터

스프링 프레임워크에서 사용하였던 다양한 플러그인은 서로 간의 의존성이 충돌되는 이슈가 빈번히 발생하였다. 그렇다 보니 플러그인을 버전 관리하는데 많은 노력이 필요하였다. 스프링 부트 에서는 스타터 플러그인을 사용하여 패키징된 플러그인으로 제공되어 상호간에 의존성 충돌에 대한 노력을 최대한 줄일 수 있게 되었다.

다음은 스프링 부트에서 주로 사용하는 기본적인 스타터이다.

<table>
  <thead>
    <tr>
      <th style="text-align:left"><b>&#xC2A4;&#xD0C0;&#xD130;&#xBA85;</b>
      </th>
      <th style="text-align:left"><b>&#xC124;&#xBA85;</b>
      </th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td style="text-align:left">spring-boot-starter</td>
      <td style="text-align:left">&#xC2A4;&#xD504;&#xB9C1; &#xBD80;&#xD2B8;&#xC758; &#xCF54;&#xC5B4; (auto-configuration,
        logging, yaml &#xB4F1;&#xC744; &#xC81C;&#xACF5;)</td>
    </tr>
    <tr>
      <td style="text-align:left">spring-boot-starter-aop</td>
      <td style="text-align:left">AOP(Aspect Oriented Programming)&#xB97C; &#xC704;&#xD55C; &#xC2A4;&#xD0C0;&#xD130;</td>
    </tr>
    <tr>
      <td style="text-align:left">spring-boot-starter-batch</td>
      <td style="text-align:left">Spring Batch&#xB97C; &#xC0AC;&#xC6A9;&#xC5D0; &#xD544;&#xC694;&#xD55C;
        &#xC2A4;&#xD0C0;&#xD130;</td>
    </tr>
    <tr>
      <td style="text-align:left">spring-boot-starter-data-jpa</td>
      <td style="text-align:left">Spring Data JPA&#xC640; Hibernate&#xB97C; &#xC0AC;&#xC6A9;&#xC5D0; &#xD544;&#xC694;&#xD55C;
        &#xC2A4;&#xD0C0;&#xD130;</td>
    </tr>
    <tr>
      <td style="text-align:left">spring-boot-starter-data-redis</td>
      <td style="text-align:left">
        <p>Redis&#xC640; Jedis &#xC0AC;&#xC6A9;&#xC5D0; &#xD544;&#xC694;&#xD55C;
          &#xC2A4;&#xD0C0;&#xD130;</p>
        <p>Redis: &#xBA54;&#xBAA8;&#xB9AC; &#xC800;&#xC7A5; &#xBC29;&#xC2DD;&#xC758;
          &#xC800;&#xC7A5;&#xC18C;</p>
        <p>Jedis: &#xC790;&#xBC14;&#xC5D0;&#xC11C; &#xB808;&#xB514;&#xC2A4;&#xB97C;
          &#xC0AC;&#xC6A9;&#xD560; &#xC218; &#xC788;&#xAC8C; &#xB3C4;&#xC640;&#xC8FC;&#xB294;
          &#xD234;</p>
      </td>
    </tr>
    <tr>
      <td style="text-align:left">spring-boot-starter-data-rest</td>
      <td style="text-align:left">Spring Data Repositories(&#xC2A4;&#xD504;&#xB9C1; &#xB370;&#xC774;&#xD130;
        &#xC800;&#xC7A5;&#xC18C;) &#xBC29;&#xC2DD;&#xC5D0; &#xB9DE;&#xCDB0; REST
        API &#xC0AC;&#xC6A9;&#xC5D0; &#xD544;&#xC694;&#xD55C; &#xC2A4;&#xD0C0;&#xD130;</td>
    </tr>
    <tr>
      <td style="text-align:left">spring-boot-starter-thymeleaf</td>
      <td style="text-align:left">Thymeleaf &#xD15C;&#xD50C;&#xB9BF; &#xC5D4;&#xC9C4; &#xC0AC;&#xC6A9;&#xC5D0;
        &#xD544;&#xC694;&#xD55C; &#xC2A4;&#xD0C0;&#xD130;</td>
    </tr>
    <tr>
      <td style="text-align:left">spring-boot-starter-jdbc</td>
      <td style="text-align:left">JDBC Connection Pool &#xC0AC;&#xC6A9;&#xC5D0; &#xD544;&#xC694;&#xD55C;
        &#xC2A4;&#xD0C0;&#xD130;</td>
    </tr>
    <tr>
      <td style="text-align:left">spring-boot-starter-security</td>
      <td style="text-align:left">Spring Security &#xC0AC;&#xC6A9;&#xC5D0; &#xD544;&#xC694;&#xD55C; &#xC2A4;&#xD0C0;&#xD130;</td>
    </tr>
    <tr>
      <td style="text-align:left">spring-boot-starter-oauth2</td>
      <td style="text-align:left">OAuth2 &#xC778;&#xC99D; &#xC0AC;&#xC6A9;&#xC5D0; &#xD544;&#xC694;&#xD55C;
        &#xC2A4;&#xD0C0;&#xD130;</td>
    </tr>
    <tr>
      <td style="text-align:left">spring-boot-starter-validation</td>
      <td style="text-align:left">Java Bean Validation &#xC0AC;&#xC6A9;&#xC5D0; &#xD544;&#xC694;&#xD55C;
        &#xC2A4;&#xD0C0;&#xD130;</td>
    </tr>
    <tr>
      <td style="text-align:left">spring-boot-starter-web</td>
      <td style="text-align:left">&#xC6F9; &#xAC1C;&#xBC1C;&#xC744; &#xC704;&#xD574; &#xD544;&#xC694;&#xD55C;
        &#xC2A4;&#xD0C0;&#xD130; (Spring MVC, REST, Embedded Tomcat, &#xAE30;&#xD0C0;
        &#xB77C;&#xC774;&#xBE0C;&#xB7EC;&#xB9AC; &#xB4F1;)</td>
    </tr>
  </tbody>
</table>

다음은 스프링 부트 스타터 관련 정보를 확인할 수 있는 Document이다.

![https://docs.spring.io/spring-boot/docs/current/reference/htmlsingle/\#using-boot-starter](../../.gitbook/assets/222.png)

### 내장형 톰캣

스프링 프레임워크에서는 별도로 was를 실행하여 애플리케이션의 빌드된 파일 경로를 지정해주어 실행하였다. 스프링 부트에서는 was가 내장되어 애플리케이션 실행시 자동으로 was가 실행될 수 있었다.

### Actuator

자동 설정의 모든 장점들로 인해 응용프로그램 내부에 무엇이 있는지 알지 못할 위험이 있으며 해당 위험은 Spring Actuator에 의해 해결할 수 있다.

이는 프로덕션 환경에서 어플리케이션을 실행하는데 많은 통찰력과 메리트를 제공한다.

설정도 플러그인 추가와 property 설정만 추가하면 바로 사용할 수 있다.

```java
dependencies {
    compile("org.springframework.boot:spring-boot-starter-actuator")
}
```

```java
management:
  endpoints:
    web:
      exposure:
        include: "*"
```

## 참고

* [https://sas-study.tistory.com/299](https://sas-study.tistory.com/299)
* [https://freestrokes.tistory.com/102](https://freestrokes.tistory.com/102)
* [https://m.blog.naver.com/PostView.nhn?blogId=ish430&logNo=221340243322&proxyReferer=https:%2F%2Fwww.google.com%2F](https://m.blog.naver.com/PostView.nhn?blogId=ish430&logNo=221340243322&proxyReferer=https:%2F%2Fwww.google.com%2F)
* [https://sabarada.tistory.com/23](https://sabarada.tistory.com/23)

