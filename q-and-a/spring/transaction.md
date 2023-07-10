# 카프카 transaction 처리는 어떻게 해야할까?

## 카프카를 사용하면서 트랜잭션 처리가 가능할까?

* 메시지큐를 사용하는 이유는 애플리케이션의 성능의 부하를 줄이기 위해서가 가장 큰 장점일 것이다
* 그런데 비즈니스 로직 중간에 메시지를 프로듀서하고 그 이후에 exception이 발생하면 어떻게 될까?
* 이미 전송한 메시지는 컨슈밍되어 무조건 수행되어야만 할까?
* 코드로 살펴보자

## 테스트 코드

* 테스트할 코드는 단순하다
* 메시지를 전송하고 전달받은 메시지를 컨슈밍한다

#### 프로듀서

* 파라미터로 넘어온 메시지를 TestMessage라는 객체로 전달하였다

```jsx
public void sendMessage(String message) {
    ProducerRecord<String, Object> record = new ProducerRecord<>("TEST", TestMessage.builder().message(message).build());
    multiTypeKafkaTemplate.send(record);
}
```

#### 컨슈머

* 전달받은 메시지를 로그로 남겨서 컨슈밍 되는지 확인한다

```jsx
@KafkaHandler
public void handleDevice(TestMessage message) {
    log.info("😃😃😃😃 consume success!!! parameter = {}", message.toString());
}
```

#### 비즈니스 로직

* 임시 메서드를 생성하여 프로듀서에게 메시지를 전달한다

```jsx
@Service
@RequiredArgsConstructor
public class TestService {

		@Transactional
    public void sendTestMessage() {
        kafkaTestProducerService.sendMessage("Hello World!! Incheol~~~~~");
    }
}
```

#### 잘 컨슈밍 되는지 로그를 확인해보자

<figure><img src="../../.gitbook/assets/1 (2).png" alt=""><figcaption></figcaption></figure>

### 그럼 exception이 발생하면 어떻게 될까?

#### 서비스로직에 exception을 추가해보자

```jsx
@Transactional
public void sendTestMessage() {
    kafkaTestProducerService.sendMessage("Hello World!! Incheol~~~~~");
    throw new RuntimeException("런타임 오류");
}
```

#### 메시지 컨슈밍되는지 확인해보자

<figure><img src="../../.gitbook/assets/2 (7) (2).png" alt=""><figcaption></figcaption></figure>

* exception을 발생했지만 커슈밍된것을 확인할 수 있다

### 그럼 트랜잭션이 실패하면 메시지 컨슈밍도 롤백하려면 어떻게 해야 할까?

* 해결방법은 심플하다!
* 컨슈머를 설정하는 Bean의 옵션중에 “isolation.level”을 “read\_committed”으로 설정하면 된다

```jsx
@Bean
    public ConsumerFactory<String, Object> multiTypeConsumerFactory() {
        HashMap<String, Object> props = new HashMap<>();
        ...
        props.put(ConsumerConfig.ISOLATION_LEVEL_CONFIG, READ_COMMITTED);
        return new DefaultKafkaConsumerFactory<>(props);
    }
```

#### 오잉? 그럼 기본 설정은 어떻게 되어있지?

<figure><img src="../../.gitbook/assets/3 (3).png" alt=""><figcaption></figcaption></figure>

* 기본값은 “read\_uncommitted”로 커밋이 되지 않아도 컨슈밍할수 있도록 되어있다

### 그렇다면 트랜잭션 처리가 되어있지 않은 경우엔 어떻게 될까?

* 트랜잭션을 주석처리하자

```jsx
// @Transactional
public void sendTestMessage() {
    kafkaTestProducerService.sendMessage("Hello World!! Incheol~~~~~");
    try {
        Thread.sleep(1000);
    } catch (InterruptedException e) {
        throw new RuntimeException(e);
    }
    throw new RuntimeException("런타임 오류");
}
```

* 그리고 컨슈밍되는지 확인해보자

<figure><img src="../../.gitbook/assets/4 (2).png" alt=""><figcaption></figcaption></figure>

* 동일하게 동작하는것을 확인할수 있다

### 컨슈머는 어떻게 트랜잭션 처리가 되었는지 알수 있을까?

* 실마리는 도먼큐트에 있다

<figure><img src="../../.gitbook/assets/5 (3) (2).png" alt=""><figcaption></figcaption></figure>

* 우선 트랜잭션 모드가 아닌 상황에서는 컨슈머는 `unread_committed`과 동일하게 간주한다고 한다
* 그리고 트랜잭션 모드이고 `read_committed` 일 경우에는 트랜잭션이 시작하면서 보낸 메시지는 보류되고 트랜잭션이 완료되면 오프셋을 확인하여 트랜잭션이 처리되었는지 확인후 받은 메시지를 처리한다고 되어있다
