---
description: AOP 전략에 대해 알아보자
---

# AOP

![AOP &#xC801;&#xC6A9; &#xBC29;&#xC2DD;](../../.gitbook/assets/321.png)

## AOP는 무엇인가?

AOP는 공통의 관심사\(aspect\)를 추상화해 잘 보관하고 있다가 필요한 곳에 동적으로 삽입하여 적용해주는 기술이다. 이로 인해 핵심 로직과 부가 기능을 분리할 수 있고 각각의 기능은 단일 책임을 가진 코드를 유지 할 수 있다.

### 핵심 로직과 부가 기능이 같이 있다면?

```java
public void upgradeLevels() throws Exception { 
    Transactionstatus status = this.transactionManager.getTransaction(new DefaultTransactionDefinition());
    try {
				// 비지니스 로직 구간
        List<User> users = userDao.getAll(); 
				for (User user : users) {
            if (canUpgradeLevel(user)) { upgradeLevel(user); } 
        }
        this.transactionManager.commit(status); 
				// 비지니스 로직 구간
    } catch (Exception e) {
        this.transactionManager.rollback(status) ;
        throw e; 
    }
}
```

외와 같은 코드가 전형적인 두 가지 기능을 가진 코드라고 할 수 있다. \(비즈니스 로직 + 트랜잭션 처리\)

#### 섞여 있는 코드는 어떤 부작용이 있을까?

* 두 가지 책임을 가지므로 하나의 책임에 인한 코드 수정은 다른 코드에 side effect가 발생할 수 있다.
* 두 가지 기능이 접목되어 있어 테스트 코드를 작성하려 할 때도 두가지 기능을 다 고려 해야 한다.
* 비즈니스 로직이 복잡하거나 부가 기능이 추가가 될 수록 유지보수 하기가 어려워 진다.
* 유지보수와 비슷한 맥락으로 기능을 확장하거나 다른 전략으로 기능을 변경하기도 어려워 진다.

### AOP를 적용한다면?

코드에는 핵심 로직만 남기고 부가 기능은 별도로 추상화하여 주입 받는 방식으로 리팩토링 할 수 있을 것이다.

대표적인 AOP 방식이 @Transactional 을 적용하는 것이다.

```java
@Transactional
public void upgradeLevels() throws Exception { 
    List<User> users = userDao.getAll(); 
		for (User user : users) {
        if (canUpgradeLevel(user)) { upgradeLevel(user); } 
    }
    this.transactionManager.commit(status); 
}
```

#### 코드를 분리하면 어떤 점이 좋을까?

* 메소드 또는 클래스는 한 책임을 가질 수 있는 코드를 작성할 수 있고 응집도 높은 코드를 작성할 수 있다.
* 테스트 코드 또한 비즈니스 로직에 대한 테스트 케이스만 작성하면 된다.
* 유지보수 측면에서도 비즈니스 로직 수정시에 부가 기능에 대한 side effect는 찾아 볼 수 없게 된다.

## AOP Weaving 전략

### 런타임 시\(RTW: Runtime Weaving\)

* Spring AOP에서 사용하는 방식
* Method 호출 시 위빙이 이루어지는 방식
* 포인트 컷에 대한 어드바이스 적용 갯수가 늘어 날수록 성능이 떨어진다는 단점이 있다.

### 컴파일 시\(CTW: Compile time Weaving\)

* AspectJ를 사용하는 방식
* 컴파일 과정에서 바이트 코드 조작을 통해 Advisor 코드를 직접 삽입하여 class 파일을 변환한다.
* 컴파일 과정에서 lombok과 같이 컴파일 과정에서 코드를 조작하는 플러그인과 충돌이 발생할 가능성이 높다.

### 클래스 로드 시\(LTW: Load time Weaving\)

* 클래스로더를 이용하여 JVM에 로드 될 때 바이트 코드 조작을 통해 위빙 되는 방식
* 오브젝트가 메모리에 올라가는 과정에서 위빙이 일어나기 때문에 런타임시, CTW보다 상대적으로 느리다.

### 어드바이스 종류는 무엇이 있을까?

* @Around : 타켓의 메서드가 호출되지 이전과 이후 시점에 모두 처리해야 할 때 사용한다.
* @Before : 타겟의 메서드가 실행되기 이전 시점에 사용한다.
* @AfterReturning : 타겟의 메서드가 정상적으로 실행된 이후 시점에 사용한다.
* @AfterThrowing : 타겟의 메서드가 예외를 발생된 이후 시점에 사용한다.
* @After : 타겟의 메서드가 예외 또는 정상적으로 실행된 경우 두 케이스 모든 시점에 사용한다.

### 프록시 패턴이란 무엇일까?

AOP에서 사용하는 프록시와 디자인 패턴의 프록시 패턴은 차이가 있다.

* 프록시 : 클라이언트와 사용 대상 사이에 대리 역할을 맡은 오브젝트 \(프록시는 프록시 패턴과 데코레이터 패턴을 모두 적용하고 있다\)
* 프록시 패턴 : 타깃에 대한 접근 방법을 제어하려는 목적

### 프록시 패턴과 데코레이터 패턴은 어떻게 구분할 수 있을까?

사용의 목적이 기능의 부가인지, 접근 제어인지를 구분해보면 각각 어떤 목적으로 프록시가 사용됐는지, 그에 따라 어떤 패턴이 적용됐는지 알 수 있다.

* 접근 제어 → 프록시 패턴
* 부가 기능 → 데코레이터 패턴

## 참고

* [https://skasha.tistory.com/45](https://skasha.tistory.com/45)
* [https://wbluke.tistory.com/17](https://wbluke.tistory.com/17)
* [https://jaehun2841.github.io/2018/07/22/2018-07-22-spring-aop4/\#aspectj란](https://jaehun2841.github.io/2018/07/22/2018-07-22-spring-aop4/#aspectj%EB%9E%80)

