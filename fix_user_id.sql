UPDATE letters SET user_id = 3 WHERE user_id IS NULL;
SELECT id, user_id, subject, status FROM letters;
