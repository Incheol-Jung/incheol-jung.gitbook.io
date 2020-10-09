# CHAP 09. 스레드 단면 잘라 놓기

스레드에서 발생하는 모든 문제점들을 쉽게 찾을 수 있는 도구는 많지 않다. 그중에서 데드록이 발생했거나 록이 걸려 여러 스레드가 그 록이 풀리기만을 기다리고 있을 때, 문제를 찾는 가장 좋은 방법이 바로 스레드 단면을 확인하는 것이 간단하다. 게다가 시스템의 CPU가 100%에 도달하면 대부분의 모니터링 도구가 무용지물이 되기 때문에, 스레드 단면을 만들고 이해하는 방법을 알아 두는 것은 매우 중요하다.

## 스레드 단면은 언제 자를까?

현재 운영 중인 시스템에 문제가 있을 때, APM 같은 도구들이 없다면 반드시 스레드 단면을 잘라 봐야 한다. 그것도 한 번으로는 부족하다. 적어도 두 번, 많으면 10~30초에 한 번씩 적어도 열번 정도는 단명을 생성해서 확인 작업을 수행해야만 한다. 스레드 단면을 분석하면 다음의 경우에 매우 빨리 원인을 찾을 수 있다.

* 모든 시스템이 응답이 없을 때\(전문가들은 시스템 행이 걸렸다고 말한다\)
* 사용자 수가 많지도 않은데, 시스템의 CPU 사용량이 떨어지지 않을 떄
* 특정 애플리케이션을 수행했는데, 전혀 응답이 없을 때
* 기타 여러 가지 상황에서 시스템이 내 마음대로 작동하지 않을 때

## 스레드 단면이 뭐길래

스레드 단면은 보통 스레드 덤프라고 한다. 스레드 덤프를 생성하는 명령어를 수행하면, 수행한 그 시점에 JVM에서 수행되고 있는 모든 스레드가 무슨 일을 하고 있는지 알 수 있다.

다음의 샘플 프로그램을 보자

```text
public class MakeThreads {

    public static void main(String[] args) {
        for(int loop =0; loop < 3; loop++){
            LoopingThread thread  = new LoopingThread();
            thread.start();
        }
        System.out.println("Started looping threads..." + " You must stop this process after test...");
    }
}
class LoopingThread extends Thread {

    @Override
    public void run() {
        int runCount = 100;
        while (true) {
            try {
                String string = new String("AAA");
                List<String> list = new ArrayList<>(runCount);
                for(int loop =0; loop < runCount; loop++){
                    list.add(string);
                }
                Map<String, Integer> hashMap = new HashMap<>(runCount);
                for(int loop = 0; loop < runCount; loop++){
                    hashMap.put(string + loop, loop);
                }
            } catch (Exception e){
                e.printStackTrace();
            }
        }
    }
}
```

#### 이제 소스를 실행해보자

```text
> javac com/example/practice/threadDump/MakeThreads.java
> java com/example/practice/threadDump/MakeThreads

Started looping threads... You must stop this process after test...
```

## 스레드 단면 생성하기

방법은 간단하다.

1. 클래스 파일의 결과 로그를 특정 파일에 작성한다.

   ```text
   java com/example/practice/threadDump/MakeThreads > ThreadDump.txt
   ```

2. control + \ 키를 누르면 스레드 단면을 생성 할 수 있다.

   ```text
   // ThreadDump.txt

   2020-09-30 17:44:26
   Full thread dump Java HotSpot(TM) 64-Bit Server VM (25.201-b09 mixed mode):

   "DestroyJavaVM" #13 prio=5 os_prio=31 tid=0x00007fb233800000 nid=0x1903 waiting on condition [0x0000000000000000]
      java.lang.Thread.State: RUNNABLE

   "Thread-2" #12 prio=5 os_prio=31 tid=0x00007fb2310bc800 nid=0x5803 runnable [0x0000700008a31000]
      java.lang.Thread.State: RUNNABLE
   	at com.example.practice.threadDump.LoopingThread.run(MakeThreads.java:34)

   "Thread-1" #11 prio=5 os_prio=31 tid=0x00007fb2310bb800 nid=0xa903 runnable [0x000070000892e000]
      java.lang.Thread.State: RUNNABLE
   	at com.example.practice.threadDump.LoopingThread.run(MakeThreads.java:34)

   "Thread-0" #10 prio=5 os_prio=31 tid=0x00007fb2310bb000 nid=0x5503 runnable [0x000070000882b000]
      java.lang.Thread.State: RUNNABLE
   	at com.example.practice.threadDump.LoopingThread.run(MakeThreads.java:34)

   "Service Thread" #9 daemon prio=9 os_prio=31 tid=0x00007fb231829000 nid=0x4303 runnable [0x0000000000000000]
      java.lang.Thread.State: RUNNABLE

   "C1 CompilerThread3" #8 daemon prio=9 os_prio=31 tid=0x00007fb230805000 nid=0x4403 waiting on condition [0x0000000000000000]
      java.lang.Thread.State: RUNNABLE

   "C2 CompilerThread2" #7 daemon prio=9 os_prio=31 tid=0x00007fb231827800 nid=0x3d03 waiting on condition [0x0000000000000000]
      java.lang.Thread.State: RUNNABLE

   "C2 CompilerThread1" #6 daemon prio=9 os_prio=31 tid=0x00007fb232016800 nid=0x3b03 waiting on condition [0x0000000000000000]
      java.lang.Thread.State: RUNNABLE

   "C2 CompilerThread0" #5 daemon prio=9 os_prio=31 tid=0x00007fb231048800 nid=0x3903 waiting on condition [0x0000000000000000]
      java.lang.Thread.State: RUNNABLE

   "Signal Dispatcher" #4 daemon prio=9 os_prio=31 tid=0x00007fb231036800 nid=0x3703 waiting on condition [0x0000000000000000]
      java.lang.Thread.State: RUNNABLE

   "Finalizer" #3 daemon prio=8 os_prio=31 tid=0x00007fb231825800 nid=0x4903 in Object.wait() [0x0000700008013000]
      java.lang.Thread.State: WAITING (on object monitor)
   	at java.lang.Object.wait(Native Method)
   	- waiting on <0x00000006c000a470> (a java.lang.ref.ReferenceQueue$Lock)
   	at java.lang.ref.ReferenceQueue.remove(ReferenceQueue.java:144)
   	- locked <0x00000006c000a470> (a java.lang.ref.ReferenceQueue$Lock)
   	at java.lang.ref.ReferenceQueue.remove(ReferenceQueue.java:165)
   	at java.lang.ref.Finalizer$FinalizerThread.run(Finalizer.java:216)

   "Reference Handler" #2 daemon prio=10 os_prio=31 tid=0x00007fb231824800 nid=0x4a03 in Object.wait() [0x0000700007f10000]
      java.lang.Thread.State: WAITING (on object monitor)
   	at java.lang.Object.wait(Native Method)
   	- waiting on <0x00000006c0004d00> (a java.lang.ref.Reference$Lock)
   	at java.lang.Object.wait(Object.java:502)
   	at java.lang.ref.Reference.tryHandlePending(Reference.java:191)
   	- locked <0x00000006c0004d00> (a java.lang.ref.Reference$Lock)
   	at java.lang.ref.Reference$ReferenceHandler.run(Reference.java:153)

   "VM Thread" os_prio=31 tid=0x00007fb231030000 nid=0x4c03 runnable 

   "GC task thread#0 (ParallelGC)" os_prio=31 tid=0x00007fb231803800 nid=0x1f07 runnable 

   "GC task thread#1 (ParallelGC)" os_prio=31 tid=0x00007fb231804000 nid=0x2a03 runnable 

   "GC task thread#2 (ParallelGC)" os_prio=31 tid=0x00007fb231804800 nid=0x5403 runnable 

   "GC task thread#3 (ParallelGC)" os_prio=31 tid=0x00007fb231805000 nid=0x2c03 runnable 

   "GC task thread#4 (ParallelGC)" os_prio=31 tid=0x00007fb231806000 nid=0x5203 runnable 

   "GC task thread#5 (ParallelGC)" os_prio=31 tid=0x00007fb231806800 nid=0x5003 runnable 

   "GC task thread#6 (ParallelGC)" os_prio=31 tid=0x00007fb231807000 nid=0x4f03 runnable 

   "GC task thread#7 (ParallelGC)" os_prio=31 tid=0x00007fb231807800 nid=0x4e03 runnable 

   "VM Periodic Task Thread" os_prio=31 tid=0x00007fb23182a000 nid=0x4103 waiting on condition 

   JNI global references: 5

   Heap
    PSYoungGen      total 573440K, used 91534K [0x000000076ab00000, 0x00000007bc980000, 0x00000007c0000000)
     eden space 572928K, 15% used [0x000000076ab00000,0x000000077043bab8,0x000000078da80000)
     from space 512K, 31% used [0x00000007bc900000,0x00000007bc928000,0x00000007bc980000)
     to   space 512K, 0% used [0x00000007bc880000,0x00000007bc880000,0x00000007bc900000)
    ParOldGen       total 175104K, used 344K [0x00000006c0000000, 0x00000006cab00000, 0x000000076ab00000)
     object space 175104K, 0% used [0x00000006c0000000,0x00000006c0056050,0x00000006cab00000)
    Metaspace       used 2680K, capacity 4486K, committed 4864K, reserved 1056768K
     class space    used 288K, capacity 386K, committed 512K, reserved 1048576K
   ```

