# G1 GC vs Z GC

<figure><img src="../../.gitbook/assets/1 (6).jpeg" alt=""><figcaption><p>https://www.dhaval-shah.com/g1-gc-primer/</p></figcaption></figure>

##

## G1 GC란?

* 이전의 GC는 Young Generation, Old Generation 영역이 고정적이었다
* G1 GC는 고정된 영역이 아닌 전체적인 heap 메모리를 논리적인 단위로 리전을 분리한다
* G1 GC는 사용하지 않는 개체의 영역을 수집하고 압축하여 STW를 최소화하였다
* JDK 9부터는 디폴트로 설정되어 있다



## G1 GC 동작원리?

<figure><img src="../../.gitbook/assets/2 (13).png" alt=""><figcaption><p>https://velog.io/@hanblueblue/GC-1.-G1GC</p></figcaption></figure>



* initial mark : old region에서 존재하는 개체들이 참조하는 survivor region을 찾는다
* root region scan : initial mark에서 확인한 region안에 있는 개체를 마킹한다
* concurrent mark : heap 메모리를 전체적으로 스캔하면서 unrechable 개체의 region을 확인한다
* remark : 애플리케이션을 멈추고 최종적으로 GC 대상에서 제외될 개체를 식별해낸다
* clean up : 살아 있는 개체가 가장 적은 region에 대해서 미사용 개체를 제거한다
* copy : 제거되지 않고 region에 살아남은 개체들은 새로운 region에 복사하며 compact 작업을 수행한다



## ZGC는 무엇이지?

<figure><img src="../../.gitbook/assets/3 (11).png" alt=""><figcaption><p>https://img-blog.csdnimg.cn/c1c1b6dd4e3142908e1c8a9d7430bd6a.png?x-oss-process=image/resize,m_fixed,h_150</p></figcaption></figure>



* ZGC는 ZPages를 사용하는데 이는 G1 GC의 Region과 비슷한 영역의 개념을 사용한다
* G1 GC의 Region의 크기는 고정이고, ZPages는 크기가 2의 배수로 동적으로 생성 및 삭제가 가능하다
* ZGC의 성능을 확보하기 위해서는 메모리가 8MB 부터 16TB 성능의 서버에서 사용할 수 있다
* G1 GC의 compact 과정에서 기존 개체와 새로운 region에 복사된 새로운 개체간 동기화가 정상적으로 이루어지지 않을 수 있다는 문제가 존재한다
* 그리고 가용할 수 있는 region을 확보해서 할당해야 하는데 이는 상당한 비용이 든다
* 이를 개선하고자 ZGC의 compact 과정은 새로운 region을 생성한 후 살아있는 개체들을 채우도록 동작한다
* ZGC의 목표는 모든 종류의 고비용 작업을 동시 작업하고 STW를 10ms를 미만으로 줄이는 것이다
* 단 ,ZGC는 메모리가 8MB \~ 16TB 정도로 고사양의 서버가 필요하다



## ZGC는 동작원리는?

* ZGC Heap은 위 그림과 같이 다양한 사이즈의 영역이 여러개 발생할 수 있다.
* ZGC가 compaction된 후, ZPage는 ZPageCache라 불리는 캐시에 삽입된다.
* 캐시 안의 ZPage는 새로운 Heap 할당을 위해 재사용할 준비를 한다.
* 메모리를 커밋과 커밋하지 않는 작업은 비용이 크기에 캐시의 성능에 중요한 영향을 끼친다.





## 참고

* [https://renuevo.github.io/java/garbage-collection/](https://renuevo.github.io/java/garbage-collection/)
* [https://thinkground.studio/2020/11/07/일반적인-gc-내용과-g1gc-garbage-first-garbage-collector-내용/](https://thinkground.studio/2020/11/07/%EC%9D%BC%EB%B0%98%EC%A0%81%EC%9D%B8-gc-%EB%82%B4%EC%9A%A9%EA%B3%BC-g1gc-garbage-first-garbage-collector-%EB%82%B4%EC%9A%A9/)
* [https://imprint.tistory.com/35](https://imprint.tistory.com/35)
* [https://www.blog-dreamus.com/post/zgc에-대해서](https://www.blog-dreamus.com/post/zgc%EC%97%90-%EB%8C%80%ED%95%B4%EC%84%9C)
* [https://steady-coding.tistory.com/590](https://steady-coding.tistory.com/590)
* [https://woooongs.tistory.com/54](https://woooongs.tistory.com/54)
* [https://kchanguk.tistory.com/175](https://kchanguk.tistory.com/175)
* [https://blog.leaphop.co.kr/blogs/42](https://blog.leaphop.co.kr/blogs/42)
* [https://huisam.tistory.com/entry/jvmgc#ZGC](https://huisam.tistory.com/entry/jvmgc#ZGC)
