---
description: 객체지향과 디자인 패턴(최범균 저) 추상 팩토리 패턴 정리한 내용입니다.
---

# 추상 팩토리 패턴

## 상황

비행기를 조정하고 미사일을 발사해서 적을 미사일로 쏴 맞춰 잡는 슈팅 게임을 만든다고 가정해 보자. 이런 게임은 흔히 여러 종류의 적이 출현하고 한 단계의 끝에 다다르면 그 단계의 보스가 출현하고, 이 보스를 맞춰 잡으면 다음 단계로 넘어가는 방식을 취한다. 또한, 중간 중간에 공격은 하지 않지만, 부딪히면 안 되는 장애물이 출현하기도 한다.

게임 플레이를 진행하는 State 클래스는 몇 단계인지에 따라 서로 다른 적기, 장애물 또는 보스를 생성해야 한다. 이를 처리하기 위해 Stage 클래스의 코드를 다음과 같이 작성할 수 있을 것이다.

```java
public class Stage {
    private void createEnemies() {
        for(int i=0; i<= ENEMY_COUNT; i++){
            if(stageLevel == 1){
                enemies[i] = new DashSmallFlight(1,1); // 공격,수비력 1
            } else if (stageLevel == 2){
                enemies[i] = new MissileSmallFlight(1,1); // 공격,수비력 1
            }
        }
        if(stageLevel == 1){
            boss = new StrongAttackBoss(1, 10);
        } else if(stageLevel == 2){
            boss = new CloningBoss(5, 20);
        }
    }
    
    private void createObstacle() {
        for(int i=0; i< OBSTACLE_COUNT; i++){
            if(stageLevel == 1){
                obstacle[i] = new RockObstacle();
            } else if(stageLevel == 2){
                obstacle[i] = new BombObstacle();
            }
        }
    }
}
```

## 문제

위 코드의 문제는 단계별로 적기, 보스, 장애물을 생성하는 규칙이 Stage 클래스에 포함되어 있다는 점이다. 새로운 적 클래스가 추가되거나 각 단계의 보스 종류가 바뀔 때 Stage 클래스를 함께 수정해 주어야 하고, 각 단계별로 적기 생성 규칙이 달라질 경우에도 Stage 클래스를 수정해 주어야 한다. 또한, 중첩되거나 연속된 조건문으로 인해 코드가 복잡해지기 쉽고 이는 코드 수정을 어렵게 만드는 원인이 된다.

## 해결방법

이를 해결하기 위해 Stage 클래스로부터 객체 생성 책임을 분리함으로써 이 문제를 해소할 수 있다. 이 때 사용되는 패턴이 바로 추상 팩토리 패턴이다. 추상 팩토리 패턴에서는 관련된 객체 군을 생성하는 책임을 갖는 타입을 별도로 분리한다.

```java
public abstract class EnemyFactory {
    public static EnemyFactory getFactory(int level) {
        if(level == 1) return EasyStageEnemyFactory();
        else return HardEnemyFactory();
    }

    // 객체 생성을 위한 팩토리 메서드
    public abstract Boss createBoss();
    public abstract SmallFlight createSmallFlight();
    public abstract Obstacle createObstacle();
}

public class EasyStageEnemyFactory extends EnemyFactory {

    @Override
    public Boss createBoss() {
        return new StrongAttackBoss();
    }

    @Override
    public SmallFlight createSmallFlight() {
        return new DashSmallFlight;
    }

    @Override
    public Obstacle createObstacle() {
        return new RockObstracle();
    }
}
```
