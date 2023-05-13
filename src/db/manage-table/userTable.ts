import { DynamoDBClient, CreateTableCommand, CreateTableCommandInput, DeleteTableCommand, } from "@aws-sdk/client-dynamodb"
import { client } from "../client";
import { create } from "domain";

const input: CreateTableCommandInput = {
    TableName: "User",
    KeySchema: [
        { AttributeName: "userId", KeyType: "HASH" }
    ],
    AttributeDefinitions: [
        { AttributeName: "userId", AttributeType: "S" },
        { AttributeName: "email", AttributeType: "S" }
    ],
    GlobalSecondaryIndexes: [
        {
            IndexName: "emailIndex",
            KeySchema: [
                { AttributeName: "email", KeyType: "HASH" }
            ],
            Projection: {
                ProjectionType: "KEYS_ONLY"
            },
            ProvisionedThroughput: {
                ReadCapacityUnits: 10,
                WriteCapacityUnits: 100
            }
        }
    ],
    ProvisionedThroughput: {
        ReadCapacityUnits: 10,
        WriteCapacityUnits: 100
    }
}

const createUserTable = async () => {
    try {
        const results = await client.send(new CreateTableCommand(input));
        console.log(results)
    } catch (err) {
        console.error(err)
    }
}

const deleteUserTable = async () => {
    await client.send(new DeleteTableCommand({ TableName: "User" }));
}