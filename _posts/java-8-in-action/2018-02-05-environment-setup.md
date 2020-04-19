---
layout: reference
title: JAVA
date: '2018-02-05T00:00:00.000Z'
categories: java
summary: java environment setting
navigation_weight: 15
---

# 2018-02-05-environment-setup

## 1. JAVA SDK 설치

* Link URK : [http://www.oracle.com/technetwork/java/javase/downloads/jdk8-downloads-2133151.html](http://www.oracle.com/technetwork/java/javase/downloads/jdk8-downloads-2133151.html) 
* 사용하는 PC의 OS에 따라서 다운로드 후 설치\(JDK\)
* 설치후에는 환경변수 설정 \(PATH\)
* cmd창으로 java가 정상적으로 설치되고 환경변수 까지 설정되었는지 확인!

```javascript
java -version
```

* JDK / JRE 차이

  JRE\(Java Runtime Environment\) : 컴파일된 자바 프로그램을 실행시킬 수 있는 자바 환경

  JDK\(Java Development Kit\) : JRE + 개발에 필요한 도구\(자바 컴파일러, 프로파일러, 문서생성기 등\)

* JVM\(Java Virtual Machine\) : 자바 소스코드로부터 만들어지는 자바 바이너리 파일\(.class\)을 실행할 수 있다.  

## 2. Tomcat 설치

* Link URL : [https://tomcat.apache.org/download-80.cgi](https://tomcat.apache.org/download-80.cgi)
* 개념 : Apache software 재단에서 만든 JAVA Servlet & JSP 기술 구현을 위한 Open Source
* 다운로드 후에 server 설정을 위해 별도의 공간에 저장한다.\(폴더 경로는 숙지하고 있어야 함\)
* Apache / Tomcat의 차이 Apache : http요청을 처리할 수 있는 웹서버를 뜻한다. 클라이언트가 GET, POST, DELETE 등등의 메소드를 이용해 요청을 하면 이 프로그램이 어떤 결과를 돌려주는 기능을 한다. Tomcat : 웹Server와 웹Container의 결합으로, 다양한 기능을 Container에 구현하여 다양한 역할을 수행할 수 있는 서버. \( 웹컨테이너 : 클라이언트의 요청이 있을 때, 내부의 프로그램을 통해 결과를 만들어내고 이것을 다시 클라이언트에게 전달. \)
* 그렇다면 WAS만 쓰면 되지 어째서 웹서버를 따로 쓰느냐는 의문이 생길 수 있다. 그 이유는 목적이 다르기 때문이다. 웹 서버는 정적인 데이터를 처리하는 서버이다. 이미지나 단순 html파일과 같은 리소스를 제공하는 서버는 웹 서버를 통하면 WAS를 이용하는 것보다 빠르고 안정적이다\(왜? 다른 글 소스로 써볼까?\) WAS는 동적인 데이터를 처리하는 서버이다. DB와 연결되어 데이터를 주고 받거나 프로그램으로 데이터 조작이 필요한 경우에는 WAS를 활용 해야 한다.

## 3. Maven 설치

* Link URL : [https://maven.apache.org/download.cgi](https://maven.apache.org/download.cgi)
* 다운로드 후에 _\*\*_ 위해 별도의 공간에 저장한다.\(폴더 경로는 숙지하고 있어야 함\)
* 환경변수 설정할 것!! \( PATH & JAVA\_HOME\) !!!! "/bin"경로는 제외할 것
* 개념 : 라이브 관리 및 프로젝트 빌드\(ant와 같은 기능\) 기능

## 4. STS\(Spring Tool Suite\) 설치

* 개념 : Spring에서 제공하는 Spring Framework 개발 도구로 Eclipse를 커스터마이징 툴

## 5. Github 연동

* 상단에 window 탭에서 'Show View' 메뉴를 클릭하게 되면 하단에 'Others'를 선택하면 된다. Git 폴더를 클릭하게 되면 Git과 관련된 메뉴들이 보이며 우리가 사용할만한 메뉴는 'Git Repository', 'Git Staging'이 있다. 
* 'Git Repository'탭을 확인해보면 오른쪽 하단에 활성화되며\(개인적으로 차이가 있음/보통 Servers tab과 같은 영역에서 추가 됨\)
* 기존의 Repository를 가져오려면 Clone을 선택하고 'Clone URI'클 선택하여 repository주소와 관련된 정보를 입력해주면 import된것을 확인할 수 있다. 
* 여기서 중요한 점은 clone되었다고 해서 sts에 import된것은 아니고 local에만 import된 것이므로 해당 프로젝트에서 오른쪽 클릭하게 되면 'Import maven project'를 클릭하여 자신의 workspace폴더에 import되어 사용할 수 있다. 

