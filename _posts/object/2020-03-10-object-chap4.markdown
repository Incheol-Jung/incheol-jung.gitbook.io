---
layout:     post
title:      "4장 설계 품질과 트레이드 오프"
date:       2020-03-11 00:00:00
categories: object
summary:    4장 설계 품질과 트레이드 오프
---

> 오브젝트의 4장을 요약한 내용 입니다.

### 객체지향 설계의 핵심은 역할, 책임, 협력이다.

- **협력**은 애플리케이션의 기능을 구현하기 위해 메시지를 주고받는 객체들 사이의 상호작용이다.
- **책임**은 객체가 다른 객체와 협력하기 위해 수행하는 행동이고
- **역할**은 대체 가능한 책임의 집합이다.

적절한 비용 안에서 쉽게 변경할 수 있는 설계는 응집도가 높고 서로 느슨하게 결합돼 있는 요소로 구성되어 있다. 

객체를 단순한 **데이터의 집합**으로 바라보는 시각은 객체의 내부 구현을 퍼블릭 인터페이스에 노출시키는 결과를 낳기 때문에 결과적으로 설계가 **변경에 취약**해진다. 

### 객체지향 설계 분할 기준

- 상태를 분할 중심 : **객체는 자신이 포함하고 있는 데이터**를 조작하는 데 필요한 오퍼레이션을 정의
- 책임을 분할 중심 : 다른 객체가 요청할 수 있는 오퍼레이션을 위해 **필요한 상태**를 보관

# 설계 트레이드오프

데이터 중심 설계와 책임 중심 설계의 장단점을 비교하기 위해 캡슐화, 응집도, 결합도 측면에서 바라보자

## 캡슐화

설계가 필요한 이유는 **요구사항이 변경**되기 때문이고, 캡슐화가 중요한 이유는 **불안정한 부분**과 **안정적인 부분**을 분리해서 변경의 영향을 통제할 수 있기 때문이다. 

## 응집도와 결합도

응집도 : 모듈에 포함된 내부 요소들이 연관돼 있는 정도를 나타낸다. 변경이 발생할 때 모듈 내부에서 발생하는 변경의 정도로 측정할 수 있다. 

