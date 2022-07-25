import HealthBar from "../components/healthBar"

export default class Player extends Phaser.Physics.Arcade.Sprite {
  keyPressed = false
  win = false

  damageBase = 15

  constructor(scene, x = 0, y = 0, texture = 'dude') {
    super(scene, x, y, texture)

    scene.add.existing(this)
    scene.physics.add.existing(this)
    this.hp = new HealthBar(scene, x - 40, y - 50)
    this.alive = true
    scene.events.on('update', this.update, this)
    this.setScale(3)

    this.on(Phaser.Animations.Events.ANIMATION_COMPLETE, function (anim) {
      console.log(anim.key)

      if (anim.key === 'kick' || anim.key === 'punch') {
        this.scene.damageEnemy(this.scene.enemy, this.damageBase * 2);
        this.scene.damageEnemy(this.scene.enemy2, this.damageBase * 2);
      } else if (anim.key === 'punch') {
        this.scene.damageEnemy(this.scene.enemy, this.damageBase);
        this.scene.damageEnemy(this.scene.enemy2, this.damageBase);
      }
    }, this);
  }

  gameOver() {
    this.scene.add.bitmapText(300, 300, 'carrier_command', 'GAME OVER', 22);
    return;
  }

  damage(amount) {
    if (this.hp.decrease(amount)) {
      this.alive = false
      this.hp.bar.destroy()
      //this.scene.physics.pause();
      this.anims.play('die');
      this.setTint(0xff0000);
      this.gameOver()
    }
  }

  cura(amount) {
    this.hp.increase(amount)
  }

  upDamage() {
    this.damageBase += 5;
  }

  update() {
    if (this.win) return;

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

    if (this.scene.cursors.up.isDown) {
      this.y -= speed
      this.anims.play('walk')
    } else if (this.scene.cursors.down.isDown) {
      this.y += speed
      this.anims.play('walk')
    }

    if (this.scene.keyA.isDown) {
      this.keyPressed = true
      this.anims.play('kick', true);
    } else if (this.scene.keyS.isDown) {
      this.keyPressed = true
      this.anims.play('punch', true);
    } else if (this.scene.keyD.isDown) {
      this.keyPressed = true
      this.anims.play('idle', true);
    }
  }
}
