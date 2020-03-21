---
layout:     post
title:      "아이템9 try-finally보다는 try-with-resources를 사용하라"
date:       2020-03-20 00:00:00
categories: effective
summary:    Effective Java 3e 아이템 9을 요약한 내용 입니다.
---

> Effective Java 3e 아이템 9를 요약한 내용 입니다.

자원 닫기는 클라이언트가 놓치기 쉬워서 예측할 수 없는 **성능 문제**로 이어지기도 한다. 

전통적으로 자원이 제대로 닫힘을 보장하는 수단으로 **try-finally**가 쓰였다. 예외가 발생하거나 메서드에서 반환되는 경우를 포함해서 말이다. 

    static void copy(String src, String dst) throws IOException {
    	InputStream in = new FilInputStream(src);
    	try {
    		OutStream out = new FileOutputStream(dst);
    		try {
    			byte[] buf = new byte[BUFFER_SIZE];
    			int n;
    			while ((n = in.read(buf)) >= 0)
    				out.write(buf, 0, n);
    		} finally {
    			out.close();
    		}
    	} finally {
    		in.close();
    	}
    }

예컨대 물리적인 문제가 생긴다면 firstLineOfFile 메서드 안의 readLine 메서드가 예외를 던지고, 같은 이유로 close 메서드도 실패할 것이다. 물론 두 번째 예외 대신 첫 번째 예외를 기록하도록 코드를 수정할수는 있지만, 코드가 너무 지저분해져서 실제로 그렇게까지 하는 경우는 거의 없다. 

이러한 문제들은 자바 7이 투척한 **try-with-resources** 덕에 모두 해결되었다. 이 구조를 사용하려면 해당 자원이 **AutoCloseable** 인터페이스를 구현해야 한다. 

    static void copy(String src, String dst) throws IOException {
    	
    	try ( InputStream in = new FilInputStream(src);
    				OutStream out = new FileOutputStream(dst)) {
    			byte[] buf = new byte[BUFFER_SIZE];
    			int n;
    			while ((n = in.read(buf)) >= 0)
    				out.write(buf, 0, n);
    	}
    } 

try-with-resources 버전이 짧고 읽기 수월할 뿐 아니라 문제를 진단 하기도 훨씬 간편하다. 또한, 자바 7에서 **Throwable**에 추가된 **getSuppressed** 메서드를 이용하면 프로그램 코드에서 가져올 수도 있다. 

> getSuppressed은 구체적으로 어떻게 사용할 수 있을까?

## 정리

꼭 회수해야 하는 자원을 다룰 때는 try-finally 말고 **try-with-resources**를 사용하자. 예외는 없다. **코드는 더 짧고 분명해지고, 만들어지는 예외 정보도 훨씬 유용하다.** try-finally로 작성하면 실용적이지 못할 만큼 코드가 지저분 해지는 경우라도 try-wirh-resources 로는 정확하고 쉽게 자원을 회수할 수 있다.