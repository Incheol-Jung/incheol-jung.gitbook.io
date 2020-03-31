---
layout: reference
title:      "아이템16 public 클래스에서는 public 필드가 아닌 접근자 메서드를 사용하라"
date:       2020-03-10 00:00:00
categories: effective
summary:    Effective Java 3e 아이템 16을 요약한 내용 입니다.
---

> Effective Java 3e 아이템 16를 요약한 내용 입니다.

객체 지향 프로그래머는 필드 들은 모두 private으로 바꾸고 public 접근자(getter)를 추가한다. 

    class Point {
    	private double x;
    	private double y;
    
    	public Point(double x, double y) {
    		this.x = x;
    		this.y = y;
    	}
    
    	public double getX() { return x; }
    	public double getY() { return y; }
    
    	public void setX(double x) { this.x = x; }
    	public void setY(double y) { this.y = y; }
    }

public 클래스라면 이 방식이 맞다. 패키지 바깥에서 접근할 수 있는 클래스라면 접근자를 제공함으로써 클래스 내부 표현 방식을 언제든 바꿀 수 있는 유연성을 얻을 수 있다. 

하지만 `package-private` 클래스 혹은 `private 중첩 클래스`라면 데이터 필드를 노출한다 해도 하등의 문제가 없다. private 중첩 클래스의 경우라면 수정 범위가 더 좁아져서 이 클래스를 포함하는 외부 클래스까지로 제한된다. 

자바 플랫폼 라이브러리에도 public 클래스의 필드를 직접 노출하지 말라는 규칙을 어기는 사례가 종종 있다. 대표적인 예가 java.awt.package 패키지의 `Point`와 `Dimension` 클래스다. 

public 클래스의 필드가 불변이라면 직접 노출할 때의 단점이 조금은 줄어들지만, 여전히 결코 좋은 생각이 아니다. 단, 불변식은 보장할 수 있게 된다. 

    public final class Time {
    	private static final int HOURS_PER_DAY = 24;
    	private static final int MINUTES_PER_HOUR = 60;
    
    	public final int hour;
    	public final int minute;
    
    	public Time(int hour, int minute) {
    		if (hour < 0 || hour >= HOURS_PER_DAY)
    			throw new IllegalArgumentException("시간 : " + hour);
    		if (minute < 0 || minute >= MINUTES_PER_HOUR)
    			throw new IllegalArgumentException("분 : " + minute);
    		this.hour = hour;
    		this.minute = minute;
    	}
    	...
    }

## 정리

public 클래스는 절대 가변 필드를 직접 노출해서는 안 된다. 불변 필드라면 노출해도 덜 위험하지만 완전히 안심할 수는 없다. 하지만 package-private 클래스나 private 중첩 클래스에서는 종종 (불변이든 가변이든) 필드를 노출하는 편이 나을 때도 있다.