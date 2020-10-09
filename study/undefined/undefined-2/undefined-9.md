---
description: 객체지향과 디자인 패턴(최범균 저) 컴포지트 패턴 정리한 내용입니다.
---

# 컴포지트 패턴

## 상황

빌딩의 장비들의 전원을 관리하는 제어 프로그램을 개발한다고 하자. 이 프로그램을 만들기위해 개별 장비의 전원을 켜고 끄는 기능을 제공하는 인터페이스를 정의하고, 장비 별로 알맞은 콘트리트 클래스를 구현했다. 또한 개별 장비가 아닌 장비들을 하나로 묶어서 관리할 수 있도록 하기 위해 DeviceGroup 클래스를 추가하였다.

```java
public class PowerController {
    public void turnOn(Long deviceId){
        Device device = findDeviceById(Long deviceId);
        device.turnOn();
    }
    
    // turnGroupOn()과 turnOn()은 개별/그룹 차이를 빼면 동일한 기능이다. 
    public void turnGroupOn(Long groupId) {
        DeviceGroup group = findGroupById(Long groupId);
        group.turnAllOn();
    }
}
```

## 문제

위 코드에는 단점이 있다. PowerController 입장에서 봤을 때 장비나 장비 그룹의 전원을 켜는 동작은 동일한 동작임에도 불구하고 Device와 DeviceGroup을 구분해서 처리해야 한다는 점이다. 전원 켜고/끄는 기능 외에 소비 전력 측정과 같은 새로운 기능이 추가될 경우 PowerController 클래스에는 turnOn\(\)/turnGroupOn\(\)처럼 거의 동일한 메서드가 추가된다.

## 해결방법

거의 동일한 코드가 중복된다는 점은 결국 복잡도를 높여서 코드의 수정이나 확장을 어렵게 만드는데, 이런 단점을 해소하기 위해 사용되는 패턴이 바로 컴포지트 패턴이다.

#### 컴포지트 패턴에서 컴포지트는 다음의 책임을 갖는다.

* 컴포넌트 그룹을 관리한다.
* 컴포지트에 기능 실행을 요청하면, 컴포지트는 포함하고 있는 컴포넌트들에게 기능 실행 요청을 위임한다.

```java
public class DeviceGroup implements Device {
    private List<Device> devices = new ArrayList<Device>();

    public void addDevice(Device d){
        devices.add(d);
    }

    public void remove(Device d){
        devices.remove(d);
    }

    public void turnOn(){
        for(Device device : devices){
            device.turnOn(); // 관리하는 Device 객체들에게 실행 위임
        }
    }

    public void turnOff(){
        for(Device device : devices){
            device.turnOff(); // 관리하는 Device 객체들에게 실행 위임
        }
    }
}
```

이제 DeviceGroup 클래스는 Device 타입이 되므로, 전원 제어 기능을 제공하는 PowerController 클래스는 Device 타입과 DeviceGroup 타입을 구분할 필요 없이 다음과 같이 Device 타입만을 이용해서 전원 관리를 할 수 있게 된다. 즉, 전체냐 부분이냐에 상관없이 클라이언트는 단일 인터페이스로 기능을 실행할 수 있는 장점이 생긴다.

## 컴포지트 패턴 구현의 고려 사항

컴포지트 패턴을 구현할 때 고려할 점은 컴포넌트를 관리하는 인터페이스를 어디서 구현할지에 대한 여부다. 컴포지트 패턴의 장점 중 하나는 클라이언트가 컴포지트와 컴포넌트를 구분하지 않고 컴포넌트 인터페이스만으로 프로그래밍 할 수 있게 돕는다는 점인데, 앞서 예제에서는 컴포지트인 DeviceGroup에 인터페이스를 정의했다.

