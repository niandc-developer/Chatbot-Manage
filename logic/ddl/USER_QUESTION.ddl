CREATE TABLE USER_QUESTION(
  QUESTION_ID   VARCHAR(32) NOT NULL,
  QUESTION_DATA VARCHAR(32500),
  SESSION_ID    VARCHAR(32),
  INSERT_USER   VARCHAR(50),
  INSERT_TIME   TIMESTAMP DEFAULT,
  UPDATE_USER   VARCHAR(50),
  UPDATE_TIME   TIMESTAMP DEFAULT,
  PRIMARY KEY (QUESTION_ID)
);