import HealthBar from "../components/healthBar"

export default class Enemy extends Phaser.Physics.Arcade.Sprite {

  constructor(scene, x = 0, y = 0, texture = 'fluminense', scaleParse = 3) {
    super(scene, x, y, texture)

    scene.add.existing(this)
    scene.physics.add.existing(this)
    this.hp = new HealthBar(scene, x - 40, y - 50)
    this.alive = true
    scene.events.on('update', this.update, this)
    this.setScale(scaleParse)
    this.kickActive = false;
    this.anims.play('idle_enemy')
    this.followPlayer = false
    this.damageBase = 3;
    if (this.scale > 3) {
      this.damageBase = this.damageBase + 3;
    }


    this.on(Phaser.Animations.Events.ANIMATION_COMPLETE, (anim) => {
      this.kickActive = false;
      console.log(anim.key)



      if (anim.key === 'kick_enemy') {
        scene.damagePlayer(scene.player, this, this.damageBase * 2)
      } else if (anim.key === 'punch_enemy') {
        scene.damagePlayer(scene.player, this, this.damageBase)
      }

      //this.anims.play('walk_enemy')
      //this.followPlayer = false;
    }, this);

  }
  damage(amount) {
    if (this.scale > 3) {
      if (this.hp.decrease(amount / 3)) {
        this.alive = false
      }
    } else {
      if (this.hp.decrease(amount)) {
        this.alive = false
      }
    }
  }
  update() {
    this.hp.follow(this)
    if (this.alive === false) {
      return;

    }

  }
}
