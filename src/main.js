import Phaser from 'phaser'

import GameParking from './scenes/GameParking'
import GameVestiario from './scenes/GameVestiario'
import Preloader from './scenes/Preloader'
import SelectedCharacter from './scenes/SelectCharacter'

const config = {
	type: Phaser.AUTO,
	width: 800,
	height: 600,
	pixelArt: true,
	autoCenter: true,
	physics: {
		default: 'arcade',
		arcade: {
			gravity: { y: 0 },
			//debug: true
		}
	},
	scene: [Preloader, SelectedCharacter, GameParking, GameVestiario]
}

export default new Phaser.Game(config)