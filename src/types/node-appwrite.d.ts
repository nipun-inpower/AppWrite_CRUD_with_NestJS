declare module 'node-appwrite' {
    export class Client {
        setEndpoint(endpoint: string): this;
        setProject(projectId: string): this;
        setKey(key: string): this;
    }

    export class Account {
        constructor(client: Client);
        create(userId: string, email: string, password: string, name: string): Promise<{
            $id: string;
            $createdAt: string;
            email: string;
            name: string;
        }>;
        createEmailPasswordSession(email: string, password: string): Promise<{
            $id: string;
            userId: string;
            provider: string;
            providerUid: string;
            providerEmail: string;
            providerAccessToken: string;
        }>;
        createRecovery(email: string, url: string): Promise<{
            $id: string;
            userId: string;
            secret: string;
            expire: string;
        }>;
        updateRecovery(userId: string, secret: string, password: string): Promise<{
            status: string;
        }>;
        getSession(sessionId: string): Promise<{
            $id: string;
            userId: string;
            provider: string;
            providerUid: string;
            providerEmail: string;
            expire: string;
        }>;
    }

    export class Databases {
        constructor(client: Client);
        createDocument(
            databaseId: string,
            collectionId: string,
            documentId: string,
            data: object,
            permissions?: string[]
        ): Promise<any>;
        listDocuments(
            databaseId: string,
            collectionId: string,
            queries?: string[]
        ): Promise<{
            total: number;
            documents: any[];
        }>;
    }

    export class ID {
        static unique(): string;
    }

    export class Query {
        static equal(attribute: string, value: any): string;
    }
} 