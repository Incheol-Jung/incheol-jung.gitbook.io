# 스프링 부트를 왜 사용 해야 할까?

## 스프링의 변화

* 스프링은 JEE나 J2EE로 알려진 자바 엔터프라이즈 에디션을 경량화하려는 대안으로 시작
* 컴포넌트 코드 작성은 가벼웠으나 개발 구성은 무거웠다. (초기 스프링은 구성에 필요한 XML 코드가 많았다.)
* 스프링 2.5는 에너테이션을 기반으로 한 컴포넌트 검색 기능 도입 이후 XML 구성을 상당 부분 제거
* 스프링 3.0에서는 XML 대신 타입 세이프(Type-safe)하고 리팩토링이 가능한 자바 기반의 구성을 도입

### 그러나 모든 구성 작업은 개발 저항으로 나타난다.

* 애플리케이션 로직 작성 대신 구성 작업에 쓰는 시간은 모두 낭비다.
* 스프링은 많은 일을 대신 처리하지만, 그 대가로 여러분이 해야 할 일도 늘어난다.
* 왜냐하면 라이브러리 상호 의존성을 모두 지키는 부분은 생각 보다 까다롭다.

## 스프링 부트 특징

## 자동 구성

스프링 부트는 많은 스프링 애플리케이션에 공통으로 필요한 애플리케이션 기능을 자동으로 구성해주었다.전통적인 스프링 애플리케이션에 있던 많은 보일러 플레이트 구성을 제거하였다.

#### 스프링 Framework 에서 Hello World 웹 애플리케이션을 개발한다고 하자.

* 필요한 의존성을 비롯한 메이븐이나 그레이들 빌드 파일이 완비된 프로젝트 구조, 적어도 스프링 MVC와 서블릿 API를 의존성으로 지정해야 한다.
* 스프링의 DispatcherServlet을 선언한 web.xml 파일 또는 WebApplicationInitializer 구현
* 스프링 MVC를 사용할 수 있는 스프링 구성
* HTTP 요청에 "Hello World"라고 응답할 컨트롤러 클래스
* 애플리케이션을 배포할 웹 애플리케이션 서버(톰캣 등)

> 보일러 플레이트 란?

보일러판(boilerplate)은 주간 신문들의 공통 기사나 진부하게 사용된 문장을 의미한다. 컴퓨터 프로그래밍에서 보일러판(boilerplate)은 작지만 대체할수 없고, 여러곳에 포함되어야 하는 코드 섹션을 설명하는 데 쓰이는 용어다. 이 용어는 verbose한 언어를 말할때 종종 사용한다. (예, 프로그래머가 매우 작은 일을 하기 위해서 많은 코드를 작성해야 하는 경우) 보일러플레이트의 사용은 메타 프로그래밍이나 convention over configuration같은 high-level 메커니즘을 통해서 줄일 수 있다. c 프로그램에서는 매우 자주 포함되는 라이브러리를 include하는 다음과 같은 코드들이다. #include \<stdlib.h> 스프링 부트 에서는 예를 들어, 템플릿엔진으로 Freemarker를 사용해야한다면 기존엔 ViewResolver를 Bean으로 등록하고, prefix, suffix를 설정해야 한다. 하지만 스프링 부트의 경우에는 해당하는 의존성을 추가하기만 하면 별도로 설정이 필요 없어진다. 출처: [http://julingks.tistory.com/entry/Boilerplate-code](http://julingks.tistory.com/entry/Boilerplate-code) \[My Tech Notes]

## 스타터 의존성

스프링 부트에 어떤 기능이 필요한지 알려주면 필요한 라이브러리를 빌드에 추가한다는 것을 보장한다. 명시적인 라이브러리 이름이나 버전 대신에 스프링 부트가 제공하는 기능으로 빌드 의존성을 지정할 수 있게 했다 예를 들어 스프링 프레임워크에서 REST API를 스프링 MVC로 만든다고 사정하자.

* org.springframework:spring-core
* org.springframework:spring-web
* org.springframework:spring-webmvc
* org.fasterxml.jackson.core:jackson-databind
* org.hibernate:hibernate-validator
* org.apache.tomcat.embed:tomcat-embed-core
* org.apache.tomcat.embed:tomcat-embed-el
* org.apache.tomcat.embed:tomcat-embed-logging-juli

그러나 스프링 부트 프레임워크에서는 spring-boot-starter-web 하나의 라이브러리만 추가하면 사용할 수 있다.

* org.springframework.boot:spring-boot-starter-web (다른 의존성을 전이적으로 모두 끌어오므로 의존성 전체를 일일이 추가할 필요가 없다.)

## 명령줄 인터페이스(CLI를 통한 구현)

스프링 부트의 이 부가 기능을 이용하면 애플리케이션 코드만 작성해도 완전한 애플리케이션을 개발할 수 있지만,기존 프로젝트 빌드 방식에는 필요 없는 기능이다. 명령줄에서 그루비를 사용하고 빠르고 간편하게 개발할 수 있게 하여 스프링 부트의 저항 없는 개발 모델을 완전히 새로운 수준으로 끌어올렸다.

## 액추에이터

작동 중인 애플리케이션 내부를 살펴보면서 스프링 부트가 어떤 식으로 처리하는지 알 수 있게 했다.

* 스프링 애플리케이션 컨텍스트에 구성된 빈
* 스프링 부트의 자동 구성으로 구성된 것
* 애플리케이션에서 사용할 수 있는 환경 변수, 시스템 프로퍼티, 구성 프로퍼티, 명령줄 인자
* 최근에 처리된 HTTP 요청 정보
* 메모리 사용량, 가비지 컬렉션, 웹 요청, 데이터 소스 사용량 등 다양한 메트릭 제공
