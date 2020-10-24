---
description: '자바 트러블슈팅: scouter를 활용한 시스템 장애 진단 및 해결 노하우를 챕터 7을 요약한 내용입니다.'
---

# CHAP 07. scouter 사용 시 유용한 팁

## 수집 서버의 디스크 사용량 안전하게 관리하기

scouter 수집 서버를 기본값으로 사용할 경우 디스크 사용량이 80%가 될 때까지 지속해서 저장한다. 따라서 저장되는 데이터를 관리하는 옵션을 알고 있으면 큰 도움이 된다.

```text
# 저장소 자동 삭제 동작 여부
mgr_purge_enabled=true

#프로파일 데이터를 자동으로 지우는 디스크 사용량(%)
mgr_purge_disk_usage_pct=80

#프로파일 데이터가 자동으로 지워지기 전에 유지되는 날짜 수
mgr_purge_profile_keep_days=10

#xlog 정의 데이터가 자동으로 지워지기 전에 유지되는 날짜 수
mgr_purge_xlog_keep_days=30

#각종 카운터(선 그래프의 값)가 자동으로 지워지기 전에 유지되는 날짜 수
mgr_purge_counter_keep_days=70
```

## 알림 설정은 필수다

scouter에서의 알림은 호스트 에이전트에서 발생할 수 있고, 수집 서버에 취합된 데이터를 바탕으로 발생시킬 수도 있다. 각각의 warning, fatal 비율을 운영자가 직접 지정할 수 있으며\(warning\_pct와 fata\_pct로 끝나는 설정들 참고\), \_enabled 옵션을 지정해서 해당 알림을 직접 켜거나 끌 수 있다.

호스트의 사용량 알림 외에도 운영자가 직접 서버의 특정 상황에서 알림이 발생하도록 설정할 수도 있다. 자세한 내용은 문서 페이지에 정리되어 있으니 문서를 참고하자

![](../../.gitbook/assets/111%20%2811%29.png)

[https://github.com/scouter-project/scouter/blob/master/scouter.document/main/Alert-Plugin-Guide.md](https://github.com/scouter-project/scouter/blob/master/scouter.document/main/Alert-Plugin-Guide.md)

## 샘플링도 필수다

애플리케이션을 운영할 때 각종 프로그램의 응답 속도는 다르다. 그런데 대부분의 경우 진단을 하고 튜닝을 할 때 분석해야 하는 대상은 느린 애플리케이션이다. 응답속도가 2~3초 이상인 데이터는 분석할 의미가 있지만 1초 미만인 요청들은 분석할 일이 거의 없다. 따라서 샘플링에 따라서 디스크 사용량을 줄일 수 있다. 샘플링은 자바 에이전트의 설정 파일에서 지정하면 된다.

## 메서드 프로파일링도 필수다

scouter는 기본적으로 메서드 프로파일링 옵션이 지정되어 있지 않다. 왜냐하면, 잘 모르고 지정할 경우 수집 서버에 엄청난 양의 데이터가 쌓이게 되고, 실제 분석할 때 원하는 문제점을 찾기도 어려워지기 때문이다. 일반적인 구조의 웹 애플리케이션의 경우 Controller, Service, DAO가 구현된 클래스는 기본적으로 추가하는 것을 추천하면, 반대로 Value Object나 Data Transfer Object들과 같이 반복적으로 get, set을 수행하는 메서드가 있는 클래스는 생략하는 것을 추천한다. 그리고 기본적으로 hook\_method\_ignore\_prefixes값이 get,set으로 설정되어 있기 때문에 비즈니스 로직이 있는 메서드가 get이나 set으로 끝난다면 이 옵션을 비어 있는 값으로 설정해야 한다.

