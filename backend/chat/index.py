import json
import os
import psycopg2
from typing import Dict, Any, List

def handler(event: Dict[str, Any], context: Any) -> Dict[str, Any]:
    '''
    Business: Chat messages API - send and retrieve messages
    Args: event with httpMethod (GET for retrieve, POST for send), body with message data
    Returns: HTTP response with messages array or success status
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
            'body': '',
            'isBase64Encoded': False
        }
    
    db_url = os.environ.get('DATABASE_URL')
    conn = psycopg2.connect(db_url)
    cur = conn.cursor()
    
    if method == 'GET':
        query_params = event.get('queryStringParameters') or {}
        limit = int(query_params.get('limit', 100))
        
        cur.execute(
            "SELECT id, username, message, created_at FROM messages ORDER BY created_at DESC LIMIT %s",
            (limit,)
        )
        
        rows = cur.fetchall()
        messages = []
        for row in rows:
            messages.append({
                'id': row[0],
                'username': row[1],
                'message': row[2],
                'createdAt': row[3].isoformat()
            })
        
        messages.reverse()
        
        cur.close()
        conn.close()
        
        return {
            'statusCode': 200,
            'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
            'body': json.dumps({'messages': messages}),
            'isBase64Encoded': False
        }
    
    elif method == 'POST':
        body_str = event.get('body', '{}')
        body = json.loads(body_str)
        
        user_id = body.get('userId')
        username = body.get('username', '').strip()
        message = body.get('message', '').strip()
        
        if not user_id or not username or not message:
            cur.close()
            conn.close()
            return {
                'statusCode': 400,
                'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                'body': json.dumps({'error': 'userId, username and message required'}),
                'isBase64Encoded': False
            }
        
        if len(message) > 1000:
            cur.close()
            conn.close()
            return {
                'statusCode': 400,
                'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                'body': json.dumps({'error': 'Message too long (max 1000 characters)'}),
                'isBase64Encoded': False
            }
        
        cur.execute(
            "INSERT INTO messages (user_id, username, message) VALUES (%s, %s, %s) RETURNING id, created_at",
            (user_id, username, message)
        )
        
        result = cur.fetchone()
        message_id = result[0]
        created_at = result[1]
        
        conn.commit()
        cur.close()
        conn.close()
        
        return {
            'statusCode': 201,
            'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
            'body': json.dumps({
                'success': True,
                'message': {
                    'id': message_id,
                    'username': username,
                    'message': message,
                    'createdAt': created_at.isoformat()
                }
            }),
            'isBase64Encoded': False
        }
    
    cur.close()
    conn.close()
    
    return {
        'statusCode': 405,
        'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
        'body': json.dumps({'error': 'Method not allowed'}),
        'isBase64Encoded': False
    }
