---
description: SOLID 원칙에 대해 설명하시오
---

# SOLID 원칙

![](../../.gitbook/assets/awux83emfqr6x9dzfdss.png)

## 단일 책임 원칙

객체는 단 하나의 책임만을 가져야 한다. 책임이 많아지면 클래스 내부의 함수끼리 강한 결합을 발생할 가능성이 높아지며 이는 유지보수에 비용이 증가하게 되므로 책임을 분리시킬 필요가 있다.

## 개방 폐쇄 원칙

기존의 코드를 변경하지 않고 기능을 수정하거나 추가할 수 있도록 설계해야 한다. OCP를 만족한 설계는 변경에 유연하므로 유지보수 비용을 줄여주고 코드의 가독성 또한 높아지는 효과를 얻을 수 있다.

## 리스코프 치환 원칙

자식 클래스는 부모클래스에서 가능한 행위를 수행할 수 있어야 한다. : 상속 관계에서는 일반화 관계\(IS-A\)가 성립해야 한다. 일반화 관계에 있다는 것은 일관성이 있다는 것이다.

## 인터페이스 분리 원칙

한 클래스는 자신이 사용하지 않는 인터페이스는 구현하지 말아야 한다. 하나의 일반적인 인터페이스보다는 여러개의 구체적인 인터페이스가 낫다. : 자신이 사용하지 않는 기능에는 영향을 받지 말아야 한다.

## 의존 역전 원칙

의존 관계를 맺을 때 변화하기 쉬운것 보단 변화하기 어려운 것에 의존해야 한다. 의존관계를 맺을 때 구체적인 클래스보다 인터페이스나 추상 클래스와 관계를 맺는게 변화에 유연하게 대처할 수 있다.

## 참고

* [https://blog.martinwork.co.kr/theory/2017/12/10/oop-solid-principle.html](https://blog.martinwork.co.kr/theory/2017/12/10/oop-solid-principle.html)
* [https://pjh3749.tistory.com/244](https://pjh3749.tistory.com/244)
* [https://dev-momo.tistory.com/entry/SOLID-원칙](https://dev-momo.tistory.com/entry/SOLID-%EC%9B%90%EC%B9%99)



