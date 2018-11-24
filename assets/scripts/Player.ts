
const {ccclass, property} = cc._decorator;
const SPEED_FAC = 400;
const MOVE_DURATION = 1;
const FRICTION_FORCE = 500;
const FRICTION_INS_FAC = 900;
const MIN_SPEED = 50;
const GRAVITY = 30;

import InGame from './InGame';

@ccclass
export default class NewClass extends cc.Component {

  @property(cc.Node)
  world:cc.Node = null;

  speed:number;
  direction:cc.Vec2;
  moveTime:number;
  isMoving:boolean;
  startPos:cc.Vec2;
  frictionForce:number;

  onLoad () {
  }

  start () {
    this.speed = 0;
    this.moveTime = 0;
    this.direction = new cc.Vec2();
    this.isMoving = false;
    this.startPos = this.node.position.clone();
    this.frictionForce = FRICTION_FORCE;
  }

  shoot (vec:cc.Vec2) {
    // this.startPos = this.node.position.clone();
    this.direction = vec.normalize();

    this.speed = vec.mag() + SPEED_FAC;
    // this.moveTime = 0;
    this.isMoving = true;
    this.frictionForce = FRICTION_FORCE;
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

    // fall
    this.node.y -= GRAVITY * dt;

    this.handleEdgeCollision();
  }
}
