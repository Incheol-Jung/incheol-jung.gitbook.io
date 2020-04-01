---
layout: reference
title: "SPRING MVC"
date: 2018-02-05 00:00:00
categories: spring
summary: spring mvc
navigation_weight: 3
---

### POM.xml

- 포함된 내용 : project information, dependencies, plugins, repositories
- properties : 상수형 변수 설정할 때 사용
- repositories : 실제 라이브러리를 다운받을 저장소를 의미 (보통은 따로 설정할 필요가 없지만 프로젝트를 진행하다보면 인터넷에 연결할 수 없는 프로젝트도 상당히 많은데, 이럴때 내부 저장소를 만들어놓고 개발자들은 내부저장소에서 라이브러리를 다운받도록 되어있다.)
- dependencies : 실제 라이브러리 정보들을 정의한다.
  그리고 또한 scope을 정의하여 어느 scope에서 사용할지를 정의할 수 있다.
  1. compile : default, 컴파일할 경우에 해당 라이브러리가 필요하다는 의미이다.
  2. provided : 이 옵션은 compile과 매우 비슷하지만, 실행시 의존관계를 제공하는 JDK나 Web Container(tomcat 같은)에 대해서 적용된다. 예를 들어 Java Enterprise Edition Web application을 개발할때 Servlet API나 Java EE API들은 "provided" scope로 지정해야한다. 왜냐하면 Servlet API같은 경우는 Servlet Container 자체에서 지원해 주기 때문에(Tomcat 같은 경우는 \${tomcat home directory}/lib 디렉토리에 있는 Servlet 라이브러리를 사용) 컴파일시 또는 테스트시에는 필요하지만 실행시에는 필요하지 않기 때문이다.
  3. test : test를 위해서만 라이브러리를 사용한다는 의미이다.
  4. runtime : 런타임시에 라이브러리를 사용한다는 의미이다.
  5. system : 해당 jar를 포함해야 한다고 명시적으로 입력 하는 것을 제외하고는 provided와 유사하다. 선언된 artifact들은 항상 사용가능하지만 Maven의 central repository에서 찾아서 가져오는 것은 아니다.
  6. import : Maven 2.0.9 이상의 버전에서 지원하는 scope로서, 이 scope는 <dependencyManagement> 섹션에서 pom의 의존관계에 대해 사용된다. 지정된 pom이 해당 pom의 <dependencyManagement> 영역에 있는 의존관계로 대체됨을 뜻한다.

### /src/main/resources

#### applicationContext-dao-config.xml

- Bean 설정 : transactionManager, hibernateSessionFactory (하나의 bean으로 multi database를 구성할 수는 없을까?! - 확인해보기)
- AOP 설정

* transactionManager : localsessionfactorybean을 사용하여 db connection이 이루어졌다면 그 이후에 crud를 하도록 transaction을 구현한 manager
* LocalSessionFactoryBean : 데이터베이스와의 연결을 위한 bean 구성
* AOP : Aspect Orientied Programming(관점지향언어) 시스템 전반에 산재하여 같은 목적이나 용도로 쓰이고 있는 기능을 Cross Cutting Concerns이라 하며, 관련된 코드를 한데모아 모듈화하여 핵심 로직 으로부터 분리하고 개발하는 방식을 AOP라 한다.

#### applicationContext-datasource.xml

- Connection pool data source bean configuration(Reference : http://www.mchange.com/projects/c3p0/#configuration)
- 2개 이상의 data connection이 있을 경우 각각 셋업을 해주어야 하는가?

#### applicationContext-redis.xml

- Redis관련된 bean 설정 : jedisConfig, jedisConnFactory, redisTemplate, cacheManager

* Redis : Remote Dictionary Server(휘발성이면서 영속성을 가진 Key-value 저장소)
* No SQL : 데이터 간의 관계를 정의하지 않고 고정된 스키마를 갖지 않는 새로운 형태의 데이터베이스 (Redis는 이러한 noSQL의 종류 중 하나이다.)
* Jedis : Redis는 C부터 Scala까지 다양한 언어별로 client 링크를 제공해주고 있다. 그 중 java관련해서 Redis에서 추천하는 클라이언트로 github를 통해서 소스를 제공하고 있다.
* JedisConfig Properties 문서 : jedis properties 설정 http://biasedbit.com/blog/redis-jedispool-configuration/
* jedisConnFactory : jedis 접속 설정 (FGRedisSentinelConfiguration, project-data 참고 할것)
* redisTemplate : redis connection 설정 정보
* cacheManager(RedisCacheManager) : 당순히 캐쉬에 대한 설정을 유지하는 클래스로 실제 데이터에 대한 CRUD는 RedisCache가 관장하게 된다.
