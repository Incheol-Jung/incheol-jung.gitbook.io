---
layout:     post
title:      "5장 책임 할당하기"
date:       2020-03-11 00:00:00
categories: object
summary:    5장 책임 할당하기
---

> 오브젝트의 5장을 요약한 내용 입니다.

데이터 중심의 설계는 행동보다 데이터를 먼저 결정하고 협력이라는 문맥을 벗어나 고립된 객체의 상태에 초점을 맞추기 때문에 캡슐화를 위반하기 쉽고, 요소들 사이의 결합도가 높아지며, 코드를 변경하기 어려워진다. 

책임에 초점을 맞춰서 설계할 때 직면하는 가장 큰 어려움은 어떤 객체에게 어떤 책임을 할당할지를 결정하기가 쉽지 않다는 것이다. 따라서 **올바른 책임**을 할당하기 위해서는 다양한 관점에서 설계를 평가할 수 있어야 한다. 

# 책임 주도 설계를 향해

데이터 중심의 설계에서 책임 중심의 설계로 전환하기 위해서는 다음의 두 가지 원칙을 따라야 한다. 

- **데이터보다 행동을 먼저 결정하라**
- **협력이라는 문맥 안에서 책임을 결정하라**

## 데이터보다 행동을 먼저 결정하라

책임 중심의 설계에서는 "**이 객체가 수행해야 하는 책임은 무엇인가**"를 결정한 후에 "이 책임을 수행하는 데 필요한 데이터는 무엇인가"를 결정한다. 

## 협력이라는 문맥 안에서 책임을 결정하라

객체를 가지고 있기 때문에 메시지를 보내는 것이 아니다. **메시지를 전송하기 때문에 객체를 갖게 된 것이다.** 

협력이라는 문맥 안에서 메시지에 집중하는 책임 중심의 설계는 캡슐화의 원리를 지키기가 훨씬 쉬어진다. 

## 책임 주도 설계

책임 주도 설계의 흐름을 다시 살펴보자. 

- 시스템이 사용자에게 제공해야 하는 기능인 시스템 책임을 파악한다.
- 시스템 책임을 더 작은 책임으로 분할한다.
- 분할된 책임을 수행할 수 있는 적절한 객체 또는 열학을 찾아 책임을 할당한다.
- 객체가 책임을 수행하는 도중 가른 객체의 도움이 필요한 경우 이를 책임질 적절한 객체 또는 역할을 찾는다.
- 해당 객체 또는 역할에게 책임을 할당함으로써 두 객체가 협력하게 한다.

# 책임 할당을 위한 GRASP 패턴

크레이그 라만이 패턴 형식으로 제안한 GRASP 패턴으로 책임 할당 기법을 적용할 수 있다. 

GRASP은 "General Responsibility Assignment Software Pattern(일반적인 책임 할당을 위한 소프트웨어 패턴)"의 약자로 객체에게 책임을 할당할 때 지침으로 삼을 수 있는 원칙들의 집합을 패턴 형식으로 정리한 것이다. 

## 도메인 개념에서 출발하기

설계를 시작하기 전에 도메인에 대한 개략적인 모습을 그려 보는 것이 유용하다.

