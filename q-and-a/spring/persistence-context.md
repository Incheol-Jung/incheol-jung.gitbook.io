---
description: 영속성 컨텍스트에 대해 알아보자
---

# 영속성 컨텍스트(Persistence Context)

![https://ultrakain.gitbooks.io/jpa/content/chapter3/chapter3.4.html](../../.gitbook/assets/jpa\_3\_7.png)

## 영속성 컨텍스트란?

* Server side와 Database 사이에 엔티티를 저장하는 논리적인 영역이라고 할 수 있다. 엔티티 매니저로 엔티티를 저장하거나 조회하면 엔티티 매니저는 영속성 컨텍스트에 엔티티를 보관하고 관리한다.
* 영속성 컨텍스트는 엔티티 매니저(Session)를 생성할 때 하나 만들어진다. 그리고 엔티티 매니저(Session)을 통해서 영속성 컨텍스트에 접근할 수 있고 영속성 컨텍스트를 관리할 수 있다.

## **영속성 컨텍스트가 엔티티를 관리하면 얻게되는 장점**

### **1차 캐시**

* Map 객체로 저장 : 엔티티를 식별자 값(@Id 맵핑)으로 구분한다. Key-value로 관리하는데 이때 key 값이 @Id 값이 된다.
* 식별자 값 필요 : 영속상태의 엔티티는 반드시 식별자 값이 있어야 한다.

{% hint style="info" %}
#### Q1. 1차 캐시를 사용하면 한 가지 기능을 두개의 트랜잭션으로 처리할 경우?

* OSIV를 사용하여 영속성 컨텍스트의 데이터를 공유한다.
{% endhint %}



{% hint style="info" %}
#### Q2. 2차 캐시는 언제 사용하나?

하이버네이트가 지원하는 캐시는 크게 3가지가 있다.

* 엔티티 캐시 : 엔티티 단위로 캐시한다. 식별자로 엔티티를 조회하거나 컬렉션이 아닌 연관된 엔티티를 로딩할 때 사용한다.
* 컬렉션 캐시 : 엔티티와 연관된 컬렉션을 캐시한다. 컬렉션이 엔티티를 담고 있으면 식별자 값만 캐시한다. (하이버네이트 기능)
  * 문제는 쿼리 캐시나 컬렉션 캐시만 사용하고 대상 엔티티에 엔티티 캐시를 적용하지 않으면 성능상 심각한 문제가 발생할 수 있다.
    * “select m from Member m” 쿼리를 실행했는데 쿼리 캐시가 적용되어 있다. 결과 집합은 100건이다.
    * 결과 집합에는 식별자만 있으므로 한 건씩 엔티티 캐시 영역에서 조회한다.
    * Member 엔티티는 엔티티 캐시를 사용하지 않으므로 한 건씩 데이터베이스에서 조회한다.
    * 결국 100건의 SQL이 실행된다.
* 쿼리 캐시 : 쿼리와 파라미터 정보를 키로 사용해서 캐시한다. 결과가 엔티티면 식별자 값만 캐시한다. (하이버네이트 기능)
{% endhint %}



### **동일성 보장**

* 동일한 객체 반환 : Collection에서 객체를 빼오듯이 같은 객체를 반환하게 되면 새로운 객체가 나오는 것이 아니라 동일한 객체가 반환된다.



{% hint style="info" %}
#### Q3. JPQL을 사용하게 되면 기존 영속성 컨텍스트의 데이터는 갱신되나?

**변경 감지**

* 자동 Update : 영속성 상태의 객체는 객체의 데이터가 변경이 되면, 자동 update 된다.
* EntityManager에서 flush가 되고, commit이 됩니다.
* flush가 되는 시점
  1. 강제 Flush : EntityManager.flush()
  2. 트랜잭션 종료시 : 영속성 컨텍스트는 트랜잭션 범위로 만들어지기 때문이다.
  3. JPQL 쿼리 실행 : JPQL은 실제 Database side에서 데이터를 가져오기 때문에 동기화를 위해 JPQL 쿼리가 실행 전에 flush 된다.
{% endhint %}



### **트랜잭션으로 인한 쓰기 지연**

* 쓰기 지연 : 영속성 컨텍스트는 트랜잭션 범위 안에서 동작한다. 그래서 트랜잭션이 끝나야 Commit이 이루어지고 반영된다.

### **Lazy 로딩**

* 엔티티와 관계가 맺어진 엔티티의 데이터를 가져올 수 있다.
* 성능저하의 원인이 될 수도 있다.

## 참고

* [https://ultrakain.gitbooks.io/jpa/content/chapter1/chapter1.2.html](https://ultrakain.gitbooks.io/jpa/content/chapter1/chapter1.2.html)
* [https://victorydntmd.tistory.com/207](https://victorydntmd.tistory.com/207)
* [https://velog.io/@conatuseus/영속성-컨텍스트-2-ipk07xrnoe](https://velog.io/@conatuseus/%EC%98%81%EC%86%8D%EC%84%B1-%EC%BB%A8%ED%85%8D%EC%8A%A4%ED%8A%B8-2-ipk07xrnoe)
* [https://jhkang-tech.tistory.com/68](https://jhkang-tech.tistory.com/68)
