---
description: 스프링 인 액션(5판) 챕터 7장을 요약한 내용 입니다.
---

# Chap 7. REST 서비스 사용하기

스프링 애플리케이션에서 API를 제공하면서 다른 애플리케이션의 API를 요청하는 것은 흔한 일이다. 실제로 마이크로서비스에서는 REST API를 많이 사용한다. 스프링 애플리케이션은 다음과 같은 방법을 사용해서 REST API를 사용할 수 있다.

* RestTemplate : 스프링 프레임워크에서 제공하는 간단하고 동기화된 REST 클라이언트
* Traverson: 스프링 HATEOAS에서 제공하는 하이퍼링크를 인식하는 동기화 REST 클라이언트로 같은 이름의 자바스크립트 라이브러리로부터 비롯된 것이다.
* WebClient : 스프링 5에서 소개된 반응형 비동기 REST 클라이언트

## RestTemplate으로 REST 엔드포인트 사용하기

RestTemplate은 TRACE를 제외한 표준 HTTP 메서드 각각에 대해 최소한 하나의 메서드를 갖고 있다. 또한, execute\(\)와 exchange\(\)는 모든 HTTP 메서드의 요청을 전송하기 위한 저수준의 범용 메서드를 제공한다.

REST 리소스와 상호 작용하기 위한 41개 메서드 제공

| 메서드 | 기능 설명 |
| :--- | :--- |
| delete\(..\) | 지정된 URL의 리소스에 HTTP DELETE 요청을 수행한다. |
| exchange\(..\) | 지정된 HTTP 메서드를 URL에 대해 실행하며, Response body와 연결되는 객체를 포함하는 responseEntity를 반환한다. |
| execute\(..\) | 지정된 HTTP 메서드를 URL에 대해 실행하며, Response body와 연결되는 객체를 반환한다. |
| getForEntity\(..\) | HTTP GET 요청을 전송하며, Response body와 연결되는 객체를 포함하는 ResponseEntity를 반환한다. |
| getForObject\(..\) | HTTP GET 요청을 전송하며, Response body와 연결되는 객체를 반환한다. |
| headForHeaders\(..\) | HTTP HEAD 요청을 전송하며, 지정된 리소스 URL의 HTTP 헤더를 반환한다. |
| optionsForAllow\(..\) | HTTP OPTIONS 요청을 전송하며, 지정된 URL의 Allow 헤더를 반환한다. |
| patchForObject\(..\) | HTTP PATCH 요청을 전송하며, Response body와 연결되는 결과 객체를 반환한다. |
| postForEntity\(..\) | URL에 데이터를 POST하며, Resonse body와 연결되는 객체를 포함하는 ResponseEntity를 반환한다. |
| postForLocation\(..\) | URL에 데이터를 POST하며, 새로 생성된 리소스의 URL를 반환한다. |
| postForObject\(..\) | URL에 데이터를 POST하며, Response body와 연결되는 객체를 반환한다. |
| put\(..\) | 리소스 데이터를 지정된 URL에 PUT한다. |

메서드는 다음의 세 가지 형태로 오버로딩되어 있다.

* 가변 인자 리스트에 지정된 URL 매개변수에 URL 문자열을 인자로 받는다.
* Map&lt;String,String&gt;에 지정된 URL 매개변수에 URL 문자열을 인자로 받는다.
* Java.net.URI를 URL에 대한 인자로 받으며, 매개변수화된 URL은 지원하지 않는다.

## 리소스 가져오기\(GET\)

타코 클라우드 API로부터 식자재\(ingredient\)를 가져온다고 해보자

```java
public Ingredient getIngredientById(String ingredientId) {
    return rest.getForObject("<http://localhost:8080/ingredients/{id}>",
                             Ingredient.class, ingredientId);
}
```

다른 방법으로는 Map을 사용해서 URL 변수들을 지정할 수 있다.

```java
public Ingredient getIngredientById(String ingredientId) {
    Map<String, String> urlVariables = new HashMap<>();
    urlVariables.put("id", ingredientId);
    return rest.getForObject("<http://localhost:8080/ingredients/{id}>",
                             Ingredient.class, urlVariables);
}
```

이와는 달리 URI 매개변수를 사용할 때는 URI 객체를 구성하여 getForObject\(\)를 호출해야 한다.

```java
public Ingredient getIngredientById(String ingredientId) {
    Map<String, String> urlVariables = new HashMap<>();
    urlVariables.put("id", ingredientId);
    URI url = UriComponentsBuilder
              .fromHttpUrl("<http://localhost:8080/ingredients/{id}>")
              .build(urlVariables);
    return rest.getForObject(url, Ingredient.class);
}
```

getForEntity\(\)는 getForObject\(\)와 같은 방법으로 작동하지만, 응답 결과를 나타내는 도메인 객체를 반환하는 대신 도메인 객체를 포함하는 ResponseEntity 객체를 반환한다. ResponseEntity에는 응답 헤더와 같은 더 상세한 응답 콘텐츠가 포함될 수 있다.

```java
public Ingredient getIngredientById(String ingredientId) {
    ResponseEntity<Ingredient> responseEntity =
        rest.getForEntity("<http://localhost:8080/ingredients/{id}>",
                          Ingredient.class, ingredientId);
    log.info("Fetched time: " + 
             responseEntity.getHeaders().getDate());
    return responseEntity.getBody();
}
```

