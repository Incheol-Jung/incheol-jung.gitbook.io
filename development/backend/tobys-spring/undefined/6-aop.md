---
description: 토비의 스프링 1권 6장을 요약한 내용 입니다.
---

# 6장 AOP

AOP를 바르게 이용하려면 OOP를 대체하려고 하는 것처럼 보이는 AOP라는 이름 뒤에 감춰진, 그 필연적인 등장배경과 스프링이 그것을 도입한 이유, 그 적용을 통해 얻을 수 있는 장점이 무엇인지에 대한 충분한 이해가 필요하다.

서비스 추상화를 통해 많은 근본적인 문제를 해결했던 트랜잭션 경계설정 기능을 AOP를 이용해 더욱 세련되고 깔끔한 방식으로 바꿔보자

## 트랜잭션 코드의 분리

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

이 두 가지 코드는 성격이 다를 뿐 아니라 서로 주고받는 것도 없는, 완벽하게 독립적인 코드다. 다만 이 비즈니스 로직을 담당하는 코드가 트랜잭션의 시작과 종료 작업 사이에서 수행돼야 한다는 상항만 지켜지면 된다.

두 가지 기능을 분리해서 메소드로 제공하는 방법도 있다.

```java
private void upgradeLevelsInternal() { 
    List<User> users = userDao.getAll(); 
    for (User user : users) {
        if (canUpgradeLevel(user)) { 
            upgradeLevel(user);
        } 
    }
}
```

비즈니스 로직 코드만 독립적인 메소드에 담겨 있으니 이해하기도 편하고, 수정하기에도 부담이 없다.

### DI를 이용한 클래스의 분리

리팩토링 했지만 트랜잭션 로직이 UserService 안에 자리 잡고 있다. 어차피 서로 직접적으로 정보를 주고받는 것이 없다면, 아예 트랜잭션 코드가 존재하지 않는 것처럼 사라지게 할 수는 없을까?

### DI 적용을 위한 트랜잭션 분리

DI의 기본 아이디어는 실제 사용할 오브젝트의 클래스 정체는 감춘 채 인터페이스를 통해 간적으로 접근하는 것이다. 그 덕분에 구현 클래스는 얼마든지 외부에서 변경할 수 있다.

![](../../../../.gitbook/assets/6-1%20%281%29.png)

그런데 보통 이렇게 인터페이스를 이용해 구현 클래스를 클라이언트에 노출하지 않고 런타임 시에 DI를 통해 적용하는 방법을 쓰는 이유는, 일반적으로 구현 클래스를 바꿔가면서 사용하기 위해서다.

#### 하지만 꼭 그래야 한다는 제약은 없다.

한 번에 두 개의 UserService 인터페이스 구현 클래스를 동시에 이용한다면 어떨까?

![](../../../../.gitbook/assets/6-2%20%281%29.png)

UserService를 구현한 또 다른 구현 클래스를 만든다. 이 클래스는 단지 트랜잭션의 경계설정이라는 책임을 맡고 있을 뿐이다. 스스로는 비즈니스 로직을 담고 있지 않기 때문에 또 다른 비즈니스 로직을 담고 있는 UserService의 구현 클래스에 실제적인 로직 처리 작업은 위임하는 것이다. 그 위임을 위한 호출 작업 이전과 이후에 적절한 트랜잭션 경계를 설정해주면, 클라이언트 입장에서 볼 때는 결국 트랜잭션이 적용된 비즈니스 로직의 구현이라는 기대하는 동작이 일어날 것이다.

### UserService 인터페이스 도입

```java
public interface UserService { 
    void add(User user); 
    void upgradeLevels();
}
```

```java
public class UserServicelmpl implements UserService { 
    UserDao userDao;
    MailSender mailSender;
    public void upgradeLevels() {

        List<User> users = userDao.getAll(); 
        for (User user : users) {
            if (canUpgradeLevel(user)) { 
                upgradeLevel(user);
            } 
        }
    }
}
```

UserServiceTx는 사용자 관리라는 비즈니스 로직을 전혀 갖지 않고 고스란히 다른 UserService 구현 오브젝트에 기능을 위임한다.

