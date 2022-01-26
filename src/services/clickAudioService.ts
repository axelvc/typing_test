function getIdx(min: number, max: number) {
  return Math.floor(Math.random() * (max - min) + min)
}

const makeAudio = (name: string, variants: number) => () => {
  const audio = new Audio(`audios/${name}/${name}${getIdx(1, variants)}.wav`)

  audio.volume = 0.5
  audio.play()
}

export const click = makeAudio('click', 8)
export const space = makeAudio('space', 7)
export const error = makeAudio('error', 5)
