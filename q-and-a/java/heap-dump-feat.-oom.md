# heap dump 분석하기 (feat. OOM)

## heap dump 분석하기 (feat. OOM)



<figure><img src="../../.gitbook/assets/1 (15).png" alt=""><figcaption></figcaption></figure>

## heap dump 파일은 무엇이지?

* JVM 기반의 애플리케이션을 운영하다보면 간혹 트러블슈팅 과정에서 heap dump 파일을 분석하여 오류를 해결하는 케이스를 들어본 경험이 있을 것이다
* 힙 메모리는 임의로 생성한 객체들이 동적으로 할당되는 공간을 일컫는데 힙 덤프 파일은 운영중인 애플리케이션의 힙 메모리 영역을 스냅샷으로 기록한 내역을 저장한 파일을 일컫는다

## 그럼 heap dump 파일은 언제 생성하지?

* 모든 경우에 스냅샷을 생성할 필요는 없다
* 런타임시 OOM(Out Of Memory)이 발생하는 경우에 스냅샷을 생성하고 파일 내용을 분석하면 된다

### OOM은 어떤 경우에 발생하는가?

#### OutOfMemotyError : Java Heap space

* 힙 영역에 공간이 부족할 경우에 발생한다. 가장 많이 확인되는 케이스일 것이다
*   힙 영역에 대한 공간 확보는 GC를 통해서 이루어지는데, GC를 수행하기 이전에 힙 메모리 영역이 부족할 경우에 발생한다.

    ```jsx
    public class JavaHeapSpace {
      public static void main(String[] args) throws Exception {
        String[] array = new String[100000 * 100000];
      }
    }
    ```

#### OutOfMemotyError : GC Overhead limit exceeded

* GC를 진행하는데 CPU 98%이상 사용되고, CG 이후에 2% 미만으로 복구 되었을 경우다.
*   이전과 유사하게 자주 발생하는 이슈로 무분별하게 객체를 생성할 경우에 발생한다. 문제점을 해결하고, 경우에 따라 메모리 사이즈를 늘리는것을 추천한다

    ```jsx
    public class GCOverhead {
      public static void main(String[] args) throws Exception {
        Map<Long, Long> map = new HashMap<>();
        for (long i = 0l; i < Long.MAX_VALUE; i++) {
          map.put(i, i);
        }
      }
    }
    ```

#### OutOfMemotyError : Requested array size exceeds VM limit

* 힙 영역보다 더 큰 영역의 배열을 할당할 경우 발생한다
*   배열 사이즈를 조정하거나 메모리 사이즈를 증가시켜 해결할 수 있다

    ```jsx
    public class GCOverhead {
      public static void main(String[] args) throws Exception {
        for (int i = 0; i < 10; i++) {
          int[] arr = new int[Integer.MAX_VALUE - 1];
        }
      }
    }
    ```

#### OutOfMemotyError : Metaspace

* Metaspace 영역이 부족할 경우 발생한다
* 클래스의 메타데이터(클래스 이름, 생성정보, 필드정보, 메서드 정보 등)가 저장되는 공간으로 JDK 7 이전에는 PermGen으로 정의되었다
* PermGen 영역은 힙 메모리에 포함되어 적은 범위로 설정되었기 때문에, GC가 빈번히 발생하였으며 이를 개선하고자 메타스페이스 영역으로 변경되었다
* 메타 스페이스 영역으로 개선되면서 힙 메모리 영역을 사용하지 않고 OS에서 제공하는 native 메모리 영역을 사용하므로 GC를 수행하지 않고도 자동으로 크기를 증가시켜 공간을 확보할 수 있게 되었다
* 그래도 자동으로 크기를 증가하는 과정보다 더 많은 메타 데이터들이 저장되면 에러가 발생할 수 있기 때문에 **`-XX:MetaspaceSize`, `-XX:MaxMetaspaceSize`** 설정을 추가하여 오류를 해결할 수 있다 (참고로 설정하지 않았다면 기본값은 20MB이다)

