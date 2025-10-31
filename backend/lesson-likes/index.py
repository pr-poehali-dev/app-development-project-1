import json
import os
import psycopg2
from typing import Dict, Any

def handler(event: Dict[str, Any], context: Any) -> Dict[str, Any]:
    '''
    Business: Handle lesson likes - get count and user like status, toggle likes
    Args: event with httpMethod (GET/POST), queryStringParameters (subject, userId), body (for POST)
          context with request_id
    Returns: HTTP response with likes count and hasLiked status
    '''
    method: str = event.get('httpMethod', 'GET')
    
    if method == 'OPTIONS':
        return {
            'statusCode': 200,
            'headers': {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
                'Access-Control-Allow-Headers': 'Content-Type',
                'Access-Control-Max-Age': '86400'
            },
            'body': ''
        }
    
    dsn = os.environ.get('DATABASE_URL')
    schema = 't_p42286306_app_development_proj'
    
    conn = psycopg2.connect(dsn)
    conn.autocommit = True
    cursor = conn.cursor()
    
    try:
        if method == 'GET':
            params = event.get('queryStringParameters', {})
            subject = params.get('subject', '')
            user_id = params.get('userId', '')
            
            cursor.execute(
                f"SELECT COUNT(*) FROM {schema}.lesson_likes WHERE subject = '{subject}'"
            )
            likes_count = cursor.fetchone()[0]
            
            has_liked = False
            if user_id:
                cursor.execute(
                    f"SELECT COUNT(*) FROM {schema}.lesson_likes WHERE subject = '{subject}' AND user_id = {user_id}"
                )
                has_liked = cursor.fetchone()[0] > 0
            
            return {
                'statusCode': 200,
                'headers': {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': '*'
                },
                'isBase64Encoded': False,
                'body': json.dumps({'likes': likes_count, 'hasLiked': has_liked})
            }
        
        elif method == 'POST':
            body_data = json.loads(event.get('body', '{}'))
            user_id = body_data.get('userId')
            subject = body_data.get('subject')
            action = body_data.get('action', 'like')
            
            if action == 'like':
                cursor.execute(
                    f"INSERT INTO {schema}.lesson_likes (user_id, subject) VALUES ({user_id}, '{subject}') ON CONFLICT (user_id, subject) DO NOTHING"
                )
            else:
                cursor.execute(
                    f"DELETE FROM {schema}.lesson_likes WHERE user_id = {user_id} AND subject = '{subject}'"
                )
            
            cursor.execute(
                f"SELECT COUNT(*) FROM {schema}.lesson_likes WHERE subject = '{subject}'"
            )
            likes_count = cursor.fetchone()[0]
            
            return {
                'statusCode': 200,
                'headers': {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': '*'
                },
                'isBase64Encoded': False,
                'body': json.dumps({'likes': likes_count})
            }
        
        return {
            'statusCode': 405,
            'headers': {'Access-Control-Allow-Origin': '*'},
            'body': json.dumps({'error': 'Method not allowed'})
        }
    
    finally:
        cursor.close()
        conn.close()
