---
layout: post
title:  "Components"
date:   2017-01-22 00:00:00
categories: BuilidingComponentsAndDirectives
comments: true
---

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