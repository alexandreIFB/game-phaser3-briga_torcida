import Phaser from 'phaser'

import Game from './scenes/Game'
import GameEstacionamento from './scenes/GameEstacionamento'
import GameVestiario from './scenes/GameVestiario'
import Preloader from './scenes/Preloader'
import SelectedCharacter from './scenes/SelectCharacter'

const config = {
	type: Phaser.AUTO,
	width: 800,
	height: 600,
	pixelArt: true,
	physics: {
		default: 'arcade',
		arcade: {
			gravity: { y: 0 },
			debug: true
		}
	},
	scene: [Preloader, SelectedCharacter, Game, GameVestiario, GameEstacionamento]
}

export default new Phaser.Game(config)