![https://s3.us-west-2.amazonaws.com/secure.notion-static.com/0d33b36e-1dfe-4464-9097-5c8692fb7679/Untitled.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Credential=ASIAT73L2G45NJNN2GGP%2F20200322%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20200322T124116Z&X-Amz-Expires=86400&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEC8aCXVzLXdlc3QtMiJIMEYCIQDL1edFpfB5UMI5GwpRVZHquS9mnBnSkz63gZFWDld1CQIhAInYMlPLPk8Ibk2YujC7orY5yAbggfLLwaAH2RMdTCp9KrQDCCgQABoMMjc0NTY3MTQ5MzcwIgw73qY8X5Ay3uZn0PQqkQM6OWNL1XaCaMLvhQ4IM5OTjfj%2FKtl5Eb6xI36q3UAyi7EeZwvQeBvtqwnFHVlx5YCKijfanzxjLBxb1%2B%2B1qbIxMxZWCHvN%2F%2F1GuK0CKsPziZqtDkSUXUenWMR6QRynyNtM2l8Z9KZS6Me%2FuFxhHwjvy%2FQllAz0bP%2FDOK0vZHvxidMfLAnn7mjeuuMQPm%2B%2B%2FoIntluf6t23DA9JmJ3FgaKVzB5xljgfsdZmxsC3S%2BX4XrXQNauhcODUh8ZW17JU0%2FYAP%2FzkrrDI4dnjoIMbfOycAu%2FfcXP7uZAfFZNY0Ucwaqa0V%2BZlaLXnpEG9zKm4xzZnTO4BCXuKazEZPUHjCmsAD4qJaltiPMFlHlF3itgH%2FRr2sfGQT3kmDMJnJTZQO%2F2%2FpnOxO7D5zfITJpooelqBdBtE5PXK7HPVTzkZ14QWXAoF5u6EgJFKej5DYBCF7G9w7GVg%2F5CyNyE2SzB8TpvAOQt5Mxhac%2FDsXjnbvfzVv%2BpZwDx8m0mFASnxwz45Mkbuj3tPvf%2FsMZKUQdLECrqKuzDJktzzBTrqAUamh3TRE8c3TYzG8H6P2aZE%2BYQ%2BDr8NOeAi0VNIeMLomTXN51pT68TYa0iLhROSsQeb9l7l%2FZ%2Bsq14PlwYpMAwa9eYGGXvzpTH2V2iQGrTeYGxVsTwlfs0EH12l93S%2FQiWkK9XSh9UTivPhoSL5N8NVtx7cB9cSiT%2B%2B%2FMpSYVQ7U29cvV70LEL%2FNZcAIRwCAGTCK7lOzXGUMLKt6vWnZr0VjL%2BlqDNWUpMs6OmWRR3%2BBWlE8Pk6whmpf%2FnNH29rueo4%2BHKYMYwHNz50InLevgqHYMqb5Af%2BDDKoe5SJQfZtoERfAxrCBsZEWA%3D%3D&X-Amz-Signature=4aa061627c543900673164414a61304379b1428f48968299d3f13c6ce9c46989&X-Amz-SignedHeaders=host&response-content-disposition=filename%20%3D%22Untitled.png%22](https://s3.us-west-2.amazonaws.com/secure.notion-static.com/0d33b36e-1dfe-4464-9097-5c8692fb7679/Untitled.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Credential=ASIAT73L2G45NJNN2GGP%2F20200322%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20200322T124116Z&X-Amz-Expires=86400&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEC8aCXVzLXdlc3QtMiJIMEYCIQDL1edFpfB5UMI5GwpRVZHquS9mnBnSkz63gZFWDld1CQIhAInYMlPLPk8Ibk2YujC7orY5yAbggfLLwaAH2RMdTCp9KrQDCCgQABoMMjc0NTY3MTQ5MzcwIgw73qY8X5Ay3uZn0PQqkQM6OWNL1XaCaMLvhQ4IM5OTjfj%2FKtl5Eb6xI36q3UAyi7EeZwvQeBvtqwnFHVlx5YCKijfanzxjLBxb1%2B%2B1qbIxMxZWCHvN%2F%2F1GuK0CKsPziZqtDkSUXUenWMR6QRynyNtM2l8Z9KZS6Me%2FuFxhHwjvy%2FQllAz0bP%2FDOK0vZHvxidMfLAnn7mjeuuMQPm%2B%2B%2FoIntluf6t23DA9JmJ3FgaKVzB5xljgfsdZmxsC3S%2BX4XrXQNauhcODUh8ZW17JU0%2FYAP%2FzkrrDI4dnjoIMbfOycAu%2FfcXP7uZAfFZNY0Ucwaqa0V%2BZlaLXnpEG9zKm4xzZnTO4BCXuKazEZPUHjCmsAD4qJaltiPMFlHlF3itgH%2FRr2sfGQT3kmDMJnJTZQO%2F2%2FpnOxO7D5zfITJpooelqBdBtE5PXK7HPVTzkZ14QWXAoF5u6EgJFKej5DYBCF7G9w7GVg%2F5CyNyE2SzB8TpvAOQt5Mxhac%2FDsXjnbvfzVv%2BpZwDx8m0mFASnxwz45Mkbuj3tPvf%2FsMZKUQdLECrqKuzDJktzzBTrqAUamh3TRE8c3TYzG8H6P2aZE%2BYQ%2BDr8NOeAi0VNIeMLomTXN51pT68TYa0iLhROSsQeb9l7l%2FZ%2Bsq14PlwYpMAwa9eYGGXvzpTH2V2iQGrTeYGxVsTwlfs0EH12l93S%2FQiWkK9XSh9UTivPhoSL5N8NVtx7cB9cSiT%2B%2B%2FMpSYVQ7U29cvV70LEL%2FNZcAIRwCAGTCK7lOzXGUMLKt6vWnZr0VjL%2BlqDNWUpMs6OmWRR3%2BBWlE8Pk6whmpf%2FnNH29rueo4%2BHKYMYwHNz50InLevgqHYMqb5Af%2BDDKoe5SJQfZtoERfAxrCBsZEWA%3D%3D&X-Amz-Signature=4aa061627c543900673164414a61304379b1428f48968299d3f13c6ce9c46989&X-Amz-SignedHeaders=host&response-content-disposition=filename%20%3D%22Untitled.png%22)

중요한 것은 설계를 시작하는 것이지 **도메인 개념들을 완벽하게 정리하는 것이 아니다.** 도메인 개념을 정리하는 데 너무 많은 시간을 들이지 말고 **빠르게 설계와 구현을 진행하라**

## 정보 전문가에게 책임을 할당하라

메시지는 메시지를 수신할 객체가 아니라 메시지를 전송할 객체의 의도를 반영해서 결정해야 한다. 따라서 첫 질문은 다음과 같다. 

> 메시지를 전송할 객체는 무엇을 원하는가?

두 번째 질문은 다음과 같다. 

> 메시지를 수신할 적합한 객체는 누구인가?

객체에게 책임을 할당하는 첫 번째 원칙은 **책임을 수행할 정보를 알고 있는 객체**에게 책임을 할당하는 것이다. 여기서 이야기하는 정보는 데이터와 다르다는 사실에 주의하라. 

### 책임을 수행하는 객체가 정보를 '알고' 있다고 해서 그 정보를 '저장'하고 있을 필요는 없다.

객체는 해당 정보를 제공할 수 있는 다른 객체를 알고 있거나 필요한 정보를 계산해서 제공할 수도 있다. 

![https://go.aws/2WGngbv](https://go.aws/2WGngbv)

## 높은 응집도와 낮은 결합도

그렇다면 이 설계의 대안으로 Movie 대신 Screening이 직접 DiscountCondition과 협력하게 하는 것은 어떨까?

![https://go.aws/397P4Ik](https://go.aws/397P4Ik)

기능적인 측면에서는 두 가지 중 어떤 방법을 선택하더라도 차이가 없는 것처럼 보인다. 그렇다면 왜 우리는 이 설계 대신 Movie가 DiscountCondition과 협력하는 방법을 선택한 것일까?

그 이유는 **응집도**와 **결합도**에 있다. 도메인 상으로 Movie는 DiscountCondition의 목록을 속성으로 포함하고 있다. Movie와 DiscountCondition은 이미 결합돼 있기 때문에 Movie를 DiscountCondition과 협력하게 하면 설계 전체적으로 **결합도를 추가하지 않고도 협력을 완성할 수 있다.** 

하지만 Screening이 DiscountCondition과 협력할 경우에는 Screening과 DiscountCondition 사이에 **새로운 결합도**가 추가된다. 

응집도 측면에서도 Screening이 DiscountCondition과 협력해야 한다면 Screening은 영화 요금 계산과 관련된 **책임 일부를 떠안아야 할 것이다.** 이 경우 Screening은 DiscountCondition이 할인 여부를 판단할 수 있고 Movie가 이 할인 여부를 필요로 한다는 사실 역시 알고 있어야 한다. 

# 책임 주도 설계의 대안

책임 주도 설계에 익숙해지기 위해서는 부단한 노력과 시간이 필요하다. 그러나 어느 정도 경험을 쌓은 숙련된 설계자 조차도 적절한 책임과 객체를 선택하는 일에 어려움을 느끼고는 한다. 

아무것도 없는 상태에서 책임과 협력에 관해 고민하기 보다는 **일단 실행되는 코드**를 얻고 난 후에 코드 상에 **명확하게 드러나는 책임** 들을 올바른 위치로 이동시키는 것이다. 

> 나는 십년 이상 객체를 가지고 일했지만 처음 시작할 때는 여전히 적당한 위치를 찾지 못한다. 늘 이런 점이 나를 괴롭혔지만, 이제는 이런 경우에 리팩터링을 사용하면 된다는 것을 알게 되었다.  
- 리팩터링

## 메서드 응집도

긴 메서드는 다양한 측면에서 코드의 유지보수에 부정적인 영향을 미친다. 

- 어떤 일을 수행하는지 한눈에 파악하기 어렵기 때문에 코드를 전체적으로 이해하는 데 너무 많은 시간이 걸린다.
- 하나의 메서드 안에서 너무 많은 작업을 처리하기 때문에 변경이 필요할 때 수정해야 할 부분을 찾기 어렵다.
- 메서드 내부의 일부 로직만 수정하더라도 메서드의 나머지 부분에서 버그가 발생할 확률이 높다.
- 로직의 일부만 재사용하는 것이 불가능하다.
- 코드의 재사용하는 유일한 방법은 원하는 코드를 복사해서 붙여넣는 것뿐이므로 코드 중복을 초래하기 쉽다.

**클래스가 작고, 목적이 명확한 메서드들로 구성돼 있다면 변경을 처리하기 위해 어떤 메서드를 수정해야 하는지를 쉽게 판단할 수 있다.** 

객체로 책임을 분배할 때 가장 먼저 할 일은 메서드를 **응집도 있는 수준**으로 분해하는 것이다. 

## 객체를 자율적으로 만들자

### 어떤 메서드를 어떤 클래스로 이동시켜야 할까?

자신이 소유하고 있는 데이터를 자기 스스로 처리하도록 만드는 것이 자율적인 객체를 만드는 지름길이다. 따라서 메서드가 사용하는 데이터를 저장하고 있는 클래스로 메서드를 이동시키면 된다.