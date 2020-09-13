# 스프링부트 테스트하기

## 테스트

```java
@Requestmapping(method=RequestMethod.POST)
Public String addToReadingList(Book book) {
	book.setReader(reader);
	readingListRepository.save(book);
	return “redirect:/”;
}
```

@RequestMapping 애너테이션을 무시하고 보면 이 메서드는 일반적인 자바 메서드다. ReadingListRepository의 목\(Mock\) 구현체를 제공한 후 addToReadingLisrt\(\) 메서드를 직접 호출하여 반환 값을 검증하고 리포지토리의 save\(\) 메서드 호출을 확인하는 테스트는 만들기가 그리 어렵지 않다.

하지만 이 테스트의 문제는 메서드 자체만 테스트한다는 것이다. 테스트를 아예 안 하는 것보다는 낫지만, /로 들어오는 POST 요청을 처리하는 부분은 테스트할 수 없다. 폼 필드들을 Book 매개변수에 제대로 연결 했는지도 테스트할 수 없다. 게다가 메서드가 반환한 String이 특정 값을 포함하는지 검증할 수는 있어도 메서드 처리를 완료한 후 요청을 /로 리다이렉트 했는지 명확히 테스트할 수는 없다.

웹 애플리케이션을 올바르게 테스트하려면 웹 애플리케이션에 실제 HTTP 요청을 보내고 애플리케이션이 요청을 제대로 처리했는지 검증할 방법이 있어야 한다. 다행히 스프링 부트 애플리케이션 개발자에게는 웹 애플리케이션을 테스트할 수 있는 두 가지 옵션이 있다.

### 스프링 부트 애플리케이션 테스트 옵션

* 스프링 Mock MVC : 애플리케이션 서버를 구동하지 않고도 서블릿 컨테이너와 거의 비슷하게 작동하는 목 구현체로 컨트롤러를 테스트할 수 있다.
* 웹 통합 테스트 : 톰캣, 제티 등 내장 서블릿 컨테이너에서 애플리케이션을 실행하여 실제 애플리케이션 서버에서 애플리케이션을 테스트할 수 있다.

Mock MVC를 설정하려면 MockMvcBuilders를 사용한다. 이 클래스는 정적 메서드 두 개를 제공한다.

* standaloneSetup\(\) : 수동으로 생성하고 구성한 컨트롤러 한 개 이상을 서비스할 Mock MVC를 만든다.
* webAppContextSetup\(\) : 구성된 컨트롤러 한 개 이상을 포함하는 스프링 애플리케이션 컨텍스트를 사용하여 Mock MVC를 만든다.

이 두 옵션의 가장 큰 차이는 standaloneSetup\(\) 메서드는 테스트할 컨트롤러를 수동으로 초기화하고 주입하기를 기대하는 반면, webAppContextSetup\(\) 메서드는 \(스프링이 로드한\) WebApplicationContext의 인스턴스로 작동한다는 점이다.standaloneSetup\(\) 메서드는 한 컨트롤러에 집중하여 테스트하는 용도로만 사용한다는 점에서 유닛 테스트와 유사하다. 반면에 webAppContextSetup\(\) 메서드는 스프링이 컨트롤하는 물론 의존성까지 로드하여 완전한 통합 테스트를 할 수 있게 한다.

```java
@RunWith(SpringJUnit4ClassRunner.class)
@SpringApplicationConfiguration(classes=ReadingListApplication.class)
@WebAppConfiguration
Public class MockvcWebTests {
	@Autowired
	private WebApplicationContext webContext;		// WebApplicationConext 주입
	
	private MockMvc mockMvc;
	
	@Before
	public void setupMockMvc() {
		mockMvc = MockMvcBuilders
							.webAppContextSetup(webContext)
							.build();
	}
}
```

{% hint style="info" %}
@WebAppConfiguration 애너테이션은 SpringJUnit4ClassRunner가 애플리케이션 컨텍스트로 \(기본값인 비웹용 ApplicationContext가 아니라\) WebApplicationContext를 생성하도록 선언하다. setupMockMvc\(\) 메서드는 Junit의 @Before 애너테이션을 붙여 다른 테스트 메서드보다 먼저 실행해야 함을 나타낸다. 이 메서드는 주입된 WebApplicationContext를 webAppContetSetup\(\)메서드에 전달한 후 build\(\) 메서드를 호출하여 MockMvc 인스턴스를 생성하고, 테스트 메서드에서 사용할 인스턴스 변수에 할당한다.
{% endhint %}

