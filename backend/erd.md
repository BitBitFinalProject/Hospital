1. 주요 테이블 요약

1) users (사용자 정보)

필드	자료형	설명
id	PK	사용자 고유 ID
email	VARCHAR	이메일 (로그인용)
password	VARCHAR	비밀번호
name	VARCHAR	사용자 이름
role	VARCHAR	PATIENT or ADMIN (or DOCTOR)

2) hospitals (병원 정보)

필드	자료형	설명
id	PK	병원 고유 ID
name	VARCHAR	병원명
address	VARCHAR	병원 주소
phone	VARCHAR	병원 연락처

-운영 시간, 지도 좌표(위도·경도) 등은 확장 가능

3) departments (진료과 정보)

필드	자료형	설명
id	PK	진료과 고유 ID
name	VARCHAR	진료과 이름 (내과 등)

4) hospital_departments (병원-진료과 매핑)

필드	자료형	설명
hospital_id	FK	hospitals.id 참조
department_id	FK	departments.id 참조

-Many-to-Many를 연결하는 조인 테이블. PK는 복합키 or 단일 ID 사용

5) doctors (의사 정보) - 선택/확장

필드	자료형	설명
id	PK	의사 고유 ID
user_id	FK	users.id (의사가 사용자로 가입한 경우)
hospital_id	FK	hospitals.id
department_id	FK	departments.id
name	VARCHAR	의사 이름 (필요 시 별도 저장)

-의사 스케줄 관리, 프로필, 경력 등은 추가 컬럼으로 확장

6) reservations (예약 정보)

필드	자료형	설명
id	PK	예약 고유 ID
user_id	FK	예약한 사용자 (users.id)
hospital_id	FK	예약할 병원 (hospitals.id)
department_id	FK	선택한 진료과 (departments.id)
doctor_id	FK	담당 의사 (doctors.id) - 필요 시
reservation_date	DATE	예약 날짜
reservation_time	TIME	예약 시간
reason	VARCHAR	간단한 증상·메모 (ex. “복통”)
status	VARCHAR	예약 상태 (REQUESTED / APPROVED / REJECTED 등)

-날짜·시간을 하나로 합쳐 DATETIME으로 쓰거나, 둘로 분리해도 됨
-의사 지정이 없는 병원은 doctor_id 없이도 가능

7) reviews (리뷰) - 선택/확장

필드	자료형	설명
id	PK	리뷰 고유 ID
user_id	FK	리뷰 작성자 (users.id)
hospital_id	FK	대상 병원 (hospitals.id)
rating	INT	별점 (1~5)
content	TEXT	리뷰 내용

-병원에 대한 리뷰/평점을 남길 수 있음

8) notifications (알림) - 선택/확장

필드	자료형	설명
id	PK	알림 고유 ID
user_id	FK	알림 받을 사용자 (users.id)
message	VARCHAR	알림 내용 (ex. “예약 시간이 1시간 남았습니다.”)
created_at	DATETIME	알림 생성 시각

-이메일/문자 알림 대신, 웹 푸시나 앱 푸시 연동 시 사용 가능
-실제 전송 성공 여부 등 추가 필드 확장 가능

2. 간단한 ERD 관계도 예시
   [users] ---------------- (1:N) ---------------- [reservations] ---------------- (N:1) ---------------- [hospitals]
      |                                                                                                  (N:M)
      |                                                                                                    |
      |                                                                                                    | 
 (N:M)                                    [departments] <--- [hospital_departments] ---> [hospitals]      |
      |                                                                                                    |
      |                                                                                                    |
   [doctors] (N:1) ---------------------- [hospitals]                                                      |
                     (선택)             [reviews]  (N:1) ---- [hospitals]                                  |
                     (선택)             [notifications] (N:1) --- [users]                                  |
**reservations**는 users, hospitals, (옵션으로 department_id, doctor_id)와 연결

**hospital_departments**로 hospitals와 departments 사이 다대다 관계 구성

**reviews, notifications**는 부가기능 확장용

4. 이 설계를 바탕으로 가능한 시나리오

회원가입: users에 INSERT

병원/진료과 등록: hospitals, departments → hospital_departments로 매핑

예약: reservations에 (user_id, hospital_id, department_id, date/time, reason 등) 저장

리뷰 작성: reviews에 (user_id, hospital_id, rating, content) 저장

알림: 예약 변경 시(reservations.status 변경) → notifications 생성 (or 외부 푸시)