```java
public class UserServiceTx implements UserService { 
    UserService userService; PlatformTransactionManager transactionManager;
    public void setTransactionManager(PlatformTransactionManager transactionManager) {
        this.transactionManager = transactionManager; 
    }

    public void setUserService(UserService userService) { 
        this.userService = userService;
    }

    public void add(User user) { 
        this.userService.add(user);
    }

    public void upgradeLevels() {
        Transactionstatus status = this.transactionManager.getTransaction(new DefaultTransactionDefinitionO);
        try {
            userService.upgradeLevels();
            this.transactionManager.commit(status); 
        } catch (RuntimeException e) {
            this.transactionManager.rollback(status);
            throw e; 
        }
    }
}
```

### 트랜잭션 적용을 위한 DI 설정

클라이언트가 UserService라는 인터페이스를 통해 사용자 관리 로직을 이용하려고 할 때 먼저 트랜잭션을 담당하는 오브젝트가 사용돼서 트랜잭션에 관련된 작업을 진행해주고, 실제 사용자 관리 로직을 담은 오브젝트가 이후에 호출돼서 비즈니스 로직에 관련된 작업을 수행하도록 만든다.

![](../../../../.gitbook/assets/6-3%20%281%29.png)

## 고립된 단위 테스트

UserService의 구현 클래스들이 동작하려면 세 가지 타입의 의존 오브젝트가 필요하다. UserDao 타입의 오브젝트를 통해 DB와 데이터를 주고받아야 하고, MailSender를 구현한 오브젝트를 이용해 메일을 발송해야 한다. 마지막으로 트랜잭션 처리를 위해 PlatformTransactionManager와 커뮤니케이션이 필요하다.

![](../../../../.gitbook/assets/6-4%20%281%29.png)

이제 UserServiceImple에 대한 테스트가 진행될 때 사전에 테스트를 위해 준비된 동작만 하도록 만든 두 개의 목 오브젝트에만 의존하는, 완벽하게 고립된 테스트 대상으로 만들 수 있다.

![](../../../../.gitbook/assets/6-5%20%281%29.png)

### 단위 테스트와 통합 테스트

단위 테스트의 단위는 정하기 나름이다. 테스트 대역을 이용해 의존 오브젝트나 외부의 리소스를 사용하지 않도록 고립시켜서 테스트하는 것을 단위 테스트라고 부르겠다. 반면에 두 개 이상의, 성격이나 계층이 다른 오브젝트가 연동하도록 만들어 테스트하거나, 또는 외부의 DB나 파일, 서비스 등의 리소스가 참여하는 테스트는 통합 테스트라고 부른다.

### 목 프레임워크

단위 테스트가 많은 장점이 있고 가장 우선시해야 할 테스트 방법인 건 사실이지만 작성이 번거롭다는 점이 문제다. 특히 목 오브젝트를 만드는 일이 가장 큰 짐이다. 그래서 이를 도와주는 다양한 목 오브젝트 지원 프레임워크가 있다.

#### Mockito 프레임워크

Mockito라는 프레임워크는 사용하기도 편리하고, 코드도 직관적이라 퇴근 많은 인기를 끌고 있다.

* mock\(\) : 목 오브젝트를 생성하기 위한 메소드로 스태틱 임포트를 사용해 로컬 메소드 처럼 호출하게 하면 편리하다.

  ```text
  UserDao mockUserDao = mock(UserDao.class);
  ```

* when\(\) : mock으로 생성된 인스턴스는 아직 아무런 동작도 하지 않는다. mock 객체의 메소드에 필요한 mock을 주입하기 위해서는 when 메소드로 설정해주어야 한다.

  ```text
  when(mockUserDao.getAll()).thenReturn(this.users);
  ```

* verify\(\) : 목 객체의 메소드가 호출되었는지 확인할 수 있다.

  ```text
  verify(mockUserDao, tiems(2)).update(any(User.class));
  ```

## 다이내믹 프록시와 팩토리 빈

### 프록시와 프록시 패턴, 데코레이터 패턴

트랜잭션 경계설정 코드를 비즈니스 로직 코드에서 분리해낼 때 적용했던 기법을 다시 검토해보자.

![](../../../../.gitbook/assets/6-6%20%281%29.png)

