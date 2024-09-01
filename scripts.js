const canvas = document.querySelector('canvas')
const c = canvas.getContext('2d')

canvas.width = 1024
canvas.height = 576

const gravity = 0.35

class Player {
    constructor() {
        this.speed = 4,
            this.position = {
                x: 100,
                y: 100
            }
        this.velocity = {
            x: 0,
            y: 0
        },
            this.width = 66,
            this.height = 150,
            this.image = createImage('./images/spriteStandRight.png', 10620, 400),
            this.frames = 0,
            this.sprites = {
                stand: {
                    cropWidth: 177,
                    width: 66,
                    right: createImage('./images/spriteStandRight.png', 10620, 400),
                    left: createImage('./images/spriteStandLeft.png', 10620, 400)
                },
                run: {
                    cropWidth: 341,
                    width: 127.875,
                    right: createImage('./images/spriteRunRight.png', 10230, 400),
                    left: createImage('./images/spriteRunLeft.png', 10230, 400)
                }
            },
            this.currentSprite = this.sprites.stand.right
            this.currentCropWidth = 177
    }

    draw() {
        c.drawImage(this.currentSprite,
            this.currentCropWidth * this.frames, 0, this.currentCropWidth, 400,
            this.position.x, this.position.y,
            this.width, this.height)
    }

    update() {
        this.frames += 1
        if (this.frames > 59 && (this.currentSprite === this.sprites.stand.right || this.currentSprite === this.sprites.stand.left)) {
            this.frames = 0
        } else if (this.frames > 29 && (this.currentSprite === this.sprites.run.right || this.currentSprite === this.sprites.run.left))
             {
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

let lastKey

const keys = {
    right: {
        pressed: false
    },
    left: {
        pressed: false
    }
}

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
    requestAnimationFrame(animate)
    c.fillStyle = 'white'
    c.fillRect(0, 0, canvas.width, canvas.height)
    genericObjects.forEach(genericObject => {
        genericObject.draw()
    })
    platforms.forEach((platform) => {
        platform.draw()
    })
    player.update()

    if (keys.right.pressed && player.position.x < 400) {
        player.velocity.x = player.speed
    } else if ((keys.left.pressed && player.position.x > 100) ||
        (keys.left.pressed && scrollOffset === 0 && player.position.x > 0)) {
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
            player.position.y + player.height + player.velocity.y >= platform.position.y &&
            player.position.x + player.width >= platform.position.x &&
            player.position.x <= platform.position.x + platform.width) {
            player.velocity.y = 0
        }
    })

    //sprite switching
    if (keys.right.pressed && lastKey === 'right' && player.currentSprite != player.sprites.run.right) {
        player.frames = 1
        player.currentSprite = player.sprites.run.right
        player.currentCropWidth = player.sprites.run.cropWidth
        player.width = player.sprites.run.width
    } else if (keys.left.pressed && lastKey === 'left' && player.currentSprite != player.sprites.run.left) {
        player.frames = 1
        player.currentSprite = player.sprites.run.left
        player.currentCropWidth = player.sprites.run.cropWidth
        player.width = player.sprites.run.width
    } else if (!keys.left.pressed && lastKey === 'left' && player.currentSprite != player.sprites.stand.left) {
        player.frames = 1
        player.currentSprite = player.sprites.stand.left
        player.currentCropWidth = player.sprites.stand.cropWidth
        player.width = player.sprites.stand.width
    } else if (!keys.right.pressed && lastKey === 'right' && player.currentSprite != player.sprites.stand.right) {
        player.frames = 1
        player.currentSprite = player.sprites.stand.right
        player.currentCropWidth = player.sprites.stand.cropWidth
        player.width = player.sprites.stand.width
    } 

    //win condition
    if (scrollOffset > platformImage.width * 5 + 800 - 2) {
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
            player.velocity.y -= 15
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
            break
    }
}) 