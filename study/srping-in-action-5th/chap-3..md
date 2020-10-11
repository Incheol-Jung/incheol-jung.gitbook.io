---
description: 스프링 인 액션(5판) 챕터 3장을 요약한 내용 입니다.
---

# Chap 3. 데이터로 작업하기

### 절차

1. 데이터 퍼시스턴스\(persistence\)를 이용한 CRUD
2. 상용구 코드\(boilerplate code\)를 없애기 위한 스프링의 JDBC 전환
3. 코드를 간소화 하기 위해 JPA 적용

## JDBC를 사용해서 데이터 읽고 쓰기

JdbcTemplate은 JDBC를 사용할 떄 요구되는 모든 형식적이고 상투적인 코드없이 개발자가 관계형 데이터베이스에 대한 SQL 연산을 수행할 수 있는 방법을 제공한다.

만약 JdbcTemplate을 사용하지 않고 자바로 간단한 SQL 쿼리를 수행하는 방법을 살펴보자

```java
@Override
  public Ingredient findById(String id) {
    Connection connection = null;
    PreparedStatement statement = null;
    ResultSet resultSet = null;
    try {
      connection = dataSource.getConnection();
      statement = connection.prepareStatement(
          "select id, name, type from Ingredient");
      statement.setString(1, id);
      resultSet = statement.executeQuery();
      Ingredient ingredient = null;
      if(resultSet.next()) {
        ingredient = new Ingredient(
            resultSet.getString("id"),
            resultSet.getString("name"),
            Ingredient.Type.valueOf(resultSet.getString("type")));
      } 
      return ingredient;
    } catch (SQLException e) {
      // ??? What should be done here ???
    } finally {
      if (resultSet != null) {
        try {
          resultSet.close();
        } catch (SQLException e) {}
      }
      if (statement != null) {
        try {
          statement.close();
        } catch (SQLException e) {}
      }
      if (connection != null) {
        try {
          connection.close();
        } catch (SQLException e) {}
      }
    }
    return null;
  }
```

이것과 대조되는 JdbcTemplate 사용 메서드를 알아보자

```java
public Ingredient findById(String id) {
  return jdbc.queryForObject(
      "select id, name, type from Ingredient where id=?",
      this::mapRowToIngredient, id);
}

@Override
public Iterable<Ingredient> findAll() {
  return jdbc.query("select id, name, type from Ingredient",
      this::mapRowToIngredient);
}

private Ingredient mapRowToIngredient(ResultSet rs, int rowNum)
    throws SQLException {
  return new Ingredient(
      rs.getString("id"), 
      rs.getString("name"),
      Ingredient.Type.valueOf(rs.getString("type")));
}
```

해당 코드에는 명령문이나 데이터베이스 연결 객체를 생성하는 코드가 아예 없다. 그리고 메서드의 실행이 끝난 후 그런 객체들을 클린업하는 코드 또한 없다. 또한, catch 블록에서 올바르게 처리할 수 없는 예외를 처리하는 어떤 코드도 없다.