![https://s3.us-west-2.amazonaws.com/secure.notion-static.com/c2d64167-b636-418d-a961-0a24a183e42b/object-4-2.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Credential=ASIAT73L2G45DUYTQZ4N%2F20200322%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20200322T124630Z&X-Amz-Expires=86400&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEDAaCXVzLXdlc3QtMiJIMEYCIQCQzIcVmZrx5sR4rsPK2Jxg32TYjliHbfeqVfGb70rQDwIhAL0B8sbEctiZHv8iDrN0at6lI7GfHLHfOyz0QzO8kSQnKrQDCCkQABoMMjc0NTY3MTQ5MzcwIgwUQSRqmT3zQcD9WSwqkQMgxvSXnTB8BaUt%2FxpwcchCUnjm8Os2RUo3F9Fi8cn2acokhkRFww4nu19P3TgmlyHwORLQwk5h3WukvG3bs%2FMKnNDXzTuVpKFdjKSLp%2BnSbX10jRXWD9qecwzVjiuceqX00CF5V0y3%2F%2B%2BGqQ6YAxxPx2sSkRNGLsCMlMz1Z5h7R0pXZUelJntvbrmuKYCngmVM9IP5qkr%2F80gM65%2B4qDyqmbmeqvt1gCjwy1BVD6G1OAHAL82iWp88ZyoxbiWBoAC%2BVSHaXaoFYy7H8rcW4obfHSbJGhjzLyL3bICeAmOL%2FsprVgMbguO2AN9ByHADvBp4dCOdaLdAdXIGrgEv%2BCLUtcfcwXC%2FUfSOjwjhCdL1DhdnkWAKZ1%2FReIiNB5KRj9mvOzEryZmP1HvQ2Ul5FAXrdQRcHaMB3P6lvYkU6PdBEozGGC5g2XddTOsq1rZf%2Ff5TvcsBWaIYPjrAToq47R8VuAzGMX2sKs%2BD1Lmk1HW9l2l5%2BU4W%2BJIWPcVp5qO4IsfhJPqZW%2BblPxKf4%2BEEU0tZFDDVttzzBTrqAWZZC5uE4EdI%2B1POzxg8xqm6XF0PwOpP1nvsH476xm1B6Q55kVYREGKb7A0dTkBFUIQRUdydAMMPCxTE6iYYhFKJySIp%2FBRW38p1YERxp3%2FJxr66TUqlYgOP5LVnHlHwksAkq8aATVs%2BFTnAzCHK5WbUjjBAVlPX99z73K8I3uRx4vI7C8lsnsMslZ7hbG5AvlrrEBA4Jjsuk9TeF6By0zZ%2BFuYeTuRBgkGugs9cvkXzc0Rfv1efR%2BjcYY5CAV9gNGPNZACyxHhFHNrk7MuEp0TyLkq8kX5a4r7nRLdMYpSFmASBzuK4k7RBbQ%3D%3D&X-Amz-Signature=ae8a2716e1462ba1782ec30a877c97a566ca1f595e4e2cbbe7a3d327c10c53f6&X-Amz-SignedHeaders=host&response-content-disposition=filename%20%3D%22object-4-2.png%22](https://s3.us-west-2.amazonaws.com/secure.notion-static.com/c2d64167-b636-418d-a961-0a24a183e42b/object-4-2.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Credential=ASIAT73L2G45DUYTQZ4N%2F20200322%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20200322T124630Z&X-Amz-Expires=86400&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEDAaCXVzLXdlc3QtMiJIMEYCIQCQzIcVmZrx5sR4rsPK2Jxg32TYjliHbfeqVfGb70rQDwIhAL0B8sbEctiZHv8iDrN0at6lI7GfHLHfOyz0QzO8kSQnKrQDCCkQABoMMjc0NTY3MTQ5MzcwIgwUQSRqmT3zQcD9WSwqkQMgxvSXnTB8BaUt%2FxpwcchCUnjm8Os2RUo3F9Fi8cn2acokhkRFww4nu19P3TgmlyHwORLQwk5h3WukvG3bs%2FMKnNDXzTuVpKFdjKSLp%2BnSbX10jRXWD9qecwzVjiuceqX00CF5V0y3%2F%2B%2BGqQ6YAxxPx2sSkRNGLsCMlMz1Z5h7R0pXZUelJntvbrmuKYCngmVM9IP5qkr%2F80gM65%2B4qDyqmbmeqvt1gCjwy1BVD6G1OAHAL82iWp88ZyoxbiWBoAC%2BVSHaXaoFYy7H8rcW4obfHSbJGhjzLyL3bICeAmOL%2FsprVgMbguO2AN9ByHADvBp4dCOdaLdAdXIGrgEv%2BCLUtcfcwXC%2FUfSOjwjhCdL1DhdnkWAKZ1%2FReIiNB5KRj9mvOzEryZmP1HvQ2Ul5FAXrdQRcHaMB3P6lvYkU6PdBEozGGC5g2XddTOsq1rZf%2Ff5TvcsBWaIYPjrAToq47R8VuAzGMX2sKs%2BD1Lmk1HW9l2l5%2BU4W%2BJIWPcVp5qO4IsfhJPqZW%2BblPxKf4%2BEEU0tZFDDVttzzBTrqAWZZC5uE4EdI%2B1POzxg8xqm6XF0PwOpP1nvsH476xm1B6Q55kVYREGKb7A0dTkBFUIQRUdydAMMPCxTE6iYYhFKJySIp%2FBRW38p1YERxp3%2FJxr66TUqlYgOP5LVnHlHwksAkq8aATVs%2BFTnAzCHK5WbUjjBAVlPX99z73K8I3uRx4vI7C8lsnsMslZ7hbG5AvlrrEBA4Jjsuk9TeF6By0zZ%2BFuYeTuRBgkGugs9cvkXzc0Rfv1efR%2BjcYY5CAV9gNGPNZACyxHhFHNrk7MuEp0TyLkq8kX5a4r7nRLdMYpSFmASBzuK4k7RBbQ%3D%3D&X-Amz-Signature=ae8a2716e1462ba1782ec30a877c97a566ca1f595e4e2cbbe7a3d327c10c53f6&X-Amz-SignedHeaders=host&response-content-disposition=filename%20%3D%22object-4-2.png%22)

결합도 : 의존성의 정도를 나타내며 다른 모듈에 대해 얼마나 많은 지식을 갖고 있는지를 나타내는 척도다. 한 모듈이 변경되기 위해서 다른 모듈의 변경을 요구하는 정도로 측정할 수 있다. 

![https://s3.us-west-2.amazonaws.com/secure.notion-static.com/71b01b60-733b-4dba-a2c5-2b4227d87610/object-4-3-1.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Credential=ASIAT73L2G45PJDMPTWW%2F20200322%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20200322T124652Z&X-Amz-Expires=86400&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEDAaCXVzLXdlc3QtMiJHMEUCIDvkxTvvaPGErnjB%2BQLp6O%2F3PrzJo4DkpCaW%2BmNWOZNeAiEA613dS9fPmje68CTq6AbnrTh9cWYhQaPCmk8GD73bJEIqtAMIKRAAGgwyNzQ1NjcxNDkzNzAiDKSMezycYCHh50j15yqRAxXOBAo0wS9XiJ70a7m6TPIQrYw1KmiaoskVpGfPaFGyLb3BNgJdU91Vs3rzh1STv9fgKzC8E5mNH056%2BbwFYCcua5kCVYQ1n8Uggehiy32S6xeWEbFD1s%2BjoY3qBO%2Fg0PDkBNvdnL%2BcVjlSAxupOEK8KksXceN9IkdqG%2B4njoCJqMDKAo9Zxio6lvZH%2FSYCZX3oC7%2Bz2xjUPYLolBK0kcv3Ug36pKjrTpy1he%2B2nQEDU%2BDUaDPRRYImmvztp3DPWGYrFAURqgrPTuZ6ILwwJNauqAc0UF6RG7mHQkU96vv73Ia7eRcBO2NEvwr4guLulhRqTnVGz6EdTvnhjS%2ByaLA2i8GhMDo8%2BxtRz1Q43ZHS8Uz67BLpv4r9zsixe8J%2FKCgXz%2FC%2BQhmvxb%2B53FGdnBEDeB20PCB9V0%2FcWTrX61QLU0u19OWRIKLXaV11nuRhUCipUQnQB8yUOVf7gPFyCY7HIqkstfw6x9zjYFlrY8QEcuu7HaRjB6GMKZ%2BROj%2BbQm%2FYxbDSloJ9N0bwTALePXYdMOip3PMFOusB89S2oiDK46gdJdSkvfTx1KdR09pUcLCod2nDbwAOYq5uYEosEzPcEB%2FK%2FRknyJF6BK2Wu0WCJZeJlQiiVvIsw8f47h4LIyH58%2BEaoYXN7zefbwpoWFSj1wA4s0zhBmLnVSt9EZfyabsXMcICNvYP%2FtsaIJJUeFnBmpKjXPmItgPmZIFj63ISj2Sfl7bScJGcgeyFAQWSd8bnfS%2BF0E1zg1x4qtCgr9PD5FmeZUJZoFL1E4rAnb5J8Gx%2B8kYLZepAypr8Fj4xm93yu9UcE0RfdQKCmS2lgVGKy7uP%2BcQj353XNvmXXTFfYD7F8A%3D%3D&X-Amz-Signature=62e450f812d1941969c93ccc37cec4ca32b7d30fd0abdc2716ec4cb571a7293b&X-Amz-SignedHeaders=host&response-content-disposition=filename%20%3D%22object-4-3-1.png%22](https://s3.us-west-2.amazonaws.com/secure.notion-static.com/71b01b60-733b-4dba-a2c5-2b4227d87610/object-4-3-1.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Credential=ASIAT73L2G45PJDMPTWW%2F20200322%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20200322T124652Z&X-Amz-Expires=86400&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEDAaCXVzLXdlc3QtMiJHMEUCIDvkxTvvaPGErnjB%2BQLp6O%2F3PrzJo4DkpCaW%2BmNWOZNeAiEA613dS9fPmje68CTq6AbnrTh9cWYhQaPCmk8GD73bJEIqtAMIKRAAGgwyNzQ1NjcxNDkzNzAiDKSMezycYCHh50j15yqRAxXOBAo0wS9XiJ70a7m6TPIQrYw1KmiaoskVpGfPaFGyLb3BNgJdU91Vs3rzh1STv9fgKzC8E5mNH056%2BbwFYCcua5kCVYQ1n8Uggehiy32S6xeWEbFD1s%2BjoY3qBO%2Fg0PDkBNvdnL%2BcVjlSAxupOEK8KksXceN9IkdqG%2B4njoCJqMDKAo9Zxio6lvZH%2FSYCZX3oC7%2Bz2xjUPYLolBK0kcv3Ug36pKjrTpy1he%2B2nQEDU%2BDUaDPRRYImmvztp3DPWGYrFAURqgrPTuZ6ILwwJNauqAc0UF6RG7mHQkU96vv73Ia7eRcBO2NEvwr4guLulhRqTnVGz6EdTvnhjS%2ByaLA2i8GhMDo8%2BxtRz1Q43ZHS8Uz67BLpv4r9zsixe8J%2FKCgXz%2FC%2BQhmvxb%2B53FGdnBEDeB20PCB9V0%2FcWTrX61QLU0u19OWRIKLXaV11nuRhUCipUQnQB8yUOVf7gPFyCY7HIqkstfw6x9zjYFlrY8QEcuu7HaRjB6GMKZ%2BROj%2BbQm%2FYxbDSloJ9N0bwTALePXYdMOip3PMFOusB89S2oiDK46gdJdSkvfTx1KdR09pUcLCod2nDbwAOYq5uYEosEzPcEB%2FK%2FRknyJF6BK2Wu0WCJZeJlQiiVvIsw8f47h4LIyH58%2BEaoYXN7zefbwpoWFSj1wA4s0zhBmLnVSt9EZfyabsXMcICNvYP%2FtsaIJJUeFnBmpKjXPmItgPmZIFj63ISj2Sfl7bScJGcgeyFAQWSd8bnfS%2BF0E1zg1x4qtCgr9PD5FmeZUJZoFL1E4rAnb5J8Gx%2B8kYLZepAypr8Fj4xm93yu9UcE0RfdQKCmS2lgVGKy7uP%2BcQj353XNvmXXTFfYD7F8A%3D%3D&X-Amz-Signature=62e450f812d1941969c93ccc37cec4ca32b7d30fd0abdc2716ec4cb571a7293b&X-Amz-SignedHeaders=host&response-content-disposition=filename%20%3D%22object-4-3-1.png%22)

### 그렇다면 우리는 질문할 것이다.

모듈 내의 얼마나 많은 요소가 강하게 연관돼 있어야 응집도가 높다고 말할 수 있는가?

모듈 사이에 어느 정도의 의존성만 남겨야 결합도가 낮다고 말할 수 있는가?

### 정답은 없다.

하지만 점검해 볼 수 있는 몇가지 요소는 있다. 

### 높은 결합도

결합도가 낮은 원인은 대부분 **캡슐화가 내부 구현을 그대로 노출**하기 때문이다. 

객체 내부의 구현이 객체의 인터페이스에 드러난다는 것은 **클라이언트가 구현에 강하게 결합된다는 것을 의미**한다. 

그리고 더 나쁜 소식은 단지 객체의 내부 구현을 변경 했음에도 이 인터페이스에 의존하는 모든 클라이언트들도 함께 변경해야 한다는 것이다. 
```java
    public class Movie {
    	private Money fee;
    	
    	public Money getFee() {
    		return fee;
    	}
    
    	pubic void setfee(Money fee) {
    		this.fee = fee;
    	}
    }
```
### 낮은 응집도

서로 다른 이유로 변경되는 코드가 하나의 모듈 안에 공존할 때 모듈의 응집도가 낮다고 말한다. 변경의 이유가 서로 다른 코드들을 하나의 모듈 안에 뭉쳐 놓았기 때문에 변경과 아무 상관이 없는 코드들이 영향을 받게 된다. 

하나의 요구사항 변경을 반영하기 위해 동시에 여러 모듈을 수정해야 한다. 응집도가 낮을 경우 다른 모듈에 의지해야 할 책임의 일부가 엉뚱한 곳에 위치하게 되기 때문이다.

# 자율적인 객체를 향해

## 캡슐화를 지켜라

객체에게 의미 있는 메서드는 객체가 책임져야 하는 무언가를 수행하는 메서드다. 속성의 가시성을 private으로 설정했다고 해도 접근자와 수정자를 통해 속성을 외부로 제공하고 있다면 캡슐화를 위반하는 것이다. 

### 아래와 같은 코드는 어떤 문제가 있을까?
```java
    public Rectangle {
    	private int left;
    	private int top;
    	private int right;
    	private int bottom;
    
    	public int getLeft() { return left; }
    	public void setLeft(int left) { this.left = left; }
    	
    	public int getTop() { return top; }
    	public void setTop(int top) { this.top = top; }
    
    	public int getRight() { return right; }
    	public void setRight(int right) { this.right = right; }
    
    	public int getBottom() { return bottom; }
    	public void setBottom(int bottom) { this.bottom = bottom; }
    
    }
```
첫 번째는 '**코드 중복**'이 발생할 확률이 높다는 것이다. 
사각형의 너비와 높이를 증가시키는 코드가 필요하다면 아마 getRight, getBottom 메서드를 호출하고 setRight, setRight 메서드를 수정하는 **유사한 로직**이 존재할 것이다. 따라서 코드 중복을 초대할 수 있다. 

두 번째 문제점은 '**변경에 취약**'하다는 점이다. Rectangle이 right와 bottom대신 length와 height를 이용해서 사각형을 표현하거나 type을 변경한다고 하면 해당 메서드를 사용하는 클라이언트들은 **모두 수정** 해주어야 한다. 

> 캡슐화의 진정한 의미
캡슐화란 변할 수 있는 어떤 것이라도 감추는 것이다. 그것이 속성의 타입이건, 할인 정책의 종류건 상관 없이 내부 구현의 변경으로 인해 외부의 객체가 영향을 받는다면 캡슐화를 위반한 것이다. 
설계에서 변하는 것이 무엇인지 고려하고 변하는 개념을 캡슐화해야 한다.

### 데이터 중심 설계는 객체를 고립시킨 채 오퍼레이션을 정의하도록 만든다

**올바른 객체지향 설계의 무게 중심은 항상 객체의 내부가 아니라 외부에 맞춰져 있어야 한다** 객체가 내부에 어떤 상태를 가지고 그 상태를 어떻게 관리하는가는 부가적인 문제다. 

안타깝게도 데이터 중심 설계에서 초점은 객체의 외부가 아니라 내부로 향한다. 실행 문맥에 대한 깊이 있는 고민 없이 객체가 관리할 데이터의 세부 정보를 먼저 결정한다. 객체의 구현이 이미 결정된 상태에서 다른 객체와의 협력 방법을 고민하기 때문에 이미 구현된 객체의 인터페이스를 억지로 끼워맞출수밖에 없다.