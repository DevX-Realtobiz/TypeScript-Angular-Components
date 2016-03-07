import * as ng from 'angular';
import * as bootstrapModalDialog from './bootstrapModalDialog/bootstrapModalDialog.module';
export { bootstrapModalDialog };
export declare var moduleName: string;
export declare var serviceName: string;
export interface IDialogCloseHandler {
    (explicit: boolean): boolean;
}
export interface IDialogInstance {
    close(): void;
    dismiss(): void;
}
export interface IDialogImplementation<TDialogSettings> {
    open(options: TDialogSettings, closeHandler?: IDialogCloseHandler): IDialogInstance;
}
export interface IDialogService<TDialogSettings> {
    open(options: TDialogSettings, closeHandler?: IDialogCloseHandler): IDialogInstance;
}
export declare class DialogService<TDialogSettings> implements IDialogService<TDialogSettings> {
    private dialog;
    constructor(dialog: IDialogImplementation<TDialogSettings>);
    open(options: TDialogSettings, closeHandler?: IDialogCloseHandler): IDialogInstance;
}
export interface IDialogServiceProvider<TDialogSettings> extends ng.IServiceProvider {
    setImplementation(dialogImplementation: IDialogImplementation<TDialogSettings>): void;
    $get(bootstrapModalDialog: bootstrapModalDialog.IBootstrapModalDialogService): IDialogService<TDialogSettings>;
}
export declare function dialogServiceProvider<TDialogSettings>(): IDialogServiceProvider<TDialogSettings>;
