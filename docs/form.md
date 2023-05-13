# `/form`
## GET `/form/:formid`
- id로 계약서 GET
- 자신이 작성자가 아닌 private 계약서 확인 -> 403
### parameters
| Name   | Type   | Mandatory | Example | Default | Description |
| ------ | ------ | -------- | ------- | ------- | ----------- |
| formid | string | O        |         |         | 계약서 id   |
### query
None
### body 
None
### response
| Type | Mandatory | Example | Default | Description |
| ---- | --------- | ------- | ------- | ----------- |
| Form | O         |         |         | 계약서      |
### result code
| code | message         |
| ---- | --------------- |
| 200  | Success         |
| 400  | No formid given |
| 401  | No login data   |
| 401  | Login expired   |
| 403  | Forbidden    |
| 404  | Form not found  |
- 401/403은 private 계약서 GET 시도시에만
## ~~GET `/form?filter`~~
- Filter로 계약서 GET (자신이 작성자가가 아닌 경우 public 계약서만 확인 가능)
### parameters
None
### query
| Name      | Type   | Mandatory | Example | Default | Description             |
| --------- | ------ | --------- | ------- | ------- | ----------------------- |
| userId    | string | X         |         | None    | 유저 id                 |
| category  | string | X         |         | None    | 카테고리                |
| scrapedBy | string | X         |         | None    | 스크랩한 유저           |
| offset    | number | X         | 10      | 0       | 시작점                  |
| limit     | number | X         | 10      | 10      | 읽어올 계약서 최대 개수 |
### body
None
### response
| Type   | Mandatory | Example | Default | Description |
| ------ | --------- | ------- | ------- | ----------- |
| Form[] | O         |         |         | 계약서 목록 |
### result code
| code | message        |
| ---- | -------------- |
| 200  | Success        |
| 401  | No login data  |
| 401  | Login expired  |
## POST `/form
- 계약서 생성
### parameters
None
### query
None
### body 
| Name     | Type                  | Mandatory | Example                      | Default         | Description                     |
| -------- | --------------------- | --------- | ---------------------------- | --------------- | ------------------------------- |
| title    | string                | O         | "어쩌고저쩌고에 대한 계약서" |                 | 계약서 제목                     |
| category | string                | X         | "근로계약서"                 | "Uncategorized" | 계약서 종류 (근로/구매/도급 등) |
| userA    | userId                | X         |                              | null            | 갑                              |
| userB    | userId                | X         |                              | null            | 을                              |
| status   | "private" \| "public" | X         | "private"                    | "public"        | 주소 pure string                |
### response
| Type | Mandatory | Example | Default | Description   |
| ---- | -------- | ------- | ------- | ------------- |
| Form | O        |         |         | 생성된 계약서 |
### result code
| code | message              |
| ---- | -------------------- |
| 201  | Success              |
| 400  | Invalid request body |
| 401  | No login data        |
| 401  | Login expired        |
## PUT `/form/:formid`
- 계약서 수정
### parameters
| Name   | Type   | Mandatory | Example | Default | Description |
| ------ | ------ | -------- | ------- | ------- | ----------- |
| formid | string | O        |         |         | 수정할 계약서 id   |
### query
None
### body
| Name     | Type                  | Mandatory | Example                      | Default                | Description                     |
| -------- | --------------------- | --------- | ---------------------------- | ---------------------- | ------------------------------- |
| title    | string                | X         | "어쩌고저쩌고에 대한 계약서" | 수정 전 값 (이하 동일) | 계약서 제목                     |
| category | string                | X         | "근로계약서"                 |                        | 계약서 종류 (근로/구매/도급 등) |
| author   | userId\[]                | X         |                              |                        | 작성자 userid                   |
| userA    | userId                | X         |                              |                        | 갑                              |
| userB    | userId                | X         |                              |                        | 을                              |

| status   | "private" \| "public" | X         | "private"                    |                        | 주소 pure string                |
### response
| Type | Mandatory | Example | Default | Description   |
| ---- | -------- | ------- | ------- | ------------- |
| Form | O        |         |         | 수정된 계약서 |
### result code
| code | message         |
| ---- | --------------- |
| 200  | Success         |
| 400  | No formid given |
| 401  | No login data   |
| 401  | Login expired   |
| 403  | Forbidden    |
| 404  | Form not found  |
## DELETE `/form/:formid`
- 계약서 삭제
### parameters
| Name   | Type   | Mandatory | Example | Default | Description |
| ------ | ------ | -------- | ------- | ------- | ----------- |
| formid | string | O        |         |         | 삭제할 계약서 id   |
### query
None
### body
None
### response
None
### result code
| code | message         |
| ---- | --------------- |
| 204  | Success         |
| 400  | No formid given |
| 401  | No login data   |
| 401  | Login expired   |
| 403  | Forbidden    |
| 404  | Form not found  |
## POST `/form/search`
- 계약서 제목 검색
### parameters
None
### query
None
### body
| Name     | Type                  | Mandatory | Example                      | Default                | Description                     |
| -------- | --------------------- | --------- | ---------------------------- | ---------------------- | ------------------------------- |
| searchString  | string | O | "계약금" |  | 검색 단어 |
| from | number | X | 10 | 0 | 시작점 |
| size | number | X | 5 | 10 | 검색 개수 |
| sort | string | X | "useCount" | null | 정렬 기준 |
### response
| Type | Mandatory | Example | Default | Description   |
| ---- | -------- | ------- | ------- | ------------- |
| Form[] | O        |         |         | 검색 결과 |
### result code
| code | message         |
| ---- | --------------- |
| 200  | Success         |