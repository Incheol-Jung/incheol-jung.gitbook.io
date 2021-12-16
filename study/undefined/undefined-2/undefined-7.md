---
description: 객체지향과 디자인 패턴(최범균 저) 파사드 패턴 정리한 내용입니다.
---

# 파사드 패턴

## 상황

직원 정보, 직원의 이력 정보, 그리고 직원에 대한 평가 정보를 읽어 와 화면에 보여주는 GUI 프로그램을 만들려고 한다. 이 때, HR팀으로부터 화면뿐만 아니라 XML이나 엑셀로 동일한 데이터를 추출해 달라는 요구 사항이 들어왔다.

## 문제

추가 기능을 구현하면서 발생할 수 있는 문제점 중 가장 큰 것은 GUIViewer, XMLExporter, ExcelExporter 사이에서 코드 중복이 발생한다는 점이다. 새 클래스는 모두 동일한 코드를 이용해서 EmpDao, ResumeDao, EvaluationDao 객체를 사용하고 데이터를 추출한다. 이런 코드 중복에서 더 큰 문제는 코드가 완전히 똑같기 보다는 GUIViewer, XMLExporter, ExcelExporter 마다 약간씩 달라질 수 있다는 점이다. 중복된 코드에서 미세한 차이가 발생하면 이후 변경해 주어야 할 때 미세한 차이점을 누락할 가능성이 높아지고, 이는 결국 프로그램에 버그를 만드는 원인이 된다. 따라서 이들 Dao 들의 인터페이스에 일부 변화가 발생하면 이 Dao를 직접적으로 사용하고 있는 나머지 GUIViewer, XMLExporter, ExcelExporter에 모두 영향을 미치게 된다.

![](<../../../.gitbook/assets/1 (19).png>)

## 해결방법

코드 중복과 직접적인 의존을 해결하는데 도움을 주는 패턴이 파사드(Facade) 패턴이다. 파사드 패턴은 서브 시스템을 감춰 주는 상위 수준의 인터페이스를 제공함으로써 이 문제를 해결한다.

![](<../../../.gitbook/assets/2 (9).png>)

```java
// 파사드 패턴 적용 전
public class GuiViewer {
    public void display() {
        Emp emp = empDao.select(id);
        Resume resume = resumeDao.select(id);
        Evaluation eval = evaluationDao.select(id);
        ...
    }
}

// 파사드 패턴 적용 후
public class GuiViewer {
    public void display() {
        EmpReport rep = empReportDaoFacade.select(id);
        ...
    }
}
```

## 파사드 패턴의 장점과 특징

클라이언트와 서브 시스템 간의 결합을 제거함으로써 얻을 수 있는 또 다른 이점은 파사드를 인터페이스로 정의함으로써 클라이언트의 변경 없이 서브 시스템 자체를 변경할 수 있다는 것이다. 파사드 패턴은 단지 여러 클라이언트에 중복된 서브 시스템 사용을 파사드로 추상화할 뿐이다. 따라서 다수의 클라이언트에 공통된 기능은 파사드를 통해서 쉽게 서브 시스템을 사용할 수 있도록 하고, 보다 세밀한 제어가 필요한 경우에는 서브 시스템에 직접 접근하는 방식을 선택할 수 있다.

파사드 패턴을 클래스와 비교해 보면, 파사드는 마치 서브 시스템의 상세함을 감춰 주는 인터페이스와 유사하다. 파사드를 통해서 서브 시스템의 상세한 구현을 캡슐화하고, 이를 통해 상세한 구현이 변경되더라도 파사를 사용하는 코드에 주는 영향을 줄일 수 있게 된다.
