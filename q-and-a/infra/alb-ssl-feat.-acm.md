# ALB에 SSL 설정하기(feat. ACM)

<figure><img src="../../.gitbook/assets/1 (8).png" alt=""><figcaption><p><a href="https://k21academy.com/amazon-web-services/aws-certificate-manager-acm/">https://k21academy.com/amazon-web-services/aws-certificate-manager-acm/</a></p></figcaption></figure>

* 현재는 가비아를 통해 DNS를 구입해서 ALB를 통해 애플리케이션과 통신하고 있다
* 일반적으로 웹서버를 구축했다면 SSL 인증서를 도메인 서버에서 발급받아 처리할 것이다
* 하지만 우리는 웹서버가 구축되지 않았기 때문에 인증서를 사용하지 않는다

#### 그럼 웹서버가 없을 경우엔 SSL을 어떻게 구축하는게 좋을까?

## ACM(AWS Certificate Manager)

<figure><img src="../../.gitbook/assets/2 (3) (3).png" alt=""><figcaption></figcaption></figure>

* ACM은 웹사이트에 필요한 SSL/TLS 인증서 및 키를 통합 관리할 수 있는 서비스이다

### 인증서 생성

<figure><img src="../../.gitbook/assets/3.png" alt=""><figcaption></figcaption></figure>

* 인증서를 생성하기에 앞서 필수 조건이 있다
* 도메인은 사전에 구매해야 하고 도메인을 구매한 계정의 이메일을 확인할 수 있어야 한다
* 왜냐하면 SSL 인증서를 생성하기에 앞서 기존에 있는 도메인이 본인 소유인지 소유권을 확인하기 때문이다

#### 인증 하는 방법은 두가지 이다

1. DNS에 요청하여 DNS 소유자한테 ACM 인증을 요청한다(AWS에서 권장하는 방법)
2. DNS 소유자한테 이메일을 전송하여 ACM 인증을 요청한다

#### 인증 요청 메일 확인하기

<figure><img src="../../.gitbook/assets/4 (1).png" alt=""><figcaption></figcaption></figure>

* 링크버튼을 누르면 소유권 인증이 완료된다

## 그럼 인증서를 어떻게 사용할 수 있을까?

* 우리는 DNS와 애플리케이션 연결하는 방법을 ALB를 사용하고 있었다
* 이전에는 도메인으로 전달받은 요청(PORT : 80)을 EC 내의 실행중인 애플리케이션의 PORT로 연결하고 있다
* 그렇다는 것은 ALB 설정에서 80 포트가 아닌 443 포트로 요청이 왔을때도 실행중인 애플리케이션의 PORT로 연결하면 될것이다

<figure><img src="../../.gitbook/assets/5 (2).png" alt=""><figcaption></figcaption></figure>

## 결과 화면

<figure><img src="../../.gitbook/assets/6 (6).png" alt=""><figcaption></figcaption></figure>
