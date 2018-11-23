
const {ccclass, property} = cc._decorator;
const SPEED_FAC = 100;
const MOVE_DURATION = 1;

@ccclass
export default class NewClass extends cc.Component {

  speed:number;
  direction:cc.Vec2;
  moveTime:number;
  isMoving:boolean;

  onLoad () {
  }

  start () {
    this.speed = 0;
    this.moveTime = 0;
    this.direction = new cc.Vec2();
    this.isMoving = false;
  }

  shoot (targetPos:cc.Vec2) {
    let vec = this.node.position.sub(targetPos);
    this.direction = vec.normalize();

    this.speed = vec.mag() + SPEED_FAC;
    this.moveTime = 0;
    this.isMoving = true;
  }

  calculateStopPosition (targetPos:cc.Vec2) : cc.Vec2 {
    let vec = this.node.position.sub(targetPos);
    let direction = vec.normalize();
    let speed = vec.mag() + SPEED_FAC;
    let s = direction.mul(speed).mul(MOVE_DURATION);
    let stopPos = this.node.position.add(s);
    return stopPos;
  }

  update (dt) {
    //
    if (this.isMoving) {
      let distance = this.direction.mul(this.speed).mul(dt);
      this.node.position = this.node.position.add(distance);

      this.moveTime += dt;
      this.isMoving = this.moveTime < MOVE_DURATION;
    }
  }
}
