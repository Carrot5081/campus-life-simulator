CREATE DATABASE IF NOT EXISTS campus_life_simulator
  CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE campus_life_simulator;

CREATE TABLE IF NOT EXISTS player (
  player_id     INT AUTO_INCREMENT PRIMARY KEY,
  username      VARCHAR(50)  NOT NULL UNIQUE,
  email         VARCHAR(100) NOT NULL UNIQUE,
  password_hash VARCHAR(255) NOT NULL,
  best_score    INT NOT NULL DEFAULT 0,
  total_games   INT NOT NULL DEFAULT 0,
  created_at    DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS game_session (
  session_id      INT AUTO_INCREMENT PRIMARY KEY,
  player_id       INT NOT NULL,
  start_time      DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  end_time        DATETIME,
  end_reason      VARCHAR(50),
  rounds_survived INT NOT NULL DEFAULT 0,
  final_score     INT NOT NULL DEFAULT 0,
  FOREIGN KEY (player_id) REFERENCES player(player_id) ON DELETE CASCADE
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS attribute (
  attribute_id INT AUTO_INCREMENT PRIMARY KEY,
  session_id   INT NOT NULL,
  round_num    INT NOT NULL,
  academic     INT NOT NULL DEFAULT 50,
  money        INT NOT NULL DEFAULT 50,
  social       INT NOT NULL DEFAULT 50,
  health       INT NOT NULL DEFAULT 50,
  FOREIGN KEY (session_id) REFERENCES game_session(session_id) ON DELETE CASCADE,
  UNIQUE KEY uq_session_round (session_id, round_num)
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS event (
  event_id    INT AUTO_INCREMENT PRIMARY KEY,
  title       VARCHAR(100) NOT NULL,
  description TEXT NOT NULL,
  category    VARCHAR(30) NOT NULL DEFAULT 'general',
  difficulty  INT NOT NULL DEFAULT 1,
  is_active   BOOLEAN NOT NULL DEFAULT TRUE
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS fixed_event (
  event_id INT PRIMARY KEY,
  sequence INT NOT NULL UNIQUE,
  FOREIGN KEY (event_id) REFERENCES event(event_id) ON DELETE CASCADE
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS random_event (
  event_id    INT PRIMARY KEY,
  probability FLOAT NOT NULL DEFAULT 0.3,
  conditions  VARCHAR(100),
  FOREIGN KEY (event_id) REFERENCES event(event_id) ON DELETE CASCADE
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS choice (
  choice_id   INT AUTO_INCREMENT PRIMARY KEY,
  event_id    INT NOT NULL,
  label       CHAR(1) NOT NULL,
  choice_text VARCHAR(200) NOT NULL,
  FOREIGN KEY (event_id) REFERENCES event(event_id) ON DELETE CASCADE
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS status_effect (
  effect_id   INT AUTO_INCREMENT PRIMARY KEY,
  choice_id   INT NOT NULL,
  status_name VARCHAR(20) NOT NULL,
  delta       INT NOT NULL,
  FOREIGN KEY (choice_id) REFERENCES choice(choice_id) ON DELETE CASCADE
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS player_choice_log (
  log_id     INT AUTO_INCREMENT PRIMARY KEY,
  session_id INT NOT NULL,
  round_num  INT NOT NULL,
  event_id   INT NOT NULL,
  choice_id  INT NOT NULL,
  chosen_at  DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (session_id) REFERENCES game_session(session_id) ON DELETE CASCADE,
  FOREIGN KEY (choice_id)  REFERENCES choice(choice_id)
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS achievement (
  achievement_id   INT AUTO_INCREMENT PRIMARY KEY,
  name             VARCHAR(100) NOT NULL,
  description      TEXT,
  condition_type   VARCHAR(50),
  condition_value  INT,
  condition_status VARCHAR(20),
  bonus_score      INT NOT NULL DEFAULT 0
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS player_achievement (
  player_id      INT NOT NULL,
  achievement_id INT NOT NULL,
  unlocked_at    DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (player_id, achievement_id),
  FOREIGN KEY (player_id)      REFERENCES player(player_id)      ON DELETE CASCADE,
  FOREIGN KEY (achievement_id) REFERENCES achievement(achievement_id) ON DELETE CASCADE
) ENGINE=InnoDB;
