# CHAP 13. 메모리 단면 잘라 놓기

아 장에서 알아본 여러 가지 메모리 문제 중 힙 영역의 메모리가 부족해지는 메모리 릭을 해결하기 위해서 필요한 메모리의 단면인 '힙 덤프\(Heap Dump\)'를 생성하는 방법에 대해서 알아보자

## 메모리 단면은 언제 자르나?

메모리 단면인 힙 덤프는 메모리가 부족해지는 현상이 지속해서 발생할 때와 OutOfMemoryError가 발생했을 때 생성해야 한다.

### 어떻게 메모리가 부족해지는 것을 알 수 있을까?

* jstat으로 확인
* WAS의 모니터링 콘솔이 있을 경우 콘솔의 메모리 사용량에서 확인
* Java Visual VM이나 JConsole과 같은 JMX 기반의 모니터링 도구로 확인
* scouter와 같은 APM이 설치되어 있으면 APM으로 확인
* verbosegc 옵션으로 확인

#### jstat으로 확인해보기

jstat은 자바 프로세스의 메모리와 JVM 현황을 확인하는 도구다. 어떤 메모리 영역에서 얼마나 메모리를 사용하고 있는지를 확인할 수 있다.

```text
> jstat -gcutil 19637 1s
  S0     S1     E      O      M     CCS    YGC     YGCT    FGC    FGCT    CGC    CGCT     GCT
  0.00  92.11   5.95  14.87  95.51  87.78      6    0.046     0    0.000     2    0.004    0.049
  0.00  92.11   5.95  14.87  95.51  87.78      6    0.046     0    0.000     2    0.004    0.049
  0.00  92.11   5.95  14.87  95.51  87.78      6    0.046     0    0.000     2    0.004    0.049
  0.00  92.11   5.95  14.87  95.51  87.78      6    0.046     0    0.000     2    0.004    0.049
  0.00  92.11   5.95  14.87  95.51  87.78      6    0.046     0    0.000     2    0.004    0.049
  0.00  92.11   5.95  14.87  95.51  87.78      6    0.046     0    0.000     2    0.004    0.049
  0.00  92.11   7.14  14.87  95.51  87.78      6    0.046     0    0.000     2    0.004    0.049
```

여기서 제공하는 결과 중 Tenured\(혹은 Old라고 하는\) 영역의 메모리 사용량\(여기서 네번째 열에 있는 O가 의미하는 Old 영역\)이 GC 이후에도 증가하는지만 확인해 보면 된다.

scouter나 WAS의 모니터링 기능을 사용하는 경우는 현재 운영 중인 시스템이 모니터링을 용이하게 할 수 있는 상황일 경우미여, 지속해서 지켜보거나 하루나 일주일동안의 추이를 확인해 보면 된다. Old 영역의 메모리 사용량은 애플리케이션을 사용하고 있는 동안에는 계속 증가하는 것이 기본이다. Full GC가 발생한 이후의 메모리 사용량이 증가해야만 메모리 릭이 발생하고 있다고 볼 수 있다.

상용 프로파일링 도구를 사용하면, 어떤 라인 혹은 메서드에서 얼마나 많은 임시 객체가 생성되었는지 분석할 수 있다. 하지만 프로파일링 도구를 사용하여 메모리 사용량을 분석할 경우에는 성능에 많은 영향을 주기 때문에, 운영 서버에서는 절대 확인하려고 해서는 안 되며 개발자의 PC나 개발 서버에서 문제점을 확인해야만 한다.

### 왜 저자는 메모리 단면을 아무 때나 자르면 안 된다고 말할까?

그 이유는 메모리 단면을 자르면, 그만큼 비용을 지불해야 하기 때문이다.

* 덤프 파일을 생성하는 동안 서비스가 불가능한 상황이 된다.
* 덤프 생성 시 너무 많은 시간이 소요된다.
* 큰 파일\(대부분 점유하고 있는 메모리 크기만큼의 파일\)이 생성된다.
* 몇몇 JDK 버전\(특히 JDK 5.0\)에서 jmap과 같은 또구를 사용할 경우 한 번밖에 덤프 파일을 생성할 수 없다.

메모리 단면은 JVM에 있는 객체 하나하나에 대한 모든 정보를 담고 있다. 즉, 객체 하나하나의 주소와 크기, 참조하는 객체의 모든 정보를 포함하고 있다. 따라서 파일 생성하는 시간이 적게는 몇 초가 소요될 수도 있지만, 많게는 10분 이상 걸릴 수도 있다.

