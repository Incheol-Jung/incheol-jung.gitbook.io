---
layout: post
title:  "Forms, dear forms"
date:   2017-01-27 00:00:00
categories: forms
comments: true
---

폼은 항상 Angular에서 더 가공 되어왔다. 이것은 1.x에서 가장 많이 사용 된 기능 중 하나이며 거의 모든 앱에 형태가 있기 때문에 많은 개발자들의 마음을 사로 잡았다.<br/>

폼은 어려웠다 : 사용자의 입력을 검증하고, 오류를 표시하고, 필드를 필요로하는지 여부를 결정하거나, 다른 필드에 따라 일부 필드 변경 등에 대응해야한다. 
또한 이러한 양식을 테스트 해야 한다. AngularJS 1.x의 단위 테스트로는 불가능 했다. 
엔드 - 투 - 엔드 (end-to-end) 테스트만으로는 실현 가능성이 낮았다.<br/><br/>

Angular 2에서는 양식에 동일한주의가 적용되었으며 프레임 워크는 양식을 작성하는 좋은 방법을 제공한다. 사실 그것은 여러 가지 방법을 제공한다.<br/>

템플릿의 지시문만 사용하여 양식을 작성할 수 있다. 이는 "템플릿 중심" 방식이다.
우리의 경험에 비추어 볼 때, 당신이 단순한 폼을 가지고 있을 때, 많은 검증이 없이 빛난다.<br/>

다른 방법은 구성 요소에 폼에 대한 설명을 작성한 다음 지시문을 사용하여 폼을 템플릿의 inputs / textareas / choose에 바인드하는 "코드 중심"방식이다. 
좀 더 자세한 정보 뿐 아니라 특히 사용자 정의 유효성 검사 추가 또는 동적 양식 생성을 원할 경우 더욱 강력하다.<br/>

동일한 사용 사례를 두 번 반복하고 각 방법을 사용하여 차이점을 살펴 보도록 하자.<br/>

우리는 우리의 멋진 PonyRacer 앱에 새로운 사용자를 등록 할 수 있도록 간단한 양식을 작성하려고 한다.
각 유스 케이스마다 기본 구성 요소가 필요하다. 다음과 같이 시작해 보자.<br/>

```javascript
import { Component } from '@angular/core';
@Component({
  selector: 'ns-register',
  template: `
  <h2>Sign up</h2>
  <form></form>
  `
})
export class RegisterFormComponent {
}
```

멋진 것은 없다 : 폼을 포함하는 간단한 템플릿을 가진 컴포넌트는 다음 몇 분 안에 사용자 이름과 암호를 등록 할 수있는 양식을 작성한다.<br/>

두 가지 방법 모두 Angular는 양식의 표현을 만든다.<br/>

"템플릿 중심" 방식에서는 꽤 자동적이다. 템플릿에 적절한 지시문을 추가 하기만 하면 프레임 워크가 양식 표현 작성을 담당한다.
"코드 중심" 방식에서는 이 폼 표현을 수동으로 작성한 다음 지시문을 사용하여 양식 표현을 입력에 바인드 한다.<br/>

폼 뒤에서 입력 필드 나 선택 필드와 같은 폼 필드는 FormControlin Angular 2로 표현된다. 
이것은 폼의 가장 작은 부분이며 필드의 상태와 그 값을 캡슐화 한다.

FormControl에는, 다음의 몇개의 속성이 있다.<br/>

• valid : 해당 필드가 유효하고 해당 필드에 적용되는 요구 사항 및 유효성 검사.<br/>
• errors : 필드 오류가있는 객체.<br/>
• dirty : 사용자가 값을 수정할 때까지 false.<br/>
• pristine : 수정하기 이전.<br/>
• touched : 사용자가 입력 할 때까지 false.<br/>
• untouched : 입력하기 전까지 상태.<br/>
• value : 필드의 값.<br/>
• valueChanges : 필드에 변화가 있을 때마다 관찰 되는 관찰 가능 함수<br/>

또한 컨트롤에 특정 오류가 있는지 확인하는 hasError()와 같은 몇 가지 메서드를 제공한다.<br/>

```javascript
const password = new FormControl();
console.log(password.dirty); // false until the user enters a value
console.log(password.value); // null until the user enters a value
console.log(password.hasError('required')); // false
```

생성자에 인수를 전달할 수 있으며 이 인수는 값이 된다.

```javascript
const password = new FormControl('Cédric');
console.log(password.value); // logs "Cédric"
```

이러한 컨트롤은 FormGroup에 그룹화하여 양식의 일부를 나타내고 전용 유효성 검사 규칙을 가질 수 있다. 양식 자체가 그룹이다.

FormGroup은 FormControl과 동일한 속성을 갖지만 몇 가지 차이점이 있다.<br/>

• valid : 모든 필드가 유효하면 그룹의 유효성.
• errors : 그룹 오류가있는 객체이거나 그룹이 유효한 경우 null이다. 각 오류는 키이고, value는 이 오류의 영향을 받는 모든 컨트롤이 들어있는 배열이다.
• dirty : 컨트롤 중 하나가 더러워 질 때까지 false.
• pristine : dirty의 반대.
• touched : 컨트롤 중 하나가 터치 될 때까지 false.
• untouched : touched의 반대.
• value : 그룹의 값. 더 정확하게 말하자면, 키 / 값이 컨트롤과 그 값.
• valueChanges : 그룹에 변화가있을 때마다 관찰되는 관찰 가능<br/>

hasError()와 같은 FormControl과 동일한 메소드를 제공한다. 또한 get() 메서드를 사용하여 그룹에서 컨트롤을 검색한다.

다음과 같이 만들 수 있다.

```javascript
const form = new FormGroup({
  username: new FormControl('Cédric'),
  password: new FormControl()
});
console.log(form.dirty); // logs false until the user enters a value
console.log(form.value); // logs Object {username: "Cédric", password: null}
console.log(form.get('username')); // logs the Control
```