findAll\(\)과 findById\(\) 모두의 두 번째 인자로는 스프링 RowMapper 인터페이스를 구현한 mapRowToIngredient\(\) 메서드의 참조가 전달된다. 이처럼 메서드 인자로 다른 메서드의 참조를 전달할 수 있는 것은 자바 8에서 메서드 참조와 람다\(lambda\)가 추가되었기 때문이며, JdbcTemplate을 사용할 때 매우 편리하다. 그러나 종전처럼 RowMapper 인터페이스의 mapRow\(0 메서드를 구현하는 방법을 사용할 수도 있다.

### 스키마 정의하고 데이터 추가하기

schema.sql이라는 이름의 파일이 애플리케이션 classpath의 루트 경로에 있으면 애플리케이션이 시작될 때 schema.sql 파일의 SQL이 사용 중인 데이터베이스에서 자동 실행된다. 따라서 schema.sql이라는 이름의 파일로 src/main/resources 폴더에 저장하면 된다.

```java
create table if not exists Ingredient (
  id varchar(4) not null,
  name varchar(25) not null,
  type varchar(10) not null
);

create table if not exists Taco (
  id identity,
  name varchar(50) not null,
  createdAt timestamp not null
);

create table if not exists Taco_Ingredients (
  taco bigint not null,
  ingredient varchar(4) not null
);

alter table Taco_Ingredients
    add foreign key (taco) references Taco(id);
alter table Taco_Ingredients
    add foreign key (ingredient) references Ingredient(id);
```

DesignTacoController의 processDesign\(\) 메서드를 수정해보자.

```java
@Controller
@RequestMapping("/design")
@SessionAttributes("order")
public class DesignTacoController {
   
  @Autowired
  public DesignTacoController(
        IngredientRepository ingredientRepo, 
        TacoRepository designRepo) {
    this.ingredientRepo = ingredientRepo;
    this.designRepo = designRepo;
  }
 
  @ModelAttribute(name = "order")
  public Order order() {
    return new Order();
  }
  
  @ModelAttribute(name = "taco")
  public Taco taco() {
    return new Taco();
  }

  @GetMapping
  public String showDesignForm(Model model) {
    List<Ingredient> ingredients = new ArrayList<>();
    ingredientRepo.findAll().forEach(i -> ingredients.add(i));
    
    Type[] types = Ingredient.Type.values();
    for (Type type : types) {
      model.addAttribute(type.toString().toLowerCase(), 
          filterByType(ingredients, type));      
    }

    return "design";
  }

	...
}
```

### @SessionAttributes는 왜 사용할까?

@SessionAttributes\("order"\)를 사용하는 이유는 Order 인스턴스를 세션에 담아두기 위함이다. 하나의 세션에서 생성되는 Taco 객체와 다르게 주문은 다수의 HTTP 요청에 걸쳐 존재해야 한다. 다수의 타코를 생성하고 그것들을 하나의 주문으로 추가할 수 있게 하기 위해서다. 그러면 세션에서 계속 보존되면서 다수의 요청에 걸쳐 사용될 수 있다.

주문 객체가 데이터베이스에 저장된 후에는 더 이상 세션에 보존할 필요가 없다. 그러나 만일 제거하지 않으면 이전 주문 및 이것과 연관된 타코가 세션에 남아 있게 되어 다음 주문은 이전 주문에 포함되었던 타코 객체들을 가지고 시작하게 될 것이다.

```java
@PostMapping
public String processOrder(@Valid Order order, Errors errors, 
                           SessionStatus sessionStatus) {
  if (errors.hasErrors()) {
    return "orderForm";
  }
  
  orderRepo.save(order);
  sessionStatus.setComplete();
  
  return "redirect:/";
}
```

마지막으로 데이터의 타입을 변환해 주는 컨버터 클래스를 작성하자. 이 클래스는 스프링의 Converter 인터페이스에 정의된 convert\(\) 메서드를 구현한다.

```java
@Component
public class IngredientByIdConverter implements Converter<String, Ingredient> {

  private IngredientRepository ingredientRepo;

  @Autowired
  public IngredientByIdConverter(IngredientRepository ingredientRepo) {
    this.ingredientRepo = ingredientRepo;
  }
  
  @Override
  public Ingredient convert(String id) {
    return ingredientRepo.findById(id);
  }

}
```

### 스프링 데이터 JPA를 사용해서 데이터 저장하고 사용하기

JDBC 버전의 리퍼지터리에서는 리퍼지터리가 제공하는 메서드를 우리가 명시적으로 선언하였다. 그러나 스프링 데이터에서는 그 대신 CrudRepository 인터페이스를 확장\(extends\)할 수 있다. CrudRepository 인터페이스에는 데이터베이스의 CRUD 연산을 위한 많은 메서드가 선언되어 있다. CrudRepository는 매개변수화 타입이다.

### JPA 리퍼지터리 커스터마이징하기

지금까지 작성한 로직은 비교적 간단한 쿼리에서는 유용할 수 있다. 그러나 더 복잡한 쿼리의 경우는 메서드 이름만으로는 감당하기 어렵다. 따라서 이때는 어떤 이름이든 우리가 원하는 것을 지정한 후 해당 메서드가 호출될 때 수행되는 쿼리에 @Query 애노테이션을 지정하자.

```java
@Query("Order o where o.deliveryCity = 'Seattle'")
List<Order> readOrdersDeliveredInSeattle();
```

이름 규칙을 준수하여 쿼리를 수행하는 것이 어렵거나 불가능할 때에도 @Query를 사용할 수 있다.

