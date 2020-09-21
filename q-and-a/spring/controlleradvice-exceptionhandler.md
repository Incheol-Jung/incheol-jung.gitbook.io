---
description: '@Controlleradvice, @ExceptionHandler에 대해 알아보자'
---

# @Controlleradvice, @ExceptionHandler

![https://velog.io/@hanblueblue/Spring-ExceptionHandler](../../.gitbook/assets/image%20%283%29.png)

**@ControllerAdvice**

컨트롤러를 보조하는 클래스에 사용하는 어노테이션.

컨트롤러에서 쓰이는 공통기능들을 모듈화하여 전역으로 사용한다.

**@ExceptionHandler**

컨트롤러 메소드에 사용하는 어노테이션.

어노테이션 인자로 전달된 예외를 처리한다.

전달된 예외클래스와 확장된 클래스까지 처리한다.

#### @ExceptionHandler 에러 처리 만들기

[Spring Web MVC - Annotated Controllers - Exceptions](https://docs.spring.io/spring/docs/5.1.6.RELEASE/spring-framework-reference/web.html#mvc-ann-exceptionhandler)

#### 기본 사용 방법

아래와 같이 클래스를 작성하였다고 가정하자.

```text
@Controller
public class SimpleController {

    // ...@ExceptionHandler
    public ResponseEntity<String> handle(IOException ex) {
        // ...
    }
}
```

위와 같이 작성되면 해당 Controller의 메소드에서 발생한 IOException은 위에 @ExceptionHandler로 선언된 handle 메서드를 통해 에러가 처리된다.

```text
@ExceptionHandler({FileSystemException.class, RemoteException.class})
public ResponseEntity<String> handle(IOException ex) {
    // ...
}
```

위와 같이 @ExceptionHandler에 대상 Exception 목록을 정의하여 처리 대상인 Exception 유형을 좀더 좁힐 수 있다.

IOException 중 FileSystemException과 RemoteException 에 대해서만 해당 handle 메서드가 동작한다.

```text
@ExceptionHandler({FileSystemException.class, RemoteException.class})
public ResponseEntity<String> handle(Exception ex) {
    // ...
}
```

위와 같이 대상 Exception을 @ExceptionHandler로 정의하고 일반적인 에러 유형인 Exception이나 또는 상위인 Throwable을 매개변수로 사용할 수도 있다.

#### @ControllerAdvice와 같이 사용하기

@Controller에 정의된 @ExceptionHandler는 해당 controller에서만 동작한다.

모든 Controller에 대해 발생한 전역 에러에 대해 처리하는 @ExceptionHandler는 @ControllerAdvice와 같이 사용하면 된다.

```text
@Controller
@ControllerAdvice
public class GlobalExceptionController {

    // ...@ExceptionHandler
    public ResponseEntity<String> handle(IOException ex) {
        // ...
    }
}
```

위와 같이 @ControllerAdvice로 선언한 controller내에 정의된 @ExceptionHandler는 모든 controller를 대상으로 동작한다.

controller 대상을 좁혀서 지정하고 싶은 경우 아래처럼 사용하면 된다.

```text
// @RestController를 사용한 모든 controller 대상@ControllerAdvice(annotations = RestController.class)
public class ExampleAdvice1 {}

// 해당 패키지 내 모든 controller 대상@ControllerAdvice("org.example.controllers")
public class ExampleAdvice2 {}

// 해당 클래스 하위로 구현된 controller 대상@ControllerAdvice(assignableTypes = {ControllerInterface.class, AbstractController.class})
public class ExampleAdvice3 {}
```

