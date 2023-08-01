# \[MySQL] 이모지 저장은 어떻게 하면 좋을까?

<figure><img src="../../.gitbook/assets/1 (5).jpeg" alt=""><figcaption><p><a href="https://m.blog.naver.com/poupille/221333032078">https://m.blog.naver.com/poupille/221333032078</a></p></figcaption></figure>

## 이모지는 어떻게 구분할까?

* SNS 기능이나 리뷰, 댓글 등 다양한 대화를 저장하다보면 이모지를 저장해야 하는 경우가 있다
* 만약 테이블에 아무런 설정을 하지 않았다면 애플리케이션에서 SQLSyntaxErrorException와 같은 exception을 확인할 수 있을 것이다
* 이때 수정해주어야 하는게 charset과 collation이다

## Character set, Collation

* charset은 문자가 어떠한 ‘코드’로 저장될지 규칙을 정하는 것을 의미한다
* collaction은 저장되는 데이터의 문자셋을 어떻게 비교하여 정렬할지 결정하는 알고리즘을 의미한다
* `‘utf_’`로 시작되는 charset은 가변3바이트를 사용한다
* `‘utfmb4_’`로 시작되는 charset은 한문자를 인코딩하는데 4바이트를 사용한다
* `mb4`라는 의미는 이모지를 인코딩 했을때 `4 byte`로 표현이 되어 이를 표현할수 있다는 의미이다

## 대소문자 구분 어떻게 해야 할까?

* `‘utf8_bin’` 는 대소문자를 구분한다
* `‘utf_general’` , `‘utf_unicode’`는 대소문자를 구분하지 않는다

### 그럼 실제로 어떻게 대소문자를 구분한다는 걸까?

* 대소문자로 구분된 데이터를 넣어보자

<figure><img src="../../.gitbook/assets/2 (4).png" alt=""><figcaption></figcaption></figure>

#### collation을 ‘utf8mb4\_bin’으로 할 경우 쿼리를 수행해보자

<figure><img src="../../.gitbook/assets/3 (4).png" alt=""><figcaption></figcaption></figure>

* ‘a’로 시작하는 데이터를 조회하도록 한다

```jsx
SELECT *
FROM TEMP
WHERE name LIKE 'a%'
```

* 결과는 아래와 같다

<figure><img src="../../.gitbook/assets/4 (5).png" alt=""><figcaption></figcaption></figure>

#### 이번엔 collation을 ‘utf8mb4\_unicode\_bin’으로 설정해보자

<figure><img src="../../.gitbook/assets/5 (5).png" alt=""><figcaption></figcaption></figure>

* ‘a’로 시작하는 데이터를 조회하도록 한다

<figure><img src="../../.gitbook/assets/6 (2).png" alt=""><figcaption></figcaption></figure>

* 그럼 이렇게 두개의 데이터가 조회되는것을 확인할 수 있다.

## unicode, general 차이는 무엇일까?

* 여기에 더불어 utf8 이후에 general 또는 unicode로 정의할 수 있다
* unicode는 유니코드 표준을 기반으로 정렬한다
* general은 유니코드 보다는 정확성이 조금 떨어지지만 단순한 정렬로 인해 성능상 우위에 있다



> Mysql의 default collation은 `utf8_general_ci` 이다\
> 현재는 mysql 버전이 올라가면서 general에서도 unicode만큼 어느 정도 성능을 보장하므로 성능과 정확성을 다 보장할 수 있는 unicode를 그대로 사용해도 될것 같다

##

## 참고

* [https://forums.mysql.com/read.php?103,187048,188748#msg-188748](https://forums.mysql.com/read.php?103,187048,188748#msg-188748)
* [https://stackoverflow.com/questions/766809/whats-the-difference-between-utf8-general-ci-and-utf8-unicode-ci](https://stackoverflow.com/questions/766809/whats-the-difference-between-utf8-general-ci-and-utf8-unicode-ci)
* [https://www.dante2k.com/530](https://www.dante2k.com/530)