## jstack을 사용하는 방법도 있다

kill 명령어를 사용하는 것이 불안하다면, 자바에서 기본적으로 제공하는 jstack이라는 명령어를 사용하는 방법도 있다. jstack 명령어를 수행하면 특정 프로세스의 단면을 생성하라고 강제로 지시하는 명령어다.

```text
> lsof -i TCP:8080
COMMAND   PID        USER   FD   TYPE             DEVICE SIZE/OFF NODE NAME
java    30011 incheoljung   62u  IPv6 0x399eb3c263471ea7      0t0  TCP *:http-alt (LISTEN)

> jstack 30011
2020-09-30 18:05:37
Full thread dump OpenJDK 64-Bit Server VM (13.0.2+8 mixed mode, sharing):

Threads class SMR info:
_java_thread_list=0x00007fb64eece5d0, length=35, elements={
0x00007fb64c813800, 0x00007fb64c804000, 0x00007fb64d0c7800, 0x00007fb64f808800,
0x00007fb64d803800, 0x00007fb64f81b000, 0x00007fb64e0ad800, 0x00007fb64f017000,
0x00007fb64f81c000, 0x00007fb650081000, 0x00007fb64f016000, 0x00007fb64f99c800,
0x00007fb64fa24000, 0x00007fb64fa25800, 0x00007fb6500b9800, 0x00007fb64c92d800,
0x00007fb650119800, 0x00007fb6500b5000, 0x00007fb64fa23000, 0x00007fb65011a000,
0x00007fb65011b000, 0x00007fb65011e800, 0x00007fb64d8b7000, 0x00007fb64d8c2800,
0x00007fb650845000, 0x00007fb64f9cc800, 0x00007fb64f9cd800, 0x00007fb64f9ce000,
0x00007fb64f9cf000, 0x00007fb64f9d0000, 0x00007fb64f9d1000, 0x00007fb650002800,
0x00007fb650057000, 0x00007fb65011c000, 0x00007fb64c816000
}

"Reference Handler" #2 daemon prio=10 os_prio=31 cpu=1.30ms elapsed=112.17s tid=0x00007fb64c813800 nid=0x4603 waiting on condition  [0x00007000025de000]
   java.lang.Thread.State: RUNNABLE
        at java.lang.ref.Reference.waitForReferencePendingList(java.base@13.0.2/Native Method)
        at java.lang.ref.Reference.processPendingReferences(java.base@13.0.2/Reference.java:241)
        at java.lang.ref.Reference$ReferenceHandler.run(java.base@13.0.2/Reference.java:213)

"Finalizer" #3 daemon prio=8 os_prio=31 cpu=0.25ms elapsed=112.17s tid=0x00007fb64c804000 nid=0x3d03 in Object.wait()  [0x00007000026e1000]
   java.lang.Thread.State: WAITING (on object monitor)
        at java.lang.Object.wait(java.base@13.0.2/Native Method)
        - waiting on <0x00000007001bcc78> (a java.lang.ref.ReferenceQueue$Lock)
        at java.lang.ref.ReferenceQueue.remove(java.base@13.0.2/ReferenceQueue.java:155)
        - locked <0x00000007001bcc78> (a java.lang.ref.ReferenceQueue$Lock)
        at java.lang.ref.ReferenceQueue.remove(java.base@13.0.2/ReferenceQueue.java:176)
        at java.lang.ref.Finalizer$FinalizerThread.run(java.base@13.0.2/Finalizer.java:170)

"Signal Dispatcher" #4 daemon prio=9 os_prio=31 cpu=0.24ms elapsed=112.16s tid=0x00007fb64d0c7800 nid=0x5603 runnable  [0x0000000000000000]
   java.lang.Thread.State: RUNNABLE

"C1 CompilerThread0" #5 daemon prio=9 os_prio=31 cpu=1383.76ms elapsed=112.16s tid=0x00007fb64f808800 nid=0x5803 waiting on condition  [0x0000000000000000]
   java.lang.Thread.State: RUNNABLE
   No compile task

"Sweeper thread" #9 daemon prio=9 os_prio=31 cpu=16.41ms elapsed=112.16s tid=0x00007fb64d803800 nid=0xa603 runnable  [0x0000000000000000]
   java.lang.Thread.State: RUNNABLE

"Common-Cleaner" #10 daemon prio=8 os_prio=31 cpu=1.72ms elapsed=112.13s tid=0x00007fb64f81b000 nid=0xa403 in Object.wait()  [0x0000700002aed000]
   java.lang.Thread.State: TIMED_WAITING (on object monitor)
        at java.lang.Object.wait(java.base@13.0.2/Native Method)
        - waiting on <0x00000007001c3bd8> (a java.lang.ref.ReferenceQueue$Lock)
        at java.lang.ref.ReferenceQueue.remove(java.base@13.0.2/ReferenceQueue.java:155)
        - locked <0x00000007001c3bd8> (a java.lang.ref.ReferenceQueue$Lock)
        at jdk.internal.ref.CleanerImpl.run(java.base@13.0.2/CleanerImpl.java:148)
        at java.lang.Thread.run(java.base@13.0.2/Thread.java:830)
        at jdk.internal.misc.InnocuousThread.run(java.base@13.0.2/InnocuousThread.java:134)

"Monitor Ctrl-Break" #11 daemon prio=5 os_prio=31 cpu=39.65ms elapsed=112.03s tid=0x00007fb64e0ad800 nid=0x5b03 runnable  [0x0000700002bf0000]
   java.lang.Thread.State: RUNNABLE
        at sun.nio.ch.SocketDispatcher.read0(java.base@13.0.2/Native Method)
        at sun.nio.ch.SocketDispatcher.read(java.base@13.0.2/SocketDispatcher.java:47)
        at sun.nio.ch.NioSocketImpl.tryRead(java.base@13.0.2/NioSocketImpl.java:262)
        at sun.nio.ch.NioSocketImpl.implRead(java.base@13.0.2/NioSocketImpl.java:313)
        at sun.nio.ch.NioSocketImpl.read(java.base@13.0.2/NioSocketImpl.java:351)
        at sun.nio.ch.NioSocketImpl$1.read(java.base@13.0.2/NioSocketImpl.java:802)
        at java.net.Socket$SocketInputStream.read(java.base@13.0.2/Socket.java:937)
        at sun.nio.cs.StreamDecoder.readBytes(java.base@13.0.2/StreamDecoder.java:297)
        at sun.nio.cs.StreamDecoder.implRead(java.base@13.0.2/StreamDecoder.java:339)
        at sun.nio.cs.StreamDecoder.read(java.base@13.0.2/StreamDecoder.java:188)
        - locked <0x00000007001bc560> (a java.io.InputStreamReader)
        at java.io.InputStreamReader.read(java.base@13.0.2/InputStreamReader.java:185)
        at java.io.BufferedReader.fill(java.base@13.0.2/BufferedReader.java:161)
        at java.io.BufferedReader.readLine(java.base@13.0.2/BufferedReader.java:326)
        - locked <0x00000007001bc560> (a java.io.InputStreamReader)
        at java.io.BufferedReader.readLine(java.base@13.0.2/BufferedReader.java:392)
        at com.intellij.rt.execution.application.AppMainV2$1.run(AppMainV2.java:61)

"Service Thread" #12 daemon prio=9 os_prio=31 cpu=0.29ms elapsed=112.03s tid=0x00007fb64f017000 nid=0xa203 runnable  [0x0000000000000000]
   java.lang.Thread.State: RUNNABLE

"RMI TCP Accept-0" #14 daemon prio=5 os_prio=31 cpu=9.52ms elapsed=111.57s tid=0x00007fb64f81c000 nid=0x6003 runnable  [0x0000700002df6000]
   java.lang.Thread.State: RUNNABLE
        at sun.nio.ch.Net.accept(java.base@13.0.2/Native Method)
        at sun.nio.ch.NioSocketImpl.accept(java.base@13.0.2/NioSocketImpl.java:755)
        at java.net.ServerSocket.implAccept(java.base@13.0.2/ServerSocket.java:662)
        at java.net.ServerSocket.platformImplAccept(java.base@13.0.2/ServerSocket.java:628)
        at java.net.ServerSocket.implAccept(java.base@13.0.2/ServerSocket.java:604)
        at java.net.ServerSocket.implAccept(java.base@13.0.2/ServerSocket.java:561)
        at java.net.ServerSocket.accept(java.base@13.0.2/ServerSocket.java:518)
        at sun.management.jmxremote.LocalRMIServerSocketFactory$1.accept(jdk.management.agent@13.0.2/LocalRMIServerSocketFactory.java:52)
        at sun.rmi.transport.tcp.TCPTransport$AcceptLoop.executeAcceptLoop(java.rmi@13.0.2/TCPTransport.java:394)
        at sun.rmi.transport.tcp.TCPTransport$AcceptLoop.run(java.rmi@13.0.2/TCPTransport.java:366)
        at java.lang.Thread.run(java.base@13.0.2/Thread.java:830)

"logback-2" #19 daemon prio=5 os_prio=31 cpu=1.12ms elapsed=110.92s tid=0x00007fb650081000 nid=0x6407 waiting on condition  [0x0000700002ffc000]
   java.lang.Thread.State: TIMED_WAITING (parking)
        at jdk.internal.misc.Unsafe.park(java.base@13.0.2/Native Method)
        - parking to wait for  <0x00000007005050a0> (a java.util.concurrent.locks.AbstractQueuedSynchronizer$ConditionObject)
        at java.util.concurrent.locks.LockSupport.parkNanos(java.base@13.0.2/LockSupport.java:235)
        at java.util.concurrent.locks.AbstractQueuedSynchronizer$ConditionObject.awaitNanos(java.base@13.0.2/AbstractQueuedSynchronizer.java:2123)
        at java.util.concurrent.ScheduledThreadPoolExecutor$DelayedWorkQueue.take(java.base@13.0.2/ScheduledThreadPoolExecutor.java:1182)
        at java.util.concurrent.ScheduledThreadPoolExecutor$DelayedWorkQueue.take(java.base@13.0.2/ScheduledThreadPoolExecutor.java:899)
        at java.util.concurrent.ThreadPoolExecutor.getTask(java.base@13.0.2/ThreadPoolExecutor.java:1054)
        at java.util.concurrent.ThreadPoolExecutor.runWorker(java.base@13.0.2/ThreadPoolExecutor.java:1114)
        at java.util.concurrent.ThreadPoolExecutor$Worker.run(java.base@13.0.2/ThreadPoolExecutor.java:628)
        at java.lang.Thread.run(java.base@13.0.2/Thread.java:830)

"Attach Listener" #21 daemon prio=9 os_prio=31 cpu=10.55ms elapsed=110.60s tid=0x00007fb64f016000 nid=0x9a07 waiting on condition  [0x0000000000000000]
   java.lang.Thread.State: RUNNABLE

"RMI Scheduler(0)" #24 daemon prio=5 os_prio=31 cpu=0.19ms elapsed=110.47s tid=0x00007fb64f99c800 nid=0x7603 waiting on condition  [0x0000700003c20000]
   java.lang.Thread.State: TIMED_WAITING (parking)
        at jdk.internal.misc.Unsafe.park(java.base@13.0.2/Native Method)
        - parking to wait for  <0x00000007001113d0> (a java.util.concurrent.locks.AbstractQueuedSynchronizer$ConditionObject)
        at java.util.concurrent.locks.LockSupport.parkNanos(java.base@13.0.2/LockSupport.java:235)
        at java.util.concurrent.locks.AbstractQueuedSynchronizer$ConditionObject.awaitNanos(java.base@13.0.2/AbstractQueuedSynchronizer.java:2123)
        at java.util.concurrent.ScheduledThreadPoolExecutor$DelayedWorkQueue.take(java.base@13.0.2/ScheduledThreadPoolExecutor.java:1182)
        at java.util.concurrent.ScheduledThreadPoolExecutor$DelayedWorkQueue.take(java.base@13.0.2/ScheduledThreadPoolExecutor.java:899)
        at java.util.concurrent.ThreadPoolExecutor.getTask(java.base@13.0.2/ThreadPoolExecutor.java:1054)
        at java.util.concurrent.ThreadPoolExecutor.runWorker(java.base@13.0.2/ThreadPoolExecutor.java:1114)
        at java.util.concurrent.ThreadPoolExecutor$Worker.run(java.base@13.0.2/ThreadPoolExecutor.java:628)
        at java.lang.Thread.run(java.base@13.0.2/Thread.java:830)

"HikariPool-1 housekeeper" #28 daemon prio=5 os_prio=31 cpu=2.21ms elapsed=109.22s tid=0x00007fb64fa24000 nid=0x940f waiting on condition  [0x0000700003e26000]
   java.lang.Thread.State: TIMED_WAITING (parking)
        at jdk.internal.misc.Unsafe.park(java.base@13.0.2/Native Method)
        - parking to wait for  <0x000000070e292a68> (a java.util.concurrent.locks.AbstractQueuedSynchronizer$ConditionObject)
        at java.util.concurrent.locks.LockSupport.parkNanos(java.base@13.0.2/LockSupport.java:235)
        at java.util.concurrent.locks.AbstractQueuedSynchronizer$ConditionObject.awaitNanos(java.base@13.0.2/AbstractQueuedSynchronizer.java:2123)
        at java.util.concurrent.ScheduledThreadPoolExecutor$DelayedWorkQueue.take(java.base@13.0.2/ScheduledThreadPoolExecutor.java:1182)
        at java.util.concurrent.ScheduledThreadPoolExecutor$DelayedWorkQueue.take(java.base@13.0.2/ScheduledThreadPoolExecutor.java:899)
        at java.util.concurrent.ThreadPoolExecutor.getTask(java.base@13.0.2/ThreadPoolExecutor.java:1054)
        at java.util.concurrent.ThreadPoolExecutor.runWorker(java.base@13.0.2/ThreadPoolExecutor.java:1114)
        at java.util.concurrent.ThreadPoolExecutor$Worker.run(java.base@13.0.2/ThreadPoolExecutor.java:628)
        at java.lang.Thread.run(java.base@13.0.2/Thread.java:830)

"Catalina-utility-1" #29 prio=1 os_prio=31 cpu=20.96ms elapsed=109.17s tid=0x00007fb64fa25800 nid=0x9003 waiting on condition  [0x0000700003f29000]
   java.lang.Thread.State: WAITING (parking)
        at jdk.internal.misc.Unsafe.park(java.base@13.0.2/Native Method)
        - parking to wait for  <0x0000000701672220> (a java.util.concurrent.locks.AbstractQueuedSynchronizer$ConditionObject)
        at java.util.concurrent.locks.LockSupport.park(java.base@13.0.2/LockSupport.java:194)
        at java.util.concurrent.locks.AbstractQueuedSynchronizer$ConditionObject.await(java.base@13.0.2/AbstractQueuedSynchronizer.java:2081)
        at java.util.concurrent.ScheduledThreadPoolExecutor$DelayedWorkQueue.take(java.base@13.0.2/ScheduledThreadPoolExecutor.java:1177)
        at java.util.concurrent.ScheduledThreadPoolExecutor$DelayedWorkQueue.take(java.base@13.0.2/ScheduledThreadPoolExecutor.java:899)
        at java.util.concurrent.ThreadPoolExecutor.getTask(java.base@13.0.2/ThreadPoolExecutor.java:1054)
        at java.util.concurrent.ThreadPoolExecutor.runWorker(java.base@13.0.2/ThreadPoolExecutor.java:1114)
        at java.util.concurrent.ThreadPoolExecutor$Worker.run(java.base@13.0.2/ThreadPoolExecutor.java:628)
        at org.apache.tomcat.util.threads.TaskThread$WrappingRunnable.run(TaskThread.java:61)
        at java.lang.Thread.run(java.base@13.0.2/Thread.java:830)

"Catalina-utility-2" #30 prio=1 os_prio=31 cpu=19.94ms elapsed=109.17s tid=0x00007fb6500b9800 nid=0x8e03 waiting on condition  [0x000070000402c000]
   java.lang.Thread.State: TIMED_WAITING (parking)
        at jdk.internal.misc.Unsafe.park(java.base@13.0.2/Native Method)
        - parking to wait for  <0x0000000701672220> (a java.util.concurrent.locks.AbstractQueuedSynchronizer$ConditionObject)
        at java.util.concurrent.locks.LockSupport.parkNanos(java.base@13.0.2/LockSupport.java:235)
        at java.util.concurrent.locks.AbstractQueuedSynchronizer$ConditionObject.awaitNanos(java.base@13.0.2/AbstractQueuedSynchronizer.java:2123)
        at java.util.concurrent.ScheduledThreadPoolExecutor$DelayedWorkQueue.take(java.base@13.0.2/ScheduledThreadPoolExecutor.java:1182)
        at java.util.concurrent.ScheduledThreadPoolExecutor$DelayedWorkQueue.take(java.base@13.0.2/ScheduledThreadPoolExecutor.java:899)
        at java.util.concurrent.ThreadPoolExecutor.getTask(java.base@13.0.2/ThreadPoolExecutor.java:1054)
        at java.util.concurrent.ThreadPoolExecutor.runWorker(java.base@13.0.2/ThreadPoolExecutor.java:1114)
        at java.util.concurrent.ThreadPoolExecutor$Worker.run(java.base@13.0.2/ThreadPoolExecutor.java:628)
        at org.apache.tomcat.util.threads.TaskThread$WrappingRunnable.run(TaskThread.java:61)
        at java.lang.Thread.run(java.base@13.0.2/Thread.java:830)

"container-0" #31 prio=5 os_prio=31 cpu=0.67ms elapsed=109.17s tid=0x00007fb64c92d800 nid=0x7b03 waiting on condition  [0x000070000412f000]
   java.lang.Thread.State: TIMED_WAITING (sleeping)
        at java.lang.Thread.sleep(java.base@13.0.2/Native Method)
        at org.apache.catalina.core.StandardServer.await(StandardServer.java:570)
        at org.springframework.boot.web.embedded.tomcat.TomcatWebServer$1.run(TomcatWebServer.java:197)

"File Watcher" #35 daemon prio=5 os_prio=31 cpu=577.12ms elapsed=108.77s tid=0x00007fb650119800 nid=0x8707 waiting on condition  [0x0000700004438000]
   java.lang.Thread.State: TIMED_WAITING (sleeping)
        at java.lang.Thread.sleep(java.base@13.0.2/Native Method)
        at org.springframework.boot.devtools.filewatch.FileSystemWatcher$Watcher.scan(FileSystemWatcher.java:250)
        at org.springframework.boot.devtools.filewatch.FileSystemWatcher$Watcher.run(FileSystemWatcher.java:234)
        at java.lang.Thread.run(java.base@13.0.2/Thread.java:830)

"Live Reload Server" #37 daemon prio=5 os_prio=31 cpu=0.19ms elapsed=108.76s tid=0x00007fb6500b5000 nid=0x8507 runnable  [0x000070000453b000]
   java.lang.Thread.State: RUNNABLE
        at sun.nio.ch.Net.accept(java.base@13.0.2/Native Method)
        at sun.nio.ch.NioSocketImpl.accept(java.base@13.0.2/NioSocketImpl.java:755)
        at java.net.ServerSocket.implAccept(java.base@13.0.2/ServerSocket.java:662)
        at java.net.ServerSocket.platformImplAccept(java.base@13.0.2/ServerSocket.java:628)
        at java.net.ServerSocket.implAccept(java.base@13.0.2/ServerSocket.java:604)
        at java.net.ServerSocket.implAccept(java.base@13.0.2/ServerSocket.java:561)
        at java.net.ServerSocket.accept(java.base@13.0.2/ServerSocket.java:518)
        at org.springframework.boot.devtools.livereload.LiveReloadServer.acceptConnections(LiveReloadServer.java:145)
        at org.springframework.boot.devtools.livereload.LiveReloadServer$$Lambda$616/0x0000000800f23c40.run(Unknown Source)
        at java.lang.Thread.run(java.base@13.0.2/Thread.java:830)

"http-nio-8080-BlockPoller" #38 daemon prio=5 os_prio=31 cpu=11.30ms elapsed=108.72s tid=0x00007fb64fa23000 nid=0x8303 runnable  [0x000070000463e000]
   java.lang.Thread.State: RUNNABLE
        at sun.nio.ch.KQueue.poll(java.base@13.0.2/Native Method)
        at sun.nio.ch.KQueueSelectorImpl.doSelect(java.base@13.0.2/KQueueSelectorImpl.java:122)
        at sun.nio.ch.SelectorImpl.lockAndDoSelect(java.base@13.0.2/SelectorImpl.java:124)
        - locked <0x0000000706487430> (a sun.nio.ch.Util$2)
        - locked <0x0000000706487258> (a sun.nio.ch.KQueueSelectorImpl)
        at sun.nio.ch.SelectorImpl.select(java.base@13.0.2/SelectorImpl.java:136)
        at org.apache.tomcat.util.net.NioBlockingSelector$BlockPoller.run(NioBlockingSelector.java:313)

"http-nio-8080-exec-1" #39 daemon prio=5 os_prio=31 cpu=0.17ms elapsed=108.72s tid=0x00007fb65011a000 nid=0xaa03 waiting on condition  [0x0000700004741000]
   java.lang.Thread.State: WAITING (parking)
        at jdk.internal.misc.Unsafe.park(java.base@13.0.2/Native Method)
        - parking to wait for  <0x00000007064ce048> (a java.util.concurrent.locks.AbstractQueuedSynchronizer$ConditionObject)
        at java.util.concurrent.locks.LockSupport.park(java.base@13.0.2/LockSupport.java:194)
        at java.util.concurrent.locks.AbstractQueuedSynchronizer$ConditionObject.await(java.base@13.0.2/AbstractQueuedSynchronizer.java:2081)
        at java.util.concurrent.LinkedBlockingQueue.take(java.base@13.0.2/LinkedBlockingQueue.java:433)
        at org.apache.tomcat.util.threads.TaskQueue.take(TaskQueue.java:107)
        at org.apache.tomcat.util.threads.TaskQueue.take(TaskQueue.java:33)
        at java.util.concurrent.ThreadPoolExecutor.getTask(java.base@13.0.2/ThreadPoolExecutor.java:1054)
        at java.util.concurrent.ThreadPoolExecutor.runWorker(java.base@13.0.2/ThreadPoolExecutor.java:1114)
        at java.util.concurrent.ThreadPoolExecutor$Worker.run(java.base@13.0.2/ThreadPoolExecutor.java:628)
        at org.apache.tomcat.util.threads.TaskThread$WrappingRunnable.run(TaskThread.java:61)
        at java.lang.Thread.run(java.base@13.0.2/Thread.java:830)

"http-nio-8080-exec-2" #40 daemon prio=5 os_prio=31 cpu=0.15ms elapsed=108.72s tid=0x00007fb65011b000 nid=0xac03 waiting on condition  [0x0000700004844000]
   java.lang.Thread.State: WAITING (parking)
        at jdk.internal.misc.Unsafe.park(java.base@13.0.2/Native Method)
        - parking to wait for  <0x00000007064ce048> (a java.util.concurrent.locks.AbstractQueuedSynchronizer$ConditionObject)
        at java.util.concurrent.locks.LockSupport.park(java.base@13.0.2/LockSupport.java:194)
        at java.util.concurrent.locks.AbstractQueuedSynchronizer$ConditionObject.await(java.base@13.0.2/AbstractQueuedSynchronizer.java:2081)
        at java.util.concurrent.LinkedBlockingQueue.take(java.base@13.0.2/LinkedBlockingQueue.java:433)
        at org.apache.tomcat.util.threads.TaskQueue.take(TaskQueue.java:107)
        at org.apache.tomcat.util.threads.TaskQueue.take(TaskQueue.java:33)
        at java.util.concurrent.ThreadPoolExecutor.getTask(java.base@13.0.2/ThreadPoolExecutor.java:1054)
        at java.util.concurrent.ThreadPoolExecutor.runWorker(java.base@13.0.2/ThreadPoolExecutor.java:1114)
        at java.util.concurrent.ThreadPoolExecutor$Worker.run(java.base@13.0.2/ThreadPoolExecutor.java:628)
        at org.apache.tomcat.util.threads.TaskThread$WrappingRunnable.run(TaskThread.java:61)
        at java.lang.Thread.run(java.base@13.0.2/Thread.java:830)

"http-nio-8080-exec-3" #41 daemon prio=5 os_prio=31 cpu=0.17ms elapsed=108.72s tid=0x00007fb65011e800 nid=0x15203 waiting on condition  [0x0000700004947000]
   java.lang.Thread.State: WAITING (parking)
        at jdk.internal.misc.Unsafe.park(java.base@13.0.2/Native Method)
        - parking to wait for  <0x00000007064ce048> (a java.util.concurrent.locks.AbstractQueuedSynchronizer$ConditionObject)
        at java.util.concurrent.locks.LockSupport.park(java.base@13.0.2/LockSupport.java:194)
        at java.util.concurrent.locks.AbstractQueuedSynchronizer$ConditionObject.await(java.base@13.0.2/AbstractQueuedSynchronizer.java:2081)
        at java.util.concurrent.LinkedBlockingQueue.take(java.base@13.0.2/LinkedBlockingQueue.java:433)
        at org.apache.tomcat.util.threads.TaskQueue.take(TaskQueue.java:107)
        at org.apache.tomcat.util.threads.TaskQueue.take(TaskQueue.java:33)
        at java.util.concurrent.ThreadPoolExecutor.getTask(java.base@13.0.2/ThreadPoolExecutor.java:1054)
        at java.util.concurrent.ThreadPoolExecutor.runWorker(java.base@13.0.2/ThreadPoolExecutor.java:1114)
        at java.util.concurrent.ThreadPoolExecutor$Worker.run(java.base@13.0.2/ThreadPoolExecutor.java:628)
        at org.apache.tomcat.util.threads.TaskThread$WrappingRunnable.run(TaskThread.java:61)
        at java.lang.Thread.run(java.base@13.0.2/Thread.java:830)

"http-nio-8080-exec-4" #42 daemon prio=5 os_prio=31 cpu=0.16ms elapsed=108.72s tid=0x00007fb64d8b7000 nid=0x14f03 waiting on condition  [0x0000700004a4a000]
   java.lang.Thread.State: WAITING (parking)
        at jdk.internal.misc.Unsafe.park(java.base@13.0.2/Native Method)
        - parking to wait for  <0x00000007064ce048> (a java.util.concurrent.locks.AbstractQueuedSynchronizer$ConditionObject)
        at java.util.concurrent.locks.LockSupport.park(java.base@13.0.2/LockSupport.java:194)
        at java.util.concurrent.locks.AbstractQueuedSynchronizer$ConditionObject.await(java.base@13.0.2/AbstractQueuedSynchronizer.java:2081)
        at java.util.concurrent.LinkedBlockingQueue.take(java.base@13.0.2/LinkedBlockingQueue.java:433)
        at org.apache.tomcat.util.threads.TaskQueue.take(TaskQueue.java:107)
        at org.apache.tomcat.util.threads.TaskQueue.take(TaskQueue.java:33)
        at java.util.concurrent.ThreadPoolExecutor.getTask(java.base@13.0.2/ThreadPoolExecutor.java:1054)
        at java.util.concurrent.ThreadPoolExecutor.runWorker(java.base@13.0.2/ThreadPoolExecutor.java:1114)
        at java.util.concurrent.ThreadPoolExecutor$Worker.run(java.base@13.0.2/ThreadPoolExecutor.java:628)
        at org.apache.tomcat.util.threads.TaskThread$WrappingRunnable.run(TaskThread.java:61)
        at java.lang.Thread.run(java.base@13.0.2/Thread.java:830)

"http-nio-8080-exec-5" #43 daemon prio=5 os_prio=31 cpu=0.17ms elapsed=108.72s tid=0x00007fb64d8c2800 nid=0xaf03 waiting on condition  [0x0000700004b4d000]
   java.lang.Thread.State: WAITING (parking)
        at jdk.internal.misc.Unsafe.park(java.base@13.0.2/Native Method)
        - parking to wait for  <0x00000007064ce048> (a java.util.concurrent.locks.AbstractQueuedSynchronizer$ConditionObject)
        at java.util.concurrent.locks.LockSupport.park(java.base@13.0.2/LockSupport.java:194)
        at java.util.concurrent.locks.AbstractQueuedSynchronizer$ConditionObject.await(java.base@13.0.2/AbstractQueuedSynchronizer.java:2081)
        at java.util.concurrent.LinkedBlockingQueue.take(java.base@13.0.2/LinkedBlockingQueue.java:433)
        at org.apache.tomcat.util.threads.TaskQueue.take(TaskQueue.java:107)
        at org.apache.tomcat.util.threads.TaskQueue.take(TaskQueue.java:33)
        at java.util.concurrent.ThreadPoolExecutor.getTask(java.base@13.0.2/ThreadPoolExecutor.java:1054)
        at java.util.concurrent.ThreadPoolExecutor.runWorker(java.base@13.0.2/ThreadPoolExecutor.java:1114)
        at java.util.concurrent.ThreadPoolExecutor$Worker.run(java.base@13.0.2/ThreadPoolExecutor.java:628)
        at org.apache.tomcat.util.threads.TaskThread$WrappingRunnable.run(TaskThread.java:61)
        at java.lang.Thread.run(java.base@13.0.2/Thread.java:830)

"http-nio-8080-exec-6" #44 daemon prio=5 os_prio=31 cpu=0.13ms elapsed=108.72s tid=0x00007fb650845000 nid=0x14c03 waiting on condition  [0x0000700004c50000]
   java.lang.Thread.State: WAITING (parking)
        at jdk.internal.misc.Unsafe.park(java.base@13.0.2/Native Method)
        - parking to wait for  <0x00000007064ce048> (a java.util.concurrent.locks.AbstractQueuedSynchronizer$ConditionObject)
        at java.util.concurrent.locks.LockSupport.park(java.base@13.0.2/LockSupport.java:194)
        at java.util.concurrent.locks.AbstractQueuedSynchronizer$ConditionObject.await(java.base@13.0.2/AbstractQueuedSynchronizer.java:2081)
        at java.util.concurrent.LinkedBlockingQueue.take(java.base@13.0.2/LinkedBlockingQueue.java:433)
        at org.apache.tomcat.util.threads.TaskQueue.take(TaskQueue.java:107)
        at org.apache.tomcat.util.threads.TaskQueue.take(TaskQueue.java:33)
        at java.util.concurrent.ThreadPoolExecutor.getTask(java.base@13.0.2/ThreadPoolExecutor.java:1054)
        at java.util.concurrent.ThreadPoolExecutor.runWorker(java.base@13.0.2/ThreadPoolExecutor.java:1114)
        at java.util.concurrent.ThreadPoolExecutor$Worker.run(java.base@13.0.2/ThreadPoolExecutor.java:628)
        at org.apache.tomcat.util.threads.TaskThread$WrappingRunnable.run(TaskThread.java:61)
        at java.lang.Thread.run(java.base@13.0.2/Thread.java:830)

"http-nio-8080-exec-7" #45 daemon prio=5 os_prio=31 cpu=0.11ms elapsed=108.72s tid=0x00007fb64f9cc800 nid=0x14903 waiting on condition  [0x0000700004d53000]
   java.lang.Thread.State: WAITING (parking)
        at jdk.internal.misc.Unsafe.park(java.base@13.0.2/Native Method)
        - parking to wait for  <0x00000007064ce048> (a java.util.concurrent.locks.AbstractQueuedSynchronizer$ConditionObject)
        at java.util.concurrent.locks.LockSupport.park(java.base@13.0.2/LockSupport.java:194)
        at java.util.concurrent.locks.AbstractQueuedSynchronizer$ConditionObject.await(java.base@13.0.2/AbstractQueuedSynchronizer.java:2081)
        at java.util.concurrent.LinkedBlockingQueue.take(java.base@13.0.2/LinkedBlockingQueue.java:433)
        at org.apache.tomcat.util.threads.TaskQueue.take(TaskQueue.java:107)
        at org.apache.tomcat.util.threads.TaskQueue.take(TaskQueue.java:33)
        at java.util.concurrent.ThreadPoolExecutor.getTask(java.base@13.0.2/ThreadPoolExecutor.java:1054)
        at java.util.concurrent.ThreadPoolExecutor.runWorker(java.base@13.0.2/ThreadPoolExecutor.java:1114)
        at java.util.concurrent.ThreadPoolExecutor$Worker.run(java.base@13.0.2/ThreadPoolExecutor.java:628)
        at org.apache.tomcat.util.threads.TaskThread$WrappingRunnable.run(TaskThread.java:61)
        at java.lang.Thread.run(java.base@13.0.2/Thread.java:830)

"http-nio-8080-exec-8" #46 daemon prio=5 os_prio=31 cpu=0.12ms elapsed=108.72s tid=0x00007fb64f9cd800 nid=0xb203 waiting on condition  [0x0000700004e56000]
   java.lang.Thread.State: WAITING (parking)
        at jdk.internal.misc.Unsafe.park(java.base@13.0.2/Native Method)
        - parking to wait for  <0x00000007064ce048> (a java.util.concurrent.locks.AbstractQueuedSynchronizer$ConditionObject)
        at java.util.concurrent.locks.LockSupport.park(java.base@13.0.2/LockSupport.java:194)
        at java.util.concurrent.locks.AbstractQueuedSynchronizer$ConditionObject.await(java.base@13.0.2/AbstractQueuedSynchronizer.java:2081)
        at java.util.concurrent.LinkedBlockingQueue.take(java.base@13.0.2/LinkedBlockingQueue.java:433)
        at org.apache.tomcat.util.threads.TaskQueue.take(TaskQueue.java:107)
        at org.apache.tomcat.util.threads.TaskQueue.take(TaskQueue.java:33)
        at java.util.concurrent.ThreadPoolExecutor.getTask(java.base@13.0.2/ThreadPoolExecutor.java:1054)
        at java.util.concurrent.ThreadPoolExecutor.runWorker(java.base@13.0.2/ThreadPoolExecutor.java:1114)
        at java.util.concurrent.ThreadPoolExecutor$Worker.run(java.base@13.0.2/ThreadPoolExecutor.java:628)
        at org.apache.tomcat.util.threads.TaskThread$WrappingRunnable.run(TaskThread.java:61)
        at java.lang.Thread.run(java.base@13.0.2/Thread.java:830)

"http-nio-8080-exec-9" #47 daemon prio=5 os_prio=31 cpu=0.14ms elapsed=108.72s tid=0x00007fb64f9ce000 nid=0x14603 waiting on condition  [0x0000700004f59000]
   java.lang.Thread.State: WAITING (parking)
        at jdk.internal.misc.Unsafe.park(java.base@13.0.2/Native Method)
        - parking to wait for  <0x00000007064ce048> (a java.util.concurrent.locks.AbstractQueuedSynchronizer$ConditionObject)
        at java.util.concurrent.locks.LockSupport.park(java.base@13.0.2/LockSupport.java:194)
        at java.util.concurrent.locks.AbstractQueuedSynchronizer$ConditionObject.await(java.base@13.0.2/AbstractQueuedSynchronizer.java:2081)
        at java.util.concurrent.LinkedBlockingQueue.take(java.base@13.0.2/LinkedBlockingQueue.java:433)
        at org.apache.tomcat.util.threads.TaskQueue.take(TaskQueue.java:107)
        at org.apache.tomcat.util.threads.TaskQueue.take(TaskQueue.java:33)
        at java.util.concurrent.ThreadPoolExecutor.getTask(java.base@13.0.2/ThreadPoolExecutor.java:1054)
        at java.util.concurrent.ThreadPoolExecutor.runWorker(java.base@13.0.2/ThreadPoolExecutor.java:1114)
        at java.util.concurrent.ThreadPoolExecutor$Worker.run(java.base@13.0.2/ThreadPoolExecutor.java:628)
        at org.apache.tomcat.util.threads.TaskThread$WrappingRunnable.run(TaskThread.java:61)
        at java.lang.Thread.run(java.base@13.0.2/Thread.java:830)

"http-nio-8080-exec-10" #48 daemon prio=5 os_prio=31 cpu=0.14ms elapsed=108.72s tid=0x00007fb64f9cf000 nid=0xb503 waiting on condition  [0x000070000505c000]
   java.lang.Thread.State: WAITING (parking)
        at jdk.internal.misc.Unsafe.park(java.base@13.0.2/Native Method)
        - parking to wait for  <0x00000007064ce048> (a java.util.concurrent.locks.AbstractQueuedSynchronizer$ConditionObject)
        at java.util.concurrent.locks.LockSupport.park(java.base@13.0.2/LockSupport.java:194)
        at java.util.concurrent.locks.AbstractQueuedSynchronizer$ConditionObject.await(java.base@13.0.2/AbstractQueuedSynchronizer.java:2081)
        at java.util.concurrent.LinkedBlockingQueue.take(java.base@13.0.2/LinkedBlockingQueue.java:433)
        at org.apache.tomcat.util.threads.TaskQueue.take(TaskQueue.java:107)
        at org.apache.tomcat.util.threads.TaskQueue.take(TaskQueue.java:33)
        at java.util.concurrent.ThreadPoolExecutor.getTask(java.base@13.0.2/ThreadPoolExecutor.java:1054)
        at java.util.concurrent.ThreadPoolExecutor.runWorker(java.base@13.0.2/ThreadPoolExecutor.java:1114)
        at java.util.concurrent.ThreadPoolExecutor$Worker.run(java.base@13.0.2/ThreadPoolExecutor.java:628)
        at org.apache.tomcat.util.threads.TaskThread$WrappingRunnable.run(TaskThread.java:61)
        at java.lang.Thread.run(java.base@13.0.2/Thread.java:830)

"http-nio-8080-ClientPoller" #49 daemon prio=5 os_prio=31 cpu=12.09ms elapsed=108.72s tid=0x00007fb64f9d0000 nid=0xb603 runnable  [0x000070000515f000]
   java.lang.Thread.State: RUNNABLE
        at sun.nio.ch.KQueue.poll(java.base@13.0.2/Native Method)
        at sun.nio.ch.KQueueSelectorImpl.doSelect(java.base@13.0.2/KQueueSelectorImpl.java:122)
        at sun.nio.ch.SelectorImpl.lockAndDoSelect(java.base@13.0.2/SelectorImpl.java:124)
        - locked <0x00000007064e7778> (a sun.nio.ch.Util$2)
        - locked <0x00000007064e7620> (a sun.nio.ch.KQueueSelectorImpl)
        at sun.nio.ch.SelectorImpl.select(java.base@13.0.2/SelectorImpl.java:136)
        at org.apache.tomcat.util.net.NioEndpoint$Poller.run(NioEndpoint.java:708)
        at java.lang.Thread.run(java.base@13.0.2/Thread.java:830)

"http-nio-8080-Acceptor" #50 daemon prio=5 os_prio=31 cpu=0.34ms elapsed=108.72s tid=0x00007fb64f9d1000 nid=0x14003 runnable  [0x0000700005262000]
   java.lang.Thread.State: RUNNABLE
        at sun.nio.ch.Net.accept(java.base@13.0.2/Native Method)
        at sun.nio.ch.ServerSocketChannelImpl.accept(java.base@13.0.2/ServerSocketChannelImpl.java:276)
        at org.apache.tomcat.util.net.NioEndpoint.serverSocketAccept(NioEndpoint.java:468)
        at org.apache.tomcat.util.net.NioEndpoint.serverSocketAccept(NioEndpoint.java:71)
        at org.apache.tomcat.util.net.Acceptor.run(Acceptor.java:95)
        at java.lang.Thread.run(java.base@13.0.2/Thread.java:830)

"DestroyJavaVM" #52 prio=5 os_prio=31 cpu=700.14ms elapsed=108.66s tid=0x00007fb650002800 nid=0x2203 waiting on condition  [0x0000000000000000]
   java.lang.Thread.State: RUNNABLE

"logback-3" #58 daemon prio=5 os_prio=31 cpu=0.75ms elapsed=80.92s tid=0x00007fb650057000 nid=0x7d07 waiting on condition  [0x0000700003711000]
   java.lang.Thread.State: WAITING (parking)
        at jdk.internal.misc.Unsafe.park(java.base@13.0.2/Native Method)
        - parking to wait for  <0x00000007005050a0> (a java.util.concurrent.locks.AbstractQueuedSynchronizer$ConditionObject)
        at java.util.concurrent.locks.LockSupport.park(java.base@13.0.2/LockSupport.java:194)
        at java.util.concurrent.locks.AbstractQueuedSynchronizer$ConditionObject.await(java.base@13.0.2/AbstractQueuedSynchronizer.java:2081)
        at java.util.concurrent.ScheduledThreadPoolExecutor$DelayedWorkQueue.take(java.base@13.0.2/ScheduledThreadPoolExecutor.java:1177)
        at java.util.concurrent.ScheduledThreadPoolExecutor$DelayedWorkQueue.take(java.base@13.0.2/ScheduledThreadPoolExecutor.java:899)
        at java.util.concurrent.ThreadPoolExecutor.getTask(java.base@13.0.2/ThreadPoolExecutor.java:1054)
        at java.util.concurrent.ThreadPoolExecutor.runWorker(java.base@13.0.2/ThreadPoolExecutor.java:1114)
        at java.util.concurrent.ThreadPoolExecutor$Worker.run(java.base@13.0.2/ThreadPoolExecutor.java:628)
        at java.lang.Thread.run(java.base@13.0.2/Thread.java:830)

"logback-4" #59 daemon prio=5 os_prio=31 cpu=0.20ms elapsed=50.92s tid=0x00007fb65011c000 nid=0x6f0b waiting on condition  [0x0000700004232000]
   java.lang.Thread.State: WAITING (parking)
        at jdk.internal.misc.Unsafe.park(java.base@13.0.2/Native Method)
        - parking to wait for  <0x00000007005050a0> (a java.util.concurrent.locks.AbstractQueuedSynchronizer$ConditionObject)
        at java.util.concurrent.locks.LockSupport.park(java.base@13.0.2/LockSupport.java:194)
        at java.util.concurrent.locks.AbstractQueuedSynchronizer$ConditionObject.await(java.base@13.0.2/AbstractQueuedSynchronizer.java:2081)
        at java.util.concurrent.ScheduledThreadPoolExecutor$DelayedWorkQueue.take(java.base@13.0.2/ScheduledThreadPoolExecutor.java:1177)
        at java.util.concurrent.ScheduledThreadPoolExecutor$DelayedWorkQueue.take(java.base@13.0.2/ScheduledThreadPoolExecutor.java:899)
        at java.util.concurrent.ThreadPoolExecutor.getTask(java.base@13.0.2/ThreadPoolExecutor.java:1054)
        at java.util.concurrent.ThreadPoolExecutor.runWorker(java.base@13.0.2/ThreadPoolExecutor.java:1114)
        at java.util.concurrent.ThreadPoolExecutor$Worker.run(java.base@13.0.2/ThreadPoolExecutor.java:628)
        at java.lang.Thread.run(java.base@13.0.2/Thread.java:830)

"logback-5" #60 daemon prio=5 os_prio=31 cpu=0.23ms elapsed=20.93s tid=0x00007fb64c816000 nid=0x980b waiting on condition  [0x0000700003b1d000]
   java.lang.Thread.State: WAITING (parking)
        at jdk.internal.misc.Unsafe.park(java.base@13.0.2/Native Method)
        - parking to wait for  <0x00000007005050a0> (a java.util.concurrent.locks.AbstractQueuedSynchronizer$ConditionObject)
        at java.util.concurrent.locks.LockSupport.park(java.base@13.0.2/LockSupport.java:194)
        at java.util.concurrent.locks.AbstractQueuedSynchronizer$ConditionObject.await(java.base@13.0.2/AbstractQueuedSynchronizer.java:2081)
        at java.util.concurrent.ScheduledThreadPoolExecutor$DelayedWorkQueue.take(java.base@13.0.2/ScheduledThreadPoolExecutor.java:1177)
        at java.util.concurrent.ScheduledThreadPoolExecutor$DelayedWorkQueue.take(java.base@13.0.2/ScheduledThreadPoolExecutor.java:899)
        at java.util.concurrent.ThreadPoolExecutor.getTask(java.base@13.0.2/ThreadPoolExecutor.java:1054)
        at java.util.concurrent.ThreadPoolExecutor.runWorker(java.base@13.0.2/ThreadPoolExecutor.java:1114)
        at java.util.concurrent.ThreadPoolExecutor$Worker.run(java.base@13.0.2/ThreadPoolExecutor.java:628)
        at java.lang.Thread.run(java.base@13.0.2/Thread.java:830)

"VM Thread" os_prio=31 cpu=35.91ms elapsed=112.18s tid=0x00007fb64d0c6800 nid=0x3803 runnable  

"GC Thread#0" os_prio=31 cpu=32.18ms elapsed=112.19s tid=0x00007fb650036800 nid=0x5203 runnable  

"GC Thread#1" os_prio=31 cpu=27.48ms elapsed=111.20s tid=0x00007fb64d0eb800 nid=0x9f03 runnable  

"GC Thread#2" os_prio=31 cpu=30.13ms elapsed=111.20s tid=0x00007fb64d0de000 nid=0x6503 runnable  

"GC Thread#3" os_prio=31 cpu=34.69ms elapsed=111.20s tid=0x00007fb64d014800 nid=0x6703 runnable  

"GC Thread#4" os_prio=31 cpu=27.67ms elapsed=111.20s tid=0x00007fb64d1b0000 nid=0x6903 runnable  

"GC Thread#5" os_prio=31 cpu=31.77ms elapsed=111.20s tid=0x00007fb64d1b0800 nid=0x6a03 runnable  

"GC Thread#6" os_prio=31 cpu=24.80ms elapsed=110.91s tid=0x00007fb64f81f800 nid=0x7203 runnable  

"GC Thread#7" os_prio=31 cpu=14.32ms elapsed=110.91s tid=0x00007fb64f820000 nid=0x7403 runnable  

"G1 Main Marker" os_prio=31 cpu=0.29ms elapsed=112.19s tid=0x00007fb64f81a000 nid=0x5003 runnable  

"G1 Conc#0" os_prio=31 cpu=8.70ms elapsed=112.19s tid=0x00007fb64d009800 nid=0x4d03 runnable  

"G1 Conc#1" os_prio=31 cpu=8.51ms elapsed=109.95s tid=0x00007fb6500a8000 nid=0x9307 runnable  

"G1 Refine#0" os_prio=31 cpu=4.43ms elapsed=112.18s tid=0x00007fb64d0b7800 nid=0x3403 runnable  

"G1 Young RemSet Sampling" os_prio=31 cpu=35.89ms elapsed=112.18s tid=0x00007fb64d0b8000 nid=0x3503 runnable  
"VM Periodic Task Thread" os_prio=31 cpu=91.02ms elapsed=111.56s tid=0x00007fb64f023000 nid=0xa103 waiting on condition  

JNI global refs: 19, weak refs: 0
```

