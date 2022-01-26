import words from 'static/words.json'

export default function getRandomWords(quantity = 50): string[][] {
  const visited = new Set<number>()
  const w: string[][] = []

  do {
    let idx: number

    do {
      idx = Math.floor(Math.random() * words.length)
    } while (visited.has(idx))

    visited.add(idx)
    w.push(words[idx].split(''))
  } while (w.length < quantity)

  return w
}
