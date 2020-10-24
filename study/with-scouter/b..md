---
description: '자바 트러블슈팅: scouter를 활용한 시스템 장애 진단 및 해결 노하우를 부록 B을 요약한 내용입니다.'
---

# 부록 B. 자바 인스트럭션

## JVM 인스트럭션은 도대체 뭘까?

자바 애플리케이션이 어떻게 수행되는지, 내부적으로 어떻게 작동되는지를 알고자한다면, 자바의 인스트럭션 정보를 확인하면 된다. 즉, 컴퓨터의 작동 명령이라고 생각하면 조금 더 이해가 쉬울 것이다. 반드시 장애를 진단하기 위한 작업이 아니더라도, 자바를 개발한다면 인스트럭션에 대해서 어느 정도 알아 두는 것이 좋다. 이 인스트럭션 정보를 확인하는 가장 간단한 방법은 javap라는 명령어를 사용하는 것이다.

```text
public class Hello {
    public void helloInstruction() {
        int a,b;
        a = 10;
        b = 20;
        int c = a + b;
    }
}
```

이 파일을 다음과 같이 컴파일하고 javap를 수행해 보자

```text
Compiled from "Hello.java"
public class com.example.practice.threadDump.Hello {
  public com.example.practice.threadDump.Hello();
  public void helloInstruction();
}
```

자바 소스가 역컴파일되어서 화면에 출력되는 것을 볼 수 있다.

javap는 다양한 옵션이 있다. 옵션을 사용하여 더 상세히 살펴보자.

```text
javap -c -verbose src/main/java/com/example/practice/threadDump/Hello
Warning: File ./src/main/java/com/example/practice/threadDump/Hello.class does not contain class src/main/java/com/example/practice/threadDump/Hello
Classfile /Users/macpro/IncheolJung/Repositories/practice/src/main/java/com/example/practice/threadDump/Hello.class
  Last modified 2020. 10. 2.; size 296 bytes
  SHA-256 checksum b08718c22e21eca2f02ac67a1ec888c0314159f0dba4a201fb2a90e9730c748a
  Compiled from "Hello.java"
public class com.example.practice.threadDump.Hello
  minor version: 0
  major version: 58
  flags: (0x0021) ACC_PUBLIC, ACC_SUPER
  this_class: #7                          // com/example/practice/threadDump/Hello
  super_class: #2                         // java/lang/Object
  interfaces: 0, fields: 0, methods: 2, attributes: 1
Constant pool:
   #1 = Methodref          #2.#3          // java/lang/Object."<init>":()V
   #2 = Class              #4             // java/lang/Object
   #3 = NameAndType        #5:#6          // "<init>":()V
   #4 = Utf8               java/lang/Object
   #5 = Utf8               <init>
   #6 = Utf8               ()V
   #7 = Class              #8             // com/example/practice/threadDump/Hello
   #8 = Utf8               com/example/practice/threadDump/Hello
   #9 = Utf8               Code
  #10 = Utf8               LineNumberTable
  #11 = Utf8               helloInstruction
  #12 = Utf8               SourceFile
  #13 = Utf8               Hello.java
{
  public com.example.practice.threadDump.Hello();
    descriptor: ()V
    flags: (0x0001) ACC_PUBLIC
    Code:
      stack=1, locals=1, args_size=1
         0: aload_0
         1: invokespecial #1                  // Method java/lang/Object."<init>":()V
         4: return
      LineNumberTable:
        line 6: 0

  public void helloInstruction();
    descriptor: ()V
    flags: (0x0001) ACC_PUBLIC
    Code:
      stack=2, locals=4, args_size=1
         0: bipush        10
         2: istore_1
         3: bipush        20
         5: istore_2
         6: iload_1
         7: iload_2
         8: iadd
         9: istore_3
        10: return
      LineNumberTable:
        line 9: 0
        line 10: 3
        line 11: 6
        line 12: 10
}
SourceFile: "Hello.java"
```

