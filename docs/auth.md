# `/auth`
## GET `/auth/exists/:email`
- 특정 이메일로 가입한 유저가 있는지 확인
### parameters
| Name  | Type   | Mandatory | Example | Default | Description |
| ----- | ------ | --------- | ------- | ------- | ----------- |
| email | string | O         |         |         | 이메일      |
### query
None
### body 
None
### response
| Name | Type | Mandatory          | Example | Default | Description |
| ---- | ---- | ----------------- | ------- | ------- | ----------- |
| userExists | boolean | O |         |         | 유저 존재 여부             |
### result code
| code | message              |
| ---- | -------------------- |
| 200  | Success              |
## POST `/auth/refresh`
- refresh token으로 access token을 받아옴
### parameters
None
### query
None
### body
None
### response
None
- httpOnly 쿠키에 토큰 전달
### result code
| code | message |
| ---- | ------- |
| 200  | Success |
## POST `/auth/register`
- 회원가입
### parameters
None
### query
None
### body 
| Name     | Type                     | Mandatory | Example                            | Default | Description                          |
| -------- | ------------------------ | -------- | ---------------------------------- | ------- | ------------------------------------ |
| email    | string                   | O        | "someone@abcd.com"                 |         | 이메일                               |
| name     | string                   | O        | "Karen"                            |         | 이름                                 |
| password | string                   | O        |                                    |         | 비밀번호 (hashed)                    |
| birth    | string                   | O        | "040201"                           |         | 생년월일 6자리 (주민등록번호 앞자리) |
| sex      | "1" \| "2" \| "3" \| "4" | O        | "3"                                |         | 성별 (주민등록번호 뒷자리 첫 숫자)   |
| contact  | string                   | O        | "010-1234-5678"                    |         | 전화번호                             |
| address  | string                   | O        | "강원도 횡성군 둔내면 둔내로 76-1" |         | 주소 pure string                     |
| job      | string                   | O        | "학생"                             |         | 직업                                 |
| purpose  | string                   | X        | "근로계약서 작성"                  | "Unspecified"        | 서비스 사용 이유                     |
| belong   | string                   | X        | ""                                 | "Unspecified"        | 소속                                 |
### response
| Type | Mandatory | Example | Default | Description |
| ---- | --------- | ------- | ------- | ----------- |
| User | O         |         |         | 생성된 유저 |
- httpOnly 쿠키에 access token / refresh token 전달
### result code
| code | message              |
| ---- | -------------------- |
| 201  | Success              |
| 400  | Invalid request body |
| 409  | User already exists  |
## POST `/auth/login`
- 로그인
### parameters
None
### query
None
### body 
| Name     | Type                     | Mandatory | Example                            | Default | Description                          |
| -------- | ------------------------ | -------- | ---------------------------------- | ------- | ------------------------------------ |
| email    | string                   | O        | "someone@abcd.com"                 |         | 이메일                               |
| password | string                   | O        |                                    |         | 비밀번호 (hashed)                    |
### response
| Type | Mandatory          | Example | Default | Description |
| ---- | ----------------- | ------- | ------- | ----------- |
| User | O |         |         | 로그인된 유저             |
- httpOnly 쿠키에 access token / refresh token 전달
### result code
| code | message              |
| ---- | -------------------- |
| 201  | Success              |
| 400  | Invalid request body |
| 401  | Wrong Password       |
| 404  | User not found       |
## DELETE `/auth/logout`
- 로그아웃
### parameters
None
### query
None
### body 
None
### response
None
- httpOnly 쿠키에서 토큰 제거
### result code
| code | message       |
| ---- | ------------- |
| 204  | Success       |
| 401  | No login data |
| 401  | Login expired |