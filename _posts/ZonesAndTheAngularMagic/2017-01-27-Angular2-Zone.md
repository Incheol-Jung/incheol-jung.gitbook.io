---
layout: post
title:  "Angular 2 and Zone"
date:   2017-01-27 00:00:00
categories: ZonesAndTheAngularMagic
comments: true
---

Angular 2는 동일한 원칙을 기반으로하지만 다른 방식으로 구현 된다. 우리는 더 똑똑한 방법으로 말할 수도 있다.<br/>

Angular 팀은 문제의 첫 번째 부분 인 변경 감지를 트리거하기 위해 Zone.js라는 작은 사이드 프로젝트를 구축했다. 이 프로젝트는 영역이 다른 프로젝트에서 유용 할 수있는 도구이기 때문에 Angular에 묶여 있지 않는다. 영역은 전혀 새로운 개념이 아니다. Dart 언어 (다른 Google 프로젝트)에 이미 상당 부분 존재한다. 그것들은 또한 Node.js (현재 버려진)의 Domains 또는 java의 ThreadLocals와 유사하다.<br/>

- Zones
영역은 실행 컨텍스트이다. 이 컨텍스트는 실행할 코드를 수신했으며 이 코드는 동기식 또는 비동기식이 될 수 있다. 영역은 몇 가지 이점을 제공한다.<br/>

• 실행하기 전후에 실행될 수있는 후크<br/>
• 실행할 코드의 잠재적 인 오류를 가로 채기위한 방법<br/>
• 이 컨텍스트에 바인딩 된 변수를 저장하는 방법<br/>

예를 들어 보자. 내 응용 프로그램에 다음 코드가 있다고 가정하자

```javascript
// score computation -> synchronous
const score = computeScore();
// player score update -> synchronous
updatePlayer(player, score);
```

이 코드를 실행하면 다음을 얻을 수 있다.

```javascript
computeScore: new score: 1000
udpatePlayer: player 1 has 1000 points
```

이제는 해당 코드를 실행하는 데 소요 된 시간을 측정하려고 한다고 가정하자. 

```javascript
startTimer();
const score = computeScore();
updatePlayer(player, score);
stopTimer();
```

그리고 그 결과는 다음과 같다. 

```javascript
start
computeScore: new score: 1000
udpatePlayer: player 1 has 1000 points
stop: 12ms
```

이제 updatePlayer가 비동기 함수 인 경우 어떻게 될까? JavaScript는 아주 특별한 방식으로 동작한다.비동기 작업은 실행 큐의 끝에 배치되므로 동기 작업 후에 실행 된다.

```javascript
startTimer();
const score = computeScore();
updatePlayer(player, score); // asynchronous
stopTimer();
```

```javascript
start
computeScore: new score: 1000
stop: 5ms
udpatePlayer: player 1 has 1000 points
```

내 실행 시간은 더 이상 올바르지 않는다 : 그것은 코드에서 동기화 작업이 수행 한 시간 만 측정하고 시작부터 점수 업데이트가 끝난 시간은 측정하지 않는다! 그것이 영역이 유용 할 수있는 곳이다. 전용 실행 컨텍스트에서 코드를 실행한다.

```javascript
const scoreZone = Zone.current.fork({ name: 'scoreZone' });
scoreZone.run(() => {
    const score = computeScore();
    updatePlayer(player, score); // asynchronous
});
```

왜 이것이 도움이 될까? zone.js 라이브러리가 브라우저에 의해로드되면 자바 스크립트 런타임에서 모든 비동기 함수에 패치를 적용하여 시작한다. 따라서 setTimeout () 또는 setInterval ()을 사용할 때마다 또는 Promises, XMLHttpRequest, WebSocket, FileReader, GeoLocation 등과 같은 비동기 API를 사용할 때마다 우리는 실제로 zone.js의 패치 버전을 호출 한다. 따라서 Zone.js는 비동기 작업이 완료된 시점을 알고 개발자가 해당 시점에 일부 후크를 실행할 수 있다.<br/>

