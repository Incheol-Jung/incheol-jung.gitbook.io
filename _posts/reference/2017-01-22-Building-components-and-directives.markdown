---
layout:     reference
title:      CHAPTER 9. Building components and directives
date:       2017-01-22 00:00:00
updated:    2017-01-22 00:00:00
categories: reference
summary:    RBuilding components and directives
navigation_weight: 9
---


## Introduction

Component는 지시문과 실제로 다르지 않다. 단지 두 개의 선택적 속성이 있으며 관련 뷰가 있어야 한다. 지시어와 비교하여 많은 새로운 속성을 가져 오지는 않는다.


**************************************************************************************************


## Directives

지시문은 Template이 없는 것을 제외하고는 구성 요소와 매우 비슷하다. 사실, Component 클래스는 프레임 워크에서 Directive 클래스를 상속한다.<br/>
지시어 분석을 먼저 해보는 것이 좋다. 지시문과 관련하여 우리가 볼 수있는 모든 것이 구성 요소에도 적용된다. 
가장 많이 사용하는 구성 옵션을 살펴 보도록 하자. 더 고급 옵션은 추후에 기본 마스터 때 준비가되어 있다.<br/>

구성 요소의 경우 지시문에 장식자를 추가하지만 @Component 대신 @Directive를 사용하면 된다.<br/>

지시어는 매우 작은 영역이며 HTML의 데코레이터라고 생각할 수 있다. DOM의 요소에 behavior를 첨부하면 된다. 동일한 요소에 여러 개의 지시문을 사용할 수 있다.<br/>

지시어에는 템플릿에서 활성화 할 위치를 프레임 워크에 알려주는 CSS 선택자가 있어야 한다.

### Selectors<br/><br/>

셀렉터는 다양한 유형이 될 수 있다.
• 요소 : 대개 구성 요소의 경우처럼 바닥 글 : footer.<br/>
• 빈번하지는 않은 class.: .alert<br/>
• 지시어에 가장 자주 사용되는 속성 : [color].<br/>
• 특정 값을 갖는 속성 : [color = red].<br/>
• 위의 조합 : footer [color = red]는 값이 빨간색 인 속성 색을 가진 footer 라는 요소와 일치한다. <br/>
[color], footer.alert는 color 속성을 가진 모든 요소 또는 footer라는 요소를 CSS 클래스 alert과 일치 시킨다. <br/>
footer : not (.alert)는 CSS 클래스 경고가 없는 (: not ()) footer라는 요소를 찾는다.<br/>

예를 들어, 이것은 아무것도하지 않고 속성 doNothing이 요소에있을 경우 활성화되는 매우 간단한 지시어 이다.<br/>

```javascript
@Directive({
  selector: '[doNothing]'
})
export class DoNothingDirective {
  constructor() {
   console.log('Do nothing directive');
  }
}
```

그러한 지시자는 이 TestComponent와 같은 컴포넌트에서 활성화 될 것이다.

```javascript
@Component({
  selector: 'ns-test',
  template: '<div doNothing>Click me</div>'
})
export class TestComponent {
}
```

더 복작합 선택자가 될 수 있다. 

```javascript
@Directive({
  selector: 'div.loggable[logText]:not([notLoggable=true])'
})
export class ComplexSelectorDirective {
  constructor() {
   console.log('Complex selector directive');
  }
}
```

여기서는 모든 div 요소를 loggable 클래스와 일치 시키며 logText 속성은 true 값을 가진 notLoggable 속성을 갖지 않는다.

```html
<div class="loggable" logText="text">Hello</div>
```

그러나 이것은 한 가지가 아닐것이다. 

```html
<div class="loggable" logText="text" notLoggable="true">Hello</div>
```

솔직하게 만약 당신이 이런 방식으로 사용하려고 한다면 잘못 사용된 것이다. <br/>

자손, 형제, ids, 와일드 카드 및 의사 (예 : not 이외)와 같은 CSS 선택기는 지원되지 않습니다.
속성 선택자를 bind-, on-, let- 또는 ref-로 시작하면 안된다. : 파서에 따라서 다른 의미를 가진다. 왜냐하면 표준 템플릿 구문의 일부 이기 때문이다.

### Inputs<br/><br/>

