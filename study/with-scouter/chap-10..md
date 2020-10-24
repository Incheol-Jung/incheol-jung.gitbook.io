---
description: '자바 트러블슈팅: scouter를 활용한 시스템 장애 진단 및 해결 노하우를 챕터 10을 요약한 내용입니다.'
---

# CHAP 10. 잘라 놓은 스레드 단면 분석하기

## ThreadLogic 준비하기

스레드 단면을 분석하는 도구 중 ThreadLogic이라는 도구를 추천한다. 왜냐하면 이 도구는 스레드 분석용으로 매우 강력한 기능을 제공하면서도 전혀 복잡하지 않다. 게다가 무료 버전인 데다 GNU 라이선스를 따른다.

### ThreadLogic 특징

* 여러 개의 스레드 단면 파일을 동시에 분석할 수 있다.
* 잠김\(lock\) 현상이 발생한 스레드를 매우 쉽게 추적할 수 있다.
* 오랫동안 수행되는 스레드가 있을 때\(무한 루프가 발생하였을 때\) 매우 쉽게 찾을 수 있다.

## ThreadLogic 사용하기 - 스레드 목록 확인

![](../../.gitbook/assets/111%20%2815%29.png)

### 스레드 단면의 노드를 확장해 보자

![](../../.gitbook/assets/222%20%2811%29.png)

* Threads: 모든 스레드의 목록
* Threads sleeping on Monitors: 대기 중인\(sleeping\) 스레드의 목록
* Threads locking Monitors: 잠겨 있는 스레드의 목록
* Monitors: 이 메뉴 역시 잠겨 있는 스레드의 목록을 보여주지만, 모든 잠김의 원인이 되는 스레드를 식별하기 쉽게 해준다.

## ThreadLogic 사용하기 - 잠겨 있는 스레드 확인

이전에 사용한 예제는 여러 스레드에서 동일한 리소스를 접근하지 않기 때문에\(각각의 스레드가 서로 상관없이 수행되기 땜ㄴ에\), 잠겨 있는 스레드를 확인하는 예제로 적당하지 않다. 하나의 리소스에 접근하는 예제 소스를 살펴보자.

```text
/**
 * @author Incheol Jung
 */
public class MultiLockingThreads {

    public static void main(String[] args) {
        for(int loop = 0; loop < 10; loop++){
            LockThread thread = new LockThread();
            thread.start();
        }
    }
}
class LockThread extends Thread {

    @Override
    public void run() {
        while (true) {
            IncreaseNumber.increase();
        }
    }
}
class IncreaseNumber {
    private static long count = 0;
    public static synchronized void increase() {
        count++;
    }
}
```

LockThread 클래스에서는 가장 아래에 있는 IncreaseNumber 클래스의 increase\(\) 메서드가 무한 루프를 돌면서 count의 값을 증가시킨다. 이 increase\(\) 메서드가 syncronized로 선언되어 있기 때문에 여러 스레드에서 이 메서드를 접근하면 록이 발생한다.

### ThreadLogic으로 생성된 쓰레드 덤프를 확인해보자

Monitors를 클릭한 이후에 오른쪽에 빨간색으로 표시되어 있는 IncreaseNumber 클래스와 관련된 내용을 ㅎ해당 화면에서 확인해보면 잠그고 있는 스레드와 잠근 스레드 때문에 기다리고 있는 다른 스레드들의 목록이 나타난 것을 확인할 수 있다.

![](../../.gitbook/assets/333%20%289%29.png)

참고로 한두 개의 록이 발생한 것만으로 이 부분이 빨간색으로 표시되진 않고, 그 수가 많을 경우에만 빨간색으로 표시된다. 따라서 빨간색으로 표시된 부분이 없다고 해서 그냥 넘어가면 안 된다.

## ThreadLogic 사용하기 - 무한 루프나 응답 없는 화면 확인

무한 루프가 수행되는 스레드가 존재할 경우에는 대부분 해당 로직에서 CPU 하나를 점유하면서 종료되지 않는다. 만약 어떤 서버의 CPU가 네 개일 때 그 로직이 네개의 스레드에서 동시에 수행된다면 그 서버의 CPU 사용량은 100%에서 더 이상 감소되지 않는다. 즉, 잘못 작성한 코드 하나가 전체 시스템을 사용하지 못하게 만드는 대표적인 경우라고 할 수 있다. 게다가 해당 로직에서 점유하는 메모리가 계속 증가한다면, 메모리 릭이 발생하는 것은 시간문제다.

무한 루프 말고도 스레드가 지속해서 수행되는 다른 경우도 많이 있을 수 있겠지만, 그중 하나가 DB와 같은 저장소와 연계된 문제다. DB의 쿼리가 매우 느려서 응답이 오지 않아 기다리고 있는 경우나 가져오는\(fetch하는\) 데이터의 건수가 너무 많아 오랜시간을 지체하는 경우도 문제가 된다.

하지만 무한 루프와 DB와 같은 외부 저장소에서 응답을 하지 않는 경우의 공통점은 하나의 스레드를 지속해서 점유한다는 것이다. 그리고 차이점은 CPU의 점유 여부다. 무한 루프는 CPU를 풀\(full\)로 점유하지만, 이렇게 대기하는 경우는 CPU를 점유하지는 않지만 실행 중\(runnable\) 상태가 유지되어서 스레드가 부족해지거나, DB Connection pool에 가용한 연결이 부족해지는 등의 문제가 발생한다.

### 무한 루프를 발생시키는 예제를 만들어 보자

```text
public class InfinitLoop {

    public static void main(String[] args) {
        Random random = new Random();
        while(true){
            List<String> dummyList = new ArrayList<>();
            for(int loop =0; loop <1000; loop++){
                String temp = "ABCDEFG";
                dummyList.add(temp);
            }
            if (random.nextInt(100000) == 1) break;
        }
    }
}
```

일단 이 프로그램을 수행하고, 10초에 한 번 혹은 30초에 한 번씩 스레드 단면을 생성하자. 수행하면서 리눅스 서버의 다른 창에서 다음의 명령어를 수행해 보자

![](../../.gitbook/assets/444%20%285%29.png)

