const game = {}
const ui = document.getElementById('ui')
const playBtn = document.getElementById('play')

function main() {
  const game = initGame()
  const player = initPlayer(game)
  game.player = player;

  drawBg()
  drawGame(game)
  generateObstacles(game)

  return game
}

document.addEventListener('keypress', function(e) {
  if (e.charCode === 100 || e.charCode === 54) {
    // RIGHT
  } else if (e.charCode === 97 || e.charCode === 52) {
    // LEFT

  } else if (e.charCode === 119 || e.charCode === 56) {
    // UP
    if (game.player.isJumping) return
    game.player.isJumping = true
    game.player.goUp = true
  } else if (e.charCode === 115 || e.charCode === 50) {
    // DOWN
    if (!game.player.isJumping) return
    game.player.isJumping = true
    game.player.goUp = false
    game.player.speed = game.player.speed_max
  }
})

playBtn.addEventListener('click', function(e) {
  Object.assign(game, main())
  ui.hidden = true
})