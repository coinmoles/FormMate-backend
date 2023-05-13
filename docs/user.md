# `/user`
## GET `/user/:userid`
- 유저 정보 GET
- userid 없는 경우 로그인된 유저 정보
### parameters
| Name   | Type   | Mandatory | Example | Default       | Description |
| ------ | ------ | -------- | ------- | ------------- | ----------- |
| userId | string | X        |         | 로그인된 유저 | 유저 id     |
### query
None
### body
None
### response
| Type | Mandatory | Example | Default | Description |
| ---- | --------- | ------- | ------- | ----------- |
| User | O         |         |         | 유저 정보   |
### result code
| code | message        |
| ---- | -------------- |
| 200  | Success        |
| 401  | No login data  |
| 401  | Login expired  |
| 404  | User not found |
- 401은 userid를 주지 않은 경우(로그인 유저 정보를 GET하는 경우)에만
## PUT `/user`
- 현재 로그인된 유저 정보 수정
### parameters
None
### query
None
### body
| Name     | Type                     | Mandatory | Example                            | Default                | Description                          |
| -------- | ------------------------ | -------- | ---------------------------------- | ---------------------- | ------------------------------------ |
| email    | string                   | X        | "someone@abcd.com"                 | 수정 전 값 (이하 동일) | 이메일                               |
| name     | string                   | X        | "Karen"                            |                        | 이름                                 |
| password | string                   | X        |                                    |                        | 비밀번호 (hashed)                    |
| birth    | string                   | x        | "040201"                           |                        | 생년월일 6자리 (주민등록번호 앞자리) |
| sex      | "1" \| "2" \| "3" \| "4" | X        | "3"                                |                        | 성별 (주민등록번호 뒷자리 첫 숫자)   |
| contact  | string                   | X        | "010-1234-5678"                    |                        | 전화번호                             |
| address  | string                   | X        | "강원도 횡성군 둔내면 둔내로 76-1" |                        | 주소 pure string                     |
| job      | string                   | X        | "학생"                             |                        | 직업                                 |
| purpose  | string                   | X        | "근로계약서 작성"                  |                        | 서비스 사용 이유                     |
| belong   | string                   | X        | ""                                 |                        | 소속                                 |
### response
| Type | Mandatory | Example | Default | Description      |
| ---- | --------- | ------- | ------- | ---------------- |
| User | O         |         |         | 수정된 유저 정보 |
### result code
| code | message              |
| ---- | -------------------- |
| 200  | Success              |
| 400  | Invalid request body |
| 401  | No login data        |
| 401  | Login expired        |
## DELETE `/user`
- 현재 로그인된 유저 계정 삭제
### parameters
None
### query
None
### body
None
### response
None
### result code
| code | message       |
| ---- | ------------- |
| 200  | Success       |
| 401  | No login data |
| 401  | Login expired |