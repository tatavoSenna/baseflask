import json


def get_user(mysql, email, password):
    conn = mysql.connect()
    cursor = conn.cursor()

    cursor.execute("""
        SELECT id, name, surname, group_id
        FROM user
        WHERE email = %s AND password = %s
    """, (email, password))
    response = cursor.fetchall()

    cursor.close()
    conn.close()
    return response


def get_documents(mysql, group_id, *id):
    conn = mysql.connect()
    cursor = conn.cursor()
    sql = """
        SELECT *
        FROM document
        WHERE group_id = %s
    """
    variables = (group_id)

    if id:
        sql += ' AND id = %s'
        variables = (group_id, id)

    cursor.execute(sql, variables)
    response = cursor.fetchall()

    cursor.close()
    conn.close()

    return response


def get_logs(mysql, group_id):
    conn = mysql.connect()
    cursor = conn.cursor()

    cursor.execute("""
        SELECT l.*, d.name, d.filename
        FROM log l
        JOIN document d ON d.id = l.document_id
        WHERE l.group_id = %s
        ORDER BY l.created_at DESC
        LIMIT 5
    """, (group_id))
    response = cursor.fetchall()

    cursor.close()
    conn.close()
    return response


def create_log(mysql, group_id, user_id, document, questions):
    conn = mysql.connect()
    cursor = conn.cursor()
    sql = """
        INSERT INTO log (group_id, user_id, document_id, questions, created_at)
        VALUES (%s, %s, %s, %s, NOW())
    """

    # Transform json into text
    questions = json.dumps(questions)

    cursor.execute(sql, (group_id, user_id, document, questions))
    conn.commit()

    cursor.close()
    conn.close()

    return
