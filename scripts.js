const canvas = document.querySelector('canvas')
const c = canvas.getContext('2d')

canvas.width = 1024
canvas.height = 576

const gravity = 2

const globals = {
    screenScroll: {
        left: 250,
        right: 450
    }
}
const framesPerSpriteFrame = 5
let totalFrames = 0

class Player {
    constructor() {
        this.speed = 15,
            this.position = {
                x: globals.screenScroll.left,
                y: 100
            },
            this.velocity = {
                x: 0,
                y: 0
            },
            this.width = 48,
            this.height = 48,
            this.frames = 0,
            this.cropWidth = 48,
            this.sprites = {
                stand: {
                    frames: 4,
                    right: createImage('./images/3 Cyborg/Cyborg_idle.png', 192, 48),
                    left: createImage('./images/3 Cyborg/Cyborg_idle_left.png', 192, 48)
                },
                run: {
                    frames: 6,
                    right: createImage('./images/3 Cyborg/Cyborg_run.png', 288, 48),
                    left: createImage('./images/3 Cyborg/Cyborg_run_left.png', 288, 48)
                },
                jump: {
                    frames: 1,
                    right: createImage('./images/3 Cyborg/Cyborg_jump_oneframe_right.png', 48, 48),
                    left: createImage('./images/3 Cyborg/Cyborg_jump_oneframe_left.png', 48, 48)
                },
                fall: {
                    frames: 1,
                    right: createImage('./images/3 Cyborg/Cyborg_fall_oneframe_right.png', 48, 48),
                    left: createImage('./images/3 Cyborg/Cyborg_fall_oneframe_left.png', 48, 48)
                }
            },
            this.currentSprite = this.sprites.stand.left
        this.currentMaxFrames = this.sprites.stand.frames
    }

    draw() {
        c.drawImage(this.currentSprite,
            this.cropWidth * this.frames, 0, this.cropWidth, 48,
            this.position.x, this.position.y - 36,
            this.width * 1.8, this.height * 1.8)
    }

    update() {
        this.frames += determineSpriteFrames()
        if (this.frames > this.currentMaxFrames - 1) {
            this.frames = 0
        }
        this.draw()
        this.position.x += this.velocity.x
        this.position.y += this.velocity.y
        if (this.position.y + this.height + this.velocity.y <= canvas.height) {
            this.velocity.y += gravity
        }
    }
}

class Platform {
    constructor({ x, y, image }) {
        this.position = {
            x: x,
            y: y
        },
            this.image = image,
            this.width = image.width,
            this.height = image.height
    }

    draw() {
        c.drawImage(this.image, this.position.x, this.position.y)
    }
}

class GenericObject {
    constructor({ x, y, image }) {
        this.position = {
            x: x,
            y: y
        },
            this.image = image,
            this.width = image.width,
            this.height = image.height
    }

    draw() {
        c.drawImage(this.image, this.position.x, this.position.y)
    }
}

function determineSpriteFrames() {
    return (totalFrames % framesPerSpriteFrame === 0)
}

function createImage(imageSrc, w, h) {
    const image = new Image()
    image.src = imageSrc
    image.width = w
    image.height = h
    return image
}
let platformImage = createImage('./images/platform.png', 580, 125)
let platformSmallTallImage = createImage('./images/platformSmallTall.png', 291, 227)
let player = new Player()
let platforms = []
let genericObjects = []

let lastKey = 'right'

const keys = {
    right: {
        pressed: false
    },
    left: {
        pressed: false
    },
    up: {
        pressed: false
    }
}

const fps = 60;

let scrollOffset = 0

function init() {
    platformImage = createImage('./images/platform.png', 580, 125)
    platformSmallTallImage = createImage('./images/platformSmallTall.png', 291, 227)
    player = new Player()
    platforms = [
        new Platform({
            x: platformImage.width * 4 + 300 - 2 + platformImage.width - platformSmallTallImage.width, y: 270, image: platformSmallTallImage
        }),
        new Platform({
            x: -1, y: 470, image: platformImage
        }),
        new Platform({
            x: platformImage.width - 3, y: 470, image: platformImage
        }),
        new Platform({
            x: platformImage.width * 2 + 100, y: 470, image: platformImage
        }),
        new Platform({
            x: platformImage.width * 3 + 300, y: 470, image: platformImage
        }),
        new Platform({
            x: platformImage.width * 4 + 300 - 2, y: 470, image: platformImage
        }),
        new Platform({
            x: platformImage.width * 5 + 800 - 2, y: 470, image: platformImage
        }),
        new Platform({
            x: platformImage.width * 6 + 800 - 4, y: 470, image: platformImage
        }),
        new Platform({
            x: platformImage.width * 7 + 800 - 6, y: 470, image: platformImage
        }),
        new Platform({
            x: platformImage.width * 8 + 800 - 8, y: 470, image: platformImage
        }),
        new Platform({
            x: platformImage.width * 9 + 800 - 10, y: 470, image: platformImage
        }),
        new Platform({
            x: platformImage.width * 10 + 800 - 12, y: 470, image: platformImage
        })
    ]

    genericObjects = [
        new GenericObject({
            x: -1,
            y: -1,
            image: createImage('./images/background.png', 11643, 732)
        }),
        new GenericObject({
            x: -1,
            y: -1,
            image: createImage('./images/hills.png', 7545, 592)
        })
    ]
}

