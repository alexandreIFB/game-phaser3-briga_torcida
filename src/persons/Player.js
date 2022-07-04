import HealthBar from "../components/healthBar"

export default class Player extends Phaser.Physics.Arcade.Sprite {
  keyPressed = false
  constructor(scene, x = 0, y = 0, texture = 'dude') {
    super(scene, x, y, texture)

    scene.add.existing(this)
    scene.physics.add.existing(this)
    this.hp = new HealthBar(scene, x - 40, y - 50)
    this.alive = true
    scene.events.on('update', this.update, this)
    this.setScale(3)
  }
  damage(amount) {
    if (this.hp.decrease(amount)) {
      this.alive = false
    }
  }
  update() {
    const speed = 2.5

    if (this.alive === false) {
      return;
    }
    this.hp.follow(this)
    if (this.scene.cursors.left.isDown) {
      this.x -= speed
      this.flipX = false
      this.anims.play('walk', true);
    }
    else if (this.scene.cursors.right.isDown) {
      this.x += speed
      this.flipX = true
      this.anims.play('walk', true);
    }
    // else {
    //   this.setVelocityX(0);
    //   this.anims.play('idle');
    // }
    if (this.scene.keyA.isDown) {
      this.keyPressed = true
      this.anims.play('kick', true);
    } else if (this.scene.keyS.isDown) {
      this.keyPressed = true
      this.anims.play('punch');
    }
    if (this.scene.cursors.up.isDown) {
      this.y -= speed
      this.anims.play('walk')
    }
    else if (this.scene.cursors.down.isDown) {
      this.y += speed
      this.anims.play('walk')
    }
  }
}
