
import {
    observable,
    action,
    flow,
    runInAction
} from "mobx";

import { saveAs } from "file-saver";
import { SaveGame } from "oni-save-parser";

import { typedKeys } from "@/utils";
import { error } from "@/logging";

import { SaveEditor, GameObjectModel } from "./interfaces";
import { GameObjectModelImpl } from "./game-object";

import SaveLoadWorker from "worker-loader!./save-loader.worker";
import { LoadCommandData, SaveCommandData, SaveLoaderEvents } from "./save-loader.worker";
const worker = new SaveLoadWorker();


export class SaveEditorImpl implements SaveEditor {
    @observable
    saveName: string | null = null;

    @observable
    isSaveLoading: boolean = false;

    @observable
    isSaveLoaded: boolean = false;

    @observable
    isSaveSaving: boolean = false;

    @observable
    loadError: Error | null = null;

    @observable
    saveLoadParseStep: string | null = null;

    private _saveGame: SaveGame | null = null;

    /**
     * Map of game object types to GameObjectModels in index order.
     */
    private _gameObjects = new Map<string, GameObjectModelImpl[]>();

    get gameObjects(): GameObjectModel[] {
        const objectModelArrays = Array.from(this._gameObjects.values());
        return ([] as GameObjectModel[]).concat(...objectModelArrays);
    }

    load: SaveEditor["load"] = flow(function* (this: SaveEditorImpl, file: File) {
        this.isSaveLoaded = false;
        this.isSaveLoading = true;
        this._gameObjects.clear();
        this.saveName = file.name;
        try {
            const data = yield readFile(file);
            const saveGame: SaveGame = yield this._parseSave(data);
            this._saveGame = saveGame;
            for (let type of typedKeys(this._saveGame.body.gameObjects)) {
                const models = this._saveGame.body.gameObjects[type].map(x => new GameObjectModelImpl(type, x));
                this._gameObjects.set(type, models);
            }
            this.isSaveLoaded = true;
        }
        catch (e) {
            error("Failed to load file: " + e.message);
            this.loadError = e;
        }
        finally {
            this.isSaveLoading = false;
        }
    });

    @action
    renameSave(name: string) {
        if (!this.isSaveLoaded) return;
        if (name == null || name === "") return;
        this.saveName = name;
    }

    save: SaveEditor["save"] = flow(function*(this: SaveEditorImpl) {
        if (!this._saveGame) return;
        this.isSaveSaving = true;
        try {
            for (let [_, value] of this._gameObjects) {
                value.forEach(x => x.syncChanges());
            }
            const data = yield this._writeSave(this._saveGame)
            const blob = new Blob([data]);

            saveAs(blob, withExtension(this.saveName || "my-file", ".sav"));
        }
        catch (e) {
            error("Failed to save file: " + e.message);
            this.loadError = e;
        }
        finally {
            this.isSaveSaving = false;
        }
    });

    // TODO: Look at why this is generating new objects every time.  Might be because the source object isnt observable?
    // getGameObjects: SaveEditor["getGameObjects"] = createTransformer((type: string) => ((this._saveGame && this._saveGame.body.gameObjects[type]) || []).map(x => new GameObjectModelImpl(type, x)));
    getGameObjects(type: string): GameObjectModel[] {
        return this._gameObjects.get(type) || [];
    }

    private _parseSave(buffer: ArrayBuffer): Promise<SaveGame> {
        return new Promise<SaveGame>((accept, reject) => {
            worker.onerror = (e: ErrorEvent) => { reject(e.error) };
            worker.onmessage = action("parse-save-worker-message", (e: MessageEvent) => {
                const event = e.data as SaveLoaderEvents;
                switch(event.type) {
                    case "progress": {
                        this.saveLoadParseStep = event.name;
                        return;
                    };
                    case "loaded": {
                        worker.onmessage = null;
                        this.saveLoadParseStep = null;
                        const {error, saveGame} = event;
                        if (error) reject(error);
                        else accept(saveGame!);
                        return;
                    };
                }
            });
    
            const cmd: LoadCommandData = {
                command: "load",
                buffer: buffer
            };
            worker.postMessage(cmd);
        });
    }
    
    private _writeSave(saveGame: SaveGame): Promise<ArrayBuffer> {
        return new Promise<ArrayBuffer>((accept, reject) => {
            worker.onerror = (e: ErrorEvent) => { reject(e.error) };
            worker.onmessage = action("parse-save-worker-message", (e: MessageEvent) => {
                const event = e.data as SaveLoaderEvents;
                switch(event.type) {
                    case "progress": {
                        this.saveLoadParseStep = event.name;
                        return;
                    };
                    case "saved": {
                        worker.onmessage = null;
                        this.saveLoadParseStep = null;
                        const {error, buffer} = event;
                        if (error) reject(error);
                        else accept(buffer!);
                        return;
                    };
                }
            });
    
            const cmd: SaveCommandData = {
                command: "save",
                save: saveGame
            };
            worker.postMessage(cmd);
        });
    }
}


function readFile(file: File): Promise<ArrayBuffer> {
    const reader = new FileReader();
    return new Promise<ArrayBuffer>((accept, reject) => {
        reader.onload = () => {
            accept(reader.result);
        };
        reader.onerror = () => {
            reject(reader.error);
        };
        reader.readAsArrayBuffer(file);
    });
}

function withExtension(name: string, ext: string): string {
    if (name.endsWith(ext)) return name;
    return name + ext;
}