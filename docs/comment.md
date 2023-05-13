# `/comment`
## ~~GET `/comment/:commentid`~~
 - id로 댓글을 GET
- 어디쓰일지는 몰?루
### parameters
| Name       | Type   | Mandatory | Example | Default | Description    |
| ---------- | ------ | --------- | ------- | ------- | -------------- |
| commentid | string | O         |         |         | 댓글 id |
### query
None
### body 
None
### response
| Type     | Mandatory | Example | Default | Description |
| -------- | --------- | ------- | ------- | ----------- |
| Comment | O         |         |         | 댓글 |
### result code
| code | message             |
| ---- | ------------------- |
| 200  | Success             |
| 400  | No formitemid given |
| 401  | No login data       |
| 401  | Login expired       |
| 403  | Unauthorized        |
| 404  | Comment not found |
- 401/403은 private 계약서의 댓글 GET 시도시에만
## GET `/comment?filter`
- Filter로 댓글을 GET
- 주인이 아닌 경우 public 계약서의 댓글만
### parameters
None
### query
| Name       | Type   | Mandatory | Example | Default | Description           |
| ---------- | ------ | --------- | ------- | ------- | --------------------- |
| formid     | string | X         |         |         | 계약서 id             |
| formitemid | string | X         |         |         | 계약서 항목 id        |
| offset     | number | X         | 0       | 0       | 시작점                |
| limit      | number | X         | 5       | null      | 읽어올 댓글 최대 갯수 |
### body 
None
### response
| Type     | Mandatory | Example | Default | Description |
| -------- | --------- | ------- | ------- | ----------- |
| FormItem[] | O         |         |         | 계약서 항목들 |
### result code
| code | message             |
| ---- | ------------------- |
| 200  | Success             |
| 400  | No formitemid given |
| 404  | Form item not found |
## POST `/comment`
- 댓글 생성
### parameters
None
### query
None
### body 
| Name       | Type   | Mandatory | Example         | Default | Description    |
| ---------- | ------ | --------- | --------------- | ------- | -------------- |
| formItemId | string | O         |                 |         | 계약서 항목 id |
| content    | string | O         | "수정 바랍니다" |         | 댓글      |
### response
#### singular
| Type    | Mandatory | Example | Default | Description |
| ------- | --------- | ------- | ------- | ----------- |
| Comment | O         |         |         | 생성된 댓글 |
### result code
| code | message                              |
| ---- | ------------------------------------ |
| 201  | Success                              |
| 400  | Invalid request body                 |
| 401  | No login data                        |
| 401  | Login expired                        |
| 403  | Unauthorized (No access to the form) |
| 404  | FormItem not found                   |
## PUT `/comment/:commentid`
- 댓글 수정
### parameters
| Name       | Type   | Mandatory | Example | Default | Description    |
| ---------- | ------ | --------- | ------- | ------- | -------------- |
| commentid | string | O         |         |         | 수정할 댓글 id |
### query
None
### body
| Name       | Type   | Mandatory | Example         | Default | Description    |
| ---------- | ------ | --------- | --------------- | ------- | -------------- |
| content    | string | X         | "수정 바랍니다" |         | 댓글      |
### response
| Type     | Mandatory | Example | Default | Description        |
| -------- | --------- | ------- | ------- | ------------------ |
| Comment | O         |         |         | 수정된 댓글 |
### result code
| code | message             |
| ---- | ------------------- |
| 200  | Success             |
| 400  | No formitemid given |
| 401  | No login data       |
| 401  | Login expired       |
| 403  | Unauthorized        |
| 404  | Form not found      |
| 404  | Comment not found   |
## DELETE `/comment/:commentid`
- 댓글 삭제
### parameters
| Name      | Type   | Mandatory | Example | Default | Description    |
| --------- | ------ | --------- | ------- | ------- | -------------- |
| commentid | string | O         |         |         | 삭제할 댓글 id |
### query
None
### body
None
### response
None
### result code
| code | message             |
| ---- | ------------------- |
| 204  | Success             |
| 400  | No formitemid given |
| 401  | No login data       |
| 401  | Login expired       |
| 403  | Unauthorized        |
| 404  | Comment not found   |