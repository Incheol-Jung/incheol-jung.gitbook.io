---
layout: post
title:  "Navigation"
date:   2017-01-27 00:00:00
categories: Router
comments: true
---

다른 구성 요소를 어떻게 탐색 할 수 있을까? 글쎄, 수동으로 URL을 입력하고 페이지를 새로 고침 할 수는 있지만 그다지 편리하지는 않는다. 
그리고 우리는 <a href=""> </a> "로"고전적인 "링크를 사용하고 싶지 않다. 
실제로 링크를 클릭하면 브라우저가 해당 URL에서 페이지를 로드하고 전체 Angular 응용 프로그램을 다시 시작한다. 
그러나 Angular의 목표는 이러한 페이지 다시 로드를 피하는 것이다. 
단일 페이지 응용 프로그램을 만들고 싶다. 물론 내장된 솔루션이 있다.<br/>

템플릿에서 이동하려는 경로를 가리키는 지시문 RouterLink가 포함 된 링크를 삽입 할 수 있다.
루트 모듈이 RouterModule을 가져와 RouterModule의 내 보낸 모든 지시문을 루트 모듈에 사용할 수 있으므로 이 지시문을 사용할 수 있다. 
outerLink 지시문은 이동하려는 경로를 나타내는 상수 또는 경로 및 해당 매개 변수를 나타내는 문자열 배열을 받을 수 있다. 
예를 들어 RacesComponent 템플릿에서 HomeComponent로 이동하려면 상상해 보라.

```javascript
<a href="" routerLink="/">Home</a>
<!-- same as -->
<a href="" [routerLink]="['/']">Home</a>
```

런타임에 링크 href는 라우터에 의해 계산되고 /를 가리 킵니다.<br/>
** 경로의 선행 슬래시가 필요하다. 포함되어 있지 않다면, RouterLink는 URL을 현재 경로에 상대적으로 작성한다 (나중에 보게 될 것처럼 중첩 된 구성 요소에 유용 할 수 있다). 
슬래시를 추가하면 응용 프로그램 기본 URL에서 URL을 계산해야 함을 나타낸다.<br/><br/>

RouterLink 지시문은 RouterLinkActive 지시문과 함께 사용할 수 있다. 
지시문은 링크가 현재 경로를 가리키는 경우 CSS 클래스를 자동으로 설정할 수 있다. 
예를 들어, 현재 페이지를 가리킬 때 선택된 메뉴 항목의 스타일을 지정할 수 있다.

```javascript
<a href="" routerLink="/" routerLinkActive="selected-menu">Home</a>
```

라우터 서비스와 해당 메소드 navigate ()를 사용하여 코드에서 탐색 할 수도 있다. 작업 후 사용자를 리디렉션하려는 경우에 편리하게 사용된다.

```javascript
export class RacesComponent {
  constructor(private router: Router) {
  }
  saveAndMoveBackToHome() {
   // ... save logic ...
   this.router.navigate(['']);
  }
}
```

이 메서드는 첫 번째 요소로 탐색 할 경로가있는 매개 변수 배열을 사용한다.
URL에 매개 변수를 포함하는 것도 가능하며 동적 URL을 정의하는 것이 좋다. 
예를 들어 ponyies / the-pony- / the-pony-name-the-pony 같은 이 페이지의 의미있는 URL이 있는 조랑말에 대한 세부 정보 페이지를 표시하려고 한다.<br/>

그렇게 하기 위해 하나 또는 여러 개의 동적 매개 변수로 구성에서 경로를 정의하자

```javascript
export const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'races', component: RacesComponent },
  { path: 'races/:raceId/ponies/:ponyId', component: PonyComponent }
];
```

그런 다음 routerLink를 사용하여 동적 링크를 정의 할 수 있다.

```javascript
<a href="" [routerLink]="['/races', race.id, 'ponies', pony.id]">See pony</a>
```

물론 대상 구성 요소는 주어진 식별자로 포니를 로드하고 표시 할 수 있도록 이러한 매개 변수에 액세스 해야 한다. 
매개 변수 값을 얻기 위해 라우터는 ActivatedRoute라는 구성 요소에 물론 삽입 할 수있는 서비스를 제공한다. 
이 객체는 ngOnInit 내부에서 사용할 수 있으며 매우 유용한 필드 인 스냅 샷이 있다. 
이 필드에는 params에있는 URL의 모든 매개 변수가 있다!

```javascript
export class PonyComponent implements OnInit {
  pony: any;
  constructor(private ponyService: PonyService, private route: ActivatedRoute) {
  }
  ngOnInit() {
   const id = this.route.snapshot.params['ponyId'];
   this.ponyService.get(id).subscribe(pony => this.pony = pony);
  }
}
```

이 고리는 볼 수있는 것 처럼 구성 요소의 초기화 작업을 수행하기에도 좋다.<br/>
당신이 발견했을지도 모르는 것에 따라, 우리는 스냅 사진을 사용하고 있다.
스냅 샷이 아닌 버전이 있는가? 그렇다. 
그리고 그것은 매개 변수 변경을 구독 할 수있는 방법을 제공한다. 이 관찰 가능한 것을 params라고 한다.<br/>

** 이것은 매우 중요하다 : 라우터는 가능한 경우 구성 요소를 재사용 한다! 우리 어플리케이션이 다음 조랑말을 볼 수있는 "다음"버튼을 가지고 있다고 가정 해 보자. 
사용자가 클릭 할 때 URL은 / ponies / 1에서 / ponies / 2로 변경된다. 
그러면 라우터가 구성 요소 인스턴스를 다시 사용한다. 
즉, ngOnInit이 다시 호출되지 않는다! 
이러한 종류의 탐색을 위해 구성 요소를 업데이트하려면 params observable을 사용하는 것 외에는 다른 방법이 없다!

```javascript
export class PonyReusableComponent implements OnInit, OnDestroy {
  pony: any;
  paramsSubscription: Subscription;
  constructor(private ponyService: PonyService, private route: ActivatedRoute) {
  }
  ngOnInit() {
   this.paramsSubscription = this.route.params.subscribe(params => {
   const id = params['ponyId'];
   this.ponyService.get(id).subscribe(pony => this.pony = pony);
   });
  }
  ngOnDestroy() {
   this.paramsSubscription.unsubscribe();
  }
}
```

여기서는 ActivatedRoute에서 제공하는 관찰 가능 항목을 구독하고 필드에 구독을 저장하므로 나중에 ngOnDestroy에서 구독을 취소하여 메모리 누수를 피할 수 있다. 
이제 URL이 '/ ponies / 1'에서 '/ ponies / 2'로 바뀔 때마다 관찰 할 수있는 매개 변수가 이벤트를 발생시키고 화면에 표시 할 올바른 조랑말을 가져온다.
params 업데이트를 구독 한 내부의 PonyService 결과에 가입하는 대신 좀더 우아한 switchMap 연산자를 사용할 수 있다.

```javascript
export class PonySwitchMapComponent implements OnInit, OnDestroy {
  pony: any;
  paramsSubscription: Subscription;
  constructor(private ponyService: PonyService, private route: ActivatedRoute) {
  }
  ngOnInit() {
   this.paramsSubscription = this.route.params
   .map(params => params['ponyId'])
   .switchMap(id => this.ponyService.get(id))
   .subscribe(pony => this.pony = pony);
  }
  ngOnDestroy() {
   this.paramsSubscription.unsubscribe();
  }
}
```