---
description: '자바 트러블슈팅: scouter를 활용한 시스템 장애 진단 및 해결 노하우를 챕터 4을 요약한 내용입니다.'
---

# CHAP 04. scouter 클라이언트에서 제공하는 기능들

## scouter 클라이언트의 종류

scouter 서버에 저장되어 있는 내용을 확인하려면 별도의 클라이언트를 사용해야 한다.

* 설치형 클라이언트
* 웹 클라이언트

## Tomcat/Java 필수 그래프 목록

일반적인 운영 서버의 모니터링을 위한 필수 그래프 목록은 다음과 같다

* GC Count
* GC Time
* Heap Used 혹은 Heap Memory
* TPS
* Active Service EQ
* Active Speed
* XLog

## 서버 필수 그래프 목록

서버를 모니터링할 때 권장하는 그래프는 다음과 같다

* CPU\(무조건 필수\)
* Memory
* Network TX Bytes/RX Bytes
* Swap

