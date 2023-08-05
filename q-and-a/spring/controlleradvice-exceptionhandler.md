---
description: '@Controlleradvice, @ExceptionHandler에 대해 알아보자'
---

# @Controlleradvice, @ExceptionHandler

![https://velog.io/@hanblueblue/Spring-ExceptionHandler](<../../.gitbook/assets/image (3) (1).png>)

## 예외처리

> 예외가 발생하면 어떻게 처리하면 좋을까?

#### 보통 예외는 3 가지 방법으로 처리할 수 있다.

* 예외 복구 : 예외가 발생하면 예외 상황에 대해 알맞게 처리하여 복구한다. ex) try, catch
* 예외 회피 : 예외를 직접 처리하지 않고 예외를 상위 메소드에 위임한다. ex) throw
* 예외 전환 : 예외를 위임하되 발생한 예외를 그대로 위임하는 것이 아닌 적절한 예외로 전환하여 위임한다. ex) restTemplate.doExecute

#### 이번에 살펴볼 내용은 예외 복구에 대한 내용이다.

이전에 설명 하였던 것 처럼 예외가 발생할 경우 try, catch를 사용하여 예외 상황을 대응할 수 있다. 그러나 우리가 실제로 개발하다 보면 상당히 많은 예외 복구 로직이 필요하고, Exception 성격에 따라서 비슷하게 처리되는 로직도 있을 것이다. 그러면서 우리는 동일한 복구 로직에 대한 보일러 플레이트 코드를 줄이고 싶은 상황이 발생할 수도 있고, 다양한 예외처리를 한곳에서 보고싶은 경우도 있을 것이다. 이런 다양한 개선점을 어떻게 해결할 수 있는지 살펴보자

### 예외 복구 범위를 정해보자

* 메소드 영역 : 메소드 영역은 종속된 복구 기능으로 단순히 try, catch 사용 하면 된다.
* 클래스 영역 : 클래스 내 공통 예외 복구는 @ExceptionHandler 사용할 수 있다.
* 전역 영역 : 여러 클래스의 공통 예외 복구는 @ControllerAdvice 사용할 수 있다.

## 컨트롤 내 예외처리

특정 컨트롤러 내에서 예외를 처리하고 싶을 경우에는 컨트롤러 내에서 @ExceptionHandler를 사용하면 해결할 수 있다. 이는 @Controller나 @RestController 빈 내에서 발생하는 특정 예외를 처리해주는 기능을 지원한다.

### Controller에서 예외를 발생해보자

예제는 단순하다. /person/exception이라는 api를 호출하면 NullPointerException이 발생하지만 @ExceptionHanlder를 사용하여 NullPointerException을 catch하여 "nullPointerException Handle!!!" 라는 문자열을 리턴할 것이다.

```java
@RestController
@RequestMapping("/person")
public class PersonController {
    @GetMapping
    public String test(){
        return "test";
    }

    @GetMapping("/exception")
    public String exception1(){
        throw new NullPointerException();
    }

    @ExceptionHandler(value = NullPointerException.class)
    public String nullPointerExceptionHandle(NullPointerException ex){
        return "nullPointerException Handle!!!";
    }
}
```

그러면 api를 실행해서 어떻게 리턴되는지 살펴보자.

![](<../../.gitbook/assets/111 (5).png>)

nullPointerException Handle!!! 문구를 확인한 것으로 Exception이 정상적으로 catch 된것을 확인할 수 있다.

### @ExceptionHanlder는 단일 예외 처리만 할 수 있을까?

아니다. 하나의 ExceptionHandler에서 다수의 Exception을 처리할 수 있다. 예제로 살펴보자.

```java
@RestController
@RequestMapping("/person")
public class PersonController {
    @GetMapping
    public String test(){
        return "test";
    }

    @GetMapping("/exception")
    public String exception1(){
        throw new NullPointerException();
    }

    @GetMapping("/exception2")
    public String exception2(){
        throw new ClassCastException();
    }

    @ExceptionHandler({NullPointerException.class, ClassCastException.class})
    public String handle(Exception ex){
        return "Exception Handle!!!";
    }
}
```

