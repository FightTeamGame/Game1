
const {ccclass, property} = cc._decorator;

@ccclass
export default class NewClass extends cc.Component {

    @property(cc.Node)
    target: cc.Node = null;

    @property(cc.Node)
    world:cc.Node = null;

    camera:cc.Camera = null;
    speed:number;
    maxDistance:number;
    minDistance:number;
    isMoving:boolean;
    // LIFE-CYCLE CALLBACKS:

    onLoad () {
      this.camera = this.node.getComponent(cc.Camera);
    }

    start () {
      this.maxDistance = this.world.height * 0.4;
      this.minDistance = 10;
      this.speed = 500;
      this.isMoving = false;
    }

    // update (dt) {}

    onEnable () {
      cc.director.getPhysicsManager().attachDebugDrawToCamera(this.camera);
    }

    onDisable () {
      cc.director.getPhysicsManager().detachDebugDrawFromCamera(this.camera);
    }

    lateUpdate () {
      let distanceY = new cc.Vec2(0, this.node.y - this.target.y).mag();

      if (distanceY >= this.maxDistance && !this.isMoving) {
        this.isMoving = true;
      }

      if (this.isMoving) {
        if (distanceY < this.minDistance) {
          this.isMoving = false
          return
        }

        let sign = this.target.y > this.node.y ? 1 : -1;
        this.node.y += sign * this.speed * cc.director.getDeltaTime();
      }
    }
}
