---
layout: post
title:  "Fake dependencies"
date:   2017-01-22 00:00:00
categories: TestingYourApp
comments: true
---

테스트 모듈에 대한 종속성을 선언 할 수있는 다른 용도를 가지고 있다. 실제 서비스 대신 가짜 서비스를 종속 서비스로 선언하는 것은 너무 많은 수고를 들이지 않고도 할 수 있다.
이 예에서는 내 RaceService가 로컬 스토리지를 사용하여 레이스를 저장하고 키 'race'를 가지고 있다고 하자. 
당신의 동료는 우리의 RaceService가 사용하는 JSON 직렬화 등을 취급 LocalStorageService라는 서비스를 개발하였다. list ()함수는 다음과 같다.

```javascript
@Injectable()
export class RaceService {
  constructor(private localStorage: LocalStorageService) {
  }
  list() {
   return this.localStorage.get('races');
  }
}
```

이제 우리는 LocalStorageService 서비스를 테스트하고 싶지 않는다. RaceService를 테스트하고 싶다.
의존성 주입 시스템을 활용하여 위조 된 LocalStorageService를 제공함으로써 쉽게 수행 할 수 있다.

```javascript
class FakeLocalStorage {
  get(key) {
   return [{ name: 'Lyon' }, { name: 'London' }];
  }
}
```

provide를 사용하여 RaceService를 테스트로 할 수 있다. 

```javascript
import { TestBed } from '@angular/core/testing';
describe('RaceService', () => {
  beforeEach(() => TestBed.configureTestingModule({
   providers: [
   { provide: LocalStorageService, useClass: FakeLocalStorage },
   RaceService
   ]
  }));
  it('should return 2 races from localStorage', () => {
   const service = TestBed.get(RaceService);
   const races = service.list();
   expect(races.length).toBe(2);
  });
});
```

하지만 이 테스트에 완전히 만족하지는 않는다. 가짜 서비스를 만드는 것은 지루하고 재스민은 서비스를 감지하고 구현을 가짜로 대체하는 것을 도울 수 있습니다. 
또한 get () 메서드가 올바른 키인 'race'와 함께 호출되었는지 확인할 수 있다.

```javascript
import { TestBed } from '@angular/core/testing';
describe('RaceService', () => {
  const localStorage = jasmine.createSpyObj('LocalStorageService', ['get']);
  beforeEach(() => TestBed.configureTestingModule({
   providers: [
   { provide: LocalStorageService, useValue: localStorage },
   RaceService
   ]
  }));
  it('should return 2 races from localStorage', () => {
   localStorage.get.and.returnValue([{ name: 'Lyon' }, { name: 'London' }]);
   const service = TestBed.get(RaceService);
   const races = service.list();
   expect(races.length).toBe(2);
   expect(localStorage.get).toHaveBeenCalledWith('races');
  });
});
```