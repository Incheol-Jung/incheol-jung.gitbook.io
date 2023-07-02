# 테스트 코드 어디까지  알아보고 오셨어요?

<figure><img src="../../.gitbook/assets/1.jpg" alt=""><figcaption><p><a href="https://brunch.co.kr/@pi1ercho/9">https://brunch.co.kr/@pi1ercho/9</a></p></figcaption></figure>

## 테스트 코드를 작성 해야 하는 이유?

#### 코드를 믿을 수 없다

* 배포하고 돌려본다
* 에러가 발생하면 재배포해서 다시 돌려본다
* 기능을 추가하거나 변경할 때마다 이전에 동작한 모든 기능들에 대해서 잘 동작하는지 돌려보면서 확인해본다..

#### 요구사항을 알수 없다

* 작가 정보를 추가한다
* 작가 테이블에는 사용자 정보가 존재해야 저장이 가능하다
* 사용자가 탈퇴후 작가 정보를 추가한다면..?
* FK 제한이 있어 에러가 발생한다..

#### 기능을 변경하거나 확장하기 어렵다

* 작가명을 20자에서 30자로 변경하려고 한다
* 파라미터의 글자수 제한을 변경하였다
* 그리고 배포하였다..
* 하지만 디비 스키마는 반영되지 않았다..
* 배포한 이후에 작가명 수정 API에서 에러가 발생한다…

## 단위 테스트 vs 통합 테스트

#### 단위 테스트

* 단위 테스트에 대한 기준은 없다. 단위 테스트는 최소한의 범위로 메소드 단위나 클래스 단위로 하는걸 권장한다
* 메소드나 클래스 단위라면 의존하는 타 클래스는 단위 클래스 범주에서 벗어나는 영역이다
* 단위 테스트 관점에서 타 클래스의 구현 로직은 관심 밖이다
* 그러므로 타 클래스나 메서드는 모킹하여 처리한다

#### 통합 테스트

* 단위 테스트를 통합한 범위다
* 단위 테스트에서 의존적인 타 클래스나 메소드도 테스트 범주안에 들어 있다
* 기능을 테스트하면서 연관된 모든 클래스와 메서드는 통합 테스트 범주에 속한다