데이터 바인딩은 일반적으로 구성 요소 또는 지시문을 만드는 작업의 큰 부분일 것이다. 
상위 구성 요소에서 하위 요소 중 하나에 데이터를 전달할 때마다 속성 바인딩을 사용한다.

이를 위해 @Directive 데코레이터의 inputs 속성을 사용하여 데이터 바인딩을 허용하는 모든 속성을 정의한다. 
이 속성은 각각의 property : binding 양식 문자열 배열을 받아 들인다.
property는 지시어 인스턴스 속성을 나타내고 binding은 표현식을 포함 할 DOM 속성이다.<br/>

예를 들어 이 지시문은 DOM 속성 logText를 지시문 인스턴스 속성 텍스트에 바인딩한다.

```javascript
@Directive({
  selector: '[loggable]',
  inputs: ['text: logText']
})
export class SimpleTextDirective {
}
```

당신의 지시어에 속성이 존재하지 않는 경우는 그것이 생성된다. 다음은 입력이 변경 될 때마다 속성이 자동으로 업데이트 된다.

```html
<div loggable logText="Some text">Hello</div>
```

속성이 변경 될 때 알림을 받으려면 지침에 setter 를 추가 할 수 있다. setter는 logText 속성이 변경 될 때마다 호출된다.

```javascript
@Directive({
  selector: '[loggable]',
  inputs: ['text: logText']
})
export class SimpleTextWithSetterDirective {
  set text(value) {
   console.log(value);
  }
}
```

만약 당신이 사용하려고 한다면

```html
<div loggable logText="Some text">Hello</div>
// our directive will log "Some text"
```

또 다른 방법을 볼 수 있다.<br/>
여기서 텍스트는 정적이지만 물론 보간법을 사용하여 쉽게 동적인 값으로 사용할 수 있다. 

```html
<div loggable logText="{{expression}}">Hello</div>
// our directive will log the value of 'expression' in the component
```

또는 대괄호 구문으로 사용할 수 있다. 

```html
<div loggable [logText]="expression">Hello</div>
// our directive will log the value of 'expression' in the component
```

이것은 새로운 템플릿 구문의 가장 큰 특징 중 하나이다. 
구성 요소 개발자는 구성 요소의 사용 방법에 신경 쓰지 않고 바인딩 할 속성을 정의한다. (일부 AngularJS 1.x를 작성한 경우 약간 씩 '@'및 '='구문이 다를 수 있다.)<br/>

바인딩에 파이프를 사용할 수 도 있다. 

```html
<div loggable [logText]="expression | uppercase">Hello</div>
// our directive will log the value of 'expression' in the component in uppercase
```

DOM 속성을 동일한 이름을 가진 지시어의 속성에 바인딩 하려면 property : binding 대신 속성을 쓸 수 있다.

```javascript
@Directive({
  selector: '[loggable]',
  inputs: ['logText']
})
export class SameNameInputDirective {
  set logText(value) {
   console.log(value);
  }
}
```

```html
<div loggable logText="Hello">Hello</div>
// our directive will log "Hello"
```

지시어에 @Input 데코레이터를 사용하여 입력을 선언하는 또 다른 방법이 있다. 나는 이것을 가장 선호 한다.  
그래서 많은 예제들이 지금부터 그것을 사용할 것이지만, 당신이 선호하는 것을 자유롭게 사용할 수 있다.

```javascript
@Directive({
  selector: '[loggable]'
})
export class InputDecoratorDirective {
  @Input('logText') text: string;
}
```

또는 같은 의미의 다른 방법이 있다. 

```javascript
@Directive({
  selector: '[loggable]'
})
export class SameNameInputDecoratorDirective {
  @Input() logText: string;
}
```

이 작업은 가능하지만 같은 이름의 필드와 설정자를 사용하면 TypeScript 컴파일러가 오류로 판단 할 수 있다. 
setter가 필요한 경우 수정하는 한 가지 방법은 항상 필요하지는 않지만 @Input 데코레이터를 setter에 직접 추가하는 방법이 있다. 

```javascript
@Directive({
  selector: '[loggable]'
})
export class InputDecoratorOnSetterDirective {
  @Input('logText')
  set text(value) {
   console.log(value);
  }
}
```

또는 setter 그리고 바인딩 이름을 같이 하는 방법도 있다. 