#### OutOfMemoryError: unable to create native thread

* 가용할 쓰레드가 존재하지 않을 경우 발생한다
*   그외에도 다양한 케이스가 있지만 우선은 이정도면 어느정도 해결할수 있는 레벨이라고 본다

    ```jsx
    public class ThreadsLimits {
      public static void main(String[] args) throws Exception {
        while (true) {
          new Thread(
              new Runnable() {
                @Override
                public void run() {
                  try {
                    Thread.sleep(1000 * 60 * 60 * 24);
                  } catch (Exception ex) {}
                }
              }
          ).start();
        }
      }
    }
    ```

## heap dump 파일은 어떻게 생성할 수 있지?

* 힙덤프를 생성하는 방법은 두 가지 이다
* 실시간으로 스냅샷을 생성하거나 OOM이 발생하는 시점에 자동으로 생성하는 경우다

### OOM 발생할 경우에 힙덤프 파일 자동 생성

*   애플리케이션 내부적으로 OOM이 발생하였을 경우 힙덤프 파일을 생성하도록 옵션을 추가할수 있다

    ```jsx
    > java -jar -XX:+HeapDumpOnOutOfMemoryError \\
       -XX:HeapDumpPath=/home/centos/application/dumps/ \\
       -XX:OnOutOfMemoryError="kill -9 %p" \\
       application-0.0.1-SNAPSHOT.jar
    ```
* XX:+HeapDumpOnOutOfMemoryError : OOM이 발생할 경우에 힙덤프 파일을 생성을 한다
* XX:HeapDumpPath : 힙덤프가 생성되는 폴더 경로를 지정한다
* XX:OnOutOfMemoryError : OOM이 발생할 경우, 수행할 스크립트를 지정한다(보통은 OOM이 발생하면 애플리케이션이 다운되기 때문에 재시작 스크립트를 다시 수행하기도 한다)

### 실시간 스냅샷 생성

* 또는 실시간으로 모니터링하다가 스냅샷을 뜰수도 있다
*   스냅샷을 생성하기 위해 실행중인 프로세스 아이디 확인한다\


    ```jsx
    > ps -ef | grep java

    // pid = 2914
    501  2914 58493   0  8:22PM ttys001    0:07.28 /usr/bin/java -jar application-0.0.1-SNAPSHOT.jar
    ```



*   jmap 명령어로 힙덤프 파일 생성하기\


    ```jsx
    > jmap -dump:format=b,file=testdump.hprof ${pid}

    // example
    > jmap -dump:format=b,file=testdump.hprof 2914
    ```

## 그럼 테스트 용도로 OOM을 발생시켜 보자

#### 우선 OOM이 발생할 수 있는 케이스를 구현하기

```jsx
public void test() throws InterruptedException {
  ArrayList list = new ArrayList();
  try {
    for(int i=0; i < 250000; i++) {
      list.add(new int[10000000]); // 리스트에 배열을 추가한다
      System.out.println(i);
      Thread.sleep(1);
    }
  } catch (Exception e) {
    e.printStackTrace();
  }
}
```

#### 그리고 힙덤프 파일을 생성해보자(자동생성 로직 사용해보기)

* 오류를 확인하기 위해 메모리 사이즈를 최소화 하였다.

```jsx
> java -jar -Xms128M -Xmx128M -XX:+HeapDumpOnOutOfMemoryError \\
   -XX:HeapDumpPath=./ \\ // 빌드된 경로에 바로 덤프파일 경로 설정
   -XX:OnOutOfMemoryError="kill -9 %p" \\
   settlement-0.0.1-SNAPSHOT.jar
```

### 메서드를 수행해보자

*   메서드가 수행되고 오류가 발생하는것을 확인할 수 있다.\


    <figure><img src="../../.gitbook/assets/2 (12).png" alt=""><figcaption></figcaption></figure>
