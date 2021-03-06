import { URL, sendRequest } from "./api";

/**
 * Handles communicating with the models API, primarily listing, lookup and uploading.
 */
export default class ModelApi {
    private static url = URL + "modelstorage/";

    /**
     * Looks up a model ID and returns it's file name.
     * @param modelId The model ID to look up.
     */
    public static async lookup(modelId: number): Promise<string> {
        const url = `${this.url}lookup/${modelId}`;
        const options = { method: "GET" };
        const response = await sendRequest(url, options);
        return await response.json() as string;
    }

    /**
     * Lists all available model ID's and their corresponding file name.
     */
    public static async list(): Promise<[number, string][]> {
        const options = { method: "GET" };
        const response = await sendRequest(this.url, options);
        const models = await response.json() as JsonModel[];
        return models.map(m => [m.id, m.filename])
    }

    /**
     * Uploads a model to the server.
     * @param name The file name of the model.
     * @param data The binary data of the model file.
     */
    public static async upload(name: string, data: Blob | BufferSource | ReadableStream): Promise<void> {
        const url = `${this.url}upload/${name}`;
        const options: RequestInit = { method: "PUT", credentials: "include", body: data };
        await sendRequest(url, options);
    }
}


/**
 * Represents a model in a model list as returned by the server.
 */
class JsonModel {
    id: number;
    filename: string;

    constructor(id: number, filename: string) {
        this.id = id;
        this.filename = filename;
    }
}