#### 메모리 단면은 다음과 같은 상황을 구분하여 생성할 수 있다.

* 자바 프로세스 실행 시 옵션에 포함하여 자동 파일 생성
* 실행 옵션과 상관없이 명령어를 사용하여 파일 생성

#### 메모리 단면 생성 방법

* jmap 명령어
* 리눅스의 gcore와 같이 OS에서 제공하는 코어 덤프 명령어

## jmap으로 메모리 단면 생성하기

hprof의 경우는 반드시 자바 프로세스를 시작할 때 옵션을 지정해야만 생성할 수 있지만, jmap은 jstat처럼 프로세스 id만 알고 있으면 메모리 단면을 생성할 수 있다.

| 옵션 | 내용 |
| :--- | :--- |
| -dump:\[live,\] format=b,file= | 메모리 단면을 생성한다. 만약 format을 b로 지정하면 바이너리 형태의 파일을 생성하며, file 옵션에 지정된 파일 이름으로 생성한다. |
| -finalizerinfo | finalization을 기다리는, 즉 GC가 되려고 기다리고 있는 객체들의 정보를 출력한다. |
| -clstats | 클래스 로더의 통계 정보를 제공한다. |
| -histo\[:live\] | 힙 영역의 메모리 점유 상태를 가장 많이 점유한 객체부터 출력한다. 각각의 자바 클래스, 객체 개수, 바이트 단위의 메모리 크기, 전체 클래스 이름 등이 여기에 포함된다. |
| -F | -dump와 -histo 옵션과 같이 사용되며, 덤프가 잘 발생되지 않을 경우 강제로 발생시킬 때 사용한다. |

## 자동으로 힙 덤프 생성시키기

자동으로 메모리 단면인 힙 덤프를 생성시키는 방법이 있다. 아무 경우에나 생성시키는 것이 아니라, OutOfMemoryError가 발생했을 때 생성시키도록 할 수가 있다. 자바 실행 옵션에

```text
-XX:+HeapDumpOnOutOfMemoryError
```

라는 옵션을 추가해 놓으면, 해당 자바 프로세스에서 OutOfMemoryError가 발생할 경우 힙 덤프를 자동으로 발생시킨다. 기본적으로 이 옵션은 자바 프로세스를 실행한 위치에 덤프 파일을 생성시킨다. 그래서 여러분들이 원하는 위치에 정보를 저장하기 위해서는

```text
-XX:HeapDumpPath=경로
```

옵션으로 위치를 지정하여 사용하면 된다. 여기서 중요한 것 중의 하나가 이 옵션은 경로를 지정한다는 것이다. 간혹 이 값을 파일로 지정하는 분들이 있는데, 그렇게 되면 메모리 단면 파일은 생성되지 않는다. 이 값은 디렉터리 경로다

```text
public class HoldMemoryOOM {
    private final static Map<String, String> leakMap = new HashMap<>();
    private final static String STORE_DATA = "STORE DATA";

    private StringBuffer sb = new StringBuffer();

    public void addObject(int objectCount){
        int mapSize = leakMap.size();
        int maxCount = mapSize + objectCount;
        for (int loop = mapSize; loop < maxCount; loop++){
            leakMap.put(STORE_DATA + loop, STORE_DATA + loop * 5);
            sb.append(STORE_DATA);
        }
    }

    public static void main(String[] args) {
        HoldMemoryOOM holdMemoryOOM = new HoldMemoryOOM();
        holdMemoryOOM.addObject(5000000);
    }
}
```

이제 이 자바 클래스를 다음과 같은 옵션으로 수행하자

```text
> java -Xms128m -Xmx128m -XX:+HeapDumpOutOfMemoryError -XX:HeapDumpPath=/tmp HoldMemory
```

![https://s3-us-west-2.amazonaws.com/secure.notion-static.com/cb5550ed-d452-41e0-988a-7ec852ee8c37/Untitled.png](https://s3-us-west-2.amazonaws.com/secure.notion-static.com/cb5550ed-d452-41e0-988a-7ec852ee8c37/Untitled.png)

또 한 가지 옵션이 있다. 먼저, 옵션을 보자

```text
-XX: OnOutOfMemoryError="명령어"
```

이렇게 OnOutOfMemoryError 옵션을 추가하면 OutOfMemoryError가 발생했을 때 수행되는 명령어나 스크립트를 명시할 수 있다.

```text
> java -XXonOutOfMemoryError="gcore -o gcore.dump %p" 클래스 이름
```

