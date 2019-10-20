let WINDOW = {
    width: 800,
    height: 600,
    padding: 15
}

let GAME_CONST = {
    ship_speed: 500,
    background_speed: 10,
    aceleration: 0.03,
    rotation: 0.2,
    time_dist_trash: 750,
    BAR_LENGTH: 200
}

let config = {
    type: Phaser.AUTO,
    width: WINDOW.width,
    height: WINDOW.height,
    physics: {
        default: 'arcade',
        arcade: { debug: false }
    },
    scene: {
        preload: preload,
        create: create,
        update: update
    }
}

const PLAYER_SIZE_X = 5


let game = new Phaser.Game(config)

let background
let player
let cursors
let lastFired = 0
let scoreText
let speedText
let score = 0
let progressBar
let progressBox


function preload() {
    this.load.image('background', 'starfield.png')
    this.load.image('player', 'nave1.png')
    this.load.image('trash', 'metal.png')
}

function colisionEvent(player, trash) {
    score++
    trash.destroy()
}

function create() {
    // define background
    background = this.add.tileSprite(WINDOW.width - 400, WINDOW.height - 300, WINDOW.width, WINDOW.height, 'background')

    // define textos na tela
    this.scoreText = this.add.text(16, 16, 'Score: 0', { color: '#ffffff', fontSize: '24px' })
    this.scoreText.setText('Score: 0')
    this.speedText = this.add.text(16, 50, 'Speed(mph): 0', { color: '#ffffff', fontSize: '24px' })
    this.speedText.setText('Speed(mph): 0')

    // define player
    player = this.physics.add.sprite(400, 550, 'player')
    player.scaleX = (0.4)
    player.scaleY = (0.4)

    cursors = this.input.keyboard.createCursorKeys()
    speed = Phaser.Math.GetSpeed(GAME_CONST.ship_speed, 1)

    var Trash = new Phaser.Class({

        Extends: Phaser.GameObjects.Image,

        initialize:

            function Trash(scene) {
                Phaser.GameObjects.Image.call(this, scene, 0, 0, 'trash')

                this.speed = Phaser.Math.GetSpeed(400, 1)
            },

        move: function (x, y) {
            this.setPosition(x, y - 50)

            this.setActive(true)
            this.setVisible(true)
        },

        update: function (time, delta) {
            this.y += this.speed * delta

            if (this.y > WINDOW.height) {
                this.setActive(false)
                this.setVisible(false)
            }
        }

    })

    trashes = this.physics.add.group({
        key: 'trash',
        classType: Trash,
        maxSize: 10,
        runChildUpdate: true
    })
    this.physics.add.collider(player, trashes, colisionEvent, null, this);

}

function update(time, delta) {
    // mover esquerda
    if (cursors.left.isDown && (player.x - (0.2 * player.width)) >= 0) {
        player.x -= speed * delta
        player.rotation -= GAME_CONST.rotation
    }
    // mover direita
    else if (cursors.right.isDown && (player.x + (0.2 * player.width)) <= WINDOW.width) {
        player.x += speed * delta
        player.rotation += GAME_CONST.rotation

    }
    // gerar lixos
    if (GAME_CONST.background_speed != 0 && time > lastFired) {
        var trash = trashes.get()
        if (trash) {
            let x = Math.random() * (WINDOW.width)
            trash.move(x, 0)

            lastFired = time + GAME_CONST.time_dist_trash
        }
    }

    // atualizar velocidade do scroll do background
    if (GAME_CONST.background_speed > 0)
        GAME_CONST.background_speed -= GAME_CONST.aceleration
    else
        GAME_CONST.background_speed = 0

    background.tilePositionY -= GAME_CONST.background_speed

    // atualiza textos
    this.scoreText.setText('Score: ' + score)
    this.speedText.setText('Speed(mph): ' + GAME_CONST.background_speed.toFixed(1))
}
