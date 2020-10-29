---
description: JOIN의 종류와 각각의 특징에 대해서 살펴보자
---

# JOIN

![](../../.gitbook/assets/sql_join.png)

## JOIN을 알아야 하는 이유

JOIN은 간단하게 설명하자면 두 테이블간의 연관 관계를 조합하여 하나의 결과 값으로 도출하는 쿼리문을 뜻한다. 그러나 JOIN문을 남용하거나 오용하게 되면 불필요한 데이터 조회를 하거나 의도하지 않은 결과값이 나올 수 있으므로 JOIN 문에 대한 이해가 필요하다.

## 테스트 환경 구축

JOIN에 대해서 알아보기에 앞서 JOIN문이 실제로 어떤 데이터를 도출하는지 확인하기 위해 로컬호스트에 테스트용 데이터 베이스를 생성하자. 테스트 용도 이므로 임시로 사용할 수 있도록 mysql은 도커 이미지를 사용하겠다.

```text
> docker run -d -p 3306:3306 -e MYSQL_ROOT_PASSWORD=password mysql:5.6
> docker ps
CONTAINER ID        IMAGE               COMMAND                  CREATED             STATUS              PORTS                    NAMES
c06d7b71762b        mysql:5.6           "docker-entrypoint.s…"   20 seconds ago      Up 19 seconds       0.0.0.0:3306->3306/tcp   sharp_feynman
```

도커 이미지를 실행 시킨 후 localhost의 mysql에 접근하여 데이터 베이스를 생성한다.

```text
> create database test; 
```

데이터 베이스가 생성되면 테스트로 사용할 두개의 테이블을 생성하고 dummy data를 넣어준다.

```text
// 데이터베이스 접속
use test;

// 테이블 생성
CREATE TABLE members (
    member_id INT AUTO_INCREMENT,
    name VARCHAR(100),
    PRIMARY KEY (member_id)
);

CREATE TABLE orders (
    order_id INT AUTO_INCREMENT,
    name VARCHAR(100),
    PRIMARY KEY (order_id)
);

// dummy data 입력
INSERT INTO members(name)
VALUES('John'),('Jane'),('Mary'),('David'),('Amelia');

INSERT INTO orders(name)
VALUES('John'),('Mary'),('Amelia'),('Joe');
```

## JOIN에 대해 알아보자

### 연관 관계를 나타내는 방법에는 두가지가 있다.

* 조인 컬럼 사용\(외래키\) : 연관 관계가 필요한 테이블에 식별자 필드\(외래키\)를 추가한다. 외래키에 null을 허용하므로 외부 조인을 사용해야 한다. 실수로 내부 조인을 사용하면 조회되지 않을 수 있다. 그리고 가끔 관계를 맺는다면 외래 키 값 대부분이 null로 저장되는 단점이 있다.
* 조인 테이블 사용\(테이블\) : 조인 테이블은 주로 다대다 관계를 일대다, 다대일 관계로 풀어내기 위해 사용한다. 조인 컬럼에 비해 관계가 필요한 정보만 데이터로 관리되기 때문에 불필요한 null 데이터를 저장할 필요가 없는 장점이 있으나 별도의 테이블을 관리해야 하고, 연관 관계 수정 시 항상 동기화를 해주어야 하는 단점이 있다.

### 명시적 조인\(Explicit Join\)과 암묵적 조인\(Implicit Join\)

명시적 조인 표현에서는 테이블간의 조인을 위해 JOIN 키워드를 사용하여 표현하는 것을 의미하고 암묵적 조인 표현은 SELECT 구문의 FROM 절에서 단순히 콤마\(,\)로 구분하여 조인관계를 표현한다.

## INNER JOIN

테이블간의 교집합인 일치하는 데이터만 추출한다.

```text
// 명시적 표현
SELECT *
FROM members as m
       inner join orders as o
                  on m.name = o.name

// 암묵적 표현
SELECT *
FROM members as m,
     orders as o
where m.name = o.name
```

### 결과 데이터

![](../../.gitbook/assets/111%20%2825%29.png)

## LEFT OUTER JOIN

FROM에 해당하는 테이블의 데이터와 조인된 테이블의 교집합을 표현한다.

```text

```

## CARTESIAN JOIN

두 테이블간의 곱집합을 표현한다. A 테이블의 데이터 갯수가 n 이고 B 케이블의 데이터 갯수가 m이면 결과 값은 n \* m 의 결과를 나타낸다.

```text
// 명시적 표현
SELECT *
FROM members as m
     cross join orders as o

// 암묵적 표현
SELECT *
FROM members as m, orders as o
```

### 결과 데이터

![](../../.gitbook/assets/222%20%2818%29.png)

## NATURAL JOIN

데이터베이스 내부적으로 두 테이블에서 동일한 컬럼명으로 데이터가 일치하는 결과값을 표현한다.

```text
SELECT *
FROM members NATURAL JOIN orders;
```

### 결과 데이터

![](../../.gitbook/assets/333%20%2812%29.png)

## NON-EQUI JOIN

동등 비교를 사용하지 않고 범위 등을 사용하여 결과값을 표현한다.

```text
SELECT *
FROM members, orders
WHERE orders.order_id between 1 and 2;
```

### 결과 데이터

![](../../.gitbook/assets/444%20%289%29.png)

## SELF JOIN

외부 테이블이 아닌 하나의 테이블을 중복으로 사용하여 두 테이블간의 연관관계를 표현한다.

```text
SELECT A.name AS memberName1, B.name AS memberName2
FROM members AS A,
     members AS B
WHERE A.member_id = B.member_id
  AND A.name = B.name
  AND A.member_id > 2;
```

### 결과 데이터

![](../../.gitbook/assets/555%20%284%29.png)