영역은 여러 가지 고리를 제공한다.<br/>
• onInvoke는 영역에서 래핑 된 코드를 실행하기 전에 호출된다.<br/>
• onHasTask는 영역에서 랩핑 된 코드가 실행을 마친 후에 호출된다.<br/>
• onHandleError는 영역에서 래핑 된 코드가 예외를 throw 할 때 호출된다.<br/>
• onFork은 영역이 만들어 질 때 호출된다.<br/>

따라서 우리는 존과 그 후크를 사용하여 비동기 작업의 시작부터 끝까지 소요 된 전체 시간을 측정 할 수 있다.

```javascript
const scoreZone = Zone.current.fork({
name: 'scoreZone',
onInvoke(delegate, current, target, task, applyThis, applyArgs, source) {
    // start the timer
    startTimer();
    return delegate.invoke(target, task, applyThis, applyArgs, source);
    },
    onHasTask(delegate, current, target, hasTaskState) {
    delegate.hasTask(target, hasTaskState);
    if (!hasTaskState.macroTask) {
        // if the zone run is done, stop the timer
        stopTimer();
    }
}
});
scoreZone.run(() => {
    const score = computeScore();
    updatePlayer(player, score);
});
```

그리고 이번에는 결과가 정확하다!

```javascript
start
computeScore: new score: 1000
udpatePlayer: player 1 has 1000 points
stop: 12ms
```

이제 Angular 2가 이 메커니즘의 이점을 누릴 수있는 방법을 추측 할 수 있다. 실제로 프레임 워크의 첫 번째 문제는 변경 감지가 트리거 되어야 하는 시기를 파악하는 것이다. 영역을 사용하고 영역에서 작성한 코드를 실행하면 프레임 워크에서 어떤 일이 일어나고 있는지 잘 볼 수 있다. 더 나은 방법으로 오류를 처리 할 수 있다. 그러나 더 중요한 것은 비동기 작업이 완료 될 때마다 변경 감지를 트리거 할 수 있다는 것이다.<br/>

단순화하기 위해 Angular 2는 다음과 같이 처리한다.

```javascript
const angularZone = Zone.current.fork({
    name: 'angular',
    onHasTask: triggerChangeDetection
});
angularZone.run(() => {
// your application code
});
```

그리고 첫 번째 문제가 이렇게 해결되었다! 그래서 Angular 2에서는 AngularJS 1.x와 달리 자동 변경 감지 기능을 사용하기 위해 특별한 서비스를 사용할 필요가 없다. 원하는 것을 사용할 수 있으며 영역이 이를 처리한다.<br/>

영역은 표준화 과정에 있으므로 공식적인 ECMAScript 사양의 일부가 될 수 있다. 다른 흥미로운 정보 인 zone.js의 현재 구현은 WTF에 대한 정보도 제공한다. (이 문맥에서 Web Tracing Framework). 이 라이브러리를 사용하면 개발 모드에서 응용 프로그램을 프로파일링하고 응용 프로그램 및 프레임 워크 코드의 모든 부분에서 소요 된 시간을 정확히 알 수 있다. 요컨대 필요한 경우 성능을 분석하고 문제를 해결할 수있는 충분한 정보이다. <br/><br/>

- Change detection in Angular 2 <br/>

