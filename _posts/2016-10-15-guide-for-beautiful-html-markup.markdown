---
layout:     reference
title:      Guide for "beautiful HTML markup"
date:       2016-10-15 00:00:00
updated:    2016-10-17 00:00:00
categories: reference
summary:    semantic한 markup을 보다 아름답게 작성 하기 위해 만들어진 가이드 입니다.
---




## intro
읽기 쉬운 코드와 명확한 주석문을 만들고 실수를 할 확률을 줄어들게하며 협업과 버전관리 도구에서 보다 유용한 정보를 전달 하기위한 가이드입니다.<br>
프로젝트 내부에서 코딩 스타일이 통합이 된다면 누구나 쉽게 협업 할 수 있는 환경이 주어질 것이라 생각합니다.<br>
그에 따른 에디터의 설정, 협업도구에서 파일을 수정할 때 사용할 수 있는 가이드입니다.



**************************************************************************************************



## Indentation
- 4 Space 사이즈의 1 Tab 들여쓰기를 합니다.
- 블럭요소는 항상 줄바꿈 후 1 Tab 들여쓰기를 합니다.

```html
<div>
	<ul>
		<li>아이템1</li>
		<li>아이템2</li>
		<li>아이템3</li>
	</ul>
	<div>
		<div>안녕하세요</div>
	</div>
</div>
```	

- inline 요소는 줄바꿈하지 않습니다.

```html
<div>
	<span><strong>text</strong></span><span>text</span>
</div>
```	

- block 내부에 하나의 인라인 요소 혹은 텍스트만 담겨있을 경우 줄바꿈 하지 않습니다.

```html
<h1>title text</h1>
<div><img src="/images/img.png" alt="이미지"></div>
```	



**************************************************************************************************



## Remark

- 레이아웃 요소 혹은 모듈 요소의 시작과 끝에 정해진 스타일의 주석문을 기술합니다.

```html
<!-- 메뉴 -->
<nav>
	<ul>
		<li><a href="#">메뉴1</a></li>
		<li><a href="#">메뉴2</a></li>
	</ul>
</nav>
<!-- /메뉴 -->
```



**************************************************************************************************



## Standard

- 명확성을 위해 생략가능한 태그라도 생략하지 않습니다.

```html
<!-- Bad Examples -->
<ul>
	<li>아이템1
	<li>아이템2
</ul>
<!-- /Bad Examples -->

<!-- Good Examples -->
<ul>
	<li>아이템1</li>
	<li>아이템2</li>
</ul>
<!-- /Good Examples -->	
```

- xhtml을 제외한 모든 문서에 닫는 태그가 따로 존재하지 않는 요소들은 닫는 태그 `/>`를 생략합니다.

```html
<!-- xhtml -->
<input type="text" /><hr /><br />
<!-- /xhtml -->
<!-- html -->
<input type="text"><hr><br>
<!-- /html -->
```

- true/false의 값을 갖는 속성은 `disabled`, `readonly`등, 속성값을 지정하지 않습니다.

```html
<input type="text" disabled>
<input type="text" readonly>
<input type="checkbox" checked>
```

- 요소의 속성 값들은 모두 `"value"`와 같이 큰따옴표를 사용합니다.

```html
<input type="checkbox" class="checkbox_ui" value="111">
<script>
	var html = '<input type="checkbox" class="checkbox_ui" value="111">';
</script>
```

- tfoot은 thead 블럭 다음에 기술합니다.
- 테이블 중 thead, tfoot가 존재하지 않을때는 tbody도 작성하지 않습니다.

```html
<!-- thead가 존재하는 테이블 -->
<table>
	<colgroup>...</colgroup>
	<caption>...</caption>
	<thead>
		<tr>
			<th scope="col">...</th>
			<th scope="col">...</th>
		</tr>
	</thead>
	<tfoot>
		<tr>
			<td>...</td>
			<td>...</td>
		</tr>
	</tfoot>
	<tbody>
		<tr>
			<td>...</td>
			<td>...</td>
		</tr>
	</tbody>
</table>

<!-- thead 및 tfoot이 없는 테이블 -->
<table>
	<colgroup>...</colgroup>
	<caption>...</caption>
	<tr>
		<th scope="row">...</th>
		<td>...</td>
	</tr>
</table>
```