function animate() {
    //requestAnimationFrame(animate)
    setTimeout(() => {
        requestAnimationFrame(animate);
    }, 1000 / fps)
    totalFrames += 1
    c.fillStyle = 'white'
    c.fillRect(0, 0, canvas.width, canvas.height)
    genericObjects.forEach(genericObject => {
        genericObject.draw()
    })
    platforms.forEach((platform) => {
        platform.draw()
    })
    player.update()

    if (keys.right.pressed && player.position.x < globals.screenScroll.right) {
        player.velocity.x = player.speed
    } else if (keys.left.pressed && player.position.x > globals.screenScroll.left) {
        player.velocity.x = -player.speed
    } else {
        player.velocity.x = 0

        if (keys.right.pressed) {
            scrollOffset += player.speed
            platforms.forEach((platform) => {
                platform.position.x -= player.speed
            })
            genericObjects.forEach(genericObject => {
                genericObject.position.x -= player.speed / 2
            })
        } else if (keys.left.pressed && scrollOffset > 0) {
            scrollOffset -= player.speed
            platforms.forEach((platform) => {
                platform.position.x += player.speed
            })
            genericObjects.forEach(genericObject => {
                genericObject.position.x += player.speed / 2
            })
        }
    }

    platforms.forEach((platform) => {
        if (player.position.y + player.height <= platform.position.y &&
            player.position.y + player.height + player.velocity.y >= platform.position.y + 2 &&
            player.position.x + player.width >= platform.position.x &&
            player.position.x <= platform.position.x + platform.width) {
            player.velocity.y = 0
        }
    })

    //Sprite Switching

    //Player movement
    // left right
    if (keys.left.pressed) {
        if (player.currentSprite != player.sprites.run.left) {
            player.frames = 0
            player.currentSprite = player.sprites.run.left
            player.currentMaxFrames = player.sprites.run.frames
        }
    } else if (keys.right.pressed) {
        if (player.currentSprite != player.sprites.run.right) {
            player.frames = 0
            player.currentSprite = player.sprites.run.right
            player.currentMaxFrames = player.sprites.run.frames
        }
    } else {                                                        //not moving horizontally (stand)
        if (player.currentSprite != player.sprites.stand.left && player.currentSprite != player.sprites.stand.right) {
            player.frames = 0
            player.currentMaxFrames = player.sprites.stand.frames
            if (lastKey === 'left') {
                player.currentSprite = player.sprites.stand.left
            } else {
                player.currentSprite = player.sprites.stand.right
            }
        }
    }

    // jumping falling
    if (player.velocity.y !== 0) {
        if (player.velocity.y < 0) {                            //player is rising (jump)
            if (player.velocity.x < 0 || (player.velocity.x === 0 && player.position.x === globals.screenScroll.left)) {
                if (player.currentSprite != player.sprites.jump.left) {
                    player.frames = 0
                    player.currentSprite = player.sprites.jump.left
                    player.currentMaxFrames = player.sprites.jump.frames
                }
            } else if (player.velocity.x > 0 || (player.velocity.x === 0 && player.position.x === globals.screenScroll.right)) {
                if (player.currentSprite != player.sprites.jump.right) {
                    player.frames = 0
                    player.currentSprite = player.sprites.jump.right
                    player.currentMaxFrames = player.sprites.jump.frames
                }
            }
        } else {                                                //player is falling (fall)
            if (player.velocity.x < 0 || (player.velocity.x === 0 && player.position.x === globals.screenScroll.left)) {
                if (player.currentSprite != player.sprites.fall.left) {
                    player.frames = 0
                    player.currentSprite = player.sprites.fall.left
                    player.currentMaxFrames = player.sprites.fall.frames
                }
            } else if (player.velocity.x > 0 || (player.velocity.x === 0 && player.position.x === globals.screenScroll.right)) {
                if (player.currentSprite != player.sprites.fall.right) {
                    player.frames = 0
                    player.currentSprite = player.sprites.fall.right
                    player.currentMaxFrames = player.sprites.fall.frames
                }
            }
        }
    }

    //win condition
    if (scrollOffset > platformImage.width * 10 + 800 - 12) {
        console.log('you win!')
    }

    //lose condition
    if (player.position.y > canvas.height) {
        console.log('you lose!')
        init()
    }
}

init()
animate()


//EVENT LISTENERS
window.addEventListener('keydown', ({ key }) => {
    switch (key) {
        case "a":
            keys.left.pressed = true
            lastKey = 'left'
            break
        case "s":
            break
        case "d":
            keys.right.pressed = true
            lastKey = 'right'
            break
        case "w":
            keys.up.pressed = true
            lastKey = 'up'
            player.velocity.y -= 28
            break
    }
})
window.addEventListener('keyup', ({ key }) => {
    switch (key) {
        case "a":
            keys.left.pressed = false
            break
        case "s":
            break
        case "d":
            keys.right.pressed = false
            break
        case "w":
            keys.up.pressed = false
            break
    }
}) 