트랜잭션이라는 기능은 사용자 관리 비즈니스 로직과는 성격이 다르기 때문에 아예 그 적용 사실 자체를 밖으로 분리할 수 있다. 이 방법을 이용해 UserServiceTx를 만들었고, UserServiceImpl에는 트랜잭션 관련 코드가 하나도 남지 않게 됐다.

![](../../../../.gitbook/assets/6-7%20%281%29.png)

부가기능 외의 나머지 모든 기능은 원래 핵심기능을 가진 클래스로 위임해줘야 한다. 핵심기능은 부가기능을 가진 클래스의 존재 자체를 모른다. 문제는 이렇게 구성했더라도 클라이언트가 핵심기능을 가진 클래스를 직접 사용해버리면 부가기능이 적용될 기회가 없다는 점이다. 그래서 부가기능은 마치 자신이 핵심 기능을 가진 클래스인 것처럼 꾸며서, 클라이언트가 자신을 거쳐서 핵심기능을 사용하도록 만들어야 한다.

클라이언트는 인터페이스를 통해서만 핵심기능을 사용하게 하고, 부가기능 자신도 같은 인터페이스를 구현한 뒤에 자신이 그 사이에 끼어들어야 한다.

![](../../../../.gitbook/assets/6-8%20%281%29.png)

이렇게 마치 자신이 클라이언트가 사용하려고 하는 실제 대상인 것처럼 위장해서 클라이언트의 요청을 받아주는 것을 대리자, 대리인과 같은 역할을 한다고 해서 프록시\(rpoxy\)라고 부른다. 프록시를 통해 최종적으로 요청을 위임받아 처리하는 실제 오브젝트를 타깃 또는 실체라고 부른다.

#### 프록시 사용 목적

* 클라이언트가 타깃에 접근하는 방법을 제어하기 위한 목적이 있다.
* 타깃에 부가적인 기능을 부여해주기 위한 목적이 있다.

두 가지 모두 대리 오브젝트라는 개념의 프록시를 두고 사용한다는 점은 동일하지만, 목적에 따라서 디자인 패턴에서는 다른 패턴으로 구분한다.

### 데코레이터 패턴

데코레이터 패턴은 타깃에 부가적인 기능을 런타임 시 다이내믹하게 부여해주기 위해 프록시를 사용하는 패턴을 말한다. 코드상에서는 어떤 방법과 순서로 프록시와 타깃이 연결되어 사용되는지 정해져 있지 않다는 뜻이다.

![](../../../../.gitbook/assets/6-9.png)

자바 IO 패키지의 InputStream과 OutputStream 구현 클래스는 데코레이터 패턴이 사용된 대표적인 예다.

```java
InputStream is = new BufferedInputStream(new FileInputStream("a.txt"));
```

### 프록시 패턴

일반적으로 사용하는 프록시라는 용어와 디자인 패턴에서 말하는 프록시 패턴은 구분할 필요가 있다. 전자는 클라이언트와 사용 대상 사이에 대리 역할을 맡은 오브젝트를 두는 방법을 총칭한다면, 후자는 프록시를 사용하는 방법 중에서 타깃에 대한 접근 방법을 제어하려는 목적을 가진 경우를 가리킨다.

타깃 오브젝트를 생성하기가 복잡하거나 당장 필요하지 않은 경우에는 꼭 필요한 시점까지 오브젝트를 생성하지 않는 편이 좋다. 그런데 타깃 오브젝트에 대한 레퍼런스가 미리 필요할 수 있다. 이럴 때 프록시 패턴을 적용하면 된다.

또는 특별한 상황에서 타깃에 대한 접근권한을 제어하기 위해 프록시 패턴을 사용할 수 있다. 프록시의 특정 메소드를 사용하려고 하면 접근이 불가능하다고 예외를 발생시키면 된다.

이렇게 프록시 패턴은 타깃의 기능 자체에는 관여하지 않으면서 접근하는 방법을 제어해주는 프록시를 이용하는 것이다.

![](../../../../.gitbook/assets/6-10.png)

### 다이내믹 프록시

많은 개발자는 타깃 코드를 직접 고치고 말지 번거롭게 프록시를 만들지는 않겠다고 생각한다. 왜냐하면 프록시를 만드는 일이 상당히 번거롭게 느껴지기 때문이다.

