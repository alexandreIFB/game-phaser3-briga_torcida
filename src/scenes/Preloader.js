import Phaser from 'phaser'


export default class Preloader extends Phaser.Scene {
  constructor() {
    super('preloader')
  }


  times = ["atletico_mineiro", "corinthians", "cruzeiro", "flamengo", "fluminense", "gremio", "internacional", "palmeiras"]
  timeIndex = 0

  init() {
    this.selectedCharacter = 'boneco_flamengo'
  }

  preload() {
    this.load.bitmapFont('carrier_command', 'fonts/carrier_command.png', 'fonts/carrier_command.xml');
    this.load.image('sky', 'cenario/sky.png');
    this.times.map((time) => {
      this.load.spritesheet(`boneco_${time}`, `images/player/${time}.png`, { frameWidth: 48, frameHeight: 48 })
    })
    this.load.image('estadio', 'cenario/estadio.png')
    this.load.image('estacionamento', 'cenario/estacionamento.jpg')
    this.load.image('corredor', 'cenario/corredor.png')
    this.load.image('ground', 'cenario/platform.png')

  }

  create() {
    this.scene.start('selectedCharacter')
  }
}