import Enemy from "../persons/Enemy"
import Player from "../persons/Player"

class GameScene extends Phaser.Scene {
  player
  stars
  bombs
  platforms
  cursors
  score = 0
  scoreText
  keyA
  keyS
  keyD
  keyW
  counter = 0
  estadio
  constructor() {
    super({ key: 'gameScene' })
  }
  init(data) {
    this.selectedCharacter = data.character
    this.selectedEnemy = data.enemy

    console.log(this.selectedCharacter)
    this.fullWidth = 200
    this.cursors = this.input.keyboard.createCursorKeys();
    this.keyA = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.A);
    this.keyS = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.S);
    this.keyD = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.D);
    this.keyW = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.W);
  }

  preload() {
    this.load.spritesheet('enemy', `images/player/${this.selectedEnemy}.png`, { frameWidth: 48, frameHeight: 48 })
    this.load.spritesheet('dude', `images/player/${this.selectedCharacter}.png`, { frameWidth: 48, frameHeight: 48 })
  }
  create() {

    this.input.setDefaultCursor('url(assets/images/healthBar/cursor_pointerFlat_shadow.png), pointer');
    this.estadio = this.add.image(400, 300, 'estadio');
    // make the player to not go to other areas
    this.physics.world.setBounds(0, 350, 800, 250)
    // creating player and enemy
    this.player = this.physics.add.existing(new Player(this, 100, 450, 'dude'))
    this.enemy = this.physics.add.existing(new Enemy(this, 400, 450, 'enemy'))
    // setting the body of the enemy
    this.physics.world.enableBody(this.enemy);
    //this is good to use when using the zoom on the player
    this.cameras.main.startFollow(this.player, true, 0.09, 0.09);
    this.cameras.main.setBounds(0, 0, 800, 600);
    this.cameras.main.setZoom(2);
    this.player.setCollideWorldBounds(true)

    // adding collider effect between the player and the enemy
    this.physics.add.collider(this.player, this.enemy, this.hitEnemy, null, this);

    this.anims.create({
      key: 'idle',
      frames: this.anims.generateFrameNumbers('dude', { frames: [5, 6, 7, 8] }),
      frameRate: 8,
      repeat: -1
    })
    this.anims.create({
      key: 'walk',
      frames: this.anims.generateFrameNumbers('dude', { frames: [0, 1, 2, 3] }),
      frameRate: 8,
      repeat: -1
    })
    this.anims.create({
      key: 'kick',
      frames: this.anims.generateFrameNumbers('dude', { frames: [12] }),
      frameRate: 8,
      repeat: -1,
    })
  }
  update() {
    // making the player to follow the user whe he is alive
    if (this.enemy?.alive) this.enemyFollows(this.enemy)
    if (this.enemy2 !== undefined) {
      if (this.enemy2.alive) this.enemyFollows(this.enemy2)
    }
  }

  hitEnemy(player, bomb) {
    if (this.player.alive === false) {
      this.physics.pause();
      this.player.anims.play('die');
      this.player.setTint(0xff0000);
    }
    if (this.player.anims.currentAnim.key == 'kick') {
      this.damageEnemy(this.enemy);
      this.damageEnemy(this.enemy2);
      if (this.enemy2) {
        if (this.enemy2.alive == false) {
          this.destroySprite(this.enemy2.hp.bar)
          this.destroySprite(this.enemy2)
        }
      }
      // if (this.enemy2) {
      //   if(Phaser.Geom.Intersects.RectangleToRectangle(this.player.getBounds(), this.enemy2.getBounds() )) {
      //     if (this.enemy2.alive) {
      //       this.enemy2.damage(2)
      //       let oneOrZero = (Math.random()>=0.5)? 1 : 0
      //       if (oneOrZero === 1) {
      //         this.enemy2.anims.play('kick');
      //       }
      //       else {
      //         this.enemy2.anims.play('punch');
      //       }
      //     }
      //     else {
      //        this.destroySprite(this.enemy2.hp.bar)
      //         this.destroySprite(this.enemy2)
      //     }
      //   }

      // }
      if (this.enemy.alive === false) {
        this.destroySprite(this.enemy.hp.bar)
        this.destroySprite(this.enemy)
        if (this.enemy2?.alive === false || this.enemy2?.alive === undefined) {
          this.counter += 1
          if (this.counter >= 2) {
            this.physics.pause();
            var config = this.add.bitmapText(320, 330, 'carrier_command', 'level 1 completed', 12);
            var level2 = this.add.bitmapText(320, 370, 'carrier_command', 'start level 2', 12);
            level2.setInteractive({ useHandCursor: true });
            level2.on('pointerdown', () => this.level2());
            return;
          }
          this.enemy = this.physics.add.existing(new Enemy(this, 400, 450, 'enemy'))
          this.enemy2 = this.physics.add.existing(new Enemy(this, 400, 500, 'enemy'))

          this.physics.world.enableBody(this.enemy);
          this.physics.add.collider(this.player, this.enemy, this.hitEnemy, null, this);
          this.physics.add.collider(this.player, this.enemy2, this.hitEnemy, null, this);
        }

      }
    }
    else {
      this.player.damage(2)
    }
  }

  destroySprite(sprite) {
    sprite.destroy();
  }
  enemyFollows(a) {
    this.physics.moveToObject(a, this.player, 50);
  }
  level2() {
    this.estadio.destroy()
    this.scene.start('gameVestiario', {
      character: this.selectedCharacter,
      enemy: this.selectedEnemy
    });
  }
  damageEnemy(enemy) {
    if (!enemy) return
    if (!enemy.alive) return
    if (!Phaser.Geom.Intersects.RectangleToRectangle(this.player.getBounds(), enemy.getBounds())) return
    enemy.damage(2)
    let oneOrZero = (Math.random() >= 0.5) ? 1 : 0
    if (oneOrZero === 1) {
      enemy.anims.play('kick');
    }
    else {
      enemy.anims.play('punch');
    }
  }
}
export default GameScene