```javascript
@Directive({
  selector: '[loggable]'
})
export class SameNameInputDecoratorOnSetterDirective {
  @Input()
  set logText(value) {
   console.log(value);
  }
}
```

입력은 상단 요소에서 하단 요소로 데이터를 전달하는 데 효과적이다.
예를 들어, 조랑말 목록을 표시하는 구성 요소를 원할 경우 목록이 포함 된 상위 구성 요소와 조랑말을 표시하는 다른 구성 요소가 있을 가능성이 높습니다.

```javascript
@Component({
  selector: 'ns-pony',
  template: `<div>{{pony.name}}</div>`
})
export class PonyComponent {
  @Input() pony: Pony;
}
@Component({
  selector: 'ns-ponies',
  template: `<div>
   <h2>Ponies</h2>
   // the pony is handed to PonyComponent via [pony]="currentPony"
   <ns-pony *ngFor="let currentPony of ponies" [pony]="currentPony"></ns-pony>
  </div>`
})
export class PoniesComponent {
  ponies: Array<Pony> = [
   { id: 1, name: 'Rainbow Dash' },
   { id: 2, name: 'Pinkie Pie' }
  ];
}
```

### Outputs<br/><br/>

최근 예제로 돌아가서 조랑말을 클릭하여 선택하고 상위 구성 요소에 알리고 싶다고 합시다. 이를 위해 맞춤 이벤트를 사용할 수 있다.<br/>
이것은 중요하다. Angular 2에서는 데이터가 속성을 통해 구성 요소로 유입되고 이벤트를 통해 구성 요소 밖으로 이동할 수 있다.<br/>

커스텀 이벤트는 EventEmitter를 사용하여 방출 되며, outputs 속성을 사용하여 데코레이터에서 선언 되어야 한다. <br/>
inputs 속성과 마찬가지로, 지시어 / 구성 요소에서 내 보내려는 이벤트 목록이 있는 배열을 허용한다.<br/>

ponySelected라는 이벤트를 내보내려고 한다고 가정 해 봅시다. 우리는 할 일이 세 가지 있다. <br/>
• 데코레이터에서 출력을 선언한다. <br/>
• EventEmitter 만들기 <br/>
• 조랑말을 선택하면 이벤트를 방출한다. <br/>

```javascript
@Component({
  selector: 'ns-pony',
  inputs: ['pony'],
  // we declare the custom event as an output
  outputs: ['ponySelected'],
  // the method `selectPony()` will be called on click
  template: `<div (click)="selectPony()">{{pony.name}}</div>`
})
export class SelectablePonyComponent {
  pony: Pony;
  // the EventEmitter is used to emit the event
  ponySelected = new EventEmitter<Pony>();
  /**
  * Selects a pony when the component is clicked.
  * Emits a custom event.
  */
  selectPony() {
   this.ponySelected.emit(this.pony);
  }
}
```

템플릿에서 사용하려면 : 


```html
<ns-pony [pony]="pony" (ponySelected)="betOnPony($event)"></ns-pony>
```

위의 예에서는 사용자가 조랑말 이름을 클릭 할 때마다 포니 값 (emit () 메소드의 매개 변수)로 이벤트 ponySelected를 호출 할 것이다.<br/> 
부모 요소는 템플릿에서 확인할 수 있도록 이 이벤트를 수신하고 있다. 이벤트 $ event 값을 사용하여 betOnPony 메소드를 호출한다. <br/>
$ event는 당신이 방출 한 이벤트에 액세스하기 위해 사용한다 : 여기에서 방출되는 값은 조랑말이다. <br/><br/>

그런 다음 부모 구성 요소에는 betOnPony () 메서드가 있어야 하며, 선택한 조랑말과 함께 호출 된다.

```javascript
betOnPony(pony) {
  // do something with the pony
}
```

원하는 경우에는 emitter: event 와 같이 emiiter와 다른 이벤트 이름을 지정할 수 있다. 

```javascript
@Component({
  selector: 'ns-pony',
  inputs: ['pony'],
  // the emitter is called `emitter`
  // and the event `ponySelected`
  outputs: ['emitter: ponySelected'],
  template: `<div (click)="selectPony()">{{pony.name}}</div>`
})
export class OtherSelectablePonyComponent {
  pony: Pony;
  emitter = new EventEmitter<Pony>();
  selectPony() {
   this.emitter.emit(this.pony);
  }
}
```