그런 다음에 /exception2를 호출해보자.

![](<../../.gitbook/assets/222 (5).png>)

이렇듯 다중 Exception도 하나의 ExceptionHandler에서 처리할 수 있는 것을 확인할 수 있다.

## 예외처리 말고 컨트롤 내 다른 공통 기능은 없을까?

ExceptionHandler 뿐만 아니라 콘트롤러 내에서 공통으로 구현할 수 있도록 제공하는 기능이 있다.

### @InitBinder

Controller로 들어오는 요청에 대해 추가적인 기능(데이터 변환 또는 검증)을 지원한다.

만약에 Person이라는 객체를 Get 요청 시 파라미터 모델로 넘기고 싶다고 해보자. registerDate는 날짜 형식으로 사용할 수 있어야 한다.

```java
@Getter
@Setter
@ToString
public class Person {
    private int id;
    private String name;
    private Date registerDate;
}
```

그리고 컨트롤러에 Person 객체를 파라미터로 받는 api 를 추가해보자.

```java
@GetMapping("register")
public String register(Person person){
    return person.toString();
}
```

#### 이렇게만 설정하고 호출하면 어떻게 될까?

단순 String을 date format으로 변경하고 싶을 경우엔 문자열이 date의 어떤 포맷으로 넘겨줄지 알아야 한다. 그러나 현재는 아무런 설정이 되어 있지 않으므로 date 형식으로 변환하는 과정에서 에러가 발생하였다.

![](<../../.gitbook/assets/333 (5).png>)

그렇다면 @InitBinder를 사용해서 변환해보자.

```java
@InitBinder
public void InitBinder(WebDataBinder dataBinder) {
    SimpleDateFormat dateFormat = new SimpleDateFormat("yyyy-MM-dd");
    dataBinder.registerCustomEditor(java.util.Date.class, new CustomDateEditor(dateFormat, true));
}
```

@InitBinder를 설정한 후에 다시 api를 호출해보자.

![](<../../.gitbook/assets/444 (3).png>)

정상적으로 date format으로 변경되는것을 확인할 수 있다. 이는 @InitBinder를 사용하는 단편적인 예로 @InitBinder를 사용하지 않고 Person 클래스의 registerDate필드에 `@DateTimeFormat(pattern = "yyyy-MM-dd")` 를 사용해도 date 포맷으로 변경 가능하다. 개인적으로는 이 어노테이션은 데이터 포맷 변경 보다는 검증 처리에 더 많이 사용하는 것 같다.

### @ModelAttribute

@ModelAttribute는 두 가지 기능을 제공한다.

* Controller에서 받아오는 외부 request 객체를 모델로 받을 수 있도록 매핑해준다.
* Controller 내에서 공통으로 사용할 모델을 정의할 수 있으며, View에 전달할 모델을 자동으로 설정해준다.

이번 글에서는 첫번째 기능은 주제와 다른 이야기이므로 두번째 기능에 초점을 맞추도록 하겠다.

하나의 예제를 만들어보자. {url}/person/register이라는 api를 호출하면 hello라는 뷰 페이지를 호출하는 controller를 작성하였다. 코드를 살펴보면 hello 라는 뷰 페이지를 호출할 때, 아무런 데이터를 설정하지 않은것을 볼수 있다.

```java
@Controller
@RequestMapping("/person")
public class PersonController {

    @ModelAttribute
    public void addAttributes(Model model) {
        model.addAttribute("msg", "Welcome to the Incheol Blog!!!!!");
    }

    @GetMapping("register")
    public String register() {
        return "hello";
    }
}
```

그런 다음에 view 페이지를 작성해보자

```java
<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8" %>
<!DOCTYPE html PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "<http://www.w3.org/TR/html4/loose.dtd>">
<html>
<head>
    <meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
    <title></title>
</head>
<body>${msg}</body>
</html>
```

