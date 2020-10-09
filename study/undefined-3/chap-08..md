---
description: 테스트 주도 개발 시작하기 8장을 요약한 내용입니다.
---

# CHAP 08. 테스트 가능한 설계

## 테스트가 어려운 코드

모든 코드를 테스트할 수 있는 것은 아니다. 개발을 진행하다 보면 테스트하기 어려운 코드를 만나게 된다.

### 하드 코딩된 경로

```text
public class PaySync {
    private PayInfoDao payInfoDao = new PayInfoDao();

    public void sync() throws IOException {
        Path path = Paths.get("/data/pay/cp0001.csv");
        List<PayInfo> payInfos = Files.lines(path)
        ...
    }
}
```

이 코드에서 파일 경로가 하드 코딩되어 있다. 이 코드를 테스트하려면 해당 경로에 파일이 반드시 위치해야 한다. 만약 윈도우에 D 드라이브가 없다면 테스트를 할 수 없다. 하드 코딩된 경로뿐만 아니라 하드 코딩된 IP 주소, 포트 번호도 테스트를 어렵게 만든다.

### 의존 객체를 직접 생성

테스트를 어렵게 만드는 또 다른 요인은 의존 대상을 직접 생성하고 있다는 점이다.

```text
public class PaySync {
    private PayInfoDao payInfoDao = new PayInfoDao();
		...
}
```

이 코드를 테스트하려면 PayInfoDao가 올바르게 동작하는데 필요한 모든 환경을 구성해야 한다. DB를 준비해야 하고 필요한 테이블도 만들어야 한다.

### 정적 메서드 사용

정적 메서드를 사용해도 테스트가 어려워질 수 있다.

```text
public class LoginService {
    private String authKey = "somekey";
    private CustomerRepository customerRepo;

    public LoginService(CustomerRepository customerRepo) {
        this.customerRepo = customerRepo;
    }

    public LoginResult login(String id, String pw) {
        int resp = 0;
        boolean authorized = AuthUtil.authorize(authKey);
        if (authorized) {
            resp = AuthUtil.authenticate(id, pw);
				...
		}
}
```

AuthUtil 클래스가 인증 서버와 통신하는 경우 이 코드를 테스트하려면 동작하고 있는 인증 서버가 필요하다. AuthUtil 클래스가 통신할 인증 서버 정보를 시스템 프로퍼티에서 가져온다면 시스템 프로피티도 테스트 환경에 맞게 설정해야 한다.

### 실행 시점에 따라 달라지는 결과

```text
public int calculatePoint(User u) {
    Subscription s = subscriptionDao.selectByUser(u.getId());
    if (s == null) throw new NoSubscriptionException();
    Product p = productDao.selectById(s.getProductId());
    LocalDate now = LocalDate.now();
    int point = 0;
    if (s.isFinished(now)) {
        point += p.getDefaultPoint();
    } else {
        point += p.getDefaultPoint() + 10;
    }
		...
}
```

같은 테스트 코드라도 LocalDate.now\(\)에 따라 실행 결과가 달라진다. 어제까지는 문제 없이 성공하던 테스트가 오늘은 깨질 수 있는 것이다. 이는 Random을 이용해서 임의 값을 사용하는 코드도 비슷하다. 이렇게 테스트를 실행하는 시점에 따라 테스트 결과가 달라진다면 그 테스트는 믿을 수 없게 된다.

### 역할이 섞여 있는 코드

여러 역할이 섞여 있는 코드는 특정 기능만 테스트하기가 쉽지 않다. 특정 기능만 따로 테스트하기 위해서는 테스트 기능에 필요한 의존 관계 있는 대역을 알맞게 설정해야만 테스트가 가능하다.

### 그외 테스트가 어려운 코드

이 외에 테스트 대상이 다음과 같다면 테스트가 어려울 수 있다.

