import { error, log, native, sys } from "cc";
import { oops } from "../../../../../extensions/oops-plugin-framework/assets/core/Oops";

/** Hot update parameters */
export class HotOptions {
    /** Get version number information */
    onVersionInfo: Function | null = null;
    /** New version found, please update */
    onNeedToUpdate: Function | null = null;
    /** Same as the remote version, no need to update */
    onNoNeedToUpdate: Function | null = null;
    /** Update failed */
    onUpdateFailed: Function | null = null;
    /** Update completed */
    onUpdateSucceed: Function | null = null;
    /** update progress */
    onUpdateProgress: Function | null = null;

    check() {
        for (let key in this) {
            if (key !== 'check') {
                if (!this[key]) {
                    log(`The parameter hot options.${key} is not set!`);
                    return false;
                }
            }
        }
        return true
    }
}

/** Hot update management */
export class Hot {
    private assetsMgr: native.AssetsManager = null!;
    private options: HotOptions | null = null;
    private state = Hot.State.None;
    private storagePath: string = "";
    private manifest: string = "";

    static State = {
        None: 0,
        Check: 1,
        Update: 2,
    }

    /** Hot update initialization */
    init(opt: HotOptions) {
        if (!sys.isNative) {
            return;
        }
        if (!opt.check()) {
            return;
        }
        this.options = opt;

        if (this.assetsMgr) {
            return;
        }

        oops.res.load('project', (err: Error | null, res: any) => {
            if (err) {
                error("[Hot Update Interface] Missing hot update configuration file");
                return;
            }

            this.showSearchPath();

            this.manifest = res.nativeUrl;
            this.storagePath = `${native.fileUtils.getWritablePath()}oops_framework_remote`;
            this.assetsMgr = new native.AssetsManager(this.manifest, this.storagePath, (versionA, versionB) => {
                console.log("[Hot update] Client version: " + version + ', current latest version: ' + version);
                this.options?.onVersionInfo && this.options.onVersionInfo({ local: versionA, server: versionB });

                let vA = versionA.split('.');
                let vB = versionB.split('.');
                for (let i = 0; i < vA.length; ++i) {
                    let a = parseInt(vA[i]);
                    let b = parseInt(vB[i] || '0');
                    if (a !== b) {
                        return a - b;
                    }
                }

                if (vB.length > vA.length) {
                    return -1;
                }
                else {
                    return 0;
                }
            });

            // Set the verification callback, if the verification passes, return true, otherwise return false
            this.assetsMgr.setVerifyCallback((path: string, asset: jsb.ManifestAsset) => {
                // When compressing a resource we don't need to check its md5 because the zip file has been deleted
                var compressed = asset.compressed;
                // Retrieve the correct md5 value
                var expectedMD5 = asset.md5;
                // The resource path is a relative path and the path is an absolute path.
                var relativePath = asset.path;
                // The size of the resource file, but this value may not exist
                var size = asset.size;

                return true;
            });

            var localManifest = this.assetsMgr.getLocalManifest();
            console.log('[Hot update] Hot update resource storage path: ' + this.storagePath);
            console.log('[Hot Update] Local resource configuration path: ' + this.manifest);
            console.log('[Hot Update] Local package address: ' + localManifest.getPackageUrl());
            console.log('[Hot Update] Remote project.manifest address: ' + localManifest.getManifestFileUrl());
            console.log('[Hot Update] Remote version.manifest address: ' + localManifest.getVersionFileUrl());
            this.checkUpdate();
        });
    }

    /** Delete all stored files of hot updates */
    clearHotUpdateStorage() {
        native.fileUtils.removeDirectory(this.storagePath);
    }

    // Check for updates
    checkUpdate() {
        if (!this.assetsMgr) {
            console.log('[Hot update] Please initialize first');
            return;
        }

        if (this.assetsMgr.getState() === jsb.AssetsManager.State.UNINITED) {
            error('[Hot update] Not initialized');
            return;
        }
        if (!this.assetsMgr.getLocalManifest().isLoaded()) {
            console.log('[Hot update] Failed to load local manifest ...');
            return;
        }
        this.assetsMgr.setEventCallback(this.onHotUpdateCallBack.bind(this));
        this.state = Hot.State.Check;
        // Download version.manifest and compare versions
        this.assetsMgr.checkUpdate();
    }

    /** start getting hotter */
    hotUpdate() {
        if (!this.assetsMgr) {
            console.log('[Hot update] Please initialize first');
            return;
        }
        this.assetsMgr.setEventCallback(this.onHotUpdateCallBack.bind(this));
        this.state = Hot.State.Update;
        this.assetsMgr.update();
    }

    private onHotUpdateCallBack(event: native.EventAssetsManager) {
        let code = event.getEventCode();
        switch (code) {
            case native.EventAssetsManager.ALREADY_UP_TO_DATE:
                console.log("[Hot update] Current version is up-to-date with the remote version");
                this.options?.onNoNeedToUpdate && this.options.onNoNeedToUpdate(code)
                break;
            case native.EventAssetsManager.NEW_VERSION_FOUND:
                console.log('[Hot update] New version found, please update');
                this.options?.onNeedToUpdate && this.options.onNeedToUpdate(code, this.assetsMgr!.getTotalBytes());
                break;
            case native.EventAssetsManager.ASSET_UPDATED:
                console.log('[Hot update] Asset updated');
                break;
            case native.EventAssetsManager.UPDATE_PROGRESSION:
                if (this.state === Hot.State.Update) {
                    // event.getPercent();
                    // event.getPercentByFile();
                    // event.getDownloadedFiles() + ' / ' + event.getTotalFiles();
                    // event.getDownloadedBytes() + ' / ' + event.getTotalBytes();
                    console.log('[Hot update] Updating...', event.getDownloadedFiles(), event.getTotalFiles(), event.getPercent());
                    this.options?.onUpdateProgress && this.options.onUpdateProgress(event);
                }
                break;
            case native.EventAssetsManager.UPDATE_FINISHED:
                this.onUpdateFinished();
                break;
            default:
                this.onUpdateFailed(code);
                break;
        }
    }

    private onUpdateFailed(code: any) {
        this.assetsMgr.setEventCallback(null!)
        this.options?.onUpdateFailed && this.options.onUpdateFailed(code);
    }

    private onUpdateFinished() {
        this.assetsMgr.setEventCallback(null!);
        let searchPaths = native.fileUtils.getSearchPaths();
        let newPaths = this.assetsMgr.getLocalManifest().getSearchPaths();
        Array.prototype.unshift.apply(searchPaths, newPaths);
        localStorage.setItem('HotUpdateSearchPaths', JSON.stringify(searchPaths));
        native.fileUtils.setSearchPaths(searchPaths);

        console.log('[Hot update] Update successful');
        this.options?.onUpdateSucceed && this.options.onUpdateSucceed();
    }

    private showSearchPath() {
        console.log("========================Search Paths========================");
        let searchPaths = native.fileUtils.getSearchPaths();
        for (let i = 0; i < searchPaths.length; i++) {
            console.log("[" + i + "]: " + searchPaths[i]);
        }
        console.log("======================================================");
    }
}