view 페이지에는 msg를 서버에서 받아와서 사용하도록 구성하였다. 그런 다음에 결과 페이지를 확인해보자.

![](<../../.gitbook/assets/555 (2).png>)

msg 변수 값이 셋팅되어 있는 것을 확인할 수 있다. 이처럼 modelattribute를 사용하면 view 페이지에 전달해준 데이터가 자동으로 셋팅되도록 기능을 제공한다.

## 글로벌 예외처리

지금까지는 컨트롤러 내의 공통 기능을 적용할 수 있는 다양한 방법을 살펴보았다. 그러면 특정 컨트롤러가 아닌 여러 컨트롤러로 공통 기능을 확장하려면 어떻게 해야 할까?

컨트롤러 간의 공통된 로직 구현을 위해서는 @ControllerAdvice를 사용할 수 있다.

### @ControllerAdvice

@ControllerAdvice는 컨트롤러를 보조해주는 기능을 제공한다는 것을 명시한다.

바로 예제를 통해서 알아보자. 우선 컨트롤러 공통으로 처리해 줄 수 있는 ControllerSupport 클래스를 생성해보자.

```java
/**
 * @author Incheol Jung
 */
@RestControllerAdvice
public class ControllerSupport {

    @ExceptionHandler({NullPointerException.class, ClassCastException.class})
    public String handle(Exception ex) {
        return "Exception Handle!!!";
    }
}
```

그리고 두개의 Controller를 생성하여 Exception을 발생해보자.

```java
@RestController
@RequestMapping("/school")
public class SchoolController {
    @GetMapping
    public String test(){
        return "test";
    }

    @GetMapping("/exception")
    public String exception1(){
        throw new NullPointerException();
    }

    @GetMapping("/exception2")
    public String exception2(){
        throw new ClassCastException();
    }

}

@RestController
@RequestMapping("/person")
public class PersonController {
    @GetMapping
    public String test(){
        return "test";
    }

    @GetMapping("/exception")
    public String exception1(){
        throw new NullPointerException();
    }

    @GetMapping("/exception2")
    public String exception2(){
        throw new ClassCastException();
    }

}
```

컨트롤러내에서는 Exception만 발생시키고 Exception을 처리하는 로직은 존재하지 않는다. 공통으로 Exception을 처리해주는지 api를 호출해보자.

![](<../../.gitbook/assets/666 (2).png>)

![](<../../.gitbook/assets/777 (1).png>)

동일하게 Exception 처리에 대한 메시지를 전달해주는 것을 확인할 수 있다. @ExceptionHandler 뿐만 아니라 @InitBinder, @ModelAttribute 또한 사용할 수 있다.

### @RestControllAdvice와 @ControllAdvice의 차이는?

차이는 크게 없다. @Controller와 @RestController 와 동일하게 @ResponseBody의 유무 차이만 있을 뿐이다. 그러므로 결과 타입을 Json으로 내려줄지 아니면 View 페이지로 전달할지에 따라서 사용하면 되겠다.

```java
@Target(ElementType.TYPE)
@Retention(RetentionPolicy.RUNTIME)
@Documented
@ControllerAdvice
@ResponseBody
public @interface RestControllerAdvice {
```

### @ResponseStatus는 언제 사용하나?

이전의 Exception 처리에 대한 예제를 다시 살펴보자. 이전에는 결과 메시지에만 집중하였지만 다시 살펴보니 http status code가 200으로 리턴해주는것을 확인할 수 있다. 이는 회사 내규에 따라 다르겠지만 Exception이 발생하였을 경우에 Response Body에만 표시해줄지 아니면 Http status code에도 표시할지에 따라서 다를 수 있다. 만약 status code에도 어떤 에러인지 명시적으로 내어주고 싶을 경우에 @ResponseStatus를 사용할 수 있다.

이전 ControllerSupport 클래스에 @ResponseStatus를 추가해보자.

