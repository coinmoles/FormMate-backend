import { CreateTableCommand, CreateTableCommandInput, DeleteTableCommand } from "@aws-sdk/client-dynamodb";
import { client } from "../client";

const input: CreateTableCommandInput = {
    TableName: "FormItem",
    KeySchema: [
        { AttributeName: "formItemId", KeyType: "HASH" }
    ],
    AttributeDefinitions: [
        { AttributeName: "formItemId", AttributeType: "S" },
        { AttributeName: "formId", AttributeType: "S" },
        { AttributeName: "article", AttributeType: "N" },
    ],
    GlobalSecondaryIndexes: [
        {
            IndexName: "formIndex", 
            KeySchema: [
                { AttributeName: "formId", KeyType: "HASH" },
                { AttributeName: "article", KeyType: "RANGE" }
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

const createFormItemTable = async () => {
    try {
        const results = await client.send(new CreateTableCommand(input));
        console.log(results)
    } catch (err) {
        console.error(err)
    }
}

const deleteFormItemTable = async () => {
    await client.send(new DeleteTableCommand({TableName: "FormItem"}));
}


createFormItemTable()
