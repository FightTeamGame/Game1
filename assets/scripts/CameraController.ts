
const {ccclass, property} = cc._decorator;

@ccclass
export default class NewClass extends cc.Component {

    @property(cc.Node)
    target: cc.Node = null;

    camera:cc.Camera = null;

    // LIFE-CYCLE CALLBACKS:

    onLoad () {
      this.camera = this.node.getComponent(cc.Camera);
    }

    start () {

    }

    // update (dt) {}

    onEnable () {
      cc.director.getPhysicsManager().attachDebugDrawToCamera(this.camera);
    }

    onDisable () {
      cc.director.getPhysicsManager().detachDebugDrawFromCamera(this.camera);
    }

    lateUpdate () {
      this.node.position = this.target.position.clone();
      this.node.x -= this.target.x;
    }
}