```java
@RestControllerAdvice
public class ControllerSupport {

    @ExceptionHandler({NullPointerException.class, ClassCastException.class})
    @ResponseStatus(code = HttpStatus.BAD_REQUEST)
    public String handle(Exception ex) {
        return "Exception Handle!!!";
    }
}
```

그리고 다시 api를 호출해보자.

![](<../../.gitbook/assets/888 (2).png>)

이제는 에러 메시지와 함께 성격에 맞는 status code를 내어주는 것을 확인할 수 있다.

> 만약 특정 콘트롤러 그룹에만 공통 로직을 적용하고 싶을 경우에는 @ControllerAdvice의 basePackages를 사용하여 컨트롤러의 범위를 지정할 수 있다.

## AOP의 Throwing은 언제 사용하면 좋을까?

AOP를 사용하여 Exception을 공통적으로 처리할 수 있다. 그런데 ExceptionHandler를 사용하는 이유는 무엇일까? 이전에는 AOP를 사용하여 Exception을 처리했던 적도 있었다. AOP를 사용하여 Exception을 처리해보자.

```java
@Aspect
@Component
public class SetterMonitor implements ThrowsAdvice {
	protected final Logger logger = LogManager.getLogger();
	LoggerContext ctx = (LoggerContext)LogManager.getContext(false);
	
	@AfterThrowing(pointcut = "execution(* com.homework.todolist.service..*(..))" , throwing="e")
	public void callMethodException(JoinPoint joinPoint, Throwable e) throws Throwable {

		Signature signature = joinPoint.getSignature();
	    String methodName = signature.getName();
	    String stuff = signature.toString();
	    StringBuilder keyBuilder = new StringBuilder();
	    keyBuilder.append(methodName + ":");
	    ObjectMapper oMapper = new ObjectMapper();
	    String exceptionMsg = e.getMessage();
	    
	    for (Object obj : joinPoint.getArgs()) {
			try {
				Map<String, Object> map = oMapper.convertValue(obj, Map.class);
				keyBuilder.append("{" + map.toString() + "}");
			}catch(Exception ex) {
				if(obj != null) keyBuilder.append(obj.toString());
			}
	    }
	    
	    logger.error(stuff + "\\n method with arguments " + keyBuilder + " exception is: " + e.getMessage());
	    HttpResponse(exceptionMsg);
	}
```

해당 코드를 보면 이유를 알 수 있을 것이다. Exception을 처리하는 로직이 한곳에 모여있으면 한눈에 보기 용이하다. 그러나 Exception에 따라 처리하는 로직이 다르고 결과값도 에러 페이지를 보여주는 경우도 있고 에러 메시지만 노출시키는 경우도 있다. 이러한 여러 분기처리를 한곳에서 사용한다고 해보자. 각각의 구현 코드는 메소드로 분리하여 코드 라인은 줄일 수 있지만 모든 분기처리를 하나의 메소드에서 해야 한다는 단점이 있다. 이는 객체지향 관점에서도 단일 책임 원칙을 위반하는 사례라고 할 수 있다. 예외에 대한 모든 책임을 가지다 보면 점차 유지보수하기 쉽지않고 변경에 취약한 코드가 되기 마련이다. 그러므로 Exception 처리는 Exception Handler를 사용하도록 하자

## 참고

* [https://jeong-pro.tistory.com/195](https://jeong-pro.tistory.com/195)
* [https://duooo-story.tistory.com/m/16](https://duooo-story.tistory.com/m/16)
* [https://springboot.tistory.com/33](https://springboot.tistory.com/33)
* [https://pupupee9.tistory.com/m/52?category=796566](https://pupupee9.tistory.com/m/52?category=796566)
* [https://joont92.github.io/spring/모델-바인딩과-검증/](https://joont92.github.io/spring/%EB%AA%A8%EB%8D%B8-%EB%B0%94%EC%9D%B8%EB%94%A9%EA%B3%BC-%EA%B2%80%EC%A6%9D/)
