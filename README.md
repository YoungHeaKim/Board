# Project
## 프로젝트 목표
1. Passport를 사용하여 로컬 로그인
2. 메인페이지에 테이블로 게시판 리스트 출력
3. 게시글 등록하기(SummerNote 에디터 사용)
4. 게시글 수정하기
5. 게시글 삭제하기
6. 유저정보 수정하기(비밀번호, username)

## Spec
1. MongoDB
2. Node.js
3. ejs
4. SummerNote

## API 목록

| Route | Methood | Description |  
|---|---|---| 
| /user/login | GET | 로그인 창 |
| /user/register | POST | 회원가입 창 |
| /article/lists | GET | 메인페이지 |
| /article/new | POST | 게시글 데이터 생성 |
| /article/lists/:list_id | GET | 게시글 보기 |
| /article/lists/:uid | GET | 게시글 데이터 user의 id값으로 조회 |
| /article/edit/:list_id | get | 게시글 데이터 수정할 페이지 |
| /article/edit/ | PUT | 게시글 데이터 수정 |
| /article/lists/:list_id | DELETE | 게시글 데이터 삭제 |
