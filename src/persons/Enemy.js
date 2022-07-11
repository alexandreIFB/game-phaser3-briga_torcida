import HealthBar from "../components/healthBar"

export default class Enemy extends Phaser.Physics.Arcade.Sprite {

  constructor(scene, x = 0, y = 0, texture = 'fluminense') {
    super(scene, x, y, texture)

    scene.add.existing(this)
    scene.physics.add.existing(this)
    this.hp = new HealthBar(scene, x - 40, y - 50)
    this.alive = true
    scene.events.on('update', this.update, this)
    this.setScale(3)
    this.kickActive = false;
    this.anims.play('walk_enemy')

    this.on(Phaser.Animations.Events.ANIMATION_COMPLETE, (anim) => {
      this.kickActive = false;
      console.log(anim.key)

      if (anim.key === 'kick_enemy' || anim.key === 'punch_enemy') {
        scene.damagePlayer(scene.player, this, 10)
      } else if (anim.key === 'punch_enemy') {
        scene.damagePlayer(scene.player, this, 5)
      }

      this.anims.play('walk_enemy')
    }, this);

  }
  damage(amount) {
    if (this.hp.decrease(amount)) {
      this.alive = false
    }
  }
  update() {
    this.hp.follow(this)
    if (this.alive === false) {
      return;

    }

  }
}
