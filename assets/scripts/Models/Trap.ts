
const {ccclass, property} = cc._decorator;

import * as Ultil from '../Controllers/Ultil';

@ccclass
export default class NewClass extends cc.Component {

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {}

    start () {

    }

    // update (dt) {}

    onCollisionEnter (other, self) {
      switch (other.tag) {
        case Ultil.CollisionEntity.Player : {
          this.node.removeFromParent();
          this.destroy();
        }
      }
    }

    onDestroy () {
    }
}
