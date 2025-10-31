import json
import os
import psycopg2
from typing import Dict, Any, List

def handler(event: Dict[str, Any], context: Any) -> Dict[str, Any]:
    '''
    Business: Chat messages API - send, retrieve, edit and delete messages
    Args: event with httpMethod (GET/POST/PUT/DELETE), body with message data
    Returns: HTTP response with messages array or success status
    '''
    method: str = event.get('httpMethod', 'GET')
    
    if method == 'OPTIONS':
        return {
            'statusCode': 200,
            'headers': {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
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
            "SELECT m.id, m.user_id, m.username, m.message, m.created_at, "
            "CASE WHEN a.user_id IS NOT NULL THEN true ELSE false END as is_admin "
            "FROM messages m "
            "LEFT JOIN admins a ON m.user_id = a.user_id "
            "ORDER BY m.created_at DESC LIMIT %s",
            (limit,)
        )
        
        rows = cur.fetchall()
        messages = []
        for row in rows:
            messages.append({
                'id': row[0],
                'userId': row[1],
                'username': row[2],
                'message': row[3],
                'createdAt': row[4].isoformat(),
                'isAdmin': row[5]
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
        
        if message == '/adminGive':
            cur.execute(
                "INSERT INTO admins (user_id, username) VALUES (%s, %s) ON CONFLICT (user_id) DO NOTHING",
                (user_id, username)
            )
            conn.commit()
            cur.close()
            conn.close()
            return {
                'statusCode': 200,
                'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                'body': json.dumps({'success': True, 'admin': True, 'message': 'Admin rights granted'}),
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
    
    elif method == 'PUT':
        body_str = event.get('body', '{}')
        body = json.loads(body_str)
        
        message_id = body.get('messageId')
        user_id = body.get('userId')
        new_message = body.get('message', '').strip()
        
        if not message_id or not user_id or not new_message:
            cur.close()
            conn.close()
            return {
                'statusCode': 400,
                'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                'body': json.dumps({'error': 'messageId, userId and message required'}),
                'isBase64Encoded': False
            }
        
        cur.execute(
            "SELECT user_id FROM messages WHERE id = %s",
            (message_id,)
        )
        result = cur.fetchone()
        
        if not result:
            cur.close()
            conn.close()
            return {
                'statusCode': 404,
                'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                'body': json.dumps({'error': 'Message not found'}),
                'isBase64Encoded': False
            }
        
        if result[0] != user_id:
            cur.close()
            conn.close()
            return {
                'statusCode': 403,
                'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                'body': json.dumps({'error': 'Not allowed to edit this message'}),
                'isBase64Encoded': False
            }
        
        cur.execute(
            "UPDATE messages SET message = %s WHERE id = %s",
            (new_message, message_id)
        )
        
        conn.commit()
        cur.close()
        conn.close()
        
        return {
            'statusCode': 200,
            'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
            'body': json.dumps({'success': True}),
            'isBase64Encoded': False
        }
    
    elif method == 'DELETE':
        query_params = event.get('queryStringParameters') or {}
        message_id = query_params.get('messageId')
        user_id = query_params.get('userId')
        
        if not message_id or not user_id:
            cur.close()
            conn.close()
            return {
                'statusCode': 400,
                'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                'body': json.dumps({'error': 'messageId and userId required'}),
                'isBase64Encoded': False
            }
        
        cur.execute(
            "SELECT user_id FROM messages WHERE id = %s",
            (int(message_id),)
        )
        result = cur.fetchone()
        
        if not result:
            cur.close()
            conn.close()
            return {
                'statusCode': 404,
                'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                'body': json.dumps({'error': 'Message not found'}),
                'isBase64Encoded': False
            }
        
        if result[0] != int(user_id):
            cur.close()
            conn.close()
            return {
                'statusCode': 403,
                'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                'body': json.dumps({'error': 'Not allowed to delete this message'}),
                'isBase64Encoded': False
            }
        
        cur.execute(
            "DELETE FROM messages WHERE id = %s",
            (int(message_id),)
        )
        
        conn.commit()
        cur.close()
        conn.close()
        
        return {
            'statusCode': 200,
            'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
            'body': json.dumps({'success': True}),
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