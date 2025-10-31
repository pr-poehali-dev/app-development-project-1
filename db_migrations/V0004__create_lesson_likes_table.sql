CREATE TABLE IF NOT EXISTS t_p42286306_app_development_proj.lesson_likes (
  id SERIAL PRIMARY KEY,
  user_id INTEGER NOT NULL,
  subject VARCHAR(100) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(user_id, subject)
);

CREATE INDEX IF NOT EXISTS idx_lesson_likes_subject ON t_p42286306_app_development_proj.lesson_likes(subject);
CREATE INDEX IF NOT EXISTS idx_lesson_likes_user_id ON t_p42286306_app_development_proj.lesson_likes(user_id);
