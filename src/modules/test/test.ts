import { ConflictException } from "@nestjs/common"

function divide (num1: number, num2: number): number {
    if (num2 == 0 ) throw new ConflictException("0 ga bo'lish mumkin emas")
    return num1 / num2
}

export default divide;