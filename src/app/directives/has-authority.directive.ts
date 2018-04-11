/**
 * Created by Kingsley Ezeokeke on 3/12/2018.
 */

import {Directive, Input, TemplateRef, ViewContainerRef} from "@angular/core";
import {AuthService} from "../components/auth/auth.service";
import {MessageService} from "../service/message.service";
@Directive({
    selector: '[hasAuthority]'
})

export class HasAuthorityDirective {
    private roles:string[];

    constructor(private authService:AuthService,
                private templateRef:TemplateRef<any>,
                private viewContainerRef:ViewContainerRef,
                private mService:MessageService) {

        this.mService.getSelectedOrg()
            .subscribe(
                result => {
                    if(result) {
                        this.updateView();
                    }
                }
            )
    }

    @Input()
    set hasAuthority(value:string|string[]) {
            this.roles = typeof value === 'string' ? [<string> value] : <string[]> value;
            this.updateView();
    }

    private updateView():void {
            this.authService.hasAnyAuthority(this.roles).then(result => {
                this.viewContainerRef.clear();
                if (result) {
                    this.viewContainerRef.createEmbeddedView(this.templateRef);
                }
            })
    }
}
