---
description: 테스트 주도 개발 시작하기 9장을 요약한 내용입니다.
---

# CHAP 10. 테스트 코드와 유지보수

## 테스트 코드와 유지보수

TDD를 하는 과정에서 작성한 테스트 코드는 CI/CD에서 자동화 테스트로 사용되어 버그가 배포되는 것을 막아주고 이는 소프트웨어 품질이 저하되는것을 방지한다. 테스트 코드는 유지보수 대상이기 때문에 방치하게 되면 다음과 같은 문제가 발생할 수 있다.

* 실패한 테스트가 새로 발생해도 무감각해진다. 테스트 실패 여부에 상관없이 빌드하고 배포하기 시작한다.
* 빌드를 통과시키기 위해 실패한 테스트를 주석 처리하고 실패한 테스트는 고치지 않는다.

테스트 코드는 코드를 변경했을 때 기존 기능이 올바르게 동작하는지 확인하는 회귀 테스트를 자동화하는 수단으로 사용되는데 깨진 테스트를 방치하기 시작하면 회귀 테스트가 검증하는 범위가 줄어든다. 즉 소프트웨어 품질이 낮아질 가능성이 커지는 것이다.

유지보수하기 좋은 코드를 만들기 위해 필요한 좋은 패턴과 원칙이 존재하는 것처럼 좋은 테스트 코드를 만들려면 몇 가지 주의해야 할 사항이 있다.

깨진 유리창 이론

깨진 유리창 하나를 방치하면, 그 지점을 중심으로 범죄가 확산되기 시작한다는 이론으로, 사소한 무질서를 방치하면 큰 문제로 이어질 가능성이 커진다는 의미를 담고 있다.

## 변수나 필드를 사용해서 기댓값 표현하지 않기

테스트 검증할 경우에 get method를 사용하기 보단 명확하게 상수를 사용하는게 가독성이 더 좋을 수 있다.

```text
// 안좋은 사례
@Test
void dateFormat() {
		LocalDate date = LocalDate.of(1945,8,15);
		String dateStr = formatDate(date);
		assertEquals(date.getYear() + "년 " + 
							date.getMonthValue() + "월 " +
							date.getDayOfMonth() + "일 ", dateStr);

// 개선된 사례
@Test
void dateFormat() {
		LocalDate date = LocalDate.of(1945,8,15);
		String dateStr = formatDate(date);
		assertEquals("1945년 8월 15일", dateStr);

// 안좋은 사례
@Test
void checkArray() {
		assertAll(
				() -> assertEquals(answers.get(0), resultedAnswers.get(0)),
				() -> assertEquals(answers.get(1), resultedAnswers.get(1)),
				() -> assertEquals(answers.get(2), resultedAnswers.get(2))
		)
}

// 개선된 사례
@Test
void checkArray() {
		assertAll(
				() -> assertEquals(1, resultedAnswers.get(0)),
				() -> assertEquals(2, resultedAnswers.get(1)),
				() -> assertEquals(3, resultedAnswers.get(2))
		)
}
```

## 두 개 이상을 검증하지 않기

처음 테스트 코드를 작성하면 한 테스트 메서드에 가능한 많은 단언을 하려고 시도한다. 그 과정에서 서로 다른 검증을 섞는 경우가 있다. 물론 테스트 메서드가 반드시 한 가지만 검증해야 하는 것은 아니지만, 검증 대상이 명확하게 구분된다면 테스트 메서드도 구분하는 것이 유지보수에 유리하다.

## 정확하게 일치하는 값으로 모의 객체 설정하지 않기

```text
// 안좋은 사례
@Test
void weakPassword() {
    BDDMockito.given(mockPasswordChecker.checkPasswordWeak("pw")).willReturn(true);

    assertThrows(WeakPasswordException.class, () -> {
        userRegister.register("id", "pw", "email");
    });
}

// 개선된 사례
void weakPassword() {
    BDDMockito.given(mockPasswordChecker.checkPasswordWeak(Mockito.anyString())).willReturn(true);

    assertThrows(WeakPasswordException.class, () -> {
        userRegister.register("id", "pw", "email");
    });
}
```

이 테스트는 작은 변화에도 실패한다. 예를 들어 다음과 같이 "pw" → "pwa"로 수정하는 날이면 테스트에 실패하게 된다. 이 보다는 Mockito.anyString\(\)을 사용하여 특정 케이스보다는 범용적으로 테스트 케이스를 사용할 수 있다.

## 과도하게 구현 검증하지 않기

