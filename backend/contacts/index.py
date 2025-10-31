import json
import os
import psycopg2
from typing import Dict, Any

def handler(event: Dict[str, Any], context: Any) -> Dict[str, Any]:
    '''
    Business: Manage contacts - get all, create, update, delete
    Args: event with httpMethod, body, queryStringParameters
          context with request_id, function_name
    Returns: HTTP response with contacts data
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
            "SELECT id, name, phone, role, created_at FROM contacts ORDER BY created_at DESC"
        )
        rows = cur.fetchall()
        
        contacts_list = []
        for row in rows:
            contacts_list.append({
                'id': row[0],
                'name': row[1],
                'phone': row[2],
                'role': row[3],
                'createdAt': row[4].isoformat()
            })
        
        cur.close()
        conn.close()
        
        return {
            'statusCode': 200,
            'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
            'body': json.dumps({'contacts': contacts_list}),
            'isBase64Encoded': False
        }
    
    elif method == 'POST':
        body_str = event.get('body', '{}')
        body = json.loads(body_str)
        
        name = body.get('name', '').strip()
        phone = body.get('phone', '').strip()
        role = body.get('role', '').strip()
        
        if not name or not phone or not role:
            cur.close()
            conn.close()
            return {
                'statusCode': 400,
                'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                'body': json.dumps({'error': 'Name, phone and role required'}),
                'isBase64Encoded': False
            }
        
        if role not in ['ученик', 'админ', 'учитель']:
            cur.close()
            conn.close()
            return {
                'statusCode': 400,
                'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                'body': json.dumps({'error': 'Role must be ученик, админ or учитель'}),
                'isBase64Encoded': False
            }
        
        cur.execute(
            "INSERT INTO contacts (name, phone, role) VALUES (%s, %s, %s) RETURNING id, created_at",
            (name, phone, role)
        )
        
        result = cur.fetchone()
        contact_id = result[0]
        created_at = result[1]
        
        conn.commit()
        cur.close()
        conn.close()
        
        return {
            'statusCode': 201,
            'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
            'body': json.dumps({
                'success': True,
                'contact': {
                    'id': contact_id,
                    'name': name,
                    'phone': phone,
                    'role': role,
                    'createdAt': created_at.isoformat()
                }
            }),
            'isBase64Encoded': False
        }
    
    elif method == 'PUT':
        body_str = event.get('body', '{}')
        body = json.loads(body_str)
        
        contact_id = body.get('id')
        name = body.get('name', '').strip()
        phone = body.get('phone', '').strip()
        role = body.get('role', '').strip()
        
        if not contact_id or not name or not phone or not role:
            cur.close()
            conn.close()
            return {
                'statusCode': 400,
                'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                'body': json.dumps({'error': 'ID, name, phone and role required'}),
                'isBase64Encoded': False
            }
        
        if role not in ['ученик', 'админ', 'учитель']:
            cur.close()
            conn.close()
            return {
                'statusCode': 400,
                'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                'body': json.dumps({'error': 'Role must be ученик, админ or учитель'}),
                'isBase64Encoded': False
            }
        
        cur.execute(
            "UPDATE contacts SET name = %s, phone = %s, role = %s WHERE id = %s",
            (name, phone, role, contact_id)
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
        contact_id = query_params.get('id')
        
        if not contact_id:
            cur.close()
            conn.close()
            return {
                'statusCode': 400,
                'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                'body': json.dumps({'error': 'ID required'}),
                'isBase64Encoded': False
            }
        
        cur.execute(
            "DELETE FROM contacts WHERE id = %s",
            (int(contact_id),)
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
