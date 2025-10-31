import json
import os
import psycopg2
from typing import Dict, Any

def handler(event: Dict[str, Any], context: Any) -> Dict[str, Any]:
    '''
    Business: Manage news - get all, create, update, delete
    Args: event with httpMethod, body, queryStringParameters
          context with request_id, function_name
    Returns: HTTP response with news data
    '''
    method: str = event.get('httpMethod', 'GET')
    
    if method == 'OPTIONS':
        return {
            'statusCode': 200,
            'headers': {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
                'Access-Control-Allow-Headers': 'Content-Type, X-User-Id',
                'Access-Control-Max-Age': '86400'
            },
            'body': ''
        }
    
    dsn = os.environ.get('DATABASE_URL')
    conn = psycopg2.connect(dsn)
    cur = conn.cursor()
    
    if method == 'GET':
        cur.execute(
            "SELECT id, title, content, created_at, updated_at FROM news ORDER BY created_at DESC"
        )
        rows = cur.fetchall()
        
        news_list = []
        for row in rows:
            news_list.append({
                'id': row[0],
                'title': row[1],
                'content': row[2],
                'createdAt': row[3].isoformat(),
                'updatedAt': row[4].isoformat()
            })
        
        cur.close()
        conn.close()
        
        return {
            'statusCode': 200,
            'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
            'body': json.dumps({'news': news_list}),
            'isBase64Encoded': False
        }
    
    elif method == 'POST':
        body_str = event.get('body', '{}')
        body = json.loads(body_str)
        
        title = body.get('title', '').strip()
        content = body.get('content', '').strip()
        
        if not title or not content:
            cur.close()
            conn.close()
            return {
                'statusCode': 400,
                'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                'body': json.dumps({'error': 'Title and content required'}),
                'isBase64Encoded': False
            }
        
        cur.execute(
            "INSERT INTO news (title, content) VALUES (%s, %s) RETURNING id, created_at, updated_at",
            (title, content)
        )
        
        result = cur.fetchone()
        news_id = result[0]
        created_at = result[1]
        updated_at = result[2]
        
        conn.commit()
        cur.close()
        conn.close()
        
        return {
            'statusCode': 201,
            'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
            'body': json.dumps({
                'success': True,
                'news': {
                    'id': news_id,
                    'title': title,
                    'content': content,
                    'createdAt': created_at.isoformat(),
                    'updatedAt': updated_at.isoformat()
                }
            }),
            'isBase64Encoded': False
        }
    
    elif method == 'PUT':
        body_str = event.get('body', '{}')
        body = json.loads(body_str)
        
        news_id = body.get('id')
        title = body.get('title', '').strip()
        content = body.get('content', '').strip()
        
        if not news_id or not title or not content:
            cur.close()
            conn.close()
            return {
                'statusCode': 400,
                'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                'body': json.dumps({'error': 'ID, title and content required'}),
                'isBase64Encoded': False
            }
        
        cur.execute(
            "UPDATE news SET title = %s, content = %s, updated_at = CURRENT_TIMESTAMP WHERE id = %s",
            (title, content, news_id)
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
        news_id = query_params.get('id')
        
        if not news_id:
            cur.close()
            conn.close()
            return {
                'statusCode': 400,
                'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                'body': json.dumps({'error': 'ID required'}),
                'isBase64Encoded': False
            }
        
        cur.execute(
            "DELETE FROM news WHERE id = %s",
            (int(news_id),)
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
