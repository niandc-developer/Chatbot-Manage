CREATE TABLE USER_LOG(
  LOG_ID        INT NOT NULL
    GENERATED ALWAYS AS IDENTITY
      (START WITH 1,
       INCREMENT BY 1,
       MINVALUE 1,
       NO MAXVALUE,
       NO CYCLE,
       NO CACHE),
  SESSION_ID    VARCHAR(32) NOT NULL,
  USER_ID       VARCHAR(50),
  LOG_TIME      TIMESTAMP,
  FUNCTION_TYPE VARCHAR(30),
  INPUT_TYPE    VARCHAR(30),
  REQUEST       VARCHAR(32500),
  RESPONSE      VARCHAR(32500),
  PRIMARY KEY (LOG_ID)
);
