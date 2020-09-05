---
description: Stereo Type에 대해서 알아보자
---

# Stereo Type\(스테레오 타입\)

![Spring&#xC758; &#xB300;&#xD45C;&#xC801;&#xC778; Stereo type](../../.gitbook/assets/1%20%287%29.png)

## StereoType이란?

스프링 컨테이너가 스프링 관리 컴포넌트로 식별하게 해주는 단순한 마커다. 즉, scan-auto-detection과 dependency injection을 사용하기 위해서 사용되는 가장 기본 어노테이션이다.

Stereo Type이 범용적으로 많이 사용하게 된 시키는 Spring 2.5 부터 였다. 그 이전까지는 xml 파일에 bean을 등록하여 관리 하였다. 그러나 모든 bean들을 xml 파일로 관리 하다보니 다른 보일러플레이트 코드와 함께 xml 파일만 비대해지게 될 뿐이었다. 그래서 Spring 2.0 에서는 @Repository이 등장하였고 Spring 2.5 부터는 @Component, @Controller, @Service, @Configuration 등이 등장하면서 Stereo type에 대한 정의가 범용적으로 사용하게 되었다.

## @Component

빈으로 간주되어 DI 컨테이너에서 사용할 수 있게 하는 기본 어노테이션이다.

```java
/**
 * Indicates that an annotated class is a "component".
 * Such classes are considered as candidates for auto-detection
 * when using annotation-based configuration and classpath scanning.
 *
 * <p>Other class-level annotations may be considered as identifying
 * a component as well, typically a special kind of component:
 * e.g. the {@link Repository @Repository} annotation or AspectJ's
 * {@link org.aspectj.lang.annotation.Aspect @Aspect} annotation.
 *
 * @author Mark Fisher
 * @since 2.5
 * @see Repository
 * @see Service
 * @see Controller
 * @see org.springframework.context.annotation.ClassPathBeanDefinitionScanner
 */
@Target(ElementType.TYPE)
@Retention(RetentionPolicy.RUNTIME)
@Documented
@Indexed
public @interface Component {

	/**
	 * The value may indicate a suggestion for a logical component name,
	 * to be turned into a Spring bean in case of an autodetected component.
	 * @return the suggested component name, if any (or empty String otherwise)
	 */
	String value() default "";

}
```

### @Bean과 @Component는 어떤 차이가 있는가?

* @Component는 클래스 상단에 적으며 그 default로 클래스 이름이 bean의 이름이 된다. 또한 spring에서 자동으로 찾고\(@ComponentScan 사용\) 관리해주는 bean이다.
* @Bean은 @Configuration으로 선언된 클래스 내에 있는 메소드를 정의할 때 사용한다. 이 메소드가 반환하는 객체가 bean이 되며 default로 메소드 이름이 bean의 이름이 된다.

## @Controller

Dispatcher Sevlet에서 제공되며 여기서 @RequestMapping 어노테이션을 사용하여 클라이언트 요청을 특정 컨트롤러에 전달할 수 있게 해준다.

```java
/**
 * Indicates that an annotated class is a "Controller" (e.g. a web controller).
 *
 * <p>This annotation serves as a specialization of {@link Component @Component},
 * allowing for implementation classes to be autodetected through classpath scanning.
 * It is typically used in combination with annotated handler methods based on the
 * {@link org.springframework.web.bind.annotation.RequestMapping} annotation.
 *
 * @author Arjen Poutsma
 * @author Juergen Hoeller
 * @since 2.5
 * @see Component
 * @see org.springframework.web.bind.annotation.RequestMapping
 * @see org.springframework.context.annotation.ClassPathBeanDefinitionScanner
 */
@Target({ElementType.TYPE})
@Retention(RetentionPolicy.RUNTIME)
@Documented
@Component
public @interface Controller { ... }
```

### @RestController와 @Controller의 차이는?

@RestController는 Spring 3.0 에서 추가된 어노테이션으로 RESTful web service를 제공하기 위해 @Controller를 확장한 개념이다. 기능적인 측면에서 보았을 땐 @Controller에 @ResponseBody 어노테이션을 추가된 기능이라고 보면 된다.

@ResponseBody 어노테이션의 기능은 결과값을 View를 통해서 출력되지 않고 HTTP Response Body에 직접 쓰여지게 되며 이때 리턴되는 데이터 타입에 따라 MessageConverter 에서 변환이 이뤄진 후 쓰여지게 된다.

```java
* Types that carry this annotation are treated as controllers where
 * {@link RequestMapping @RequestMapping} methods assume
 * {@link ResponseBody @ResponseBody} semantics by default.
 *
 * <p><b>NOTE:</b> {@code @RestController} is processed if an appropriate
 * {@code HandlerMapping}-{@code HandlerAdapter} pair is configured such as the
 * {@code RequestMappingHandlerMapping}-{@code RequestMappingHandlerAdapter}
 * pair which are the default in the MVC Java config and the MVC namespace.
 *
 * @author Rossen Stoyanchev
 * @author Sam Brannen
 * @since 4.0
 */
@Target(ElementType.TYPE)
@Retention(RetentionPolicy.RUNTIME)
@Documented
@Controller
@ResponseBody
public @interface RestController { ... }
```

## @Service

Service annotation은 단순히 서비스 레이어에서 사용하는 bean이라는 것을 구분하기 위한 용도로 정의한다. 그러므로 @Component로 대체해도 무방하지만 권장하지는 않는다.

```java
/**
 * Indicates that an annotated class is a "Service", originally defined by Domain-Driven
 * Design (Evans, 2003) as "an operation offered as an interface that stands alone in the
 * model, with no encapsulated state."
 *
 * <p>May also indicate that a class is a "Business Service Facade" (in the Core J2EE
 * patterns sense), or something similar. This annotation is a general-purpose stereotype
 * and individual teams may narrow their semantics and use as appropriate.
 *
 * <p>This annotation serves as a specialization of {@link Component @Component},
 * allowing for implementation classes to be autodetected through classpath scanning.
 *
 * @author Juergen Hoeller
 * @since 2.5
 * @see Component
 * @see Repository
 */
@Target({ElementType.TYPE})
@Retention(RetentionPolicy.RUNTIME)
@Documented
@Component
public @interface Service { ... }
```

## @Repository

검사 되지 않은 예외\(DAO 메소드에서 발생\)를 Spring DataAccessException으로 변환 할 수 있게 해준다.

```java
*
 * <p>A class thus annotated is eligible for Spring
 * {@link org.springframework.dao.DataAccessException DataAccessException} translation
 * when used in conjunction with a {@link
 * org.springframework.dao.annotation.PersistenceExceptionTranslationPostProcessor
 * PersistenceExceptionTranslationPostProcessor}. The annotated class is also clarified as
 * to its role in the overall application architecture for the purpose of tooling,
 * aspects, etc.
 *
 * <p>As of Spring 2.5, this annotation also serves as a specialization of
 * {@link Component @Component}, allowing for implementation classes to be autodetected
 * through classpath scanning.
 *
 * @author Rod Johnson
 * @author Juergen Hoeller
 * @since 2.0
 * @see Component
 * @see Service
 * @see org.springframework.dao.DataAccessException
 * @see org.springframework.dao.annotation.PersistenceExceptionTranslationPostProcessor
 */
@Target({ElementType.TYPE})
@Retention(RetentionPolicy.RUNTIME)
@Documented
@Component
public @interface Repository {
```

## @Configuration

한 개 이상의 @Bean 어노테이션으로 정의한 bean 들을 생성하려 할 때 클래스에 정의하는 어노테이션이다.

```java
* <h2>Constraints when authoring {@code @Configuration} classes</h2>
 *
 * <ul>
 * <li>Configuration classes must be provided as classes (i.e. not as instances returned
 * from factory methods), allowing for runtime enhancements through a generated subclass.
 * <li>Configuration classes must be non-final (allowing for subclasses at runtime),
 * unless the {@link #proxyBeanMethods() proxyBeanMethods} flag is set to {@code false}
 * in which case no runtime-generated subclass is necessary.
 * <li>Configuration classes must be non-local (i.e. may not be declared within a method).
 * <li>Any nested configuration classes must be declared as {@code static}.
 * <li>{@code @Bean} methods may not in turn create further configuration classes
 * (any such instances will be treated as regular beans, with their configuration
 * annotations remaining undetected).
 * </ul>
 *
 * @author Rod Johnson
 * @author Chris Beams
 * @author Juergen Hoeller
 * @since 3.0
 * @see Bean
 * @see Profile
 * @see Import
 * @see ImportResource
 * @see ComponentScan
 * @see Lazy
 * @see PropertySource
 * @see AnnotationConfigApplicationContext
 * @see ConfigurationClassPostProcessor
 * @see org.springframework.core.env.Environment
 * @see org.springframework.test.context.ContextConfiguration
 */
@Target(ElementType.TYPE)
@Retention(RetentionPolicy.RUNTIME)
@Documented
@Component
public @interface Configuration {
```

### @Bean은 언제 사용하는게 좋을까?

* 개발자가 직접 제어가 불가능한 라이브러리를 활용할 때 사용
* 초기에 설정을 하기 위해 활용할 때 사용

## 참고

* [https://lazymankook.tistory.com/27](https://lazymankook.tistory.com/27)
* [https://c10106.tistory.com/1720](https://c10106.tistory.com/1720)
* [https://docs.spring.io/spring/docs/3.0.0.M3/reference/html/ch04s12.html](https://docs.spring.io/spring/docs/3.0.0.M3/reference/html/ch04s12.html)
* [https://www.netsurfingzone.com/spring/component-controller-service-and-repository-annotations-example-using-spring-boot/](https://www.netsurfingzone.com/spring/component-controller-service-and-repository-annotations-example-using-spring-boot/)
* [https://www.baeldung.com/spring-component-repository-service](https://www.baeldung.com/spring-component-repository-service)
* [https://c10106.tistory.com/1720](https://c10106.tistory.com/1720)
* [https://mangkyu.tistory.com/75](https://mangkyu.tistory.com/75)



