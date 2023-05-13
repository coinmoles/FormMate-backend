# `/formitem`
## POST `/formitem`
- 계약서 항목 생성
- 여러 개 한번에 생성 가능
### parameters
None
### query
None
### body 
| Name      | Type                  | Mandatory | Example    | Default  | Description      |
| --------- | --------------------- | --------- | ---------- | -------- | ---------------- |
| formid    | string                | O         |            |          | 계약서 id        |
| article   | number                | O         | 1          |          | 항목 번호        |
| paragraph | number                | O         | 0          |          | 
| content   | string                | O         |            |          | 항목 내용        |
- or list of this object
### response
#### singular
| Type     | Mandatory | Example | Default | Description        |
| -------- | --------- | ------- | ------- | ------------------ |
| FormItem | O         |         |         | 생성된 계약서 항목 |
#### multiple
```ts
{
    "data": [
        {
            "message": "success",
            "resource": FormItem,
            "status": 201
        },
        {
            "message": "Invalid request body",
            "resource": null,
            "status": 400
        },
        {
            "message": "success",
            "resource": FormItem,
            "status": 201
        }
    ],
    "metadata": {
        "failure": 1,
        "success": 2,
        "total": 3
   
```
### result code
| code | message                                  |
| ---- | ---------------------------------------- |
| 201  | Success                                  |
| 400  | Invalid request body                     |
| 401  | No login data                            |
| 401  | Login expired                            |
| 403  | Forbidden (No access to the form) |
| 404  | Form not found                           |
- 207 when multiple
### PUT `/formitem/:formitemid`
- 계약서 항목 수정
#### parameters
| Name       | Type   | Mandatory | Example | Default | Description    |
| ---------- | ------ | --------- | ------- | ------- | -------------- |
| formitemid | string | O         |         |         | 수정할 항목 id |
#### query
None
### body
| Name      | Type   | Mandatory | Example    | Default                | Description |
| --------- | ------ | --------- | ---------- | ---------------------- | ----------- |
| article   | number | X         | 1          |                        | 항목 번호   |
| paragraph | number | X         | 0          |                        | 항목 번호   |
| content   | string | X         |            |                        | 항목 내용   |
#### response
| Type     | Mandatory | Example | Default | Description        |
| -------- | --------- | ------- | ------- | ------------------ |
| FormItem | O         |         |         | 수정된 계약서 항목 |
#### result code
| code | message                                  |
| ---- | ---------------------------------------- |
| 200  | Success                                  |
| 400  | No formitemid given                     |
| 401  | No login data                            |
| 401  | Login expired                            |
| 403  | Forbidden (No access to the form) |
| 404  | Form not found                           |
| 404  | FormItem not found                           |
### PATCH `/formitem`
- 계약서 항목 변경
- 여러 항목 동시에 변경 가능
#### parameters
None
#### query
None
#### body
| Name       | Type   | Mandatory | Example    | Default                | Description    |
| ---------- | ------ | --------- | ---------- | ---------------------- | -------------- |
| formitemid | string | O         |            |                        | 수정할 항목 id |
| formid     | string | X         |            | 수정 전 값 (이하 동일) | 계약서 id      |
| article    | number | X         | 1          |                        | 항목 번호      |
| paragraph  | number | X         | 0          |                        | 항목 번호      |
| content    | string | X         |            |                        | 항목 내용      |
- or list of this object
#### response
##### singular
| Type     | Mandatory | Example   | Default | Description            |
| -------- | --------- | --------- | ------- | ---------------------- |
| FormItem | O         |           |         | 변경된 계약서 항목(들) |
##### multiple
```ts
{
    "data": [
        {
            "message": "success",
            "resource": FormItem,
            "status": 200
        },
        {
            "message": "FormItem Not found",
            "resource": null,
            "status": 404
        },
        {
            "message": "success",
            "resource": FormItem,
            "status": 200
        }
    ],
    "metadata": {
        "failure": 1,
        "success": 2,
        "total": 3
    }
}
```
### result code
| code | message                                  |
| ---- | ---------------------------------------- |
| 200  | Success                                  |
| 400  | Invalid request body                     |
| 401  | No login data                            |
| 401  | Login expired                            |
| 403  | Forbidden (No access to the form) |
| 404  | Form not found                           |
| 404  | FormItem not found                       |
- 207 when multiple
## DELETE `/formitem/:formitemid`
- 계약서 항목 삭제
### parameters
| Name       | Type   | Mandatory | Example | Default | Description    |
| ---------- | ------ | --------- | ------- | ------- | -------------- |
| formitemid | string | O         |         |         | 삭제할 항목 id |
### query
None
### body
None
### response
None
### result code
| code | message                                  |
| ---- | ---------------------------------------- |
| 204  | Success                                  |
| 400  | No formitemid given                      |
| 401  | No login data                            |
| 401  | Login expired                            |
| 403  | Forbidden (No access to the form) |
| 404  | FormItem not found                       |
### POST `/formitem/search`