테스트 코드를 작성할 때 주의할 점은 테스트 대상의 내부 구현을 검증하는 것이다. 모의 객체를 처음 사용할 때 특히 이런 유혹에 빠지기 쉽다. 하지만 이는 테스트 코드 유지보수에 도움이 되지 않는다. 테스트 대상에서 A 메서드가 호출되었는지 또는 B 메서드가 호출되었는지 검증하게 되면 구현이 조금만 변경되어도 테스트가 깨질 가능성이 커진다는 것이다. 그러므로 내부 구현은 언제든지 바뀔 수 있기 때문에 테스트 코드는 내부 구현보다 실행 결과를 검증해야 한다.

## 셋업을 이용해서 중복된 상황을 설정하지 않기

테스트 코드를 작성하다 보면 각 테스트 코드에서 동일한 상황이 필요할 때가 있다. 이경우 중복된 코드를 제거하기 위해 @BeforeEach 메서드를 이용해서 상황을 구성할 수 있다. 중복을 제거하고 코드 길이도 짧아져서 코드 품질이 좋아졌다고 생각할 수 있지만, 테스트 코드에서는 상황이 달라진다.

* 몇 달 뒤에 다시 보면 테스트 케이스가 한 눈에 보이지 않으므로 setup 메소드 내부와 테스트 코드 로직을 번갈아가며 살펴봐야 한다.
* 모든 테스트 메서드가 동일한 상황 코드를 공유하기 때문에 조금만 내용을 변경해도 테스트가 깨질 수 있다.

## 통합 테스트의 상황 설정을 위한 보조 클래스 사용하기

DB 연동을 포함한 통합 테스트 코드인데 상황 설정을 위해 직접 쿼리를 실행하고 있다. 이 쿼리는 중복 ID를 가진 회원이 존재하는 상황을 만들기 위해 필요한 회원 데이터를 생성한다. 각 테스트 메서드에서 상황을 직접 구성함으로써 테스트 메서드를 분석하기는 좋아졌는데 반대로 상황을 만들기 위한 코드가 여러 테스트 코드에 중복된다. 이런 코드 중복을 없애기 위해 사용하는게 보조 클래스를 사용하는 것이다.

```text
@BeforeEach
void setUp() {
		given = new UserGivenHelper(jdbcTemplate);
}

@Test
void 동일ID가_이미_존재하면_익셉션() {
		given.givenUser("cbk", "pw", "cbk@cbk.com");

    // 실행, 결과 확인
    assertThrows(DupIdException.class,
            () -> register.register("cbk", "strongpw", "email@email.com")
    );
}
```

## 실행 환경이 다르다고 실패하지 않기

같은 테스트 메서드가 실행 환경에 따라 성공하거나 실패하면 안 된다. 로컬 개발 환경에서는 성공하는데 빌드 서버에서는 실패한다거나 윈도우에서는 성공하는데 맥OS에서는 실패하는식으로 테스트를 실행하는 환경에 따라 테스트가 다르게 동작하면 안 된다.

```text
// 안좋은 사례
private String bulkFilePath = "D:\\\\mywork\\\\temp\\\\bulk.txt"
@Test
void load() {
		BulkLoader loader = new BulkLoader();
		loader.load(bulkFilePath);

		...
}

// 개선된 사례 (임시 폴더에 파일을 생성하여 실행 환경에 따라 다르게 동작하는 것을 방지)
@Test
void export() {
		String folder = System.getProperty("java.io.tmpdir");
		Exporter exporter = new Exporter(folder);
		...
}

// 개선된 사례 (특정 OS에서만 동작하도록 실행환경을 지정할 수 있다.)
@EnabledOnOs({OS.LINUX, OS.MAC})
void callBash() {
		...
}

@EnabledOnOs({OS.WINDOWS})
void changeMode() {
		...
}
```

## 실행 시점이 다르다고 실패하지 않기

테스트 코드는 실행 시점에 상관없이 결과가 동일해야 한다.

```text
@Test
void notExpired() {
		// 테스트 코드를 작성한 시점이 2019년 1월 1일
		LocalDateTime expiry = LocalDateTime.of(2019,12,31,0,0,0);
		Member m = Member.builder().expiryDate(expiry).build();
		assertFalse(m.isExpired());
}
```

이 코드는 2019년에 테스트했으면 성공했을 것이다. 그러나 2020년 이후에 테스트를 실행하면 실패할 것이다. 왜냐하면 누군가 만료일을 2019년이 지났으므로 변경했을 가능성이 있기 때문이다. 이보다는 시간을 전달하면 경계 조건도 쉽게 테스트할 수 있다.

```text
@Test
void notExpired() {
		// 테스트 코드를 작성한 시점이 2019년 1월 1일
		LocalDateTime expiry = LocalDateTime.of(2019,12,31,0,0,0);
		Member m = Member.builder().expiryDate(expiry).build();
		assertFalse(m.passedExpiryDate(LocalDateTime.of(2019,12,31,0,0,0)));
}
```

## 랜덤하게 실패하지 않기

