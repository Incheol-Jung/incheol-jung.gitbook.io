---
description: '@Valid 동작 원리를 알아보자'
---

# @Valid 동작 원리

## @Valid가 동작하는 원리를 설명하시오

* 우선 프로세스를 설명하기 전에 web mvc가 동작하는 원리부터 이해해야 한다.

![https://supawer0728.github.io/2018/04/04/spring-filter-interceptor/](../../.gitbook/assets/997bae4d5c8b3f7d10.jpg)

### Spring Web MVC 과정

* 사용자의 요청이 오면 Filter를 통해서 DispatcherServlet을 호출한다.
* DispatcherServlet은 어떤 컨트롤러를 호출해야 할지 HandlerMapping 과정을 통해서 찾아간다.
* HandlerMapping을 확인하면 해당하는 HandlerMappingAdapter를 통해서 interceptor, argumentResolver를 과정을 순회한다. 그리고 그 이후에 Controller를 호출하게 된다.
* Controller에서 수행한 로직이 완료되면 DispatcherServlet에 리턴되고 리턴된 결과는 ViewResolver를 통해서 보여지게 된다.

### HandlerMapping

*   여기서 spring web을 사용하게 되면 webmvcConfigurationSupport에 정의한 default handlerMapping bean이 등록되게 된다.

    ```jsx
    @Bean
    public BeanNameUrlHandlerMapping beanNameHandlerMapping(
    		@Qualifier("mvcConversionService") FormattingConversionService conversionService,
    		@Qualifier("mvcResourceUrlProvider") ResourceUrlProvider resourceUrlProvider) {

    	BeanNameUrlHandlerMapping mapping = new BeanNameUrlHandlerMapping();
    	mapping.setOrder(2);

    	...
    }

    @Bean
    @Primary
    @Override
    public RequestMappingHandlerMapping requestMappingHandlerMapping(
    		@Qualifier("mvcContentNegotiationManager") ContentNegotiationManager contentNegotiationManager,
    		@Qualifier("mvcConversionService") FormattingConversionService conversionService,
    		@Qualifier("mvcResourceUrlProvider") ResourceUrlProvider resourceUrlProvider) {
    	// Must be @Primary for MvcUriComponentsBuilder to work
    	return super.requestMappingHandlerMapping(contentNegotiationManager, conversionService,
    			resourceUrlProvider);
    }
    ```
* 기본 RequestHandler 종류
  *   BeanNameUrlHandlerMapping

      ```sql
      @Controller("/accounts")
      public class AccountController {

      }
      ```
  *   SimpleUrlHandlerMapping

      ```sql
      @Bean
      SimpleUrlHandlerMapping urlHandlerMapping() {
          SimpleUrlHandlerMapping simpleUrlHandlerMapping = new SimpleUrlHandlerMapping();
          simpleUrlHandlerMapping.setOrder(Ordered.LOWEST_PRECEDENCE - 2);

          Map<String, Object> mapping = new HashMap<>();
          mapping.put("/accounts", accountController());
          simpleUrlHandlerMapping.setUrlMap(mapping);

      		//or 
      		//  Properties properties = new Properties();
      		//  properties.put("/accounts", "accountController");
      		//  simpleUrlHandlerMapping.setMappings(properties);

          return simpleUrlHandlerMapping;
      }
      ```
  *   RequestMappingHandlerMapping

      ```sql
      @Controller
      @RequestMapping("/accounts")
      public class AccountController {
      	....
      }
      ```

### RequestMappingHandlerAdaper

*   RequestMappingHandlerAdaper를 초기에 등록할 때 getDefaultArgumentResolvers()를 통해서 다양한 파라미터에 대한 ArgumentResolver를 등록하게 되는데 대략 30개정도 된다.

    ```jsx
    rivate List<HandlerMethodArgumentResolver> getDefaultArgumentResolvers() {
    		List<HandlerMethodArgumentResolver> resolvers = new ArrayList<>(30);

    		// Annotation-based argument resolution
    		resolvers.add(new RequestParamMethodArgumentResolver(getBeanFactory(), false));
    		resolvers.add(new RequestParamMapMethodArgumentResolver());
    		resolvers.add(new PathVariableMethodArgumentResolver());
    		resolvers.add(new PathVariableMapMethodArgumentResolver());
    		resolvers.add(new MatrixVariableMethodArgumentResolver());
    		resolvers.add(new MatrixVariableMapMethodArgumentResolver());
    		resolvers.add(new ServletModelAttributeMethodProcessor(false));
    		resolvers.add(new RequestResponseBodyMethodProcessor(getMessageConverters(), this.requestResponseBodyAdvice));
    		resolvers.add(new RequestPartMethodArgumentResolver(getMessageConverters(), this.requestResponseBodyAdvice));
    		resolvers.add(new RequestHeaderMethodArgumentResolver(getBeanFactory()));
    		resolvers.add(new RequestHeaderMapMethodArgumentResolver());
    		resolvers.add(new ServletCookieValueMethodArgumentResolver(getBeanFactory()));
    		
    		...
    }
    ```
* 그중에는 RequestResponseBodyMethodProcessor 빈도 등록되는것을 확인할 수 있다.

### DispatcherServlet

![https://maenco.tistory.com/entry/Spring-MVC-Argument-Resolver%EC%99%80-ReturnValue-Handler?category=959609](<../../.gitbook/assets/222 (20).png>)

* 그럼 이제 HandlerMapping이 등록된다는 것을 알수 있었고, ArgumentResolver도 HandlerMappingAdaper에 종속되어 등록되는 것을 알 수 있다.
* 그럼 이제 사용자가 호출하게 되면 어떤 과정을 거치게 될까?
* 처음에 사용자 요청을 통해서 Filter를 지나 DispatcherServlet으로 오게 되면
*   doService → doDispatch()를 통해서 등록한 Handler중에 적합한 Handler를 찾게 된다.

    ```jsx
    mappedHandler = getHandler(processedRequest);
    ```
*   doDispatch()안에 있는 getHandler() 메소드를 통해서 RequestmappingHandle이라는 빈이 있다는 것을 확인하게 되고 리턴한다.

    ```jsx
    @Nullable
    	protected HandlerExecutionChain getHandler(HttpServletRequest request) throws Exception {
    		if (this.handlerMappings != null) {
    			for (HandlerMapping mapping : this.handlerMappings) {
    				HandlerExecutionChain handler = mapping.getHandler(request);
    				if (handler != null) {
    					return handler;
    				}
    			}
    		}
    		return null;
    	}
    ```
*   그럼 handle()을 호출하여 추상화된 AbstractHandlerMethodAdapter 객체는 Handler와 관련되어 있는 Adapter 객체를 호출하게 된다.

    ```jsx
    // DispatcherServlet.doDispatch
    mv = ha.handle(processedRequest, response, mappedHandler.getHandler());

    // AbstractHandlerMethodAdapter.handler
    public final ModelAndView handle(HttpServletRequest request, HttpServletResponse response, Object handler)
    			throws Exception {

    		return handleInternal(request, response, (HandlerMethod) handler);
    	}
    ```
*   그렇게 확인된 RequestMappingHandlerAdaper 객체는 interceptor 과정을 거치고 나서 등록된 request 유형에 따라 argumentResolver를 호출하게 된다.

    ```jsx
    // RequestMappingHandlerAdaper
    public Object resolveArgument(MethodParameter parameter, @Nullable ModelAndViewContainer mavContainer,
    			NativeWebRequest webRequest, @Nullable WebDataBinderFactory binderFactory) throws Exception {

    		HandlerMethodArgumentResolver resolver = getArgumentResolver(parameter);
    		if (resolver == null) {
    			throw new IllegalArgumentException("Unsupported parameter type [" +
    					parameter.getParameterType().getName() + "]. supportsParameter should be called first.");
    		}
    		return resolver.resolveArgument(parameter, mavContainer, webRequest, binderFactory);
    	}
    ```
*   RequestResponseBodyMethodProcessor.resolverArgument() 메소드를 호출하게 되는데

    ```jsx
    public Object resolveArgument(MethodParameter parameter, @Nullable ModelAndViewContainer mavContainer,
    			NativeWebRequest request, @Nullable WebDataBinderFactory binderFactory) throws Exception {
    		...
    		validateIfApplicable(binder, parameter);
    }
    ```
* 그 안에는 AbstreacMessageConverterMethodArgumentResolver.validateIfApplicable 메소드를 호출하는 영역이 있는데 해당 로직에 valid 어노테이션에 대한 로직이 있는 것을 확인할 수 있다.

### @Valid, @Validated의 차이는 무엇인가?

* @Valid는 JSR 303 방식의 빈 검증 표준 스펙을 검증하는 자바 기본 라이브러리에서 제공해주는 어노테이션이다.
* @Validated는 javax 라이브러리가 아닌 springframework에서 제공하는 어노테이션으로 특정 검증로직만 수행하고 싶거나 컨트롤러가 아닌 다른 레이어에서 검증 로직을 수행하고 싶을 경우 사용하는 어노테이션이다.
* 그리고 @Validated는 ArgumentResolver를 통해서 구현되는 로직이 아니라 AOP를 통해서 동작하기 때문에 클래스 내부 메소드 호출은 프록시 적용이 되지 않으므로 동작하지 않을수도 있으니 주의해야 한다.
  *   부분 검증 예제

      ```sql
      public class ValidationGroups {
          public interface group1 {};
          public interface group2 {};
      }

      public class User {
          private Integer id;
          @NotEmpty(groups = {ValidationGroups.group1.class})
          private String account;
          @NotEmpty(groups = {ValidationGroups.group2.class})
          private String password;
      }

      @RequestMapping(value = "/user/login", method = RequestMethod.POST)
      public ResponseEntity login(@RequestBody @Validated(ValidationGroups.group1.class) User user, BindingResult bindingResult) {
          // do something
      }
      ```
  *   서비스 레이어에서 사용하는 예제

      ```sql
      @Service
      @Validated
      public ItemService {
      	public Item saveItem(@Valid Item) {
      		...
      	}
      }
      ```

### 참고

* [https://mangkyu.tistory.com/174](https://mangkyu.tistory.com/174)
* [https://joont92.github.io/spring/HandlerMapping-HandlerAdapter-HandlerInterceptor/](https://joont92.github.io/spring/HandlerMapping-HandlerAdapter-HandlerInterceptor/)
* [https://cprayer.github.io/posts/about-spring-request-mapping-in-servlet-context/](https://cprayer.github.io/posts/about-spring-request-mapping-in-servlet-context/)
* [https://maenco.tistory.com/entry/Spring-MVC-Argument-Resolver%EC%99%80-ReturnValue-Handler?category=959609](https://maenco.tistory.com/entry/Spring-MVC-Argument-Resolver%EC%99%80-ReturnValue-Handler?category=959609)