*   힙덤프 파일이 생성되었는지 확인해보자 (테스트를 위해 애플리케이션이 실행된 경로에 힙덤프 파일을 생성)\


    <figure><img src="../../.gitbook/assets/3 (10).png" alt=""><figcaption></figcaption></figure>

## 생성된 파일은 어떻게 분석하면 좋을까?

### 이클립스 MAT

*   생성된 파일을 MAT에서 OPEN한다



    <figure><img src="../../.gitbook/assets/4 (7) (1).png" alt=""><figcaption></figcaption></figure>
* Leak Suspect 리포트를 확인해본다
*   메모리 영역에 76% 차지하는 int\[]가 생성되었다고 한다



    <figure><img src="../../.gitbook/assets/5 (8).png" alt=""><figcaption></figcaption></figure>
*   Domiator Tree를 확인해보면 ArrayList에 int\[100000000] 엘리멘트가 생성되었다는 것을 확인할 수 있다



    <figure><img src="../../.gitbook/assets/6 (8) (1).png" alt=""><figcaption></figcaption></figure>
*   메모리를 차지하는 객체는 확인되었고 stacktrace를 통해서 에러가 발생하는 시작점을 확인할수 있다



    <figure><img src="../../.gitbook/assets/7 (6).png" alt=""><figcaption></figcaption></figure>

### VisualVM

*   VisualVM에는 로컬에서 실행되고 있는 애플리케이션을 모니터링 할 수 있고 이미 생성된 힙덤프 파일을 확인할 수 있다



    <figure><img src="../../.gitbook/assets/8 (4).png" alt=""><figcaption></figcaption></figure>
*   요약탭에서 대략적인 내용을 확인할 수 있으며 instance, thread 정보 등을 확인할 수 있다



    <figure><img src="../../.gitbook/assets/9 (4) (1).png" alt=""><figcaption></figcaption></figure>
*   쓰레드 탭에서는 어느 코드라인에서 어떤 객체에서 OOM이 발생했는지 확인할 수 있다



    <figure><img src="../../.gitbook/assets/10 (5).png" alt=""><figcaption></figcaption></figure>

### 인텔리제이 사용

*   인텔리제이에서도 파일을 열어 코드라인이랑 어떤 객체가 메모리를 많이 차지하는지 대략적으로 확인가능하다



    <figure><img src="../../.gitbook/assets/11 (6).png" alt=""><figcaption></figcaption></figure>

## 예방할 수 있는 방법은 없는가?

* OOM은 다양한 케이스에서 발생할 수 있지만 케이스를 확인해보면 무분별하게 객체를 생성하거나 rechable 상태를 유지할 경우에 발생하는게 대부분이다
* 그러므로 코드레벨에서 주의를 기울여 작성하는게 OOM을 예방하기 위한 가장 최선의 방법이다

### 코드 레벨 개선 사항

#### 불변객체로 생성하라

* 불변 객체는 내부 상태가 변하지 않기 때문에 GC에서 reachable 상태인지 수시로 확인할 필요가 없으므로 gc의 부담을 줄일 수 있다
* 그리고 불변 객체는 thread safe하기 때문에 동시성 관련 문제를 피할 수 있다

#### fileInputStream을 사용해라

*   **`FileInputStream`** 을 사용하여 파일 처리 시 메모리 사용량을 효율적으로 관리하고 OOM 오류를 방지할 수 있다.

    ```jsx
    try (FileInputStream fis = new FileInputStream("your_file_path")) {
        byte[] buffer = new byte[4096]; // 또는 적절한 크기로 조정
        int bytesRead;
        while ((bytesRead = fis.read(buffer)) != -1) {
            // buffer를 이용한 작업 수행
        }
    } catch (IOException e) {
        // 예외 처리
    }
    ```

#### resource를 반납했는지 확인해라

