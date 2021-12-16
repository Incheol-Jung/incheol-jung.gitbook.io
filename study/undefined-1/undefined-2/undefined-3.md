---
description: 객체지향과 디자인 패턴(최범균 저) 데코레이터 패턴 정리한 내용입니다.
---

# 데코레이터 패턴

## 상황

데이터를 파일에 출력하는 기능을 제공하는 FileOut 클래스가 있을 때, FileOut 클래스에 버퍼 기능을 추가하거나 압축 기능을 추가하려고 한다.

## 문제

상속을 이용한 기능 확장 방법이 쉽긴 하지만, 다양한 조합의 기능 확장이 요구될 때 클래스가 불필요하게 증가하는 문제가 발생된다. 버퍼 기능과 압축 기능을 함께 제공해야 한다거나 압축한 뒤 암호화 기능을 제공해야 한다거나, 또는 버퍼 기능과 암호화 기능을 함께 제공해야 한다면, 다음과 같이 클래스가 증가하고 계층 구조가 복잡해진다.

![](../../../.gitbook/assets/333%20%2811%29.png)

## 해결방법

이런 경우에 사용할 수 있는 패턴이 데코레이터 패턴이다. 데코레이터 패턴은 상속이 아닌 위임을 하는 방식으로 기능을 확장해 나간다. 여기서 중요한 점은 기능 확장을 위해 FileOutImpl 클래스를 상속받지 않고 Decorator라 불리는 별도의 추상 클래스를 만들었다는 점이다. 데코레이터 패턴을 사용하면 각 확장 기능들의 구현이 별도의 클래스로 분리되기 때문에, 각 확장 기능 및 원래 기능을 서로 영향 없이 변경할 수 있도록 만들어 준다. 즉, 데코레이터 패턴은 단일 책임 원칙을 지킬 수 있도록 만들어 준다.

```java
// FileOut 인터페이스를 구현한 Decorator 추상 클래스
public abstract class Decorator implements FileOut {
    private FileOut delegate; // 위임 대상
    public Decorator(FileOut delegate) {
        this.delegate = delegate;
    }

    protected void doDelegate(byte[] data) {
        delegate.write(data); // delegate에 쓰기 위임
    }
}
// Decorator 추상 클래스를 상속한 확장 클래스
public class EncryptionOut extends Decorator {
    public EncryptionOut(FileOut delegate) {
        super(delegate);
    }

    public void write(Byte[] data) {
        byte[] encryptedData = encrypt(data);
        super.doDelegate(encryptedData);
    }
    
    private byte[] encrypt(byte[] data){
        ...
    }
}
// FileOut 인스턴스에 암호화 기능 추가
public static void main(String[] args) {
    FileOut delegate = new FileOutImpl();
    FileOut fileOut = new EncryptionOut(delegate);
    fileOut.write(data);
}
```

## 데코레이터 패턴을 적용할 때 고려할 점

데코레이터 패턴을 구현할 때 고려할 점은 데코레이터 대상이 되는 타입의 기능 개수에 대한것이다. 앞서 예제에서 데코레이터 개상이 되는 FileOut 타입은 write\(\) 메서드가 한 개만 정의되어 있어 데코레이터의 구현이 비교적 간단하지만, 정의되어 있는 메서드가 증가하게 되면 그 만큼 데코레이터의 구현도 복잡해진다.

데코레이터 구현에서 고려해야 할 또 다른 상항은 데코레이터 객체가 비정상적으로 동작할 때 어떻게 처리할 것이냐에 대한 것이다. 데코레이터의 단점은 사용자 입장에서 데코레이터 객체와 실제 구현 객체의 구분이 되지 않기 때문에 코드만으로는 기능이 어떻게 동작하는지 이해하기 어렵다는 점이다.

