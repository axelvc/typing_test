/* eslint-disable import/prefer-default-export */
import '@testing-library/jest-dom'
import 'jest-styled-components'
import { vi } from 'vitest'
import '../__mocks__/zustand'

global.HTMLAudioElement.prototype.play = vi.fn()
