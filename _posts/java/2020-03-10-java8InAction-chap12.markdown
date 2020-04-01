---
layout: reference
title:      "12장 새로운 날짜와 시간 API"
date:       2020-03-10 00:00:00
categories: java
summary:    자바 8 인 액션 12장을 요약한 내용 입니다.
navigation_weight: 12
---

> 자바 8 인 액션 12장을 요약한 내용 입니다.

자바 1.0에서는 [`java.util.Date`](http://java.util.Date) 클래스 하나로 날짜와 시간 관련 기능을 제공했다. 날짜를 의미하는 Date라는 클래스의 이름과 달리 Date 클래스는 특정 시점을 날짜가 아닌 밀리초 단위로 표현한다. 게다가 1900년을 기준으로 하는 오프셋, 0에서 시작하는 달 인덱스 등 모호한 설계로 유용성이 떨어졌다. 그리고 Date는 JVM 기본시간대인 CET, 즉 `중앙 유럽 시간대`를 사용하였다.  

자바 1.0의 Date 클래스에 문제가 있다는 의문이 있었지만 `과거 버전과 호환성`을 깨뜨리지 않으면서 이를 해결할 수 있는 방법이 없었다. DateFormat에도 문제가 있었다. 예를 들어 `DateFormat은 스레드에 안전하지 않다.` 즉, 두 스레드가 동시에 하나의 포매터로 날짜를 파싱할 때 예기치 못한 결과가 일어날 수 있었다. 

DateFormat을 사용하여 스레드 세이프 하지 않은 결과란?

`마지막으로 Date와 Calendar는 모두 가변 클래스다.` 가변 클래스라는 설계 때문에 유지보수가 아주 어려워진다. 
오라클은 좀 더 훌륭한 날짜와 시간 API를 제공하기로 결정했다. 결국 자바 8에서는 `joda-Time`의 많은 기능을 java.time 패키지로 추가했다. 

## LocalDate와 LocalTime 사용

LocalDateTime은 LocalDate와 LocalTime을 쌍으로 갖는 복합 클래스다.

    LocalDate date = LocalDate.of(2014, 3, 18); // 2014-03-18
    int year = date.getYear // 2014
    DayOfWeek dow = date.getDayOfWeek(); // TUESDAY
    
    LocalTime time = LocalTime.of(13, 45, 20);
    int hour = time.getHour(); // 13
    int minute = time.getMinute(); // 45
    
    LocalDateTime dt1 = LocalDateTime.of(2014, Month.MARCH, 18, 13, 45, 20);
    LocalDateTime dt2 = LocalDateTime.of(date, time);

## Instant : 기계의 날짜와 시간

사람은 보통 주, 날짜, 시간, 분으로 날짜와 시간을 계산한다. 하지만 기계에서는 이와 같은 단위로 시간을 표현하기 어렵다. 기계의 관점에서는 연속된 시간에서 특정 지점을 하나의 큰 수로 표현하는 것이 가장 자연스러운 시간 표현 방법이다. 

    Instant.ofEpochSecond(3);
    Instant.ofEpochSecond(2, 1_000_000); // 2초 이후의 1억 나노초

## Duration과 Period 정의

Duration 클래스의 정적 팩토리 메서드 between으로 두 시간 객체 사이의 지속시간을 만들 수 있다. 

    Duration d1 = Duration.between(time1, time2);
    Duration d1 = Duration.between(dateTime1, dateTime2);
    
    Period tenDays = Period.ofDays(10);
    Period threeWeeks = Period.ofWeeks(3);

[간격을 표현하는 날짜와 시간 클래스의 공통 메서드](https://www.notion.so/034930003ecc4af9bc126605311cc9bc)

## 날짜 조정, 파싱, 포매팅

withAtrribute 메서드로 기존의 LocalDate를 바꾼 버전을 직접 간단하게 만들 수 있다. 

    LocalDate date1 = LocalDate.of(2014, 3, 18); // 2014-03-18
    LocalDate date2 = date1.withYear(2011); // 2011-03-18
    LocalDate date3 = date2.withDayOfMonth(25); // 2011-03-25

plus, minus 메서드 등을 사용해서 Temporal을 특정 시간만큼 앞뒤로 이동시킬 수 있다. 

    LocalDate date1 = LocalDate.of(2014, 3, 18); // 2014-03-18
    LocalDate date2 = date1.plusWeeks(1); // 2014-03-25
    LocalDate date3 = date2.minusYears(3); // 2011-03-25

[특정 시점을 표현하는 날짜 시간 클래스의 공통 메서드](https://www.notion.so/86dbc13de4dd458e94a540eb2afabc8d)

## TemporalAdjusters 사용하기

지금까지 살펴본 날짜 조정 기능은 비교적 간단한 편에 속한다. 때로는 다음 주 일요일, 돌아오는 평일, 어떤 달의 마지막 날 등 좀 더 복잡한 날짜 조정 기능이 필요할 것이다. 

    import static java.time.temporal.TemporalAdjusters.*;
    LocalDate date1 = LocalDate.of(2014, 3, 18); // 2014-03-18
    LocalDate date2 = date1.with(nextOrSame(DayOfWeek.SUNDAY)); // 2014-03-23
    LocalDate date3 = date2.with(lastDatOfMonth()); // 2014-03-31

[TemporalAdjusters 클래스의 팩토리 메서드](https://www.notion.so/963756ab8a474ce390bdf7c7f9eb6f99)

## 날짜와 시간 객체 출력과 파싱

DateTimeFormatter를 이용해서 날짜나 시간을 특정 형식의 문자열로 만들 수 있다. 

    LocalDate date = LocalDate.of(2014, 3, 18);
    String s1 = date.format(DateTimeFormatter.BASIC_ISO_DATE); // 20140318
    String s2 = date.format(DateTimeFormatter.ISO_LOCAL_DATE); // 2014-03-18

또한 다음 예제에서 보여주는 것처럼 DateTimeFormatter 클래스는 특정 패턴으로 포매터를 만들 수 있는 정적 팩토리 메서드도 제공한다. 

    DateTimeFormatter formatter = DateTimeFormatter.ofPattern("dd/MM/yyyy");
    LocalDate date1 = LocalDate.of(2014, 3, 18);
    String formattedDate = date1.format(formatter);
    LocalDate date2 = LocalDate.parse(formattedDate, formatter);

DateTimeFormatterBuilder에 이용하면 프로그램적으로 포매터를 만들 수 있다. 

    DateTimeFormatter italianFormatter = new DateTimeFormatterBuilder()
    		.appendText(ChronoField.MONTH_OF_MONTH)
    		.appendLiteral(". ")
    		.appendText(ChronoField.MONTH_OF_YEAR)
    		.appendLiteral(". ")
    		.appendText(ChronoField.YEAR)
    		.parseCaseInsensitive()
    		.toFormatter(Locale.ITALIAN);

## 다양한 시간대와 캘린더 활용 방법

새로운 날짜와 시간 API의 큰 편리함 중 하나는 시간대를 간단하게 처리할 수 있다는 점이다. 새로운 클래스를 이용하면 서머타임(DST) 같은 복잡한 사항이 자동으로 처리된다. 

    LocalDate date = LocalDate.of(2014, Month.MARCH, 18);
    ZonedDateTime zdt1 = date.atStartOfDay(romeZone);
    
    LocalDateTime dateTime = LocalDateTime.of(2014, Month.MARCH, 18, 13, 45);
    Instant instantFromDateTime = dateTime.toInstant(romeZone);
    
    Instant instant = Instant.now();
    LocalDateTime itemFromInstant = LocalDateTime.ofInstant(instant, romeZone);

## 요약

- 자바 8 이전 버전에서 제공하는 기존의 [java.util.Date](http://java.util.Date) 클래스와 관련 클래스에서는 여러 불일치점들과 가변성, 어설픈 오프셋, 기본값, 잘못된 이름 결정 등의 설계 결함이 존재했다.
- 새로운 날짜와 시간 API에서 날짜와 시간 객체는 모두 불변이다.
- 새로운 API는 각각 사람과 기계가 편리하게 날짜와 시간 정보를 관리할 수 있도록 두 가지 표현 방식을 제공한다.
- 날짜와 시간 객체를 절대적인 방법과 상대적인 방법으로 처리할 수 있으며 기존 인스턴스를 변환하지 않도록 처리 결과로 새로운 인스턴스가 생성된다.
- TemporalAdjuster를 이용하면 단순히 값을 바꾸는 것 이상의 복잡한 동작을 수행할 수 있으며 자신만의 커스텀 날짜 변환 기능을 정의할 수 있다.
- 날짜와 시간 객체를 특정 포맷으로 출력하고 파싱하는 포매터를 정의할 수 있다. 패턴을 이용하거나 프로그램으로 포매터를 만들 수 있으며 포매터는 스레드 안전성을 보장한다.
- 특정 지역/장소에 상대적인 시간대 또는 UTC/GMT 기준의 오프셋을 이용해서 시간대를 정의할 수 있으며 이 시간대를 날짜와 시간 객체에 적용해서 지역화할 수 있다.
- ISO-8601 표준 시스템을 준수하지 않는 캘린더 시스템도 사용할 수 있다.