## 리소스 쓰기\(PUT\)

HTTP PUT 요청을 전송하기 위해 RestTemplate은 put\(\) 메서드를 제공한다.

```java
public void updateIngredientById(Ingredient ingredientId) {
    rest.put("<http://localhost:8080/ingredients/{id}>",
             ingredient,
             ingredient.getId());
}
```

## 리소스 삭제하기\(DELETE\)

타코 클라우드에서 특정 식자재를 더 이상 제공하지 않으므로 해당 식자재를 완전히 삭제하고 싶다고 해보자

```java
public void deleteIngredient(Ingredient ingredientId) {
    rest.delete("<http://localhost:8080/ingredients/{id}>",
                ingredient.getId());
}
```

## 리소스 데이터 추가하기\(POST\)

새로운 식자재를 타코 클라우드 메뉴에 추가한다고 해보자. RestTemplate은 POST 요청을 전송하는 오버로딩된 3개의 메서드를 갖고 있으며, URL을 지정하는 형식은 모두 같다.

```java
public Ingredient createIngredient(Ingredient ingredientId) {
    return rest.postForObject("<http://localhost:8080/ingredients/{id}>",
                              ingredient, Ingredient.class);
}
```

만일 클라이언트에서 새로 생성된 리소스의 위치가 추가로 필요하다면 postForObject\(\) 대신 postForLocation\(\)을 호출할 수 있다.

```java
public URI createIngredient(Ingredient ingredient) {
    return rest.postForLocation("<http://localhost:8080/ingredients>",
                                ingredient, Ingredient.class);
```

postForLocation\(\)은 postForObject\(\)와 동일하게 작동하지만, 리소스 객체 대신 새로 생성된 리소스의 URI를 반환한다는 것이 다르다

```java
public Ingredient createIngredient(Ingredient ingredient) {
    ResponseEntity<Ingredient> responseEntity =
        rest.postForEntity("<http://localhost:8080/ingredients>",
                           ingredient, Ingredient.class);
    log.info("New resource created at " +
             responseEntity.getHeaders().getLocation());
    return responseEntity.getBody();
}
```

## Traverson으로 REST API 사용하기

Traverson은 스프링 데이터 HATEOAS에 같이 제공되며, 스프링 애플리케이션에서 하이퍼미디어 API를 사용할 수 있는 솔루션이다. Traverson은 '돌아다닌다는\(traverse on\)'의 의미로 붙여진 이름이며, 여기서는 관계 이름으로 원하는 API를 사용할 것이다.

예를 들어, 모든 식자재 리스트를 가져온다고 해보자. 각 ingredients 링크들은 해당 식자재 리소스를 링크하는 href 속성을 가지므로 그 링크를 따라가면 된다.

```java
public Iterable<Ingredient> getAllIngredientsWithTraverson() {
    ParameterizedTypeReference<Resources<Ingredient>> ingredientType =
        new ParameterizedTypeReference<Resources<Ingredient>>() {};

    Resources<Ingredient> ingredientRes = traverson
                                          .follow("ingredients")
                                          .toObject(ingredientType);
	
    Collection<Ingredient> ingredients = ingredientRes.getContent();
	
    return ingredients;
}
```

다음은 가장 최근에 생성된 타코들을 갖져온다고 하자. 이때는 다음과 같이 홈 리소스에서 시작해서 가장 최근에 생성된 타코 리소스로 이동할 수 있다.

```java
public Iterable<Taco> getRecentTacosWithTraverson() {
    ParameterizedTypeReference<Resources<Taco>> tacoType =
        new ParameterizedTypeReference<Resources<Taco>>() {};

    Resources<Taco> tacoRes = traverson
                              .follow("tacos")
                              .follow("recents")
                              .toObject(tacoType);
```

여기서는 tacos 링크 다음에 recents 링크를따라간다. 그러면 최근 생성된 타코 리소스에 도달하므로 toObject\(\)를 호출하여 해당 리소스를 가져올 수 있다. 여기서 tacoType은 ParameterizedTypeReference 객체로 생성되었으며, 우리가 원하는 Resources&lt;Taco&gt; 타입이다.

따라서 API의 이동과 리소스의 변경이나 삭제 모두를 해야 한다면 RestTemplate과 Traverson을 함께 사용해야 한다. Traverson은 새로운 리소스가 생성될 링크로 이동할 때도 사용할 수 있으며, 이동한 다음에는 해당 링크를 RestTemplate에 지정하여 우리가 필요한 POST, PUT, DELETE 또는 어떤 다른 HTTP 요청도 할 수 있다.

예를 들어, 새로운 식자재\(Ingredient 객체\)를 타코 클라우드 메뉴에 추가하고 싶다면, 다음의 addIngredient\(\) 메서드처럼 Traverson과 RestTemplate을 같이 사용하여 새로운 Ingredient 객체를 API에 POST하면 된다.

```java
public Ingredient addIngredient(Ingredient ingredient) {
    String ingredientsUrl = traverson
                            .follow("ingredients")
                            .asLink()
                            .getHref();

    return rest.postForObject(ingredientsUrl,
                              ingredient,
                              Ingredient.class);
}
```