입력은 데코레이터를 사용하여 이벤트를 선언하는 것이 가능하지만 당신이 원하는 것을 선택해서 선언하면 된다. 

```javascript
@Component({
  selector: 'ns-pony',
  template: `<div (click)="selectPony()">{{pony.name}}</div>`
})
export class SelectablePonyWithDecoratorComponent {
  @Input() pony: Pony;
  @Output() ponySelected = new EventEmitter<Pony>();
  selectPony() {
   this.ponySelected.emit(this.pony);
  }
}
```

### Lifecycle<br/><br/>

당신의 지시자가 그 삶의 특정 순간에 반응하는 것을 바랄지도 모른다. 고급 옵션으로 매번 사용하지 않기 때문에 나는 빨리 넘길 것이다.
그러나 구성 요소의 입력이 생성자에서 아직 평가하지 않은 경우 상당한 시간을 절약 할 수 있다.<br/>

즉, 다음 구성 요소가 작동하지 않는다.<br/>

```javascript
@Directive({
  selector: '[undefinedInputs]'
})
export class UndefinedInputsDirective {
  @Input() pony: string;
  constructor() {
   console.log(`inputs are ${this.pony}`);
   // will log "inputs are undefined", always
  }
}
```

예를 들어 입력 값에 액세스하여 서버에서 추가적인 데이터를 로드하려면 라이프 사이클 단계를 사용해야 한다. 
여러 단계를 사용할 수 있으며 자체적인 특수성이 있다.<br/><br/>

• 바인딩 된 속성 값이 변경되면 ngOnChanges가 먼저 호출될 것이다. SimpleChange에서 바인딩된 현재 값과 이전 값이 포함 된 수정 맵을 확인한다. 확인 후에 변경이 없으면 호출되지 않는다.<br/>
• ngOnInit 첫 번째 변경 후 한 번만 호출 된다. (ngOnChanges는 모든 변경을 호출한다). 이 단계는 이름에서 알 수 있듯이 초기화 작업에 최적이다.<br/>
• ngOnDestroy 구성 요소가 제거 될 때 호출 된다. 정리하는 시점에 매우 유용하게 사용된다.<br/>

다른 단계도 사용할 수 있지만 고급 옵션이다. <br/><br/>

• ngDoCheck는 약간 다르다. 존재하는 경우, 각 변경 검색 주기에 불려 기본 변경 감지 알고리즘을 재정의한다. 즉, 바인딩 된 속성 간의 차이를 찾는다.<br/>
값. 즉, 적어도 하나의 입력이 변경된 경우 기본적으로 프레임 워크 구성 요소가 변경된 것으로 간주되고, 그 아이는 확인 된 렌더링이 된다. <br/>
하지만 입력이 변경 되어도 효과가 없다는 것을 알고있는 경우는 그것을 해제 할 수 있다. <br/>
이것은 기본 알고리즘을 사용하지 않고 최소 값을 확인하는 것만으로 변경 감지 속도하려는 경우 유용하지만, 일반적으로 이것을 사용하지 않는다.<br/>
• ngAfterContentInit 구성 요소의 모든 바인딩이 처음 확인 된 경우에 호출된다.<br/>
• ngAfterContentChecked 구성 요소의 모든 바인딩이 확인 된 때 호출된다. 그들은 변하지 않는다.<br/>
• ngAfterViewInit 자식 지시문의 바인딩이 먼저 확인 된 경우에 호출된다.<br/>
• ngAfterViewChecked 자식 지시문의 바인딩이 체크 되어있을 때 불려 비록 변화하지 않고. 구성 요소가 하위 구성 요소에서 무언가를 기다리는 경우에 유용하다. 
ngAfterViewInit 와 마찬가지로 구성 요소에 포함되어 있으면 의미가 있다. <br/>

이전 샘플은 ngOnInit을 사용하여 더 잘 동작한다. Angular 2는 ngOnInit () 메서드가 있으면 해당 메서드를 호출하므로 지시문에 이 메서드를 구현하면 된다. 
모바일용 TypeScript를 사용하는 경우 사용 가능한 인터페이스 OnInit을 활용하여 메서드를 구현해야 한다.