```java
@Test
Public void postBook() throws Exception {
	mockMvc.perform(post(“/”)		// POST 요청 수행
		.contentType(MediaType.APPLICATION_FORM_URLENCODED)
		.param(“title”, “BOOK TITLE”)
		.param(“author”,”BOOK AUTHOR”)
		.param(“isbn”,123456789)
		.param(“description”,”DESCRIPTION”)
		.andExpect(status().is3xxRedirection())
		.andExpect(header().string(“Location”, “/”));

	Book expectedBook = new Book();
	expectedBook.setId(1L);
	expectedBook.setReader(“craig”);
	expectedBook.setTitle(“BOOK TITLE”);
	expectedBook.setAuthor(“BOOK AUTHOR”);
	expectedBook.setIsbn(“123456789”);
	expectedBook.setDescription(“DESCRIPTION”);

	mockMvc.perform(get(“/”))
		.andExpect(status().isOK())
		.andExpect(view().name(“readingList”))
		.andExpect(model().attributeExists(“books”))
		.andExpect(model().attribute(“books”, hasSize(1)))
		.andExpect(model().attribute(“books”, contains(samePropertyValuesAs(expectedBook))));

}
```

{% hint style="info" %}
책 정보를 등록할 때는 웹 브라우저가 애플리케이션에 전송할 때 사용하는 application/x-www-form-urlencoded\(MediaType.APPLICATION\_FORM\_URLENCODED\)로 콘텐트 타입을 설정해야 한다. 다음으로 MockMvcRequestBuilders의 param\(\) 메서드로 전송할 폼을 시뮬레이션하는 필드들을 설정한다. 요청을 실행하면 응답이 /로 리다이렉트되는지 검증한다. 첫 번째 테스트 메서드가 성공했다면 두 번째 부분으로 넘어간다. 먼저 응답으로 기대하는 값을 담은 Book 객체를 생성하다. 이 객체는 메인 페이지를 요청한 후 반환되는 모델 값과 비교하는 데 사용한다. 이제 /에 GET 요청을 수행한다.모델에는 빈 컬렉션 대신 객체 하나를 담은 컬렉션이 있고, 그 객체가 방금 생성한 Book 객체와 동일한지 확인한다. 두 객체가 같으면 컨트롤러는 POST 요청으로 책을 저장하는 작업을 수행한다고 볼 수 있다. 지금까지는 보안이 없는 애플리케이션을 테스트한다고 가정하고 진행했다. 이제부터는 보안을 적용한 애플리케이션을 테스트하고 싶다면 어떻게 해야 할까?
{% endhint %}

## 웹 보안 테스트

테스트하기 이전에 dependency를 추가해야 한다. \( Spring-security-test \)

springSecurity\(\) 메서드는 Mock MVC용으로 스프링 시큐리티를 활성화하는 Mock MVC 구성자를 반환한다.

### 그렇다면 어떻게 인증된 요청을 수행할 수 있을까?

* @WithMockUser : 지정한 사용자 이름, 패스워드, 권한으로 UserDetails를 생성한 후 보안 컨텍스트를 로드한다.
* @WithUserDetails : 지정한 사용자 이름으로 UserDetails 객체를 조회하여 보안 컨텍스트를 로드한다.

```java
@Test
@WithMockUser(username=“craig”, password=“password”, roles=“READER”)
Public void homepage_authenticatedUser() throws Exception {

}
```

{% hint style="info" %}
@WithMockUser 애너테이션은 일반적인 UserDetails 객체 조회를 건너뛰고 대신 지정된 값으로 UserDetails를 생성한다. 하지만 여기서 수행할 테스트에는 @WithMockUser가 생성하는 일반적인 UserDetails가 아니라 UserDetails를 구현한 Reader가 필요하다.
{% endhint %}

```java
@Test
@WithUserDetails(“craig”)
Public void homepage_authenticatedUser() throws Exception {
	Reader expectedReader = new Reader();
	expectedReader.setUsername(“craig”);
	expectedReader.setPassword(“password”);
	expectedReader.setFullname(“Craig Walls”);

	mockMvc.perform(get(“/”))
		.andExpect(status().isOK())
		.andExpect(view().name(“readingList”))
		.andExpect(model().attribute(“reader”, samePropertyValuesAs(expectedReader)))
		.andExpect(model().attribute(“books”, hasSize(0)))
		.andExpect(model().attribute(“amazonID”, “habuma-20”));
}
```

{% hint style="info" %}
@Withuserdetails 애너테이션을 사용하여 테스트 메서드가 작동하는 동안 시큐리티 컨텍스트에 craig 사용자를 로드하도록 했다. 모델에 Reader가 포함된다는 사실을 알고 있으므로 테스트에서 추후 모델과 비교할 Reader 객체를 생성했다. 이제 SecurityConfig의 두 번째 configure\(\) 메서드를 조금 수정해야 한다.
{% endhint %}

```java
@Override
Protected void configure(AuthenticationManagerBuilder auth) throws Exception {
	auth.userDetailsService(userDetailsService());
}

------

@Bean
Public UserDetailService userDetailsService() {
	return new UserDetailsService() {
		@Override
		public UserDetails loadUserByUsername(String username) {
			return readerRepository.findOne(username);
		}
	}
}
```

{% hint style="info" %}
테스트를 실행하면 스프링 시큐리티는 사용자 정보를 조회하는 사용자 상세 서비스를 요구한다. 따라서 사용자 상세 서비스를 테스트 러너에서 참조할 수 있도록 빈을 만들어야 한다.
{% endhint %}