실행 시점에 따라 테스트가 실패하는 또 다른 예는 랜덤 값을 사용하는 것이다. 랜덤 값에 따라 달라지는 결과를 검증할 때 주로 이런 문제가 발생한다. 랜덤하게 생성한 값이 결과 검증에 영향을 준다면 구조를 변경해야 테스트가 가능하다. 랜덤하게 생성한 값이 결과 검증에 영향을 준다면 구조를 변경해야 테스트가 가능하다.

```text
// 안좋은 사례
public Game() {
		Randome random = new Random();
		...
}

@Test
void noMatch() {
		Geme g = new Game();
		Score s = g.guess(?,?,?) // 테스트를 통과시킬 수 있는 값이 매번 바뀜
		assertEquals(0, s.strikes());
		assertEquals(0, s.balls());
}

// 개선된 사례
public Game() {
		Randome random = new Random();
		...
		public Game(int[] nums) {
			this.nums = nums;
		}
}

@Test
void noMatch() {
		Geme g = new Game();
		Score s = g.guess(?,?,?) // 테스트를 통과시킬 수 있는 값이 매번 바뀜
		assertEquals(0, s.strikes());
		assertEquals(0, s.balls());
}
```

## 단위 테스트를 위한 객체 생성 보조 클래스

단위 테스트 코드를 작성하다 보면 상황 구성을 위해 필요한 데이터가 다소 복잡할 때가 있다. 테스트를 위한 객체 생성 클래스를 따로 만들면 복잡함을 다소 줄일 수 있다. 다음은 테스트 코드에서 필요한 객체를 생성할 때 사용할 수 있는 팩토리 클래스의 예를 보여준다.

```text
public class TestSurveyFactory {
    public static Survey createAnswerableSurvey(Long id) {
        return Survey.builder()
                .id(id).status(SurveyStatus.OPEN)
                .endOfPeriod(LocalDateTime.now().plusDays(5)).build()
    }
}

@Test
void answer() {
		memorySurveyRepository.save(
				TestSurveyFactory.createAnswerableSurvey(1L)
		);

		...
}
```

## 조건부로 검증하지 않기

테스트는 성공하거나 실패해야 한다. 테스트가 성공하거나 실패하려면 반드시 단언을 실행해야 한다. 만약 조건에 따라서 단언을 하지 않으면 그 테스트는 성공하지도 실패하지도 않은 테스트가 된다.

```text
// 안좋은 사례
@Test
void canTranslateBasicWord() {
		Transalator tr = new Transalator();
		if (tr.contains("cat")) {
				assertEquals("고양이", tr.transalte("cat"));
		}
}

// 개선된 사례
@Test
void canTranslateBasicWord() {
		Transalator tr = new Transalator();
		assertTranslationOfBasicWord(tr,"cat");
}

private void assertTranslationOfBasicWord(Translator tr, String word) {
		assertTrue(tr.contains("cat"));
		assertEquals("고양이",tr.translate("cat"));
}
```

## 통합 테스트는 필요하지 않은 범위까지 연동하지 않기

```text
@SpringBootTest
public class MemberDaoIntTest {
		@Autowired
		MemberDao dao;

		@Test
		void findAll() {
				List<Member> members = dao.selectAll();
				assertTrue(members.size() > 0);
		}
}
```

이 테스트 코드는 한 가지 단점이 있다. 테스트하는 대상은 DB와 연동을 처리하는 MemberDao인데 @SpringBootTest 애노테이션을 사용하면 서비스, 컨트롤러 등 모든 스프링 빈을 초기화한다는 것이다. DB 관련된 설정 외에 나머지 설정도 처리하므로 스프링을 초기화하는 시간이 길어질 수 있다.

스프링 부트가 제공하는 @JdbcTest 애노테이션을 사용하면 DateSource, JdbcTemplate 등 DB 연동과 관련된 설정만 초기화한다. DataSource와 JdbcTemplate을 테스트 코드에서 직접 생성하면 스프링 초기화 과정이 빠지므로 테스트 시간은 더 짧아질 것이다.

## 더 이상 쓸모 없는 테스트 코드

LocalDateTime의 포맷팅 방법을 익히기 위해 테스트 코드극 작성하였다. 비슷하게 2020년 1월 31일에서 한 달을 더하면 2020년 2월 29일이 나온지 확인하고 싶다고 테스트 코드를 작성해서 확인하였다. 이런 테스트 코드는 사용법을 익히고 나면 더 이상 필요가 없다. 소프트웨어가 제공할 기능을 검증하는 코드도 아니기 때문에 테스트 코드를 유지해서 얻을 수 있는 이점도 없다. 단지 테스트 커버리지를 높이기 위한 목적으로 작성한 테스트 코드도 유지할 필요가 없다.

