const canvas = document.querySelector('canvas')
const c = canvas.getContext('2d')

canvas.width = 1024
canvas.height = 576

const gravity = 0.35

class Player {
    constructor() {
        this.position = {
            x: 100,
            y: 100
        }
        this.velocity = {
            x: 0,
            y: 0
        },
            this.width = 30
        this.height = 30
    }

    draw() {
        c.fillStyle = 'red'
        c.fillRect(this.position.x, this.position.y, this.width, this.height)
    }

    update() {
        this.draw()
        this.position.x += this.velocity.x
        this.position.y += this.velocity.y
        if (this.position.y + this.height + this.velocity.y <= canvas.height) {
            this.velocity.y += gravity
        } else {
            this.velocity.y = 0
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
            console.log(image.width)
        this.width = image.width,
            console.log(image.height)
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
            console.log(image.width)
        this.width = image.width,
            console.log(image.height)
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
const platformImage = createImage('./images/platform.png', 580, 125)
const player = new Player()
const platforms = [
    new Platform({
        x: -1, y: 470, image: platformImage
    }),
    new Platform({
        x: platformImage.width - 3, y: 470, image: platformImage
    })
]

const genericObjects = [new GenericObject({
    x: 0,
    y: 0,
    image: createImage('./images/background.png', 11643, 732)
})]

const keys = {
    right: {
        pressed: false
    },
    left: {
        pressed: false
    }
}

let scrollOffset = 0

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
        player.velocity.x = 4
    } else if (keys.left.pressed && player.position.x > 100) {
        player.velocity.x = -4
    } else {
        player.velocity.x = 0

        if (keys.right.pressed) {
            scrollOffset += 4
            platforms.forEach((platform) => {
                platform.position.x -= 4
            })
        } else if (keys.left.pressed) {
            scrollOffset -= 4
            platforms.forEach((platform) => {
                platform.position.x += 4
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

    if (scrollOffset > 2000) {
        console.log('you win!')
    }
}

animate()


//EVENT LISTENERS
window.addEventListener('keydown', ({ key }) => {
    switch (key) {
        case "a":
            console.log('left')
            keys.left.pressed = true
            break
        case "s":
            console.log('down')
            break
        case "d":
            console.log('right')
            keys.right.pressed = true
            break
        case "w":
            console.log('up')
            player.velocity.y -= 15
            break
    }
})
window.addEventListener('keyup', ({ key }) => {
    switch (key) {
        case "a":
            console.log('left')
            keys.left.pressed = false
            break
        case "s":
            console.log('down')
            break
        case "d":
            console.log('right')
            keys.right.pressed = false
            break
        case "w":
            console.log('up')
            break
    }
}) 