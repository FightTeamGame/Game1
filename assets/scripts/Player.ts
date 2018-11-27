
const {ccclass, property} = cc._decorator;
const SPEED_FAC = 400;
const MOVE_DURATION = 1;
const FRICTION_FORCE = 500;
const EGG_SPEED = 200;
const FRICTION_INS_FAC = 900;
const MIN_SPEED = 50;
const GRAVITY = 60;


import InGame from './InGame';
import Egg from './Egg';
import * as Ultil from './Ultil';

@ccclass
export default class NewClass extends cc.Component {

  @property(cc.Node)
  world:cc.Node = null;

  @property(cc.Prefab)
  eggPrefab: cc.Prefab = null;

  @property(cc.Node)
  camera:cc.Node = null;

  speed:number;
  direction:cc.Vec2;
  moveTime:number;
  isMoving:boolean;
  startPos:cc.Vec2;
  frictionForce:number;
  isShooted:boolean;

  onLoad () {
  }

  start () {
    this.speed = 0;
    this.moveTime = 0;
    this.direction = new cc.Vec2();
    this.isMoving = false;
    this.startPos = this.node.position.clone();
    this.frictionForce = FRICTION_FORCE;
    this.isShooted = false;
  }

  shoot (vec:cc.Vec2) {
    if (vec.x === 0 && vec.y === 0) {
      return;
    }

    // this.startPos = this.node.position.clone();
    this.direction = vec.normalize();

    this.speed = vec.mag() + SPEED_FAC;
    // this.moveTime = 0;
    this.isMoving = true;
    this.frictionForce = FRICTION_FORCE;

    // shoot egg
    let eggDirection = this.direction.mul(-1);
    let egg = this.spawnEgg(eggDirection);
    egg.getComponent(Egg).shoot();
    this.world.getComponent(InGame).decreaseEgg(1);

    // rotate
    let angle = Math.atan2(this.direction.y, this.direction.x) * 180 / Math.PI;
    this.node.rotation = -(angle - 90);
    this.isShooted = false;
  }

  spawnEgg (direction:cc.Vec2) : cc.Node {
    let egg = cc.instantiate(this.eggPrefab);
    this.world.addChild(egg);
    egg.getComponent(Egg).speed = EGG_SPEED;
    egg.getComponent(Egg).direction = direction;
    egg.x = this.node.x;
    egg.y = this.node.y -this.node.height / 2;

    this.camera.getComponent(cc.Camera).addTarget(egg);
    return egg;
  }

  calculateStopPosition (vec:cc.Vec2) : cc.Vec2 {
    let direction = vec.normalize();
    let speed = vec.mag() + SPEED_FAC;

    let s = direction.mul(speed).mul(MOVE_DURATION);
    let stopPos = this.node.position.add(s);
    return stopPos;
  }

  getLeftEdgeX () {
    return this.node.x - this.node.width / 2;
  }

  getRightEdgeX () {
    return this.node.x + this.node.width / 2;
  }

  handleEdgeCollision () {
    let leftEdgeX = this.world.getComponent(InGame).getLeftEdgeX();
    let rightEdgeX = this.world.getComponent(InGame).getRightEdgeX();
    let playerLeftEdgeX = this.getLeftEdgeX();
    let playerRightEdgeX = this.getRightEdgeX();

    if (playerLeftEdgeX <= leftEdgeX || playerRightEdgeX >= rightEdgeX)
    {
      this.node.x = this.node.x > 0 ? rightEdgeX - this.node.width / 2 - 1 : leftEdgeX + this.node.width / 2 + 1;
      this.direction.x *= -1;
      // this.frictionForce += FRICTION_INS_FAC;
      this.speed *= 0.8;
      this.direction.y = 0;
    }
  }

  update (dt) {
    //
    // if (this.isMoving) {
    //   let distance = this.direction.mul(this.speed).mul(dt);
    //   this.node.position = this.node.position.add(distance);

    //   this.moveTime += dt;
    //   this.isMoving = this.moveTime < MOVE_DURATION;
    // }

    // if (this.isMoving) {
    //   this.moveTime += dt;
    //   let x = this.direction.x * this.speed * this.moveTime;
    //   let y = this.direction.y * this.speed * this.moveTime - 0.5 * GRAVITY * this.moveTime * this.moveTime;

    //   this.node.position = this.startPos.add(new cc.Vec2(x, y));

    //   // this.handleEdgeCollision();
    // }

    // if (this.isMoving) {
    let distance = this.direction.mul(this.speed).mul(dt);
    this.node.position = this.node.position.add(distance);

    // this.moveTime += dt;
    // this.isMoving = this.moveTime < MOVE_DURATION;
    this.speed -= this.frictionForce * dt;

    // if (this.speed < MIN_SPEED) {
    //   this.isMoving = false;
    // }
    this.speed = this.speed < 0 ? 0 : this.speed;
    // }

    // rotate
    if (this.speed <= 100 && !this.isShooted) {
      this.isShooted = true;
      let actRotate = cc.rotateTo(0.2, 0);
      // let sequence = cc.sequence(actRotate, cc.callFunc(() => {this.isRotating = false}, this))
      this.node.runAction(actRotate);
    }

    // fall
    this.node.y -= GRAVITY * dt;

    this.handleEdgeCollision();
  }

  onCollisionEnter (other, self) {
    switch (other.tag) {
      case Ultil.CollisionEntity.Trap: {
        this.speed = 0;
      } break;
    }
  }
}