* 메서드 중간에 소켓 통신 코드가 포함되어 있다.
* 콘솔에서 입력을 받거나 결과를 콘솔에 출력한다.
* 테스트 대상이 사용하는 의존 대상 클래스나 메서드가 final이다. 이 경우 대역으로 대체가 어려울 수 있다.
* 테스트 대상의 소스를 소유하고 있지 않아 수정이 어렵다.

## 테스트 가능한 설계

테스트가 어려운 주된 이유는 의존하는 코드를 교체할 수 있는 수단이 없기 때문이다. 상황에 따라 알맞은 방법을 적용하면 의존 코드를 교체할 수 있게 만들 수 있다.

### 하드 코딩된 상수를 생성자나 메서드 파라미터로 받기

하드 코딩된 상수 때문에 테스트가 힘들다면 해당 상수를 교체할 수 있는 기능을 추가하면 된다. 쉬운 방법은 생성자나 세터를 이용해서 결로를 전달받는 것이다.

```text
public class PaySync {
    private PayInfoDao payInfoDao = new PayInfoDao();
    private String filePath = "D:\\\\data\\\\pay\\\\cp0001.csv";

    public void setPayInfoDao(PayInfoDao payInfoDao) {
        this.payInfoDao = payInfoDao;
    }

    public void setFilePath(String filePath) {
        this.filePath = filePath;
    }
		...
}
```

### 의존 대상을 주입 받기

의존 대상은 주입 받을 수 있는 수단을 제공해서 교체할 수 있도록 한다. 생성자나 세터를 수집수단으로 이용하면 된다. 이전의 해결방법과 동일한 코드로 작성하면 된다.

### 테스트하고 싶은 코드를 분리하기

특정 기능을 테스트하려면 다른 객체의 의존성이 필요하고 상태값도 필요하다. 테스트하고 싶은 코드와 별도로 다양한 사전작업이 필요한 경우가 있다. 이렇게 기능의 일부만 테스트하고 싶다면 해당 코드를 별도 기능으로 분리해서 테스트를 진행할 수 있다.

### 시간이나 임의 값 생성 기능 분리하기

테스트 대상이 시간이나 임의 값을 사용하면 테스트 시점에 따라 테스트 결과가 달라진다. 이 경우 테스트 대상이 사용하는 시간이나 임의 값을 제공하는 기능을 별도로 분리해서 테스트 가능성을 높일 수 있다.

### 외부 라이브러리는 직접 사용하지 말고 감싸서 사용하기

테스트 대상이 사용하는 외부 라이브러리를 쉽게 대체할 수 없는 경우도 있다. 외부 라이브러리가 정적 메서드를 제공한다면 대체할 수 없다.

대역으로 대체하기 어려운 외부 라이브러리가 있다면 외부 라이브러리를 직접 사용하지 말고 외부 라이브러리와 연동하기 위한 타입을 따로 만든다. 그리고 테스트 대상은 이렇게 분리한 타입을 사용하게 바꾼다.

```text
// 변경 전 코드
public class LoginService {
    private String authKey = "somekey";
    private CustomerRepository customerRepo;

    public LoginService(CustomerRepository customerRepo) {
        this.customerRepo = customerRepo;
    }

    public LoginResult login(String id, String pw) {
        int resp = 0;
        boolean authorized = AuthUtil.authorize(authKey); // 대체 불가능한 외부 라이브러리
        if (authorized) {
            resp = AuthUtil.authenticate(id, pw);
				...
		}
}

// 변경 전 코드
public class LoginService {
    private String authKey = "somekey";
    private CustomerRepository customerRepo;

    public LoginService(CustomerRepository customerRepo) {
        this.customerRepo = customerRepo;
    }

    public LoginResult login(String id, String pw) {
        int resp = 0;
        boolean authorized = authService.authorize(authKey); // 스펙이 동일한 스텁으로 대체
        if (authorized) {
            resp = AuthUtil.authenticate(id, pw);
				...
		}
}
```

의존하는 대상이 Final 클래스이거나 의존 대상의 호출 메서드가 final이어서 대역으로 재정의 할 수 없는 경우에도 동일한 기법을 적용해서 테스트 가능하게 만들 수 있다.