```javascript
@Directive({
  selector: '[initDirective]'
})
export class OnInitDirective implements OnInit {
  @Input() pony: string;
  ngOnInit() {
   console.log(`inputs are ${this.pony}`);
   // inputs are not undefined \o/
  }
}
```

이제 우리의 input 태그에 접근할 수 있다. 
속성이 변경 될 때마다 무언가를 하고 싶다면 ngOnChanges를 사용하여라.

```javascript
@Directive({
  selector: '[changeDirective]'
})
export class OnChangesDirective implements OnChanges {
  @Input() pony: string;
  ngOnChanges(changes: SimpleChanges) {
   const ponyValue = changes['pony'];
   console.log(`changed from ${ponyValue.previousValue} to ${ponyValue.currentValue}`);
   console.log(`is it the first change? ${ponyValue.isFirstChange()}`);
  }
}
```

변경 매개 변수는 바인딩 이름을 키로 사용하는 맵이며 두 속성 (이전 값과 현재 값)을 값으로 갖는 SimpleChange 객체는 물론 isFirstChange () 메서드가 있는지 여부를 알기위한 첫 번째 변경 사항이다.<br/>
바인딩 중 하나의 변경에만 반응하려면 setter를 사용할 수도 있다. 다음 예제는 이전 출력과 동일한 출력을 생성한다.

```javascript
@Directive({
  selector: '[setterDirective]',
  inputs: ['pony']
})
export class SetterDirective {
  private ponyModel: string;
  set pony(newPony) {
   console.log(`changed from ${this.ponyModel} to ${newPony}`);
   this.ponyModel = newPony;
  }
}
```

ngOnChanges는 동시에 여러 바인딩을 볼 때 유용하다. 하나 이상의 바인딩이 변경되고 변경된 속성만 포함하는 경우에 호출된다.<br/><br/>

ngOnDestroy 단계는 백그라운드 작업을 취소하는 것과 같이 구성 요소를 정리하는 데 적합하다.
여기에서 OnDestroyDirective는 생성 될 때마다 "hello"를 기록한다.
구성 요소가 페이지에서 제거되면 메모리 누출을 피하기 위해 setInterval을 중지하려고 한다.<br/>

```javascript
@Directive({
  selector: '[destroyDirective]'
})
export class OnDestroyDirective implements OnDestroy {
  sayHello: number;
  constructor() {
   this.sayHello = window.setInterval(() => console.log('hello'), 1000);
  }
  ngOnDestroy() {
   window.clearInterval(this.sayHello);
  }
}
```

### Providers<br/><br/>

Dependency Injection 장의 공급자에 관해 이미 이야기 한적이 있다. 이 속성은 현재 지시어와 그 자식에 주사 할 수있는 서비스를 선언 할 수있게 한다.

```javascript
@Directive({
  selector: '[providersDirective]',
  providers: [PoniesService]
})
export class ProvidersDirective {
  constructor(poniesService: PoniesService) {
   const ponies = poniesService.list();
   console.log(`ponies are: ${ponies}`);
  }
}
```

**************************************************************************************************

## Components

Component는 지시문과 실제로 다르지 않다. 단지 두 개의 선택적 속성이 있으며 관련 뷰가 있어야 한다. 지시어와 비교하여 많은 새로운 속성을 가져 오지는 않는다.


- View providers<br/><br/>

우리는 공급자를 사용하여 특정한 주입을 할 수 있는 것을 확인하였다. viewProviders는 매우 유사하나 provider들은 현재 컴포넌트에 허용되지 자식 컴포넌트에는 유용하지 않는다. 

- Template / Template URL<br/><br/>

우리는 공급자를 사용하여 특정한 주입을 할 수 있는 것을 확인하였다. viewProviders는 매우 유사하나 provider들은 현재 컴포넌트에 허용되지 자식 컴포넌트에는 유용하지 않는다. 
@Component의 주요 기능은 템플릿을 갖는 반면 지시문에는 템플릿이 없는 것이 차이 이다. 
템플릿을 인라인으로 선언하거나 templateURL을 사용하여 URL을 사용하여 별도의 파일에 넣을 수 있다. (단, 동시에 둘 다 할 수는 없다)<br/><br/>

