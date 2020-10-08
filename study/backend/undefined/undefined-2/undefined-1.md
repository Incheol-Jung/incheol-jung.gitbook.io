---
description: 객체지향과 디자인 패턴(최범균 저) 템플릿 메서드 패턴 정리한 내용입니다.
---

# 템플릿 메서드 패턴

## 상황

로그인에 대한 인증 처리를 하려고 한다. 인증 처리 방법은 DB 데이터와 LDAP을 이용해서 처리할 수 있다. 인증 처리 방법을 선택하는 기준은 사용자에 따라 달라질 수 있다.

## 문제

DB 데이터와 LDAP을 이용해서 인증을 처리하는 로직에서 정보를 가져오는 부분의 구현만 다를 뿐 인증을 처리하는 과정은 완전히 동일할 수 있다. 두 클래스가 거의 유사한 코드를 갖게 될 것이다.

## 해결방법

실행 과정/단계는 동일한데 각 단계 중 일부의 구현이 다른 경우에 사용할 수 있는 패턴이 템플릿 메서드 패턴이다.

* 실행 과정을 구현한 상위 클래스
* 실행 과정의 일부 단계를 구현한 하위 클래스

```java
// 추상 메소드가 존재하는 상위 클래스를 정의한다. 
public abstract class Author {
    public Auth authenticate(String id, String pw) {
        if(!doAuthenticate(id, pw)) throw createException();
        return createAuth(id);
    }
    
    protected abstract boolean doAuthenticate(String id, String pw);
    protected abstract Auth createAuth(String id);
}

// 상위 클래스를 상속 받아 추상 메소드만 오버라이드 한다. 
public class LdapAutor extends Author {

    @Override
    protected boolean doAuthenticate(String id, String pw) {
        return ldapClient.authenticate(id, pw);
    }

    @Override
    protected Auth createAuth(String id) {
        LdapContext ctx = ldapClient.find(id);
        return new Auth(id, ctx.getAttributes("name"));
    }
}

// 사용자는 특정 구현체를 선택하여 로직을 수행한다. 
public static void main(String[] args) {
    Author author = new LdapAutor();
    author.authenticate("incheol", "password");
}
```

## 템플릿 메서드와 전략 패턴의 조합

템플릿 메서드와 전략 패턴을 함께 사용하면 상속이 아닌 조립의 방식으로 템플릿 메서드 패턴을 활용할 수 있는데, 대표적인 예가 스프링 프레임워크의 Template으로 끝나는 클래스들이다. 이 클래스들은 템플릿 메서드를 실행할 때, 변경되는 부분을 실행할 객체를 파라미터를 통해서 전달받는 방식으로 구현되어 있다.

```java
public <T> T execute(TransactionCallback<T> action) 
		throws TransactionException {
		// 일부 코드 생략
		TransactionStatus status = this.transactionManager.getTransaction(this);

		try {
				result = action.doInTransaction(status);
		} catch (RuntimeException ex) {
				rollbackOnException(status, ex);
				throw ex;
		}
		... // 기타 다른 익셉션 처리 코드
		return result;
}
```

* 앞서 템플릿 메서드가 하위 타입에서 재정의할 메서드를 호출하고 있다면
* TransactionTemplate의 execute\(\) 메서드는 파라미터로 전달받은 action의 메서드를 호출하고 있다.
* 따라서 TransactionTemplate의 execute\(\) 메서드를 사용하는 코드는 다음과 같이 execute\(\) 메서드를 호출할 때 원하는 기능을 구현한 TransactionCallback 객체를 전달한다.

```text
transactionTemplate.execute(new TransactionCallback<String>() {
		public String doInTransaction(TransactionStatus status) {
				// 트랜잭션 범위 안에서 실행될 코드
		}
});
```

