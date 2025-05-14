import { ConflictException } from "@nestjs/common";
import divide from "./test"

describe("DIVIDE fn", () => {
    it("4 ni 2 ga bo'lish", () => {
        const res = divide(4, 2);

        // expect(divide).toHaveBeenCalled();
        expect(res).toBe(2);
    })

    test("sonni 0 ga bo'lish", ()=> {
       try {
        divide(4,0);
       } catch (error) {
        
           expect(error).toBeInstanceOf(ConflictException)
           expect(error.message).toBe("0 ga bo'lish mumkin emas")
       }
    })
})