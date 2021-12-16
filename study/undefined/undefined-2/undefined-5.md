---
description: 객체지향과 디자인 패턴(최범균 저) 어댑터 패턴 정리한 내용입니다.
---

# 어댑터 패턴

## 상황

웹 게시판에 통합 검색 기능을 추가해 달라는 요구가 들어와서 DB를 이용해서 검색 기능을 구현하기로 하였다. 처음엔 잘 동작하였지만 게시글의 개수가 빠르게 증가하면서 SQL의 like를 이용한 검색 속도 성능에 문제가 발생하기 시작했다. 검색 속도의 문제를 해결하기 위해 Tolr라는 오픈 소스 검색 서버를 도입하기로 결정했다.

## 문제

오픈 소스를 적용하려다 보니 TolrClient가 제공하는 인터페이스와 SearchService 인터페이스가 맞지 않는다는 점이다. WebSearchRequestHandler 클래스를 비롯해서 여러 클래스가 SearchService를 사용하도록 만들어졌기 때문에, SearchService 대신 TolrClient를 사용하도록 변경하는 작업은 많은 변경을 요구한다.

## 해결방법

이렇게 클라이언트가 요구하는 인터페이스와 재사용하려는 모듈의 인터페이스가 일치하지 않을 때 사용할 수 있는 패턴이 어댑터 패턴이다.

```java
public class SearchServiceTolrAdapter implements SearchService {
    private TolrClient tolrClient = new TolrClient();
    
    public SearchResult search(String keyword){
        // keyword를 tolrClient가 요구하는 형식으로 변환
        TolrQuery tolrQuery = new TolrQuery(keyword);
        // TolrClient 기능 실행
        QueryResponse response = tolrClient.query(tolrQuery);
        // TolrClient의 결과를 SearchResult로 변환
        SearchResult result = convertToResult(reponse);
        return result;
    }
}
```

어댑터 패턴이 적용된 예는 SLF4J라는 로깅 API이다. SLF4J는 단일 로깅 API를 사용하면서 자바 로깅, log4j, LogBack 등의 로깅 프레임워크를 선택적으로 사용할 수 있도록 해주는데, 이 때SLF4J가 제공하는 인터페이스와 각 로깅 프레임워크를 맞춰 주기 위해 어댑터를 사용하고 있다.

어댑터 패턴은 개방 폐쇄 원칙을 따를 수 있도록 도와준다. 로깅 프레임워크를 LogBack으로 교체하고 싶다면 LogBack을 slf4j-api 패키지의 Logger로 맞춰주는 새로운 어댑터만 구현해 주면 된다.
