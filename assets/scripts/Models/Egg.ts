
const {ccclass, property} = cc._decorator;

import InGame from '../Controllers/InGame';

const MIN_SPEED = 5;

@ccclass
export default class NewClass extends cc.Component {
    speed:number = 0;
    direction:cc.Vec2;
    isMoving:boolean;
    world:cc.Node;
    // LIFE-CYCLE CALLBACKS:

    // onLoad () {}

    start () {
      this.world = this.node.parent;
    }

    shoot () {
      this.isMoving = true;
    }

    checkDestroy () : boolean {
      let leftEdgeWorldX = this.world.getComponent(InGame).getLeftEdgeX();
      let rightEdgeWorldX = this.world.getComponent(InGame).getRightEdgeX();
      let leftEdgeX = this.node.x - this.node.width / 2;
      let rightEdgeX = this.node.x + this.node.width / 2;

      if (leftEdgeX <= leftEdgeWorldX || rightEdgeX >= rightEdgeWorldX) {
        return true;
      }

      if (this.speed < MIN_SPEED) {
        return true;
      }

      if (this.direction.x === 0 && this.direction.y === 0) {
        return true;
      }

      return false;
    }

    onDestroy () {
    }

    update (dt) {
      if (this.isMoving) {
        let distance = this.direction.mul(this.speed).mul(dt);
        this.node.position = this.node.position.add(distance);

        if (this.checkDestroy()) {
          this.node.removeFromParent();
          this.node.destroy();
        }
      }
    }
}