일반적으로 템플릿이 작으면 (1-2 줄) 인라인으로 유지하는 것이 더 낫다. 코드가 늘어나기 시작하면 구성 요소가 복잡해지지 않도록 파일을 자체 파일로 이동하여라.<br/>
URL, 상대 URL 또는 전체 HTTP URL에 대해 절대 경로를 사용할 수 있다.
구성 요소가 로드 되면 Angular 2가 URL을 확인하고 템플릿을 가져 오려고 시도한다. 성공할 경우 템플릿은 구성 요소의 섀도우 루트이며 해당 표현식이 평가 된다.
큰 구성 요소가 있는 경우 일반적으로 템플릿을 같은 폴더의 별도 파일에 저장하고 상대 URL을 사용하여 로드한다.

```javascript
@Component({
  selector: 'ns-templated-pony',
  templateUrl: 'components/pony/templated-pony.html'
})
export class TemplatedPonyComponent {
  @Input() pony: any;
}
```

상대 URL을 사용하는 경우 URL은 앱의 기본 URL을 사용하여 해결된다. 
구성 요소가 디렉토리 구성 요소 / 포니에 있으면 템플릿 URL은 components / pony / pony.html이 되므로 URL이 번거로울 수 있다.<br/>
그러나 moduleId 등록 정보를 사용하여 CommonJS 모듈을 사용하여 응용 프로그램을 패키지하면 약간 더 잘 수행 할 수 있다. 이 값은 CommonJS가 런타임에 설정하는 값인 module.id 이다. 
Angular 2는이 값을 사용하여 정확한 상대 URL을 만들 수 있다. 템플릿 URL은 이제 다음과 같이 보일 것 이다.

```javascript
@Component({
  selector: 'ns-templated-pony',
  templateUrl: 'templated-pony.html',
  moduleId: module.id
})
export class ModuleIdPonyComponent {
  @Input() pony: any;
}
```

그리고 구성 요소와 동일한 디렉토리에서 템플릿을 찾을 수 있습니다! <br/>
더 나은 점은 : Web-Pack을 사용하고 있다면, 약간의 설정 (이미 Angular-Cli를 사용하고 있다면 가능합니다.)으로 module.id를 제거하고 직접 상대 경로를 사용할 수도 있다. 
Webpack은 완전한 URL을 알아낼 수 있다.<br/><br/>

- Styles / Styles URL<br/><br/>

구성 요소의 스타일을 지정할 수도 있다. 실제로 분리 된 구성 요소를 계획하는 경우 특히 유용하다. styles 또는 styleUrl을 사용하여 이를 지정할 수 있다.<br/>

아래에서 볼 수 있듯이 styles 속성은 CSS 규칙의 배열을 문자열로 취한다. 
꽤 빨리 자랄 수 있다고 상상할 수 있으므로 별도의 파일과 styleUrl을 사용하는 것이 좋다. 후자의 이름에서 알 수 있듯이 URL 배열을 지정할 수 있다.<br/>

```javascript
@Component({
  selector: 'ns-styled-pony',
  template: '<div class="pony">{{pony.name}}</div>',
  styles: ['.pony{ color: red; }']
})
export class StyledPonyComponent {
  @Input() pony: any;
}
```

- Declarations<br/><br/>

@NgModule의 선언에서 사용하고 있는 모든 지시문과 구성 요소를 선언해야 한다는 것을 기억해라. 
그렇게 하지 않으면 템플릿에서 구성 요소가 선택 되지 않으며 이유를 파악하는 데 많은 시간을 낭비 한다.<br/>

두 가지 가장 일반적인 실수는 지시문을 선언하는 것을 잊어 버리고 잘못된 선택자를 사용하는 것이다. 왜 아무 일도 일어나지 않는다면, 이것들을 주의하도록 해라!!<br/>
우리는 쿼리, 변경 감지, 내보내기, 캡슐화 옵션 등과 같은 몇 가지 사항을 남겨 두었다. 
고급 옵션이므로 즉시 필요하지 않지만 우리는 곧 고급 장에서 그들을 확인 할 수 있다!<br/>


**************************************************************************************************


## Reference URL
- [BEM introduction](http://getbem.com/introduction/)
- [BEMIT(BEM을 기반으로 확장변형 시킨 네이밍 컨벤션)](http://csswizardry.com/2015/08/bemit-taking-the-bem-naming-convention-a-step-further/)
- [SMACSS](https://smacss.com/)