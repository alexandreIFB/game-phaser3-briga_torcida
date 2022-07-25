class SelectedCharacter extends Phaser.Scene {
  cody
  sky
  constructor() {
    super({ key: 'selectedCharacter' })
  }


  times = ["atletico_mineiro", "corinthians", "cruzeiro", "flamengo", "fluminense", "gremio", "internacional", "palmeiras"]
  timeIndex = 0
  create() {
    this.sky = this.add.sprite(400, 300, 'sky');
    this.input.setDefaultCursor('url(assets/images/healthBar/cursor_pointerFlat_shadow.png), pointer');

    this.cody = this.criaAnimacaoTime(this.times[0], null)
    this.cody.setScale(8);
    this.cody.play(`walk_${this.times[0]}`);


    // Titulo Game
    var bmpText = this.add.bitmapText(300, 100, 'carrier_command', 'Briga de times', 12);

    // Texto de start
    this.start = this.add.bitmapText(300, 160, 'carrier_command', 'comecar', 12);

    // Config Menu Texto
    var config = this.add.bitmapText(300, 200, 'carrier_command', 'configuracao (em construcao)', 12);

    // Muda Time texto
    var mudatime = this.add.bitmapText(300, 240, 'carrier_command', 'mudar time', 12);

    config.setInteractive({ useHandCursor: true })
    this.start.setInteractive({ useHandCursor: true });
    this.start.on('pointerdown', () => this.onStarClick());
    mudatime.setInteractive({ useHandCursor: true });
    mudatime.on('pointerdown', () => this.mudaTime());
  }

  onStarClick() {
    this.sky.destroy()
    this.scene.start('gameVestiario', {
      character: this.times[this.timeIndex],
      enemy: this.timeIndex === 8 ?
        this.times[0] :
        this.times[this.timeIndex + 1]
    });
  }
  mudaTime() {
    this.timeIndex = this.timeIndex + 1
    if (this.timeIndex == 8) this.timeIndex = 0
    this.cody = this.criaAnimacaoTime(this.times[this.timeIndex], this.cody)
    this.cody.setScale(8);
    this.cody.play(`walk_${this.times[this.timeIndex]}`);
  }
  criaAnimacaoTime(time, oldSprite) {
    if (oldSprite) {
      oldSprite.destroy()
    }
    this.anims.create({
      key: `walk_${time}`,
      frames: this.anims.generateFrameNumbers(`boneco_${time}`, { frames: [0, 1, 2, 3] }),
      frameRate: 8,
      repeat: -1
    });

    const cody = this.add.sprite(600, 370, `boneco_${time}`);
    return cody;
  }
}

export default SelectedCharacter;