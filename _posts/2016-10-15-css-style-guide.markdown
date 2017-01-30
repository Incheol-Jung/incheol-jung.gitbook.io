---
layout:     reference
title:      CSS style guide
date:       2016-10-16 00:00:00
updated:    2016-10-17 00:00:00
categories: reference
summary:    부정확한 클래스 네이밍 작업, 통일되지 않은 스타일 선언을 방지하여 효율적인 코드 관리와 재사용성을 높이기 위한 레퍼런스 입니다.
---




## intro
부정확한 클래스 네이밍 작업, 통일되지 않은 스타일 선언을 방지하여 효율적인 코드 관리와 재사용성을 높이기 위한 레퍼런스 입니다.



**************************************************************************************************



## Basic conventions

아주 특별한 경우를 제외하고 절대 inline style 작성을 하지 않습니다.<br>
display `none, block` 의 경우에도 `.is-visible`, `.is-active` 와 같이 클래스로 제어합니다.



### Indentation & Code block

- 4 Space 사이즈의 1 Tab 들여쓰기를 합니다.
- 세트를 여는 `{` 괄호 앞에 1 Space를 삽입합니다.
- 속성명 `:` 콜론 이후에만 1 Space를 삽입합니다.
- 1개 이하의 규칙만 있는 세트는 줄바꿈 하지않고 규칙 전, 후로 1 Space를 삽입합니다.
- 2개 이상의 규칙이 있는 세트는 한줄에 하나씩 선언하며, 1레벨 들여쓰기를 합니다.
- 모든 선언은 `;` 세미콜론을 작성하여 닫습니다.

```scss
/* Basic Examples */
.title { display: inline-block; }
.name {
	height: 500px;
	width: 200px;
}
```

- 여러개의 셀렉터에 하나의 세트로 규칙을 지정할 경우 셀렉터 들은 한줄에 하나씩 기술합니다.
- 규칙 세트를 여는 괄호 `{` 는 마지막 셀렉터가 작성된 행에 작성합니다.
- 세트를 닫는 괄호 `}` 는 규칙 셀렉터의 첫 글자와 같은 위치에 작성합니다.

```scss
.subject,
.info,
.info .date,
.info .hit {
	height: 500px;
	width: 200px;
}
```
<p>
	Pre-Processors를 사용하여 css로 컴파일 합니다.<br>
	그러므로 작업시에는 속성명들을 개행하여, 작업자가 읽고 이해하기 쉽게 작성합니다.
</p>

- 예외의 경우도 있습니다, 아래와 같이 콤마로 구분하여 설정값이 들어가있는 규칙의 경우 diff를 좀더 유용하게 하기위해 여러줄을 사용해도 좋습니다.

```scss
.selector {
	box-shadow:
		1px 1px 1px #000,
		2px 2px 1px 1px #ccc inset;
    background-image:
		linear-gradient(#fff, #ccc),
		linear-gradient(#f3c, #4ec);
}
```



### Selector
- ul, li, table 등과 같이 태그네임을 셀렉터로 사용하는 것을 지양합니다.
	- table 내부의 tr, td의 경우 상황에 따라 적절히 혼합하는 것을 허용합니다.
- css 내의 ID 셀렉터 사용은 레이아웃 엘리먼트 `g_wrap`, `g_header`등 global한 layout 엘리먼트에만 사용합니다.
- 스타일을 적용하기 위해 ID를 사용하거나, 특정기능을 위해 선언된 ID 값을 스타일에 선언하는 것은 금지됩니다.
- 스타일 재사용과 중첩을 방지하기 위해 내부엘리먼트에 모두 네이밍을 권장합니다.

```scss
/* Bad Examples */


#item {	... }
input { ... }
ul li { ... }
.list li { ... }
[type='text'] { ... }

/* Good Examples */
.list { ... } //ul
.list__item { ... } //li
.common_input[type='text'] { ... }
.common_input[type='checkbox'] { ... }

```



### String
- 속성 셀렉터의 속성 값, URL, 문자열은 `'` 작은따옴표를 사용하여 작성합니다.

