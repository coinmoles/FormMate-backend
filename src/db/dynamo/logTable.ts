import { CreateTableCommand, CreateTableCommandInput, DeleteTableCommand } from "@aws-sdk/client-dynamodb";
import { client } from "./client";

const input: CreateTableCommandInput = {
    TableName: "Log",
    KeySchema: [
        { AttributeName: "logId", KeyType: "HASH" }
    ],
    AttributeDefinitions: [
        { AttributeName: "logId", AttributeType: "S" },
        { AttributeName: "formId", AttributeType: "S" },
        { AttributeName: "updated", AttributeType: "S" }
    ],
    GlobalSecondaryIndexes: [
        {
            IndexName: "formIndex", 
            KeySchema: [
                { AttributeName: "formId", KeyType: "HASH" },
                { AttributeName: "updated", KeyType: "RANGE" }
            ],
            Projection: {
                ProjectionType: "ALL"
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

const createLogTable = async () => {
    try {
        const results = await client.send(new CreateTableCommand(input));
        console.log(results)
    } catch (err) {
        console.error(err)
    }
}

const deleteLogTable = async () => {
    await client.send(new DeleteTableCommand({TableName: "Log"}));
}


createLogTable()
