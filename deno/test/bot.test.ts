import { Bot } from '../src/bot.ts'
import {
    assertThrows,
    assertEquals,
} from 'https://deno.land/std@0.97.0/testing/asserts.ts'

function createBot(token = 'fake-token') {
    return new Bot(token)
}

Deno.test('should take a token', () => {
    const bot = createBot('fake-token')
    assertEquals(bot.token, 'fake-token')
})

Deno.test('should not take an empty token', () => {
    assertThrows(() => createBot(''))
})
