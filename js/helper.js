/**
 * @name drawBg
 * @desc draw game bg
 */
function drawBg() {
  const canvas = document.getElementById('bg');
  const ctx = canvas.getContext('2d');

  if (!ctx) {
    console.error('no support');
    return
  }

  const img = new Image()
  img.onload = () => {
    // ctx.drawImage(img, 0, canvas.height - 30, canvas.width, 30);
    ctx.drawImage(img, 0, 40, canvas.width, canvas.height);
  }
  // img.src = '../img/bg/grass.png'
  img.src = '../img/bg/treadmill-2.png'
}

/**
 * @name initGame
 * @desc create game object with canvas nad default values
 */
function initGame() {
  const game = {};
  const canvas = document.getElementById('game')
  const ctx = canvas.getContext('2d')
  ctx.save();

  if (!ctx) {
    console.error('no support')
    return
  }

  game.canvas = canvas
  game.ctx = ctx
  game.score = 0
  game.playing = true
  game.obstacles = []

  return game
}

/**
 * @name initPlayer
 * @desc create player img and specs and return
 */
function initPlayer(game) {
  const img = new Image()
  img.src = '../img/characters/ivan_filipovic.png'

  const player = {
    img,
    goUp: false,
    isJumping: false,
    x: 20,
    y: game.canvas.height - 170,
    jump: 0,
    jump_max: 130,
    speed: 8,
    speed_default: 8,
    speed_max: 10,
    width: 80,
    height: 160
  }

  return player
}

/**
 * @name drawGame
 * @desc clear canvas and draw game on every frame
 * @param game - obj
 */
function drawGame(game) {
  if (!game.playing) {
    return false
  }
  game.ctx.restore()
  game.ctx.clearRect(0, 0, game.canvas.width, game.canvas.height)

  checkJump(game)
  checkObstacles(game)
  drawScore(game)
  game.id = window.requestAnimationFrame(drawGame.bind(this, game))
}

/**
 * @name generateObstacles
 * @desc generate randomly obstacles evenry 2+s
 * @param game - obj
 */
function generateObstacles(game) {
  setInterval(() => {
    setTimeout(() => {
      game.obstacles.push(createObstacle(game))
    }, Math.round(Math.random() * 1000))
  }, 2000)
}

/**
 * @name createObstacle
 * @desc draw obstacle on screen and make them charge player
 * @param game - obj
 */
function createObstacle(game) {
  const img = new Image()
  img.src = '../img/obstacles/burger-1.png'

  const obstacle = {
    img,
    x: game.canvas.width,
    y: game.canvas.height - 58,
    width: 56,
    height: 48,
    speed_default: 4,
    points: 10,
  }
  return obstacle
}

/**
 * @name checkJump
 * @desc check if player is jumping
 * @param player - obj
 */
function checkJump(game) {
  const { player, ctx, canvas } = game;

  if (player.isJumping) {
    const jumpStart = player.jump_max / 2;
    const jumpMid = player.jump_max / 1.5;
    if (player.goUp) {

      if (player.jump <= jumpStart) {
        // player in 1/3 of jump
        player.jump += player.speed
      } else if (player.jump > jumpStart && player.jump < jumpMid) {
        // player in between 1/3 and 2/3
        player.jump += player.speed / 1.75
      } else {
        // player above 2/3 of jump
        player.jump += player.speed / 2
      }

      player.goUp = player.jump > player.jump_max ? false : true
    } else {
      if (player.jump <= jumpStart) {
        // player in 1/3 of jump
        player.jump -= player.speed
      } else if (player.jump > jumpStart && player.jump < jumpMid) {
        // player in between 1/3 and 2/3
        player.jump -= player.speed / 1.25
      } else {
        // player above 2/3 of jump
        player.jump -= player.speed / 1.5
      }

      player.goUp = player.jump <= 0 ? true : false
      player.isJumping = player.jump <= 0 ? false : true
      player.speed = player.jump <= 0 ? player.speed_default : player.speed
    }
  }

  drawImg(ctx, player.img, player.x, player.y - player.jump, player.width, player.height)
}

/**
 * @name checkObstacles
 * @desc check if obstacles are in the view
 * @param game
 */
function checkObstacles(game) {
  const { obstacles, player } = game
  obstacles.forEach((obstacle, i) => {
    if (isColision(obstacle, player)) {
      console.log('hit')
      console.log(game.score);
      game.playing = false
      window.cancelAnimationFrame(game.id)
      ui.hidden = false
    } else {
      if (obstacle.x > -10) {
        drawImg(game.ctx, obstacle.img, obstacle.x -= obstacle.speed_default, obstacle.y, obstacle.width, obstacle.height)
      } else {
        obstacles.splice(i, 1)
        game.score += 10
      }
    }
  })
}

/**
 * @name isColision
 * @desc check if obstacle is hitting the player
 * @param obstacle - obj, player - obj
 */
function isColision(obstacle, player) {
  if (obstacle.x >= (player.x) &&
    obstacle.x <= (player.x + player.width) &&
    ((player.y + player.height) - player.jump) > obstacle.y) {
    return true
  }
  return false
}

/**
 * @name drawImg
 * @desc draw images on canvas
 * @param ctx, img, x, y, xx, yy
 */
function drawImg(ctx, img, x, y, xx, yy) {
  if (xx && yy) {
    ctx.drawImage(img, x, y, xx, yy)
  } else {
    ctx.drawImage(img, x, y)
  }
}

/**
 * @name drawScore
 * @desc draw score and personal best on screen
 * @param game - obj
 */
function drawScore(game) {
  const score = document.getElementById('score')
  score.innerText = game.score;
}