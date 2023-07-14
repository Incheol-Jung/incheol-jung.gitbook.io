# break 와 continue 사용

<figure><img src="../../.gitbook/assets/1 (1).jpg" alt=""><figcaption><p><a href="https://techdifferences.com/difference-between-break-and-continue.html">https://techdifferences.com/difference-between-break-and-continue.html</a></p></figcaption></figure>





## 코드리뷰

<figure><img src="../../.gitbook/assets/2 (4).png" alt=""><figcaption></figcaption></figure>

* 코드리뷰를 하다가 루프문안에 continue를 호출하는 로직이 있었다
* 개인적으론 continue나 break를 사용하는 로직은 일반적인 프로세스를 사용자가 임의로 컨트롤하는 로직이라 지양하는 편이다
* 처음엔 로직이 잘 읽힐수 있지만 시간이 지나면서 꼭 로직의 흐름을 임의로 변하는 곳에서는 오류가 자주 발생한다는 생각을 가지고 있었다
* 하지만 개인적인 생각일수도 있으니 팀원들에게 물어보게 되었다

## 주제를 던져보자

<figure><img src="../../.gitbook/assets/3 (2).png" alt=""><figcaption></figcaption></figure>



* 다양한 의견이 있었다
* 그래도 취합된 의견은 이렇다

### 취합해보자

* 루프문에서 흐름을 변경하는건 일반적으로 지양하는게 좋은것 같다
* 하지만 루프문 block 안에서 어느 위치가 있는지 중요한것 같다
* block 초반에 루프문의 흐름을 제어하는건 가독성도 충분히 괜찮다고 생각한다
* 다만, block 중반에 있는 루프문은 코드를 따라가면서 확인해야 하므로 지양하는게 좋다고 생각한다

## 새로운 깨달음

* 그러면서 동료가 스택오버플로우에서 특정 문구를 전달해주었다
* 링크 : [https://softwareengineering.stackexchange.com/questions/58237/are-break-and-continue-bad-programming-practices](https://softwareengineering.stackexchange.com/questions/58237/are-break-and-continue-bad-programming-practices)



<figure><img src="../../.gitbook/assets/4 (5).png" alt=""><figcaption></figcaption></figure>



#### 절대적인 기준만으로는 좋은 개발자가 될수없다.

* 이 문장에 많이 공감했던것 같다
* 나 또한 어떤 기준에 의해 이분법으로 생각했던것 같아 나를 돌아보는 시간이 되었던것 같다

> 안좋은 코드는 없다. 단지 그 코드를 사용하는 상황이 안좋은 코드를 만든다고 생각한다
