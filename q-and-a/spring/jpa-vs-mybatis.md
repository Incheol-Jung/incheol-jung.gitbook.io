---
description: JPA와 MyBatis의 차이를 알아보자
---

# JPA vs MyBatis

![](../../.gitbook/assets/jpa-mybatis-google-2020-09-25-01-30-57.png)

## JPA

Java Persistence API의 약자로 Java ORM 기술에 대한 API 표준 명세를 말한다. JPA는 단순한 명세이기 때문에 JPA만 가지고는 어떤 구현 기술을 사용할 수 없다. 실제로 우리가 사용하는 Repository는 Spring Data JPA로 부터 제공되는 기술이다. Spring Data JPA는 JPA를 간편하게 사용하도록 만들어놓은 오픈 소스일 뿐이다. 이와 비슷한 기술로 Spring Data JPA, Spring Data Redis, Spring Data MongoDB 등과 같은 다양한 라이브러리가 존재 한다. 그리고 JPA를 사용하다 보면 Hibernate를 많이 사용하게 되는데 Hibernate는 JPA의 구현체라고 할 수 있다. Hibernate 이외에도 DataNucleus, EclipseLink 등 다양한 JPA 구현체가 존재한다. 그래도 우리가 Hibernate를 사용하는 것은 가장 범용적으로 다양한 기능을 제공하기 때문이다.

### 장점

* 1차캐시, 쓰기지연, 변경감지, 지연로딩을 제공하여 성능상 이점을 얻을 수 있다.
* 코드 레벨로 관리 되므로 사용하기 용이하고 생산성이 높다.
* 컴파일 타임에 오류를 확인할 수 있다.
* 데이터베이스에 종속적이지 않으므로 특정 쿼리를 사용하지 않아 추상적으로 기술 구현이 가능하다.
* 엔티티로 관리되므로 스키마 변경시 엔티티만 수정하게 되면 엔티티를 사용하는 관련 쿼리는 자동으로 변경된 내역이 반영된다.
* 개발 초기에는 쿼리에 대한 이해가 부족해도 코드 레벨로 어느 정도 커버가 가능하다.
* 객체지향적으로 데이터를 관리할 수 있다.
* 부족한 부분은 다양한 쿼리 빌더와 호환하여 보안할 수 있다.

### 단점

* JPA만 사용하여 복잡한 연산을 수행하기에는 다소 무리가 있다. \(로직이 복잡하거나 불필요한 쿼리가 발생할 수 있다.\)
* 초기에는 생산성이 높을 수 있으나 점차 사용하다 보면 성능상 이슈가 발생할 수 있다.\(N+1, FetchType, Proxy, 연관관계\)
* 고도화 될수록 학습 곡선이 높아질 수 있다. \(성능 이슈의 연장선으로 해결 방안에 따라 복잡한 내부 로직을 이해해야 할 필요가 있다\)

## MyBatis

사실상 MyBatis와 JPA는 비교 대상이 되지 않을 수 있다. 왜냐하면 JPA는 ORM 기술로 분류되고, MyBatis는 SQL Builder 또는 SQL Mapper의 한 종류이기 때문이다. MyBatis는 원래 Apache Foundation의 iBatis였으나, 생산성, 개발 프로세스, 커뮤니티 등의 이유로 Google Code로 이전되면서 이름이 변경되었다. MyBatis는 record에 원시 타입과 Map 인터페이스, 그리고 자바 POJO를 설정해서 매핑하기 위해 xml과 Annotation을 사용할 수 있다.

### 장점

* SQL 쿼리를 직접 작성하므로 최적화된 쿼리를 구현할 수 있다.
* 엔티티에 종속받지 않고 다양한 테이블을 조합할 수 있다.
* 복잡한 쿼리도 SQL 쿼리만 작성할 수 있다면 손쉽게 작성할 수 있다.

### 단점

* 스키마 변경시 SQL 쿼리를 직접 수정해주어야 한다.
* 반복된 쿼리가 발생하여 반복 작업이 있다.
* 런타임시에 오류를 확인할 수 있다.
* 쿼리를 직접 작성하기 때문에 데이터베이스에 종속된 쿼리문이 발생할 수 있다. 데이터베이스 변경시 로직도 함께 수정해주어야 한다.

## 결론

JPA는 만능이 아니다. 처음엔 사용하기 쉬울지 몰라도 점차 애플리케이션이 고도화된다면 오히려 더 손이 많이 가는 경우가 많다. 그렇기 때문에 JPA와 함께 문제점을 보완해 줄 수 있는 다른 라이브러리가 필요하다. 그 중에 하나가 Mybatis가 될 수 있다. 이 둘을 적절히 혼용하여 사용한다면 안정적인 서비스를 제공할 수 있다.

## 참고

* [https://sugerent.tistory.com/569](https://sugerent.tistory.com/569)
* [https://medium.com/an-idea/spring-boot-spring-data-jpa-vs-mybatis-514d969648ee](https://medium.com/an-idea/spring-boot-spring-data-jpa-vs-mybatis-514d969648ee)
* [https://sugerent.tistory.com/569](https://sugerent.tistory.com/569)
* [https://dreaming-soohyun.tistory.com/entry/JPA와-MyBatis의-차이-ORM과-SQL-Mapper](https://dreaming-soohyun.tistory.com/entry/JPA%EC%99%80-MyBatis%EC%9D%98-%EC%B0%A8%EC%9D%B4-ORM%EA%B3%BC-SQL-Mapper)
* [https://velog.io/@leeinae/Spring-Mybatis-JPA-Hibernate-비교](https://velog.io/@leeinae/Spring-Mybatis-JPA-Hibernate-%EB%B9%84%EA%B5%90)

