import { CreateTableCommand, CreateTableCommandInput, DeleteTableCommand } from "@aws-sdk/client-dynamodb";
import { client } from "./client";

const input: CreateTableCommandInput = {
    TableName: "Comment",
    KeySchema: [
        { AttributeName: "commentId", KeyType: "HASH" }
    ],
    AttributeDefinitions: [
        { AttributeName: "commentId", AttributeType: "S" },
        { AttributeName: "formId", AttributeType: "S" },
        { AttributeName: "formItemId", AttributeType: "S" }
    ],
    GlobalSecondaryIndexes: [
        {
            IndexName: "formIndex", 
            KeySchema: [
                { AttributeName: "formId", KeyType: "HASH" }
            ],
            Projection: {
                ProjectionType: "ALL"
            },
            ProvisionedThroughput: {
                ReadCapacityUnits: 10,
                WriteCapacityUnits: 100
            }
        },
        {
            IndexName: "formItemIndex", 
            KeySchema: [
                { AttributeName: "formItemId", KeyType: "HASH" }
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

const createCommentTable = async () => {
    try {
        const results = await client.send(new CreateTableCommand(input));
        console.log(results)
    } catch (err) {
        console.error(err)
    }
}

const deleteCommentTable = async () => {
    await client.send(new DeleteTableCommand({TableName: "Comment"}));
}


createCommentTable()
