# CHAP 06. scouter 서버/에이전트 플러그인

scouter는 각종 정보를 추가로 확인할 수 있는 플러그인들을 사용할 수 있는 환경을 제공한다. 플러그인은 scouter 수집 서버에서 사용하는 서버 플러그인과 에이전트에서 사용하는 에이전트 플러그인으로 나뉜다.

![](../../../.gitbook/assets/111%20%289%29.png)

[https://github.com/scouter-project/scouter/blob/master/scouter.document/main/Plugin-Guide\_kr.md](https://github.com/scouter-project/scouter/blob/master/scouter.document/main/Plugin-Guide_kr.md)

## 서버 플러그인의 종류

서버 플러그인은 제공하는 방식에 따라서 나뉜다.

### 스크립팅 플러그인

스크립팅 플러그인은 데이터가 scouter 서버에 저장이 되기 전에 호출되며, 운영 중인 상황에서도 스크립트를 변경 후 저장하면 바로 컴파일 후 반영된다. 그래서 간편하게 사용할 수는 있지만, 텍스트 파일로 저장되기 때문에 관리가 용이하지 않다는 단점이 존재한다.

### 빌트인 플러그인

jar 파일을 통해 필요한 기능들을 추가할 수 있기 때문에 보다 관리가 용이하다

현재 지원하는 빌트인 플러그인

* alert 플러그인
* counter 플러그인

#### alert 플러그인

* email
* telegram
* slack
* line
* dingtalk

만약 주로 사용하는 메신저 종류가 여기에 없거나 서버 플러그인이 필요하면 null 플러그인의 코드를 복사하여 입맛에 맞게 수정하면 된다.

![](../../../.gitbook/assets/222%20%288%29.png)

[https://github.com/scouter-project/scouter-plugin-server-null](https://github.com/scouter-project/scouter-plugin-server-null)

### 스크립팅 플러그인

스크립팅 플러그인은 scouter 서버의 plugin이라는 디렉터리에 만들어놓으면 자동으로 컴파일을 하여 사용할 수 있는 상태가 된다. 스크립팅 플러그인은 관련된 데이터가 저장되기 전에 임의로 처리할 작업이 있을 경우 이플러그인에 지정하여 작업하면 된다.

* agent.plug : 알림
* counter.plug : 성능 카운터 데이터
* object.plug : object 정보
* summary.plug : 성능 통계 정보
* xlog.plug : xlog 데이터
* xlogdb.plug : xlog 데이터 저장 직전 처리
* xlogprofile.plug : 상세 프로파일 정보

## 에이전트 플러그인의 종류

에이전트 플러그인은 해당 시점에 메서드로 넘어온 매개변수의 값을 확인하거나 리턴되는 값을 확인할 때 유용하다. 예를 들어 어떤 특정 서버만 예외가 발생하는 경우 capture 플러그인을 사용하면 문제가 발생한 메서드의 매개변수나 리턴값을 확인할 수 있기 때문에 디버깅 용도로 아주 유용하게 활용할 수 있다. scouter에서 기본적으로 제공하는 에이전트 플러그인의 종류는 다음과 같다

* httpservice.plug : WAS에 HTTP 요청이 들어오는 시점이나 나가는 시점
* httpcall.plug : WAS에서 외부로 HttpClient를 사용하여 호출하는 시점
* service.plug : 서비스의 시작/종료 시점에 데이터 확인\(hook\_service\_patterns으로 설정된 대상이 여기에 속함\)
* capture.plug : 특정 클래스의 메서드가 호출되는 시점의 데이터 확인\(hook\_args\_patterns나 hook\_constructor\_patterns로 설정된 대상이 여기에 속함\)
* jdbcpool.plug : DB 연결 요청 시점

### HttpService 플러그인

httpservice 플러그인은 WAS에 HTTP를 사용한 요청이 들어왔을 때의 데이터를 확인하거나 필요한 작업을 수행할 경우 사용된다. 플러그인을 활용하는 절차는 다음과 같다.

1. scouter의 [agent.java/plugin](http://agent.java/plugin) 디렉터리에 httpservice.plug라는 파일을 만든다.
2. 플러그인 파일을 다음과 같이 만든다.

   ```text
   [start]
   // void start(WrContent $ctx, WrRequest $req, WrResponse $res)
   [end]
   // void end(WrContent $ctx, WrRequest $req, WrResponse $res)
   [reject]
   // boolean reject(WrContent $ctx, WrRequest $req, WrResponse $res)
   return false;
   ```

3. 다음과 같이 플러그인 파일에 코드를 추가한 후 저장한다.

   ```text
   [start]
   // void start(WrContent $ctx, WrRequest $req, WrResponse $res)
   $ctx.progile("http plugin start")
   [end]
   // void end(WrContent $ctx, WrRequest $req, WrResponse $res)
   $ctx.progile("http plugin end")
   [reject]
   // boolean reject(WrContent $ctx, WrRequest $req, WrResponse $res)
   return false;
   ```

4. 모니터링하는 WAS에 URL을 호출해 보면 XLog의 프로파일링 정보에 여기에서 추가한 코드가 실행된다. 즉, 호출될 때 'http plugin start'가, 종료 전에 'http plugin end'가 프로파일링에 포함되어 있는 것을 확인할 수 있다.

   ```text
   ------------------------------------------------------------------------------------------
       p#      #    	  TIME         T-GAP   CPU          CONTENTS
   ------------------------------------------------------------------------------------------
            [******] 16:30:57.940        0      0  start transaction 
       -    [000000] 16:30:57.942        2      0  [driving thread] http-bio-8080-exec-37
       -    [000001] 16:30:58.269      327      0  http plugin start
       -    [000002] 16:30:58.408      139      0  http plugin end
       -    [******] 16:30:58.409        1      0  end of transaction
   ```

#### 어떻게 이렇게 사용하는 것이 가능할까?

개발자가 이 코드를 저장하는 순간 해당 코드는 컴파일이 된다. 정상적으로 컴파일이 되었는지 확인하려면 모니터링하는 WAS의 로그 파일을 확인해 보면 된다. Tomcat을 사용할 때에는 catalina.out 파일에 해당 내용이 출력되며, 정상적인 경우 다음과 같이 출력된다.

```text
20XX0XX 00:00:00 [SCOUTER] PLUG-IN : scouter.agent.plugin.AbstractHttpService
httpservice.plug loaded #x1q5g5h
```

ctx는 scouter의 프로파일링에 필요한 정보들을 얻거나 관련 정보들을 할당할 때 사용하며, 주로 많이 사용하는 것은 profile\(String\) 메서드다. 만약 이 스크립트에서 작업을 잘못할 경우에 운영 중인 서버의 데이터가 깨져 들어가는 일이 발생할 수 있다. 이러한 문제를 예방하기 위해서 되도록이면 \[end\] 블록에서 필요한 데이터를 읽어 처리하는 것을 추천한다.

