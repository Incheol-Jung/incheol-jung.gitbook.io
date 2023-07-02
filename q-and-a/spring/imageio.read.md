# ImageIO.read 동작하지 않는 경우

## 간혹 이미지를 읽지 못하는 경우가 있다…

```jsx
BufferedImage bufferedImage = ImageIO.read(new URL(fileUrl)); // return null???
```

* 위와 같이 [ImageIO.read](http://imageio.read) 메서드에서 특정 파일을 읽어올때 리턴값이 null로 리턴되는 경우가 있었다
* 분명히 파일은 JPG였는데 파일을 읽지 못하는 경우가 발생했다…



<figure><img src="../../.gitbook/assets/3542385344_4BQlcRAe_208a1ef490e1405698c3e1bf68edefda89840d14.jpg" alt=""><figcaption><p><a href="http://jjal.today/bbs/board.php?bo_table=gallery&#x26;wr_id=629&#x26;sst=wr_datetime&#x26;sod=asc&#x26;sop=and&#x26;page=31">http://jjal.today/bbs/board.php?bo_table=gallery&#x26;wr_id=629&#x26;sst=wr_datetime&#x26;sod=asc&#x26;sop=and&#x26;page=31</a></p></figcaption></figure>



### 👀 혹시 디자이너는 알 수 있을까??

* 디자이너분한테 읽히지 않는 파일을 전달해본다
* 포토샵으로 확인해보니 RGB 모드가 `CMYK` 되어있다고 한다

#### RGB와 CMYK의 차이는 무엇이지?

* RGB는 삼원색으로 대부분의 웹용 이미지에 사용되며 모니터나 핸드폰, TV 등에 사용되는 색상모드라고 한다
* CMYK는 감산혼합, 색료 혼합으로 잉크 인쇄용 이미지에 사용되는 색상모드로 명함, 책, 브로슈어 등의 출력에 사용된다고 한다. 그리고 RGB에 비해 용량은 1/3 정도 커지게 된다고 한다

### 그렇다면 어떻게 해결할 수 있을까?

* 이미지를 읽을 수 있도록 호환되는 부분을 확장시켜보자
* 플러그인을 추가하면 간단하게 ImageIO에 대한 호환성을 확장시킬 수 있다
* [https://github.com/haraldk/TwelveMonkeys#jpeg](https://github.com/haraldk/TwelveMonkeys#jpeg) 에 확장되는 유형이 노출되어 있다

#### 호환되는 확장자 추가

```jsx
// build.gradle

implementation group: 'com.twelvemonkeys.imageio', name: 'imageio-jpeg', version: '3.9.4'
```

{% hint style="info" %}
출처\
\
[https://bestofme-20.tistory.com/353](https://bestofme-20.tistory.com/353)
{% endhint %}