*   Java에서 **`finally`** 블록을 사용하여 스트림을 명시적으로 닫는 것은 메모리 관리와 리소스 관리에 도움이된다. 또는, JDK 8 이후부터는 **`try-with-resources`** 구문으로 대체할 수 있다. 이는 스트림을 명시적으로 닫을 수 있으니 리소스 누수를 방지할 수 있다.

    ```jsx
    public class StreamExample {
        public static void main(String[] args) {
            try (FileInputStream fis = new FileInputStream("file.txt")) {
                // 스트림을 이용하여 파일 읽기 작업 수행
            } catch (IOException e) {
                // 예외 처리
            }
        }
    }
    ```

#### 스트림을 사용해라

* Stream API는 함수형 프로그래밍 스타일을 지원하며, 중간 연산과 최종 연산을 사용하여 데이터를 스트림으로 처리하여 대용량 데이터를 효율적으로 처리할 수 있다.
* Stream API가 OOM를 해결하는 데 도움이 되는 특징은 다음과 같다
  * Lazy Evaluation : 중간 연산들은 실제로 데이터를 처리하지 않고, 최종 연산이 호출될 때에만 데이터를 처리하기 때문에 대용량 데이터를 한 번에 모두 메모리에 적재하지 않고 처리할 수 있다
  * Pipelining : Stream API는 연속적인 연산들을 파이프라이닝하여 데이터를 순차적으로 처리하기 때문에 중간 연산들에 대한 결과를 임시적으로 저장하지 않고도 메모리 사용을 최적화할 수 있다
  * Parallel Processing : 적절한 상황에서 데이터를 여러 스레드로 나누어 병렬 처리가 가능하다

### 충분한 메모리 확보

* 코드를 OOM 발생하지 않도록 작성하는 것도 중요하지만 애플리케이션 가용범위 내에 인프라 리소스를 적절하게 사용하고 있는지 확인해봐야 한다

#### 메모리 사이즈를 지정하자

* 애플리케이션을 실행할 때 최대/최소 메모리 사이즈를 지정해주면 좋다 (Xmx : 최대 메모리 사이즈, Xms : 초기 메모리 사이즈)
* 만약 설정하지 않았다면 최대 메모리 사이즈는 서버의 가용 메모리의 1/4이고, 최소 메모리 사이즈는 서버의 가용 메모리의 1/64 정도로 설정된다

{% hint style="info" %}
💡 만약 메모리가 8 GB의 인스턴스에서 아무런 설정 없이 애플리케이션을 운영한다면?

최대 메모리 사이즈 : 8GB / 4 = 2GB 초기 메모리 사이즈 : 8GB / 64 = 127MB
{% endhint %}



*   실제로 운영되는 애플리케이션의 메모리 사이즈를 확인하려면 `java -XX:+PrintFlagsFinal -version 2>&1 | grep -i -E 'heapsize|metaspacesize|version` 명령어를 실행하면 현재 설정된 메모리 사이즈를 확인할 수 있다.



    <figure><img src="../../.gitbook/assets/12 (4).png" alt=""><figcaption></figcaption></figure>
* 최대 / 최소 메모리 사이즈를 결정하는 기준은 딱히 없다. 나는 일반적으로는 인스턴스에 애플리케이션 하나만 운영된다면 전체 리소스에 1/2 정도로 측정하고 최대/최소 메모리는 같게 설정하는 것 같다



{% hint style="info" %}
💡 최대 / 최소 메모리 사이즈는 같아야 할까?

같아야 한다. 최소 메모리 사이즈는 초기 메모리 사이즈를 의미한다. 초기 메모리 사이즈에서 어느정도 메모리가 가득차면 GC가 발생하고 메모리 사이즈를 조금씩 올리는 형태로 최대 메모리 사이즈까지 증가하게 된다. 그러므로 초기에 최대 메모리 사이즈까지 설정하면 그만큼 GC가 덜 발생하게 된다. 그렇다고 하더라도 너무 크게 사이즈를 설정하면 한번 GC가 발생할때 부하가 크게 발생할 수 있으니 적절한 사이즈를 알아보는게 좋다!!
{% endhint %}