## 스레드 단면 해부하기

본격적으로 스레드 단면이 어떻게 되어 있는지 순서를 살펴보자

1. 스레드 단면 생성 시간 정보
2. JVM에 대한 정보
3. 각 스레드의 스택을 포함한 다양한 정보
   * 스레드 이름
   * 식별자: 데몬 스레드일 경우에만 표시
   * 스레드 우선순위: 가장 낮은 것이 1, 높은 것이 10이다.
   * 스레드 ID\(tid\): 다른 스레드와 구분되는 스레드의 ID를 나타낸다. 정확하게 말하면, 해당 스레드가 점유하는 메모리의 주소를 표시한다.
   * 네이티브 스레드 ID\(nid\): OS에서 관리하는 스레드의 ID를 나타낸다.
   * 스레드의 상태: 스레드 단면을 생성할 때 해당 스레드가 하고 있던 작업에 대한 설명
   * 주소 범위: 스레드의 스택 영역의 예상된 주소 범위
4. 데드록에 대한 정보
5. 힙 영역의 사용 현황

## 참고

* [https://docs.oracle.com/en/java/javase/11/tools/jstack.html\#GUID-721096FC-237B-473C-A461-DBBBB79E4F6A](https://docs.oracle.com/en/java/javase/11/tools/jstack.html#GUID-721096FC-237B-473C-A461-DBBBB79E4F6A)
* [https://github.com/sparameswaran/threadlogic/releases/tag/v2.5.2](https://github.com/sparameswaran/threadlogic/releases/tag/v2.5.2)

