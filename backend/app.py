from flask import Flask, request, jsonify
from flask_cors import CORS
import mysql.connector

app = Flask(__name__)
CORS(app)

def get_db_connection():
    return mysql.connector.connect(
        host="localhost",
        user="root",
        password="Cenyonny1976",
        database="task_db"
    )

# GET all tasks for DEBUGGING

@app.route("/api/tasks", methods=["GET"])
def get_tasks():
    conn = get_db_connection()
    cursor = conn.cursor(dictionary=True)

    cursor.execute("SELECT * FROM tasks")
    tasks = cursor.fetchall()

    cursor.close()
    conn.close()

    return jsonify(tasks)

# INSERT task

@app.route("/api/tasks", methods=["POST"])
def insert_task():
    data = request.get_json()

    if not data or "name" not in data:
        return jsonify({"error": "Task name is required"}), 400

    name = data["name"]
    dueDate = data.get("dueDate")  # optional, can be None

    conn = get_db_connection()
    cursor = conn.cursor()

    sql = "INSERT INTO Tasks (name, dueDate) VALUES (%s, %s)"
    cursor.execute(sql, (name, dueDate))
    conn.commit()

    cursor.close()
    conn.close()

    return jsonify({"message": "Task inserted"}), 201

if __name__ == "__main__":
    app.run(debug=True)