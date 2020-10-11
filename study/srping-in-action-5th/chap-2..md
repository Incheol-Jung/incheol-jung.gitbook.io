---
description: 스프링 인 액션(5판) 챕터 2장을 요약한 내용 입니다.
---

# Chap 2. 웹 애플리케이션 개발하기

## 정보 보여주기

타코 식자재를 정의하기 위한 모델을 생성해보자.

```text
@Data
@RequiredArgsConstructor
public class Ingredient {
	private final String id;
	private final String name;
	private final Type type;

	public static enum Type {
		WRAP, PROTEIN, VEGGIES, CHEESE, SAUCE
	}
}
```

식자재를 나타내는데 필요한 3개의 속성을 정의한다. Ingredient 클래스에서 특이한 점은 final 속성들을 초기화하는 생성자는 물론이고 속성들의 게터\(getter\)와 세터\(setter\)메서드가 없다는 것과 equals\(\), hashCode\(\), toString\(\) 등의 유용한 메서드도 정의하지 않았다는 것이다.

@Data 애노테이션을 지정하면 소스 코드에 누락된 final 속성들을 초기화하는 생성자는 물론이고, 속성들의 게터와 세터 등을 생성하라고 Lombok에 알려준다.

> @Data 애노테이션은 문제는 없을까?

타코 클래스를 추가해보자.

```text
@Data
public class Taco {
	private String name;
	private List<String> ingredients;
}
```

@Slf4j는 컬파일 시에 Lombok에 제공되며 애당 클래스에 자동으로 SLF4J Logger를 생성한다.

```text
private static final org.slf4j.Logger log = 
	org.slf4j.LoggerFactory.getLogger(DesignTacoController.class);
```

### GET 요청 처리하기

스프링 4.3 이전에는 Get Method를 사용하려면 @RequestMapping 애노테이션을 사용할 수 있었다. 4.3 이후에는 @GetMapping을 사용할 수 있는데 더 간결하고 HTTP GET 요청에 특화되어 있다.

```text
// spring 4.3 이전
@RequestMagging(method = RequestMethod.GET)

// spring 4.3 이후
@GetMapping
```

### 뷰 디자인하기

스프링은 뷰를 정의하는 여러 가지 방법을 제공한다. JSP, Thymeleaf, Mustache, 그루비 기반의 템플릿 등이다. Thymeleaf를 사용하려면 우리 프로젝트의 빌드 구성 파일에 또 다른 의존성을 추가해야 한다.

```text
<dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-thymeleaf</artifactId>
</dependency>
```

&lt;body&gt; 태그 맨 앞에 있는 타코 클라우드 로고 이미지와 &lt;head&gt; 태그에 있는 &lt;link&gt; 스타일시트 참조도 주목할 필요가 있다. 두 가지 모두에서 Thymeleaf의 @{} 연산자가 사용되었다.

```text
<head>
    <title>Taco Cloud</title>
    <link rel="stylesheet" th:href="@{/styles.css}" />
</head>

...

<form method="POST" th:object="${design}">
```

참조되는 정적 콘텐프인 로고 이미지와 스타일시트의 위치를 알려주기 위해서다. 1장에서 배웠듯이, 스프링 부트 애플리케이션의 정적 콘텐츠는 classpath의 루트 밑에 있는 /static 디렉터리에 위치한다.

## 폼 제출 처리하기

타코 디자인 폼의 제출을 처리하기 위해 processDesign\(\) 메서드를 추가하자.

```text
@PostMapping
public String processDesign(@Valid @ModelAttribute("design") Taco design, Errors errors, Model model) {
  if (errors.hasErrors()) {
    return "design";
  }

  log.info("Processing design: " + design);

  return "redirect:/orders/current";
}
```

processDesign\(\)에서 반환되는 값은 리디렉션 뷰를 나타내는 "redirect:"가 제일 앞에 붙는다. 즉, processDesign\(\)의 실행이 끝난 후 사용자의 브라우저가 /orders/current 상대 경로로 재접속되어야 한다는 것을 나타낸다.

## 폼 입력 유효성 검사하기

스프링은 자바의 빈 유효성 검사 API를 지원한다. 그리고 스프링 부트를 사용하면 유효성 검사 하이브러리를 우리 프로젝트에 쉽게 추가할 수 있다.

스프링 MVC에 유효성 검사를 적용하려면 다음과 같이 해야 한다.

* 유효성을 검사할 클래스에 검사 규칙을 선언한다.
* 유효성 검사를 해야 하는 컨트롤러 메서드에 검사를 수행한다는 것을 지정한다.
* 검사 에러를 보여주도록 폼 뷰를 수정한다.

## 뷰 컨트롤러로 작업하기

각 콘트롤러는 애플리케이션의 서로 다른 기능을 제공한다. 그러나 프로그래밍 패턴은 다음과 같이 동일하다.

* 스프링 컴포넌트 검색에서 자동으로 찾은 후 스프링 애플리케이션 컨텍스트의 빈으로 생성되는 컨트롤러 클래스임을 나타내기 위해 그것들 모두 @Controller 애노테이션을 사용한다.
* HomeController 외의 다른 컨트롤러에서는 자신이 처리하는 요청 패턴을 정의하기 위해 클래스 수준의 @RequestMapping 애노테이션을 사용한다.
* 메서드에서 어떤 종류의 요청을 처리해야 하는지 나타내기 위해 @GetMapping 또는 @PostMaiing 애노테이션이 지정된 하나 이상의 메서드를 갖는다.

```text
import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.ViewControllerRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
public class WebConfig implements WebMvcConfigurer {

  @Override
  public void addViewControllers(ViewControllerRegistry registry) {
    registry.addViewController("/").setViewName("home");
  }

}
```

WebConfig는 뷰 컨트롤러의 역할을 수행하는 구성 클래스이며, 여기서 가장 중요한 것은 WebMvcConfigurer 인터페이스를 구현한다는 것이다.

addViewControllers\(\) 메서드는 하나 이상의 뷰 컨트롤러를 등록하기 위해 사용할 수 있는 ViewControllerRegistry 를 인자로 받는다.

## 템플릿 캐싱

기본적으로 템플릿은 최초 사용될 때 한 번만 파싱된다. 그리고 파싱된 결과는 향후 사용을 위해 캐시에 저장된다. 그러나 개발 시에는 템플릿 캐싱이 그리 달갑지 않다.

다행스럽게도 템플릿 캐싱을 비활성화하는 방법이 있다.

```text
spring.thymeleaf.cache = false
```

하지만 1장에서 설명했던 스프링 부트의 DevTools를 사용하는 것이 훨씬 더 쉽다.

### 요약

* 스프링은 스프링 MVC라는 강력한 우베 프레임워크를 제공하는데, 스프링 MVC는 스프링 애플리케이션의 웹 프론트엔드 개발에 사용한다.
* 스프링 MVC는 애노테이션을 기반으로 하며 @RequestMapping, @GetMapping, @PostMapping과 같은 애노테이션을 사용해서 요청 처리 메서드를 선언할 있다.
* 대부분의 요청 처리 메서드들은 마지막에 Thymeleaf 템플릿과 같은 논리 뷰 이름을 반환한다. 모델 데이터와 함께 해당 요청을 전달하기 위해서다.
* 스프링 MVC는 자바 빈 유효성 검사 API와 Hibernate Validator 등의 유효성 검사 API구현 컴포넌트를 통해 유효성 검사를 지원한다.
* 모델 데이터가 없거나 처리할 필요가 없는 HTTP GET 요청을 처리할 때는 뷰 컨트롤러를 사용할 수 있다.

