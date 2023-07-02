# 핀포인트 사용시 주의사항!! (feat 로그 파일 사이즈)

## 이슈사항

* 핀포인트를 사용하는데 서비스 자체에 디스크 사용량이 부족하다…
* ‘No space left on device’라는 문구가 보인다..ㅜ
* 그래서 API가 간혹 정상적으로 동작하지 못한다..ㅜ (이때는 파일 업로드쪽 API에만 특히 이슈가 있었음)

## 원인 파악

* 그럼 운영 서비스라면 우선은 파일 사이즈를 늘리고 원인을 파악하는게 먼저일 것이다..
* 그리고 API나 웹 서비스라면 핀포인트를 사용할 경우가 있을 것이다
* 그러면 핀포인트 로그가 많이 쌓여서 인스턴스 디스크 용량이 꽉찰수도 있다..
* 핀포인트 로그는 아래와 같은 경로에 쌓여있다

```jsx
> ls -al {핀포인트 경로}/pinpoint-agent-2.4.2/logs/{instance-id}
```

#### 확인해보니 하루에 100MB 파일이 4-5개 정도 쌓이는걸 확인할 수 있었다..

우선 핀포인트 로그 규칙을 살펴보자

핀포인트 폴더 위치는 되도록이면 서비스마다 동일한 위치에 설치하도록 노력하고 있다. 그러나 간혹 안되어있다고 하면은 왠만하면 폴더 위치는 통일 시켜 주자

그럼 우선 로그 파일을 열어본다

```jsx
> vi {핀포인트 경로}/pinpoint-agent-2.4.2/profiles/local/log4j2.xml
```

로그 파일을 열때 프로파일을 local로 사용하는 이유는 release일 경우 성능을 고려해서 80% 정도만 모니터링이 된다고 해서 local을 사용하였다.

local 같은 경우는 서비스 성능에 부하는 가나 100% 모니터링을 할 수 있기 때문에 현재 운영 초기 상황에서는 다양한 문제점이 발생하기때문에 local로 모든 API를 모니터링하는게 트러블슈팅하기에 용이하다고 생각하여 profile을 local로 하였다

만약 변경하고 싶다면… 아래 파일을 수정하면 된다

```jsx
> vi {핀포인트 경로}/pinpoint-agent-2.4.2/pinpoint-root.config

pinpoint.profiler.profiles.active=local // active 하고 싶은 profile을 설정한다
```

다시 log4j2.xml 파일 설정으로 돌아가보면… DefaultRolloverStrategy의 delete 규칙을 보면 알수 있다

```jsx
> vi {핀포인트 경로}/pinpoint-agent-2.4.2/profiles/local/log4j2.xml

<RollingFile name="rollingFile" filename="${logging_dir}/pinpoint.log"
                     filepattern="${logging_dir}/pinpoint-${rolling-date-format}-%i.log">
    <PatternLayout>
        <Pattern>${file_message_pattern}</Pattern>
    </PatternLayout>
    <Policies>
        <TimeBasedTriggeringPolicy interval="1" modulate="true"/>
    </Policies>
    <DefaultRolloverStrategy max="${default-rollover-strategy-max}">
        <Delete basePath="${logging_dir}/" maxDepth="1">
            <IfFileName glob="pinpoint-*.log"/> // 삭제할 파일 이름을 지정한다
            <IfLastModified age="${lastmodified}"/> // 해당 일자 이후에는 삭제 한다(현재는 7d로 되어있어 7일 이후에는 삭제되도록 되어있다)
        </Delete>
    </DefaultRolloverStrategy>
</RollingFile>
```

7일 정도만 로그를 보관하지만 생각보다 pinpoint agent의 로그는 하루에 400MB 정도 쌓일 만큼 크다..

그래서 7일 동안 400MB 정도 쌓인다면 최대 3GB 이상의 로그 파일 사이즈가 필요하다..

## 해결 방법

우리는 로그 파일을 몇 기가나 유지할 필요가 없기 때문에 파일을 제거하는 규칙을 좀 더 개선할 필요가 있다

```jsx
// log4j2.xml

<Property name="lastmodified">1d</Property> // 파일 사이즈 보관 주기는 1일로 변경한다

<Delete basePath="${logging_dir}/" maxDepth="1">
    <IfAccumulatedFileSize exceeds="10m"/> // 파일 사이즈가 10MB 이상일 경우 제거하는 로직을 추가한다
    <IfFileName glob="pinpoint*.log"/> // 파일 제거 규칙도 pinpoint로 시작하는 모든 파일로 확장한다
    <IfLastModified age="${lastmodified}"/>
</Delete>
```

log4j2.xml 파일을 수정했으면 애플리케이션을 재시작해주면 수정된 로그 파일 정책이 반영될것이다

## 🤫 파일 제거 규칙

#### AS-IS

* 파일 보관 단위는 7일(이후 파일은 제거)
* 파일 제거에 해당하는 파일 이름은 “pinpoint-”로 시작하는 모든 파일이다

#### TO-BE

* 파일 보관 단위는 1일(이후 파일은 제거)
* 파일 사이즈가 10MB 이상일 경우 제거
* 파일 제거에 해당하는 파일 이름은 “pinpoint”로 시작하는 모든 파일로 확장한다

### 로그 파일 수정후 재배포를 꼭 잊지 말자!!

<figure><img src="../../.gitbook/assets/nKT2EMrB.jpg" alt=""><figcaption><p><a href="https://m.segye.com/view/20181129003575">https://m.segye.com/view/20181129003575</a></p></figcaption></figure>