문제의 두 번째 부분은 변경 감지 자체이다. 시작 시점 및 방법을 파악하는 것이 하나의 방법이지만 작동 원리를 아는 것도 중요하다.<br/>
우선 Angular 애플리케이션은 구성 요소의 트리라는 것을 기억해야 한다. 변경 감지가 시작되면 프레임 워크는 트리의 모든 구성 요소를 거쳐 상태가 변경되었는지, 새 상태가 해당보기에 영향을 주는지 확인한다. 이 경우 변경 사항의 영향을 받는 구성 요소의 DOM 부분이 업데이트 된다.<br/>
트리 탐색은 루트에서 잎으로 이동하며 AngularJS 1.x와는 달리 한 번만 수행된다. 이제는 큰 차이가 있기 때문에 변경 감지로 Angular 2의 응용 프로그램 모델이 변경되지 않지만 AngularJS 1.x의 관찰자는 해당 단계에서 모델을 변경할 수 있다.<br/>
또 다른 큰 차이점은 구성 요소가 상태와 자식 상태를 수정할 수 있지만 조상의 상태를 수정해서는 안된다. 따라서 계단식 변경 사항은 이제 더 이상 사용하지 않는다.<br/>
따라서 변경 감지는 모델의 변경 사항을 확인하고 이에 따라 DOM을 수정하는 데에만 사용된다. 그것은 버전 1.x에서와 같이 모델에 부작용을 가질 수 없기 때문에 모델을 순회 (traversal)하여 수정할 수 없으므로 트리를 두 번 통과 할 필요가 없다!<br/>
정확하게 말하자면 개발 모드에서 두 번 정확하게 탐색하여 그러한 바람직하지 않은 부작용이 존재하지 않는다고 주장한다. (예 : 부모 구성 요소 모델을 수정하는 하위 구성 요소). 두 번째 단계에서 이러한 변경이 감지되면 개발자에게 문제를 경고하는 예외가 throw된다.<br/>
이 전략에는 많은 이점이 있다.<br/>

• 상태 변경은 양방향으로 작성되는 대신 상위에서 하위로 한 가지 방법으로 이루어지기 때문에 응용 프로그램에 대한 이유를 쉽게 판단 할 수 있다.<br/>
• 변경 감지에는 무한 루프가 더 이상있을 수 없다.<br/>
• 변경 감지가 훨씬 빠르다.<br/>

AngularJS 1.x는 (M 관찰자) * (N 사이클) 검증을 수행했으나 Angular 2는 M 검증만을 수행한다.
그러나 Angular 2의 성능 향상에 고려해야 할 또 다른 매개 변수가 있다. 프레임 워크가 이러한 확인을 수행하는 데 걸린 시간이다. Google 팀은 컴퓨터 과학 및 가상 시스템에 대한 모든 지식을 활용 하였다.<br/>

성능이 어떻게 개선되었는지 이해하려면 두 버전의 프레임 워크에서 표현식이 평가되고 값이 비교되는 방식을 검토해야한다.<br/>
버전 1.x에서는 메커니즘이 매우 일반적이다. 하나의 일반 메소드가 모든 워처에 대해 호출되며 이전 값과 새 값을 비교할 수 있다. 문제는 브라우저 (예 : Google 크롬을 사용하는 경우 V8)에서 JavaScript 코드를 실행하는 가상 머신이 제네릭 코드를 정말 좋아하지 않는다는 것이다.<br/>

괜찮다면 가상 머신의 동작에 대해 조금 말하겠다. 자바 스크립트 프레임 워크에 대한 책에서 그런 기대를하지 않았는가? 가상 머신은 아주 특별한 프로그램이다. 즉, 코드 한 장을주고 기계 코드로 변환하여 실행한다. 우리 중 아주 소수만이 효율적인 기계 코드를 생성 할 수 있지만 실제로는 신경 쓰지 않는다. 우리는 고급 언어를 사용하고 가상 시스템이이를 처리하도록 한다. 그들은 코드를 번역 할 뿐만 아니라 코드를 최적화 한다. 그리고 그들은 그것을 아주 잘 동작한다. 일부는 사전에 알 수 없는 런타임 정보의 이점을 누리기 때문에 수동으로 최적화 된 코드보다 빠르게 실행되는 코드도 생성한다.<br/>