```scss
.inputfield[type='text'] { background: url( 'http://www.github.com/logo.png' ); }
.wrap:after {
	content: '';
	display: block;
	clear: both;
}
```



### css 중첩
- 미디어 쿼리와 같이 규칙 세트 내부에 다시 선언되는 구조에서는 1레벨 씩 추가하여 들여쓰기 합니다.

```scss
@media screen and (min-width: 750px) {
	html, body { font-size: 19px; }
	.measure {
		margin: 5rem;
		padding: 0 3rem;
	}
}
```



### Indentation Depth
- 셀렉터 사용시 Depth는 3 Depth 까지 사용하는 것을 허용하며 1 Depth를 권장합니다.
- 참고자료 [SMACSS](https://smacss.com/book/applicability)

```scss
/* Bad Examples */
ul li span { ... }
.list li span strong { ... }
.list .item .subject .title { ... }

/* Good Examples */
.list { ... }
.list__item { ... }
.list--modify .list__item { ... }

/* 모듈 내부에 다른 모듈이 절대 들어가지 않는 형태의 엘리먼트 */
.comm_checkbox { ... } 
.comm_checkbox .icon { ... }
```



### order properties

- css를 보다 이해하기 쉽도록 브라우저가 랜더링 하는 순서와 가깝도록 작성합니다.
- 아래 예제의 주석과 한줄의 공백은 포함하지 않습니다.

```scss
.wrap {	
	/* Positioning */
	position: absolute;
	top: 0;
	right: 0;
	bottom: 0;
	left: 0;
	z-index: 100;

	/* Box-model */
	display: block;
	float: right;
	width: 100px;
	height: 100px;

	/* Border */
	border: 1px solid #e5e5e5;
	border-radius: 3px;

	/* Background */
	background-color: #f5f5f5;

	/* Typography */
	font: normal 13px "Helvetica Neue", sans-serif;
	line-height: 1.5;
	color: #333;
	text-align: center;

	/* etc */
	opacity: 1;
}
```



### z-index

- 일반적인 레이아웃 내부의 엘리먼트들에 z-index는 1000 이하로 제한합니다.
- 레이아웃 이외의 공간에 출력되는 modal의 경우는 1000 이상으로 설정합니다.

```html
<html>
	<head>
	</head>
	<body>
		<div id="g_wrap">
			<header id="g_header"></header><!-- z-index:50 -->
			<div id="g_container">
				...
			</div>
			<div id="g_footer"></div>
		</div>
		<div class="g_popup"><!-- z-index:1001 -->
			..popup...
		</div>
	</body>
</html>

```



**************************************************************************************************



## font-size

폰트 사이즈를 기준으로 한 단위에 대해서 설명합니다.



### px, em, rem 단위

px, em, rem 단위는 정확한 의미와 적용에 따른 효과를 확인하여 작성합니다.<br>

- **px**
	- 기본적인 도트 단위의 값으로 절대값입니다.
- **em**
	- 부모 엘리먼트의 폰트사이즈 === 1em
	- 어떤 규칙을 사용하여 em을 적용하느냐에 따라 em값의 계산은 변경됩니다.( padding, margin )
- **rem**
	- root em, 최상위 부모에게 선언된 폰트 사이즈를 기준으로 한 단위 입니다.
	- html, body 에 선언된 폰트 사이즈가 16px일 경우 1rem === 16 픽셀입니다.
	- em과 달리 부모 엘리먼트 폰트사이즈의 영향을 받지 않습니다.

```html
<body><!-- font-size: 16px; -->
	<div><!-- font-size: 2em; === font-size: 32px; -->
		<h1> ... </h1><!-- font-size: 1em; === font-size: 32px; -->
		<div><!-- font-size: 1rem; === font-size: 16px; -->
			<p> ... </p><!-- font-size: 1rem; === font-size: 16px; -->
		</div>
	</div>
</body>
```



### em 단위의 사용
- 버튼 내부 좌우 padding 값을 조정할때, em 단위를 사용 할 경우 버튼 내부의 폰트 사이즈에 의해 padding 값이 설정되므로 확장성 있는 스타일링이 가능하지만, 그전에 그에따른 UI에 대한 기획, 디자인이 필요합니다.



### % 단위의 사용
`font-size` 에서 `%` 단위는 em 단위를 사용할 때와 비슷한 효과를가집니다.<br>
`padding`, `margin` 등의 단위에서 `%` 는 자기자신 혹은 부모 엘리먼트의 `width`, `height` 값을 기준으로 설정됩니다.



**************************************************************************************************



## Pre-Processors
*less, scss* 와 같은 Pre-Processors 작성 또한 위 CSS의 ***모든 부분을 포함***합니다.(sass 제외)



### 공식 레퍼런스
- [LESS](http://www.sass-lang.com/documentation/file.SASS_REFERENCE.html)
- [SASS](http://lesscss.org/)



### scss 중첩 작성과 컴파일
- 규칙 세트 내부에 다른 셀렉터가 오는경우 부모 규칙들에서 빈 1행을 추가합니다.

```scss
//less, scss 예제
.comm_check {
	display: inline-block;

	.icon { ... }
	&:after { ... }
}
```

- 위 scss는 아래와 같이 컴파일되어 서비스에 적용됩니다.

```scss
.comm_check { display: inline-block; }
.comm_check .icon { ... }
.comm_check:after { ... }
```



### Mixins & Variables
- Mixin 하기위해 선언된 규칙 세트는 해당 scss, less 문서 최 상단에 기술합니다.
- Mixin 혹은 미리 선언된 변수를 사용할 때는 해당 규칙모음 아래에 기술합니다.

```scss
$logo_font: 'Open Sans', 'Noto Sans KR', Helvetica, Arial, sans-serif;

.float_clear {
	overflow: hidden;

	&:after {
		content: '';
		display: block;
		clear: both;
	}
}

.logo { font-family: $logo_font; }
.float_box {
	width: 100px;
	height: 100px;
	@extend .float_clear;

	.item { float: left; }
}
```

- 위 scss는 아래와 같이 컴파일되어 서비스에 적용됩니다.

```scss
.float_clear { overflow: hidden; }
.float_clear:after { content: ''; display: block; clear: both; }
.logo { font-family: 'Open Sans', 'Noto Sans KR', Helvetica, Arial, sans-serif; }
.float_box { width: 100px; height: 100px; }
.float_box:after { content: ''; display: block; clear: both; }
.float_box .item { float: left; }
```



**************************************************************************************************



## IR 기법 
의미가 포함되어 있는 image를 배경으로 표현하고, 그에 상응하는 내용을 text로 전경에 기입하는 방법으로, 시각이 있는 사용자는 이미지로 처리된 화면을 볼 수 있지만 "화면 낭독기를 사용하는 시각 장애인, CSS제거 및 인쇄"시에는 문자에 접근하거나 문자를 볼 수 있는 형태로 설계 하는 기법을 말한다.<br>
`image sprite` 라고 표현되기도 합니다.



**************************************************************************************************



# Naming conventions
기본적인 클래스의 선언과 예약어들을 정합니다.<br>
전체적인 네이밍은 ___BEM___ 네이밍 컨벤션을 약간 변형한 형태로 사용합니다.



## BEM
BEM 이란?<br>
BEM은 Block, Element, Modifier를 뜻합니다.<br>
BEM의 네이밍 컨벤션은 그 특징 때문에 클래스명의 길이가 길어질 수 있고 하이픈과 언더스코어 등의 기호가 많이 사용되어 못나보이지만 클래스명 만으로도 많은 의미를 파악할 수 있다는 장점이 있고 클래스의 재사용에서 유리할 수 있습니다.<br>
BEM 에서 정해놓은 모든 부분을 그대로 이용하기에 무리가 있다는 판단에 조금더 다가가기 쉽도록 변경한 방법을 이용합니다.<br>
적응단계에서는 조금의 혼란이 있을 수 있지만 어느정도 익숙해진다면 코드의 재사용 부터 해당 클래스의 유지보수 까지 유리한 부분들에 대해 이해하게 될것이라 생각합니다.



### Basic
- 클래스명에 대문자는 사용하지 않습니다.
- 기본적인 표현은 `_` 한개의 언더스코어, `__` 두개의 언더스코어, `-` 한개의 하이픈, `--` 두개의 하이픈이 있습니다.
- "_"
   - 한개의 언더스코어는 문자 사이의 의미없는 공백만 나타냅니다.
- "__"
	- 두개의 언더스코어는 `.parent_class__child_class` 와 같이 자식클래스에서 부모 클래스를 표현할 때 작성합니다.
- "--"
	- 두개의 하이픈는 `.note--important` 와같이 사용되며 `.note` 클래스를 수정하는 클래스를 만들 때 작성합니다.
- "-"
	- 한개의 하이픈은 해당 요소의 상태를 나타내는 prefix ( `is-active`, `is-fixed` )를 표현하는 용도로만 사용합니다.



### Block, Element 네이밍
- 블록의 클래스명은 `.product_item` , `.product` 와 같이 블럭의 이름이 됩니다.
- 엘리먼트의 클래스명은 `.product_item__image` , `.product__image` 와 같이 블럭의 클래스명을 포함하며 언더스코어 두개로 분리하여 이름을 정합니다.
- `.product_item__subject` 와 같이 클래스 명에서 부모요소를 표현하고 있기 때문에 css를 중첩하여 기술하지 않습니다.

style sheet

```scss
.product_item { ... }
.product_item__image { ... }
.product_item__subject { ... }
.product { ... }
.product__image { ... }
```

html

```scss
<a href="#" class="product_item">
	<span class="product_item__image"> ... </span>
	<span class="product_item__subject"> ... </span>
</a>
<div class="product">
	<div class="product__image"> ... </div>
</div>
```



### Modify 네이밍
- 먼저 선언된 클래스를 재사용 하기위해 수정하는 Midifier 클래스입니다.
- 부모 셀렉터에서 수정클래스를 사용하여 자식 클래스를 수정할때도 3 Depth 이상의 중첩은 허용하지 않습니다.

style sheet

```scss
/* product item */
.product_item { ... }
.product_item__image { ... }
.product_item__image--big { ... }

/* product */
.product { ... }
.product__image { ... }
/* product modify mini */
.product--mini { ... }
.product--mini .product__image { ... }
```

html

```scss
<a href="#" class="product_item">
	<span class="product_item__image product_item__image--big"> ... </span>
</a>
<div class="product product--mini">
	<div class="product__image"> ... </div>
</div>
```



**************************************************************************************************




## prefix
- 상태를 표현하기 위한 클래스는 클래스 앞에 `is-` 와 같은 prefix 적용하여 이해하기 쉽게 작성합니다.
- 상태를 표현하는 클래스는 자바스크립트에서 이용될 수 있습니다.

scss

```scss
.nav_item {
	...

	&.is-active { ... }
	&.is-hidden { ... }
}
```

html

```html
<h3 class="is-hidden">제목</h3>
<ul>
	<li class="nav_item">메뉴1</li>
	<li class="nav_item is-active">메뉴2</li>
	<li class="nav_item">메뉴3</li>
</ul>
```

- 자바스크립트에서 DOM 엘리먼트를 제어하기 위한 클래스는 `js-` 와 같은 prefix 적용합니다.
- `js-` prefix가 붙은 클래스 자바스크립트에서 사용하기 위한 클래스로 css 에서 사용하지 않습니다.

```html
<ul class="js-hover_item">
	<li class="nav_item js-item">메뉴1</li>
	<li class="nav_item js-item">메뉴2</li>
	<li class="nav_item js-item">메뉴3</li>
</ul>
```



**************************************************************************************************



## 그외...
- hex값은 소문자를 이용할 것. 예: #aaa
- 셀렉터안의 속성치는 늘 따옴표로 감쌀 것. 예: `input[type='checkbox']`
- 0이 되는 값에는 단위지정을 하지 않는다. `margin: 0;`



**************************************************************************************************



## Reference URL
- [BEM introduction](http://getbem.com/introduction/)
- [BEMIT(BEM을 기반으로 확장변형 시킨 네이밍 컨벤션)](http://csswizardry.com/2015/08/bemit-taking-the-bem-naming-convention-a-step-further/)
- [SMACSS](https://smacss.com/)