import Player from './Player';

const {ccclass, property} = cc._decorator;

@ccclass
export default class NewClass extends cc.Component {
    // LIFE-CYCLE CALLBACKS:
    @property(cc.Node)
    player:cc.Node = null;

    @property(cc.Node)
    hintPoint:cc.Node = null;

    @property(cc.Prefab)
    trapPrefab:cc.Prefab = null;

    @property(cc.Node)
    camera:cc.Node = null;

    trapCoords: cc.Vec2[][];
    level:number;

    onLoad () {
      this.node.on(cc.Node.EventType.TOUCH_START, this.onTouchStart.bind(this));
      this.node.on(cc.Node.EventType.TOUCH_MOVE, this.onTouchMove.bind(this));
      this.node.on(cc.Node.EventType.TOUCH_END, this.onTouchEnd.bind(this));

      cc.director.getCollisionManager().enabled = true;
      cc.director.getCollisionManager().enabledDebugDraw = true;
    }

    start () {
      this.level = 0;
      this.initTrapCoords();
      this.spawnTrapCoords();
    }

    initTrapCoords () {
      this.trapCoords = [
        [
          new cc.Vec2(100, 100),
          new cc.Vec2(-100, 200),
          new cc.Vec2(100, 300),
          new cc.Vec2(-100, 400),
          new cc.Vec2(100, 500),
          new cc.Vec2(-100, 600),
          new cc.Vec2(100, 700),
          new cc.Vec2(-100, 800),
        ],
        [
        ]
      ];
    }

    spawnTrapCoords () {
      for (let trapCoord of this.trapCoords[this.level]) {
        let trap = cc.instantiate(this.trapPrefab);
        this.node.addChild(trap);
        trap.position = trapCoord;
        this.camera.getComponent(cc.Camera).addTarget(trap);
      }
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