#### young generation 영역을 좀 더 확보하자

* 결국 STW가 발생하는 것은 Young Gen → Old Gen으로 옮기는 과정인 Major GC 에서 발생한다
* 그러므로 Young Gen 영역에서 발생하는 Minor GC를 적극적으로 활용하면 STW를 줄일 수 있다
* 그렇기때문에 Young Gen은 Old Gen의 2배로 설정하는게 효율적이다 (-XX:NewRadio=2)
* 그리고 Survivor 영역은 Young Gen에 8/1 정도로 설정하는걸 권장한다고 한다 (-XX:SurvivorRatio=8)

{% hint style="info" %}
💡 oracle 문서에서 발췌

You can use the parameter SurvivorRatio can be used to tune the size of the survivor spaces, but this is often not important for performance. For example, -XX:SurvivorRatio=6 sets the ratio between eden and a survivor space to 1:6. In other words, each survivor space will be one-sixth the size of eden, and thus one-eighth the size of the young generation (not one-seventh, because there are two survivor spaces).
{% endhint %}



#### GC 로그를 남겨 놓자&#x20;

* GC 이력을 로그 파일로 남길 수 있다
* `Xloggc` 옵션으로 필요한 정보를 남길 수 있도록 하자
* `-Xloggc:gc-%t.log` : 로깅할 파일을 지정한다
* `-XX:+PrintGCDetails` : GC 상세 내역을 기록한다(JDK 11 이후에는 -Xlog:gc=info 파라미터만 추가)
* `-XX:+PrintGCDateStamps` : GC 발생 시간을 기록한다(JDK 11 이후에는 decorator 옵션으로 변경)
* JDK 11이후에 로그 관련 옵션들이 변경되어 [https://programmer.group/analysis-and-use-of-the-log-related-parameters-of-openjdk-11-jvm.html](https://programmer.group/analysis-and-use-of-the-log-related-parameters-of-openjdk-11-jvm.html) 참고하면 좋을 듯 하다

```jsx
> java -jar -Xlog:gc=info:gc-%t.log:time
   -XX:HeapDumpPath=./  
   -XX:OnOutOfMemoryError="kill -9 %p" 
   -XX:+HeapDumpOnOutOfMemoryError 
   ./application-SNAPSHOT.jar
```

*   GC 로그 내역을 확인해보자



    <figure><img src="../../.gitbook/assets/13 (2).png" alt=""><figcaption></figcaption></figure>

## 결론

* 힙덤프를 분석하여 트러블슈팅 하는 경험은 많지는 않을 것이다
* 보통은 서비스 가용 범위 내에 적절한 리소스를 할당했다면 몇 년동안에도 경험해보지 못할수도 있다
* 그래도 JVM 기반 애플리케이션을 운영한다면 반드시 겪어야 할 시련이 될것이다
* 앞으로 올 시련에 대비하여 사전에 예습해보고 현명하게 대처할 준비는 되어 있어야 한다
* 추후에 비슷한 트러블슈팅을 하게되면 포스팅하도록 하겠다 😇

## 참고

* [https://docs.oracle.com/javase/8/docs/technotes/guides/troubleshoot/memleaks002.html](https://docs.oracle.com/javase/8/docs/technotes/guides/troubleshoot/memleaks002.html)
* [https://sematext.com/blog/java-lang-outofmemoryerror/](https://sematext.com/blog/java-lang-outofmemoryerror/)
* [http://honeymon.io/tech/2019/05/30/java-memory-leak-analysis.html](http://honeymon.io/tech/2019/05/30/java-memory-leak-analysis.html)
* [https://blog.voidmainvoid.net/210](https://blog.voidmainvoid.net/210)
* [https://seunghyunson.tistory.com/23](https://seunghyunson.tistory.com/23)