성능을 향상시키기 위해 동적 JavaScript 코드를 실행하는 가상 시스템과 같은 가상 시스템은 인라인 캐싱이라는 전략을 사용한다. 40 년 전 (IT에서의 영원) SmallTalk를 위해 고안된 아주 오래된 기술이다. 프로그램이 함수를 자주 호출하고 동일한 모양을 가진 객체로 VM이 평가하는 방식을 기억해야 한다.<br/>
따라서 이 기술은 캐시를 사용하므로 이름이 인라인 캐싱된다. 객체를 받으면 캐시에서 객체의 모양을 인식하는지 확인한다. 그리고 그렇게 되면 캐시 된 최적화 된 방법으로 객체의 속성에 액세스 한다.<br/>
이러한 종류의 캐시는 함수의 인수가 같은 모양을 갖는다면 정말 유용하다. 예를 들어 {name : 'Cédric'}과 {name : 'Cyril'}의 모양은 같다. 그러나 {이름 : 'JB', 스킬 : []}은 다른 두 개의 스킬과 같은 모양이 아니다.<br/>

인수가 항상 같은 모양 인 경우 캐시는 단일 양식이므로 매우 빠른 결과를 생성한다. 캐시에 몇 개의 항목 만 있으면 다형성을 갖는다. 즉, 코드가 조금 느려지는 여러 종류의 객체로 메소드가 호출된다. 마지막으로, 너무 많은 다른 오브젝트 셰이프가 있는 경우, VM은 megamorphic이기 때문에 캐시를 완전히 삭제한다. 물론 이것은 성능면에서 최악의 경우이다.<br/>

이제 AngularJS 1.x의 변경 감지로 돌아가 보자. 모든 관찰자에 대해 호출 된이 고유 한 제네릭 함수가 인라인 캐싱을 사용하여 최적화 할 수 없음을 알았다. 우리는 코드가 가장 느린 거대한 상태에 있다. 대부분의 상황에서 이것이 문제가 되지는 않지만 많은 관찰자가 있는 일부 페이지에서는 성능이 충분하지 않은 한계에 도달하게 된다.<br/>
VM의 인라인 캐싱 최적화의 이점을 얻기 위해 Angular 2는 다른 전략을 채택했다. 모든 유형의 개체를 비교할 수 있는 단일 메서드를 사용하는 대신 모든 유형의 비교기를 동적으로 생성하기로 결정하였다. 응용 프로그램을 시작할 때 프레임 워크는 구성 요소 트리를 거쳐 각 구성 요소에 특정한 ChangeDetectors 세트를 생성한다.<br/>
예를 들어 뷰에 속성 이름이 표시된 구성 요소 사용자가 있으면 프레임 워크는 다음과 같은 ChangeDetector를 생성한다.<br/>

```javascript
class User_ChangeDetector {
    detectChanges() {
        if (this.name !== this.previousName) {
        this.previousName = this.name;
        hasChanged = true;
        }
    }
}
```

이 코드는 직접 작성한 코드와 유사하며 VM이 단일형이므로 최적화 할 수 있다. 결과적으로 훨씬 더 빠른 코드가 가능해지므로 더 복잡한 페이지가 가능하다.<br/>
다시 말하면 Angular 2는 AngularJS 1.x보다 적은 수식을 평가하고 더 적은 값을 비교해야하며 (단일 패스로 충분 함) 평가와 비교가 더 빨라졌다!<br/>
Google 팀은 처음부터 AngularJS 1.x, Angular 2 및 Polymer and React를 다양한 유스 케이스에서 비교 한 벤치 마크를 통해 성능을 모니터링하여 새로운 버전이 더 빠르게 유지되는지 확인했다.<br/>
실제로 필요하다면 프레임 워크가 제공하는 자동 최적화보다 더 나아갈 수도 있다. ChangeDetection 전략은 기본값에서 변경 될 수 있으므로 특정 사용 사례에 맞게 조정 및 조정할 수 있다.

