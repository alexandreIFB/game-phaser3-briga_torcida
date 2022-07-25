import Enemy from "../persons/Enemy"
import Player from "../persons/Player"

class TesteTile extends Phaser.Scene {
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
  contEnemys

  sx = 0;
  mapWidth = 25;
  mapHeight = 1;
  health;
  punch;
  TrashLayer;

  constructor() {
    super({ key: 'testeTile' })
  }
  init(data) {
    this.selectedCharacter = data.character
    this.selectedEnemy = data.enemy
    this.health = this.physics.add.staticGroup()
    this.punch = this.physics.add.staticGroup()

    console.log(this.selectedCharacter)
    this.fullWidth = 200
    this.cursors = this.input.keyboard.createCursorKeys();
    this.keyA = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.A);
    this.keyS = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.S);
    this.keyD = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.D);
    this.keyW = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.W);
  }

  createAnimsEnemyAndPlayer() {
    this.anims.create({
      key: 'die',
      frames: this.anims.generateFrameNumbers('dude', { frames: [35, 36, 37] }),
      frameRate: 8,
    });
    this.anims.create({
      key: 'win',
      frames: this.anims.generateFrameNumbers('dude', { frames: [30, 31] }),
      frameRate: 8,
      repeat: -1,
      repeatDelay: 2000
    });
    this.anims.create({
      key: 'idle',
      frames: this.anims.generateFrameNumbers('dude', { frames: [5, 6, 7, 8] }),
      frameRate: 8,
      // repeat: -1,
      repeatDelay: 2000
    })
    this.anims.create({
      key: 'walk',
      frames: this.anims.generateFrameNumbers('dude', { frames: [0, 1, 2, 3] }),
      frameRate: 8,
      repeat: -1
    })
    this.anims.create({
      key: 'kick',
      frames: this.anims.generateFrameNumbers('dude', { frames: [10, 11, 12, 13, 10] }),
      frameRate: 8,
      // repeat: -1,
      repeatDelay: 2000
    })
    this.anims.create({
      key: 'punch',
      frames: this.anims.generateFrameNumbers('dude', { frames: [15, 16, 17, 18, 17, 15] }),
      frameRate: 8,
      // repeat: -1,
      repeatDelay: 2000
    });
    this.anims.create({
      key: 'kick_enemy',
      frames: this.anims.generateFrameNumbers('enemy', { frames: [10, 11, 12, 13, 10] }),
      frameRate: 5,
      // repeat: -1,
      repeatDelay: 20000
    })
    this.anims.create({
      key: 'punch_enemy',
      frames: this.anims.generateFrameNumbers('enemy', { frames: [15, 16, 17, 18, 17, 15] }),
      frameRate: 5,
      // repeat: -1,
      repeatDelay: 2000
    });
    this.anims.create({
      key: 'walk_enemy',
      frames: this.anims.generateFrameNumbers('enemy', { frames: [0, 1, 2, 3] }),
      frameRate: 2,
      repeat: -1
    })
  }


  createMap() {


    const map = this.make.tilemap({ key: "map" });
    const tileset = map.addTilesetImage('map', "tiles");


    const ChaoLayer = map.createLayer("chao", tileset);
    this.TrashLayer = map.createLayer("trash", tileset).setCollision([60, 61, 62, 63, 64, 65, 66])

    //const debugGraphics = this.add.graphics().setAlpha(0.75);
    // this.TrashLayer.renderDebug(debugGraphics, {
    //   tileColor: null, // Color of non-colliding tiles
    //   collidingTileColor: new Phaser.Display.Color(243, 134, 48, 255), // Color of colliding tiles
    //   faceColor: new Phaser.Display.Color(40, 39, 37, 255) // Color of colliding face edges
    // });
    const ParedeLayer = map.createLayer("parede", tileset);
    const ArmarioLayer = map.createLayer("armario", tileset)

    const HealthLayer = map.getObjectLayer('LifeLayer')['objects'];
    const PunchLayer = map.getObjectLayer('PunchLayer')['objects'];



    HealthLayer.forEach(object => {
      let obj = this.health.create(object.x, object.y, "health");
      obj.setScale(object.width / 32, object.height / 32);
      obj.setOrigin(0);
      obj.body.width = object.width;
      obj.body.height = object.height;
    });

    PunchLayer.forEach(object => {
      let obj = this.punch.create(object.x, object.y, "punch");
      obj.setScale(object.width / 32, object.height / 32);
      obj.setOrigin(0);
      obj.body.width = object.width;
      obj.body.height = object.height;
    });

  }

  collectLife(player, healh) {
    healh.destroy(healh.x, healh.y); // remove the tile/coin
    player.cura(10);
    return false;
  }

  collectPunch(player, punch) {
    punch.destroy(punch.x, punch.y); // remove the tile/coin
    player.upDamage()
    return false;
  }

  preload() {
    this.load.spritesheet('enemy', `images/player/${this.selectedEnemy}.png`, { frameWidth: 48, frameHeight: 48 })
    this.load.spritesheet('dude', `images/player/${this.selectedCharacter}.png`, { frameWidth: 48, frameHeight: 48 })
    this.load.image('tiles', 'cenario/map.png')
    this.load.tilemapCSV('map_chao', 'cenario/definitivo_chao.csv')
    this.load.tilemapCSV('map_armario', 'cenario/definitivo_armario.csv')
    this.load.tilemapCSV('map_parede', 'cenario/definitivo_parede.csv')
    this.load.tilemapCSV('map_life', 'cenario/definitivo_life.csv')
    this.load.image("health", "cenario/health.png");
    this.load.image("punch", "cenario/punch.png");
    this.load.tilemapTiledJSON("map", "cenario/definitivo.json");
  }
  create() {

    this.createAnimsEnemyAndPlayer()

    this.createMap()

    this.input.setDefaultCursor('url(assets/images/healthBar/cursor_pointerFlat_shadow.png), pointer')

    this.physics.world.setBounds(0, 0, 2400, 600);

    //layer.skipCull = true;

    // make the player to not go to other areas
    //this.physics.world.setBounds(0, 350, 800, 250)
    // creating player and enemy
    this.player = this.physics.add.existing(new Player(this, 100, 450, 'dude'))

    this.enemy = this.newSprite(400, 450)
    this.contEnemys = 1;
    this.killEnemys = 0;
    // setting the body of the enemy
    this.physics.world.enableBody(this.player);
    this.physics.world.enableBody(this.enemy);
    this.player.setCollideWorldBounds(true)
    this.player.setImmovable();
    this.physics.add.overlap(this.player, this.health, this.collectLife, null, this)
    this.physics.add.overlap(this.player, this.punch, this.collectPunch, null, this)
    this.physics.add.collider(this.player, this.TrashLayer, () => (console.log('entrei aq')))


    //--- this.physics.world.setBounds(0, 260, 800, 340)
    //this is good to use when using the zoom on the player
    this.cameras.main.startFollow(this.player, true, 0.32, 0.32);
    this.cameras.main.setBounds(0, 0, 2400, 600);
    //this.cameras.main.setZoom(2);


    // adding collider effect between the player and the enemy
    this.physics.add.collider(this.player, this.enemy, () => this.hitPlayer(this.enemy));
  }

  hitPlayer(enemy) {
    //console.log('entrei')
    //let oneOrZero = 2;
    let oneOrZero = (Math.random() >= 0.5) ? 1 : 0
    if (oneOrZero === 1 && !(enemy.kickActive)) {
      enemy.kickActive = true
      enemy.anims.play('kick_enemy');
    } else if (!enemy.kickActive) {
      enemy.kickActive = true
      enemy.anims.play('punch_enemy');
    }
  }

  addText() {
    this.add.bitmapText(320, 330, 'carrier_command', 'level 2 completed', 12)
  }

  update() {
    if (this.enemy?.alive) this.enemyFollows(this.enemy)
    if (this.enemy2 !== undefined) {
      if (this.enemy2.alive) this.enemyFollows(this.enemy2)
    }
  }

  destroySprite(sprite) {
    sprite.hp.bar.destroy()
    sprite.destroy();
  }
  enemyFollows(a) {
    this.physics.moveToObject(a, this.player, 100)
  }
  level3() {
    //this.corredor.destroy()
    this.scene.start('gameEstacionamento', {
      character: this.selectedCharacter,
      enemy: this.selectedEnemy
    });
  }

  newSprite(x, y, scale = 3) {
    let enemy = this.physics.add.existing(new Enemy(this, x, y, 'enemy'))
    this.physics.world.enableBody(enemy);
    this.physics.add.collider(this.player, enemy, () => this.hitPlayer(enemy));
    enemy.setScale(scale)
    return enemy
  }

  damageEnemy(enemy, damage) {
    if (!enemy) return
    if (!enemy.alive) return
    if (!Phaser.Geom.Intersects.RectangleToRectangle(this.player.getBounds(), enemy.getBounds())) return

    enemy.damage(damage)

    if (!enemy.alive) {
      this.destroySprite(enemy);
      this.killEnemys = this.killEnemys + 1;
      if (this.contEnemys === 1) {
        this.enemy = this.newSprite(350, 500)
        this.enemy2 = this.newSprite(400, 500, 5)
        this.contEnemys = this.contEnemys + 2;
      }
      if (this.killEnemys === this.contEnemys) {
        this.physics.pause();
        this.player.anims.play('win')
        this.player.win = true;
        var config = this.add.bitmapText(320, 330, 'carrier_command', 'level 2 completed', 12);
        var level2 = this.add.bitmapText(320, 370, 'carrier_command', 'start level 3', 12);
        level2.setInteractive({ useHandCursor: true });
        level2.on('pointerdown', () => this.level3());
        return;
      }
      return
    }
  }

  damagePlayer(player, enemy, damage) {
    if (!player) return
    if (!player.alive) return
    if (!Phaser.Geom.Intersects.RectangleToRectangle(enemy.getBounds(), player.getBounds())) return
    if (player.anims.currentAnim.key === 'idle') return
    player.damage(damage)
  }
}

export default TesteTile