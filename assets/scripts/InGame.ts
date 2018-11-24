import Player from './Player';

const {ccclass, property} = cc._decorator;

@ccclass
export default class NewClass extends cc.Component {
    // LIFE-CYCLE CALLBACKS:
    @property(cc.Node)
    player:cc.Node = null;

    @property(cc.Node)
    hintPoint:cc.Node = null;

    onLoad () {
      this.node.on(cc.Node.EventType.TOUCH_START, this.onTouchStart.bind(this));
      this.node.on(cc.Node.EventType.TOUCH_MOVE, this.onTouchMove.bind(this));
      this.node.on(cc.Node.EventType.TOUCH_END, this.onTouchEnd.bind(this));
    }

    onTouchStart () {
    }

    onTouchMove(touch:cc.Event.EventTouch) {
      let startLoc = this.node.convertToNodeSpaceAR(touch.getStartLocation());
      let loc = this.node.convertToNodeSpaceAR(touch.getLocation());
      
      let stopPos = this.player.getComponent(Player).calculateStopPosition(loc);
      this.hintPoint.position = stopPos;
    }

    onTouchEnd (touch: cc.Event.EventTouch) {
      let startLoc = this.node.convertToNodeSpaceAR(touch.getStartLocation());
      let loc = this.node.convertToNodeSpaceAR(touch.getLocation());
      let vec = new cc.Vec2(loc.x - startLoc.x, loc.y - startLoc.y);
      vec = vec.mul(-1);
      this.player.getComponent(Player).shoot(vec);
    }

    start () {

    }

    update (dt) {
      // this.car.x += 100 * dt;
    }

    getLeftEdgeX () {
      return -this.node.width / 2;
    }
  
    getRightEdgeX () {
      return this.node.width / 2;
    }  
}
