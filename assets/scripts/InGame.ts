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

    @property(cc.Prefab)
    eggPrefab:cc.Prefab = null;

    @property(cc.Label)
    eggCountLabel: cc.Label = null;

    @property(cc.Node)
    goal:cc.Node = null;

    trapCoords: cc.Vec2[][];
    level:number;
    eggCount:number;
    eggCounts:cc.Node[] = [];

    onLoad () {
      this.node.on(cc.Node.EventType.TOUCH_START, this.onTouchStart.bind(this));
      this.node.on(cc.Node.EventType.TOUCH_MOVE, this.onTouchMove.bind(this));
      this.node.on(cc.Node.EventType.TOUCH_END, this.onTouchEnd.bind(this));

      cc.director.getCollisionManager().enabled = true;
      cc.director.getCollisionManager().enabledDebugDraw = true;
    }

    start () {
      this.level = 0;
      this.eggCount = 5;
      this.initTrapCoords();
      this.spawnTrapCoords();
      this.drawEggCount();

      // setup goal
      this.goal.y = 2640;
    }

    initTrapCoords () {
      this.trapCoords = [
        [
          new cc.Vec2(-271, 904),
          new cc.Vec2(195, 1418),
          new cc.Vec2(273, 1696),
          new cc.Vec2(-229, 2344),
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
      if (this.checkWin()) {
        cc.game.pause();
        return;
      }

      if (this.checkLoss()) {
        cc.game.pause();
        return;
      }
    }

    getLeftEdgeX () {
      return -this.node.width / 2;
    }
  
    getRightEdgeX () {
      return this.node.width / 2;
    }

    decreaseEgg (count) {
      if (this.eggCount > 0) {
        this.eggCount -= count;
      }

      if (this.eggCount < 0) {
        this.eggCount = 0;
      }

      this.drawEggCount();
    }

    drawEggCount () {
      this.clearEggCount();
      this.eggCountLabel.string = this.eggCount.toString();
      for (let i = 0; i < this.eggCount; i++) {
        let egg = cc.instantiate(this.eggPrefab);
        let y = this.node.height / 2 - 50 - i * (egg.height + 10);
        let x = this.node.width / 2 - egg.width / 2 - 10;
        egg.position = new cc.Vec2(x, y);
        this.node.addChild(egg);
        this.eggCounts.push(egg);
      } 
    }

    clearEggCount () {
      for (let egg of this.eggCounts) {
        egg.removeFromParent();
        egg.destroy();
      }
    }

    checkWin () {
      return this.player.y >= this.goal.y;
    }

    checkLoss () {
      return this.eggCount === 0 && this.player.y < this.goal.y;
    }
}