자바에는 이런 부분을 해결하기 위해 java.lang.reflect 패키지 안에 프록시를 손쉽게 만들 수 있도록 지원해주는 클래스들이 있다.

#### 프록시의 구성과 프록시 작성의 문제점

* 타깃의 인터페이스를 구현하고 위임하는 코드를 작성하기가 번거롭다는 점이다. 부가기능이 필요 없는 메소드도 구현해서 타깃으로 위임하는 코드를 일일이 만들어줘야 한다.
* 부가기능 코드가 중복될 가능성이 만다는 점이다. 트랜잭션은 DB를 사용하는 대부분의 로직에 적용될 필요가 있다. 메소드가 많아지고 트랜잭션 적용의 비율이 높아지면 트랜잭션 기능을 제공하는 유사한 코드가 여러 메소드에 중복돼서 나타날 것이다.

두 번째 문제는 중복된 코드를 분리해서 어떻게든 해결해보면 될 것 같지만, 첫 번째 문제인 인터페이스 메소드의 구현과 위임 기능 문제는 간단해 보이지 않는다. 바로 이런 문제를 해결하는 데 유용한 것이 바로 JDK의 다이내믹 프록시다.

### 리플렉션

다이내믹 프록시는 리플렉션 기능을 이용해서 프록시를 만들어준다. 자바의 모든 클래스는 그 클래스 자체의 구성정보를 담은 Class 타입의 오브젝트를 하나씩 갖고 있다. 클래스 오브젝트를 이용하면 클래스 코드에 대한 메타정보를 가져오거나 오브젝트를 조작할 수 있다.

```java
Method lengthMethod = String.class.getMethod("length");
int length = lengthMethod.invoke(name); // int length = name.length();
```

invoke\(\) 메소드는 메소드를 실행시킬 대상 오브젝트와 파라미터 목록을 받아서 메소드를 호출한 뒤에 그 결과를 Object 타입으로 돌려준다.

### 다이나믹 프록시 적용

다이나믹 프록시는 프록시 팩토리에 의해 런타임 시 다이내믹하게 만들어지는 오브젝트다. 다이내믹 프록시 오브젝트는 타깃의 인터페이스와 같은 타입으로 만들어진다. 프록시 팩토리에게 인터페이스 정보만 제공해주면 해당 인터페이스를 구현한 클래스의 오브젝트를 자동으로 만들어주기 때문이다.

리플렉션으로 메소드와 파라미터 정보를 모두 갖고 있으므로 타깃 오브젝트의 메소드를 호출하게 할 수도 있다.

![](../../../../.gitbook/assets/6-11.png)

다이내믹 프록시를 통해 요청이 전달되면 리플렉션 API를 이용해 타깃 오브젝트의 메소드를 호출한다.

```java
public class UppercaseHandler implements InvocationHandler {
    Hello target;

    public UppercaseHandler(Hello target) { 
        this.target = target;
    }

    public Object invoke(Object proxy, Method method, Object!] args) throws Throwable {
        String ret = (String)method.invoke(target, args);
        return ret.toUpperCase();
    }
}
```

다음은 다이내믹 프록시를 생성하는 코드다.

```java
Hello proxiedHello = (Hello)Proxy.newProxyInstance( 
    getClass().getClassLoader(), // 동적으로 생성되는 다이내믹 프록시 클래스의 로딩에 사용할 클래스 로더
    new Class[] {Hello.class}, // 구현할 인터페이스
    new UppercaseHandler (new HelloTarget()));
```

### 프록시 팩토리 빈 방식의 장점과 한계

이전까지는 하나의 클래스 안에 존재하는 여러 개의 메소드에 부가기능을 한 번에 제공하는 건 어렵지 않게 가능했다. 하지만 한 번에 여러 개의 클래스에 공통적인 부가기능을 제공하는 일은 지금까지 살펴본 방법으로는 불가능하다.

트랜잭션, 보안, 로그 등 다양한 프록시 기능을 추가하고 싶을 경우에는 인터페이스만 다른 거의 비슷한 설정이 반복될것이다. 또한 TransactionHandler 오브젝트가 프록시 팩토리 빈 개수만큼 만들어진다는 점이다.

TransactionHandler의 중복을 없애고 모든 타깃에 적용 가능한 싱글톤 빈으로 만들어서 적용할 수는 없을까?

