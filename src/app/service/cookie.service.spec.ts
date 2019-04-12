import {CookieService} from "./cookie.service";
import {TestBed} from "@angular/core/testing";

describe('CookieService', () => {
    beforeEach(() => TestBed.configureTestingModule({
        providers: [CookieService]
    }));

    it('should be created', () => {
        const service: CookieService = TestBed.get(CookieService);
        expect(service).toBeTruthy();
    });

    it('get the contents of a key set in cookie', () => {
        const service: CookieService = TestBed.get(CookieService);

        service.set("test", "text");
        expect(service.get("test")).toEqual("text");
    })

    it('should delete the contents of a key set in cookie', () => {
        const service: CookieService = TestBed.get(CookieService);

        service.set("test", "text");
        expect(service.get("test")).toEqual("text");

        service.delete("test");
        expect(service.get("test")).toEqual('');
    })

    it('should check if key exists in cookie', () => {
        const service: CookieService = TestBed.get(CookieService);

        expect(service.check("test")).toEqual(false);

        service.set("test", "text");
        expect(service.check("test")).toEqual(true);
    })
});