{% hint style="success" %}
참고\
\
[https://tecoble.techcourse.co.kr/post/2021-05-25-unit-test-vs-integration-test-vs-acceptance-test/](https://tecoble.techcourse.co.kr/post/2021-05-25-unit-test-vs-integration-test-vs-acceptance-test/)
{% endhint %}



## mockito

* given 절에는 필요한 데이터를 만들어주는 로직도 있지만, mock 데이터에 대한 메서드 수행 로직을 정의하기도 한다
* 단위 테스트에서는 의존하는 클래스는 테스트 범주에 벗어나므로 mock 처리하는게 일반적이다
* 의존하는 클래스나 메서드를 그대로 사용해도 되지만 멱등성을 보장할 수 없고, 만약 단순한 로직이 아닌 network 통신이 필요한 로직이라면 네트워크 상태에 따라서 테스트를 보장할 수 없다
* 그래서 단위 테스트를 100% 보장하기 위해선 의존하는 클래스에 영향을 받으면 안된다
* 이를 해결하기 위해 의존하는 클래스를 mock 처리한다
* mock 처리하는 다양한 라이브러리가 있는데 가장 많이 사용하는 mockito를 사용하기로 했다
*   mockito에는 다양한 메서드를 제공한다

    * [https://javadoc.io/doc/org.mockito/mockito-core/latest/org/mockito/Mockito.html](https://javadoc.io/doc/org.mockito/mockito-core/latest/org/mockito/Mockito.html)

    #### given() vs when()

    * given 절에 Mockito에 when() 메서드를 사용할수도 있고, BDDMockito의 given() 메서드를 사용할 수 있다
    *   초기에 Mockito 라이브러리는 when()을 제공하였는데, 점차 given이라는 의미와 when() 메서드가 의미상 부합되지 않음을 깨닫고 그 이후에 업데이트된 라이브러리에는 given()이라는 메서드를 제공하게 되었다고 한다. 그래서 기능상 차이는 없을지라도 의미상 given()을 쓰는것을 권장하고 있다

        ```jsx
        The problem is that current stubbing api with canonical role of when word does not integrate nicely with //given //when //then comments. 
        It's because stubbing belongs to given component of the test and not to the when component of the test. 
        Hence BDDMockito class introduces an alias so that you stub method calls with BDDMockito.given(Object) method. 
        Now it really nicely integrates with the given component of a BDD style test!

        출처 : <https://javadoc.io/static/org.mockito/mockito-core/5.1.0/org/mockito/Mockito.html>
        ```

## Assert

*   일반적인 테스트 코드 포맷이다

    ```jsx
    @Test
    @DisplayName("사용자 아이디가 1인 카테고리 목록은 존재해야 한다")
    void getList() {
        // given
        GetListCategoryParameter parameter = GetListCategoryParameter.builder().targetId(1).build();

        // when
        List<Category> categories = categoryRepository.getList(parameter);

        // then
        Assertions.assertFalse(categories.isEmpty());
    }
    ```
* given(), when(), then()을 기준으로 테스트 코드를 구성한다
  * given() : 테스트에 필요한 데이터를 구성한다
  * when() : 테스트할 구현 메서드를 구성한다
  * then() : 구현 메서드 이후에 의도한 대로 데이터가 변경되었는지 구성한다
* then() 로직에서 다양한 검증 로직을 수행할 수 있는데 일반적으로 Assert를 많이 사용한다

{% hint style="success" %}
참고\
\
[https://velog.io/@ynjch97/JUnit5-JUnit5-구성-어노테이션-Assertions-정리](https://velog.io/@ynjch97/JUnit5-JUnit5-%EA%B5%AC%EC%84%B1-%EC%96%B4%EB%85%B8%ED%85%8C%EC%9D%B4%EC%85%98-Assertions-%EC%A0%95%EB%A6%AC)
{% endhint %}

##

## DAO 테스트

* dao를 테스트에서 제일 중요한건 데이터 정합성이다
*   데이터 정합성 테스트 하는 기준은 두 가지 이다

    * 수행하려는 데이터는 데이터베이스 스키마를 유지하였는가?
    * 수행하려는 데이터는 우리의 의도대로 데이터가 변경되었는가?

    ```jsx
    @Test
    @DisplayName("completeYn을 'true'로 하면 조회시 completeYn은 true여야 한다")
    void updateCompleteYn() {
        // given
        UpdateCompleteYnParameter parameter = UpdateCompleteYnParameter.builder().userId(1).completeYn(true).build();

        // when
        userRepository.updateCompleteYn(parameter);

        // then
        UserInfo userInfo = userRepository.getUserInfoByUserId(1);
        Assertions.assertEquals(userInfo.getId(), 1);
        Assertions.assertEquals(userInfo.isInfoCompleteYn(), true);
    }

    @Test
    @DisplayName("completeYn이 true여야 한다")
    void isCompleteYn() {
        // given
        UpdateCompleteYnParameter parameter = UpdateCompleteYnParameter.builder().userId(1).completeYn(true).build();
        userRepository.updateCompleteYn(parameter);

        // when
        boolean completeYn = userRepository.isCompleteYn(1);

        // then
        Assertions.assertTrue(completeYn);
    }
    ```
* 단, 여기서 주의할 점은 dao 테스트 코드를 보면 한 가지 불편한 부분이 보인다
  * 조회하는 로직을 테스트할 경우 기존에 데이터가 존재한다는 가정하에 결과값을 검증하는 테스트 코드가 있다
  * 어쩌면 단위 테스트 입장에서는 데이터베이스 또한 외부 모듈로 판단할 수 있다
  * 데이터베이스 서버가 다운되면 repository 테스트 코드가 실패나기 때문이다
  * 이를 해결하기 위해서는 프레임워크 내장 데이터베이스(h2)를 사용할 순 있지만 jpa를 사용하지 않는 이상 우리가 사용하는 스키마를 반영하기 위해서는 sql 파일이 필요하고 변경될때마다 동기화해주어야 한다
  * 그래서 현재는 개발 데이터베이스를 통해서 테스트 로직을 수행하고 있다
  *   만약 테스트용 디비 구축이 부담스럽다면 docker-compose 플러그인으로 해결할 수 있다

      ```jsx
      // build.gradle

      classpath "com.avast.gradle:gradle-docker-compose-plugin:0.16.12"

      ...

      apply plugin: 'docker-compose'

      ...

      dockerCompose.isRequiredBy(test) // 테스트 수행시에만 docker-compose 플러그인을 실행시킴

      dockerCompose {
      		useComposeFiles = ['docker-compose.yml'] // docker-compose 플러그인 실행시 사용할 파일 설정
      		
      		captureContainersOutput = true
      		removeContainers = true
      		stopContainers = true
      }
      ```

      ```jsx
      // docker-compose.yml

      version: "3"

      services:
        mariadb:
          image: mariadb:10.5
          container_name: mariadb
          ports:
            - 3306:3306
          environment:
            TZ: Asia/Seoul
            MYSQL_HOST: localhost
            MYSQL_PORT: 3306
            MYSQL_ROOT_PASSWORD: "password"
            MYSQL_DATABASE: test
          restart: always
      ```

## void

* 일반적인 테스트 코드는 메서드를 수행하고 결과값을 비교하여 의도한 대로 구현되었는지 코드를 검증한다
* 그러나 CUD 로직에는 결과값이 없을 수 있다

#### 그럼 결과값이 없는 메서드는 어떻게 테스트 해야 할까?

* void 형태의 메서드일 경우에 검증할 수 있는 두 가지 방법이 있다
  1.  테스트할 메서드를 수행하고 조회하는 메서드를 통해서 의도한 대로 수행되었는지 확인한다

      * DAO일 경우에는, 실제로 데이터베이스의 데이터를 변경하여 조회하는 데이터를 사용하여 검증이 가능하지만 DAO를 mock 처리할 경우에는 데이터가 실제로 변경되지 않기때문에 의미가 없을 수 있다

      ```jsx
      @Test
      @DisplayName("카테고리 이름을 'TEST_CATEGORY'로 변경하여 조회시 변경된 이름으로 조회되어야 한다")
      void modify() {
          // given
          String testCategoryName = "TEST_CATEGORY";
          int targetId = 1;
          int categoryId = 1;
          ModifyCategoryParameter parameter = ModifyCategoryParameter.builder()
                  .categoryId(categoryId)
                  .targetId(targetId)
                  .categoryName(testCategoryName)
                  .sortNo(1)
                  .build();

          // when
          categoryRepository.modify(parameter);

          // then
          Category category = categoryRepository.get(GetCategoryParameter.builder()
                  .targetId(targetId)
                  .categoryId(categoryId)
                  .build());

          Assertions.assertEquals(category.getCategoryName(), testCategoryName);
      }
      ```
  2.  데이터는 변경되었다고 가정한다. 의도한 대로 메서드가 수행되었는지 검증한다

      * 올바르지 않은 데이터 인입시 예외 처리가 되었거나 테스트 수행시 의도한 대로 메서드가 수행되었는지 확인한다
      * mock 클래스의 특정 메서드에서 리턴값이 없을 경우에는 given을 사용할 수 없다
      * 그때는 doNothing()을 사용하여 목 데이터에게 메서드가 수행되었다고 가정할 수 있다

      ```jsx
      @Test
      @DisplayName("카테고리 생성시 respository는 무조건 한번은 호출해야 한다")
      void insert() {
          // given
          InsertCategoryParameter parameter = InsertCategoryParameter.builder().build();
          doNothing().when(categoryRepository).insert(parameter);

          // when
          categoryService.insert(parameter);

          // then
          Mockito.verify(categoryRepository, times(1)).insert(parameter);
      }
      ```

{% hint style="success" %}
참고\
\
[https://www.baeldung.com/mockito-void-methods](https://www.baeldung.com/mockito-void-methods)
{% endhint %}



## controller 테스트하기

* 컨트롤러의 테스트 목적은 두 가지이다
  * request에 대한 검증 로직이 구현되었는지?
  * 공유해준 API SPEC이 맞는지? 또는 API는 RESTFUL한지 확인한다
* 이를 확인하기 위해 api를 호출해봐야 하는데 우리는 `MockMvc`를 사용하였다
* MockMvc를 사용하면 postman 없이 테스트 수행하면서 내부적으로 api를 호출해볼 수 있다

### GET method 테스트 하기

* get 메서드는 조회용 API가 대부분이다
* status code는 200일 경우가 높고, 리턴값이 있을 것이다
* 체크할것은 두 가지이다
  * statuscode가 기대한값과 동일한지?
  * 기대한 결과값인지?

```jsx
// when
MvcResult result = mockMvc.perform(get("/artists/trendings")).andExpect(status().isOk()).andReturn();
byte[] contentAsByteArray = result.getResponse().getContentAsByteArray();

// then
List<TrendingArtistResponse> artistResponses = objectMapper.readValue(contentAsByteArray, new TypeReference<>() {
});
Assertions.assertFalse(artistResponses.isEmpty());
```

### POST/PUT/DELETE

* CUD 관련 API는 데이터를 변경하는 API일 가능성이 매우 높다
* status code는 rest api면 존재할 것이다
  * 201 : 생성시
  * 202 : 수정시
  * 200 : 삭제시?
* response는 존재할수도 있지만 대부분 존재 하지 않을 것이다.
* 그렇다면 status code만 검증하면 될까?
* 파라미터 검증도 되었고 status code로 우리가 원하는 로직도 검증되었다
* 추가로 검증하는 로직은 void 형태 검증에서 사용되었던 times()로 추가되었다

```jsx
// given
UpdateArtistNameRequest request = UpdateArtistNameRequest.builder()
        .korNm("정인철")
        .engNm("incheol")
        .defaultNameLanguage(ArtistNameDefaultLang.ENG)
        .build();
doNothing().when(externalArtistService).updateArtistName(any(UpdateArtistNameRequest.class), eq(1));

// when
byte[] bytes = objectMapper.writeValueAsBytes(request);
mockMvc.perform(put("/artists/name").content(bytes).contentType(MediaType.APPLICATION_JSON))
        .andExpect(status().isOk());

// then
verify(externalArtistService, times(1)).updateArtistName(any(UpdateArtistNameRequest.class), eq(1));
```

### 그렇다면 file 업로드는 어떻게 할까?

* file도 mock 처리가 가능하다
* MockMultipartFile을 사용하여 내용은 임의의 텍스트로 생성이 가능하다

```jsx
// when
externalArtistService.updatePresentImages(List.of(new MockMultipartFile("images", "TEST".getBytes())), 1);

// then
verify(artistService, times(1)).getByUserId(eq(1));
verify(externalAttachUploadService, times(1)).validateAttachedPresentImages(any(List.class));
verify(externalAttachUploadService, times(1)).registerAttach(any(List.class), any(ArtyConstant.AmazonFolderType.class), eq(1));
```

{% hint style="success" %}
참고\
\
[https://ykh6242.tistory.com/entry/Spring-Web-MVC-Multipart-요청-다루기](https://ykh6242.tistory.com/entry/Spring-Web-MVC-Multipart-%EC%9A%94%EC%B2%AD-%EB%8B%A4%EB%A3%A8%EA%B8%B0)
{% endhint %}





## 작성된 테스트 코드는 어떻게 검증 할 수 있을까?

### jacoco

* jacoco 라이브러리를 사용하면 테스트 커버리지를 확인할 수 있다
* 테스트 커버리지 종류는 총 세가지로 분류된다
  *   라인 커버리지

      * 단순히 라인을 얼마나 커버했는지 측정한다



      <figure><img src="../../.gitbook/assets/2 (2).png" alt=""><figcaption></figcaption></figure>
  *   브랜치 커버리지

      * 조건문에서 true/false의 케이스를 얼마나 충족했는지 측정한다



      <figure><img src="../../.gitbook/assets/3 (6).png" alt=""><figcaption></figcaption></figure>
  * 컨디션 커버리지
    * 조건문에서 발생가능한 모든 조건을 얼마나 충족했는지 측정한다
* jacoco 설정
  *   import library

      ```jsx
      //build.gradle
      plugins {
          ...
          id 'jacoco'
      }

      allprojects {
          ...
          apply plugin: 'jacoco'

      		jacocoTestReport {
      		    reports {
      		        html.enabled true
      		        csv.enabled true
      		        xml.enabled true
      		        xml.destination file("${buildDir}/reports/jacoco/testCoverage/testCoverage.xml")
      		    }
      		
      		    afterEvaluate {
      		        classDirectories.setFrom(files(classDirectories.files.collect {
      		            fileTree(dir: it, exclude: [
      		                    "**/model/*",
      		                    "**/config/*",
      		                    "**/enums/*",
      		                    "**/exception/*",
      		                    "**/config/*",
      		                    "**/constant/*",
      		                    "**/infrastructure/*"
      		            ])
      		        }))
      		    }
      		
      		    finalizedBy jacocoTestCoverageVerification
      		    finalizedBy testCodeCoverageReport
      		}
      }

      ```
* jacoco 확인 결과(build/reports/jacoco/test/html/index.html)

<figure><img src="../../.gitbook/assets/4 (1).png" alt=""><figcaption></figcaption></figure>

### github action

* 그럼 매번 PR 올릴때 마다 jacoco를 통해서 커버리지를 확인해야 할까?
* 아니다. 그렇지 않다
* github action을 통해서 라인 커버리지를 실시간으로 확인할 수 있다

<figure><img src="../../.gitbook/assets/5 (1).png" alt=""><figcaption></figcaption></figure>

* github action 설정
  *   스텝 추가 (path는 `jacocoTestReport`.`reports`.`xml.destination` 설정과 동일한 경로로 설정한다)

      ```jsx
      - name: Add coverage to PR
        id: jacoco
        uses: madrapps/jacoco-report@v1.3
        with:
          paths: ${{ github.workspace }}/core/build/reports/jacoco/testCoverage/testCoverage.xml, ${{ github.workspace }}/external-api/build/reports/jacoco/testCoverage/testCoverage.xml
          token: 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
          min-coverage-overall: 0
          min-coverage-changed-files: 60
      ```

{% hint style="success" %}
참고\
\
[https://github.com/Madrapps/jacoco-report](https://github.com/Madrapps/jacoco-report)
{% endhint %}



